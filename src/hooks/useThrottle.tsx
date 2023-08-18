import { useEffect, useState } from 'react'

export default function useThrottle(delay: number) {
  const [isThrottled, setIsThrottled] = useState(false)

  const throttle = () => {
    setIsThrottled(true)
  }

  useEffect(() => {
    const throttledClickTimer = setTimeout(() => {
      setIsThrottled(false)
    }, delay)

    return () => clearTimeout(throttledClickTimer)
  }, [isThrottled, delay])

  return [isThrottled, throttle]
}
