import { useEffect, useRef, useState } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import glb from '@static/media/models/astronauta.glb?url'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'

const speed: number = 0.065

useGLTF.preload(glb)

export default function Player() {
  const { scene: object, animations } = useGLTF(glb)
  const { actions, names }: any = useAnimations(animations, object)
  const ref = useRef<Group>(null!)
  const targetPosition = useRef<Vector3>(null!)
  const prevAnimationState = useRef<string>(null!)
  const [animationState, setAnimationState] = useState<string>(names[4])

  useEffect(() => {
    actions[names[9]]?.setDuration(0.4)
    actions[names[4]]?.reset().play()
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [])

  useEffect(() => {
    actions[prevAnimationState.current]
      ?.crossFadeTo(actions[animationState] as THREE.AnimationAction, 0.1, false)
      .stop()
    actions[animationState]?.fadeIn(0.1).play()
    prevAnimationState.current = animationState
  }, [animationState])

  useEffect(() => {
    dispatchEvent(new Event('main-player-ready'))

    const onClickGround = ({ detail }: CustomEvent): void => {
      targetPosition.current = detail.pointer
      setAnimationState(names[9])
      // console.log(ref.current.position, ref.current.rotation)
    }
    addEventListener('click-ground', onClickGround as () => void)
    return () => removeEventListener('click-ground', onClickGround as () => void)
  }, [])

  useFrame((_, delta) => {
    if (!ref.current || !targetPosition.current) return
    const currentPosition = ref.current.position
    const targetVector = new Vector3().subVectors(targetPosition.current, currentPosition)

    if (targetVector.length() > speed) {
      const t = delta * 100

      targetVector.normalize().multiplyScalar(speed * t)
      ref.current.position.add(targetVector)

      const initialDirection = new THREE.Vector3(0, 0, 1) // 오브젝트의 초기 방향
      const targetDirection = targetVector.clone().normalize() // 목표 방향
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(initialDirection, targetDirection)
      ref.current.quaternion.slerp(targetQuaternion, t * 0.1)
    } else {
      setAnimationState(names[4])
    }
  })

  return <primitive ref={ref} object={object} name='main-player' rotation={[0, 1.22, 0]} position={[-21, 0, 9]} />
}
