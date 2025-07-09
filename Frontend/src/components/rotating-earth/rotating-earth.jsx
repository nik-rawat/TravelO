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
        // Reduced friction - velocity decays much slower for longer momentum
        dragState.current.velocity *= 0.992; // Increased from 0.95 to 0.992 for less friction
        // Stop decaying if velocity is very small to prevent infinite tiny rotations
        if (Math.abs(dragState.current.velocity) < 0.0005) { // Reduced threshold
          dragState.current.velocity = 0;
        }
      }
    }
  });

  // Unified function to get X coordinate from both mouse and touch events
  const getEventX = (event) => {
    if (event.touches && event.touches.length > 0) {
      return event.touches[0].clientX;
    } else if (event.changedTouches && event.changedTouches.length > 0) {
      return event.changedTouches[0].clientX;
    }
    return event.clientX;
  };

  const handlePointerDown = (event) => {
    event.stopPropagation(); // Prevent other canvas elements from reacting
    dragState.current.isDragging = true;
    dragState.current.lastX = getEventX(event);
    dragState.current.velocity = 0; // Reset velocity when starting a new drag
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerMove = (event) => {
    if (dragState.current.isDragging && meshRef.current) {
      const currentX = getEventX(event);
      const deltaX = currentX - dragState.current.lastX;
      const sensitivity = 0.01; // Increased from 0.005 to 0.01 for more responsive dragging

      // Apply drag rotation directly
      meshRef.current.rotation.y += deltaX * sensitivity;

      // Update velocity based on current drag speed with momentum multiplier
      dragState.current.velocity = deltaX * sensitivity * 1.5; // Added momentum multiplier

      dragState.current.lastX = currentX;
    }
  };

  const handlePointerUp = () => {
    dragState.current.isDragging = false;
    document.body.style.cursor = 'grab';
  };

  // Add global event listeners for both mouse and touch events
  useEffect(() => {
    // Mouse events
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    
    // Touch events - these are crucial for mobile devices
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);

    // Prevent default touch behavior on the canvas to avoid scrolling
    const preventTouch = (e) => {
      if (dragState.current.isDragging) {
        e.preventDefault();
      }
    };

    window.addEventListener('touchmove', preventTouch, { passive: false });

    // Set initial cursor style
    document.body.style.cursor = 'grab';

    return () => {
      // Clean up event listeners when component unmounts
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);
      window.removeEventListener('touchmove', preventTouch);
      document.body.style.cursor = 'auto'; // Reset cursor on unmount
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <a.mesh
      ref={meshRef}
      // Earth positioned behind the Hero content
      position={[0, 0, -2]}
      name="earth"
      onPointerDown={handlePointerDown}
      onTouchStart={handlePointerDown}
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
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 2 }}>
        <Navbar />
      </div>
      
      <div className="">
        <Canvas
          // Camera position adjusted to frame the centered Hero and top of Earth
          camera={{ position: [0, 0, 6], fov: 20 }}
          gl={{ antialias: true }}
          dpr={window.devicePixelRatio}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1, // Canvas stays below Navbar
            touchAction: "none" // Prevent default touch actions on the canvas
          }}
        >
          <ambientLight intensity={2.5} />
          <pointLight position={[10, 10, 20]} intensity={100} />

          {/* This a.group applies the initial scale and rotation animation to both components.
              Position adjusted to center the content properly. */}
          <a.group rotation-y={spring.rotation} scale={spring.scale} position={[0, -2.5, 0]}>
            {/* Hero component positioned in front (closer to camera) */}
            <group position={[0, 0, 2]}>
              <Hero />
            </group>
            
            {/* Earth mesh positioned behind the Hero content */}
            <Earth onLoaded={onLoaded} />
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
