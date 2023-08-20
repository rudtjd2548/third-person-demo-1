import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { KernelSize, Resolution } from 'postprocessing'

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={2} // The bloom intensity.
        blurPass={undefined} // A blur pass.
        kernelSize={KernelSize.LARGE} // blur kernel size
        luminanceThreshold={0.1} // luminance threshold. Raise this value to mask out darker elements in the scene.
        luminanceSmoothing={0.9} // smoothness of the luminance threshold. Range is [0, 1]
        mipmapBlur={true} // Enables or disables mipmap blur.
        resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
        resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
      />
    </EffectComposer>
  )
}
