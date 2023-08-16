import React, { useRef } from 'react'
import * as THREE from 'three'
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

interface PortalProps {
  children: React.ReactNode
  [key: string]: any
}

export default function Portal({ children, ...props }: PortalProps) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ref.current) return
    const { uniforms }: any = ref.current.material
    uniforms.time.value = state.clock.elapsedTime * 1000
  })

  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[3, 1.5, 7, 16, 1, true]} />
      <portalMaterial key={PortalMaterial.key} transparent={true} depthWrite={false} side={THREE.DoubleSide} />
      {children}
    </mesh>
  )
}

const PortalMaterial = shaderMaterial(
  {
    time: { value: 0 } as any,
  },
  /* glsl */ `
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
        vPos = position;
        vNormal = normal;
        vUv = uv;
    
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  /* glsl */ `
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    uniform float time;
    
    void main() {
        float t = time * 0.002;
        float v = (1. + pow(sin(t - vUv.y), 25.)) / 3.;
        float waveAlpha = smoothstep(0.4, 0.8, v) / 2.;
        float finalWaveAlpha = waveAlpha * (1.0 - smoothstep(0.0, 0.95, vUv.y));
        gl_FragColor = vec4(.1, .1, .1, finalWaveAlpha);
        float defaultAlpha = (1. - pow(vUv.y, 2.)) * 0.2;
        gl_FragColor += vec4(1.0, 0.0, 0.0, defaultAlpha);
    }
  `,
)

extend({ PortalMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      portalMaterial: ReactThreeFiber.Node<
        typeof PortalMaterial & JSX.IntrinsicElements['shaderMaterial'],
        typeof PortalMaterial
      >
    }
  }
}
