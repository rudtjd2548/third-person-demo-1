import { DepthOfField, EffectComposer, Noise, Sepia } from '@react-three/postprocessing'

export default function Effects() {
  return (
    <EffectComposer>
      <Noise premultiply={true} />
      <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={7} />
      <Sepia
        intensity={0.4} // sepia intensity
      />
    </EffectComposer>
  )
}
