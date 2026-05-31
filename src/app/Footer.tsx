import { Link } from 'react-router-dom'

/** Pied de page : crédit de la source open data + liens légaux. */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-surface-border/70 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-display text-base font-semibold text-navy">
              Parici
            </span>{' '}
            — Sortir à Paris.
          </p>
          <p>
            Données :{' '}
            <a
              href="https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-navy underline decoration-coral decoration-2 underline-offset-2 hover:text-magenta-strong"
            >
              Que faire à Paris ?
            </a>{' '}
            — Ville de Paris (Licence ODbL).
          </p>
        </div>

        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 border-t border-surface-border/70 pt-4 text-sm text-ink-muted"
          aria-label="Liens légaux"
        >
          <Link
            to="/mentions-legales"
            className="transition-colors hover:text-magenta-strong"
          >
            Mentions légales
          </Link>
          <Link
            to="/confidentialite"
            className="transition-colors hover:text-magenta-strong"
          >
            Politique de confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  )
}
