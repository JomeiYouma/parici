import { beforeEach, describe, expect, it } from 'vitest'

import type { DomainEvent } from '@/features/events/types'

import { useFavoritesStore } from './store'

function makeEvent(id: string): DomainEvent {
  return {
    id,
    title: `Événement ${id}`,
    summary: '',
    description: '',
    sourceUrl: null,
    image: null,
    dateStart: null,
    dateEnd: null,
    dateLabel: null,
    isFree: true,
    priceLabel: 'Gratuit',
    categories: ['Concert'],
    place: {
      name: null,
      street: null,
      zipcode: null,
      city: 'Paris',
      arrondissement: 10,
    },
    geo: null,
    accessibility: { reducedMobility: false, blind: false, deaf: false },
  }
}

describe('useFavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.getState().clear()
  })

  it('ajoute puis retire un favori (toggle)', () => {
    const { toggle } = useFavoritesStore.getState()
    const event = makeEvent('1')

    toggle(event)
    expect(useFavoritesStore.getState().items['1']).toBeDefined()

    toggle(event)
    expect(useFavoritesStore.getState().items['1']).toBeUndefined()
  })

  it('ne conserve qu’un instantané léger de l’événement', () => {
    useFavoritesStore.getState().toggle(makeEvent('7'))
    const snapshot = useFavoritesStore.getState().items['7']
    expect(snapshot).toMatchObject({
      id: '7',
      title: 'Événement 7',
      isFree: true,
      arrondissement: 10,
    })
    expect(typeof snapshot?.addedAt).toBe('number')
  })

  it('remove est idempotent', () => {
    const { remove } = useFavoritesStore.getState()
    expect(() => remove('inexistant')).not.toThrow()
    expect(Object.keys(useFavoritesStore.getState().items)).toHaveLength(0)
  })
})
