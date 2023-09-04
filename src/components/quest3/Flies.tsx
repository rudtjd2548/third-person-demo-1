import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { randomNumBetween } from '@src/utils/utils.ts'
import { shaderMaterial } from '@react-three/drei'
import { cp_noise } from '@src/utils/glsl.ts'
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber'

const count = 1000
const radius = [5, 50]

export default function Flies() {
  const ref = useRef<THREE.Mesh>(null!)

  useLayoutEffect(() => {
    const particleGeo = new THREE.PlaneGeometry(1, 1)
    const geo = new THREE.InstancedBufferGeometry()
    geo.instanceCount = count
    geo.setAttribute('position', particleGeo.getAttribute('position'))
    geo.index = particleGeo.index

    const pos = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      let theta = Math.random() * Math.PI * 2
      let r = randomNumBetween(radius[0], radius[1])
      let x = r * Math.cos(theta)
      let y = 0
      let z = r * Math.sin(theta)
      pos.set([x, y, z], i * 3)
    }
    geo.setAttribute('pos', new THREE.InstancedBufferAttribute(pos, 3, false))

    ref.current.geometry = geo

    return () => {
      particleGeo.dispose()
      geo.dispose()
    }
  }, [])

  useFrame((state) => {
    const { uniforms }: any = ref.current.material
    uniforms.time.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={ref}>
      <fliesMaterial
        key={FliesMaterial.key}
        side={THREE.DoubleSide}
        transparent={true}
        depthWrite={false}
        // imageTexture={texture}
      />
    </mesh>
  )
}

const FliesMaterial: any = shaderMaterial(
  {
    imageTexture: null,
    time: 0,
  },
  `
  uniform float time;
  varying vec2 vUv;
  attribute vec3 pos;
  varying float particle_size;

  ${cp_noise}
  
  void main() {
    vUv = position.xy + vec2(0.5);
    
    particle_size = 0.5 + cnoise(pos * 5.) * 0.5 + 3.0;
    float t = time + particle_size * 1000.;
  
    vec3 world_pos = pos;
    world_pos.y += 0. + 20. * fract(t * 0.005 * particle_size);
    world_pos.x += sin(t * 0.05 * (normalize(pos).x + particle_size)) * 2.2;
    world_pos.z += cos(t * 0.05 * (normalize(pos).z + particle_size)) * 2.2;
    
    vec3 particle_position = (modelMatrix * vec4(world_pos, 1.)).xyz;
  
    vec4 view_pos = viewMatrix * vec4(particle_position, 1.);
  
    // 각각의 파티클의 스케일 조정 : 각 파티클 정보를 담는 position을 이용
    view_pos.xyz += position * particle_size * 0.04;
  
    gl_Position = projectionMatrix * view_pos;
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( finalpos, 1.0 );
  }
`,
  `
  uniform float time;
  varying vec2 vUv;
  varying float particle_size;
  
  void main() {
    float t = time * 0.5 + particle_size * 1000.;
    
    float dist = distance(vUv.xy, vec2(0.5));
    float d = clamp(0.5 - dist, 0., 1.);
    float small_d = step((dist - 0.5), -0.44);
    vec4 baseColor = mix(vec4(0.1, 0.5, 1., d * 1.0), vec4(small_d), 0.5);
    gl_FragColor = baseColor;
    gl_FragColor.a *= 0.1 + clamp(1. - (sin(1000. * particle_size + 5. * t) + 1.), 0., 0.9);
  }
`,
)

declare global {
  namespace JSX {
    interface IntrinsicElements {
      fliesMaterial: ReactThreeFiber.Node<
        typeof FliesMaterial & JSX.IntrinsicElements['shaderMaterial'],
        typeof FliesMaterial
      >
    }
  }
}

extend({ FliesMaterial })
