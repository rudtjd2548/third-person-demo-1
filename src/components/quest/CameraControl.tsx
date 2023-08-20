import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export default function CameraControl() {
  const targetPos = useRef(new THREE.Vector3())

  return useFrame((state) => {
    targetPos.current.x = state.mouse.x * 0.4
    targetPos.current.y = 5 + state.mouse.y * 0.6
    targetPos.current.z = 10

    state.camera.position.lerp(targetPos.current, 0.05)
    state.camera.lookAt(0, 0, -10)
  })
}
