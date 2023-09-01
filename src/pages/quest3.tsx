import {Canvas} from '@react-three/fiber'
import { Leva } from 'leva'
import Scene from "@src/components/quest3/Scene.tsx";

export default function Quest3Page() {
  return (
    <div className='h-full border-red'>
      <Canvas id='quest3-canvas' gl={{ antialias: false }} camera={{ position: [0, 1.2, 4] }} shadows dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
      <Leva collapsed={false} hidden={false} />
    </div>
  )
}
