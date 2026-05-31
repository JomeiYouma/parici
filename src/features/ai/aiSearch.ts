import { CATEGORIES, type PriceFilter } from '@/features/events/constants'

/** Filtres proposés par l'IA, déjà bornés au domaine. */
export interface AiFilters {
  q: string
  category: string
  price: PriceFilter
  arrondissement: number | null
}

export type AiSearchResult =
  | { status: 'ok'; filters: AiFilters; explanation: string | null }
  | { status: 'not_configured' }
  | { status: 'error'; message: string }

const PRICES: PriceFilter[] = ['all', 'gratuit', 'payant']

/** Défense côté client : on revalide ce que renvoie le serveur. */
function normalize(raw: Record<string, unknown>): AiFilters {
  const price = PRICES.includes(raw.price as PriceFilter)
    ? (raw.price as PriceFilter)
    : 'all'
  const category =
    typeof raw.category === 'string' &&
    (CATEGORIES as readonly string[]).includes(raw.category)
      ? raw.category
      : ''
  const arr = Number(raw.arrondissement)
  const arrondissement =
    Number.isInteger(arr) && arr >= 1 && arr <= 20 ? arr : null
  const q = typeof raw.q === 'string' ? raw.q.trim() : ''
  return { q, category, price, arrondissement }
}

/**
 * Demande au backend de traduire une envie en filtres. Ne lève jamais : tous les
 * cas (non configuré, indispo en local, erreur réseau) sont renvoyés en statut.
 */
export async function requestAiFilters(
  prompt: string,
): Promise<AiSearchResult> {
  let response: Response
  try {
    response = await fetch('/api/ai-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
  } catch {
    return { status: 'error', message: 'Impossible de contacter la recherche IA.' }
  }

  // 404 = fonction serverless absente (dev local sans `vercel dev`) : du point de
  // vue utilisateur, l'IA n'est pas opérationnelle → même message que sans clé.
  if (response.status === 404) {
    return { status: 'not_configured' }
  }

  if (!response.ok) {
    return {
      status: 'error',
      message: 'La recherche IA est momentanément indisponible.',
    }
  }

  const data = (await response.json()) as {
    ok: boolean
    reason?: string
    filters?: Record<string, unknown>
    explanation?: string | null
  }

  if (!data.ok) {
    if (data.reason === 'not_configured') return { status: 'not_configured' }
    return {
      status: 'error',
      message: 'La recherche IA est momentanément indisponible.',
    }
  }

  return {
    status: 'ok',
    filters: normalize(data.filters ?? {}),
    explanation: data.explanation ?? null,
  }
}

/** L'IA est masquée si explicitement désactivée (VITE_AI_ENABLED="false"). */
export function isAiEnabled(): boolean {
  return import.meta.env.VITE_AI_ENABLED !== 'false'
}
