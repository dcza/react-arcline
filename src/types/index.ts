export type HandleType = 'aligned' | 'broken' | 'vector' | 'free'

export interface Vec2 {
  x: number
  y: number
}

export interface Keyframe {
  id: string
  position: Vec2
  handleIn: Vec2
  handleOut: Vec2
  type: HandleType
  selected?: boolean
}

export interface CurveData {
  id: string
  keyframes: Keyframe[]
  interpolation: 'bezier' | 'linear' | 'step'
}

export interface ViewBounds {
  minTime: number
  maxTime: number
  minValue: number
  maxValue: number
}

export interface ArclineConfig {
  snapToGrid?: boolean
  lockEndpoints?: boolean
}

export interface ArclineProps {
  value: CurveData
  onChange: (value: CurveData) => void
  viewBounds: ViewBounds
  width?: number
  height?: number
  config?: ArclineConfig
}
