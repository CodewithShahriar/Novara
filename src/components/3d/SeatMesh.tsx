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

  // Authentic European touring coach seat materials matching reference photo:
  // - Center insert: Elegant Forest Teal / Sage Green (or Cognac for VIP)
  // - Bolsters & Headrest: Dark Anthracite / Charcoal Leather
  // - Outer Shell & Pedestal: Matte Slate Grey composite & Die-cast alloy
  const materials = useMemo(() => {
    let centerColor = '#2F6758'; // Reference photo signature Forest Teal
    let bolsterColor = '#1F2429'; // Reference photo deep Charcoal Anthracite
    let shellColor = '#3D444E'; // Modern matte grey molded shell
    let legColor = '#4B535E'; // Die-cast alloy leg
    let armrestAccent = '#2F6758';

    if (isVip) {
      centerColor = '#8D5231'; // Italian saddle cognac leather
      bolsterColor = '#1F2429';
      armrestAccent = '#8D5231';
      shellColor = '#322822';
    }

    if (isBooked) {
      centerColor = '#3A424B'; // Muted dark slate
      bolsterColor = '#22272E';
      armrestAccent = '#3A424B';
      shellColor = '#2A3038';
    } else if (isSelected) {
      centerColor = isVip ? '#D97706' : '#2563EB'; // Vibrant glowing selection
      bolsterColor = isVip ? '#78350F' : '#1E3A8A';
      armrestAccent = '#F59E0B';
    }

    // Plush central leather/fabric cushion
    const centerMat = new THREE.MeshStandardMaterial({
      color: centerColor,
      roughness: 0.38,
      metalness: 0.06,
    });

    // Dark charcoal side bolsters & headrest frame
    const bolsterMat = new THREE.MeshStandardMaterial({
      color: bolsterColor,
      roughness: 0.42,
      metalness: 0.08,
    });

    // Matte composite outer shell (back & under-carriage)
    const shellMat = new THREE.MeshStandardMaterial({
      color: shellColor,
      roughness: 0.48,
      metalness: 0.15,
    });

    // Cast alloy pedestal leg & armrest frame
    const alloyMat = new THREE.MeshStandardMaterial({
      color: legColor,
      roughness: 0.35,
      metalness: 0.45,
    });

    // Armrest top accent pad
    const armAccentMat = new THREE.MeshStandardMaterial({
      color: armrestAccent,
      roughness: 0.40,
      metalness: 0.05,
    });

    // Seat number badge accent
    const badgeColor = isBooked
      ? '#475569'
      : isSelected
        ? '#F59E0B'
        : isVip
          ? '#D97706'
          : '#0284C7';

    return {
      centerMat,
      bolsterMat,
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
          1. DIE-CAST ARCHED PEDESTAL LEG WITH SIGNATURE OBLONG CUTOUT (Picture)
          ======================================================================
        */}
        <group position={[seat.col % 2 === 0 ? -0.10 : 0.10, -0.18, 0]}>
          {/* Base Floor Mounting Bracket */}
          <mesh position={[0, -0.165, 0]} receiveShadow>
            <boxGeometry args={[0.18, 0.02, 0.28]} />
            <primitive object={materials.alloyMat} attach="material" />
          </mesh>

          {/* Arched Upright Leg with Signature Oval/Pill Cutout Hole */}
          <group position={[0, -0.06, 0]}>
            {/* Front Leg Strut */}
            <mesh position={[0, 0, 0.08]} castShadow>
              <boxGeometry args={[0.04, 0.19, 0.05]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            {/* Rear Leg Strut */}
            <mesh position={[0, 0, -0.08]} castShadow>
              <boxGeometry args={[0.04, 0.19, 0.05]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            {/* Top Connecting Arch */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <boxGeometry args={[0.04, 0.04, 0.21]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            {/* Bottom Foot Bridge */}
            <mesh position={[0, -0.08, 0]}>
              <boxGeometry args={[0.04, 0.03, 0.21]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
          </group>

          {/* Seat Cantilever Carriage Subframe */}
          <RoundedBox args={[0.34, 0.03, 0.32]} radius={0.01} smoothness={3} position={[0, 0.06, 0]} castShadow>
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
          2. ERGONOMIC BUCKET SEAT CUSHION (Two-Tone Teal Center + Charcoal Lip)
          ======================================================================
        */}
        <group position={[0, 0.05, 0.02]}>
          {/* Main Central Forest Teal Cushion Insert */}
          <RoundedBox
            args={[0.28, 0.10, 0.44]}
            radius={0.025}
            smoothness={4}
            position={[0, 0, -0.02]}
            castShadow
            receiveShadow
          >
            <primitive object={materials.centerMat} attach="material" />
          </RoundedBox>

          {/* Left Contoured Charcoal Thigh Bolster */}
          <group position={[-0.17, 0.015, -0.02]}>
            <RoundedBox args={[0.08, 0.085, 0.44]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Right Contoured Charcoal Thigh Bolster */}
          <group position={[0.17, 0.015, -0.02]}>
            <RoundedBox args={[0.08, 0.085, 0.44]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Front Waterfall Contoured Lip (Charcoal band across front like photo) */}
          <group position={[0, -0.005, 0.185]}>
            <RoundedBox args={[0.42, 0.085, 0.07]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Molded Protective Under-Pan (Matte grey composite) */}
          <mesh position={[0, -0.045, 0]}>
            <boxGeometry args={[0.43, 0.03, 0.45]} />
            <primitive object={materials.shellMat} attach="material" />
          </mesh>
        </group>

        {/* 
          ======================================================================
          3. TALL SCULPTED BACKREST WITH WINGED HEADREST (Exact Photo Match!)
          ======================================================================
        */}
        <group position={[0, 0.44, -0.18]} rotation={[-0.10, 0, 0]}>

          {/* Smooth Ergonomic Composite Rear Protective Shell */}
          <RoundedBox
            args={[0.44, 0.72, 0.06]}
            radius={0.03}
            smoothness={3}
            position={[0, 0.02, -0.035]}
            castShadow
            receiveShadow
          >
            <primitive object={materials.shellMat} attach="material" />
          </RoundedBox>

          {/* Foldable Compact Tray Table on Seat Back (Facing passenger behind) */}
          <group position={[0, -0.12, -0.07]}>
            <mesh>
              <boxGeometry args={[0.30, 0.015, 0.02]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <planeGeometry args={[0.28, 0.14]} />
              <meshStandardMaterial color="#2B313A" roughness={0.6} />
            </mesh>
          </group>

          {/* Center Vertical Forest Teal Backrest Cushion */}
          <RoundedBox
            args={[0.26, 0.48, 0.08]}
            radius={0.025}
            smoothness={4}
            position={[0, -0.08, 0.02]}
            castShadow
            receiveShadow
          >
            <primitive object={materials.centerMat} attach="material" />
          </RoundedBox>

          {/* Left Torso Charcoal Bolster Wing */}
          <group position={[-0.165, -0.08, 0.035]}>
            <RoundedBox args={[0.075, 0.48, 0.065]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Right Torso Charcoal Bolster Wing */}
          <group position={[0.165, -0.08, 0.035]}>
            <RoundedBox args={[0.075, 0.48, 0.065]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* 
            ====================================================================
            4. INTEGRATED CONCAVED HEADREST WITH FLARING PRIVACY WINGS (Photo)
            ====================================================================
          */}
          <group position={[0, 0.26, 0.03]}>

            {/* Top Crown & Outer Headrest Frame (Charcoal) */}
            <RoundedBox
              args={[0.38, 0.22, 0.085]}
              radius={0.03}
              smoothness={4}
              position={[0, 0, 0]}
              castShadow
            >
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>

            {/* Left Cupped Privacy Wing (Angles forward to cradle head) */}
            <group position={[-0.17, 0, 0.025]} rotation={[0, -0.22, 0]}>
              <RoundedBox args={[0.06, 0.20, 0.07]} radius={0.02} smoothness={3} castShadow>
                <primitive object={materials.bolsterMat} attach="material" />
              </RoundedBox>
            </group>

            {/* Right Cupped Privacy Wing (Angles forward to cradle head) */}
            <group position={[0.17, 0, 0.025]} rotation={[0, 0.22, 0]}>
              <RoundedBox args={[0.06, 0.20, 0.07]} radius={0.02} smoothness={3} castShadow>
                <primitive object={materials.bolsterMat} attach="material" />
              </RoundedBox>
            </group>

            {/* Inset Center Headrest Cushion Pad (with debossed contour border) */}
            <RoundedBox
              args={[0.22, 0.16, 0.03]}
              radius={0.02}
              smoothness={3}
              position={[0, -0.005, 0.035]}
              castShadow
            >
              <meshStandardMaterial color="#1A1E22" roughness={0.35} metalness={0.08} />
            </RoundedBox>

            {/* Front Headrest Seat Number Badge */}
            <mesh position={[0, -0.005, 0.052]}>
              <planeGeometry args={[0.14, 0.05]} />
              <meshBasicMaterial map={badgeTexture} transparent />
            </mesh>

            {/* Rear Headrest Badge (Visible from behind) */}
            <mesh position={[0, -0.005, -0.052]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.14, 0.05]} />
              <meshBasicMaterial map={badgeTexture} transparent />
            </mesh>

          </group>

          {/* Recline Mechanism Pivot Hinge Boss at base */}
          <group position={[seat.col % 2 === 0 ? -0.22 : 0.22, -0.32, -0.01]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
            <primitive object={materials.alloyMat} attach="material" />
          </group>
        </group>

        {/* 
          ======================================================================
          5. MODERN L-SHAPED CURVED ARMREST WITH TEAL INLAY PAD (Picture Match!)
          ======================================================================
        */}
        {/* Aisle-Side Armrest */}
        {(seat.col === 1 || seat.col === 2) && (
          <group position={[seat.col === 1 ? -0.24 : 0.24, 0.20, 0.02]}>
            {/* Circular Hinge Pivot Joint */}
            <mesh position={[0, -0.08, -0.12]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.032, 0.032, 0.03, 16]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>

            {/* Vertical Arm Upright */}
            <mesh position={[0, -0.01, -0.10]} rotation={[0.20, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.14, 0.04]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>

            {/* Horizontal Forward Armrest Bar */}
            <RoundedBox
              args={[0.042, 0.035, 0.28]}
              radius={0.012}
              smoothness={3}
              position={[0, 0.06, 0.02]}
              castShadow
            >
              <primitive object={materials.alloyMat} attach="material" />
            </RoundedBox>

            {/* Signature Teal / Accent Soft Cushion Strip on Top */}
            <RoundedBox
              args={[0.032, 0.012, 0.24]}
              radius={0.005}
              smoothness={2}
              position={[0, 0.082, 0.02]}
              castShadow
            >
              <primitive object={materials.armAccentMat} attach="material" />
            </RoundedBox>
          </group>
        )}

        {/* Window-Side Slim Armrest / Wall Rest */}
        {(seat.col === 0 || seat.col === 3) && (
          <group position={[seat.col === 0 ? 0.23 : -0.23, 0.20, 0.02]}>
            <mesh position={[0, -0.08, -0.12]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.028, 0.028, 0.025, 16]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.01, -0.10]} rotation={[0.20, 0, 0]} castShadow>
              <boxGeometry args={[0.025, 0.14, 0.035]} />
              <primitive object={materials.alloyMat} attach="material" />
            </mesh>
            <RoundedBox
              args={[0.036, 0.032, 0.26]}
              radius={0.01}
              smoothness={3}
              position={[0, 0.06, 0.02]}
              castShadow
            >
              <primitive object={materials.alloyMat} attach="material" />
            </RoundedBox>
            <RoundedBox
              args={[0.026, 0.01, 0.22]}
              radius={0.004}
              smoothness={2}
              position={[0, 0.08, 0.02]}
              castShadow
            >
              <primitive object={materials.armAccentMat} attach="material" />
            </RoundedBox>
          </group>
        )}

        {/* 6. Retractable Brushed Aluminum Footrest Bar */}
        <group position={[0, -0.05, -0.26]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.32, 12]} />
            <primitive object={materials.alloyMat} attach="material" />
          </mesh>
          <mesh position={[-0.14, -0.04, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.08, 8]} />
            <primitive object={materials.alloyMat} attach="material" />
          </mesh>
          <mesh position={[0.14, -0.04, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.08, 8]} />
            <primitive object={materials.alloyMat} attach="material" />
          </mesh>
        </group>

      </group>
    </group>
  );
}
