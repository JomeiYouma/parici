import { motion, useTransform, type MotionValue } from 'motion/react'

import { EIFFEL_ART, EIFFEL_TRANSFORM, EIFFEL_VIEWBOX } from './eiffelArt'

/**
 * Tour Eiffel (vrai dessin SVG importé) en « vue éclatée ». Le dessin est défini
 * une fois puis découpé en bandes horizontales (clipPath). Au scroll, la tour
 * tient d'abord sa forme, puis ses bandes fuient vers l'extérieur ET vers le bas
 * en suivant des trajectoires courbes (translation latérale + chute façon
 * gravité + rotation autour du cœur de la tour), avant de s'estomper.
 *
 * Le haut de la tour est atténué en permanence (masque dégradé) pour garder le
 * titre lisible. On n'anime que transform/opacity (GPU) ; repli statique si reduce.
 */

const NAVY = '#083d77'

interface Band {
  id: number
  y0: number
  y1: number
  /** Décalage latéral final (alterné = dispersion vers l'extérieur). */
  dx: number
  /** Chute finale (vers le bas, plus forte pour les bandes basses). */
  dy: number
  /** Rotation finale (tumbling autour du cœur de la tour). */
  rot: number
}

// viewBox ≈ 0 0 567 759. Les bandes partent vers des côtés opposés, et plus bas
// à mesure qu'on descend → effet d'effondrement courbe et aéré.
const BANDS: Band[] = [
  { id: 0, y0: 0, y1: 150, dx: -150, dy: 70, rot: -12 },
  { id: 1, y0: 150, y1: 320, dx: 200, dy: 110, rot: 12 },
  { id: 2, y0: 320, y1: 470, dx: -240, dy: 150, rot: -10 },
  { id: 3, y0: 470, y1: 610, dx: 210, dy: 200, rot: 13 },
  { id: 4, y0: 610, y1: 760, dx: -170, dy: 260, rot: -9 },
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
  // Courbe : départ latéral quasi linéaire, chute « gravité » (lente puis rapide)
  // → la combinaison dessine une parabole. La rotation ajoute le tumbling.
  const x = useTransform(progress, [0, 0.55, 1], [0, band.dx * 0.4, band.dx])
  const y = useTransform(progress, [0, 0.55, 1], [0, band.dy * 0.12, band.dy])
  const rotate = useTransform(progress, [0, 1], [0, band.rot])
  // Visible longtemps (jusqu'à 70 %), puis fondu complet avant la section suivante.
  const opacity = useTransform(progress, [0, 0.7, 1], [1, 1, 0])

  return (
    <motion.g
      style={
        reduce
          ? undefined
          : {
              x,
              y,
              rotate,
              opacity,
              transformBox: 'fill-box',
              transformOrigin: 'center',
            }
      }
    >
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
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Fondu du haut baké dans le dessin (indépendant des transforms) :
            le sommet reste atténué pour la lisibilité du titre. */}
        <linearGradient id="eiffel-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.14" stopColor="#1f1f1f" />
          <stop offset="0.4" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id="eiffel-topfade" maskContentUnits="objectBoundingBox">
          <rect x="0" y="0" width="1" height="1" fill="url(#eiffel-fade)" />
        </mask>

        {/* Le dessin, défini une fois et réutilisé par chaque bande. */}
        <g
          id="eiffel-art"
          transform={EIFFEL_TRANSFORM}
          fill={NAVY}
          mask="url(#eiffel-topfade)"
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
