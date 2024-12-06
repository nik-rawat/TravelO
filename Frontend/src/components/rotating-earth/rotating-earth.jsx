import { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function Earth({ onLoaded }) {
  const meshRef = useRef(null);
  const texture = useLoader(THREE.TextureLoader, "./assets/earth-texture-max.jpg");
  // const bumpMap = useLoader(THREE.TextureLoader, "./assets/earth-bump-map.jpg");
  // const specularMap = useLoader(THREE.TextureLoader, "./assets/earth-specular-map.jpg");

  // Set texture filtering and anisotropy
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16; // Adjust based on your GPU capabilities

  useEffect(() => {
    if (onLoaded) {
      onLoaded();
    }
  }, [onLoaded]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, -4.5, 0]}> {/* Position the Earth along the negative Y-axis */}
        <sphereGeometry args={[3.5, 256, 256]} /> {/* Increased segments for more detail */}
        <meshStandardMaterial 
          map={texture} 
          // bumpMap={bumpMap} 
          bumpScale={0.05} 
          // specularMap={specularMap} 
          metalness={0.3} 
          roughness={0.7} 
        />
      </mesh>
      <Text
        position={[0, 1.5, 0]} // Position the text behind the Earth and adjust for the new Earth position
        fontSize={0.5}
        color="white"
        // font="/path/to/classy-font.woff" // Ensure you have a classy font file
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        Travelo
      </Text>
    </>
  );
}

export default function RotatingEarth({ onLoaded }) {
  const [spring, api] = useSpring(() => ({
    from: { scale: [1, 1, 1] },
    to: { scale: [0.4, 0.4, 0.4] },
    config: { tension: 170, friction: 26, duration: 500 }, // Adjusted for smoother animation
    onRest: onLoaded,
  }));

  useEffect(() => {
    api.start();
  }, [api]);

  return (
    <div className="relative w-full h-svh bg-black">
      <Canvas camera={{ position: [0, 0, 6], fov: 17 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        <a.group scale={spring.scale}>
          <Earth onLoaded={onLoaded} />
        </a.group>
        <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade speed={1} />
        <OrbitControls enableZoom={false} enableRotate={false} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}