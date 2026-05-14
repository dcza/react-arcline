import type { Vec2, ViewBounds } from '../types'

export interface ScreenSize {
  width: number
  height: number
}

export function worldToScreen(pt: Vec2, bounds: ViewBounds, size: ScreenSize): Vec2 {
  return {
    x: ((pt.x - bounds.minTime)  / (bounds.maxTime  - bounds.minTime))  * size.width,
    // SVG Y-axis is inverted relative to value space
    y: size.height - ((pt.y - bounds.minValue) / (bounds.maxValue - bounds.minValue)) * size.height,
  }
}

export function screenToWorld(pt: Vec2, bounds: ViewBounds, size: ScreenSize): Vec2 {
  return {
    x: (pt.x / size.width)  * (bounds.maxTime  - bounds.minTime)  + bounds.minTime,
    y: ((size.height - pt.y) / size.height) * (bounds.maxValue - bounds.minValue) + bounds.minValue,
  }
}

export function scaleDeltaToWorld(delta: Vec2, bounds: ViewBounds, size: ScreenSize): Vec2 {
  return {
    x:  (delta.x / size.width)  * (bounds.maxTime  - bounds.minTime),
    y: -(delta.y / size.height) * (bounds.maxValue - bounds.minValue),
  }
}
