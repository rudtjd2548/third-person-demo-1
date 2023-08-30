import React, { useEffect } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'
import { shaderMaterial, useGLTF } from '@react-three/drei'
import { extend, ReactThreeFiber, RootState, useFrame } from '@react-three/fiber'
import { useAppSelector } from '@src/redux/store.ts'
import { lerp } from '@src/utils/utils.ts'
import * as THREE from 'three'
import { noise } from '@src/utils/glsl.ts'

import logoGlb from '/static/media/models/letsee.draco.glb?url'
useGLTF.preload(logoGlb)

export default function LogoScene() {
  return (
    <React.Suspense>
      <PerspectiveCamera position={[0, 2.5, 13]} makeDefault={true} />
      <LogoSphere />
      <Logo />
    </React.Suspense>
  )
}

function Logo() {
  const { nodes }: any = useGLTF(logoGlb)
  const objectRef = useRef<THREE.Mesh>(null!)
  useFrame((state: RootState): void => {
    objectRef.current.rotation.y = state.clock.elapsedTime
  })

  return (
    <mesh ref={objectRef} geometry={nodes['Letsee'].geometry}>
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
      float alpha = 3.5 - (sin(300.0 * vUv.x) + 1.0) * ((sin(300.0 * vUv.y) + 1.0));
      alpha = 1.0 - clamp(alpha, 0.0, 1.0);

      gl_FragColor = vec4(0.0, 0.8, 1.0, alpha);
    }  
  `,
)

function LogoSphere() {
  const { scroll }: any = useAppSelector((state) => state.quest)
  const ref = useRef<THREE.Mesh>(null!)
  const targetAmplitude = useRef(0.3!)

  useEffect(() => {
    const { uniforms }: any = ref.current.material
    uniforms.amplitude.value = 1.7
    targetAmplitude.current = 0.3
  }, [scroll])

  useFrame((state) => {
    const { uniforms }: any = ref.current.material
    uniforms.time.value = state.clock.elapsedTime
    uniforms.amplitude.value = lerp(uniforms.amplitude.value, targetAmplitude.current, 0.05)
  })

  return (
    <mesh ref={ref} position={[0, 2.5, 0]} rotation={[0, 0, 0]} castShadow={true}>
      <sphereGeometry args={[4, 32]} />
      <logoSphereMaterial key={LogoSphereMaterial.key} transparent={true} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

const LogoSphereMaterial: any = shaderMaterial(
  {
    time: 0,
    amplitude: 0.3,
  },
  `
    ${noise}
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 eyeVector;
    varying float vNoise;
    
    uniform float time;
    uniform float amplitude;
    
    void main() {
      vUv = uv;
      vNormal = normal;
      
      float amplitude = amplitude;
      vec3 frequency = vec3(1.0);
      vNoise = pnoise(-position.xyz * frequency + vec3(time * 1.5), vec3(7.));
      vec3 newPosition = position + normal * vNoise * amplitude;
      
      vec4 worldPosition = modelViewMatrix * vec4( newPosition, 1.0);
      eyeVector = normalize(worldPosition.xyz - cameraPosition);
  
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }  
  `,
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 eyeVector;
    varying float vNoise;
  
    void main() {
      // a = [base_noise]
      float baseStrength = 0.0;
      float noiseStrength = 100.0;
      float noiseAlpha = baseStrength + vNoise * noiseStrength;
      
      // a = [base_noise] + [fresnel]
      float fresnel = clamp(pow(0.5 + dot(eyeVector, vNormal), 2.), 0.0, 1.0); // 카메라 앵글에 따른 모서리 투명도
      fresnel = smoothstep(0.2, 0.0, fresnel);
      float fresnelNoiseAlpha = mix(noiseAlpha, fresnel, 0.97) * 0.35;
      
      // a = [base_noise] + [fresnel] + [dot]
      float dotAlpha = 3.5 - (sin(300.0 * vUv.x) + 1.0) * ((sin(300.0 * vUv.y) + 1.0));
      dotAlpha = 1.0 - clamp(dotAlpha, 0.0, 1.0);
      float finalAlpha = mix(0., fresnelNoiseAlpha, dotAlpha);
  
      gl_FragColor = vec4(0.0, 0.8, 1.0, finalAlpha);
    }  
  `,
)

declare global {
  namespace JSX {
    interface IntrinsicElements {
      logoSphereMaterial: ReactThreeFiber.Node<
        typeof LogoSphereMaterial & JSX.IntrinsicElements['shaderMaterial'],
        typeof LogoSphereMaterial
      >
      hologramMaterial: ReactThreeFiber.Node<
        typeof HologramMaterial & JSX.IntrinsicElements['shaderMaterial'],
        typeof HologramMaterial
      >
    }
  }
}

extend({ HologramMaterial, LogoSphereMaterial })
