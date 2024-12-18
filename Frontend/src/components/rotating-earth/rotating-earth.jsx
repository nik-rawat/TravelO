import { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import Hero from "./Hero";
import Navbar from "../Navbar";

function Earth({ onLoaded }) {
  const meshRef = useRef(null);
  const texture = useLoader(THREE.TextureLoader, "/assets/earth-texture-min.jpg");

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
    <mesh ref={meshRef} position={[0, -6, 5]} name="earth">
      <sphereGeometry args={[5, 64, 64]} />
      <meshStandardMaterial 
        map={texture}
        bumpScale={0.05} 
        metalness={0.3} 
        roughness={0.7} 
      />
      <Hero />
    </mesh>
  );
}

export default function RotatingEarth({ onLoaded }) {
  const [spring, api] = useSpring(() => ({
    from: { scale: [1, 1, 1] },
    to: { scale: [0.4, 0.4, 0.4] },
    config: { tension: 170, friction: 26, duration: 500 },
    onRest: onLoaded,
  }));

  useEffect(() => {
    api.start();
  }, [api]);

  return (
    <div className="relative w-svw h-svh bg-black">
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 }}>
        <Navbar className="relative z-10"/>
      </div>
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 40 }} 
        gl={{ antialias: true }}
        dpr={ window.devicePixelRatio }
      >
        <ambientLight intensity={2.5} />
        <pointLight position={[10, 10, 20]} intensity={100}/>
        <a.group scale={spring.scale}>
          <Earth onLoaded={onLoaded} />
        </a.group>
        <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade speed={1.5} />
        <OrbitControls enableZoom={false} enableRotate={false} />
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.1} 
            luminanceSmoothing={1.8} 
            height={300}
            kernelSize={3}
            intensity={0.5}
            selection={['earth']} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}