import { ChevronDown } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

/**
 * Select natif stylé. Choix assumé face à un composant custom : le picker natif
 * offre la meilleure ergonomie tactile sur mobile et une a11y clavier gratuite.
 */
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        'h-11 w-full appearance-none rounded-full border border-surface-border bg-surface pl-4 pr-10 text-sm font-medium text-navy shadow-sm outline-none transition-colors hover:border-coral focus:border-magenta focus-visible:outline-2 focus-visible:outline-magenta',
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
      aria-hidden
    />
  </div>
))
Select.displayName = 'Select'
