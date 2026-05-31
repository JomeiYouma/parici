import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

/**
 * Badge / tag. Rôles couleur (cf. docs/DEMARCHE.md §3) :
 * - `category` : coral, texte navy.
 * - `free` : gold, texte navy — badge « Gratuit ».
 * - `neutral` : surface discrète pour métadonnées (lieu, date…).
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium leading-none',
  {
    variants: {
      variant: {
        category: 'bg-coral/15 text-navy',
        free: 'bg-gold text-navy',
        neutral: 'bg-navy/5 text-ink-muted',
        magenta: 'bg-magenta text-white',
      },
      size: {
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'category',
      size: 'sm',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}
