import {useEffect, useRef} from "react";
import * as THREE from 'three'
import {Text} from "@react-three/drei";
import testFont from '@static/fonts/SUIT-Medium.woff'
import {cardData} from "@src/utils/constants.ts";

const radius = 13

export default function DashedLineGuide() {
  const groupRef = useRef<THREE.Group>(null!)

  useEffect(() => {
    const circleGeo = new THREE.CircleGeometry(radius, 64)
    const material = new THREE.LineDashedMaterial({
      color: '#fff',
      dashSize: 0.03,
      gapSize: 0.03,
    })

    const gp = circleGeo.attributes.position
    const points = []

    for (let i = 1; i < gp.count; i++) {
      points.push(new THREE.Vector3().fromBufferAttribute(gp, i))
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    const line  = new THREE.Line(geometry, material)
    line.computeLineDistances()
    line.rotation.x = -Math.PI / 2

    groupRef.current.add(line)

    return () => {
      material.dispose()
      geometry.dispose()
      groupRef.current?.remove(line)
    }
  }, [])

  return (
    <group ref={groupRef} position={[0, 5.7, 0]}>
      {[...cardData].reverse().map((data, index) => {
        const angle = Math.PI * 2 / cardData.length * (index + 1)
        const position = [radius * Math.cos(angle), -0.1, radius * Math.sin(angle)] as any
        return (
          <group key={index}>
            <Text
              font={testFont}
              position={position}
              rotation={[0, Math.PI / 2 -angle, 0]}
              color={'#fff'}
              fontSize={0.08}
            >
              {data.title}
            </Text>
            <mesh position={[position[0], 0, position[2]]}>
              <sphereGeometry args={[0.02, 8]} />
              <meshBasicMaterial color={'#fff'} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
