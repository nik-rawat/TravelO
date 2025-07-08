/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";
import Hero from "./Hero";
import Navbar from "../Navbar";

function Earth({ onLoaded }) {
  const meshRef = useRef(null);
  const texture = useLoader(THREE.TextureLoader, "/assets/earth-texture-min.jpg");

  // Ref for drag state and velocity to persist across renders
  const dragState = useRef({
    isDragging: false,
    lastX: 0,
    velocity: 0, // Store rotational velocity
    autoRotateSpeed: 0.05 // Base speed for continuous self-rotation
  });

  useEffect(() => {
    // This effect ensures 'onLoaded' is called once the Earth's texture is loaded.
    if (texture && onLoaded) {
      onLoaded();
    }
  }, [texture, onLoaded]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Apply self-rotation
      meshRef.current.rotation.y += delta * dragState.current.autoRotateSpeed;

      // Apply momentum rotation if not dragging
      if (!dragState.current.isDragging) {
        meshRef.current.rotation.y += dragState.current.velocity;
        // Decay the velocity over time for a smooth stop
        dragState.current.velocity *= 0.95; // Adjust this factor for more/less friction
        // Stop decaying if velocity is very small to prevent infinite tiny rotations
        if (Math.abs(dragState.current.velocity) < 0.0001) {
          dragState.current.velocity = 0;
        }
      }
    }
  });

  const handlePointerDown = (event) => {
    event.stopPropagation(); // Prevent other canvas elements from reacting
    dragState.current.isDragging = true;
    dragState.current.lastX = event.clientX;
    dragState.current.velocity = 0; // Reset velocity when starting a new drag
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerMove = (event) => {
    if (dragState.current.isDragging && meshRef.current) {
      const deltaX = event.clientX - dragState.current.lastX;
      const sensitivity = 0.005; // Adjust sensitivity for drag speed

      // Apply drag rotation directly
      meshRef.current.rotation.y += deltaX * sensitivity;

      // Update velocity based on current drag speed
      dragState.current.velocity = deltaX * sensitivity;

      dragState.current.lastX = event.clientX;
    }
  };

  const handlePointerUp = () => {
    dragState.current.isDragging = false;
    document.body.style.cursor = 'grab';
  };

  // Add global event listeners for pointer move and up to ensure drag ends
  // even if the mouse leaves the mesh while dragging.
  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Set initial cursor style
    document.body.style.cursor = 'grab';

    return () => {
      // Clean up event listeners when component unmounts
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = 'auto'; // Reset cursor on unmount
    };
  }, []);

  return (
    <a.mesh
      ref={meshRef}
      // Earth's position set to [0, 0, 0] relative to its parent group
      position={[0, 0, 0]}
      name="earth"
      onPointerDown={handlePointerDown} // Only attach pointer down to the mesh
    >
      <sphereGeometry args={[5, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        bumpScale={0.05}
        metalness={0.3}
        roughness={0.7}
      />
    </a.mesh>
  );
}

export default function RotatingEarth({ onLoaded }) {
  const [spring, api] = useSpring(() => ({
    from: { scale: [1, 1, 1], rotation: 0 },
    to: { scale: [0.4, 0.4, 0.4], rotation: Math.PI * 2 },
    config: { tension: 100, friction: 5, duration: 1800, easing: (t) => t * (2 - t) },
  }));

  useEffect(() => {
    // Start the initial scaling and rotation animation for the Earth.
    api.start();
  }, [api]);

  return (
    <div className="relative w-svw h-svh bg-gradient-to-b from-black via-slate-950 to-slate-900">
      {/* Navbar is a static DOM element, positioned above the Canvas */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 2, // Ensure Navbar is above Canvas
          pointerEvents: "auto", // Ensure Navbar is clickable
        }}
      >
        <Navbar />
      </div>
      <div className="">
        <Canvas
          // Camera position adjusted to frame the centered Hero and top of Earth
          camera={{ position: [0, 0, 6], fov: 40 }}
          gl={{ antialias: true }}
          dpr={window.devicePixelRatio}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1, // Canvas stays below Navbar
          }}
        >
          <ambientLight intensity={2.5} />
          <pointLight position={[10, 10, 20]} intensity={100} />

          {/* This a.group applies the initial scale and rotation animation to the Earth.
              Its position is adjusted to move the Earth downwards. */}
          <a.group rotation-y={spring.rotation} scale={spring.scale} position={[0, -2.5, 2]}>
            <Hero /> {/* Render the actual Hero component content */}
            <Earth onLoaded={onLoaded} /> {/* The Earth mesh */}
          </a.group>

          {/* Stars background, also a direct child of Canvas */}
          <Stars
            radius={300}
            depth={60}
            count={5000}
            factor={7}
            saturation={0}
            fade
            speed={1.5}
            />
        </Canvas>
      </div>
    </div>
  );
}
