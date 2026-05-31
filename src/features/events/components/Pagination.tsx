import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/shared/ui/button'

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

/** Pagination précédent/suivant avec indicateur de position. */
export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav
      className="flex items-center justify-center gap-3"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="md"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">Précédent</span>
      </Button>

      <p className="text-sm font-medium text-ink-muted" aria-live="polite">
        Page <span className="text-navy">{page}</span> sur {pageCount}
      </p>

      <Button
        variant="outline"
        size="md"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        <span className="hidden sm:inline">Suivant</span>
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}
