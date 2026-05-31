import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import { EmptyState, ErrorState } from '@/shared/ui/states'

import { PAGE_SIZE } from '../constants'
import type { DomainEvent } from '../types'
import { EventCard } from './EventCard'
import { EventCardSkeleton } from './EventCardSkeleton'

interface EventListProps {
  events: DomainEvent[]
  /** Premier chargement (aucune donnée en cache à afficher). */
  isPending: boolean
  isError: boolean
  onRetry: () => void
  emptyAction?: ReactNode
}

const GRID_CLASS = 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'

export function EventList({
  events,
  isPending,
  isError,
  onRetry,
  emptyAction,
}: EventListProps) {
  const reduceMotion = useReducedMotion()

  if (isError && events.length === 0) return <ErrorState onRetry={onRetry} />

  if (isPending) {
    return (
      <div className={GRID_CLASS} aria-hidden>
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return <EmptyState action={emptyAction} />
  }

  return (
    <motion.ul
      className={GRID_CLASS}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.05 } },
      }}
    >
      {events.map((event) => (
        <motion.li
          key={event.id}
          variants={{
            hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <EventCard event={event} />
        </motion.li>
      ))}
    </motion.ul>
  )
}
