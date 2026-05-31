import { describe, expect, it } from 'vitest'

import { applyFilters, hasActiveFilters, parseFilters } from './filters'

describe('parseFilters', () => {
  it('renvoie les valeurs par défaut sur une URL vide', () => {
    expect(parseFilters(new URLSearchParams())).toEqual({
      q: '',
      category: '',
      price: 'all',
      arrondissement: null,
      page: 1,
    })
  })

  it('lit et valide les paramètres', () => {
    const params = new URLSearchParams(
      'q=jazz&category=Concert&price=gratuit&arr=11&page=3',
    )
    expect(parseFilters(params)).toEqual({
      q: 'jazz',
      category: 'Concert',
      price: 'gratuit',
      arrondissement: 11,
      page: 3,
    })
  })

  it('ignore les valeurs invalides', () => {
    const params = new URLSearchParams(
      'category=Inexistant&price=offert&arr=42&page=-1',
    )
    const filters = parseFilters(params)
    expect(filters.category).toBe('')
    expect(filters.price).toBe('all')
    expect(filters.arrondissement).toBeNull()
    expect(filters.page).toBe(1)
  })
})

describe('applyFilters', () => {
  it('réinitialise la page quand un autre filtre change', () => {
    const current = new URLSearchParams('page=4')
    const next = applyFilters(current, { category: 'Concert' })
    expect(next.get('category')).toBe('Concert')
    expect(next.get('page')).toBeNull()
  })

  it('retire les valeurs par défaut de l’URL', () => {
    const current = new URLSearchParams('price=gratuit&category=Concert')
    const next = applyFilters(current, { price: 'all', category: '' })
    expect(next.get('price')).toBeNull()
    expect(next.get('category')).toBeNull()
  })

  it('conserve la page > 1 quand on pagine explicitement', () => {
    const next = applyFilters(new URLSearchParams('q=jazz'), { page: 2 })
    expect(next.get('page')).toBe('2')
    expect(next.get('q')).toBe('jazz')
  })
})

describe('hasActiveFilters', () => {
  it('ignore le texte et la page', () => {
    expect(
      hasActiveFilters(parseFilters(new URLSearchParams('q=jazz&page=2'))),
    ).toBe(false)
  })

  it('détecte un filtre actif', () => {
    expect(
      hasActiveFilters(parseFilters(new URLSearchParams('arr=5'))),
    ).toBe(true)
  })
})
