import React, {Suspense, useLayoutEffect} from 'react'
import { Preload } from '@react-three/drei'
import CustomDirectionalLight from '@src/components/quest3/DirectionalLight.tsx'
import WaterFloor from "@src/components/quest3/WaterFloor.tsx";
import {useThree} from "@react-three/fiber";
import * as THREE from "three";
import LightRay from "@src/components/quest3/LightRay.tsx";

export default function Scene() {
  const { camera } = useThree()

  useLayoutEffect(() => {
    camera.lookAt(new THREE.Vector3(0, 0, -100))
  }, []);

  return (
    <Suspense fallback={null}>
      <color attach='background' args={['#1c1c1c']} />
      <CustomDirectionalLight />
      <LightRay />

      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[1, 16]} />
        <meshPhongMaterial color={'#1980a4'} shininess={100} />
      </mesh>

      <WaterFloor />
      <Preload all />
    </Suspense>
  )
}
