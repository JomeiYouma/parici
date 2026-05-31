import { QueryClient } from '@tanstack/react-query'

/** Configuration partagée du cache (stale-while-revalidate, retry maîtrisé). */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})
