import { Text } from '@react-three/drei'
import font from '/static/fonts/SUIT-Medium.woff'
import { useAppSelector } from '@src/redux/store.ts'

export default function CardDesc() {
  const { data, scroll }: any = useAppSelector((state) => state.quest)
  const currData = data[scroll.current]

  return (
    <group position={[0, 0.01, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <Text font={font} fontSize={0.8} position={[-2, 0, 0]} color='#ccc' anchorX='left' anchorY='top'>
        {currData.title}
      </Text>
      <Text
        font={font}
        fontSize={0.4}
        position={[-2, -1.2, 0]}
        color='#aaa'
        textAlign='left'
        anchorX='left'
        anchorY='top'
      >
        {currData.date}
      </Text>
      <Text
        font={font}
        fontSize={0.4}
        position={[-2, -1.7, 0]}
        color='#aaa'
        textAlign='left'
        anchorX='left'
        anchorY='top'
      >
        {currData.partner}
      </Text>
      <Text font={font} fontSize={0.3} position={[-2, -2.4, 0]} color='#aaa' anchorX='left' anchorY='top'>
        {currData.desc}
      </Text>
    </group>
  )
}
