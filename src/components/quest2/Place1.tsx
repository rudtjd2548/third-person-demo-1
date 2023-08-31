import {MeshTransmissionMaterial} from "@react-three/drei";

export default function Place1() {
  return (
    <group position={[0, 0, 4]}>
      <mesh position={[0, -0.08, 0]} castShadow={true} receiveShadow={true}>
        <boxGeometry args={[4, 0.2, 2.5]} />
        <MeshTransmissionMaterial thickness={0.2} anisotropy={0} anisotropicBlur={0} roughness={0.5} />
      </mesh>
    </group>
  )
}
