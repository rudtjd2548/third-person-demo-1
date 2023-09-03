import { useGLTF } from '@react-three/drei'
import glb from '/static/media/models/Gate.meshopt.glb?url'
// import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import LightRay from '@src/components/quest3/LightRay.tsx'

export default function Warp() {
  const { nodes, materials }: any = useGLTF(glb)
  const topRef = useRef<THREE.Group>(null!)

  useLayoutEffect(() => {
    gsap.to(topRef.current.position, { y: 6.8, delay: 0.5, duration: 1, ease: 'power1.inOut' })
    materials['Body'].envMapIntensity = 0.2
  }, [])

  // useFrame((state) => {
  // topRef.current.position.y = 6.8 + Math.sin(state.clock.elapsedTime * 2) * 0.05
  // })

  return (
    <group scale={1.5}>
      <group ref={topRef} position={[-3.111, 0, -3.111]} scale={0.00038}>
        <mesh geometry={nodes.mesh_0.geometry} material={materials.Body} />
        <mesh geometry={nodes.mesh_0_1.geometry} material={materials['Light Material']} />
      </group>
      <group position={[-3.111, 0, -3.111]} scale={0.00038}>
        <mesh geometry={nodes.mesh_1.geometry} material={materials.Body} />
        <mesh geometry={nodes.mesh_1_1.geometry} material={materials['Light Material']} />
      </group>
      <LightRay />
    </group>
  )
}
