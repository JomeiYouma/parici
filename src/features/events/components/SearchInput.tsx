import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'

import { applyFilters } from '../filters'

/**
 * Champ de recherche. Saisie locale → debounce 300 ms → `setSearchParams`
 * (replace, pour ne pas polluer l'historique à chaque frappe). L'URL reste la
 * source de vérité ; le champ se resynchronise UNIQUEMENT si l'URL change de
 * l'extérieur (reset, lien partagé) — jamais en réponse à notre propre écriture,
 * sinon une frappe arrivée pendant un rafraîchissement serait écrasée.
 */
export function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const [value, setValue] = useState(urlQuery)
  const debounced = useDebouncedValue(value, 300)

  // Dernière valeur que CE champ a synchronisée avec l'URL : sert à distinguer
  // nos propres mises à jour d'un changement d'URL venu d'ailleurs.
  const lastSynced = useRef(urlQuery)

  // Pousse la valeur debouncée vers l'URL quand elle diffère de la dernière sync.
  useEffect(() => {
    if (debounced === lastSynced.current) return
    lastSynced.current = debounced
    setSearchParams((prev) => applyFilters(prev, { q: debounced }), {
      replace: true,
    })
  }, [debounced, setSearchParams])

  // N'adopte la valeur de l'URL que si elle est externe (≠ ce qu'on a poussé).
  // Évite d'effacer une saisie en cours pendant que la liste se rafraîchit.
  useEffect(() => {
    if (urlQuery !== lastSynced.current) {
      lastSynced.current = urlQuery
      setValue(urlQuery)
    }
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
