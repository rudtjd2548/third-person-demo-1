import { useEffect, useRef } from 'react'
import { Text, useGLTF, useVideoTexture } from '@react-three/drei'
import glb from '@static/media/models/table.glb?url'
import { RootState, useFrame } from '@react-three/fiber'
import Portal from '@src/components/lounge/Portal.tsx'
import font from '@static/fonts/SUIT-Medium.woff'
import { ThreeEvent } from '@react-three/fiber/dist/declarations/src/core/events'
import * as THREE from 'three'
import PortalScreen from '@src/components/lounge/PortalScreen.tsx'
import testVideo1 from '@static/media/videos/letsee.everland.mp4'
import testVideo2 from '@static/media/videos/letsee.lotte.jollycatch.mp4'

useGLTF.preload(glb)

interface ClickGroundDetail {
  pointer: THREE.Vector3
}

export default function Table() {
  const videoTexture1: THREE.VideoTexture = useVideoTexture(testVideo1)
  const videoTexture2: THREE.VideoTexture = useVideoTexture(testVideo2)

  const { scene, nodes }: any = useGLTF(glb)
  const horse = useRef(nodes['Horse'])
  useEffect(() => {
    nodes['Table'].material.metalness = 0.1
    nodes['Table'].material.roughness = 1
    nodes['Table'].receiveShadow = true
    scene.traverse((child: THREE.Object3D) => {
      child.frustumCulled = false
    })
  }, [])

  const onClickGround = (e: ThreeEvent<MouseEvent>): void => {
    const detail: ClickGroundDetail = { pointer: e.point }
    dispatchEvent(new CustomEvent('click-ground', { detail }))
  }

  useFrame((state: RootState): void => {
    if (horse.current) {
      horse.current.rotation.z = 0.1 * Math.sin(state.clock.elapsedTime)
    }
  })

  return (
    <group scale={0.5}>
      <primitive object={scene}>
        <mesh
          onClick={onClickGround}
          position={[nodes['TouchAblePlane'].position.x, 0, nodes['TouchAblePlane'].position.z]}
          geometry={nodes['TouchAblePlane'].geometry}
          visible={false}
        />
      </primitive>
      <Portal position={[30, 1, 7]}>
        <Text font={font} fontSize={1} position={[0, 0, 4]}>
          눈싸움 미니게임
        </Text>
        <PortalScreen src={videoTexture1} position={[0, 10, -5]} />
      </Portal>
      <Portal position={[-16, 1, 8]}>
        <Text font={font} fontSize={1} position={[0, 0, 4]}>
          썰매타기 미니게임
        </Text>
        <PortalScreen src={videoTexture2} position={[0, 10, -5]} />
      </Portal>
    </group>
  )
}
