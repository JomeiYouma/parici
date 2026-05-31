import { Heart } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import type { DomainEvent } from '@/features/events/types'
import { cn } from '@/shared/lib/utils'

import { useFavoritesStore, useIsFavorite } from './store'

interface FavoriteButtonProps {
  event: DomainEvent
  /** `floating` = pastille posée sur l'image de la carte. */
  variant?: 'floating' | 'inline'
}

/**
 * Bouton favori. Le toggle est synchrone (optimistic) : le cœur change d'état
 * instantanément. La micro-animation est désactivée si prefers-reduced-motion.
 */
export function FavoriteButton({
  event,
  variant = 'floating',
}: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(event.id)
  const toggle = useFavoritesStore((state) => state.toggle)
  const reduceMotion = useReducedMotion()

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(event)
      }}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Retirer « ${event.title} » des favoris`
          : `Ajouter « ${event.title} » aux favoris`
      }
      className={cn(
        'inline-grid place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-magenta',
        variant === 'floating'
          ? 'size-10 bg-paper/90 text-navy shadow-sm backdrop-blur hover:bg-paper'
          : 'size-11 border border-surface-border bg-surface hover:border-magenta',
      )}
    >
      <motion.span
        key={String(isFavorite)}
        initial={reduceMotion ? false : { scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        className="inline-flex"
      >
        <Heart
          className={cn(
            'size-5 transition-colors',
            isFavorite ? 'fill-magenta text-magenta' : 'text-navy',
          )}
        />
      </motion.span>
    </button>
  )
}
