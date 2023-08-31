import { DepthOfField, EffectComposer, Noise, Sepia } from '@react-three/postprocessing'

export default function Effects() {
  return (
    <EffectComposer>
      <Noise premultiply={true} opacity={0.3} />
      <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={4} />
      <Sepia intensity={0.2} />
    </EffectComposer>
  )
}
