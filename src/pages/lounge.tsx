import { Canvas } from '@react-three/fiber'
import Scene from '@src/components/lounge/Scene.tsx'
import { Leva } from 'leva'

export default function LoungePage() {
  return (
    <div className='h-full'>
      <Canvas id='lounge-canvas' shadows linear={false} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
      <Leva collapsed={true} hidden={true} />
    </div>
  )
}
