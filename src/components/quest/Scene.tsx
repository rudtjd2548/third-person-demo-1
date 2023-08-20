import React from 'react'
import CameraControl from '@src/components/quest/CameraControl.tsx'
import { Preload } from '@react-three/drei'
import Ground from '@src/components/quest/Ground.tsx'
import Effects from '@src/components/quest/Effects.tsx'
import CardGroup from '@src/components/quest/CardGroup.tsx'

export default function Scene() {
  return (
    <React.Suspense fallback={null}>
      <CameraControl />
      <color attach='background' args={['#000']} />
      <spotLight position={[0, 10, 0]} intensity={60} penumbra={1} />
      <spotLight position={[0, 3, 0]} color='#00ffaa' intensity={10} penumbra={1} />
      <Effects />

      <Ground />
      <CardGroup />
      <Preload all />
    </React.Suspense>
  )
}
