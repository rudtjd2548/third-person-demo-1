import {shaderMaterial} from "@react-three/drei";
import {noise} from "@src/utils/glsl.ts";
import {extend, ReactThreeFiber} from "@react-three/fiber";
import * as THREE from 'three'

export default function SkyDom() {
  return (
    <mesh>
      <sphereGeometry args={[500, 32]} />
      <skyDomMaterial key={SkyDomMaterial.key} side={THREE.DoubleSide} />
    </mesh>
  )
}

const SkyDomMaterial: any = shaderMaterial(
  {
    time: 0,
  },
  `
    ${noise}
    
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }  
  `,
  `
    varying vec2 vUv;
  
    void main() {
      vec4 topColor = vec4(0.01, 0.01, 0.08, 1.0);
      vec4 bottomColor = vec4(0.0, 0.0, 0.0, 1.0);
      gl_FragColor = mix(topColor, bottomColor, 1.52 - vUv.y) * 1.5;
    }  
  `,
)

declare global {
  namespace JSX {
    interface IntrinsicElements {
      skyDomMaterial: ReactThreeFiber.Node<
        typeof SkyDomMaterial & JSX.IntrinsicElements['shaderMaterial'],
        typeof SkyDomMaterial
      >
    }
  }
}

extend({ SkyDomMaterial })

