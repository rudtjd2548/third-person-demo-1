import { useEffect, useRef } from 'react'
import { useAppSelector } from '@src/redux/store.ts'

const lineCount: number = 41

export default function ScrollEuler() {
  const { scroll }: any = useAppSelector((state) => state.quest)
  const bar = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    bar.current.style.left = scroll.percent * 100 + '%'
  }, [scroll])

  return (
    <div className='absolute left-[50%] bottom-5 transform translate-x-[-50%]'>
      <div className='w-[30vmin] flex'>
        {[...Array(lineCount)].map((_, index) => {
          const isEdge = index === 0 || index === lineCount - 1
          return (
            <div key={index} className={`relative w-${index === lineCount - 1 ? '0' : 'full'}`}>
              <div className={`absolute bottom-0 w-[2px] h-[${isEdge ? 1 : 0.5}rem] bg-[#00ffaa30]`} />
            </div>
          )
        })}
        <div
          ref={bar}
          className='absolute left-[0%] bottom-[100%] w-[4px] h-[1rem] transform translate-x-[-1px] rounded-2xl bg-[#ffffff] opacity-50'
        />
      </div>
    </div>
  )
}
