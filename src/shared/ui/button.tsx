import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

/**
 * Bouton du design system.
 * Rôles couleur respectés (cf. docs/DEMARCHE.md §3) :
 * - `primary` : magenta = CTA / action principale (gros texte → blanc OK).
 * - `gold` / `coral` : highlight → toujours texte navy, jamais blanc.
 * Hauteur min. 44px sur les tailles tactiles pour le confort mobile.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[transform,background-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-magenta text-white shadow-sm hover:bg-magenta-strong focus-visible:outline-magenta',
        secondary:
          'bg-surface text-navy border border-surface-border hover:border-coral hover:text-coral focus-visible:outline-coral',
        gold: 'bg-gold text-navy shadow-sm hover:brightness-105 focus-visible:outline-navy',
        ghost:
          'bg-transparent text-navy hover:bg-navy/5 focus-visible:outline-navy',
        outline:
          'bg-transparent text-navy border border-navy/20 hover:bg-navy/5 focus-visible:outline-navy',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
