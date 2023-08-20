import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Scene from '@src/components/quest/Scene.tsx'
import Letsee from '@src/components/quest/Letsee.tsx'
import { PerspectiveCamera } from '@react-three/drei'
import letseeLogo from '/static/media/images/letsee-logo@2x.png'
import ScrollEuler from '@src/components/quest/ScrollEuler.tsx'
import React from 'react'
import ScrollHandler from '@src/components/quest/ScrollHandler.tsx'

export default function QuestPage() {
  return (
    <div className='h-full bg-black'>
      <Canvas id='quest-canvas' gl={{ antialias: false }} camera={{ position: [0, 5, 10] }} shadows dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
      <Leva collapsed={true} hidden={false} />

      <div className='absolute left-0 bottom-0 w-[20vmin] h-[20vmin] min-w-[100px] min-h-[100px] max-w-[180px] max-h-[180px] border-[0px] border-amber-200'>
        <Canvas id='quest-canvas-2' dpr={[1, 1.5]}>
          <React.Suspense>
            <PerspectiveCamera position={[0, 2.5, 12]} makeDefault={true} />
            <Letsee />
          </React.Suspense>
        </Canvas>
      </div>

      {/* 돔 레이아웃 */}
      <img src={letseeLogo} className='absolute left-5 top-5 h-[4rem]' />
      <ScrollEuler />
      <footer className='absolute right-5 bottom-5 flex flex-col font-extralight text-right border-gray-700 border-[1px] px-2 py-1'>
        <p className='text-sm text-gray-500'>Letsee Quest | Letsee</p>
        <span className='text-xs text-gray-500'>Copyright © 2023</span>
      </footer>

      <ScrollHandler />
    </div>
  )
}
