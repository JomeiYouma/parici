import { SlidersHorizontal } from 'lucide-react'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Select } from '@/shared/ui/select'
import { cn } from '@/shared/lib/utils'

import { ARRONDISSEMENTS, CATEGORIES, PRICE_OPTIONS } from '../constants'
import {
  applyFilters,
  hasActiveFilters,
  parseFilters,
  type EventFilters,
} from '../filters'

function useFilters(): [EventFilters, (patch: Partial<EventFilters>) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = parseFilters(searchParams)
  const update = useCallback(
    (patch: Partial<EventFilters>) =>
      setSearchParams((prev) => applyFilters(prev, patch)),
    [setSearchParams],
  )
  return [filters, update]
}

/** Segmented control tarif. Actif = magenta foncé (AA sur petit texte). */
function PriceSegment({
  value,
  onChange,
}: {
  value: EventFilters['price']
  onChange: (price: EventFilters['price']) => void
}) {
  return (
    <div
      role="group"
      aria-label="Filtrer par tarif"
      className="inline-flex rounded-full border border-surface-border bg-surface p-1 shadow-sm"
    >
      {PRICE_OPTIONS.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              'h-9 rounded-full px-4 text-sm font-medium transition-colors',
              active
                ? 'bg-magenta-strong text-white'
                : 'text-ink-muted hover:text-navy',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/** Contrôles de filtre, réutilisés en ligne (desktop) et en sheet (mobile). */
function FilterControls({
  filters,
  update,
  orientation,
}: {
  filters: EventFilters
  update: (patch: Partial<EventFilters>) => void
  orientation: 'row' | 'stack'
}) {
  return (
    <div
      className={cn(
        orientation === 'row'
          ? 'flex flex-wrap items-center gap-3'
          : 'flex flex-col gap-4',
      )}
    >
      <PriceSegment
        value={filters.price}
        onChange={(price) => update({ price })}
      />

      <label className={cn(orientation === 'stack' && 'block')}>
        <span className="sr-only">Catégorie</span>
        <Select
          value={filters.category}
          onChange={(e) => update({ category: e.target.value })}
          className={orientation === 'stack' ? 'w-full' : 'min-w-44'}
          aria-label="Filtrer par catégorie"
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </label>

      <label className={cn(orientation === 'stack' && 'block')}>
        <span className="sr-only">Arrondissement</span>
        <Select
          value={filters.arrondissement ?? ''}
          onChange={(e) =>
            update({
              arrondissement: e.target.value ? Number(e.target.value) : null,
            })
          }
          className={orientation === 'stack' ? 'w-full' : 'min-w-40'}
          aria-label="Filtrer par arrondissement"
        >
          <option value="">Tout Paris</option>
          {ARRONDISSEMENTS.map((arr) => (
            <option key={arr} value={arr}>
              Paris {arr}
              {arr === 1 ? 'er' : 'e'}
            </option>
          ))}
        </Select>
      </label>
    </div>
  )
}

export function FilterBar() {
  const [filters, update] = useFilters()
  const active = hasActiveFilters(filters)
  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.price !== 'all' ? 1 : 0) +
    (filters.arrondissement !== null ? 1 : 0)

  const reset = () =>
    update({ category: '', price: 'all', arrondissement: null })

  return (
    <>
      {/* Desktop : barre inline */}
      <div className="hidden items-center gap-3 sm:flex">
        <FilterControls filters={filters} update={update} orientation="row" />
        {active && (
          <Button variant="ghost" size="sm" onClick={reset}>
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Mobile : déclencheur + bottom sheet */}
      <div className="sm:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="md" className="w-full">
              <SlidersHorizontal className="size-4" />
              Filtres
              {activeCount > 0 && (
                <span className="ml-1 grid min-w-5 place-items-center rounded-full bg-magenta px-1.5 text-xs font-semibold text-white">
                  {activeCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent side="bottom">
            <DialogTitle className="mb-5 font-display text-lg font-semibold">
              Filtrer les événements
            </DialogTitle>
            <FilterControls
              filters={filters}
              update={update}
              orientation="stack"
            />
            <div className="mt-6 flex gap-3">
              {active && (
                <Button variant="outline" className="flex-1" onClick={reset}>
                  Réinitialiser
                </Button>
              )}
              <DialogClose asChild>
                <Button className="flex-1">Voir les résultats</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
