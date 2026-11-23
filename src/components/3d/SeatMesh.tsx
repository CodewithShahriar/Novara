'use client';

import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { SeatData, SeatStatus } from '@/lib/types';
import { getSeatBadgeTexture } from './textures';

interface SeatMeshProps {
  seat: SeatData;
  status: SeatStatus;
  onClick: (seat: SeatData) => void;
  onHover?: (seat: SeatData | null) => void;
}

export default function SeatMesh({ seat, status, onClick, onHover }: SeatMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isVip = seat.tier === 'Executive VIP';
  const isBooked = status === 'BOOKED';
  const isSelected = status === 'SELECTED';

  // Exact 1:1 Color Architecture from Reference Photo (media_1795408249326_3b5228e9.jpg):
  // - Center Insert: Forest Teal / Sage Green (#2F6758)
  // - Bolsters & Integrated Headrest Wings: Deep Anthracite / Charcoal (#1C2025)
  // - Outer Shell & Subframe: Sleek Satin Grey Composite (#3D444E)
  // - Pedestal Leg & Armrest: Cast Metal Alloy (#4A525E)
  const materials = useMemo(() => {
    let centerColor = '#2F6758'; // Signature Forest Teal from photo
    let bolsterColor = '#1C2025'; // Deep Charcoal Anthracite from photo
    let shellColor = '#3D444E'; // Modern satin grey molded shell
    let alloyColor = '#4A525E'; // Die-cast alloy
    let armAccentColor = '#2F6758';

    if (isVip) {
      centerColor = '#8D5231'; // Italian saddle cognac leather for VIP suites
      bolsterColor = '#1C2025';
      armAccentColor = '#8D5231';
      shellColor = '#302620';
    }

    if (isBooked) {
      centerColor = '#38404A'; // Muted dark slate
      bolsterColor = '#20242A';
      armAccentColor = '#38404A';
      shellColor = '#282E36';
    } else if (isSelected) {
      centerColor = isVip ? '#D97706' : '#2563EB'; // Vibrant glowing selection
      bolsterColor = isVip ? '#78350F' : '#1E3A8A';
      armAccentColor = '#F59E0B';
    }

    // Plush central upholstered leather/fabric insert
    const centerMat = new THREE.MeshStandardMaterial({
      color: centerColor,
      roughness: 0.38,
      metalness: 0.06,
    });

    // Dark charcoal contoured side bolsters & headrest frame
    const bolsterMat = new THREE.MeshStandardMaterial({
      color: bolsterColor,
      roughness: 0.42,
      metalness: 0.08,
    });

    // Inset center headrest pad
    const headrestPadMat = new THREE.MeshStandardMaterial({
      color: '#15181C',
      roughness: 0.34,
      metalness: 0.08,
    });

    // Satin grey molded composite shell (back & under-carriage)
    const shellMat = new THREE.MeshStandardMaterial({
      color: shellColor,
      roughness: 0.45,
      metalness: 0.16,
    });

    // Cast alloy pedestal leg & armrest frame
    const alloyMat = new THREE.MeshStandardMaterial({
      color: alloyColor,
      roughness: 0.32,
      metalness: 0.50,
    });

    // Armrest top accent runner strip
    const armAccentMat = new THREE.MeshStandardMaterial({
      color: armAccentColor,
      roughness: 0.40,
      metalness: 0.05,
    });

    // Elegant discreet seat number badge accent
    const badgeColor = isBooked
      ? '#333D48'
      : isSelected
      ? '#F59E0B'
      : isVip
      ? '#D97706'
      : '#1E242C';

    return {
      centerMat,
      bolsterMat,
      headrestPadMat,
      shellMat,
      alloyMat,
      armAccentMat,
      badgeColor,
    };
  }, [isVip, isBooked, isSelected]);

  const badgeTexture = useMemo(() => {
    return getSeatBadgeTexture(seat.seatNumber, materials.badgeColor);
  }, [seat.seatNumber, materials.badgeColor]);

  // Subtle smooth elevation when hovered or selected
  useFrame(() => {
    if (!groupRef.current) return;

    if (status === 'SELECTED') {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.38, 0.12);
    } else if (isHovered && status !== 'BOOKED') {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.365, 0.15);
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.35, 0.15);
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (status !== 'BOOKED') {
      document.body.style.cursor = 'pointer';
      setIsHovered(true);
      onHover?.(seat);
    } else {
      document.body.style.cursor = 'not-allowed';
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    setIsHovered(false);
    onHover?.(null);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (status !== 'BOOKED') {
      onClick(seat);
    }
  };

  return (
    <group
      ref={groupRef}
      position={seat.position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 
        ========================================================================
        WRAPPER ROTATION: ROTATE 180° SO SEAT FACES FORWARD (TOWARDS -Z / FRONT)
        ========================================================================
      */}
      <group rotation={[0, Math.PI, 0]}>
        
        {/* 
          ======================================================================
          1. DIE-CAST ARCHED PEDESTAL LEG WITH SIGNATURE OVAL CUTOUT (Photo Match)
          ======================================================================
        */}
        <group position={[seat.col % 2 === 0 ? -0.10 : 0.10, -0.18, 0]}>
          {/* Floor Mounting Base Foot with Bolt Plates */}
          <mesh position={[0, -0.165, 0]} receiveShadow>
            <boxGeometry args={[0.16, 0.02, 0.26]} />
            <primitive object={materials.alloyMat} attach="material" />
          </mesh>

          {/* Arched Sculpted Leg with Center Pill/Oval Cutout Hole */}
          <group position={[0, -0.06, 0]}>
            {/* Front Leg Strut */}
            <mesh position={[0, 0, 0.075]} castShadow>
              <boxGeometry args={[0.035, 0.19, 0.045]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            {/* Rear Leg Strut */}
            <mesh position={[0, 0, -0.075]} castShadow>
              <boxGeometry args={[0.035, 0.19, 0.045]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            {/* Top Connecting Arch */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <boxGeometry args={[0.035, 0.035, 0.195]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            {/* Bottom Base Bridge */}
            <mesh position={[0, -0.08, 0]}>
              <boxGeometry args={[0.035, 0.025, 0.195]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
          </group>

          {/* Cantilever Seat Support Plate */}
          <RoundedBox args={[0.34, 0.025, 0.30]} radius={0.008} smoothness={3} position={[0, 0.06, 0]} castShadow>
            <primitive object={materials.alloyMat} attach="material" />
          </RoundedBox>

          {/* Selected Highlight Accent Ring on Floor */}
          {isSelected && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.16, 0]}>
              <ringGeometry args={[0.22, 0.30, 32]} />
              <meshStandardMaterial
                color="#F59E0B"
                emissive="#F59E0B"
                emissiveIntensity={0.8}
                transparent
                opacity={0.85}
              />
            </mesh>
          )}
        </group>

        {/* 
          ======================================================================
          2. ERGONOMIC BUCKET SEAT CUSHION (Teal Center + Charcoal Bolsters & Lip)
          ======================================================================
        */}
        <group position={[0, 0.05, 0.02]}>
          {/* Main Central Forest Teal Cushion Insert (Recessed slightly behind front lip) */}
          <RoundedBox
            args={[0.24, 0.09, 0.35]}
            radius={0.025}
            smoothness={4}
            position={[0, 0, -0.04]}
            castShadow
            receiveShadow
          >
            <primitive object={materials.centerMat} attach="material" />
          </RoundedBox>

          {/* Left Contoured Charcoal Thigh Bolster */}
          <group position={[-0.165, 0.012, -0.02]}>
            <RoundedBox args={[0.085, 0.085, 0.44]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Right Contoured Charcoal Thigh Bolster */}
          <group position={[0.165, 0.012, -0.02]}>
            <RoundedBox args={[0.085, 0.085, 0.44]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Front Waterfall Contoured Charcoal Lip (Wraps cleanly across the front like photo) */}
          <group position={[0, -0.002, 0.175]}>
            <RoundedBox args={[0.415, 0.082, 0.085]} radius={0.022} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Molded Protective Under-Pan (Sleek matte grey composite) */}
          <mesh position={[0, -0.042, 0]}>
            <boxGeometry args={[0.42, 0.028, 0.44]} />
            <primitive object={materials.shellMat} attach="material" />
          </mesh>
        </group>

        {/* 
          ======================================================================
          3. SCULPTED BACKREST & INTEGRATED FLARING PRIVACY HEADREST (Exact Photo)
          ======================================================================
        */}
        <group position={[0, 0.42, -0.18]} rotation={[-0.12, 0, 0]}>
          
          {/* Continuous Aerodynamic Satin Grey Rear Protective Shell */}
          <group position={[0, 0.08, -0.038]}>
            {/* Lower Backrest Shell */}
            <RoundedBox
              args={[0.43, 0.54, 0.05]}
              radius={0.025}
              smoothness={3}
              position={[0, -0.08, 0]}
              castShadow
              receiveShadow
            >
              <primitive object={materials.shellMat} attach="material" />
            </RoundedBox>

            {/* Upper Tapered Headrest Shell with Rounded Crown */}
            <RoundedBox
              args={[0.36, 0.28, 0.05]}
              radius={0.035}
              smoothness={4}
              position={[0, 0.20, 0]}
              castShadow
              receiveShadow
            >
              <primitive object={materials.shellMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Compact Foldable Tray Table on Back Shell */}
          <group position={[0, -0.06, -0.068]}>
            <mesh>
              <boxGeometry args={[0.28, 0.012, 0.018]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.07, 0]}>
              <planeGeometry args={[0.26, 0.13]} />
              <meshStandardMaterial color="#222830" roughness={0.65} />
            </mesh>
          </group>

          {/* Center Vertical Forest Teal Backrest Cushion */}
          <RoundedBox
            args={[0.23, 0.50, 0.075]}
            radius={0.025}
            smoothness={4}
            position={[0, -0.06, 0.02]}
            castShadow
            receiveShadow
          >
            <primitive object={materials.centerMat} attach="material" />
          </RoundedBox>

          {/* Left Torso Charcoal Bolster Wing (Angled slightly inward to hug passenger) */}
          <group position={[-0.155, -0.06, 0.03]} rotation={[0, 0.12, 0]}>
            <RoundedBox args={[0.075, 0.50, 0.065]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Right Torso Charcoal Bolster Wing (Angled slightly inward to hug passenger) */}
          <group position={[0.155, -0.06, 0.03]} rotation={[0, -0.12, 0]}>
            <RoundedBox args={[0.075, 0.50, 0.065]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* 
            ====================================================================
            4. THE SCULPTED HEADREST: ARCHED CROWN & FORWARD-CUPPED PRIVACY WINGS
            (Eliminates the bulky square box completely, matching the reference!)
            ====================================================================
          */}
          <group position={[0, 0.28, 0.025]}>
            
            {/* Arched Headrest Base & Crown (Charcoal Anthracite) */}
            <RoundedBox
              args={[0.34, 0.22, 0.075]}
              radius={0.038}
              smoothness={4}
              position={[0, 0, 0]}
              castShadow
            >
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>

            {/* Left Cupped Flaring Privacy Wing (Sweeps forward to cradle head) */}
            <group position={[-0.15, -0.01, 0.03]} rotation={[0, -0.28, -0.04]}>
              <RoundedBox args={[0.055, 0.20, 0.075]} radius={0.022} smoothness={3} castShadow>
                <primitive object={materials.bolsterMat} attach="material" />
              </RoundedBox>
            </group>

            {/* Right Cupped Flaring Privacy Wing (Sweeps forward to cradle head) */}
            <group position={[0.15, -0.01, 0.03]} rotation={[0, 0.28, 0.04]}>
              <RoundedBox args={[0.055, 0.20, 0.075]} radius={0.022} smoothness={3} castShadow>
                <primitive object={materials.bolsterMat} attach="material" />
              </RoundedBox>
            </group>

            {/* Inset Ergonomic Center Headrest Cushion Pad (with arched top contour) */}
            <RoundedBox
              args={[0.20, 0.16, 0.025]}
              radius={0.025}
              smoothness={3}
              position={[0, -0.01, 0.042]}
              castShadow
            >
              <primitive object={materials.headrestPadMat} attach="material" />
            </RoundedBox>

            {/* Discreet, Elegant Seat Number Badge (Subtle metallic plaque, no giant neon box!) */}
            <mesh position={[0, -0.01, 0.056]}>
              <planeGeometry args={[0.10, 0.036]} />
              <meshBasicMaterial map={badgeTexture} transparent />
            </mesh>

            {/* Rear Headrest Badge (Discreet) */}
            <mesh position={[0, -0.01, -0.046]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.10, 0.036]} />
              <meshBasicMaterial map={badgeTexture} transparent />
            </mesh>

          </group>

          {/* Recline Pivot Joint on Side Base */}
          <group position={[seat.col % 2 === 0 ? -0.21 : 0.21, -0.28, -0.01]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.028, 0.028, 0.035, 16]} />
            <primitive object={materials.alloyMat} attach="material" />
          </group>

          {/* Recline Adjustment Lever (Accent Green matching photo) */}
          <mesh position={[seat.col % 2 === 0 ? -0.22 : 0.22, -0.32, 0.04]}>
            <boxGeometry args={[0.018, 0.012, 0.08]} />
            <primitive object={materials.armAccentMat} attach="material" />
          </mesh>
        </group>

        {/* 
          ======================================================================
          5. SLENDER L-SHAPED CURVED ARMREST WITH TEAL INLAY (Photo Match!)
          ======================================================================
        */}
        {/* Aisle-Side Armrest */}
        {(seat.col === 1 || seat.col === 2) && (
          <group position={[seat.col === 1 ? -0.235 : 0.235, 0.18, 0.02]}>
            {/* Circular Hinge Pivot Joint at Rear */}
            <mesh position={[0, -0.07, -0.11]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.028, 0.028, 0.028, 16]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>

            {/* Upright Arm Strut (Angles forward from pivot) */}
            <mesh position={[0, -0.01, -0.09]} rotation={[0.22, 0, 0]} castShadow>
              <boxGeometry args={[0.025, 0.13, 0.032]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>

            {/* Horizontal Forward Armrest Bar */}
            <RoundedBox
              args={[0.038, 0.028, 0.26]}
              radius={0.01}
              smoothness={3}
              position={[0, 0.055, 0.02]}
              castShadow
            >
              <primitive object={materials.alloyMat} attach="material" />
            </RoundedBox>

            {/* Signature Forest Teal Soft Cushion Inlay Strip on Top */}
            <RoundedBox
              args={[0.026, 0.01, 0.22]}
              radius={0.004}
              smoothness={2}
              position={[0, 0.072, 0.02]}
              castShadow
            >
              <primitive object={materials.armAccentMat} attach="material" />
            </RoundedBox>
          </group>
        )}

        {/* Window-Side Armrest / Wall Rest */}
        {(seat.col === 0 || seat.col === 3) && (
          <group position={[seat.col === 0 ? 0.225 : -0.225, 0.18, 0.02]}>
            <mesh position={[0, -0.07, -0.11]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.024, 0.024, 0.022, 16]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.01, -0.09]} rotation={[0.22, 0, 0]} castShadow>
              <boxGeometry args={[0.022, 0.13, 0.028]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            <RoundedBox
              args={[0.032, 0.026, 0.24]}
              radius={0.008}
              smoothness={3}
              position={[0, 0.055, 0.02]}
              castShadow
            >
              <primitive object={materials.alloyMat} attach="material" />
            </RoundedBox>
            <RoundedBox
              args={[0.022, 0.008, 0.20]}
              radius={0.003}
              smoothness={2}
              position={[0, 0.07, 0.02]}
              castShadow
            >
              <primitive object={materials.armAccentMat} attach="material" />
            </RoundedBox>
          </group>
        )}

        {/* 6. Retractable Brushed Aluminum Footrest Bar */}
        <group position={[0, -0.05, -0.26]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 0.30, 12]} />
            <primitive object={materials.alloyMat} attach="material" />
          </mesh>
          <mesh position={[-0.13, -0.04, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.08, 8]} />
            <primitive object={materials.alloyMat} attach="material" />
          </mesh>
          <mesh position={[0.13, -0.04, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.08, 8]} />
            <primitive object={materials.alloyMat} attach="material" />
          </mesh>
        </group>

      </group>
    </group>
  );
}
