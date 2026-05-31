import { Heart, MapPin, X } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Seo } from '@/app/Seo'
import {
  useFavoritesStore,
  type FavoriteEvent,
} from '@/features/favorites/store'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/states'

function FavoriteCard({ favorite }: { favorite: FavoriteEvent }) {
  const remove = useFavoritesStore((state) => state.remove)
  const arr = favorite.arrondissement

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-surface-border bg-surface shadow-sm transition-transform hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[16/10] overflow-hidden bg-navy/5">
        {favorite.image ? (
          <img
            src={favorite.image.url}
            alt={favorite.image.alt}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center text-navy/30">
            <MapPin className="size-10" aria-hidden />
          </div>
        )}
        <button
          type="button"
          onClick={() => remove(favorite.id)}
          aria-label={`Retirer « ${favorite.title} » des favoris`}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-paper/90 text-navy shadow-sm backdrop-blur transition-colors hover:bg-paper hover:text-magenta-strong"
        >
          <X className="size-5" />
        </button>
        {favorite.isFree && (
          <div className="absolute left-3 top-3">
            <Badge variant="free">Gratuit</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {favorite.categories[0] && (
          <Badge variant="category">{favorite.categories[0]}</Badge>
        )}
        <h3 className="font-display text-lg font-semibold leading-snug">
          <Link
            to={`/event/${favorite.id}`}
            className="after:absolute after:inset-0"
          >
            <span className="line-clamp-2">{favorite.title}</span>
          </Link>
        </h3>
        <p className="mt-auto text-sm text-ink-muted">
          {favorite.dateLabel ?? (arr !== null ? `Paris ${arr}e` : 'Paris')}
        </p>
      </div>
    </article>
  )
}

export function FavoritesPage() {
  const items = useFavoritesStore((state) => state.items)
  const favorites = Object.values(items).sort((a, b) => b.addedAt - a.addedAt)

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Seo title="Mes favoris" />

      <header className="mb-8 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-magenta/10 text-magenta-strong">
          <Heart className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">
            Mes favoris
          </h1>
          <p className="text-sm text-ink-muted">
            {favorites.length > 0
              ? `${favorites.length} événement${favorites.length > 1 ? 's' : ''} enregistré${favorites.length > 1 ? 's' : ''}`
              : 'Vos coups de cœur, gardés sur cet appareil'}
          </p>
        </div>
      </header>

      {favorites.length === 0 ? (
        <EmptyState
          title="Aucun favori pour l’instant"
          description="Parcourez les événements et touchez le cœur pour les retrouver ici."
          action={
            <Button asChild>
              <Link to="/">Explorer les événements</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <li key={favorite.id}>
              <FavoriteCard favorite={favorite} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
