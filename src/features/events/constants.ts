/** Configuration de la source de données et des filtres. */

export const API_BASE =
  'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-'

export const RECORDS_ENDPOINT = `${API_BASE}/records`

/** Nombre d'événements par page (grille 1/2/3 colonnes selon le viewport). */
export const PAGE_SIZE = 12

/**
 * Catégories curées. Les `qfap_tags` de la source sont des chaînes combinées
 * (« Concert;Festival »), peu lisibles en facette brute : on expose donc une
 * liste maîtrisée, filtrée via `qfap_tags like "<label>"`.
 */
export const CATEGORIES = [
  'Concert',
  'Festival',
  'Exposition',
  'Théâtre',
  'Spectacle',
  'Danse',
  'Cinéma',
  'Atelier',
  'Visite guidée',
  'Balade urbaine',
  'Conférence',
  'Animation',
  'Brocante',
  'Loisirs',
] as const

export type Category = (typeof CATEGORIES)[number]

/** Arrondissements parisiens 1–20 pour le filtre lieu. */
export const ARRONDISSEMENTS = Array.from({ length: 20 }, (_, i) => i + 1)

export const PRICE_OPTIONS = [
  { value: 'all', label: 'Tous les tarifs' },
  { value: 'gratuit', label: 'Gratuit' },
  { value: 'payant', label: 'Payant' },
] as const

export type PriceFilter = (typeof PRICE_OPTIONS)[number]['value']
