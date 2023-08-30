import {useMemo, useRef} from 'react'
import {shaderMaterial, useTexture} from "@react-three/drei";
import gridImage from "@static/media/images/texture.grid.png";
import {extend, ReactThreeFiber, useFrame, useThree} from "@react-three/fiber"
import * as THREE from 'three'
import {classicPerlin3DNoise} from "@src/utils/glsl.ts";

export default function WaterFloor() {
  const texture = useTexture(gridImage)
  const ref = useRef<THREE.Mesh>(null!)
  const shaderRef = useRef(null!)

  const onBeforeCompile = useMemo(() => {
    return (shader) => {
      shader.uniforms.time = { value: 0 }

      shader.vertexShader = shader.vertexShader.replace(
        `#include <uv_pars_vertex>`,
        `varying vec2 vUv;
    uniform float time;`
      );

      shader.vertexShader = shader.vertexShader.replace(
        `#include <uv_vertex>`,
        `vUv = uv;`
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
      vec3 newPosition = position;
      newPosition.z = 0.015 * sin(100. * (-0.5 * vUv.y - vUv.x) + 10. * time);
      
      vec3 transformed = newPosition;
      
      // gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    `
      )
      shader.fragmentShader = `
    varying vec2 vUv;
    uniform float time;
  ` + shader.fragmentShader

      shaderRef.current = shader
    }
  }, [])

  useFrame((state) => {
    if (!shaderRef.current) return
    const { uniforms }: any = shaderRef.current
    uniforms.time.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={ref} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={true}>
      <planeGeometry args={[10, 10, 100, 100]} />
      <meshPhysicalMaterial color='pink' reflectivity={1} metalness={0.5} roughness={0} clearcoat={1} transparent={true} side={THREE.DoubleSide} onBeforeCompile={onBeforeCompile} />
      {/*<waterFloorMaterial key={WaterFloorMaterial.key} imageTexture={texture} side={THREE.DoubleSide} />*/}
    </mesh>
  )
}

const WaterFloorMaterial = shaderMaterial(
  {
    time: 0,
    imageTexture: null
  },
  `
    varying vec2 vUv;
    uniform float time;
    
    void main() {
      vUv = uv;
      
      vec3 newPosition = position;
      newPosition.z = 0.015 * sin(100. * (-0.5 * vUv.y - vUv.x) + 10. * time);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    uniform float time;
    uniform sampler2D imageTexture;
    
    ${classicPerlin3DNoise}
      
    void main() {
      float t = time * 1.5;
    
      float uvX = vUv.x;
      float uvY = vUv.y;
      
      vec4 imageColor = texture2D(imageTexture, vec2(uvX, uvY));
      vec4 baseColor = vec4(0.0, 0.8, 1.0, 1.0);
      gl_FragColor = mix(baseColor, imageColor, 0.5);
    }
  `
)

declare global {
  namespace JSX {
    interface IntrinsicElements {
      waterFloorMaterial: ReactThreeFiber.Node<
        typeof WaterFloorMaterial & JSX.IntrinsicElements['shaderMaterial'],
        typeof WaterFloorMaterial
      >
    }
  }
}

extend({ WaterFloorMaterial })
