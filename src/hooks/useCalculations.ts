import { useCallback } from 'react'
import type { CurveData } from '../types'
import { getSegmentValue } from '../core/math'

export interface CalculationsResult {
  getValueAtTime: (time: number) => number
}

export function useCalculations(curve: CurveData): CalculationsResult {
  const getValueAtTime = useCallback((time: number): number => {
    const kfs = [...curve.keyframes].sort((a, b) => a.position.x - b.position.x)

    if (kfs.length === 0) return 0
    if (kfs.length === 1 || time <= kfs[0].position.x) return kfs[0].position.y
    if (time >= kfs[kfs.length - 1].position.x) return kfs[kfs.length - 1].position.y

    const segIdx = kfs.findIndex((_, i) =>
      i < kfs.length - 1 && kfs[i + 1].position.x >= time
    )
    const kfA = kfs[segIdx]
    const kfB = kfs[segIdx + 1]

    if (curve.interpolation === 'linear') {
      const alpha = (time - kfA.position.x) / (kfB.position.x - kfA.position.x)
      return kfA.position.y + (kfB.position.y - kfA.position.y) * alpha
    }

    if (curve.interpolation === 'step') return kfA.position.y

    return getSegmentValue(kfA, kfB, time)
  }, [curve])

  return { getValueAtTime }
}
