import type { VercelRequest, VercelResponse } from '@vercel/node'

/*
 * Fonction serverless : traduit une envie en langage naturel en FILTRES de
 * recherche structurés, via un LLM. Le LLM n'invente jamais d'événement — il
 * ne fait que produire des filtres, ensuite appliqués à la vraie API Paris.
 *
 * La clé OpenAI vit UNIQUEMENT ici, côté serveur (variable d'env Vercel
 * OPENAI_API_KEY). Sans clé, on répond `not_configured` : le front dégrade
 * proprement, le déploiement reste fonctionnel sans secret.
 */

// Doit rester aligné avec src/features/events/constants.ts (CATEGORIES).
const CATEGORIES = [
  'Concert',
  'Festival',
  'Exposition',
  'Théâtre',
  'Spectacle',
  'Danse',
  'Cinéma',
  'Atelier',
  'Visite guidée',
  'Balade urbaine',
  'Conférence',
  'Animation',
  'Brocante',
  'Loisirs',
]

const SYSTEM_PROMPT = `Tu es l'assistant de « Parici », un moteur de recherche d'événements culturels à Paris.
Ta tâche : traduire l'envie de l'utilisateur en FILTRES de recherche structurés.
Tu n'inventes JAMAIS d'événement, tu ne renvoies que des filtres.

Réponds UNIQUEMENT par un objet JSON valide, sans texte autour, avec ces clés :
- "q": chaîne de mots-clés libres en français pour la recherche plein texte (ex. "jazz", "impressionnisme"), ou "" si rien de pertinent.
- "category": UNE catégorie EXACTEMENT parmi : ${CATEGORIES.join(', ')}. Sinon "".
- "price": "all", "gratuit" ou "payant".
- "arrondissement": un entier de 1 à 20, ou null si non précisé.
- "explanation": une phrase courte en français décrivant la recherche traduite (ex. "Concerts gratuits dans le 11e arrondissement").`

interface AiFilters {
  q: string
  category: string
  price: 'all' | 'gratuit' | 'payant'
  arrondissement: number | null
}

/** Ne jamais faire confiance au LLM : on borne chaque valeur. */
function sanitizeFilters(raw: Record<string, unknown>): AiFilters {
  const price =
    raw.price === 'gratuit' || raw.price === 'payant' ? raw.price : 'all'

  const category =
    typeof raw.category === 'string' && CATEGORIES.includes(raw.category)
      ? raw.category
      : ''

  const arrValue = Number(raw.arrondissement)
  const arrondissement =
    Number.isInteger(arrValue) && arrValue >= 1 && arrValue <= 20
      ? arrValue
      : null

  const q = typeof raw.q === 'string' ? raw.q.slice(0, 120).trim() : ''

  return { q, category, price, arrondissement }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method_not_allowed' })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    // Pas de clé configurée : le front affichera un message dédié.
    res.status(200).json({ ok: false, reason: 'not_configured' })
    return
  }

  const body = req.body as { prompt?: unknown } | undefined
  const prompt =
    typeof body?.prompt === 'string' ? body.prompt.slice(0, 400).trim() : ''
  if (!prompt) {
    res.status(400).json({ ok: false, reason: 'empty_prompt' })
    return
  }

  try {
    const completion = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
        }),
      },
    )

    if (!completion.ok) {
      res.status(502).json({ ok: false, reason: 'upstream_error' })
      return
    }

    const data = (await completion.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const content = data.choices?.[0]?.message?.content
    if (typeof content !== 'string') {
      res.status(502).json({ ok: false, reason: 'upstream_error' })
      return
    }

    const parsed = JSON.parse(content) as Record<string, unknown>
    const explanation =
      typeof parsed.explanation === 'string' ? parsed.explanation : null

    res
      .status(200)
      .json({ ok: true, filters: sanitizeFilters(parsed), explanation })
  } catch {
    res.status(502).json({ ok: false, reason: 'upstream_error' })
  }
}
