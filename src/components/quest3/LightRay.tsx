import { useRef } from 'react'
import { shaderMaterial, useTexture } from '@react-three/drei'
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import image from '/static/media/images/noise64.png'

export default function LightRay() {
  const ref = useRef<THREE.Mesh>(null!)
  const imageTexture: THREE.Texture = useTexture(image)
  imageTexture.wrapS = imageTexture.wrapT = THREE.RepeatWrapping

  useFrame((state) => {
    const { uniforms }: any = ref.current.material
    uniforms.time.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={ref} position={[0, 0, 0]} rotation={[-Math.PI, Math.PI, 0]}>
      <cylinderGeometry args={[2, 1, 10, 16, 1, true]} />
      <lightRayMaterial
        key={LightRayMaterial.key}
        imageTexture={imageTexture}
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

const LightRayMaterial: any = shaderMaterial(
  {
    time: 0,
    imageTexture: null,
  },
  `
    varying vec2 vUv;
    uniform float time;
    
    void main() {
      vUv = uv;
      
      float angle = time * 0.05;
      mat4 rotationMatrix = mat4(
          cos(angle), 0.0, sin(angle), 0.0,
          0.0, 1.0, 0.0, 0.0,
          -sin(angle), 0.0, cos(angle), 0.0,
          0.0, 0.0, 0.0, 1.0
      );
      
      gl_Position = projectionMatrix * modelViewMatrix * rotationMatrix * vec4(position, 1.0);
    }  
  `,
  `
    varying vec2 vUv;
    uniform float time;
    uniform sampler2D imageTexture;
  
    void main() {
      float t = time * 0.01;
    
      vec2 imageColor = texture2D(imageTexture, vec2(t, vUv.x)).xy;
      imageColor *= 0.3;
      imageColor += 0.3;
    
      float value = smoothstep(0.0, 2.5, imageColor.x - vUv.y);

      gl_FragColor = vec4(1.0, 1.0, 1.0, value);
    }  
  `,
)

declare global {
  namespace JSX {
    interface IntrinsicElements {
      lightRayMaterial: ReactThreeFiber.Node<
        typeof LightRayMaterial & JSX.IntrinsicElements['shaderMaterial'],
        typeof LightRayMaterial
      >
    }
  }
}

extend({ LightRayMaterial })
