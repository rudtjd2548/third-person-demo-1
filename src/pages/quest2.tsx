import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Scene from '@src/components/quest3/Scene.tsx'
import letseeLogo from '@static/media/images/letsee-logo@2x.png'

export default function Quest2Page() {
  return (
    <div className='h-full border-red'>
      {/* 메인 캔버스 */}
      <Canvas id='quest3-canvas' gl={{ antialias: false }} camera={{ position: [15, 6, 0] }} shadows dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
      <Leva collapsed={false} hidden={true} />

      {/* 돔 레이아웃 */}
      <img src={letseeLogo} className='absolute left-5 top-5 h-[7vmin] min-h-[2.5rem]' />
      <footer className='absolute right-5 bottom-5 flex flex-col font-extralight text-right border-gray-700 border-[1px] px-2 py-1'>
        <p className='text-clamp-1 text-gray-200'>Letsee Quest | Letsee</p>
        <span className='text-clamp-1 text-gray-200'>Copyright © 2023</span>
      </footer>
    </div>
  )
}
