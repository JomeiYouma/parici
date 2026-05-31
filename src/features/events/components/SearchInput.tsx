import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'

import { applyFilters } from '../filters'

/**
 * Champ de recherche. Saisie locale → debounce 300 ms → `setSearchParams`
 * (replace, pour ne pas polluer l'historique à chaque frappe). L'URL reste la
 * source de vérité ; le champ se resynchronise si l'URL change (ex. reset).
 */
export function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const [value, setValue] = useState(urlQuery)
  const debounced = useDebouncedValue(value, 300)

  // Pousse la valeur debouncée vers l'URL quand elle diffère.
  useEffect(() => {
    setSearchParams(
      (prev) => {
        if (debounced === (prev.get('q') ?? '')) return prev
        return applyFilters(prev, { q: debounced })
      },
      { replace: true },
    )
  }, [debounced, setSearchParams])

  // Resynchronise le champ si l'URL change de l'extérieur (reset, lien partagé).
  useEffect(() => {
    setValue(urlQuery)
  }, [urlQuery])

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher un concert, une expo, un spectacle…"
        aria-label="Rechercher un événement"
        className="h-12 w-full rounded-full border border-surface-border bg-surface pl-12 pr-11 text-base text-navy shadow-sm outline-none transition-colors placeholder:text-ink-muted/80 focus:border-magenta focus-visible:outline-2 focus-visible:outline-magenta"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="Effacer la recherche"
          className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-muted transition-colors hover:bg-navy/5 hover:text-navy"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
