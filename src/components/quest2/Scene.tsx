import { Suspense } from 'react'
import { Preload } from '@react-three/drei'
import WaterFloor from "@src/components/quest2/WaterFloor.tsx";
import CustomDirectionalLight from "@src/components/quest2/DirectionalLight.tsx";
import TestBox from "@src/components/quest2/TestBox.tsx";

export default function Scene() {
  return (
    <Suspense fallback={null}>
      <color attach='background' args={['#f1f1f1']} />
      <CustomDirectionalLight />
      <Suspense>
        <WaterFloor />
      </Suspense>

      <TestBox position={[0, 1.5, 0]} />
      <TestBox position={[-2, 1.5, 1]} />
      <TestBox position={[2, 1.5, 1]} />
      <TestBox position={[-2, 1.5, -1]} />
      <TestBox position={[1, 1.5, -1]} />
      <Preload all />
    </Suspense>
  )
}

