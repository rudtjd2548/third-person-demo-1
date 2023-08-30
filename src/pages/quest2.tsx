import { Canvas } from '@react-three/fiber'
import Scene from "@src/components/quest2/Scene.tsx";
import {Leva} from "leva";
import Effects from "@src/components/quest2/Effects.tsx";

export default function Quest2Page() {
  return (
    <div className='h-full border-red'>
      <Canvas id='quest2-canvas' gl={{ antialias: false }} camera={{ position: [0, 3, 5] }} shadows dpr={[1, 1.5]}>
        <Scene />
        <Effects />
      </Canvas>
      <Leva collapsed={false} hidden={false} />
    </div>
  )
}
