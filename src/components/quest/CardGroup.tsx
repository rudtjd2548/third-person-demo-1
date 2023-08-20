import React, { useRef } from 'react'
import Card from '@src/components/quest/Card.tsx'
import CardDesc from '@src/components/quest/CardDesc.tsx'
import * as THREE from 'three'
import { useAppSelector } from '@src/redux/store.ts'

export default function CardGroup() {
  const { data }: any = useAppSelector((state) => state.quest)
  const cardGroup = useRef<THREE.Group>(null!)

  return (
    <React.Suspense fallback={null}>
      <group rotation={[0, -0.5, 0]}>
        <group ref={cardGroup}>
          {data.map((d: any, index: number) => {
            return <Card key={d.title} index={index} />
          })}
        </group>
        <CardDesc />
      </group>
    </React.Suspense>
  )
}
