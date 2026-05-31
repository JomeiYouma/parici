import {
  motion,
  useTransform,
  type MotionValue,
} from 'motion/react'

/**
 * Tour Eiffel stylisée en « vue éclatée ». Chaque pièce est un fragment SVG qui
 * se disloque au scroll (translation + rotation + fondu), façon schéma technique.
 * Tout est piloté par `progress` (0 = tour assemblée, 1 = éclatée).
 */

interface Piece {
  id: string
  d: string
  /** Vecteur de dispersion (unités du viewBox) et rotation cible. */
  dx: number
  dy: number
  rotate: number
  /** Pièce d'accent (pointe magenta). */
  accent?: boolean
  /** Tracé non rempli (l'arche). */
  outline?: boolean
}

// viewBox 0 0 240 346 — silhouette assemblée, centrée sur x = 120.
const PIECES: Piece[] = [
  { id: 'spire', d: 'M120 14 L124 64 L116 64 Z', dx: 0, dy: -190, rotate: -6, accent: true },
  { id: 'top', d: 'M116 66 L124 66 L130 116 L110 116 Z', dx: 70, dy: -126, rotate: 12 },
  { id: 'platform-2', d: 'M104 116 L136 116 L136 126 L104 126 Z', dx: 146, dy: -48, rotate: 9 },
  { id: 'body', d: 'M110 126 L130 126 L150 206 L90 206 Z', dx: -120, dy: -18, rotate: -10 },
  { id: 'platform-1', d: 'M80 200 L160 200 L160 214 L80 214 Z', dx: -152, dy: 56, rotate: -7 },
  { id: 'leg-left', d: 'M112 214 L96 214 L46 332 L74 332 Z', dx: -94, dy: 132, rotate: -13 },
  { id: 'leg-right', d: 'M128 214 L144 214 L194 332 L166 332 Z', dx: 94, dy: 132, rotate: 13 },
  { id: 'arch', d: 'M74 300 Q120 250 166 300', dx: 0, dy: 104, rotate: 0, outline: true },
]

const NAVY = '#083d77'
const MAGENTA = '#da4167'

function TowerPiece({
  piece,
  progress,
  reduce,
}: {
  piece: Piece
  progress: MotionValue<number>
  reduce: boolean
}) {
  const x = useTransform(progress, [0, 1], [0, piece.dx])
  const y = useTransform(progress, [0, 1], [0, piece.dy])
  const rotate = useTransform(progress, [0, 1], [0, piece.rotate])
  const opacity = useTransform(progress, [0, 0.85], [1, 0.16])

  const fill = piece.outline ? 'none' : piece.accent ? MAGENTA : NAVY

  return (
    <motion.path
      d={piece.d}
      fill={fill}
      fillOpacity={piece.accent ? 0.85 : piece.outline ? 0 : 0.12}
      stroke={piece.accent ? 'none' : NAVY}
      strokeOpacity={piece.outline ? 0.45 : 0.5}
      strokeWidth={piece.outline ? 1.4 : 1.1}
      strokeLinejoin="round"
      strokeLinecap="round"
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
    />
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
      viewBox="0 0 240 346"
      className={className}
      role="img"
      aria-label="Tour Eiffel stylisée"
      preserveAspectRatio="xMidYMax meet"
    >
      {PIECES.map((piece) => (
        <TowerPiece
          key={piece.id}
          piece={piece}
          progress={progress}
          reduce={reduce}
        />
      ))}
    </svg>
  )
}
