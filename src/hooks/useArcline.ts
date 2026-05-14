import { useState, useRef, useCallback, useMemo } from 'react'
import type { PointerEvent } from 'react'
import type { ArclineProps, Vec2 } from '../types'
import { scaleDeltaToWorld } from '../core/coords'

interface DragState {
  type: 'keyframe' | 'handle-in' | 'handle-out'
  id: string
  startScreenPos: Vec2
  startHandlePos: Vec2
}

export interface ArclineControls {
  selectedIds: Set<string>
  deselect: () => void
  onKeyframePointerDown: (id: string, e: PointerEvent<Element>) => void
  onHandlePointerDown: (id: string, which: 'in' | 'out', e: PointerEvent<Element>) => void
  onSvgPointerMove: (e: PointerEvent<Element>) => void
  onSvgPointerUp: () => void
}

export function useArcline(props: ArclineProps): ArclineControls {
  const { value, onChange, viewBounds, width = 600, height = 400 } = props
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const drag = useRef<DragState | null>(null)
  const size = useMemo(() => ({ width, height }), [width, height])

  const deselect = useCallback(() => setSelectedIds(new Set()), [])

  const onKeyframePointerDown = useCallback((id: string, e: PointerEvent<Element>) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    const kf = value.keyframes.find(k => k.id === id)
    if (!kf) return
    drag.current = {
      type: 'keyframe',
      id,
      startScreenPos: { x: e.clientX, y: e.clientY },
      startHandlePos: { ...kf.position },
    }
    setSelectedIds(prev => e.shiftKey ? new Set([...prev, id]) : new Set([id]))
  }, [value.keyframes])

  const onHandlePointerDown = useCallback((id: string, which: 'in' | 'out', e: PointerEvent<Element>) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    const kf = value.keyframes.find(k => k.id === id)
    if (!kf) return
    drag.current = {
      type: which === 'in' ? 'handle-in' : 'handle-out',
      id,
      startScreenPos: { x: e.clientX, y: e.clientY },
      startHandlePos: which === 'in' ? { ...kf.handleIn } : { ...kf.handleOut },
    }
  }, [value.keyframes])

  const onSvgPointerMove = useCallback((e: PointerEvent<Element>) => {
    if (!drag.current) return
    const { type, id, startScreenPos, startHandlePos } = drag.current
    const delta = scaleDeltaToWorld(
      { x: e.clientX - startScreenPos.x, y: e.clientY - startScreenPos.y },
      viewBounds,
      size,
    )
    const newPos = { x: startHandlePos.x + delta.x, y: startHandlePos.y + delta.y }

    const keyframes = value.keyframes.map(kf => {
      if (kf.id !== id) return kf

      if (type === 'keyframe') return { ...kf, position: newPos }

      if (type === 'handle-out') {
        if (kf.type === 'aligned') {
          const len = Math.hypot(kf.handleIn.x, kf.handleIn.y)
          const outLen = Math.hypot(newPos.x, newPos.y)
          const newIn = outLen > 1e-6
            ? { x: (-newPos.x / outLen) * len, y: (-newPos.y / outLen) * len }
            : kf.handleIn
          return { ...kf, handleOut: newPos, handleIn: newIn }
        }
        return { ...kf, handleOut: newPos }
      }

      if (type === 'handle-in') {
        if (kf.type === 'aligned') {
          const len = Math.hypot(kf.handleOut.x, kf.handleOut.y)
          const inLen = Math.hypot(newPos.x, newPos.y)
          const newOut = inLen > 1e-6
            ? { x: (-newPos.x / inLen) * len, y: (-newPos.y / inLen) * len }
            : kf.handleOut
          return { ...kf, handleIn: newPos, handleOut: newOut }
        }
        return { ...kf, handleIn: newPos }
      }

      return kf
    })

    onChange({ ...value, keyframes })
  }, [value, onChange, viewBounds, size])

  const onSvgPointerUp = useCallback(() => { drag.current = null }, [])

  return { selectedIds, deselect, onKeyframePointerDown, onHandlePointerDown, onSvgPointerMove, onSvgPointerUp }
}
