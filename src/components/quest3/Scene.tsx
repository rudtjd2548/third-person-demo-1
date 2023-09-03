import { Suspense, useLayoutEffect } from 'react'
import { AdaptiveDpr, AdaptiveEvents, Environment, Preload } from '@react-three/drei'
import CustomDirectionalLight from '@src/components/quest3/DirectionalLight.tsx'
import WaterFloor from '@src/components/quest3/WaterFloor.tsx'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Effects from '@src/components/quest3/Effects.tsx'
import Logo from '@src/components/quest3/Logo.tsx'
import CameraControl from '@src/components/quest3/CameraControl.tsx'
import Machines from '@src/components/quest3/Machines.tsx'
import Flies from '@src/components/quest3/Flies.tsx'

export default function Scene() {
  const { camera } = useThree()

  useLayoutEffect(() => {
    camera.lookAt(new THREE.Vector3(0, 5.8, 0))
  }, [])

  return (
    <Suspense fallback={null}>
      <color attach='background' args={['#c1c1c1']} />
      <fogExp2 attach='fog' args={['#c1c1c1', 0.025]} />
      {/*<fog attach='fog' args={['#c1c1c1', 20, 50]} />*/}
      <CustomDirectionalLight />
      <Environment preset='sunset' blur={100} />
      <Effects />
      <Logo />
      <CameraControl />
      <Suspense>
        <Machines />
      </Suspense>

      <Suspense>
        <WaterFloor />
      </Suspense>

      <Suspense>
        <Flies />
      </Suspense>
      <Preload all />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Suspense>
  )
}
