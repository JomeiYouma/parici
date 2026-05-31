import type { DomainEvent } from './types'

const dayFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
})

const dayYearFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * Libellé de dates lisible. Priorité au libellé éditorial de la source
 * (`dateLabel`), sinon reconstruit à partir des dates de début/fin.
 */
export function formatEventDate(event: DomainEvent): string | null {
  if (event.dateLabel) return event.dateLabel

  const { dateStart, dateEnd } = event
  if (!dateStart) return null

  if (!dateEnd || sameDay(dateStart, dateEnd)) {
    return `Le ${dayYearFormatter.format(dateStart)}`
  }

  if (dateStart.getFullYear() === dateEnd.getFullYear()) {
    return `Du ${dayFormatter.format(dateStart)} au ${dayYearFormatter.format(dateEnd)}`
  }

  return `Du ${dayYearFormatter.format(dateStart)} au ${dayYearFormatter.format(dateEnd)}`
}

/** Lieu condensé : « Nom — Paris 4e ». */
export function formatPlace(event: DomainEvent): string | null {
  const { name, city, arrondissement } = event.place
  const locality =
    arrondissement !== null
      ? `Paris ${arrondissement}${arrondissement === 1 ? 'er' : 'e'}`
      : city
  return [name, locality].filter(Boolean).join(' — ') || null
}
