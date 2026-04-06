"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float } from "@react-three/drei";
import { Suspense } from "react";

function FurnitureModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Sofa base */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[2.2, 0.5, 0.9]} />
          <meshStandardMaterial color="#2D2D2D" roughness={0.8} />
        </mesh>
        {/* Sofa back */}
        <mesh position={[0, 0.75, -0.35]} castShadow>
          <boxGeometry args={[2.2, 0.5, 0.2]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
        {/* Left arm */}
        <mesh position={[-1.0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.2, 0.3, 0.9]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
        {/* Right arm */}
        <mesh position={[1.0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.2, 0.3, 0.9]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
        </mesh>
        {/* Cushions */}
        <mesh position={[-0.5, 0.65, 0.05]} castShadow>
          <boxGeometry args={[0.9, 0.15, 0.7]} />
          <meshStandardMaterial color="#E8531E" roughness={0.6} />
        </mesh>
        <mesh position={[0.5, 0.65, 0.05]} castShadow>
          <boxGeometry args={[0.9, 0.15, 0.7]} />
          <meshStandardMaterial color="#E8531E" roughness={0.6} />
        </mesh>
        {/* Legs */}
        {[[-0.9, 0, 0.3], [0.9, 0, 0.3], [-0.9, 0, -0.3], [0.9, 0, -0.3]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.1]} />
            <meshStandardMaterial color="#E8531E" metalness={0.3} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export default function ProductViewer() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [3, 2, 3], fov: 40 }}
        className="rounded-[var(--border-radius-xl)]"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <FurnitureModel />
          <ContactShadows position={[0, -0.05, 0]} opacity={0.3} blur={2} />
          <Environment preset="apartment" />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
