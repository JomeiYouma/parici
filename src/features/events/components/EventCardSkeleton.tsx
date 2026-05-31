import { Skeleton } from '@/shared/ui/skeleton'

/** Squelette de carte, calé sur la structure d'`EventCard` (anti-CLS). */
export function EventCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-surface-border bg-surface">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <div className="mt-auto space-y-2 pt-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}
