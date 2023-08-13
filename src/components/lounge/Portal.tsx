import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export default function Portal({ children, ...props }) {
  const ref = useRef<Mesh>(null!)

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
    }),
    [],
  )

  const frag = useMemo(
    () => `
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    uniform float time;
    
    void main() {
        float t = time * 0.003;
        float v = (1. + pow(sin(t - vUv.y), 5.)) / 3.5;
        float waveAlpha = smoothstep(0.4, 0.8, v) / 2.;
        float finalWaveAlpha = waveAlpha * (1.0 - smoothstep(0.0, 0.95, vUv.y));
        gl_FragColor = vec4(.3, .3, .3, finalWaveAlpha);
        float defaultAlpha = (1. - pow(vUv.y, 2.)) * 0.15;
        gl_FragColor += vec4(1.0, 0.0, 0.0, defaultAlpha);
        
    }
  `,
    [],
  )

  const vert = useMemo(
    () => `
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
    [],
  )

  useFrame((state) => {
    if (!ref.current) return
    ref.current.material.uniforms.time.value = state.clock.elapsedTime * 1000
  })

  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[2.5, 1.25, 5, 16, 1, true]} />
      <shaderMaterial
        uniforms={uniforms}
        fragmentShader={frag}
        vertexShader={vert}
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
      {children}
    </mesh>
  )
}
