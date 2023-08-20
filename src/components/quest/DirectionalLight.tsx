import { useEffect, useRef } from 'react'
import { useControls } from 'leva'
import { DirectionalLight, Vector3 } from 'three'

export default function CustomDirectionalLight({ ...props }) {
  const ref = useRef<DirectionalLight>(null!)
  const controls = useControls(
    'directional light',
    {
      x: { min: -50, max: 50, step: 0.01, value: -42 },
      y: { min: -50, max: 50, step: 0.01, value: -25 },
      z: { min: -50, max: 50, step: 0.01, value: 50 },
      intensity: { min: 0, max: 10, step: 0.01, value: 5 },
      color: '#000',
      camera: { min: 0, max: 1000, step: 0.01, value: 100 },
      near: { min: 0, max: 10, step: 0.01, value: 0.1 },
      far: { min: 0, max: 2000, step: 0.1, value: 1000 },
      bias: { min: -0.01, max: 0.01, step: 0.0001, value: -0.0003 },
    },
    { collapsed: true },
  )

  useEffect(() => {
    ref.current!.shadow.needsUpdate = true
    ref.current!.position.copy(new Vector3(controls.x, controls.y, controls.z))
  }, [controls])

  return (
    <directionalLight
      ref={ref}
      position={[controls.x, controls.y, controls.z]}
      castShadow={true}
      shadow-mapSize-height={2048}
      shadow-mapSize-width={2048}
      shadow-camera-left={-controls.camera}
      shadow-camera-right={controls.camera}
      shadow-camera-top={controls.camera}
      shadow-camera-bottom={-controls.camera}
      shadow-camera-near={controls.near}
      shadow-camera-far={controls.far}
      intensity={controls.intensity}
      shadow-bias={controls.bias}
      {...props}
    />
  )
}
