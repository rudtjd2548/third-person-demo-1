import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { useControls } from 'leva'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import dudvImg from '/static/media/images/waternormals.jpeg'

export default function WaterFloor() {
  const dudvMap = useTexture(dudvImg)
  dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping
  const ref = useRef<THREE.Group>(null!)
  const controls = useControls(
    'mirror',
    {
      color: '#fff',
      clipBias: { min: 0, max: 0.1, step: 0.001, value: 0 },
      waveStrength: { min: 0, max: 1, step: 0.01, value: 0.05 },
      waveSpeed: { min: 0, max: 1, step: 0.01, value: 0.3 },
    },
    { collapsed: true },
  )

  useEffect(() => {
    const customShader = {
      uniforms: {
        color: { value: null },
        tDiffuse: { value: null },
        textureMatrix: { value: null },
        tDudv: { value: dudvMap },
        time: { value: 0 },
        angle: { value: 0 },
      },
      vertexShader: `
        uniform mat4 textureMatrix;
        varying vec4 vUv;
        uniform float time;
        uniform float angle;
  
        #include <common>
        #include <logdepthbuf_pars_vertex>
  
        void main() {
          vUv = textureMatrix * vec4( position, 1.0 );
  
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  
          #include <logdepthbuf_vertex>
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D tDiffuse;
        uniform sampler2D tDudv;
        uniform float time;
        varying vec4 vUv;
        uniform float angle;
  
        #include <logdepthbuf_pars_fragment>
  
        float blendOverlay( float base, float blend ) {
          return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
        }
  
        vec3 blendOverlay( vec3 base, vec3 blend ) {
          return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
        }
  
        void main() {
          #include <logdepthbuf_fragment>
          
          float sin_factor = sin(angle);
          float cos_factor = cos(angle);
          
          float waveStrength = ${controls.waveStrength};
          float waveSpeed = ${controls.waveSpeed};
          vec2 distortedUv = texture2D( tDudv, vec2( vUv.x, vUv.y ) ).rg * waveStrength;
          vec2 vv = vUv.xy;
          vv.x -= 5.0;
          vv.y -= 1.5;
          vv = vv * mat2(cos_factor, sin_factor, -sin_factor, cos_factor);
          distortedUv = vv + vec2( distortedUv.x, distortedUv.y - time * waveSpeed );
          
          vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 7.0 - 1.0 ) * waveStrength;

          vec4 uv = vec4( vUv );
          uv.xy += distortion;
  
          vec4 base = texture2DProj( tDiffuse, uv );
          vec4 water = vec4( blendOverlay( base.rgb, color ) * 0.455, 1.0 );
          
          vec4 colorBase = vec4(vec3(distortion.g * -0.302), 1.);
          
          gl_FragColor = mix(colorBase, vec4(1.0), water);
  
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    }

    const geometry = new THREE.CircleGeometry(500, 30)
    const reflector = new Reflector(geometry, {
      color: controls.color,
      clipBias: controls.clipBias,
      shader: customShader,
    })
    reflector.rotation.x = -Math.PI / 2
    ref.current.add(reflector)
    dispatchEvent(new Event('waterfloor-loaded'))

    return () => {
      geometry.dispose()
      reflector.dispose()
      ref.current?.remove(reflector)
    }
  }, [controls])

  useFrame((state) => {
    const reflector: any = ref.current.children[0]
    if (!reflector) return
    const { uniforms }: any = reflector.material
    uniforms.time.value = state.clock.elapsedTime
  })

  return <group ref={ref} name='water-floor' />
}
