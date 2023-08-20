import { shaderMaterial, useCursor, useTexture, useVideoTexture } from '@react-three/drei'
import image from '/static/media/images/card.base.png'
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { lerp } from '@src/utils/utils.ts'
import { useAppSelector } from '@src/redux/store.ts'

interface CardProps {
  index: number
}

const width = 4

export default function Card({ index }: CardProps) {
  const { data, scroll }: any = useAppSelector((state) => state.quest)
  const videoTexture: THREE.VideoTexture = useVideoTexture(data[index].src, { start: false })
  const imageTexture: THREE.Texture = useTexture(image)
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  useCursor(hovered)

  const targetX = useRef<number>(5 * index!)

  useEffect(() => {
    const groupWidth = (data.length - 1) * 5
    targetX.current = 5 * index - groupWidth * scroll.percent
  }, [scroll.percent])

  useEffect(() => {
    const isSelected = scroll.current === index
    if (isSelected) videoTexture.source.data.play()
    else videoTexture.source.data.pause()

    const { uniforms }: any = ref.current.material
    uniforms.isSelected.value = isSelected ? 1 : 0.4
  }, [scroll.current])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.position.x = lerp(ref.current.position.x, targetX.current, delta * 8)

    const { uniforms }: any = ref.current.material
    uniforms.time.value = state.clock.elapsedTime
  })

  return (
    <mesh
      ref={ref}
      position={[5 * index, 4, 0]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <planeGeometry args={[width, width * 1.618]} />
      <cardMaterial
        key={CardMaterial.key}
        transparent={true}
        imageTexture={imageTexture}
        videoTexture={videoTexture}
        isSelected={true}
      />
    </mesh>
  )
}

const CardMaterial: any = shaderMaterial(
  {
    time: 0,
    imageTexture: null,
    videoTexture: null,
    isSelected: false,
  },
  `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }  
  `,
  `
    varying vec2 vUv;
    
    uniform float time;
    uniform float isSelected;
    uniform sampler2D imageTexture;
    uniform sampler2D videoTexture;
  
    void main() {
      float t = time;
        
      float wave = sin(500. * (1. - vUv.y + t * 0.1));
      vec4 lineColor = vec4(0., wave * 1.0, wave * 1.0, 1.);
      vec4 imageColor = texture2D(imageTexture, vUv);
      vec4 lineImageColor = mix(lineColor, imageColor, 0.97);
      vec4 videoColor = texture2D(videoTexture, vUv);
      
      vec4 finalColor = mix(lineImageColor, videoColor, 0.3);
      
      vec4 fogColor = vec4(0., 0., 0., 1.);
      float fogFactor = smoothstep(18.0, 5.0, gl_FragCoord.z / gl_FragCoord.w);
      gl_FragColor = mix(fogColor, finalColor, fogFactor);
      
      gl_FragColor.a = imageColor.a * isSelected;
    }  
  `,
)

extend({ CardMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      cardMaterial: ReactThreeFiber.Node<
        typeof CardMaterial & JSX.IntrinsicElements['shaderMaterial'],
        typeof CardMaterial
      >
    }
  }
}
