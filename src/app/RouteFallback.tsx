import { Loader2 } from 'lucide-react'

/** Fallback de Suspense pendant le chargement d'une route paresseuse. */
export function RouteFallback() {
  return (
    <div
      className="grid min-h-[50vh] place-items-center"
      role="status"
      aria-label="Chargement"
    >
      <Loader2 className="size-7 animate-spin text-magenta motion-reduce:animate-none" />
    </div>
  )
}
