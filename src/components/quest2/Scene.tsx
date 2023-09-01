import { Suspense } from 'react'
import {Cloud, Preload, Sky} from '@react-three/drei'
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
      {/*<SkyDom />*/}
      <Sky azimuth={-0.2} turbidity={12} rayleigh={0.5} inclination={0.7} distance={1000} />
      <Cloud position={[-20, 10, -40]} speed={0.3} segments={7} width={13} color='#55ffff' opacity={0.1} />
      <Cloud position={[-10, 10, -40]} speed={0.3} segments={7} width={13} color='#55ffff' opacity={0.2} />
      <Cloud position={[0, 10, -40]} speed={0.3} segments={7} width={13} color='#55ffff' opacity={0.1} />
      <Cloud position={[10, 10, -40]} speed={0.3} segments={7} width={10} color='#55ffff' opacity={0.2} />
      <Cloud position={[20, 10, -40]} speed={0.3} segments={7} width={20} color='#55ffff' opacity={0.1} />

      <Suspense>
        <Place1 />
      </Suspense>
      <Suspense>
        <WaterFloor />
      </Suspense>

      <mesh position={[1.5, 1.5, -10]}>
        <sphereGeometry args={[0.3, 16]} />
        <meshBasicMaterial color='#eee' />
      </mesh>

      {/*<TestBox position={[0, 1.5, 0]} />*/}
      {/*<TestBox position={[2, 1.5, 1]} />*/}
      {/*<TestBox position={[1, 1.5, -1]} />*/}
      <Preload all />
    </Suspense>
  )
}
