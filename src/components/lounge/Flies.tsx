import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import textureImg from '@static/media/images/texture.particle.circle.png'
import { useFrame } from '@react-three/fiber'
import { dtr, randomIntBetween, randomNumBetween } from '@src/utils/utils.ts'

const count: number = 25

export default function Flies() {
  const texture = useTexture(textureImg)
  const groupRef = useRef<THREE.Group>(null)
  const instances = useRef<[]>([])

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const particleInstance = new FireFly(texture)
      const mesh = particleInstance.create()
      groupRef.current?.add(mesh)
      instances.current.push(particleInstance)
    }

    return () => {
      instances.current.forEach((instance) => instance.dispose())
      instances.current = []
    }
  }, [])

  useFrame((state) => {
    let time = state.clock.elapsedTime * 0.1
    instances.current.forEach((instance) => {
      instance.update(time)
    })
  })

  return <group ref={groupRef} />
}

class FireFly {
  constructor(texture) {
    this.texture = texture
    this.amplitude = 0.002
    this.frequency = 10
    this.noise2D_x = createNoise2D()
    this.noise2D_y = createNoise2D()
    this.noise2D_z = createNoise2D()
    this.vel = { x: 0, y: 0 }
    this.maxRange = 55
    this.opacityDeg = randomIntBetween(0, 360)
    this.opacityDelta = randomNumBetween(0.3, 1)
    this.create()
  }

  getRandomPosition() {
    const radius = randomNumBetween(-this.maxRange, this.maxRange)
    const a1 = randomNumBetween(0, Math.PI * 2)
    const a2 = randomNumBetween(0, Math.PI * 2)
    const x = Math.sin(a1) * Math.cos(a2) * radius
    const y = randomNumBetween(2, 10)
    const z = Math.cos(a1) * radius
    return new THREE.Vector3(x, y, z)
  }

  setRandomPosition() {
    this.mesh.position.copy(this.getRandomPosition())
  }

  create() {
    this.material = new THREE.SpriteMaterial({
      map: this.texture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    })
    this.mesh = new THREE.Sprite(this.material)
    this.mesh.scale.setScalar(0.2)
    this.setRandomPosition()

    return this.mesh
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }

  update(t) {
    // position with noise velocity
    this.vel.x = this.noise2D_x(this.vel.x * this.frequency, t) * this.amplitude
    this.vel.y = this.noise2D_y(this.vel.y * this.frequency, t) * this.amplitude
    this.vel.z = this.noise2D_z(this.vel.z * this.frequency, t) * this.amplitude
    this.mesh.position.x += this.vel.x
    this.mesh.position.y += this.vel.y
    this.mesh.position.z += this.vel.z

    // check outside
    const { x, y, z } = this.mesh.position
    if (x > this.maxRange || z > this.maxRange) {
      this.setRandomPosition()
    }

    // opacity
    this.opacityDeg += this.opacityDelta
    this.mesh.material.opacity = 0.15 + 0.1 * Math.cos((Math.PI / 180) * this.opacityDeg)
  }
}
