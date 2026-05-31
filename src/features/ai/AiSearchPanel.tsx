import { Info, Loader2, Sparkles, WandSparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'

import { applyFilters } from '@/features/events/filters'
import { Button } from '@/shared/ui/button'

import { isAiEnabled, requestAiFilters } from './aiSearch'

const SUGGESTIONS = [
  'Un concert gratuit ce week-end',
  'Une expo d’art contemporain dans le Marais',
  'Une sortie en famille pas chère',
]

type PanelState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'done'; explanation: string | null }
  | { kind: 'notice'; message: string }

export function AiSearchPanel() {
  const [, setSearchParams] = useSearchParams()
  const [prompt, setPrompt] = useState('')
  const [state, setState] = useState<PanelState>({ kind: 'idle' })

  if (!isAiEnabled()) return null

  const run = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || state.kind === 'loading') return
    setState({ kind: 'loading' })

    const result = await requestAiFilters(trimmed)

    if (result.status === 'ok') {
      setSearchParams((prev) => applyFilters(prev, result.filters))
      setState({ kind: 'done', explanation: result.explanation })
    } else if (result.status === 'not_configured') {
      setState({
        kind: 'notice',
        message:
          'Démo : cette recherche par IA nécessite une clé OpenAI côté serveur, non activée sur ce déploiement. Le code est prêt — il suffit d’ajouter la clé.',
      })
    } else {
      setState({ kind: 'notice', message: result.message })
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void run(prompt)
  }

  const loading = state.kind === 'loading'

  return (
    <section
      aria-label="Recherche par envie (IA)"
      className="rounded-[var(--radius-card)] border border-magenta/20 bg-gradient-to-br from-surface to-magenta/5 p-5 shadow-sm sm:p-6"
    >
      <div className="mb-3 flex items-center gap-2 text-magenta-strong">
        <WandSparkles className="size-5" aria-hidden />
        <h2 className="font-display text-lg font-semibold">
          Pas d’idée&nbsp;? Décrivez votre envie
        </h2>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex. un spectacle de danse gratuit près de Bastille…"
          aria-label="Décrivez l’événement que vous cherchez"
          maxLength={400}
          className="h-12 flex-1 rounded-full border border-surface-border bg-surface px-5 text-base text-navy shadow-sm outline-none transition-colors placeholder:text-ink-muted/80 focus:border-magenta focus-visible:outline-2 focus-visible:outline-magenta"
        />
        <Button type="submit" size="lg" disabled={loading || !prompt.trim()}>
          {loading ? (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? 'Recherche…' : 'Trouver'}
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setPrompt(suggestion)
              void run(suggestion)
            }}
            disabled={loading}
            className="rounded-full border border-surface-border bg-surface px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-coral hover:text-navy disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {state.kind === 'done' && state.explanation && (
        <p
          className="mt-4 flex items-start gap-2 text-sm text-navy"
          aria-live="polite"
        >
          <Sparkles className="mt-0.5 size-4 shrink-0 text-magenta" aria-hidden />
          <span>{state.explanation}</span>
        </p>
      )}

      {state.kind === 'notice' && (
        <p
          className="mt-4 flex items-start gap-2 rounded-xl bg-navy/5 p-3 text-sm text-ink-muted"
          aria-live="polite"
        >
          <Info className="mt-0.5 size-4 shrink-0 text-coral" aria-hidden />
          <span>{state.message}</span>
        </p>
      )}
    </section>
  )
}
