import { shaderMaterial, useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import { extend, ReactThreeFiber, RootState, useFrame } from '@react-three/fiber'
import logoGlb from '/static/media/models/letsee.draco.glb?url'
useGLTF.preload(logoGlb)

export default function Logo() {
  const { nodes }: any = useGLTF(logoGlb)
  const objectRef = useRef<THREE.Mesh>(null!)
  useFrame((state: RootState): void => {
    objectRef.current.rotation.y = state.clock.elapsedTime
  })

  return (
    <mesh ref={objectRef} geometry={nodes['Letsee'].geometry} position={[0, 5, 0]} scale={0.6}>
      <hologramMaterial key={HologramMaterial.key} transparent={true} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

const HologramMaterial: any = shaderMaterial(
  {},
  `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }  
  `,
  `
    varying vec2 vUv;
  
    void main() {
      float alpha = 3.0 - (sin(400.0 * vUv.x) + 1.0) * ((sin(400.0 * vUv.y) + 1.0));
      alpha = 1.0 - clamp(alpha, 0.0, 1.0);

      gl_FragColor = vec4(0.0, 0.25, 1.0, alpha);
    }  
  `,
)

declare global {
  namespace JSX {
    interface IntrinsicElements {
      hologramMaterial: ReactThreeFiber.Node<
        typeof HologramMaterial & JSX.IntrinsicElements['shaderMaterial'],
        typeof HologramMaterial
      >
    }
  }
}

extend({ HologramMaterial })
