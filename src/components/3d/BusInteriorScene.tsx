'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import gsap from 'gsap';
import SeatMesh from './SeatMesh';
import { SeatData, SeatStatus } from '@/lib/types';
import {
  getWoodFloorTexture,
  getAisleCarpetTexture,
  getDashboardClusterTexture,
  getCurtainTexture,
  getRadialShadowTexture,
} from './textures';

interface BusInteriorSceneProps {
  seats: SeatData[];
  selectedSeats: string[];
  activeFocusedSeat: SeatData | null;
  onSeatClick: (seat: SeatData) => void;
  onHoverSeat?: (seat: SeatData | null) => void;
  isZoomed: boolean;
}

// Elevated 3/4 cutaway camera position: full luxury coach visible from front to rear (9 rows)
const OVERVIEW_CAMERA_POS = { x: 6.6, y: 9.2, z: 11.2 };
const OVERVIEW_TARGET = { x: 0, y: 0.45, z: 1.1 };

// Camera controller: ALWAYS places camera in the central aisle looking toward the seat
// This guarantees the camera is NEVER outside the bus wall, eliminating dark wall obstruction!
function CameraController({
  activeFocusedSeat,
  isZoomed,
}: {
  activeFocusedSeat: SeatData | null;
  isZoomed: boolean;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);

    if (isZoomed && activeFocusedSeat) {
      const [sx, sy, sz] = activeFocusedSeat.position;

      // Position camera safely in the center aisle (X around 0) looking outwards at the seat
      // For left seats (A & B, sx < 0): stand in aisle at x = +0.08 looking at the seat
      // For right seats (C & D, sx > 0): stand in aisle at x = -0.08 looking at the seat
      const targetCameraPos = {
        x: sx < 0 ? 0.08 : -0.08,
        y: sy + 0.42,
        z: sz - 0.72, // In front of the seat looking slightly backward at the passenger suite
      };

      gsap.to(camera.position, {
        x: targetCameraPos.x,
        y: targetCameraPos.y,
        z: targetCameraPos.z,
        duration: 1.15,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
      });

      gsap.to(controls.target, {
        x: sx,
        y: sy + 0.22,
        z: sz,
        duration: 1.15,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
      });
    } else {
      // Smoothly zoom back out to full luxury coach overview (100% visible)
      gsap.to(camera.position, {
        x: OVERVIEW_CAMERA_POS.x,
        y: OVERVIEW_CAMERA_POS.y,
        z: OVERVIEW_CAMERA_POS.z,
        duration: 1.1,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
      });

      gsap.to(controls.target, {
        x: OVERVIEW_TARGET.x,
        y: OVERVIEW_TARGET.y,
        z: OVERVIEW_TARGET.z,
        duration: 1.1,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
      });
    }
  }, [isZoomed, activeFocusedSeat, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={0.8}
      maxDistance={28}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={0.10}
    />
  );
}

// Fully Integrated, Photorealistic Luxury Touring Coach Model (Marcopolo / Volvo 9900 Inspired)
// Styled to match the modern White Luxury Touring Coach reference (Image 2)
function LuxuryTouringCoachModel({ isZoomed }: { isZoomed: boolean }) {
  const carpetFloorTexture = useMemo(() => getWoodFloorTexture(), []);
  const aisleRunnerTexture = useMemo(() => getAisleCarpetTexture(), []);
  const dashTexture = useMemo(() => getDashboardClusterTexture(), []);
  const curtainTexture = useMemo(() => getCurtainTexture(), []);
  const shadowTexture = useMemo(() => getRadialShadowTexture(), []);

  // Automotive materials with high visual fidelity and metallic luster
  const materials = useMemo(() => {
    // Crisp Arctic Pearl White Metallic Coach Body Paint (Image 2 Reference)
    const coachBodyPearl = new THREE.MeshStandardMaterial({
      color: '#F8FAFC', // Pristine Pearl White
      roughness: 0.20,
      metalness: 0.16,
    });

    // Dark Piano Gloss Black Trim & Front Mask
    const coachDarkMask = new THREE.MeshStandardMaterial({
      color: '#0B0F19',
      roughness: 0.18,
      metalness: 0.45,
    });

    // Polished Mirror Chrome (Rims, Badges, and Trim)
    const chromeTrim = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.08,
      metalness: 0.96,
    });

    // High-transparency Solar Tinted Panoramic Window Glass (Visible from both sides!)
    const panoramicGlass = new THREE.MeshPhysicalMaterial({
      color: '#0A1120',
      transparent: true,
      opacity: isZoomed ? 0.15 : 0.28,
      roughness: 0.04,
      metalness: 0.20,
      transmission: 0.85,
      ior: 1.50,
      side: THREE.DoubleSide,
    });

    // Windshield Glass with Realistic Tint & Reflection
    const windshieldGlass = new THREE.MeshPhysicalMaterial({
      color: '#0F172A',
      transparent: true,
      opacity: 0.45,
      roughness: 0.06,
      metalness: 0.25,
      transmission: 0.72,
      ior: 1.52,
      side: THREE.DoubleSide,
    });

    // Draped Royal Blue Window Curtains (Picture 4)
    const curtainMat = new THREE.MeshStandardMaterial({
      map: curtainTexture,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // Multi-Projector LED Headlights with Cool Ice Glow (Image 2)
    const headlightLens = new THREE.MeshStandardMaterial({
      color: '#E0F2FE',
      emissive: '#38BDF8',
      emissiveIntensity: 0.85,
      roughness: 0.08,
      metalness: 0.2,
    });

    // LED Daytime Running Light (DRL) Eyebrow Strip
    const drlStrip = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      emissive: '#E0F2FE',
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });

    // Ruby Red LED Taillights
    const taillightLens = new THREE.MeshStandardMaterial({
      color: '#DC2626',
      emissive: '#EF4444',
      emissiveIntensity: 0.85,
      roughness: 0.15,
    });

    // Circular Fog Lamps
    const fogLampLens = new THREE.MeshStandardMaterial({
      color: '#FEF08A',
      emissive: '#F59E0B',
      emissiveIntensity: 0.80,
      roughness: 0.15,
    });

    // High-visibility Safety Yellow Rails
    const safetyYellowRail = new THREE.MeshStandardMaterial({
      color: '#FACC15',
      roughness: 0.25,
      metalness: 0.3,
    });

    // Premium Tire Rubber
    const tireRubber = new THREE.MeshStandardMaterial({
      color: '#18181B',
      roughness: 0.85,
      metalness: 0.1,
    });

    // Alcoa-style Mirror Polished Alloy Rims (Image 2)
    const alloyRim = new THREE.MeshStandardMaterial({
      color: '#F8FAFC',
      roughness: 0.10,
      metalness: 0.95,
    });

    // Interior Molded Charcoal
    const interiorCharcoal = new THREE.MeshStandardMaterial({
      color: '#1E2530',
      roughness: 0.5,
    });

    return {
      coachBodyPearl,
      coachDarkMask,
      chromeTrim,
      panoramicGlass,
      windshieldGlass,
      curtainMat,
      headlightLens,
      drlStrip,
      taillightLens,
      fogLampLens,
      safetyYellowRail,
      tireRubber,
      alloyRim,
      interiorCharcoal,
    };
  }, [curtainTexture, isZoomed]);

  return (
    <group position={[0, 0, 0]}>
      {/* ============================================================ */}
      {/* 0. SOFT GROUND CONTACT SHADOW                                */}
      {/* ============================================================ */}
      <mesh position={[0, -0.16, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.2, 16.5]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={0.65} depthWrite={false} />
      </mesh>

      {/* ============================================================ */}
      {/* 1. CABIN FLOORING & AISLE (Spans across all 9 rows)           */}
      {/* ============================================================ */}
      {/* 
        Unified Z range: from Z = -3.65 (in front of Row 1) to Z = +6.20 (rear bulkhead)
        Total interior seat deck length: 9.85m, centered at Z = 1.275
      */}
      {/* Left Raised Platform with Charcoal Transit Carpet */}
      <mesh position={[-0.73, 0.04, 1.275]} receiveShadow>
        <boxGeometry args={[0.98, 0.12, 9.85]} />
        <meshStandardMaterial map={carpetFloorTexture} roughness={0.7} metalness={0.08} />
      </mesh>

      {/* Right Raised Platform with Charcoal Transit Carpet */}
      <mesh position={[0.73, 0.04, 1.275]} receiveShadow>
        <boxGeometry args={[0.98, 0.12, 9.85]} />
        <meshStandardMaterial map={carpetFloorTexture} roughness={0.7} metalness={0.08} />
      </mesh>

      {/* Center Sunken Aisle with Diamond-Plate Aluminum Tread */}
      <mesh position={[0, 0.015, 0.80]} receiveShadow>
        <boxGeometry args={[0.48, 0.07, 10.80]} />
        <meshStandardMaterial map={aisleRunnerTexture} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Chassis Base Plate */}
      <mesh position={[0, -0.06, 0.10]} receiveShadow>
        <boxGeometry args={[2.50, 0.12, 12.60]} />
        <primitive object={materials.interiorCharcoal} attach="material" />
      </mesh>

      {/* ============================================================ */}
      {/* 2. PASSENGER ROW 1 BULKHEAD & SAFETY PARTITIONS              */}
      {/* Eliminates cockpit collision by placing partitions at Z=-3.75 */}
      {/* ============================================================ */}
      {/* Left Modesty Partition in Front of Row 1 (Seats 1A & 1B) */}
      <group position={[-0.65, 0.55, -3.75]}>
        <RoundedBox args={[1.05, 0.75, 0.04]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.interiorCharcoal} attach="material" />
        </RoundedBox>
        {/* Top Grab Rail */}
        <mesh position={[0, 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 1.05, 16]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>
        {/* Safety & Amenity Info Plaque */}
        <mesh position={[0, 0.08, 0.025]}>
          <planeGeometry args={[0.32, 0.16]} />
          <meshStandardMaterial color="#0B132B" emissive="#0284C7" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Right Modesty Partition in Front of Row 1 (Seats 1C & 1D) */}
      <group position={[0.65, 0.55, -3.75]}>
        <RoundedBox args={[1.05, 0.75, 0.04]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.interiorCharcoal} attach="material" />
        </RoundedBox>
        {/* Top Grab Rail */}
        <mesh position={[0, 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 1.05, 16]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>
        {/* Safety & Amenity Info Plaque */}
        <mesh position={[0, 0.08, 0.025]}>
          <planeGeometry args={[0.32, 0.16]} />
          <meshStandardMaterial color="#0B132B" emissive="#0284C7" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 3. EXTERIOR BODY PANELS & LUGGAGE COMPARTMENTS               */}
      {/* ============================================================ */}
      {/* Left Exterior Side Body Panel */}
      <group position={[-1.25, 0, 0.175]}>
        {/* Main Arctic Pearl White Lower Skirt */}
        <mesh position={[0, 0.40, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.80, 12.35]} />
          <primitive object={materials.coachBodyPearl} attach="material" />
        </mesh>
        {/* Piano Gloss Black Beltline Graphic Trim */}
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.12, 12.35]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        {/* Flush Luggage Bay Hatches along lower skirt */}
        {[-2.6, -1.0, 0.6, 2.2, 3.8].map((z, idx) => (
          <group key={idx} position={[-0.045, 0.36, z]}>
            <mesh>
              <boxGeometry args={[0.005, 0.48, 1.40]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            {/* Chrome Flush Latch Handle */}
            <mesh position={[-0.005, -0.16, 0]}>
              <boxGeometry args={[0.008, 0.04, 0.18]} />
              <primitive object={materials.chromeTrim} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Right Exterior Side Body Panel */}
      <group position={[1.25, 0, 0.175]}>
        {/* Main Arctic Pearl White Lower Skirt */}
        <mesh position={[0, 0.40, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.80, 12.35]} />
          <primitive object={materials.coachBodyPearl} attach="material" />
        </mesh>
        {/* Piano Gloss Black Beltline Graphic Trim */}
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.12, 12.35]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        {/* Front Passenger Boarding Door Outline on Right Side (Image 2) */}
        <group position={[0.045, 0.95, -4.8]}>
          <mesh>
            <boxGeometry args={[0.01, 1.65, 1.05]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
          {/* Passenger Door Tinted Glass Window */}
          <mesh position={[0.008, 0.28, 0]} raycast={() => null}>
            <planeGeometry args={[0.85, 0.95]} />
            <primitive object={materials.panoramicGlass} attach="material" />
          </mesh>
          {/* Vertical Chrome Door Handle */}
          <mesh position={[0.015, -0.25, 0.38]}>
            <boxGeometry args={[0.02, 0.22, 0.03]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
        {/* Flush Luggage Bay Hatches */}
        {[-2.6, -1.0, 0.6, 2.2, 3.8].map((z, idx) => (
          <group key={idx} position={[0.045, 0.36, z]}>
            <mesh>
              <boxGeometry args={[0.005, 0.48, 1.40]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            <mesh position={[0.005, -0.16, 0]}>
              <boxGeometry args={[0.008, 0.04, 0.18]} />
              <primitive object={materials.chromeTrim} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 4. PANORAMIC SIDE WINDOWS & DRAPED CURTAINS                  */}
      {/* ============================================================ */}
      {/* Left Panoramic Window Glass */}
      <mesh position={[-1.23, 1.50, 0.60]} raycast={() => null}>
        <boxGeometry args={[0.02, 1.15, 11.4]} />
        <primitive object={materials.panoramicGlass} attach="material" />
      </mesh>

      {/* Right Panoramic Window Glass */}
      <mesh position={[1.23, 1.50, 0.60]} raycast={() => null}>
        <boxGeometry args={[0.02, 1.15, 11.4]} />
        <primitive object={materials.panoramicGlass} attach="material" />
      </mesh>

      {/* Structural Window Pillars on Both Sides with Royal Blue Curtains (Picture 4) */}
      {[-3.8, -2.0, -0.2, 1.6, 3.4, 5.0].map((z, idx) => (
        <React.Fragment key={idx}>
          {/* Left Pillar & Curtain */}
          <group position={[-1.23, 1.50, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 1.16, 0.14]} />
              <primitive object={materials.coachDarkMask} attach="material" />
            </mesh>
            <mesh position={[0.035, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.98, 0.14]} />
              <primitive object={materials.curtainMat} attach="material" />
            </mesh>
          </group>

          {/* Right Pillar & Curtain */}
          <group position={[1.23, 1.50, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 1.16, 0.14]} />
              <primitive object={materials.coachDarkMask} attach="material" />
            </mesh>
            <mesh position={[-0.035, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.98, 0.14]} />
              <primitive object={materials.curtainMat} attach="material" />
            </mesh>
          </group>
        </React.Fragment>
      ))}

      {/* 
        Sleek Aerodynamic Roof Side Rails (Cutaway Silhouette Framing, Image 2)
        Spans EXACTLY from Front Crown (Z = -4.95) to Rear Spoiler (Z = +6.35).
        Length = 11.30m, Centered at Z = +0.70.
        ZERO OVERHANGING POLES! Seamlessly connects front to back!
      */}
      <group position={[-1.24, 2.15, 0.70]}>
        <RoundedBox args={[0.08, 0.14, 11.30]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodyPearl} attach="material" />
        </RoundedBox>
      </group>
      <group position={[1.24, 2.15, 0.70]}>
        <RoundedBox args={[0.08, 0.14, 11.30]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodyPearl} attach="material" />
        </RoundedBox>
      </group>

      {/* ============================================================ */}
      {/* 5. REALISTIC 3-AXLE WHEELS (Image 2 Luxury Tri-Axle Coach)   */}
      {/* ============================================================ */}
      {[
        [-1.26, -0.05, -4.30], // Front Left Steering
        [1.26, -0.05, -4.30],  // Front Right Steering
        [-1.26, -0.05, 3.80],  // Rear Left Drive
        [1.26, -0.05, 3.80],   // Rear Right Drive
        [-1.26, -0.05, 5.00],  // Rear Left Tag
        [1.26, -0.05, 5.00],   // Rear Right Tag
      ].map(([wx, wy, wz], wi) => (
        <group key={wi} position={[wx, wy, wz]}>
          {/* Wheel Arch Fender Liner */}
          <mesh position={[wx > 0 ? -0.04 : 0.04, 0.15, 0]}>
            <boxGeometry args={[0.05, 0.65, 1.05]} />
            <primitive object={materials.interiorCharcoal} attach="material" />
          </mesh>
          {/* Rubber Tire with Deep Tread Profile */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.44, 0.44, 0.22, 24]} />
            <primitive object={materials.tireRubber} attach="material" />
          </mesh>
          {/* Alcoa High-Sheen Forged Chrome Rim (Image 2) */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.27, 0.27, 0.24, 20]} />
            <primitive object={materials.alloyRim} attach="material" />
          </mesh>
          {/* Chrome Central Hubcap with Lug Bolts */}
          <mesh position={[wx > 0 ? 0.13 : -0.13, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.11, 20]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ============================================================ */}
      {/* 6. AUTHENTIC FRONT COACH FASCIA & COCKPIT (Image 2 Coach)    */}
      {/* ============================================================ */}
      {/* 
        Single, cohesive aerodynamic luxury coach front nose!
        Flushed seamlessly with side skirts at Z = -5.85 (Zero disjointed shelves!)
      */}
      <group position={[0, 0, 0]}>
        {/* Sculpted Curved Aerodynamic Front Bumper (Image 2) */}
        <RoundedBox
          args={[2.50, 0.65, 0.35]}
          radius={0.14}
          smoothness={4}
          position={[0, 0.35, -5.75]}
          castShadow
          receiveShadow
        >
          <primitive object={materials.coachBodyPearl} attach="material" />
        </RoundedBox>

        {/* Lower Front Air Dam / Chin Splitter */}
        <RoundedBox
          args={[2.40, 0.16, 0.20]}
          radius={0.04}
          smoothness={3}
          position={[0, 0.10, -5.82]}
          castShadow
        >
          <primitive object={materials.coachDarkMask} attach="material" />
        </RoundedBox>

        {/* Dual Lower Circular Fog Lamps in Chrome Bezels (Image 2) */}
        <mesh position={[-0.92, 0.18, -5.88]} rotation={[0, 0.15, 0]}>
          <circleGeometry args={[0.055, 16]} />
          <primitive object={materials.fogLampLens} attach="material" />
        </mesh>
        <mesh position={[0.92, 0.18, -5.88]} rotation={[0, -0.15, 0]}>
          <circleGeometry args={[0.055, 16]} />
          <primitive object={materials.fogLampLens} attach="material" />
        </mesh>

        {/* Upper Front Nose Fascia Panel (Connects bumper seamlessly to windshield!) */}
        <RoundedBox
          args={[2.48, 0.44, 0.28]}
          radius={0.10}
          smoothness={4}
          position={[0, 0.85, -5.68]}
          castShadow
          receiveShadow
        >
          <primitive object={materials.coachBodyPearl} attach="material" />
        </RoundedBox>

        {/* Piano Gloss Black Front Grille Band (Image 2) */}
        <group position={[0, 0.82, -5.82]}>
          <RoundedBox args={[1.85, 0.28, 0.04]} radius={0.04} smoothness={3}>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {/* Horizontal Chrome Wing Emblem & Novara Central Insignia */}
          <mesh position={[0, 0.015, 0.025]}>
            <boxGeometry args={[1.35, 0.025, 0.015]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
          <mesh position={[0, 0.015, 0.03]}>
            <circleGeometry args={[0.075, 24]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>

        {/* Swept-Back Aggressive Projector Headlamps (Image 2) */}
        {/* Left Headlamp Cluster */}
        <group position={[-0.98, 0.78, -5.76]} rotation={[0, 0.22, 0]}>
          <RoundedBox args={[0.38, 0.22, 0.05]} radius={0.04} smoothness={3}>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {/* 3 Circular Projector LED Eyes */}
          {[-0.11, 0, 0.11].map((lx, li) => (
            <mesh key={li} position={[lx, -0.02, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
              <primitive object={materials.headlightLens} attach="material" />
            </mesh>
          ))}
          {/* Top LED DRL Eyebrow */}
          <mesh position={[0, 0.08, 0.03]}>
            <boxGeometry args={[0.36, 0.02, 0.01]} />
            <primitive object={materials.drlStrip} attach="material" />
          </mesh>
        </group>

        {/* Right Headlamp Cluster */}
        <group position={[0.98, 0.78, -5.76]} rotation={[0, -0.22, 0]}>
          <RoundedBox args={[0.38, 0.22, 0.05]} radius={0.04} smoothness={3}>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {/* 3 Circular Projector LED Eyes */}
          {[-0.11, 0, 0.11].map((lx, li) => (
            <mesh key={li} position={[lx, -0.02, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
              <primitive object={materials.headlightLens} attach="material" />
            </mesh>
          ))}
          {/* Top LED DRL Eyebrow */}
          <mesh position={[0, 0.08, 0.03]}>
            <boxGeometry args={[0.36, 0.02, 0.01]} />
            <primitive object={materials.drlStrip} attach="material" />
          </mesh>
        </group>

        {/* Front Left and Right A-Pillars sweeping down from roof to cowl */}
        <mesh position={[-1.23, 1.60, -5.28]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.25, 0.12]} />
          <primitive object={materials.coachBodyPearl} attach="material" />
        </mesh>
        <mesh position={[1.23, 1.60, -5.28]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.25, 0.12]} />
          <primitive object={materials.coachBodyPearl} attach="material" />
        </mesh>

        {/* 
          Large Sweeping Aerodynamic Panoramic Windshield (Image 2)
          Raked back at ~28° angle with realistic tint & dual wipers!
        */}
        <mesh position={[0, 1.60, -5.28]} rotation={[-0.35, 0, 0]} raycast={() => null}>
          <planeGeometry args={[2.42, 1.28]} />
          <primitive object={materials.windshieldGlass} attach="material" />
        </mesh>

        {/* Windshield Dual Articulated Pantograph Wipers */}
        <mesh position={[-0.42, 1.08, -5.50]} rotation={[0, 0, 0.20]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        <mesh position={[0.42, 1.08, -5.50]} rotation={[0, 0, 0.20]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>

        {/* Aerodynamic Front Roof Crown & Destination Matrix Sign (Image 2) */}
        <group position={[0, 2.16, -4.95]}>
          <RoundedBox args={[2.50, 0.22, 0.42]} radius={0.06} smoothness={3} castShadow>
            <primitive object={materials.coachBodyPearl} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.02, -0.21]} rotation={[0.12, 0, 0]}>
            <planeGeometry args={[1.85, 0.12]} />
            <meshStandardMaterial color="#0B132B" emissive="#0284C7" emissiveIntensity={0.55} />
          </mesh>
          {/* Amber Aerodynamic Clearance Marker Lights */}
          <mesh position={[-1.12, 0.06, -0.20]}>
            <boxGeometry args={[0.06, 0.02, 0.02]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[1.12, 0.06, -0.20]}>
            <boxGeometry args={[0.06, 0.02, 0.02]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Streamlined Pearl White "Elephant-Ear" Wing Mirrors (Image 2) */}
        <group position={[-1.34, 1.95, -5.02]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.50, 12]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
          <RoundedBox args={[0.12, 0.44, 0.16]} radius={0.03} smoothness={3} position={[-0.06, 0.08, -0.06]} castShadow>
            <primitive object={materials.coachBodyPearl} attach="material" />
          </RoundedBox>
          <mesh position={[-0.01, 0.08, -0.06]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.14, 0.40]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
        <group position={[1.34, 1.95, -5.02]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.50, 12]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
          <RoundedBox args={[0.12, 0.44, 0.16]} radius={0.03} smoothness={3} position={[0.06, 0.08, -0.06]} castShadow>
            <primitive object={materials.coachBodyPearl} attach="material" />
          </RoundedBox>
          <mesh position={[0.01, 0.08, -0.06]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.14, 0.40]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>

        {/* 
          DRIVER COCKPIT CONSOLE & SAFETY CABIN (Picture 5 Reference)
          Cleanly nested in the front deck at Z = -5.10!
          ZERO COLLISION with passenger Row 1 at Z = -3.20!
        */}
        <group position={[-0.50, 0.65, -5.20]}>
          <RoundedBox args={[1.20, 0.45, 0.65]} radius={0.04} smoothness={3} castShadow>
            <primitive object={materials.interiorCharcoal} attach="material" />
          </RoundedBox>

          {/* Warm Walnut Instrument Cluster & Telemetry (Picture 5) */}
          <mesh position={[0, 0.23, 0.02]} rotation={[-0.35, 0, 0]}>
            <planeGeometry args={[0.78, 0.26]} />
            <meshStandardMaterial map={dashTexture} roughness={0.25} metalness={0.1} />
          </mesh>

          {/* 3-Spoke Bus Steering Wheel & Column (Picture 5) */}
          <group position={[0, 0.30, 0.20]} rotation={[0.55, 0, 0]}>
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.04, 0.28, 16]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            <mesh castShadow>
              <torusGeometry args={[0.19, 0.018, 16, 32]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, 0.03, 20]} />
              <primitive object={materials.chromeTrim} attach="material" />
            </mesh>
          </group>

          {/* Floor-mounted Gear Shift Lever (Picture 5) */}
          <group position={[0.30, -0.10, 0.28]}>
            <mesh>
              <cylinderGeometry args={[0.01, 0.012, 0.22, 12]} />
              <primitive object={materials.chromeTrim} attach="material" />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.025, 16, 16]} />
              <meshStandardMaterial color="#854D27" roughness={0.3} metalness={0.2} />
            </mesh>
          </group>

          {/* Safety Yellow Grab Rails */}
          <mesh position={[0.58, 0.35, 0.20]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 1.05, 16]} />
            <primitive object={materials.safetyYellowRail} attach="material" />
          </mesh>

          {/* Forward-Facing Driver Suspension Seat at Z = -4.65 */}
          <group position={[0, -0.14, 0.55]}>
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.11, 0.20, 16]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            <RoundedBox args={[0.50, 0.11, 0.48]} radius={0.03} smoothness={3} position={[0, 0.20, -0.04]} castShadow>
              <primitive object={materials.interiorCharcoal} attach="material" />
            </RoundedBox>
            <RoundedBox args={[0.46, 0.65, 0.09]} radius={0.03} smoothness={3} position={[0, 0.58, 0.18]} rotation={[0.12, 0, 0]} castShadow>
              <primitive object={materials.interiorCharcoal} attach="material" />
            </RoundedBox>
            <RoundedBox args={[0.26, 0.15, 0.07]} radius={0.03} smoothness={3} position={[0, 0.98, 0.16]} castShadow>
              <primitive object={materials.interiorCharcoal} attach="material" />
            </RoundedBox>
          </group>

          {/* Driver Privacy Wall & Glass Partition behind Driver Seat at Z = -4.15 */}
          <group position={[0, 0.35, 1.05]}>
            <RoundedBox args={[1.15, 0.85, 0.04]} radius={0.02} smoothness={3} position={[0, 0.10, 0]}>
              <primitive object={materials.interiorCharcoal} attach="material" />
            </RoundedBox>
            <mesh position={[0, 0.70, 0]}>
              <boxGeometry args={[1.12, 0.45, 0.02]} />
              <primitive object={materials.panoramicGlass} attach="material" />
            </mesh>
          </group>
        </group>

        {/* Boarding Steps at Front Right Entrance with Safety Yellow Nosing */}
        <group position={[0.78, -0.08, -4.75]}>
          <mesh receiveShadow>
            <boxGeometry args={[0.70, 0.10, 0.45]} />
            <primitive object={materials.interiorCharcoal} attach="material" />
          </mesh>
          <mesh position={[0, 0.052, 0.21]}>
            <boxGeometry args={[0.70, 0.008, 0.02]} />
            <primitive object={materials.safetyYellowRail} attach="material" />
          </mesh>
          {/* Passenger Boarding Stainless Steel Handrail */}
          <mesh position={[-0.30, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 1.10, 16]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 7. COHESIVE, FLUSH REAR BULKHEAD & TAIL (Z = +6.35)           */}
      {/* ============================================================ */}
      {/* 
        Caps the rear of the coach COMPLETELY flush with side skirts and roof rails!
        ZERO overhanging rails! ZERO open flatbed gap!
      */}
      <group position={[0, 0.95, 6.35]}>
        {/* Full-width Rear Curved Body Cap in Arctic Pearl White */}
        <RoundedBox args={[2.50, 2.12, 0.32]} radius={0.14} smoothness={4} castShadow receiveShadow>
          <primitive object={materials.coachBodyPearl} attach="material" />
        </RoundedBox>

        {/* Lower Rear Bumper with Sports Diffuser & Twin Chrome Exhausts */}
        <group position={[0, -0.85, 0.16]}>
          <RoundedBox args={[2.52, 0.38, 0.22]} radius={0.08} smoothness={3} castShadow>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          <mesh position={[-0.82, -0.06, 0.12]}>
            <boxGeometry args={[0.25, 0.06, 0.03]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
          <mesh position={[0.82, -0.06, 0.12]}>
            <boxGeometry args={[0.25, 0.06, 0.03]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
          {/* Illuminated License Plate */}
          <mesh position={[0, 0.02, 0.12]}>
            <boxGeometry args={[0.55, 0.15, 0.02]} />
            <meshStandardMaterial color="#0B132B" />
          </mesh>
        </group>

        {/* Flush Vertical LED Tail Light Assemblies on Left & Right Corners */}
        <group position={[-1.12, 0.12, 0.16]}>
          <RoundedBox args={[0.13, 1.05, 0.04]} radius={0.02} smoothness={3}>
            <primitive object={materials.taillightLens} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.28, 0.022]}>
            <boxGeometry args={[0.10, 0.14, 0.02]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.7} />
          </mesh>
        </group>
        <group position={[1.12, 0.12, 0.16]}>
          <RoundedBox args={[0.13, 1.05, 0.04]} radius={0.02} smoothness={3}>
            <primitive object={materials.taillightLens} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.28, 0.022]}>
            <boxGeometry args={[0.10, 0.14, 0.02]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.7} />
          </mesh>
        </group>

        {/* Large Rear Privacy Tinted Window */}
        <mesh position={[0, 0.38, 0.18]} raycast={() => null}>
          <planeGeometry args={[1.85, 0.85]} />
          <primitive object={materials.panoramicGlass} attach="material" />
        </mesh>

        {/* Aerodynamic Integrated Rear Roof Spoiler & Third Brake Light */}
        <group position={[0, 1.15, 0.02]}>
          <RoundedBox args={[2.52, 0.14, 0.38]} radius={0.03} smoothness={3} castShadow>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          <mesh position={[0, 0.02, 0.20]}>
            <boxGeometry args={[0.9, 0.03, 0.02]} />
            <primitive object={materials.taillightLens} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function BusInteriorScene({
  seats,
  selectedSeats,
  activeFocusedSeat,
  onSeatClick,
  onHoverSeat,
  isZoomed,
}: BusInteriorSceneProps) {
  return (
    <div className="w-full h-full relative select-none bg-radial from-[#151D2A] via-[#0B0F17] to-[#070A0F]">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[OVERVIEW_CAMERA_POS.x, OVERVIEW_CAMERA_POS.y, OVERVIEW_CAMERA_POS.z]}
          fov={40}
          near={0.1}
          far={100}
        />
        <CameraController activeFocusedSeat={activeFocusedSeat} isZoomed={isZoomed} />

        {/* LUXURY AUTOMOTIVE STUDIO ILLUMINATION */}
        <hemisphereLight args={['#FFFDF7', '#0F172A', 1.0]} />

        {/* Primary Studio Spotlight */}
        <directionalLight
          position={[10, 18, 12]}
          intensity={1.9}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={45}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={14}
          shadow-camera-bottom={-14}
          shadow-bias={0.0001}
          color="#FFFDF7"
        />

        {/* Ambient Fill Light */}
        <directionalLight position={[-10, 12, -8]} intensity={0.85} color="#E2E8F0" />

        {/* Warm Golden Rim Light for Coach Silhouette */}
        <directionalLight position={[0, 6, -14]} intensity={0.85} color="#FEF08A" />

        {/* Fully Integrated Luxury Touring Coach Model */}
        <LuxuryTouringCoachModel isZoomed={isZoomed} />

        {/* 
          All 36 Forward-Facing Passenger Suites (9 Rows x 4 Seats: 100% Unobstructed & Interactive) 
        */}
        {seats.map((seat) => {
          let status: SeatStatus = 'AVAILABLE';
          if (seat.isBooked) {
            status = 'BOOKED';
          } else if (selectedSeats.includes(seat.seatNumber)) {
            status = 'SELECTED';
          }

          return (
            <SeatMesh
              key={seat.id}
              seat={seat}
              status={status}
              onClick={onSeatClick}
              onHover={onHoverSeat}
            />
          );
        })}
      </Canvas>
    </div>
  );
}
