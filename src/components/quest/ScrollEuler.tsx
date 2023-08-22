import { useRef } from 'react'
import { useAppSelector } from '@src/redux/store.ts'

const lineCount: number = 41

export default function ScrollEuler() {
  const { scroll }: any = useAppSelector((state) => state.quest)
  const bar = useRef<HTMLDivElement>(null!)

  return (
    <div className='absolute left-[50%] bottom-5 transform translate-x-[-50%]'>
      <div className='w-[30vmin] flex'>
        {[...Array(lineCount)].map((_, index) => {
          const isEdge = index === 0 || index === lineCount - 1
          return (
            <div key={index} className={`relative ${index === lineCount - 1 ? 'w-0' : 'w-full'}`}>
              <div className={`absolute bottom-0 w-[2px] ${isEdge ? 'h-[1rem]' : 'h-[0.5rem]'} bg-[#00ffaa30]`} />
            </div>
          )
        })}
        <div
          ref={bar}
          style={{ left: scroll.percent * 100 + '%' }}
          className='absolute bottom-[100%] w-[4px] h-[1rem] transform translate-x-[-1px] rounded-md bg-[#fff] opacity-70'
        />
      </div>
    </div>
  )
}
