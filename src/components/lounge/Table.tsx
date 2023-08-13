import { Text, useGLTF } from '@react-three/drei'
import glb from '@static/media/models/table.glb?url'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Portal from '@src/components/lounge/Portal.tsx'
import font from '@static/fonts/SUIT-Medium.woff'

export default function Table() {
  const { scene, nodes } = useGLTF(glb)
  const horse = useRef(nodes['Horse'])
  const balls = useRef([nodes['Red_Ball'], nodes['Golden_Ball'], nodes['White_Ball'], nodes['Golden_Ball001']])
  // console.log(nodes)
  useEffect(() => {
    scene.children[0].material.metalness = 0.5
    scene.children[0].material.roughness = 0.1
    scene.children[0].receiveShadow = true

    scene.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
    })
  }, [])

  useFrame((state) => {
    balls.current.forEach((ball, index) => {
      ball.position.y = -3 + Math.sin(state.clock.elapsedTime + 2 * index) * 2
    })
    if (horse.current) {
      horse.current.rotation.x = Math.PI * -0.5 + 0.07 * Math.sin(state.clock.elapsedTime)
    }
  })

  return (
    <group scale={0.5}>
      <primitive object={scene} />
      <Portal position={[2, 1, 33]} rotation={[0, Math.PI, 0]}>
        <Text font={font} fontSize={0.8} position={[0, 5, -1.5]}>
          눈싸움 미니게임
        </Text>
      </Portal>
      <Portal position={[14, 1, -8]} rotation={[0, (Math.PI / 2) * 3, 0]}>
        <Text font={font} fontSize={0.8} position={[0, 5, -1.5]}>
          썰매타기 미니게임
        </Text>
      </Portal>
    </group>
  )
}
