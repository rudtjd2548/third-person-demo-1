import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Scene from '@src/components/quest3/Scene.tsx'
import letseeLogo from '@static/media/images/Letsee_signature_rgb.png'

export default function Quest2Page() {
  return (
    <div className='h-full border-red'>
      {/* 메인 캔버스 */}
      <Canvas id='quest3-canvas' gl={{ antialias: false }} camera={{ position: [0, 6, 15] }} shadows dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
      <Leva collapsed={false} hidden={true} />

      {/* 돔 레이아웃 */}
      <img src={letseeLogo} className='absolute left-8 top-7 h-[3.5rem]' />
      <footer className='absolute right-8 bottom-8 flex flex-col font-extralight text-right border-gray-700 border-[1px] px-2 py-1'>
        <p className='text-m text-gray-500'>Letsee Quest | Letsee</p>
        <span className='text-sm text-gray-500'>Copyright © 2023</span>
      </footer>
    </div>
  )
}
