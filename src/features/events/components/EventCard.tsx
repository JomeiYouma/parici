import { CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { FavoriteButton } from '@/features/favorites/FavoriteButton'
import { Badge } from '@/shared/ui/badge'

import { formatEventDate, formatPlace } from '../format'
import type { DomainEvent } from '../types'

/** Carte d'événement de la grille. Toute la surface est cliquable. */
export function EventCard({ event }: { event: DomainEvent }) {
  const dateLabel = formatEventDate(event)
  const place = formatPlace(event)
  const category = event.categories[0]

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-surface-border bg-surface shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-md motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[16/10] overflow-hidden bg-navy/5">
        {event.image ? (
          <img
            src={event.image.url}
            alt={event.image.alt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="grid size-full place-items-center text-navy/30">
            <MapPin className="size-10" aria-hidden />
          </div>
        )}

        {/* z-10 pour passer au-dessus de l'overlay de lien du titre */}
        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton event={event} />
        </div>

        {event.isFree && (
          <div className="absolute left-3 top-3">
            <Badge variant="free">Gratuit</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {category && (
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="category">{category}</Badge>
          </div>
        )}

        <h3 className="font-display text-lg font-semibold leading-snug">
          <Link
            to={`/event/${event.id}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            <span className="line-clamp-2">{event.title}</span>
          </Link>
        </h3>

        {event.summary && (
          <p className="line-clamp-2 text-sm text-ink-muted">{event.summary}</p>
        )}

        <div className="mt-auto space-y-1.5 pt-1 text-sm text-ink-muted">
          {dateLabel && (
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-coral" aria-hidden />
              <span className="line-clamp-1">{dateLabel}</span>
            </p>
          )}
          {place && (
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-coral" aria-hidden />
              <span className="line-clamp-1">{place}</span>
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
