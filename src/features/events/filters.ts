import { CATEGORIES, type PriceFilter } from './constants'

/**
 * État de recherche/filtre du domaine. L'URL (`searchParams`) en est l'unique
 * source de vérité (cf. §4) : ces fonctions traduisent dans les deux sens.
 */
export interface EventFilters {
  q: string
  category: string
  price: PriceFilter
  arrondissement: number | null
  page: number
}

export const DEFAULT_FILTERS: EventFilters = {
  q: '',
  category: '',
  price: 'all',
  arrondissement: null,
  page: 1,
}

const PRICE_VALUES: PriceFilter[] = ['all', 'gratuit', 'payant']

/** URLSearchParams → EventFilters, en validant chaque valeur. */
export function parseFilters(params: URLSearchParams): EventFilters {
  const rawCategory = params.get('category') ?? ''
  const rawPrice = params.get('price') ?? 'all'
  const rawArr = Number(params.get('arr'))
  const rawPage = Number(params.get('page'))

  return {
    q: params.get('q')?.trim() ?? '',
    category: (CATEGORIES as readonly string[]).includes(rawCategory)
      ? rawCategory
      : '',
    price: PRICE_VALUES.includes(rawPrice as PriceFilter)
      ? (rawPrice as PriceFilter)
      : 'all',
    arrondissement:
      Number.isInteger(rawArr) && rawArr >= 1 && rawArr <= 20 ? rawArr : null,
    page: Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1,
  }
}

/**
 * Applique un patch de filtres sur des params existants et renvoie de NOUVEAUX
 * params. Toute modification d'un filtre (hors page) réinitialise la page à 1.
 * Les valeurs par défaut sont retirées de l'URL pour la garder propre.
 */
export function applyFilters(
  current: URLSearchParams,
  patch: Partial<EventFilters>,
): URLSearchParams {
  const next = new URLSearchParams(current)
  const resetsPage = Object.keys(patch).some((key) => key !== 'page')

  const setOrDelete = (key: string, value: string | null) => {
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
  }

  if (patch.q !== undefined) setOrDelete('q', patch.q.trim())
  if (patch.category !== undefined) setOrDelete('category', patch.category)
  if (patch.price !== undefined)
    setOrDelete('price', patch.price === 'all' ? null : patch.price)
  if (patch.arrondissement !== undefined)
    setOrDelete(
      'arr',
      patch.arrondissement === null ? null : String(patch.arrondissement),
    )

  if (patch.page !== undefined && patch.page > 1)
    next.set('page', String(patch.page))
  else if (patch.page !== undefined) next.delete('page')
  else if (resetsPage) next.delete('page')

  return next
}

/** Vrai si au moins un filtre (hors texte/page) est actif. */
export function hasActiveFilters(filters: EventFilters): boolean {
  return (
    filters.category !== '' ||
    filters.price !== 'all' ||
    filters.arrondissement !== null
  )
}
