import { AlertTriangle, SearchX } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from './button'

/** Conteneur centré commun aux états vides / erreur. */
function StateShell({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-16 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-navy/5 text-navy">
        {icon}
      </div>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="text-ink-muted">{children}</div>
    </div>
  )
}

/** État d'erreur avec action de réessai. */
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <StateShell
      icon={<AlertTriangle className="size-7" />}
      title="Impossible de charger les événements"
    >
      <p className="mb-5">
        Le service de la Ville de Paris est momentanément indisponible.
      </p>
      <Button onClick={onRetry}>Réessayer</Button>
    </StateShell>
  )
}

/** État vide (aucun résultat). */
export function EmptyState({
  title = 'Aucun événement trouvé',
  description = 'Essayez d’élargir votre recherche ou de retirer un filtre.',
  action,
}: {
  title?: string
  description?: string
  action?: ReactNode
}) {
  return (
    <StateShell icon={<SearchX className="size-7" />} title={title}>
      <p className="mb-5">{description}</p>
      {action}
    </StateShell>
  )
}
