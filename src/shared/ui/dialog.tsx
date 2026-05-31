import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

function DialogOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Contenu de dialogue. `side="bottom"` rend une feuille (sheet) ancrée en bas,
 * idéale pour les filtres sur mobile ; `side="center"` une modale classique.
 */
export function DialogContent({
  className,
  children,
  side = 'center',
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  side?: 'center' | 'bottom'
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 bg-surface text-navy shadow-xl focus:outline-none',
          side === 'center' &&
            'left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-card)] p-6',
          side === 'bottom' &&
            'inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-navy/5 hover:text-navy focus-visible:outline-2 focus-visible:outline-magenta"
          aria-label="Fermer"
        >
          <X className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
