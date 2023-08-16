import React, { useEffect, useRef } from 'react'

export default function MouseController() {
  const controllerRef = useRef<HTMLDivElement>(null!)
  const pointerRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const canvas = document.querySelector('#lounge-canvas')
    const controller = controllerRef.current
    const pointer = pointerRef.current

    if (!canvas) return

    const controllerSize = controller.offsetWidth
    const pointerSize = pointer.offsetWidth
    const maxPointerDistance = Math.abs(controllerSize / 2 - pointerSize / 2)

    const start = { x: 0, y: 0 }

    const pointerdown = (e: React.MouseEvent): void => {
      console.log('pointerdown')
      canvas.addEventListener('pointermove', pointermove as () => void)
      canvas.addEventListener('pointerup', pointerup as () => void)
      canvas.addEventListener('pointercancel', pointerup as () => void)
      start.x = e.clientX
      start.y = e.clientY

      const controllerX = start.x - controllerSize / 2
      const controllerY = start.y - controllerSize / 2
      controller.style.transform = `translate(${controllerX}px, ${controllerY}px)`
      controller.style.opacity = '1'

      canvas.dispatchEvent(new Event('player-down'))
    }
    const pointermove = (e: React.MouseEvent): void => {
      const dx = e.clientX - start.x
      const dy = e.clientY - start.y

      const distance = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)

      const radius = Math.min(distance, maxPointerDistance)

      const pointerX = radius * Math.cos(angle)
      const pointerY = radius * Math.sin(angle)

      pointer.style.transform = `translateX(${pointerX}px) translateY(${pointerY}px)`

      const detail = { x: pointerX, y: pointerY, radius: radius / maxPointerDistance }
      canvas.dispatchEvent(new CustomEvent('player-move', { detail }))
    }
    const pointerup = () => {
      canvas.removeEventListener('pointermove', pointermove as () => void)
      canvas.removeEventListener('pointerup', pointerup as () => void)
      canvas.removeEventListener('pointercancel', pointerup as () => void)

      pointer.style.transform = `translateX(0) translateY(0)`
      controller.style.opacity = '0'

      canvas.dispatchEvent(new Event('player-up'))
    }

    canvas.addEventListener('pointerdown', pointerdown as () => void)
    return () => canvas.removeEventListener('pointerdown', pointerdown as () => void)
  })

  return (
    <div
      className='absolute left-0 top-0 rounded-full bg-gray-300 bg-opacity-30 w-[9rem] h-[9rem] opacity-0 transition-opacity duration-300 pointer-events-none flex justify-center items-center'
      ref={controllerRef}
    >
      <div className='w-[3rem] h-[3rem] rounded-full bg-gray-400 bg-opacity-70' ref={pointerRef} />
    </div>
  )
}
