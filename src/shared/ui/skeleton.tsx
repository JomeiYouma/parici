import * as React from 'react'

import { cn } from '@/shared/lib/utils'

/** Bloc de chargement (shimmer). Animation coupée si prefers-reduced-motion. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-navy/10 motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  )
}
