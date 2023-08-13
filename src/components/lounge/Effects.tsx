import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import { useControls } from 'leva'

export default function Effects() {
  const controls = useControls('effects', {
    focusDistance: { min: 0, max: 10, step: 0.1, value: 0 },
    focalLength: { min: 0, max: 10, step: 0.01, value: 0.18 },
    bokehScale: { min: 0, max: 10, step: 0.1, value: 5 },
  })
  return (
    <EffectComposer>
      <DepthOfField
        focusDistance={controls.focusDistance} // where to focus
        focalLength={controls.focalLength} // focal length
        bokehScale={controls.bokehScale} // bokeh size
      />
    </EffectComposer>
  )
}
