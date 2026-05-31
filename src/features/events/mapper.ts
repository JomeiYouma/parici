import type { ApiEvent, DomainEvent, GeoPoint } from './types'

/** Retire les balises HTML et normalise les espaces (descriptions riches). */
function stripHtml(html: string | null): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Déduit l'arrondissement (1–20) d'un code postal parisien (75001–75020). */
function arrondissementFromZipcode(zipcode: string | null): number | null {
  if (!zipcode) return null
  const match = /^75(\d{3})$/.exec(zipcode)
  if (!match) return null
  const n = Number(match[1])
  return n >= 1 && n <= 20 ? n : null
}

/** Coordonnées valides uniquement (l'open data utilise 0,0 comme « vide »). */
function toGeoPoint(latLon: ApiEvent['lat_lon']): GeoPoint | null {
  if (!latLon) return null
  const { lat, lon } = latLon
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  if (lat === 0 && lon === 0) return null
  return { lat, lon }
}

function parseDate(value: string | null): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Découpe les tags combinés « Concert;Festival » en liste propre, dédupliquée. */
function parseCategories(tags: string | null): string[] {
  if (!tags) return []
  return [
    ...new Set(
      tags
        .split(';')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ]
}

/**
 * Cœur de l'anti-corruption layer : `ApiEvent` → `DomainEvent`.
 * Renvoie `null` si l'enregistrement est inexploitable (sans id ou titre),
 * afin que l'appelant puisse le filtrer proprement.
 */
export function mapApiEventToDomain(api: ApiEvent): DomainEvent | null {
  if (!api.id || !api.title) return null

  const title = stripHtml(api.title) || api.title.trim()

  const image = api.cover_url
    ? { url: api.cover_url, alt: api.cover_alt?.trim() || title }
    : null

  const isFree = api.price_type?.toLowerCase() === 'gratuit'

  return {
    id: api.id,
    title,
    summary: stripHtml(api.lead_text),
    description: stripHtml(api.description),
    sourceUrl: api.url,
    image,
    dateStart: parseDate(api.date_start),
    dateEnd: parseDate(api.date_end),
    dateLabel: stripHtml(api.date_description) || null,
    isFree,
    priceLabel: isFree
      ? 'Gratuit'
      : stripHtml(api.price_detail) || (api.price_type ? 'Payant' : null),
    categories: parseCategories(api.qfap_tags),
    place: {
      name: api.address_name?.trim() || null,
      street: api.address_street?.trim() || null,
      zipcode: api.address_zipcode?.trim() || null,
      city: api.address_city?.trim() || null,
      arrondissement: arrondissementFromZipcode(api.address_zipcode),
    },
    geo: toGeoPoint(api.lat_lon),
    accessibility: {
      reducedMobility: api.pmr === true,
      blind: api.blind === true,
      deaf: api.deaf === true,
    },
  }
}
