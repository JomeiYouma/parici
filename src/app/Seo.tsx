import { useEffect } from 'react'

interface SeoProps {
  title: string
  description?: string
}

const SITE_NAME = 'Parici'
const DEFAULT_DESCRIPTION =
  'Trouvez facilement concerts, expositions, spectacles et sorties à Paris.'

/** Crée ou met à jour une balise meta dans le <head>. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  )
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Méta dynamiques par page (mitigation SEO d'une SPA, cf. §8). Hook maison léger,
 * sans dépendance : chaque page écrase le titre et la description courante.
 */
export function Seo({ title, description = DEFAULT_DESCRIPTION }: SeoProps) {
  const fullTitle = `${title} — ${SITE_NAME}`

  useEffect(() => {
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
  }, [fullTitle, description])

  return null
}
