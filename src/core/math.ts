import type { Keyframe, Vec2 } from '../types'

function evalCubic(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const mt = 1 - t
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3
}

function evalCubicDeriv(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const mt = 1 - t
  return 3 * mt * mt * (p1 - p0) + 6 * mt * t * (p2 - p1) + 3 * t * t * (p3 - p2)
}

export function segmentControlPoints(kfA: Keyframe, kfB: Keyframe): [Vec2, Vec2, Vec2, Vec2] {
  return [
    kfA.position,
    { x: kfA.position.x + kfA.handleOut.x, y: kfA.position.y + kfA.handleOut.y },
    { x: kfB.position.x + kfB.handleIn.x,  y: kfB.position.y + kfB.handleIn.y },
    kfB.position,
  ]
}

function solveT(kfA: Keyframe, kfB: Keyframe, targetX: number): number {
  const [p0, p1, p2, p3] = segmentControlPoints(kfA, kfB)
  // Normalised initial guess based on linear proportion of the X range
  let t = (targetX - p0.x) / (p3.x - p0.x)

  for (let i = 0; i < 20; i++) {
    const err = evalCubic(p0.x, p1.x, p2.x, p3.x, t) - targetX
    if (Math.abs(err) < 1e-5) break
    const d = evalCubicDeriv(p0.x, p1.x, p2.x, p3.x, t)
    if (Math.abs(d) < 1e-10) break
    t = Math.max(0, Math.min(1, t - err / d))
  }

  return t
}

export function getSegmentValue(kfA: Keyframe, kfB: Keyframe, targetX: number): number {
  const [p0, p1, p2, p3] = segmentControlPoints(kfA, kfB)
  const t = solveT(kfA, kfB, targetX)
  return evalCubic(p0.y, p1.y, p2.y, p3.y, t)
}
