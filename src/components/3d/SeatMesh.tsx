'use client';

import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { SeatData, SeatStatus } from '@/lib/types';
import { getLeatherTexture, getSeatBadgeTexture } from './textures';

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

  const upholsteryTexture = useMemo(() => {
    return getLeatherTexture(isVip);
  }, [isVip]);

  // Luxury coach materials matching Reference Pictures 3 & 4
  const materials = useMemo(() => {
    let mainColor = '#1E3A5F'; // Deep luxury touring navy
    let bolsterColor = '#152A45'; // Contoured bolster navy
    let shellColor = '#2B3545'; // Dark molded ergonomic shell

    if (isVip) {
      mainColor = '#8D5231'; // Italian saddle cognac
      bolsterColor = '#6E3C1E';
      shellColor = '#261C16';
    }

    if (isBooked) {
      mainColor = '#334155'; // Muted dark slate
      bolsterColor = '#1E293B';
      shellColor = '#18202F';
    } else if (isSelected) {
      mainColor = isVip ? '#D97706' : '#2563EB'; // Vibrant glowing selection
      bolsterColor = isVip ? '#B45309' : '#1D4ED8';
      shellColor = '#0F172A';
    }

    // Patterned Coach Seat Upholstery (Picture 3 & 4)
    const upholsteryMat = new THREE.MeshStandardMaterial({
      color: mainColor,
      map: upholsteryTexture,
      roughness: 0.42,
      metalness: 0.08,
    });

    const bolsterMat = new THREE.MeshStandardMaterial({
      color: bolsterColor,
      roughness: 0.45,
      metalness: 0.05,
    });

    // Crisp White Leather Headrest Antimacassar / Pillow (Hallmark of Luxury Coach in Picture 3 & 4)
    const whiteHeadrestMat = new THREE.MeshStandardMaterial({
      color: isSelected ? '#FEF08A' : isBooked ? '#94A3B8' : '#F8FAFC',
      roughness: 0.28,
      metalness: 0.08,
    });

    // Dark molded protective shell
    const shellMat = new THREE.MeshStandardMaterial({
      color: shellColor,
      roughness: 0.5,
      metalness: 0.2,
    });

    // Polished satin metal trim & brackets
    const metalMat = new THREE.MeshStandardMaterial({
      color: '#CBD5E1',
      roughness: 0.22,
      metalness: 0.85,
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
      upholsteryMat,
      bolsterMat,
      whiteHeadrestMat,
      shellMat,
      metalMat,
      badgeColor,
    };
  }, [isVip, isBooked, isSelected, upholsteryTexture]);

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
        {/* 1. SEAT PEDESTAL BASE & FLOOR MOUNTING STANCHION (Picture 3) */}
        <group position={[0, -0.18, 0]}>
          <mesh position={[0, -0.165, 0]} receiveShadow>
            <boxGeometry args={[0.26, 0.03, 0.36]} />
            <primitive object={materials.shellMat} attach="material" />
          </mesh>

          {/* Sturdy Steel Pedestal Leg (Molded U-bracket like Picture 3) */}
          <group position={[0, -0.05, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 0.22, 0.22]} />
              <primitive object={materials.shellMat} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.04, 0.14, 0.12]} />
              <meshBasicMaterial color="#0F172A" />
            </mesh>
          </group>

          {/* Seat Cantilever Carriage Plate */}
          <RoundedBox args={[0.32, 0.04, 0.32]} radius={0.012} smoothness={3} position={[0, 0.07, 0]} castShadow>
            <primitive object={materials.shellMat} attach="material" />
          </RoundedBox>

          {/* Selected Highlight Accent Ring */}
          {isSelected && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.16, 0]}>
              <ringGeometry args={[0.24, 0.32, 32]} />
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

        {/* 2. PLUSH LUXURY PATTERNED SEAT CUSHION (Picture 3 & 4) */}
        <group position={[0, 0.05, 0.02]}>
          {/* Main Contoured Navy Upholstery Cushion */}
          <RoundedBox
            args={[0.44, 0.12, 0.46]}
            radius={0.03}
            smoothness={4}
            castShadow
            receiveShadow
          >
            <primitive object={materials.upholsteryMat} attach="material" />
          </RoundedBox>

          {/* Left Contoured Thigh Bolster */}
          <group position={[-0.20, 0.035, 0]}>
            <RoundedBox args={[0.07, 0.07, 0.45]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Right Contoured Thigh Bolster */}
          <group position={[0.20, 0.035, 0]}>
            <RoundedBox args={[0.07, 0.07, 0.45]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Lower Seat Perimeter Molded Shell (Picture 3) */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.45, 0.04, 0.47]} />
            <primitive object={materials.shellMat} attach="material" />
          </mesh>
        </group>

        {/* 3. PROPER ERGONOMIC CURVED BACKREST */}
        <group position={[0, 0.4, -0.18]} rotation={[-0.12, 0, 0]}>
          {/* Molded Composite Protective Back Shell (Picture 3 & 4) */}
          <RoundedBox
            args={[0.46, 0.62, 0.07]}
            radius={0.025}
            smoothness={3}
            position={[0, 0, -0.04]}
            castShadow
            receiveShadow
          >
            <primitive object={materials.shellMat} attach="material" />
          </RoundedBox>

          {/* Personal Entertainment 4K Screen on Seat Back (Facing passenger behind) */}
          <mesh position={[0, 0.10, -0.078]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.28, 0.16]} />
            <meshStandardMaterial color="#0B132B" emissive="#0284C7" emissiveIntensity={0.25} roughness={0.1} />
          </mesh>

          {/* Foldable Tray Table on Back Shell */}
          <mesh position={[0, -0.15, -0.078]}>
            <boxGeometry args={[0.32, 0.015, 0.02]} />
            <primitive object={materials.metalMat} attach="material" />
          </mesh>

          {/* Main Backrest Navy Patterned Cushion */}
          <RoundedBox
            args={[0.42, 0.44, 0.09]}
            radius={0.025}
            smoothness={4}
            position={[0, -0.06, 0.025]}
            castShadow
            receiveShadow
          >
            <primitive object={materials.upholsteryMat} attach="material" />
          </RoundedBox>

          {/* Lower Lumbar Ergonomic Pillow with Horizontal Contours (Image 4) */}
          <RoundedBox
            args={[0.34, 0.16, 0.05]}
            radius={0.02}
            smoothness={3}
            position={[0, -0.18, 0.07]}
            castShadow
          >
            <primitive object={materials.upholsteryMat} attach="material" />
          </RoundedBox>

          {/* Horizontal Lumbar Cushion Segment Contours (Image 4 Wireframe) */}
          {[-0.14, -0.06, 0.02].map((hy, hi) => (
            <mesh key={hi} position={[0, hy, 0.072]}>
              <boxGeometry args={[0.30, 0.012, 0.005]} />
              <primitive object={materials.bolsterMat} attach="material" />
            </mesh>
          ))}

          {/* Left Torso Support Bolster */}
          <group position={[-0.19, -0.04, 0.045]}>
            <RoundedBox args={[0.075, 0.42, 0.065]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Right Torso Support Bolster */}
          <group position={[0.19, -0.04, 0.045]}>
            <RoundedBox args={[0.075, 0.42, 0.065]} radius={0.02} smoothness={3} castShadow>
              <primitive object={materials.bolsterMat} attach="material" />
            </RoundedBox>
          </group>

          {/* Top Shoulder Aisle Grab Handle (Image 4 Wireframe) */}
          {(seat.col === 1 || seat.col === 2) && (
            <group position={[seat.col === 1 ? -0.22 : 0.22, 0.32, -0.02]} rotation={[0, 0, seat.col === 1 ? -0.2 : 0.2]}>
              <mesh castShadow>
                <torusGeometry args={[0.042, 0.008, 12, 24, Math.PI * 1.1]} />
                <primitive object={materials.metalMat} attach="material" />
              </mesh>
            </group>
          )}

          {/* 
            4. CRISP WHITE LEATHER HEADREST PILLOW / ANTIMACASSAR COVER
            (Exact match to Reference Pictures 3 & 4!)
          */}
          <group position={[0, 0.28, 0.02]}>
            {/* White Antimacassar Headrest Slip (Spans top of seat) */}
            <RoundedBox
              args={[0.44, 0.20, 0.095]}
              radius={0.03}
              smoothness={4}
              position={[0, 0, 0]}
              castShadow
            >
              <primitive object={materials.whiteHeadrestMat} attach="material" />
            </RoundedBox>

            {/* Front Headrest Badge with Seat Number (Instant 2D Texture) */}
            <mesh position={[0, -0.01, 0.052]}>
              <planeGeometry args={[0.16, 0.056]} />
              <meshBasicMaterial map={badgeTexture} transparent />
            </mesh>

            {/* Rear Headrest Badge (Visible from behind the seat!) */}
            <mesh position={[0, -0.01, -0.063]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.16, 0.056]} />
              <meshBasicMaterial map={badgeTexture} transparent />
            </mesh>
          </group>
        </group>

        {/* 5. MODERN ERGONOMIC MOLDED ARMRESTS WITH CHROME HINGES (Picture 3 & 4) */}
        {/* Left Armrest */}
        <group position={[-0.25, 0.22, 0.02]}>
          <RoundedBox
            args={[0.052, 0.048, 0.32]}
            radius={0.016}
            smoothness={3}
            position={[0, 0, 0]}
            castShadow
          >
            <primitive object={materials.shellMat} attach="material" />
          </RoundedBox>
          <group position={[0, -0.09, -0.10]}>
            <mesh castShadow>
              <boxGeometry args={[0.025, 0.16, 0.04]} />
              <primitive object={materials.metalMat} attach="material" />
            </mesh>
            <mesh position={[0, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.035, 16]} />
              <primitive object={materials.metalMat} attach="material" />
            </mesh>
          </group>
        </group>

        {/* Right Armrest */}
        <group position={[0.25, 0.22, 0.02]}>
          <RoundedBox
            args={[0.052, 0.048, 0.32]}
            radius={0.016}
            smoothness={3}
            position={[0, 0, 0]}
            castShadow
          >
            <primitive object={materials.shellMat} attach="material" />
          </RoundedBox>
          <group position={[0, -0.09, -0.10]}>
            <mesh castShadow>
              <boxGeometry args={[0.025, 0.16, 0.04]} />
              <primitive object={materials.metalMat} attach="material" />
            </mesh>
            <mesh position={[0, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.035, 16]} />
              <primitive object={materials.metalMat} attach="material" />
            </mesh>
          </group>
        </group>

        {/* 6. Retractable Brushed Aluminum Footrest Bar */}
        <group position={[0, -0.05, -0.26]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.34, 12]} />
            <primitive object={materials.metalMat} attach="material" />
          </mesh>
          <mesh position={[-0.15, -0.04, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.08, 8]} />
            <primitive object={materials.metalMat} attach="material" />
          </mesh>
          <mesh position={[0.15, -0.04, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.08, 8]} />
            <primitive object={materials.metalMat} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
