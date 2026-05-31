import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { DomainEvent } from '@/features/events/types'
import { stripHtml } from '@/shared/lib/stripHtml'

/**
 * Instantané léger d'un événement mis en favori. On stocke juste de quoi rendre
 * la liste des favoris hors-ligne, sans dépendre d'un nouvel appel réseau.
 */
export interface FavoriteEvent {
  id: string
  title: string
  image: { url: string; alt: string } | null
  dateLabel: string | null
  isFree: boolean
  categories: string[]
  arrondissement: number | null
  addedAt: number
}

interface FavoritesState {
  items: Record<string, FavoriteEvent>
  toggle: (event: DomainEvent) => void
  remove: (id: string) => void
  clear: () => void
}

function toSnapshot(event: DomainEvent, addedAt: number): FavoriteEvent {
  return {
    id: event.id,
    title: event.title,
    image: event.image,
    dateLabel: event.dateLabel,
    isFree: event.isFree,
    categories: event.categories,
    arrondissement: event.place.arrondissement,
    addedAt,
  }
}

/**
 * Store des favoris persisté en localStorage. Le toggle est synchrone : le cœur
 * de l'UI réagit immédiatement (optimistic update), sans appel réseau (cf. §4).
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      items: {},
      toggle: (event) =>
        set((state) => {
          const next = { ...state.items }
          if (next[event.id]) {
            delete next[event.id]
          } else {
            // Date.now() est volontairement appelé ici (effet utilisateur réel).
            next[event.id] = toSnapshot(event, Date.now())
          }
          return { items: next }
        }),
      remove: (id) =>
        set((state) => {
          if (!state.items[id]) return state
          const next = { ...state.items }
          delete next[id]
          return { items: next }
        }),
      clear: () => set({ items: {} }),
    }),
    {
      name: 'parici:favorites',
      version: 2,
      // Les favoris d'avant le nettoyage HTML peuvent contenir des balises
      // (ex. « <br /> » dans le libellé de date) : on les assainit au chargement.
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as {
          items?: Record<string, FavoriteEvent>
        }
        if (version < 2 && state.items) {
          const items: Record<string, FavoriteEvent> = {}
          for (const [id, fav] of Object.entries(state.items)) {
            items[id] = {
              ...fav,
              title: stripHtml(fav.title),
              dateLabel: fav.dateLabel ? stripHtml(fav.dateLabel) : null,
            }
          }
          return { items } as FavoritesState
        }
        return state as FavoritesState
      },
    },
  ),
)

/** Sélecteur ciblé : ne re-rend que si CE favori change (perf). */
export function useIsFavorite(id: string): boolean {
  return useFavoritesStore((state) => Boolean(state.items[id]))
}

/** Nombre total de favoris (badge header). */
export function useFavoritesCount(): number {
  return useFavoritesStore((state) => Object.keys(state.items).length)
}
