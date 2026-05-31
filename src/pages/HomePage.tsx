import { useSearchParams } from 'react-router-dom'

import { Seo } from '@/app/Seo'
import { AiSearchPanel } from '@/features/ai/AiSearchPanel'
import { EVENTS_ANCHOR, Hero } from '@/features/events/components/Hero'
import { EventList } from '@/features/events/components/EventList'
import { FilterBar } from '@/features/events/components/FilterBar'
import { Pagination } from '@/features/events/components/Pagination'
import { SearchInput } from '@/features/events/components/SearchInput'
import { applyFilters } from '@/features/events/filters'
import { useEvents } from '@/features/events/useEvents'
import { Button } from '@/shared/ui/button'

const numberFormat = new Intl.NumberFormat('fr-FR')

export function HomePage() {
  const { data, isPending, isError, isFetching, refetch, filters } = useEvents()
  const [, setSearchParams] = useSearchParams()

  const goToPage = (page: number) => {
    setSearchParams((prev) => applyFilters(prev, { page }))
    document
      .getElementById(EVENTS_ANCHOR)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const resetAll = () =>
    setSearchParams((prev) =>
      applyFilters(prev, {
        q: '',
        category: '',
        price: 'all',
        arrondissement: null,
      }),
    )

  return (
    <>
      <Seo title="Sortir à Paris" />
      <Hero />

      <section
        id={EVENTS_ANCHOR}
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6"
      >
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Les événements
          </h2>
          <p className="text-sm text-ink-muted" aria-live="polite">
            {data
              ? `${numberFormat.format(data.totalCount)} événement${
                  data.totalCount > 1 ? 's' : ''
                } à découvrir`
              : 'Chargement…'}
          </p>
        </div>

        <div className="mb-6">
          <AiSearchPanel />
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput />
          </div>
          <FilterBar />
        </div>

        <div aria-busy={isFetching}>
          <EventList
            events={data?.events ?? []}
            isPending={isPending}
            isError={isError}
            onRetry={() => void refetch()}
            emptyAction={
              <Button variant="secondary" onClick={resetAll}>
                Réinitialiser la recherche
              </Button>
            }
          />
        </div>

        {data && data.events.length > 0 && (
          <div className="mt-10">
            <Pagination
              page={filters.page}
              pageCount={data.pageCount}
              onPageChange={goToPage}
            />
          </div>
        )}
      </section>
    </>
  )
}
