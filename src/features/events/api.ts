import { httpGetJson } from '@/shared/lib/http'

import { PAGE_SIZE, RECORDS_ENDPOINT } from './constants'
import type { EventFilters } from './filters'
import { mapApiEventToDomain } from './mapper'
import type { ApiRecordsResponse, DomainEvent } from './types'

/** Champs réellement consommés — on ne télécharge que le nécessaire. */
const SELECT_FIELDS = [
  'id',
  'url',
  'title',
  'lead_text',
  'description',
  'date_start',
  'date_end',
  'date_description',
  'cover_url',
  'cover_alt',
  'address_name',
  'address_street',
  'address_zipcode',
  'address_city',
  'lat_lon',
  'price_type',
  'price_detail',
  'qfap_tags',
  'pmr',
  'blind',
  'deaf',
].join(', ')

/** Échappe une valeur texte destinée à une chaîne ODSQL entre guillemets. */
function quote(value: string): string {
  return value.replace(/["\\]/g, ' ').trim()
}

/** Construit la clause ODSQL `where` à partir des filtres du domaine. */
export function buildWhereClause(filters: EventFilters): string | null {
  const clauses: string[] = []

  if (filters.q) {
    const term = quote(filters.q)
    if (term) {
      clauses.push(
        `(search(title, "${term}") or search(lead_text, "${term}") or search(description, "${term}"))`,
      )
    }
  }

  if (filters.price !== 'all') {
    clauses.push(`price_type = "${filters.price}"`)
  }

  if (filters.category) {
    clauses.push(`qfap_tags like "${quote(filters.category)}"`)
  }

  if (filters.arrondissement !== null) {
    const zipcode = `75${String(filters.arrondissement).padStart(3, '0')}`
    clauses.push(`address_zipcode = "${zipcode}"`)
  }

  return clauses.length > 0 ? clauses.join(' and ') : null
}

export interface EventsPage {
  events: DomainEvent[]
  totalCount: number
  pageCount: number
}

/** Liste paginée d'événements correspondant aux filtres. */
export async function fetchEvents(
  filters: EventFilters,
  signal?: AbortSignal,
): Promise<EventsPage> {
  const params = new URLSearchParams({
    select: SELECT_FIELDS,
    limit: String(PAGE_SIZE),
    offset: String((filters.page - 1) * PAGE_SIZE),
    order_by: 'updated_at desc',
  })

  const where = buildWhereClause(filters)
  if (where) params.set('where', where)

  const data = await httpGetJson<ApiRecordsResponse>(
    `${RECORDS_ENDPOINT}?${params.toString()}`,
    signal,
  )

  const events = data.results
    .map(mapApiEventToDomain)
    .filter((event): event is DomainEvent => event !== null)

  return {
    events,
    totalCount: data.total_count,
    pageCount: Math.max(1, Math.ceil(data.total_count / PAGE_SIZE)),
  }
}

/** Récupère un événement par son identifiant (page détail). */
export async function fetchEventById(
  id: string,
  signal?: AbortSignal,
): Promise<DomainEvent | null> {
  const params = new URLSearchParams({
    select: SELECT_FIELDS,
    where: `id = "${quote(id)}"`,
    limit: '1',
  })

  const data = await httpGetJson<ApiRecordsResponse>(
    `${RECORDS_ENDPOINT}?${params.toString()}`,
    signal,
  )

  const first = data.results[0]
  return first ? mapApiEventToDomain(first) : null
}
