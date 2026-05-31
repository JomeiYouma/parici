import {
  Accessibility,
  ArrowLeft,
  CalendarDays,
  Ear,
  ExternalLink,
  Eye,
  MapPin,
  Ticket,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Seo } from '@/app/Seo'
import { formatEventDate, formatPlace } from '@/features/events/format'
import { useEvent } from '@/features/events/useEvent'
import { FavoriteButton } from '@/features/favorites/FavoriteButton'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { EmptyState, ErrorState } from '@/shared/ui/states'

function BackLink() {
  const navigate = useNavigate()
  const location = useLocation()

  // Retour arrière réel : restitue la liste avec ses filtres. Si l'utilisateur
  // est arrivé directement sur la fiche (lien profond, pas d'historique app),
  // location.key vaut 'default' → on retombe proprement sur l'accueil.
  const goBack = () => {
    if (location.key !== 'default') navigate(-1)
    else navigate('/')
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-magenta-strong"
    >
      <ArrowLeft className="size-4" />
      Retour aux événements
    </button>
  )
}

function MetaRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 text-ink-muted">
      <span className="mt-0.5 text-coral">{icon}</span>
      <span className="whitespace-pre-line">{children}</span>
    </p>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="aspect-[16/9] w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-9 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isPending, isError, refetch } = useEvent(id)

  const a11yLabels: { icon: ReactNode; label: string }[] = []
  if (event?.accessibility.reducedMobility)
    a11yLabels.push({
      icon: <Accessibility className="size-4" />,
      label: 'Accès PMR',
    })
  if (event?.accessibility.blind)
    a11yLabels.push({
      icon: <Eye className="size-4" />,
      label: 'Accessible aux personnes aveugles',
    })
  if (event?.accessibility.deaf)
    a11yLabels.push({
      icon: <Ear className="size-4" />,
      label: 'Accessible aux personnes sourdes',
    })

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <BackLink />
      </div>

      {isPending && <DetailSkeleton />}

      {!isPending && isError && <ErrorState onRetry={() => void refetch()} />}

      {!isPending && !isError && !event && (
        <EmptyState
          title="Événement introuvable"
          description="Cet événement n’existe plus ou a été retiré de l’agenda."
          action={
            <Button asChild>
              <Link to="/">Revenir à l’accueil</Link>
            </Button>
          }
        />
      )}

      {event && (
        <>
          <Seo title={event.title} description={event.summary || undefined} />

          {event.image && (
            <img
              src={event.image.url}
              alt={event.image.alt}
              className="mb-6 aspect-[16/9] w-full rounded-[var(--radius-card)] object-cover"
            />
          )}

          <div className="mb-3 flex flex-wrap items-center gap-2">
            {event.isFree && <Badge variant="free">Gratuit</Badge>}
            {event.categories.map((category) => (
              <Badge key={category} variant="category">
                {category}
              </Badge>
            ))}
          </div>

          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {event.title}
            </h1>
            <div className="shrink-0">
              <FavoriteButton event={event} variant="inline" />
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {formatEventDate(event) && (
              <MetaRow icon={<CalendarDays className="size-5" />}>
                {formatEventDate(event)}
              </MetaRow>
            )}
            {formatPlace(event) && (
              <MetaRow icon={<MapPin className="size-5" />}>
                {formatPlace(event)}
                {event.place.street ? `, ${event.place.street}` : ''}
              </MetaRow>
            )}
            {event.priceLabel && (
              <MetaRow icon={<Ticket className="size-5" />}>
                {event.priceLabel}
              </MetaRow>
            )}
          </div>

          {a11yLabels.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {a11yLabels.map((item) => (
                <Badge key={item.label} variant="neutral" size="md">
                  {item.icon}
                  {item.label}
                </Badge>
              ))}
            </div>
          )}

          {event.description && (
            <div className="mt-8 max-w-prose whitespace-pre-line text-[1.05rem] leading-relaxed text-navy/90">
              {event.description}
            </div>
          )}

          {event.sourceUrl && (
            <div className="mt-8">
              <Button asChild size="lg">
                <a
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir la fiche officielle
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>
          )}
        </>
      )}
    </article>
  )
}
