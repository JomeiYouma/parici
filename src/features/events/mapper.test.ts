import { describe, expect, it } from 'vitest'

import { mapApiEventToDomain } from './mapper'
import type { ApiEvent } from './types'

/** Fixture minimale valide, surchargée au besoin dans chaque test. */
function makeApiEvent(overrides: Partial<ApiEvent> = {}): ApiEvent {
  return {
    id: '42',
    url: 'https://paris.fr/evenements/concert-42',
    title: 'Concert au parc',
    lead_text: 'Un concert <strong>gratuit</strong> en plein air.',
    description: '<p>Venez nombreux&nbsp;!</p>',
    date_start: '2026-06-21T18:00:00+02:00',
    date_end: '2026-06-21T22:00:00+02:00',
    date_description: 'Le 21 juin',
    cover_url: 'https://cdn.paris.fr/cover.jpg',
    cover_alt: null,
    address_name: 'Parc de la Villette',
    address_street: '211 av. Jean Jaurès',
    address_zipcode: '75019',
    address_city: 'Paris',
    lat_lon: { lat: 48.89, lon: 2.39 },
    price_type: 'gratuit',
    price_detail: null,
    qfap_tags: 'Concert;Festival',
    pmr: true,
    blind: false,
    deaf: null,
    ...overrides,
  }
}

describe('mapApiEventToDomain', () => {
  it('mappe un événement complet vers le domaine', () => {
    const event = mapApiEventToDomain(makeApiEvent())
    expect(event).not.toBeNull()
    expect(event?.id).toBe('42')
    expect(event?.title).toBe('Concert au parc')
    expect(event?.sourceUrl).toBe('https://paris.fr/evenements/concert-42')
  })

  it('retire le HTML des textes riches', () => {
    const event = mapApiEventToDomain(makeApiEvent())
    expect(event?.summary).toBe('Un concert gratuit en plein air.')
    expect(event?.description).toBe('Venez nombreux !')
  })

  it('déduit l’arrondissement du code postal', () => {
    expect(mapApiEventToDomain(makeApiEvent())?.place.arrondissement).toBe(19)
    expect(
      mapApiEventToDomain(makeApiEvent({ address_zipcode: '75001' }))?.place
        .arrondissement,
    ).toBe(1)
    expect(
      mapApiEventToDomain(makeApiEvent({ address_zipcode: '75000' }))?.place
        .arrondissement,
    ).toBeNull()
    expect(
      mapApiEventToDomain(makeApiEvent({ address_zipcode: '93100' }))?.place
        .arrondissement,
    ).toBeNull()
  })

  it('écarte les coordonnées 0,0 (valeur « vide » de l’open data)', () => {
    expect(
      mapApiEventToDomain(makeApiEvent({ lat_lon: { lat: 0, lon: 0 } }))?.geo,
    ).toBeNull()
    expect(
      mapApiEventToDomain(makeApiEvent({ lat_lon: { lat: 48.8, lon: 2.3 } }))
        ?.geo,
    ).toEqual({ lat: 48.8, lon: 2.3 })
  })

  it('découpe et déduplique les tags combinés', () => {
    expect(mapApiEventToDomain(makeApiEvent())?.categories).toEqual([
      'Concert',
      'Festival',
    ])
    expect(
      mapApiEventToDomain(makeApiEvent({ qfap_tags: 'Concert;Concert;' }))
        ?.categories,
    ).toEqual(['Concert'])
    expect(
      mapApiEventToDomain(makeApiEvent({ qfap_tags: null }))?.categories,
    ).toEqual([])
  })

  it('détecte la gratuité et construit le libellé de prix', () => {
    expect(mapApiEventToDomain(makeApiEvent())?.isFree).toBe(true)
    expect(mapApiEventToDomain(makeApiEvent())?.priceLabel).toBe('Gratuit')

    const paid = mapApiEventToDomain(
      makeApiEvent({ price_type: 'payant', price_detail: 'De 10€ à 25€' }),
    )
    expect(paid?.isFree).toBe(false)
    expect(paid?.priceLabel).toBe('De 10€ à 25€')
  })

  it('utilise le titre comme alt d’image par défaut', () => {
    expect(mapApiEventToDomain(makeApiEvent())?.image?.alt).toBe(
      'Concert au parc',
    )
    expect(
      mapApiEventToDomain(makeApiEvent({ cover_alt: 'Scène de nuit' }))?.image
        ?.alt,
    ).toBe('Scène de nuit')
  })

  it('renvoie null si l’enregistrement est inexploitable', () => {
    expect(mapApiEventToDomain(makeApiEvent({ id: null }))).toBeNull()
    expect(mapApiEventToDomain(makeApiEvent({ title: null }))).toBeNull()
  })

  it('mappe les drapeaux d’accessibilité (null → false)', () => {
    const a11y = mapApiEventToDomain(makeApiEvent())?.accessibility
    expect(a11y).toEqual({
      reducedMobility: true,
      blind: false,
      deaf: false,
    })
  })
})
