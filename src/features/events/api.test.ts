import { describe, expect, it } from 'vitest'

import { buildWhereClause } from './api'
import { DEFAULT_FILTERS } from './filters'

describe('buildWhereClause', () => {
  it('renvoie null sans filtre actif', () => {
    expect(buildWhereClause(DEFAULT_FILTERS)).toBeNull()
  })

  it('construit une recherche plein texte multi-champs', () => {
    const where = buildWhereClause({ ...DEFAULT_FILTERS, q: 'jazz' })
    expect(where).toContain('search(title, "jazz")')
    expect(where).toContain('search(lead_text, "jazz")')
  })

  it('filtre par tarif, catégorie et arrondissement combinés', () => {
    const where = buildWhereClause({
      ...DEFAULT_FILTERS,
      price: 'gratuit',
      category: 'Concert',
      arrondissement: 4,
    })
    expect(where).toContain('price_type = "gratuit"')
    expect(where).toContain('qfap_tags like "Concert"')
    expect(where).toContain('address_zipcode = "75004"')
    expect(where).toContain(' and ')
  })

  it('échappe les guillemets pour éviter une injection ODSQL', () => {
    const where = buildWhereClause({
      ...DEFAULT_FILTERS,
      q: 'rock"or"1=1',
    })
    expect(where).not.toContain('"or"')
  })
})
