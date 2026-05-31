import { Link } from 'react-router-dom'

import { Seo } from '@/app/Seo'
import { Button } from '@/shared/ui/button'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-24 text-center">
      <Seo title="Page introuvable" />
      <p className="font-display text-6xl font-semibold text-magenta">404</p>
      <h1 className="font-display text-2xl font-semibold">Page introuvable</h1>
      <p className="text-ink-muted">
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <Button asChild>
        <Link to="/">Revenir à l’accueil</Link>
      </Button>
    </section>
  )
}
