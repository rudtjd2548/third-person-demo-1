import { useLayoutEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setScrollAction } from '@src/redux/reducer/quest.ts'
import { useAppSelector } from '@src/redux/store.ts'

export default function ScrollHandler() {
  const { data }: any = useAppSelector((state) => state.quest)
  const dispatch = useDispatch()

  const ref = useRef<HTMLDivElement>(null!)
  const pageRef = useRef<HTMLDivElement>(null!)

  useLayoutEffect(() => {
    let totalWidth: number

    const onResize = () => {
      let percent = ref.current.scrollLeft / totalWidth || 0

      pageRef.current.style.width = Math.floor(data.length * innerWidth) + 'px'
      totalWidth = ref.current.scrollWidth - innerWidth
      ref.current.scrollLeft = totalWidth * percent

      dispatch(setScrollAction(percent))
    }
    const onWheel = (e: any) => {
      let left = ref.current.scrollLeft - (Math.abs(e.wheelDeltaY) / e.wheelDeltaY) * innerWidth * 0.15
      // if (left > totalWidth) left = 0
      // else if (left < 0) left = totalWidth
      ref.current.scrollLeft = left

      const percent = ref.current.scrollLeft / totalWidth
      dispatch(setScrollAction(percent))
    }

    addEventListener('wheel', onWheel as () => void)
    addEventListener('resize', onResize as () => void)
    onResize()

    return () => {
      removeEventListener('wheel', onWheel as () => void)
      removeEventListener('resize', onResize as () => void)
    }
  }, [data])

  return (
    <div ref={ref} className='absolute z-10 top-0 left-0 w-[100%] h-[100%] overflow-hidden pointer-events-none'>
      <div ref={pageRef} className={`h-[100%] pointer-events-none`} />
    </div>
  )
}
