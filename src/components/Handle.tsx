import type { PointerEvent } from 'react'
import type { Vec2 } from '../types'

interface HandleProps {
  position: Vec2
  color: string
  onPointerDown: (e: PointerEvent<SVGCircleElement>) => void
}

export function Handle({ position, color, onPointerDown }: HandleProps) {
  return (
    <circle
      cx={position.x}
      cy={position.y}
      r={4.5}
      fill={color}
      style={{ cursor: 'grab' }}
      onPointerDown={onPointerDown}
    />
  )
}
