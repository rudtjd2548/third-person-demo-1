import {useEffect, useLayoutEffect, useRef} from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import {rLerp, debounce, lerp} from '@src/utils/utils.ts'
import {useDispatch} from "react-redux";
import {cardData, TAU} from "@src/utils/constants.ts";
import {setScrollCurrentAction} from "@src/redux/reducer/main.ts";
import {clamp} from "maath/misc";

const cameraRadius = 15
const scrollPower = 0.011
const debounceTime = 1000
const lookAtPositionY = 5.8

export default function CameraControl() {
  const { camera, scene } = useThree()
  const lerpedAngle = useRef<number>(0)
  const targetAngle = useRef<number>(0)
  const waterFloor = useRef<THREE.Group>(null!)
  const dispatch = useDispatch()

  const lerpedRotZ = useRef<number>(0)
  const targetRotZ = useRef<number>(0)

  useLayoutEffect(() => {
    const onWaterFloorLoaded = () => {
      waterFloor.current = scene.getObjectByName('water-floor') as THREE.Group
    }
    addEventListener('waterfloor-loaded', onWaterFloorLoaded)
    return () => removeEventListener('waterfloor-loaded', onWaterFloorLoaded)
  }, [])

  useEffect(() => {
    const debouncedDispatch = debounce((index: number) => {
      dispatch(setScrollCurrentAction(index))
      targetAngle.current = -TAU / (cardData.length) * index
    }, debounceTime, false)

    const onWheel = (e: any) => {
      const direction = Math.abs(e.wheelDeltaY) / e.wheelDeltaY
      targetAngle.current = (targetAngle.current + scrollPower * direction) % TAU

      const curr = -targetAngle.current % TAU
      const percent = curr / TAU
      const length = cardData.length
      const index = Math.round((percent * length) % length)
      const finalIndex = Math.abs(index < 0 ? length + index : index === length ? 0 : index)
      debouncedDispatch(finalIndex)

      targetRotZ.current = clamp(targetRotZ.current - 0.02 * direction, -0.3, 0.3)
    }
    addEventListener('wheel', onWheel as () => void)
    return () => removeEventListener('wheel', onWheel as () => void)
  }, [])

  useFrame((_, delta) => {
    if (lerpedAngle.current !== targetAngle.current) {
      // lerp angle 구하기
      lerpedAngle.current = +(rLerp(lerpedAngle.current, targetAngle.current, delta).toFixed(4))
      // 카메라에 angle 적용
      camera.position.x = cameraRadius * Math.cos(lerpedAngle.current)
      camera.position.z = cameraRadius * Math.sin(lerpedAngle.current)
      camera.lookAt(0, lookAtPositionY, 0)
      // waterFloor에 angle 적용
      if (waterFloor.current?.children[0]) {
        const { material } = waterFloor.current.children[0] as any
        material.uniforms.angle.value = -lerpedAngle.current
      }
    }
    if (lerpedRotZ.current !== targetRotZ.current) {
      // 카메라 rotate Z 효과
      targetRotZ.current = targetRotZ.current * 0.7
      lerpedRotZ.current = +(lerp(lerpedRotZ.current, targetRotZ.current, delta).toFixed(4))

      camera.rotateZ(lerpedRotZ.current)
    }
  })

  return null
}
