import { Outlet, ScrollRestoration } from 'react-router-dom'

import { Footer } from './Footer'
import { Header } from './Header'

/** Coquille commune à toutes les routes. */
export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-paper"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/*
        Indexe la position de scroll par pathname : changer un filtre (même
        route, seuls les searchParams varient) ne fait plus remonter en haut.
        Un changement de route réel (ex. /event/:id) garde son scroll propre.
      */}
      <ScrollRestoration getKey={(location) => location.pathname} />
    </div>
  )
}
