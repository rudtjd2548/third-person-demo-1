import { useRef } from 'react'
import { shaderMaterial, useGLTF } from '@react-three/drei'
import { extend, ReactThreeFiber, RootState, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import glb from '/static/media/models/letsee.draco.glb?url'

useGLTF.preload(glb)

export default function Letsee() {
  const { nodes }: any = useGLTF(glb)
  const objectRef = useRef<THREE.Mesh>(null!)
  useFrame((state: RootState): void => {
    objectRef.current.rotation.y = state.clock.elapsedTime
  })

  return (
    <mesh ref={objectRef} geometry={nodes['Letsee'].geometry} castShadow={true}>
      <hologramMaterial
        key={HologramMaterial.key}
        transparent={true}
        depthWrite={false}
        depthTest={false}
        side={THREE.DoubleSide}
      />
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
      float alpha = 3.5 - (sin(300.0 * vUv.x) + 1.0) * ((sin(300.0 * vUv.y) + 1.0));
      alpha = 1.0 - clamp(alpha, 0.0, 1.0);

      gl_FragColor = vec4(0.0, 1.0, 0.6, alpha);
    }  
  `,
)

extend({ HologramMaterial })

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
