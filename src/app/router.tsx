import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { HomePage } from '@/pages/HomePage'

import { Layout } from './Layout'
import { RouteFallback } from './RouteFallback'

// Routes secondaires chargées à la demande (bundle initial allégé).
const EventDetailPage = lazy(() =>
  import('@/pages/EventDetailPage').then((m) => ({
    default: m.EventDetailPage,
  })),
)
const FavoritesPage = lazy(() =>
  import('@/pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function lazyRoute(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'event/:id', element: lazyRoute(<EventDetailPage />) },
      { path: 'favoris', element: lazyRoute(<FavoritesPage />) },
      { path: '*', element: lazyRoute(<NotFoundPage />) },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
