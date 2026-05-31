/**
 * Frontière de typage entre la source open data et le domaine applicatif.
 *
 * `ApiEvent` ne décrit QUE les champs réellement consommés de l'API
 * « Que faire à Paris ? » (Opendatasoft Explore v2.1). Tous les champs sont
 * potentiellement nuls : l'open data est hétérogène. Le `mapper` est le seul
 * endroit autorisé à connaître cette forme (anti-corruption layer, cf. §3).
 */
export interface ApiEvent {
  id: string | null
  url: string | null
  title: string | null
  lead_text: string | null
  description: string | null
  date_start: string | null
  date_end: string | null
  date_description: string | null
  cover_url: string | null
  cover_alt: string | null
  address_name: string | null
  address_street: string | null
  address_zipcode: string | null
  address_city: string | null
  lat_lon: { lat: number; lon: number } | null
  price_type: string | null
  price_detail: string | null
  qfap_tags: string | null
  pmr: boolean | null
  blind: boolean | null
  deaf: boolean | null
}

export interface ApiRecordsResponse {
  total_count: number
  results: ApiEvent[]
}

/** Coordonnées géographiques valides (le 0,0 de l'open data est écarté). */
export interface GeoPoint {
  lat: number
  lon: number
}

/** Modèle de domaine : la SEULE forme que connaissent les composants. */
export interface DomainEvent {
  id: string
  title: string
  /** Résumé court, texte brut (HTML retiré). */
  summary: string
  /** Description longue, texte brut (HTML retiré). */
  description: string
  /** URL de la fiche officielle Paris.fr. */
  sourceUrl: string | null
  image: { url: string; alt: string } | null
  dateStart: Date | null
  dateEnd: Date | null
  /** Libellé de dates fourni par la source, ex. « Du 1er au 5 juin ». */
  dateLabel: string | null
  isFree: boolean
  priceLabel: string | null
  categories: string[]
  place: {
    name: string | null
    street: string | null
    zipcode: string | null
    city: string | null
    /** Arrondissement parisien (1–20) si déductible du code postal. */
    arrondissement: number | null
  }
  geo: GeoPoint | null
  accessibility: {
    reducedMobility: boolean
    blind: boolean
    deaf: boolean
  }
}
