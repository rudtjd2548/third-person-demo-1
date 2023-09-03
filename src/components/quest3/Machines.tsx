import { Merged, useGLTF } from '@react-three/drei'
import glb from '/static/media/models/Gate.meshopt.glb?url'
import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useFrame } from '@react-three/fiber'
import LightRay from '@src/components/quest3/LightRay.tsx'

const mainData = { position: [0, 0, 0] }
const data = [
  { position: [-8, 0, -39] },
  { position: [7, 0, -25] },
  { position: [15, 0, 10] },
  { position: [40, 0, 5] },
  { position: [-20, 0, 15] },
  { position: [-30, 0, -25] },
  { position: [2, 0, 30] },
  { position: [28, 0, -12] },
]

export default function Machines() {
  const { nodes, materials }: any = useGLTF(glb)
  const mainTop = useRef<any>(null!)
  const [capOpened, setCapOpened] = useState(false)

  useLayoutEffect(() => {
    materials['Body'].envMapIntensity = 0.2
    gsap.to(mainTop.current.position, {
      y: 6.8,
      delay: 0.5,
      duration: 1,
      ease: 'power1.inOut',
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
          <Machine isMain={true} topRef={mainTop} info={mainData} models={models} materials={materials} />
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
