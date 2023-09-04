import { Box, Cone, Float, Octahedron, Tetrahedron, Wireframe } from '@react-three/drei'
import * as THREE from 'three'
import { useState } from 'react'
import { randomNumBetween } from '@src/utils/utils.ts'

const palette = {
  purple: new THREE.Color('#7a40ed'),
  blue: new THREE.Color('#4043ed'),
  aqua: new THREE.Color('#40d9ed'),
}

export default function DecoObjects() {
  return (
    <group>
      <CustomFloat>
        <Box args={[1, 1, 1, 1, 1, 1]} position={[5, 10, 10]}>
          <CustomWireFrame color={palette.blue} />
        </Box>
      </CustomFloat>
      <CustomFloat>
        <Cone args={[0.6, 1, 16]} position={[10, 10, -5]}>
          <CustomWireFrame color={palette.blue} />
        </Cone>
      </CustomFloat>
      <CustomFloat>
        <Octahedron args={[1, 0]} position={[10, 10, 5]}>
          <CustomWireFrame color={palette.purple} />
        </Octahedron>
      </CustomFloat>
      <CustomFloat>
        <Octahedron args={[1, 1]} position={[-10, 10, 10]}>
          <CustomWireFrame color={palette.aqua} />
        </Octahedron>
      </CustomFloat>
      <CustomFloat>
        <Tetrahedron args={[1, 0]} position={[0, 15, -10]}>
          <CustomWireFrame color={palette.aqua} />
        </Tetrahedron>
      </CustomFloat>
    </group>
  )
}

function CustomFloat({ children }: any) {
  const [randomRotation] = useState<any>([
    randomNumBetween(-0.05, 0.05),
    randomNumBetween(-0.05, 0.05),
    randomNumBetween(-0.05, 0.05),
  ])
  return (
    <Float floatIntensity={1} rotationIntensity={1} rotation={randomRotation}>
      {children}
    </Float>
  )
}

function CustomWireFrame({ color }: { color: THREE.Color }) {
  return (
    <Wireframe
      fillOpacity={0}
      fillMix={1}
      squeeze={true}
      thickness={0.2}
      fill={color}
      stroke={color}
      backfaceStroke={color}
    />
  )
}
