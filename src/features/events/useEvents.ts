import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

import { fetchEvents } from './api'
import { parseFilters, type EventFilters } from './filters'

/** Clé de cache stable : sérialise les filtres dans un ordre déterministe. */
export function eventsQueryKey(filters: EventFilters) {
  return [
    'events',
    {
      q: filters.q,
      category: filters.category,
      price: filters.price,
      arrondissement: filters.arrondissement,
      page: filters.page,
    },
  ] as const
}

/**
 * Source de vérité = URL. Le hook lit les `searchParams`, en dérive les filtres
 * et la clé de cache, puis délègue le fetch/cache/retry à TanStack Query.
 * `keepPreviousData` évite le clignotement de la liste lors d'un changement de
 * page ou de filtre (transition douce).
 */
export function useEvents() {
  const [searchParams] = useSearchParams()
  const filters = parseFilters(searchParams)

  const query = useQuery({
    queryKey: eventsQueryKey(filters),
    queryFn: ({ signal }) => fetchEvents(filters, signal),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })

  return { ...query, filters }
}
