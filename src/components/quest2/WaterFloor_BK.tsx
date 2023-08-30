import { useMemo, useRef } from 'react'
import { MeshReflectorMaterial, Reflector, useTexture } from '@react-three/drei'
// import gridImage from '@static/media/images/texture.grid.png'
import gridImage from '@static/media/images/noise64.png'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { classicPerlin3DNoise } from '@src/utils/glsl.ts'
import { ShaderMaterial } from 'three'

export default function WaterFloor() {
  const texture = useTexture(gridImage)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  const ref = useRef<THREE.Mesh>(null!)
  const shaderRef = useRef<ShaderMaterial>(null!)
  const materialRef = useRef(null!)

  const onBeforeCompile = useMemo(() => {
    return (shader: ShaderMaterial) => {
      shader.uniforms.uTime = { value: 0 }
      shader.uniforms.imageTexture = { value: texture }

      shader.vertexShader = shader.vertexShader.replace(
        `#include <uv_pars_vertex>`,
        `varying vec2 vUv;
        varying vec3 vPos;
        uniform float uTime;`,
      )

      shader.vertexShader = shader.vertexShader.replace(`#include <uv_vertex>`, `vUv = uv;`)

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
          vec3 newPosition = position;
          newPosition.z = 0.015 * sin(100. * (-0.5 * vUv.y - vUv.x) + 10. * uTime);
          vPos = newPosition;
          
          vec3 transformed = newPosition;
        `,
      )
      shader.fragmentShader =
        `
        varying vec2 vUv;
        varying vec3 vPos;
        uniform float uTime;
        uniform sampler2D imageTexture;
    
        ${classicPerlin3DNoise}
      ` + shader.fragmentShader

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <map_fragment>`,
        `
          float uvX = vUv.x;
          float uvY = vUv.y;
          
          vec4 imageColor = texture2D(imageTexture, vec2(uvX, uvY));
          vec4 baseColor = vec4(0.0, 0.8, 1.0, 1.0);
          vec4 mixed = mix(baseColor, imageColor, 0.5) * 0.2;
          
          diffuseColor += mixed + vec4(vec3(vPos.z), 0.1);
        `,
      )

      shaderRef.current = shader
    }
  }, [])

  useFrame((state) => {
    if (!shaderRef.current) return
    const { uniforms }: any = shaderRef.current
    uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={ref} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={false}>
      <planeGeometry args={[10, 10, 100, 100]} />
      <MeshReflectorMaterial
        ref={materialRef}
        color='pink'
        // transmission={0.5}
        metalness={0}
        roughness={0}
        transparent={true}
        side={THREE.DoubleSide}
        resolution={2048}
        // onBeforeCompile={onBeforeCompile}
        // ior={1}
        mirror={1}
        distortionMap={texture}
        distortion={0.05}
      />
    </mesh>
  )
}
