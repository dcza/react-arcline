import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Arcline } from './Arcline'
import type { CurveData } from '../types'

const defaultCurve: CurveData = {
  id: 'demo',
  keyframes: [
    { id: 'kf0', position: { x: 0,   y: 0   }, handleIn: { x: -0.1, y: 0     }, handleOut: { x: 0.15, y: 0.2  }, type: 'aligned' },
    { id: 'kf1', position: { x: 0.5, y: 0.8 }, handleIn: { x: -0.15, y: -0.1 }, handleOut: { x: 0.15, y: 0.1  }, type: 'aligned' },
    { id: 'kf2', position: { x: 1,   y: 1   }, handleIn: { x: -0.15, y: -0.2 }, handleOut: { x: 0.1,  y: 0    }, type: 'aligned' },
  ],
  interpolation: 'bezier',
}

const meta: Meta<typeof Arcline> = {
  title: 'Arcline',
  component: Arcline,
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof Arcline>

function ControlledArcline(props: Omit<React.ComponentProps<typeof Arcline>, 'value' | 'onChange'> & { initialCurve?: CurveData }) {
  const [curve, setCurve] = useState(props.initialCurve ?? defaultCurve)
  return <Arcline {...props} value={curve} onChange={setCurve} />
}

export const Default: Story = {
  render: () => (
    <ControlledArcline
      viewBounds={{ minTime: 0, maxTime: 1, minValue: 0, maxValue: 1 }}
      width={600}
      height={400}
    />
  ),
}

export const Linear: Story = {
  render: () => (
    <ControlledArcline
      initialCurve={{ ...defaultCurve, interpolation: 'linear' }}
      viewBounds={{ minTime: 0, maxTime: 1, minValue: 0, maxValue: 1 }}
      width={600}
      height={400}
    />
  ),
}

export const WideTimeline: Story = {
  render: () => (
    <ControlledArcline
      initialCurve={{
        id: 'wide',
        keyframes: [
          { id: 'kf0', position: { x: 0,   y: 0   }, handleIn: { x: -1, y: 0  }, handleOut: { x: 1, y: 0.5 }, type: 'aligned' },
          { id: 'kf1', position: { x: 5,   y: 1   }, handleIn: { x: -1, y: -0.5 }, handleOut: { x: 1, y: 0 }, type: 'aligned' },
          { id: 'kf2', position: { x: 10,  y: 0.3 }, handleIn: { x: -1, y: 0.2 }, handleOut: { x: 1, y: 0 }, type: 'aligned' },
        ],
        interpolation: 'bezier',
      }}
      viewBounds={{ minTime: 0, maxTime: 10, minValue: 0, maxValue: 1 }}
      width={800}
      height={300}
    />
  ),
}
