import { ArrowDown, Sparkles } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { Button } from '@/shared/ui/button'

/** Cible d'ancrage du CTA (section liste). */
export const EVENTS_ANCHOR = 'events'

function scrollToEvents(smooth: boolean) {
  document.getElementById(EVENTS_ANCHOR)?.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'start',
  })
}

/**
 * Hero plein écran avec parallax piloté au scroll.
 * Contraintes (cf. docs/DEMARCHE.md §4) : on n'anime QUE transform/opacity
 * (composités GPU) ; repli statique si l'utilisateur réduit les animations.
 */
export function Hero() {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Plan arrière : translation forte. Plan avant : translation faible + fondu.
  const backY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const frontY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const frontOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const animated = !reduceMotion

  return (
    <section
      ref={ref}
      className="relative flex min-h-[88svh] items-center justify-center overflow-hidden"
    >
      {/* Plan arrière décoratif (blobs colorés, composités GPU) */}
      <motion.div
        aria-hidden
        style={animated ? { y: backY } : undefined}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-coral/10 to-paper" />
        <div className="absolute -left-24 top-10 size-72 rounded-full bg-coral/25 blur-3xl sm:size-96" />
        <div className="absolute right-[-6rem] top-1/3 size-80 rounded-full bg-gold/30 blur-3xl sm:size-[28rem]" />
        <div className="absolute bottom-[-4rem] left-1/3 size-72 rounded-full bg-magenta/15 blur-3xl" />
      </motion.div>

      {/* Plan avant : titre + sous-titre + CTA */}
      <motion.div
        style={animated ? { y: frontY, opacity: frontOpacity } : undefined}
        className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6"
      >
        <motion.span
          initial={animated ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface/70 px-4 py-1.5 text-sm font-medium text-ink-muted backdrop-blur"
        >
          <Sparkles className="size-4 text-magenta" aria-hidden />
          L’agenda culturel de la Ville de Paris
        </motion.span>

        <motion.h1
          initial={animated ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
        >
          Sortir à Paris,
          <br />
          c’est <span className="text-magenta">par ici</span>.
        </motion.h1>

        <motion.p
          initial={animated ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-5 max-w-xl text-lg text-ink-muted"
        >
          Concerts, expositions, spectacles, balades… Découvrez les milliers
          d’événements qui font vibrer la capitale, et gardez vos préférés.
        </motion.p>

        <motion.div
          initial={animated ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <Button size="lg" onClick={() => scrollToEvents(animated ?? false)}>
            Explorer les événements
            <ArrowDown className="size-4" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
