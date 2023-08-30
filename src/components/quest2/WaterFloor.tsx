import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { useControls } from 'leva'
import { useTexture } from '@react-three/drei'
import dudvImg from '/static/media/images/4141-normal.jpg'
import { useFrame } from '@react-three/fiber'

export default function WaterFloor() {
  const dudvMap = useTexture(dudvImg)
  dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping
  const ref = useRef<THREE.Group>(null!)
  const controls = useControls(
    'mirror',
    {
      color: '#fff',
      clipBias: { min: 0, max: 0.1, step: 0.001, value: 0 },
      waveStrength: { min: 0, max: 1, step: 0.01, value: 0.04 },
      waveSpeed: { min: 0, max: 1, step: 0.01, value: 0.15 },
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
      },
      vertexShader: `
        uniform mat4 textureMatrix;
        varying vec4 vUv;
  
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
  
        #include <logdepthbuf_pars_fragment>
  
        float blendOverlay( float base, float blend ) {
          return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
        }
  
        vec3 blendOverlay( vec3 base, vec3 blend ) {
          return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
        }
  
        void main() {
          #include <logdepthbuf_fragment>
          
          float waveStrength = ${controls.waveStrength};
          float waveSpeed = ${controls.waveSpeed};

          vec2 distortedUv = texture2D( tDudv, vec2( vUv.x + time * waveSpeed, vUv.y ) ).rg * waveStrength;
          distortedUv = vUv.xy + vec2( distortedUv.x, distortedUv.y - time * waveSpeed );
          vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 2.0 - 1.0 ) * waveStrength;

          vec4 uv = vec4( vUv );
          uv.xy += distortion;
  
          vec4 base = texture2DProj( tDiffuse, uv );
          vec4 water = vec4( blendOverlay( base.rgb, color ), 1.0 );
          
          vec4 colorBase = vec4(vec3(distortedUv.rg, 0.), 1.);
          
          gl_FragColor = mix(base, water, 1.0);
  
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    }

    const geometry = new THREE.PlaneGeometry(500, 500)
    const reflector = new Reflector(geometry, {
      color: controls.color,
      clipBias: controls.clipBias,
      shader: customShader,
    })
    reflector.rotation.x = -Math.PI / 2
    ref.current.add(reflector)

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

  return <group ref={ref} />
}
