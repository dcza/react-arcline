import type { ArclineProps } from '../types'
import { worldToScreen } from '../core/coords'
import { segmentControlPoints } from '../core/math'
import { useArcline } from '../hooks/useArcline'
import { KeyframeNode } from './KeyframeNode'

export function Arcline(props: ArclineProps) {
  const { value, viewBounds, width = 600, height = 400 } = props
  const size = { width, height }
  const {
    selectedIds, deselect,
    onKeyframePointerDown, onHandlePointerDown,
    onSvgPointerMove, onSvgPointerUp,
  } = useArcline({ ...props, width, height })

  const kfs = [...value.keyframes].sort((a, b) => a.position.x - b.position.x)

  const curvePath = kfs.length >= 2
    ? kfs.slice(0, -1).map((kfA, i) => {
        const kfB = kfs[i + 1]
        const [p0, p1, p2, p3] = segmentControlPoints(kfA, kfB)
        const s0 = worldToScreen(p0, viewBounds, size)
        const s1 = worldToScreen(p1, viewBounds, size)
        const s2 = worldToScreen(p2, viewBounds, size)
        const s3 = worldToScreen(p3, viewBounds, size)
        const seg = `C ${s1.x} ${s1.y} ${s2.x} ${s2.y} ${s3.x} ${s3.y}`
        return i === 0 ? `M ${s0.x} ${s0.y} ${seg}` : seg
      }).join(' ')
    : ''

  return (
    <svg
      width={width}
      height={height}
      style={{ display: 'block', background: '#111' }}
      onPointerMove={onSvgPointerMove}
      onPointerUp={onSvgPointerUp}
      onPointerDown={e => { if (e.target === e.currentTarget) deselect() }}
    >
      {[0, 1].map(v => {
        const y = worldToScreen({ x: 0, y: v }, viewBounds, size).y
        return (
          <line key={v} x1={0} y1={y} x2={width} y2={y}
            stroke="#fff" strokeOpacity={0.08} strokeWidth={1} />
        )
      })}

      {curvePath && (
        <path d={curvePath} fill="none" stroke="#006FEE" strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round" />
      )}

      {kfs.map(kf => (
        <KeyframeNode
          key={kf.id}
          keyframe={kf}
          viewBounds={viewBounds}
          size={size}
          selected={selectedIds.has(kf.id)}
          onPointerDown={e => onKeyframePointerDown(kf.id, e)}
          onHandlePointerDown={(which, e) => onHandlePointerDown(kf.id, which, e)}
        />
      ))}
    </svg>
  )
}
