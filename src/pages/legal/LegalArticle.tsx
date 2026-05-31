import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/** Gabarit commun aux pages légales : titre, date de mise à jour et prose. */
export function LegalArticle({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-magenta-strong"
      >
        <ArrowLeft className="size-4" />
        Retour à l’accueil
      </Link>

      <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Dernière mise à jour : {updated}
      </p>

      <div className="legal-prose mt-8 space-y-6 leading-relaxed text-navy/90">
        {children}
      </div>
    </article>
  )
}

/** Sous-titre de section dans une page légale. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string
  children: ReactNode
}) {
  return (
    <section className="space-y-2">
      <h2 className="font-display text-xl font-semibold text-navy">{heading}</h2>
      {children}
    </section>
  )
}
