import { useRef } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import * as THREE from "three"

function Earth() {
  const meshRef = useRef(null)
  const texture = useLoader(THREE.TextureLoader, "./assets/earth-texture.jpg")

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

export default function RotatingEarth() {
  return (
        <div className="relative w-full h-full bg-black">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.95} />
            <pointLight position={[10, 10, 10]} />
            <Earth />
            <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade speed={1} />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
  )
}

