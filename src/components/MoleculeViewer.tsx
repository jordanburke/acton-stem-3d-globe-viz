import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useMemo } from "react"
import * as THREE from "three"

import type { Molecule } from "../data/types"

interface MoleculeViewerProps {
  molecule: Molecule
  autoRotate?: boolean
}

// Component to render a single atom
function Atom({
  position,
  color,
  radius,
  simplified = false,
}: {
  position: [number, number, number]
  color: string
  radius: number
  simplified?: boolean
}) {
  const displayRadius = simplified ? radius * 1.3 : radius

  return (
    <mesh position={position}>
      <sphereGeometry args={[displayRadius, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={simplified ? color : "#000000"}
        emissiveIntensity={simplified ? 0.15 : 0}
      />
    </mesh>
  )
}

// Component to render a bond as a cylinder between two atoms
function Bond({
  start,
  end,
  order,
}: {
  start: [number, number, number]
  end: [number, number, number]
  order: number
}) {
  // Calculate bond position, rotation, and length
  const { position, rotation, length } = useMemo(() => {
    const dx = end[0] - start[0]
    const dy = end[1] - start[1]
    const dz = end[2] - start[2]
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz)

    // Midpoint
    const position: [number, number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    ]

    // Calculate rotation to align cylinder (Y-axis default) with bond direction
    const direction = new THREE.Vector3(dx, dy, dz).normalize()
    const yAxis = new THREE.Vector3(0, 1, 0)

    // Create quaternion to rotate from Y-axis to bond direction
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(yAxis, direction)

    // Convert quaternion to Euler angles
    const euler = new THREE.Euler().setFromQuaternion(quaternion)

    return {
      position,
      rotation: [euler.x, euler.y, euler.z] as [number, number, number],
      length,
    }
  }, [start, end])

  const bondRadius = 0.1 * order // Thicker for double/triple bonds

  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[bondRadius, bondRadius, length, 16]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  )
}

// Main molecule structure component
function MoleculeStructure({ molecule }: { molecule: Molecule }) {
  return (
    <group>
      {/* Render all atoms */}
      {molecule.atoms.map((atom) => (
        <Atom
          key={atom.id}
          position={atom.position}
          color={atom.color}
          radius={atom.radius}
          simplified={atom.simplified}
        />
      ))}

      {/* Render all bonds */}
      {molecule.bonds.map((bond, index) => {
        const atom1 = molecule.atoms.find((a) => a.id === bond.atom1)
        const atom2 = molecule.atoms.find((a) => a.id === bond.atom2)

        if (!atom1 || !atom2) return null

        return <Bond key={`bond-${index}`} start={atom1.position} end={atom2.position} order={bond.order} />
      })}
    </group>
  )
}

export function MoleculeViewer({ molecule, autoRotate = true }: MoleculeViewerProps) {
  // Calculate molecule bounds to determine optimal camera distance
  const cameraDistance = useMemo(() => {
    if (molecule.atoms.length === 0) return 15

    // Find the maximum distance from origin for any atom
    let maxDistance = 0
    for (const atom of molecule.atoms) {
      const distance = Math.sqrt(atom.position[0] ** 2 + atom.position[1] ** 2 + atom.position[2] ** 2)
      maxDistance = Math.max(maxDistance, distance + atom.radius)
    }

    // Camera should be far enough to see the entire molecule with some padding
    // Use a multiplier to ensure the molecule fits comfortably in view
    return Math.max(15, maxDistance * 2.5)
  }, [molecule])

  return (
    <Canvas
      style={{ width: "100%", height: "100%", background: "#000000" }}
      role="img"
      aria-label={`3D molecular structure of ${molecule.name} - ${molecule.description}`}
    >
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, cameraDistance]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} />
      <directionalLight position={[-10, -10, -10]} intensity={0.3} />
      <pointLight position={[0, 0, 10]} intensity={0.5} />

      {/* Controls */}
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={3.0}
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={Math.max(50, cameraDistance * 1.5)}
      />

      {/* Molecule */}
      <MoleculeStructure molecule={molecule} />
    </Canvas>
  )
}
