import { Canvas } from '@react-three/fiber'
import Scene from '@src/components/quest2/Scene.tsx'
import { Leva } from 'leva'

export default function Quest2Page() {
  return (
    <div className='h-full border-red'>
      <Canvas id='quest2-canvas' gl={{ antialias: false }} camera={{ position: [0, 1, 4] }} shadows dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
      <Leva collapsed={false} hidden={false} />
    </div>
  )
}
