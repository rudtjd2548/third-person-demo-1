import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { lerp } from '@src/utils/utils.ts'

const radius = 15

export default function CameraControl() {
  const { camera, scene } = useThree()
  const angle = useRef<number>(0)
  const targetAngle = useRef<number>(0)
  const waterFloor = useRef<THREE.Group>(null!)

  useEffect(() => {
    waterFloor.current = scene.getObjectByName('water-floor') as THREE.Group
  }, [])

  useEffect(() => {
    const onWheel = (e: any) => {
      const direction = Math.abs(e.wheelDeltaY) / e.wheelDeltaY
      targetAngle.current += 0.1 * direction
    }
    addEventListener('wheel', onWheel as () => void)
    return () => removeEventListener('wheel', onWheel as () => void)
  }, [])

  useFrame((_, delta) => {
    angle.current = lerp(angle.current, targetAngle.current, delta * 4)

    camera.position.x = radius * Math.cos(angle.current)
    camera.position.z = radius * Math.sin(angle.current)
    camera.lookAt(0, 5.8, 0)

    if (!waterFloor.current || !waterFloor.current.children[0]) return

    const { material } = waterFloor.current.children[0] as any
    material.uniforms.angle.value = -angle.current
  })

  return null
}
