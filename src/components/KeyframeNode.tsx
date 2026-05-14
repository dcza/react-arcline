import type { PointerEvent } from 'react'
import type { Keyframe, ViewBounds } from '../types'
import type { ScreenSize } from '../core/coords'
import { worldToScreen } from '../core/coords'
import { Handle } from './Handle'

interface KeyframeNodeProps {
  keyframe: Keyframe
  viewBounds: ViewBounds
  size: ScreenSize
  selected: boolean
  onPointerDown: (e: PointerEvent<SVGCircleElement>) => void
  onHandlePointerDown: (which: 'in' | 'out', e: PointerEvent<SVGCircleElement>) => void
}

export function KeyframeNode({
  keyframe, viewBounds, size, selected, onPointerDown, onHandlePointerDown,
}: KeyframeNodeProps) {
  const pos = worldToScreen(keyframe.position, viewBounds, size)
  const inScreen  = worldToScreen(
    { x: keyframe.position.x + keyframe.handleIn.x,  y: keyframe.position.y + keyframe.handleIn.y  },
    viewBounds, size,
  )
  const outScreen = worldToScreen(
    { x: keyframe.position.x + keyframe.handleOut.x, y: keyframe.position.y + keyframe.handleOut.y },
    viewBounds, size,
  )

  return (
    <g>
      {selected && (
        <>
          <line x1={inScreen.x}  y1={inScreen.y}  x2={pos.x} y2={pos.y} stroke="#f08" strokeOpacity={0.45} strokeWidth={1} />
          <line x1={outScreen.x} y1={outScreen.y} x2={pos.x} y2={pos.y} stroke="#0ab" strokeOpacity={0.45} strokeWidth={1} />
          <Handle position={inScreen}  color="#f08" onPointerDown={e => onHandlePointerDown('in',  e)} />
          <Handle position={outScreen} color="#0ab" onPointerDown={e => onHandlePointerDown('out', e)} />
        </>
      )}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={5}
        fill={selected ? '#006FEE' : '#fff'}
        stroke="#006FEE"
        strokeWidth={1.5}
        style={{ cursor: 'move' }}
        onPointerDown={onPointerDown}
      />
    </g>
  )
}
