import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import { Group, Vector3 } from 'three'
import { PerspectiveCameraProps, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

export default function CustomPerspectiveCamera() {
  const controls = useControls(
    'perspectiveCamera',
    {
      x: { min: -100, max: 100, step: 1, value: 0 },
      y: { min: -100, max: 100, step: 1, value: 4 },
      z: { min: -100, max: 100, step: 1, value: 3 },
      near: { min: 0, max: 10, step: 0.01, value: 0.1 },
      far: { min: 0, max: 2000, step: 1, value: 1000 },
      fov: { min: 1, max: 100, step: 1, value: 30 },
      zoom: { min: 0, max: 10, step: 0.01, value: 1 },
    },
    { collapsed: true },
  )
  const { scene } = useThree()
  const player = useRef<Group>(null!)
  const ref = useRef<PerspectiveCameraProps>(null!)
  const currentPosition = useRef(new Vector3())
  const currentLookat = useRef(new Vector3())

  useEffect(() => {
    const onMainPlayerReady = () => {
      player.current = scene.getObjectByName('main-player')
    }
    window.addEventListener('main-player-ready', onMainPlayerReady)
    return () => window.removeEventListener('main-player-player', onMainPlayerReady)
  }, [])

  const calculateIdleOffset = () => {
    const idealOffset = new Vector3(-1, 8, -17)
    idealOffset.applyQuaternion(player.current.quaternion)
    idealOffset.add(player.current.position)
    return idealOffset
  }

  const calculateIdealLookat = () => {
    const idealLookat = new Vector3(1, 0, 20)
    idealLookat.applyQuaternion(player.current.quaternion)
    idealLookat.add(player.current.position)
    return idealLookat
  }

  useFrame((state, delta) => {
    if (!player.current) return
    const idealOffset = calculateIdleOffset()
    const idealLookat = calculateIdealLookat()

    const t = 1 - Math.pow(0.001, state.clock.elapsedTime)

    currentPosition.current.lerp(idealOffset, t * 0.03)
    currentLookat.current.lerp(idealLookat, t * 0.03)

    ref.current.position.copy(currentPosition.current)
    ref.current.lookAt(currentLookat.current)
  })

  return (
    <>
      {/*<OrbitControls enableDamping enableRotate={true} />*/}
      <PerspectiveCamera
        ref={ref}
        makeDefault={true}
        position={[controls.x, controls.y, controls.z]}
        fov={controls.fov}
        near={controls.near}
        far={controls.far}
        zoom={controls.zoom}
      />
    </>
  )
}
