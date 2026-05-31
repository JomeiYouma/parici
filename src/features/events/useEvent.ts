import { useQuery } from '@tanstack/react-query'

import { fetchEventById } from './api'

/** Charge un événement unique (page détail `/event/:id`). */
export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: ({ signal }) => fetchEventById(id as string, signal),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}
