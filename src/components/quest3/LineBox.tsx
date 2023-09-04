import {useLayoutEffect, useRef, useState} from 'react'
import * as THREE from 'three'
import {Line} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";

const boxPoints = [[-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5], [-0.5,  0.5, -0.5], [0.5, 0.5, -0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [ 0.5, -0.5,  0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]]
const triPoints = [[0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 0, 1], [0, -1, 0], [1, 0, 0], [0, -1, 0], [0, 0, -1], [1, 0, 0], [0, 0, -1], [0, 1, 0], [1, 0, 0], [0, 1, 0], [0, 0, -1], [-1, 0, 0], [0, 0, -1], [0, -1, 0], [-1, 0, 0], [0, -1, 0], [0, 0, 1], [-1, 0, 0], [0, 0, 1], [0, 1, 0], [-1, 0, 0]]
const tetPoints = [[-0.5773502588272095, -0.5773502588272095, 0.5773502588272095], [0.5773502588272095, 0.5773502588272095, 0.5773502588272095], [-0.5773502588272095, 0.5773502588272095, -0.5773502588272095], [0.5773502588272095, -0.5773502588272095, -0.5773502588272095], [-0.5773502588272095, 0.5773502588272095, -0.5773502588272095], [0.5773502588272095, 0.5773502588272095, 0.5773502588272095], [0.5773502588272095, -0.5773502588272095, -0.5773502588272095], [0.5773502588272095, 0.5773502588272095, 0.5773502588272095], [-0.5773502588272095, -0.5773502588272095, 0.5773502588272095], [0.5773502588272095, -0.5773502588272095, -0.5773502588272095], [-0.5773502588272095, -0.5773502588272095, 0.5773502588272095], [-0.5773502588272095, 0.5773502588272095, -0.5773502588272095]]

export default function LineBox() {
  const [points, setPoints] = useState<THREE.Vector3[]>([])
  const ref = useRef<any>(null!)

  useLayoutEffect(() => {
    const objGeometry = new THREE.SphereGeometry(1, 16, 16)
    const gp = objGeometry.attributes.position
    const points = []

    for (let i = 0; i < gp.count; i++) {
      points.push(new THREE.Vector3().fromBufferAttribute(gp, i))
    }
    console.log(points)
    setPoints(points)

    return () => {
      objGeometry.dispose()
    }
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.5
    // ref.current.rotation.y = 2
  })

  return points.length > 0 && (
    <Line ref={ref} scale={2} lineWidth={1.2} position={[-10, 13, 19]} points={boxPoints} color={'#6600a1'} segments={false} />
  )
}
