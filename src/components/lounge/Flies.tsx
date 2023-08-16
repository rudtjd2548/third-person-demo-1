import { useEffect, useRef } from 'react'
import { createNoise2D, NoiseFunction2D } from 'simplex-noise'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import textureImg from '@static/media/images/texture.particle.circle.png'
import { RootState, useFrame } from '@react-three/fiber'
import { randomIntBetween, randomNumBetween } from '@src/utils/utils.ts'

const count: number = 25

export default function Flies() {
  const texture = useTexture(textureImg)
  const groupRef = useRef<THREE.Group>(null!)
  const instances = useRef<FireFly[]>([]!)

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const particleInstance: FireFly = new FireFly(texture)
      const mesh = particleInstance.create()
      groupRef.current?.add(mesh)
      instances.current.push(particleInstance)
    }

    return (): void => {
      instances.current.forEach((instance: FireFly) => instance.dispose())
      instances.current = []
    }
  }, [])

  useFrame((state: RootState) => {
    let time = state.clock.elapsedTime * 0.1
    instances.current.forEach((instance: FireFly) => {
      instance.update(time)
    })
  })

  return <group ref={groupRef} />
}

class FireFly {
  private readonly texture: THREE.Texture
  private readonly amplitude: number
  private readonly frequency: number
  private readonly noise2D_x: NoiseFunction2D
  private readonly noise2D_y: NoiseFunction2D
  private readonly noise2D_z: NoiseFunction2D
  private vel: { x: number; y: number; z: number }
  private readonly maxRange: number[]
  private opacityDeg: number
  private readonly opacityDelta: number
  mesh: THREE.Sprite
  material: THREE.SpriteMaterial

  constructor(texture: THREE.Texture) {
    this.texture = texture
    this.amplitude = 0.002
    this.frequency = 10
    this.noise2D_x = createNoise2D()
    this.noise2D_y = createNoise2D()
    this.noise2D_z = createNoise2D()
    this.vel = { x: 0, y: 0, z: 0 }
    this.maxRange = [30, 15]
    this.opacityDeg = randomIntBetween(0, 360)
    this.opacityDelta = randomNumBetween(0.3, 1)
    this.mesh = new THREE.Sprite()
    this.material = new THREE.SpriteMaterial()

    this.create()
  }

  getRandomPosition(): THREE.Vector3 {
    const x = randomNumBetween(-this.maxRange[0], this.maxRange[0])
    const y = randomNumBetween(2, 10)
    const z = randomNumBetween(-this.maxRange[1], this.maxRange[1])
    return new THREE.Vector3(x, y, z)
  }

  setRandomPosition(): void {
    this.mesh.position.copy(this.getRandomPosition())
  }

  create(): THREE.Sprite {
    this.material.map = this.texture
    this.material.blending = THREE.AdditiveBlending
    this.material.transparent = true
    this.material.opacity = 0.2
    this.material.depthWrite = false

    this.mesh.material = this.material
    this.mesh.scale.setScalar(0.2)
    this.setRandomPosition()

    return this.mesh
  }

  dispose(): void {
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }

  update(t: number): void {
    // position with noise velocity
    this.vel.x = this.noise2D_x(this.vel.x * this.frequency, t) * this.amplitude
    this.vel.y = this.noise2D_y(this.vel.y * this.frequency, t) * this.amplitude
    this.vel.z = this.noise2D_z(this.vel.z * this.frequency, t) * this.amplitude
    this.mesh.position.x += this.vel.x
    this.mesh.position.y += this.vel.y
    this.mesh.position.z += this.vel.z

    // check outside
    const { x, z } = this.mesh.position
    if (Math.abs(x) > this.maxRange[0] || Math.abs(z) > this.maxRange[1]) {
      this.setRandomPosition()
    }

    // opacity
    this.opacityDeg += this.opacityDelta
    this.mesh.material.opacity = 0.15 + 0.1 * Math.cos((Math.PI / 180) * this.opacityDeg)
  }
}
