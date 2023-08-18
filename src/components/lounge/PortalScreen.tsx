import { useMemo, useRef } from 'react'
import { shaderMaterial } from '@react-three/drei'
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PortalScreenProps {
  [key: string]: any
}

export default function PortalScreen({ src, ...props }: PortalScreenProps) {
  const ref = useRef<THREE.Mesh>(null!)

  const args: any = useMemo(() => {
    const { videoWidth, videoHeight } = src.source.data
    const width = 17
    const height = width * (videoHeight / videoWidth)
    return [width, height, width, height]
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const { uniforms }: any = ref.current.material
    uniforms.time.value = state.clock.elapsedTime * 1000
  })

  return (
    <mesh ref={ref} {...props}>
      <planeGeometry args={args} />
      <portalScreenMaterial key={PortalScreenMaterial.key} src={src} transparent={true} />
    </mesh>
  )
}

const PortalScreenMaterial: any = shaderMaterial(
  {
    time: 0,
    src: null,
  },
  `
    varying vec3 vPos;
    varying vec2 vUv;
    
    void main() {
      vPos = position;
      vUv = uv;
      
      vPos.z += vPos.x * vPos.x * 0.04;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
    }
  `,
  `
    varying vec3 vPos;
    varying vec2 vUv;
    
    uniform float time;
    uniform sampler2D src;
    
    float plot() {    
      float xLine = (1. - step(2. * abs(vUv.x - 0.5), 0.98)) / 2.;
      float yLine =  (1. - step(2. * abs(vUv.y - 0.5), 0.962)) / 2.;
      return 2. * clamp(0., 0.5, xLine + yLine);
    }
    
    void main() {
        float t = time * 0.001;
        
        vec4 lineColor = vec4(sin(100. * (1. - vUv.y + t * 0.5)), 0., 0., 1.);
        vec4 videoColor = texture2D(src, vUv);
        vec4 lineVideoColor = mix(lineColor, videoColor, 0.97);
        lineVideoColor.a = 1. - smoothstep(0.92, 1., abs(2. * vUv.x - 1.));
        lineVideoColor.a *= 1. - smoothstep(0.85, 1., abs(2. * vUv.y - 1.));
        
        vec4 frameColor = vec4(1., 0.05, 0., 0.1);
        
        gl_FragColor = mix(lineVideoColor, frameColor, plot());
    }
  `,
)

extend({ PortalScreenMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      portalScreenMaterial: ReactThreeFiber.Node<
        typeof PortalScreenMaterial & JSX.IntrinsicElements['shaderMaterial'],
        typeof PortalScreenMaterial
      >
    }
  }
}
