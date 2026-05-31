import { motion, useTransform, type MotionValue } from 'motion/react'

import { EIFFEL_ART, EIFFEL_TRANSFORM, EIFFEL_VIEWBOX } from './eiffelArt'

/**
 * Tour Eiffel (vrai dessin SVG importé) en « vue éclatée ». Le dessin est défini
 * une seule fois, puis découpé en bandes horizontales par `clipPath` ; chaque
 * bande dérive au scroll (translation + fondu) → la tour se déconstruit.
 * On n'anime que transform/opacity (GPU) ; repli statique si reduce.
 */

const NAVY = '#083d77'

// viewBox ≈ 0 0 567 759. Bandes [yStart, yEnd] et vecteur de dispersion.
interface Band {
  id: number
  y0: number
  y1: number
  dx: number
  dy: number
}

const BANDS: Band[] = [
  { id: 0, y0: 0, y1: 150, dx: 50, dy: -160 },
  { id: 1, y0: 150, y1: 320, dx: -130, dy: -70 },
  { id: 2, y0: 320, y1: 470, dx: 150, dy: -10 },
  { id: 3, y0: 470, y1: 610, dx: -150, dy: 70 },
  { id: 4, y0: 610, y1: 760, dx: 40, dy: 170 },
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
  const x = useTransform(progress, [0, 1], [0, band.dx])
  const y = useTransform(progress, [0, 1], [0, band.dy])
  const opacity = useTransform(progress, [0, 0.85], [1, 0.15])

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
    >
      <defs>
        {/* Le dessin, défini une fois et réutilisé par chaque bande. */}
        <g
          id="eiffel-art"
          transform={EIFFEL_TRANSFORM}
          fill={NAVY}
          fillOpacity={0.42}
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
