import { Loader2, Search, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'

import { scrollToEvents } from '@/features/events/anchor'
import { applyFilters } from '@/features/events/filters'

import { isAiEnabled, requestAiFilters } from './aiSearch'

/**
 * Recherche par envie, intégrée sobrement dans le hero (remplace le badge).
 * Le LLM traduit l'envie en filtres ; sans clé (ou en cas d'erreur), on dégrade
 * proprement en recherche par mot-clé. Dans tous les cas l'utilisateur obtient
 * des résultats et est amené vers la liste.
 */
export function HeroAiSearch() {
  const [, setSearchParams] = useSearchParams()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [hint, setHint] = useState<string | null>(null)

  const keywordSearch = (text: string) =>
    setSearchParams((prev) =>
      applyFilters(prev, {
        q: text,
        category: '',
        price: 'all',
        arrondissement: null,
      }),
    )

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const text = prompt.trim()
    if (!text || loading) return

    setHint(null)

    if (!isAiEnabled()) {
      keywordSearch(text)
      scrollToEvents()
      return
    }

    setLoading(true)
    const result = await requestAiFilters(text)
    setLoading(false)

    if (result.status === 'ok') {
      setSearchParams((prev) => applyFilters(prev, result.filters))
      setHint(result.explanation)
    } else {
      keywordSearch(text)
      if (result.status === 'not_configured') {
        setHint('Pas de clé OpenAI configurée.')
      }
    }
    scrollToEvents()
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={submit} className="relative">
        <label htmlFor="hero-ai" className="sr-only">
          Décrivez l’événement que vous cherchez
        </label>
        <input
          id="hero-ai"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Décrivez votre envie de sortie…"
          maxLength={400}
          className="h-12 w-full rounded-full border border-surface-border bg-surface/85 pl-12 pr-14 text-base text-navy shadow-sm backdrop-blur outline-none transition-colors placeholder:text-ink-muted focus:border-magenta focus-visible:outline-2 focus-visible:outline-magenta"
        />
        {/* Après l'input dans le DOM (et z-10) pour passer AU-DESSUS de son fond */}
        <Sparkles
          className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 fill-magenta text-magenta"
          aria-hidden
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          aria-label="Lancer la recherche"
          className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-magenta text-white transition-colors hover:bg-magenta-strong focus-visible:outline-2 focus-visible:outline-magenta disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <Search className="size-4" />
          )}
        </button>
      </form>

      {hint && (
        <p className="mt-3 text-sm text-ink-muted" aria-live="polite">
          {hint}
        </p>
      )}
    </div>
  )
}
