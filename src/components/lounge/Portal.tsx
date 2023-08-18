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
  `
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
  `
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    uniform float time;
    
    void main() {
        float t = time * 0.001;
        
        // 샤이닝 컬러
        float shiningAlpha = (1. + sin(10. * (t * 0.7 + 1. - vUv.y))) / 2.;
        float noEdgeShiningAlpha = shiningAlpha * (1. - vUv.y) * 0.75;
        vec4 shineColor = vec4(1., 1., 1., noEdgeShiningAlpha);
        
        // 줄무니 컬러
        vec4 lineColor = vec4(1., 0., 0., ((1. + sin(75. * (vUv.x + t / 10.))) / 2.) * (1. - vUv.y));
        
        // 베이스 컬러
        vec4 baseColor = vec4(1., 0., 0., 1. - vUv.y);
        
        gl_FragColor = mix(baseColor, lineColor + shineColor * 0.8, 0.85);
        // gl_FragColor = shineColor;
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
