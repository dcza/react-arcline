# react-arcline

A professional-grade, headless-first SVG curve editor for React and TypeScript. Designed for high-precision animation and video editing timelines, modelled after industry-standard tools like Blender and Maya.

## Features

- **Blender-style handles** — aligned, broken, vector, and free tangent modes
- **Headless math hook** — `useCalculations` exposes `getValueAtTime(t)` for 60fps playback engines without re-rendering the SVG editor
- **Independent axis scaling** — zoom Time (X) and Value (Y) axes separately, essential for long-form video timelines
- **Normalized coordinate system** — `viewBounds` decouples world space from screen space

## Installation

```bash
npm install react-arcline
```

React ≥18 is a peer dependency.

## Usage

```tsx
import { Arcline } from 'react-arcline'
import type { CurveData } from 'react-arcline'

const curve: CurveData = {
  id: 'opacity',
  keyframes: [
    {
      id: 'kf0',
      position: { x: 0, y: 0 },
      handleIn:  { x: -0.1, y: 0 },
      handleOut: { x:  0.1, y: 0 },
      type: 'aligned',
    },
    {
      id: 'kf1',
      position: { x: 1, y: 1 },
      handleIn:  { x: -0.1, y: 0 },
      handleOut: { x:  0.1, y: 0 },
      type: 'aligned',
    },
  ],
  interpolation: 'bezier',
}

function App() {
  const [value, setValue] = useState(curve)

  return (
    <Arcline
      value={value}
      onChange={setValue}
      viewBounds={{ minTime: 0, maxTime: 1, minValue: 0, maxValue: 1 }}
    />
  )
}
```

### Headless value sampling

```tsx
import { useCalculations } from 'react-arcline'

function Player({ curve }: { curve: CurveData }) {
  const { getValueAtTime } = useCalculations(curve)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const opacity = getValueAtTime(playhead) // no SVG re-render
      applyToLayer(opacity)
    })
    return () => cancelAnimationFrame(id)
  })
}
```

## API

### `<Arcline>`

| Prop | Type | Description |
|------|------|-------------|
| `value` | `CurveData` | Controlled curve state |
| `onChange` | `(value: CurveData) => void` | Called on any edit |
| `viewBounds` | `ViewBounds` | Visible time/value range |
| `config.snapToGrid` | `boolean` | Snap keyframes to grid |
| `config.lockEndpoints` | `boolean` | Prevent moving first/last keyframe |

### Handle types

| Type | Behaviour |
|------|-----------|
| `vector` | Automatic direction pointing to neighbouring keyframes |
| `aligned` | Opposing handles locked to 180° — smooth interpolation |
| `broken` | Handles move independently — sharp directional changes |
| `free` | Manual control over both angle and weight (length) |

## Development

```bash
npm run storybook      # visual dev environment on :6006
npm run build          # compile library → dist/
npm run build:storybook
```

## License

MIT
