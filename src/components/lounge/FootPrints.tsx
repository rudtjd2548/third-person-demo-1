import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import leftImg from '/static/media/images/texture.footprint.left.png'
import rightImg from '/static/media/images/texture.footprint.right.png'

export default function Footprints() {
  const groupRef = useRef<THREE.Group>(null!)
  const instances = useRef<Footprint[]>([]!)
  const textures = useTexture([leftImg, rightImg])
  const { scene } = useThree()

  useEffect(() => {
    const player: THREE.Object3D | undefined = scene.getObjectByName('main-player')
    let textureIndex: number = 0

    const createFootprint = () => {
      textureIndex = (textureIndex + 1) % 2
      const texture = textures[textureIndex]
      texture.userData.index = textureIndex
      const position = new THREE.Vector3()
      player?.getWorldPosition(position)
      const quaternion = new THREE.Quaternion()
      player?.getWorldQuaternion(quaternion)

      const instance: Footprint = new Footprint(texture)
      const mesh = instance.create(position, quaternion)
      groupRef.current.add(mesh)
      instances.current.push(instance)
    }

    addEventListener('create-footprint', createFootprint)
    return () => removeEventListener('create-footprint', createFootprint)
  }, [])

  useFrame((_, delta) => {
    instances.current.forEach((instance: Footprint, index: number) => {
      instance.update(delta)

      if (instance.mesh.material instanceof THREE.Material && instance.mesh.material.opacity <= 0.4) {
        instance.dispose()
        groupRef.current.remove(instance.mesh)
        instances.current.splice(index, 1)
      }
    })
  })

  return <group ref={groupRef} />
}

class Footprint {
  private readonly texture: THREE.Texture
  private readonly textureIndex: number
  mesh: THREE.Mesh

  constructor(texture: THREE.Texture) {
    this.texture = texture
    this.mesh = new THREE.Mesh()
    this.textureIndex = texture.userData.index
  }

  create(position: THREE.Vector3, quaternion: THREE.Quaternion): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(1, 45 / 20)
    const material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 1,
      depthWrite: false,
      side: THREE.BackSide,
      alphaTest: 0.3,
    })
    this.mesh.geometry = geometry
    this.mesh.material = material
    this.mesh.position.copy(position)
    this.mesh.scale.setScalar(0.25)
    this.mesh.rotation.setFromQuaternion(quaternion)
    this.mesh.rotateX(Math.PI / 2)

    this.mesh.position.x += Math.cos(this.mesh.rotation.z) * this.textureIndex * 0.5
    this.mesh.position.z += Math.sin(this.mesh.rotation.z) * this.textureIndex * 0.5

    return this.mesh
  }
  dispose() {
    this.mesh.geometry.dispose()
    if (this.mesh.material instanceof THREE.Material) {
      this.mesh.material.dispose()
    }
  }
  update(delta: number) {
    if (this.mesh.material instanceof THREE.Material) {
      this.mesh.material.opacity -= delta / 2
    }
  }
}
