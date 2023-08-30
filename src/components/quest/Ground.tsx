import { MeshReflectorMaterial, useTexture } from '@react-three/drei'
import surfaceNormalMap from '@static/media/images/SurfaceImperfections003_1K_Normal.jpg'

export default function Ground() {
  const [normal] = useTexture([surfaceNormalMap])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <MeshReflectorMaterial
        resolution={1024}
        mirror={1}
        distortionMap={normal}
        distortion={0.15}
        depthScale={4}
        minDepthThreshold={0}
        maxDepthThreshold={8}
        mixStrength={0.5}
        mixContrast={1}
        color='#00FFFF'
      />
    </mesh>
  )
}
