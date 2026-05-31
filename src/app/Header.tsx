import { Heart } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

import { useFavoritesCount } from '@/features/favorites/store'
import { cn } from '@/shared/lib/utils'

/** En-tête collant : marque à gauche, accès favoris à droite. */
export function Header() {
  const favoritesCount = useFavoritesCount()

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-magenta"
        >
          <img
            src="/favicon.svg"
            alt=""
            width="36"
            height="36"
            className="size-9 transition-transform group-hover:-rotate-6"
          />
          <span className="font-display text-xl font-semibold tracking-tight">
            Parici
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/favoris"
            className={({ isActive }) =>
              cn(
                'inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-magenta/10 text-magenta-strong'
                  : 'text-navy hover:bg-navy/5',
              )
            }
          >
            <Heart className="size-4" aria-hidden />
            <span className="hidden sm:inline">Favoris</span>
            {favoritesCount > 0 && (
              <span
                className="grid min-w-5 place-items-center rounded-full bg-magenta px-1.5 text-xs font-semibold text-white"
                aria-label={`${favoritesCount} favoris`}
              >
                {favoritesCount}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
