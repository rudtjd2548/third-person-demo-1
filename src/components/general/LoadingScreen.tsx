import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import { useProgress } from '@react-three/drei'
import { useDispatch } from 'react-redux'

interface LoadingScreenProps {
  setSceneLoadedAction: any,
  items?: string[],
}

const timeout: number = 1000 // delay after all items loaded
const weight: any = {}

export default function LoadingScreen({ setSceneLoadedAction, items = [] }: LoadingScreenProps) {
  const [isOpen, setIsOpen] = useState(true)
  const loadingFillRef = useRef<HTMLDivElement>(null!)
  const dispatch = useDispatch()

  const { loaded, total } = useProgress()
  const totalItems = useMemo(() => {
    return items.reduce((prev, item) => prev + weight[item], total)
  }, [items, total])
  const loadedItems = useRef(0)

  useLayoutEffect(() => {
    let timer: ReturnType<typeof setTimeout> = null!
    checkAllItemsLoaded()
    function checkAllItemsLoaded() {
      const _loaded = loadedItems.current + loaded
      const percent = (_loaded / totalItems) * 100
      if (loadingFillRef.current) loadingFillRef.current.style.width = `${percent}%`
      if (percent === 100) {
        timer = setTimeout(onAllItemsLoaded, timeout)
      }
    }
    function onAllItemsLoaded() {
      setIsOpen(false)
      dispatch(setSceneLoadedAction(true))
    }
    function onItemLoaded(e: CustomEvent) {
      const item = e.type.split('-')[0]
      loadedItems.current += weight[item]
      checkAllItemsLoaded()
    }
    items.forEach((item) => {
      window.addEventListener(`${item}-loaded`, onItemLoaded as () => void)
    })
    return () => {
      clearTimeout(timer)
      items.forEach((item) => {
        window.removeEventListener(`${item}-loaded`, onItemLoaded as () => void)
      })
    }
  }, [loaded, totalItems])

  return (
    <CSSTransition in={isOpen} timeout={300} classNames='loading-screen' unmountOnExit>
      <>
        {createPortal(
          <div className='absolute w-full h-full z-[var(--loadingScreenIndex)] bg-neutral-800'>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[400px] h-[1.5rem] border-[3px] border-gray-100 rounded-[3rem]'>
              <div className='w-[10vw] h-full rounded-[3rem] transition-width duration-300 bg-gray-50' ref={loadingFillRef} />
            </div>
          </div>,
          document.body,
        )}
      </>
    </CSSTransition>
  )
}
