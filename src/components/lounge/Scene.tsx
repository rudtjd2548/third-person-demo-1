import React from 'react'
import { Environment } from '@react-three/drei'
import hdr from '@static/media/images/christmas_photo_studio_01_1k.exr?url'
import CustomPerspectiveCamera from '@src/components/lounge/PerspectiveCamera.tsx'
import CustomDirectionalLight from '@src/components/lounge/DirectionalLight.tsx'
import Player from '@src/components/lounge/Player.tsx'
import Effects from '@src/components/lounge/Effects.tsx'
import Table from '@src/components/lounge/Table.tsx'
import Flies from '@src/components/lounge/Flies.tsx'
import Footprints from '@src/components/lounge/FootPrints.tsx'

export default function Scene() {
  return (
    <React.Suspense fallback={null}>
      <Environment files={hdr} background blur={0.1} />
      <ambientLight intensity={3} color='#FF8000' />
      <Effects />
      <CustomDirectionalLight />
      <CustomPerspectiveCamera />
      {/*<StatsGl />*/}

      <Flies />
      <Table />
      <Player />
      <Footprints />
    </React.Suspense>
  )
}
