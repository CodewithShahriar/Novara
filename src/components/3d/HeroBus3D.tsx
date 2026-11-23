'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, RoundedBox } from '@react-three/drei';

function LuxuryTouringCoachModel() {
  const busGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (busGroup.current) {
      busGroup.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
    }
  });

  return (
    <group ref={busGroup} position={[0, -0.3, 0]} rotation={[0.08, -0.65, 0]}>
      {/* 1. Main Coach Body Shell (Gleaming Pearl Metallic White) */}
      <RoundedBox args={[2.5, 1.6, 8.4]} radius={0.14} smoothness={4} position={[0, 0.8, 0]} castShadow>
        <meshStandardMaterial color="#F1F5F9" roughness={0.15} metalness={0.35} />
      </RoundedBox>

      {/* 2. Royal Navy Lower Body Accent Skirt */}
      <RoundedBox args={[2.52, 0.55, 8.42]} radius={0.08} smoothness={3} position={[0, 0.32, 0]} castShadow>
        <meshStandardMaterial color="#0F2557" roughness={0.2} metalness={0.7} />
      </RoundedBox>

      {/* 3. Chrome Beltline Ribbon */}
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[2.55, 0.03, 8.44]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.1} metalness={0.95} />
      </mesh>

      {/* 4. Aerodynamic Front Windshield (Double Curvature) */}
      <mesh position={[0, 1.05, -4.22]} rotation={[0.34, 0, 0]}>
        <planeGeometry args={[2.42, 1.1]} />
        <meshPhysicalMaterial
          color="#0F172A"
          roughness={0.05}
          metalness={0.2}
          transmission={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Destination Route Sign Box above Windshield */}
      <group position={[0, 1.55, -4.18]}>
        <RoundedBox args={[2.3, 0.22, 0.15]} radius={0.04} smoothness={2}>
          <meshStandardMaterial color="#0F2557" />
        </RoundedBox>
        <mesh position={[0, 0, -0.08]} rotation={[0.15, 0, 0]}>
          <planeGeometry args={[1.8, 0.14]} />
          <meshStandardMaterial color="#0B132B" emissive="#0284C7" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* 5. Continuous Side Panoramic Window Bays on BOTH sides */}
      <mesh position={[-1.27, 1.05, -0.2]}>
        <boxGeometry args={[0.02, 0.82, 6.8]} />
        <meshPhysicalMaterial color="#0B132B" roughness={0.05} opacity={0.85} transparent />
      </mesh>
      <mesh position={[1.27, 1.05, -0.2]}>
        <boxGeometry args={[0.02, 0.82, 6.8]} />
        <meshPhysicalMaterial color="#0B132B" roughness={0.05} opacity={0.85} transparent />
      </mesh>

      {/* 6. Front Headlight Clusters & Chrome Grille */}
      <mesh position={[-0.9, 0.32, -4.24]}>
        <boxGeometry args={[0.5, 0.16, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#BAE6FD" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
      <mesh position={[0.9, 0.32, -4.24]}>
        <boxGeometry args={[0.5, 0.16, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#BAE6FD" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
      {/* Front Chrome Grille */}
      <mesh position={[0, 0.28, -4.25]}>
        <boxGeometry args={[1.0, 0.2, 0.04]} />
        <meshStandardMaterial color="#1E2530" roughness={0.5} />
      </mesh>
      {/* Novara Star Badge */}
      <mesh position={[0, 0.45, -4.24]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.1} metalness={0.95} />
      </mesh>

      {/* Signature Aerodynamic Elephant-Ear Wing Mirrors on BOTH sides */}
      <group position={[-1.38, 1.35, -4.1]}>
        <mesh rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 12]} />
          <meshStandardMaterial color="#1E2530" />
        </mesh>
        <RoundedBox args={[0.08, 0.32, 0.14]} radius={0.02} smoothness={2} position={[-0.08, 0.12, -0.05]}>
          <meshStandardMaterial color="#F1F5F9" />
        </RoundedBox>
      </group>
      <group position={[1.38, 1.35, -4.1]}>
        <mesh rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 12]} />
          <meshStandardMaterial color="#1E2530" />
        </mesh>
        <RoundedBox args={[0.08, 0.32, 0.14]} radius={0.02} smoothness={2} position={[0.08, 0.12, -0.05]}>
          <meshStandardMaterial color="#F1F5F9" />
        </RoundedBox>
      </group>

      {/* 7. Realistic Coach Wheels with Tires & Alloy Rims (3-Axle Setup) */}
      {[
        [-1.27, 0.05, -2.6],
        [1.27, 0.05, -2.6],
        [-1.27, 0.05, 2.2],
        [1.27, 0.05, 2.2],
        [-1.27, 0.05, 3.3],
        [1.27, 0.05, 3.3],
      ].map(([wx, wy, wz], i) => (
        <group key={i} position={[wx, wy, wz]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.44, 0.44, 0.28, 24]} />
            <meshStandardMaterial color="#181D24" roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.27, 0.27, 0.3, 16]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.25} metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 8. Rear Tail Section with Vertical LED Taillights & Spoiler */}
      <group position={[0, 0.8, 4.22]}>
        {/* Rear Window */}
        <mesh position={[0, 0.25, 0.01]}>
          <planeGeometry args={[2.3, 0.7]} />
          <meshPhysicalMaterial color="#0B132B" opacity={0.85} transparent />
        </mesh>
        {/* Taillights */}
        <mesh position={[-1.0, -0.2, 0.02]}>
          <boxGeometry args={[0.16, 0.6, 0.02]} />
          <meshStandardMaterial color="#DC2626" emissive="#991B1B" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[1.0, -0.2, 0.02]}>
          <boxGeometry args={[0.16, 0.6, 0.02]} />
          <meshStandardMaterial color="#DC2626" emissive="#991B1B" emissiveIntensity={0.6} />
        </mesh>
        {/* Rear Roof Spoiler */}
        <group position={[0, 0.75, 0]}>
          <RoundedBox args={[2.45, 0.1, 0.25]} radius={0.03} smoothness={2}>
            <meshStandardMaterial color="#0F2557" />
          </RoundedBox>
          <mesh position={[0, 0, 0.13]}>
            <boxGeometry args={[0.8, 0.03, 0.02]} />
            <meshStandardMaterial color="#DC2626" emissive="#DC2626" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function HeroBus3D() {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <PerspectiveCamera makeDefault position={[5.2, 2.6, 8.5]} fov={36} />
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.8}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.05}
          minPolarAngle={Math.PI / 4}
        />

        {/* Studio Lighting */}
        <hemisphereLight args={['#FFFFFF', '#0F172A', 1.0]} />
        <directionalLight position={[8, 12, 10]} intensity={2.0} color="#FFFDF7" />
        <directionalLight position={[-8, 6, -6]} intensity={0.9} color="#BAE6FD" />
        <directionalLight position={[0, -4, 0]} intensity={0.3} color="#334155" />

        <LuxuryTouringCoachModel />
      </Canvas>
    </div>
  );
}
