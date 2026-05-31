import { motion, useTransform, type MotionValue } from 'motion/react'

import { EIFFEL_ART, EIFFEL_TRANSFORM, EIFFEL_VIEWBOX } from './eiffelArt'

/**
 * Tour Eiffel (vrai dessin SVG importé) en « vue éclatée ». Le dessin est défini
 * une fois puis découpé en bandes horizontales (clipPath). Au scroll, la tour
 * tient d'abord sa forme, puis ses bandes se dispersent vers le haut en
 * s'estompant — disparition progressive avant la section suivante.
 *
 * Le haut de la tour est atténué en permanence (masque dégradé) pour garder le
 * titre lisible. On n'anime que transform/opacity (GPU) ; repli statique si reduce.
 */

const NAVY = '#083d77'

// Atténue le sommet de façon permanente (le bas reste à pleine opacité).
const TOP_FADE =
  'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 14%, rgba(0,0,0,1) 38%, rgba(0,0,0,1) 100%)'

interface Band {
  id: number
  y0: number
  y1: number
  dx: number
  dy: number
}

// viewBox ≈ 0 0 567 759. Dispersion à dominante verticale (sortie vers le haut).
const BANDS: Band[] = [
  { id: 0, y0: 0, y1: 150, dx: 36, dy: -130 },
  { id: 1, y0: 150, y1: 320, dx: -84, dy: -168 },
  { id: 2, y0: 320, y1: 470, dx: 110, dy: -120 },
  { id: 3, y0: 470, y1: 610, dx: -96, dy: -78 },
  { id: 4, y0: 610, y1: 760, dx: 56, dy: -44 },
]

function BandSlice({
  band,
  progress,
  reduce,
}: {
  band: Band
  progress: MotionValue<number>
  reduce: boolean
}) {
  // La tour tient sa forme au début (peu de mouvement), puis accélère (easeIn).
  const x = useTransform(progress, [0, 0.5, 1], [0, band.dx * 0.16, band.dx])
  const y = useTransform(progress, [0, 0.5, 1], [0, band.dy * 0.16, band.dy])
  // Fondu complet avant 0.9 → la tour a disparu avant la section suivante.
  const opacity = useTransform(progress, [0, 0.55, 0.9], [1, 1, 0])

  return (
    <motion.g style={reduce ? undefined : { x, y, opacity }}>
      <g clipPath={`url(#eiffel-band-${band.id})`}>
        <use href="#eiffel-art" />
      </g>
    </motion.g>
  )
}

export function EiffelTower({
  progress,
  reduce,
  className,
}: {
  progress: MotionValue<number>
  reduce: boolean
  className?: string
}) {
  return (
    <svg
      viewBox={EIFFEL_VIEWBOX}
      className={className}
      role="img"
      aria-label="Tour Eiffel stylisée"
      preserveAspectRatio="xMidYMax meet"
      style={{ maskImage: TOP_FADE, WebkitMaskImage: TOP_FADE }}
    >
      <defs>
        {/* Le dessin, défini une fois et réutilisé par chaque bande. */}
        <g
          id="eiffel-art"
          transform={EIFFEL_TRANSFORM}
          fill={NAVY}
          dangerouslySetInnerHTML={{ __html: EIFFEL_ART }}
        />
        {BANDS.map((band) => (
          <clipPath key={band.id} id={`eiffel-band-${band.id}`}>
            <rect x={-80} y={band.y0} width={760} height={band.y1 - band.y0} />
          </clipPath>
        ))}
      </defs>

      {BANDS.map((band) => (
        <BandSlice
          key={band.id}
          band={band}
          progress={progress}
          reduce={reduce}
        />
      ))}
    </svg>
  )
}
