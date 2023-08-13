import React from 'react'
import { Environment } from '@react-three/drei'
import hdr from '@static/media/images/christmas_photo_studio_01_1k.exr?url'
import CustomPerspectiveCamera from '@src/components/lounge/PerspectiveCamera.tsx'
import CustomDirectionalLight from '@src/components/lounge/DirectionalLight.tsx'
import Player from '@src/components/lounge/Player.tsx'
import Effects from '@src/components/lounge/Effects.tsx'
import Table from '@src/components/lounge/Table.tsx'
import Flies from '@src/components/lounge/Flies.tsx'

export default function Scene() {
  const onClickGround = (e) => {
    const detail = { pointer: e.point }
    dispatchEvent(new CustomEvent('click-ground', { detail }))
  }

  return (
    <React.Suspense fallback={null}>
      <Environment files={hdr} background={'only'} blur={0.06} />
      <Environment files={hdr} blur={100} />
      <ambientLight intensity={0.5} color='gold' />
      <Effects />
      <CustomDirectionalLight />
      <CustomPerspectiveCamera />

      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false} onClick={onClickGround}>
        <circleGeometry args={[28, 32]} />
      </mesh>

      <Flies />

      <React.Suspense fallback={null}>
        <Table />
      </React.Suspense>

      <React.Suspense fallback={null}>
        <Player />
      </React.Suspense>
    </React.Suspense>
  )
}
