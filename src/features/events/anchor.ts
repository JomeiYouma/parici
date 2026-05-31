/** Ancre de la section liste + scroll fluide vers elle (CTA, recherche). */
export const EVENTS_ANCHOR = 'events'

export function scrollToEvents(smooth = true) {
  document.getElementById(EVENTS_ANCHOR)?.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'start',
  })
}
