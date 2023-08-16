import { PerspectiveCamera } from '@react-three/drei'
import { useControls } from 'leva'
import { Group } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { lerp } from '@src/utils/utils.ts'

export default function CustomPerspectiveCamera() {
  const controls = useControls(
    'perspectiveCamera',
    {
      x: { min: -100, max: 100, step: 1, value: -21 },
      y: { min: -100, max: 100, step: 1, value: 11 },
      z: { min: -100, max: 100, step: 1, value: 19 },
      near: { min: 0, max: 10, step: 0.01, value: 0.1 },
      far: { min: 0, max: 2000, step: 1, value: 1000 },
      fov: { min: 1, max: 100, step: 1, value: 30 },
      zoom: { min: 0, max: 10, step: 0.01, value: 0.4 },
    },
    { collapsed: true },
  )
  const { scene } = useThree()
  const player = useRef<Group>(null!)
  const ref = useRef<Group>(null!)
  const currCameraX = useRef<number>(0)
  const prevPlayerX = useRef<number>(0)

  useEffect(() => {
    const onMainPlayerReady = () => {
      player.current = scene.getObjectByName('main-player') as Group
      currCameraX.current = prevPlayerX.current = player.current.position.x
    }
    window.addEventListener('main-player-ready', onMainPlayerReady)
    return () => window.removeEventListener('main-player-player', onMainPlayerReady)
  }, [])

  useFrame((_, delta) => {
    if (!player.current) return
    // const t = delta * 2
    // const playerDiffX = player.current.position.x - prevPlayerX.current
    // const normalizedPlayerDiffX = playerDiffX / Math.abs(playerDiffX) || 0
    // const idealX = player.current.position.x + normalizedPlayerDiffX * 4

    const t = delta * 5
    const idealX = player.current.position.x
    currCameraX.current = lerp(currCameraX.current, idealX, t)
    ref.current.position.x = currCameraX.current
    ref.current.lookAt(currCameraX.current, 0, 0)

    prevPlayerX.current = player.current.position.x
  })

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault={true}
      position={[controls.x, controls.y, controls.z]}
      fov={controls.fov}
      near={controls.near}
      far={controls.far}
      zoom={controls.zoom}
    />
  )
}
