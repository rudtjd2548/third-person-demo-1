import { Merged, useGLTF } from '@react-three/drei'
import glb from '/static/media/models/Gate.meshopt.glb?url'
import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useFrame } from '@react-three/fiber'
import LightRay from '@src/components/quest3/LightRay.tsx'
import * as THREE from 'three'

const centerData = { position: [0, 0, 0] }
const radius = 35
const theta = Math.PI / 180 * 60
const data = [
  { position: [radius * Math.cos(theta * 0.5), 0, radius * Math.sin(theta * 0.5)]},
  { position: [radius * Math.cos(theta * 1.5), 0, radius * Math.sin(theta * 1.5)]},
  { position: [radius * Math.cos(theta * 2.5), 0, radius * Math.sin(theta * 2.5)]},
  { position: [radius * Math.cos(theta * 3.5), 0, radius * Math.sin(theta * 3.5)]},
  { position: [radius * Math.cos(theta * 4.5), 0, radius * Math.sin(theta * 4.5)]},
  { position: [radius * Math.cos(theta * 5.5), 0, radius * Math.sin(theta * 5.5)]},
]

export default function Machines() {
  const { nodes, materials }: any = useGLTF(glb)
  const mainTop = useRef<any>(null!)
  const [capOpened, setCapOpened] = useState(false)

  useLayoutEffect(() => {
    materials['Body'].envMapIntensity = 0.1
    materials['Body'].color = new THREE.Color('#444')
    materials['Light Material'].emissive = new THREE.Color('#4d9dff')
    gsap.to(mainTop.current.position, {
      y: 6.8,
      delay: 0.5,
      duration: 1,
      ease: 'power4.out',
      onComplete: () => {
        setCapOpened(true)
      },
    })
  }, [])

  useFrame((state) => {
    if (!capOpened) return
    mainTop.current.position.y = 6.8 + Math.sin(state.clock.elapsedTime * 2) * 0.15
  })

  return (
    <Merged meshes={nodes}>
      {(models: any) => (
        <group>
          <Machine isMain={true} topRef={mainTop} info={centerData} models={models} materials={materials} />
          {data.map((_data, i) => (
            <Machine key={i} info={_data} models={models} materials={materials} />
          ))}
        </group>
      )}
    </Merged>
  )
}

function Machine({ isMain, topRef, info, models, materials }: any) {
  return (
    <group position={info.position as any} scale={1.5}>
      <group ref={topRef} position={[-3.111, 0, -3.111]} scale={0.00038}>
        <models.mesh_0 material={materials.Body} />
        <models.mesh_0_1 material={materials['Light Material']} />
      </group>
      <group position={[-3.111, 0, -3.111]} scale={0.00038}>
        <models.mesh_1 material={materials.Body} />
        <models.mesh_1_1 material={materials['Light Material']} />
      </group>
      {isMain && <LightRay />}
    </group>
  )
}
