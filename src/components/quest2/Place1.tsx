import {MeshTransmissionMaterial, useGLTF} from "@react-three/drei";
import rock from '@static/media/models/rocks.glb?url'
import Letsee from '@static/media/models/Letsee.ktx.1024.glb?url'
import Quest from '@static/media/models/Quest.ktx.1024.glb?url'
import {useThree} from "@react-three/fiber";
import {getKtx2Loader} from "@src/utils/utils.ts";

export default function Place1() {
  const { nodes } = useGLTF(rock)
  const { gl } = useThree()
  const letseeGltf = useGLTF(Letsee, true, true, (loader) => {
    const ktx2Loader = getKtx2Loader(gl)
    loader.setKTX2Loader(ktx2Loader)
  })
  const questGltf = useGLTF(Quest, true, true, (loader) => {
    const ktx2Loader = getKtx2Loader(gl)
    loader.setKTX2Loader(ktx2Loader)
  })

  return (
    <group position={[0.5, 0, 0]}>
      <mesh position={[-1, 0, 0]} scale={80} rotation={[0, Math.PI / 180 * 210, 0]} geometry={nodes['rock-export'].geometry} castShadow={true} receiveShadow={true}>
        <MeshTransmissionMaterial thickness={0.2} anisotropy={0} anisotropicBlur={0} roughness={0.5} />
      </mesh>

      <mesh geometry={letseeGltf.nodes['mesh_0'].geometry} material={letseeGltf.nodes['mesh_0'].material} position={[-2.5, 0.25, 1.2]} rotation={[0, 0.7, 0]} scale={0.0001} />
      <mesh geometry={questGltf.nodes['mesh_0'].geometry} material={questGltf.nodes['mesh_0'].material} position={[-2.0, -0.05, 1.8]} rotation={[-1.0, 0.7, 0.8]} scale={0.0001} />
    </group>
  )
}
