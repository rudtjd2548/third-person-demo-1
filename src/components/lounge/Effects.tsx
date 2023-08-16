import { Bloom, EffectComposer, Noise } from '@react-three/postprocessing'
import { KernelSize, Resolution, BlendFunction } from 'postprocessing'

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1} // The bloom intensity.
        blurPass={undefined} // A blur pass.
        kernelSize={KernelSize.LARGE} // blur kernel size
        luminanceThreshold={1} // luminance threshold. Raise this value to mask out darker elements in the scene.
        luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
        mipmapBlur={true} // Enables or disables mipmap blur.
        resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
        resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
      />
      <Noise
        opacity={0.3}
        premultiply // enables or disables noise premultiplication
        blendFunction={BlendFunction.ADD} // blend mode
      />
    </EffectComposer>
  )
}
