import { ArrowDown } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { HeroAiSearch } from '@/features/ai/HeroAiSearch'
import { Button } from '@/shared/ui/button'

import { scrollToEvents } from '../anchor'
import { EiffelTower } from './EiffelTower'

/**
 * Hero plein écran. Une Tour Eiffel (vrai dessin SVG) se disperse au scroll
 * pendant que le texte s'estompe. Contraintes (cf. docs/DEMARCHE.md §4) : on
 * n'anime QUE transform/opacity (composités GPU) ; repli statique (tour
 * assemblée, texte fixe) si l'utilisateur réduit les animations.
 */
export function Hero() {
  const reduceMotion = useReducedMotion()
  const animated = !reduceMotion
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Texte : translation faible + fondu progressif pendant que la tour se disperse.
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const washY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92svh] flex-col items-center overflow-hidden"
    >
      {/* Fond dégradé + halos colorés (plan le plus lointain) */}
      <motion.div
        aria-hidden
        style={animated ? { y: washY } : undefined}
        className="absolute inset-0 -z-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-coral/10 to-paper" />
        <div className="absolute right-[-6rem] top-24 size-80 rounded-full bg-gold/25 blur-3xl sm:size-[26rem]" />
        <div className="absolute -left-24 top-1/3 size-72 rounded-full bg-coral/20 blur-3xl" />
      </motion.div>

      {/* Tour Eiffel (plan intermédiaire), ancrée en bas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 flex justify-center"
      >
        <EiffelTower
          progress={scrollYProgress}
          reduce={!animated}
          className="h-[78svh] w-auto max-w-none"
        />
      </div>

      {/* Plan avant : recherche + titre + sous-titre + CTA */}
      <motion.div
        style={animated ? { y: textY, opacity: textOpacity } : undefined}
        className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-[13vh] text-center sm:px-6 sm:pt-[15vh]"
      >
        <motion.div
          initial={animated ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroAiSearch />
        </motion.div>

        <motion.h1
          initial={animated ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-7 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
        >
          Sortir à Paris,
          <br />
          c’est <span className="text-magenta">par ici</span>.
        </motion.h1>

        <motion.p
          initial={animated ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-5 max-w-xl text-lg font-medium text-magenta-strong"
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
          <Button size="lg" onClick={() => scrollToEvents(animated)}>
            Explorer les événements
            <ArrowDown className="size-4" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
