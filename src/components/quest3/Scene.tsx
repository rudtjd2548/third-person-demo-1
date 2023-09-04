import { Suspense, useLayoutEffect } from 'react'
import {AdaptiveDpr, AdaptiveEvents, Environment, Preload} from '@react-three/drei'
import CustomDirectionalLight from '@src/components/quest3/DirectionalLight.tsx'
import WaterFloor from '@src/components/quest3/WaterFloor.tsx'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Effects from '@src/components/quest3/Effects.tsx'
import Logo from '@src/components/quest3/Logo.tsx'
import CameraControl from '@src/components/quest3/CameraControl.tsx'
import Machines from '@src/components/quest3/Machines.tsx'
import Flies from '@src/components/quest3/Flies.tsx'
import SkyDom from "@src/components/quest3/SkyDom.tsx";
import DashedLineGuide from "@src/components/quest3/DashedLineGuide.tsx";
import LineBox from "@src/components/quest3/LineBox.tsx";

export default function Scene() {
  const { camera } = useThree()

  useLayoutEffect(() => {
    camera.lookAt(new THREE.Vector3(0, 5.8, 0))
  }, [])

  return (
    <Suspense fallback={null}>
      <fogExp2 attach='fog' args={['#000', 0.03]} />
      <CustomDirectionalLight />
      <Environment preset={'night'} blur={100} />
      <Effects />

      <LineBox />

      <Suspense>
        <Logo />
      </Suspense>
      <CameraControl />
      <Suspense>
        <Machines />
      </Suspense>
      <Suspense>
        <WaterFloor />
      </Suspense>

      <DashedLineGuide />

      <SkyDom />

      <Suspense>
        <Flies />
      </Suspense>
      <Preload all />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Suspense>
  )
}
