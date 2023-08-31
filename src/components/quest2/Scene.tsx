import { Suspense } from 'react'
import { Preload } from '@react-three/drei'
import WaterFloor from '@src/components/quest2/WaterFloor.tsx'
import CustomDirectionalLight from '@src/components/quest2/DirectionalLight.tsx'
import TestBox from '@src/components/quest2/TestBox.tsx'
import Effects from '@src/components/quest2/Effects.tsx'
import SkyDom from "@src/components/quest2/SkyDom.tsx";
import Place1 from "@src/components/quest2/Place1.tsx";

export default function Scene() {
  return (
    <Suspense fallback={null}>
      <Effects />
      <CustomDirectionalLight />
      <SkyDom />
      <Place1 />
      <Suspense>
        <WaterFloor />
      </Suspense>

      <mesh position={[1.5, 1.5, -10]}>
        <sphereGeometry args={[0.3, 16]} />
        <meshBasicMaterial color='#eee' />
      </mesh>

      <TestBox position={[0, 1.5, 0]} />
      <TestBox position={[-2, 1.5, 1]} />
      <TestBox position={[2, 1.5, 1]} />
      <TestBox position={[-2, 1.5, -1]} />
      <TestBox position={[1, 1.5, -1]} />
      <Preload all />
    </Suspense>
  )
}
