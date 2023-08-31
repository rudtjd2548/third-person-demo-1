import {useRef} from 'react'
import {useFrame} from "@react-three/fiber";
import * as THREE from 'three'

interface TestBoxProps {
  [key: string]: any
}

export default function TestBox({ ...props }: TestBoxProps) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    ref.current.position.y = 1.5 + 0.5 * Math.sin(props.position[0] - props.position[2] + props.position[1] + state.clock.elapsedTime * 2)
  })

  return (
    <mesh ref={ref} {...props} castShadow={true}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color='#ff0000' />
    </mesh>
  )
}
