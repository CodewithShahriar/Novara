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
  getTarmacTexture,
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

// ============================================================================
// OUTDOOR SUNLIT PASSENGER TERMINAL BAY ENVIRONMENT
// Replaces dark void background with a realistic, attractive transit terminal scenario
// ============================================================================
function ModernTerminalBayEnvironment() {
  const tarmacTexture = useMemo(() => getTarmacTexture(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. High-Detail Transit Asphalt Tarmac Ground Plane */}
      <mesh position={[0, -0.22, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[55, 55]} />
        <meshStandardMaterial map={tarmacTexture} roughness={0.85} metalness={0.12} />
      </mesh>

      {/* 2. Raised Passenger Boarding Sidewalk / Platform (Right Side) */}
      <group position={[4.5, -0.10, 0.5]}>
        <RoundedBox args={[4.5, 0.24, 28]} radius={0.06} smoothness={3} receiveShadow>
          <meshStandardMaterial color="#E2E8F0" roughness={0.65} metalness={0.10} />
        </RoundedBox>

        {/* Tactile Yellow Safety Edge Tile Strip along the curb */}
        <mesh position={[-2.15, 0.125, 0]}>
          <boxGeometry args={[0.22, 0.02, 28]} />
          <meshStandardMaterial color="#FACC15" roughness={0.4} />
        </mesh>

        {/* Departure Terminal Signpost */}
        <group position={[-1.2, 0, -4.5]}>
          {/* Stainless Steel Support Column */}
          <mesh position={[0, 1.6, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 3.2, 16]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Illuminated Departure Board */}
          <group position={[0, 3.0, 0]}>
            <RoundedBox args={[1.35, 0.65, 0.08]} radius={0.04} smoothness={3} castShadow>
              <meshStandardMaterial color="#0B132B" roughness={0.2} />
            </RoundedBox>
            <mesh position={[0, 0.12, 0.045]}>
              <planeGeometry args={[1.20, 0.22]} />
              <meshStandardMaterial color="#0284C7" emissive="#0284C7" emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[0, -0.14, 0.045]}>
              <planeGeometry args={[1.20, 0.18]} />
              <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.4} />
            </mesh>
          </group>
        </group>

        {/* Modern Architectural Terminal Canopy Support Columns in Background */}
        {[-7, 0, 7].map((pz, pi) => (
          <group key={pi} position={[1.8, 0, pz]}>
            <mesh position={[0, 2.5, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 5.0, 16]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Top Canopy Bracket */}
            <mesh position={[-0.6, 4.8, 0]} rotation={[0, 0, -0.3]}>
              <boxGeometry args={[1.8, 0.08, 0.12]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// ============================================================================
// METALLIC SILVER LUXURY TOURING COACH MODEL
// Exact 1:1 match to orthographic reference diagram (Image 1 / Freepik Reference)
// ============================================================================
function SilverLuxuryTouringCoachModel({ isZoomed }: { isZoomed: boolean }) {
  const carpetFloorTexture = useMemo(() => getWoodFloorTexture(), []);
  const aisleRunnerTexture = useMemo(() => getAisleCarpetTexture(), []);
  const dashTexture = useMemo(() => getDashboardClusterTexture(), []);
  const curtainTexture = useMemo(() => getCurtainTexture(), []);
  const shadowTexture = useMemo(() => getRadialShadowTexture(), []);

  // Automotive materials with high visual fidelity and metallic luster
  const materials = useMemo(() => {
    // Sleek Metallic Platinum Silver Body Paint (Matches Reference Diagram)
    const coachBodySilver = new THREE.MeshStandardMaterial({
      color: '#CBD5E1', // Platinum Metallic Silver
      roughness: 0.20,
      metalness: 0.42,
    });

    // Dark Piano Gloss Black Trim & Window Surround
    const coachDarkMask = new THREE.MeshStandardMaterial({
      color: '#0B0F19',
      roughness: 0.18,
      metalness: 0.50,
    });

    // Polished Mirror Chrome
    const chromeTrim = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.06,
      metalness: 0.98,
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
      transmission: 0.75,
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

    // Almond Cyan/Blue Projector Headlights (Matches Reference Diagram!)
    const headlightLensCyan = new THREE.MeshStandardMaterial({
      color: '#38BDF8',
      emissive: '#0284C7',
      emissiveIntensity: 0.95,
      roughness: 0.08,
      metalness: 0.2,
    });

    // Headlight White LED DRL Pipe
    const drlStrip = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      emissive: '#E0F2FE',
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });

    // Curved Ruby Red LED Taillights (Matches Reference Diagram!)
    const taillightLens = new THREE.MeshStandardMaterial({
      color: '#DC2626',
      emissive: '#EF4444',
      emissiveIntensity: 0.90,
      roughness: 0.15,
    });

    // Circular Fog / Marker Lamps
    const fogLampLens = new THREE.MeshStandardMaterial({
      color: '#FEF08A',
      emissive: '#F59E0B',
      emissiveIntensity: 0.85,
      roughness: 0.15,
    });

    // Amber Turn Indicators
    const amberIndicator = new THREE.MeshStandardMaterial({
      color: '#F59E0B',
      emissive: '#D97706',
      emissiveIntensity: 0.85,
      roughness: 0.2,
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

    // Silver Multi-Spoke Alloy Wheels (Matches Reference Diagram)
    const alloyRim = new THREE.MeshStandardMaterial({
      color: '#E2E8F0',
      roughness: 0.18,
      metalness: 0.88,
    });

    // Interior Molded Charcoal
    const interiorCharcoal = new THREE.MeshStandardMaterial({
      color: '#1E2530',
      roughness: 0.5,
    });

    return {
      coachBodySilver,
      coachDarkMask,
      chromeTrim,
      panoramicGlass,
      windshieldGlass,
      curtainMat,
      headlightLensCyan,
      drlStrip,
      taillightLens,
      fogLampLens,
      amberIndicator,
      safetyYellowRail,
      tireRubber,
      alloyRim,
      interiorCharcoal,
    };
  }, [curtainTexture, isZoomed]);

  return (
    <group position={[0, 0, 0]}>
      {/* ============================================================ */}
      {/* 0. SOFT GROUND CONTACT SHADOW ON TARMAC                      */}
      {/* ============================================================ */}
      <mesh position={[0, -0.18, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.2, 16.5]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={0.65} depthWrite={false} />
      </mesh>

      {/* ============================================================ */}
      {/* 1. CABIN FLOORING & AISLE (Spans across all 9 rows)           */}
      {/* ============================================================ */}
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
      {/* ============================================================ */}
      <group position={[-0.65, 0.55, -3.75]}>
        <RoundedBox args={[1.05, 0.75, 0.04]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.interiorCharcoal} attach="material" />
        </RoundedBox>
        <mesh position={[0, 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 1.05, 16]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>
      </group>

      <group position={[0.65, 0.55, -3.75]}>
        <RoundedBox args={[1.05, 0.75, 0.04]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.interiorCharcoal} attach="material" />
        </RoundedBox>
        <mesh position={[0, 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 1.05, 16]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 3. EXTERIOR BODY PANELS & LUGGAGE COMPARTMENTS (Reference)   */}
      {/* ============================================================ */}
      {/* Left Exterior Side Body Panel */}
      <group position={[-1.25, 0, 0.175]}>
        {/* Main Metallic Silver Lower Skirt */}
        <mesh position={[0, 0.40, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.80, 12.35]} />
          <primitive object={materials.coachBodySilver} attach="material" />
        </mesh>
        {/* Piano Gloss Black Beltline Graphic Trim */}
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.12, 12.35]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        {/* Front Diagonal Slanted Wedge Pillar (Matches Reference Diagram!) */}
        <mesh position={[0, 1.45, -4.95]} rotation={[-0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.082, 1.25, 0.22]} />
          <primitive object={materials.coachBodySilver} attach="material" />
        </mesh>
        {/* Flush Luggage Bay Hatches with Discrete Square Handles */}
        {[-2.6, -1.0, 0.6, 2.2, 3.8].map((z, idx) => (
          <group key={idx} position={[-0.045, 0.36, z]}>
            <mesh>
              <boxGeometry args={[0.005, 0.48, 1.40]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            <mesh position={[-0.005, -0.16, 0]}>
              <boxGeometry args={[0.008, 0.04, 0.08]} />
              <primitive object={materials.chromeTrim} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Right Exterior Side Body Panel */}
      <group position={[1.25, 0, 0.175]}>
        {/* Main Metallic Silver Lower Skirt */}
        <mesh position={[0, 0.40, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.80, 12.35]} />
          <primitive object={materials.coachBodySilver} attach="material" />
        </mesh>
        {/* Piano Gloss Black Beltline Graphic Trim */}
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.12, 12.35]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        {/* Front Diagonal Slanted Wedge Pillar */}
        <mesh position={[0, 1.45, -4.95]} rotation={[-0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.082, 1.25, 0.22]} />
          <primitive object={materials.coachBodySilver} attach="material" />
        </mesh>
        {/* Front Passenger Boarding Door Outline on Right Side */}
        <group position={[0.045, 0.95, -4.8]}>
          <mesh>
            <boxGeometry args={[0.01, 1.65, 1.05]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
          <mesh position={[0.008, 0.28, 0]} raycast={() => null}>
            <planeGeometry args={[0.85, 0.95]} />
            <primitive object={materials.panoramicGlass} attach="material" />
          </mesh>
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
              <boxGeometry args={[0.008, 0.04, 0.08]} />
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

      {/* Structural Window Pillars on Both Sides with Royal Blue Curtains */}
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
        Sleek Metallic Silver Roof Side Rails (Cutaway Silhouette Framing)
        Spans EXACTLY from Front Crown (Z = -4.95) to Rear Spoiler (Z = +6.35).
        Length = 11.30m, Centered at Z = +0.70.
      */}
      <group position={[-1.24, 2.15, 0.70]}>
        <RoundedBox args={[0.08, 0.14, 11.30]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodySilver} attach="material" />
        </RoundedBox>
      </group>
      <group position={[1.24, 2.15, 0.70]}>
        <RoundedBox args={[0.08, 0.14, 11.30]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodySilver} attach="material" />
        </RoundedBox>
      </group>

      {/* Aerodynamic Rooftop AC Housing (Matches Reference Diagram!) */}
      <group position={[0, 2.22, 0.60]}>
        <RoundedBox args={[1.75, 0.12, 4.2]} radius={0.05} smoothness={3} castShadow>
          <primitive object={materials.coachBodySilver} attach="material" />
        </RoundedBox>
      </group>

      {/* ============================================================ */}
      {/* 5. REALISTIC WHEELS (Matches Reference Diagram Wheels)        */}
      {/* ============================================================ */}
      {[
        [-1.26, -0.05, -4.30], // Front Left Steering
        [1.26, -0.05, -4.30],  // Front Right Steering
        [-1.26, -0.05, 4.40],  // Rear Left Drive
        [1.26, -0.05, 4.40],   // Rear Right Drive
      ].map(([wx, wy, wz], wi) => (
        <group key={wi} position={[wx, wy, wz]}>
          {/* Wheel Arch Fender Liner */}
          <mesh position={[wx > 0 ? -0.04 : 0.04, 0.15, 0]}>
            <boxGeometry args={[0.05, 0.65, 1.10]} />
            <primitive object={materials.interiorCharcoal} attach="material" />
          </mesh>
          {/* Rubber Tire with Deep Tread */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.24, 24]} />
            <primitive object={materials.tireRubber} attach="material" />
          </mesh>
          {/* Silver Multi-Hole Alloy Wheel (Matches Reference Diagram) */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.28, 0.28, 0.25, 20]} />
            <primitive object={materials.alloyRim} attach="material" />
          </mesh>
          {/* Central Hub & Lug Bolts */}
          <mesh position={[wx > 0 ? 0.135 : -0.135, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.12, 20]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ============================================================ */}
      {/* 6. AUTHENTIC FRONT COACH FASCIA & COCKPIT                     */}
      {/* Exact 1:1 match to center-right front view in Reference!      */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* Sculpted Curved Silver Front Bumper */}
        <RoundedBox
          args={[2.50, 0.65, 0.36]}
          radius={0.16}
          smoothness={4}
          position={[0, 0.35, -5.75]}
          castShadow
          receiveShadow
        >
          <primitive object={materials.coachBodySilver} attach="material" />
        </RoundedBox>

        {/* Lower Front Air Dam / Chin Splitter */}
        <RoundedBox
          args={[2.42, 0.15, 0.20]}
          radius={0.04}
          smoothness={3}
          position={[0, 0.10, -5.82]}
          castShadow
        >
          <primitive object={materials.coachDarkMask} attach="material" />
        </RoundedBox>

        {/* Central Round Emblem (Matches Reference Diagram!) */}
        <mesh position={[0, 0.68, -5.88]}>
          <circleGeometry args={[0.075, 24]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        <mesh position={[0, 0.68, -5.87]}>
          <circleGeometry args={[0.055, 24]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>

        {/* Front Recessed License Plate "0000" (Matches Reference Diagram!) */}
        <group position={[0, 0.32, -5.88]}>
          <RoundedBox args={[0.55, 0.18, 0.03]} radius={0.02} smoothness={3}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[0.48, 0.14]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>

        {/* Almond-Shaped Swept-Back Cyan Projector Headlights (Matches Reference Diagram!) */}
        {/* Left Headlamp Cluster */}
        <group position={[-0.96, 0.58, -5.76]} rotation={[0, 0.22, 0.12]}>
          <RoundedBox args={[0.40, 0.18, 0.05]} radius={0.04} smoothness={3}>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {/* Dual Cyan-Blue Projector Eyes */}
          {[-0.09, 0.09].map((lx, li) => (
            <mesh key={li} position={[lx, -0.01, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.042, 0.042, 0.02, 16]} />
              <primitive object={materials.headlightLensCyan} attach="material" />
            </mesh>
          ))}
          {/* Lower Amber Indicator Dot */}
          <mesh position={[0.14, -0.04, 0.035]}>
            <circleGeometry args={[0.025, 16]} />
            <primitive object={materials.amberIndicator} attach="material" />
          </mesh>
        </group>

        {/* Right Headlamp Cluster */}
        <group position={[0.96, 0.58, -5.76]} rotation={[0, -0.22, -0.12]}>
          <RoundedBox args={[0.40, 0.18, 0.05]} radius={0.04} smoothness={3}>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {/* Dual Cyan-Blue Projector Eyes */}
          {[-0.09, 0.09].map((lx, li) => (
            <mesh key={li} position={[lx, -0.01, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.042, 0.042, 0.02, 16]} />
              <primitive object={materials.headlightLensCyan} attach="material" />
            </mesh>
          ))}
          {/* Lower Amber Indicator Dot */}
          <mesh position={[-0.14, -0.04, 0.035]}>
            <circleGeometry args={[0.025, 16]} />
            <primitive object={materials.amberIndicator} attach="material" />
          </mesh>
        </group>

        {/* Dual Lower Circular Fog/Marker Lamps (Matches Reference Diagram!) */}
        <mesh position={[-0.92, 0.25, -5.88]} rotation={[0, 0.15, 0]}>
          <circleGeometry args={[0.05, 16]} />
          <primitive object={materials.fogLampLens} attach="material" />
        </mesh>
        <mesh position={[0.92, 0.25, -5.88]} rotation={[0, -0.15, 0]}>
          <circleGeometry args={[0.05, 16]} />
          <primitive object={materials.fogLampLens} attach="material" />
        </mesh>

        {/* Front Left and Right A-Pillars sweeping down from roof to cowl */}
        <mesh position={[-1.23, 1.58, -5.28]} rotation={[-0.32, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.35, 0.10]} />
          <primitive object={materials.coachBodySilver} attach="material" />
        </mesh>
        <mesh position={[1.23, 1.58, -5.28]} rotation={[-0.32, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.35, 0.10]} />
          <primitive object={materials.coachBodySilver} attach="material" />
        </mesh>

        {/* 
          Large Sweeping Aerodynamic Panoramic Windshield (Matches Reference Diagram)
          Occupies the upper ~60% of front height!
        */}
        <mesh position={[0, 1.58, -5.28]} rotation={[-0.32, 0, 0]} raycast={() => null}>
          <planeGeometry args={[2.42, 1.35]} />
          <primitive object={materials.windshieldGlass} attach="material" />
        </mesh>

        {/* Windshield Dual Articulated Pantograph Wipers */}
        <mesh position={[-0.42, 1.02, -5.48]} rotation={[0, 0, 0.20]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        <mesh position={[0.42, 1.02, -5.48]} rotation={[0, 0, 0.20]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>

        {/* Aerodynamic Front Roof Crown & Destination Matrix Sign */}
        <group position={[0, 2.16, -4.95]}>
          <RoundedBox args={[2.50, 0.22, 0.42]} radius={0.06} smoothness={3} castShadow>
            <primitive object={materials.coachBodySilver} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.02, -0.21]} rotation={[0.12, 0, 0]}>
            <planeGeometry args={[1.85, 0.12]} />
            <meshStandardMaterial color="#0B132B" emissive="#0284C7" emissiveIntensity={0.55} />
          </mesh>
        </group>

        {/* High-Mounted Elephant-Ear Aero Mirrors (Matches Reference Diagram!) */}
        <group position={[-1.35, 1.95, -5.02]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.50, 12]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
          <RoundedBox args={[0.12, 0.44, 0.16]} radius={0.03} smoothness={3} position={[-0.06, 0.08, -0.06]} castShadow>
            <primitive object={materials.coachBodySilver} attach="material" />
          </RoundedBox>
          <mesh position={[-0.01, 0.08, -0.06]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.14, 0.40]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
        <group position={[1.35, 1.95, -5.02]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.50, 12]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
          <RoundedBox args={[0.12, 0.44, 0.16]} radius={0.03} smoothness={3} position={[0.06, 0.08, -0.06]} castShadow>
            <primitive object={materials.coachBodySilver} attach="material" />
          </RoundedBox>
          <mesh position={[0.01, 0.08, -0.06]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.14, 0.40]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>

        {/* DRIVER COCKPIT CONSOLE & SAFETY CABIN */}
        <group position={[-0.50, 0.65, -5.20]}>
          <RoundedBox args={[1.20, 0.45, 0.65]} radius={0.04} smoothness={3} castShadow>
            <primitive object={materials.interiorCharcoal} attach="material" />
          </RoundedBox>

          <mesh position={[0, 0.23, 0.02]} rotation={[-0.35, 0, 0]}>
            <planeGeometry args={[0.78, 0.26]} />
            <meshStandardMaterial map={dashTexture} roughness={0.25} metalness={0.1} />
          </mesh>

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

          <mesh position={[0.58, 0.35, 0.20]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 1.05, 16]} />
            <primitive object={materials.safetyYellowRail} attach="material" />
          </mesh>

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

        {/* Boarding Steps at Front Right Entrance */}
        <group position={[0.78, -0.08, -4.75]}>
          <mesh receiveShadow>
            <boxGeometry args={[0.70, 0.10, 0.45]} />
            <primitive object={materials.interiorCharcoal} attach="material" />
          </mesh>
          <mesh position={[0, 0.052, 0.21]}>
            <boxGeometry args={[0.70, 0.008, 0.02]} />
            <primitive object={materials.safetyYellowRail} attach="material" />
          </mesh>
          <mesh position={[-0.30, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 1.10, 16]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 7. COHESIVE, FLUSH REAR BULKHEAD & TAIL (Z = +6.35)           */}
      {/* Exact 1:1 match to center-left rear view in Reference!        */}
      {/* ============================================================ */}
      <group position={[0, 0.95, 6.35]}>
        {/* Full-width Rear Curved Body Cap in Metallic Silver */}
        <RoundedBox args={[2.50, 2.12, 0.32]} radius={0.14} smoothness={4} castShadow receiveShadow>
          <primitive object={materials.coachBodySilver} attach="material" />
        </RoundedBox>

        {/* Upper Slanted Rear Privacy Window (Matches Reference Diagram!) */}
        <mesh position={[0, 0.52, 0.18]} raycast={() => null}>
          <planeGeometry args={[1.75, 0.78]} />
          <primitive object={materials.panoramicGlass} attach="material" />
        </mesh>

        {/* Tall Curved Vertical Red Taillights on Outer Corners (Matches Reference Diagram!) */}
        {/* Left Taillight */}
        <group position={[-1.14, 0.02, 0.16]}>
          <RoundedBox args={[0.12, 0.96, 0.04]} radius={0.03} smoothness={3}>
            <primitive object={materials.taillightLens} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.32, 0.025]}>
            <circleGeometry args={[0.03, 16]} />
            <primitive object={materials.amberIndicator} attach="material" />
          </mesh>
        </group>

        {/* Right Taillight */}
        <group position={[1.14, 0.02, 0.16]}>
          <RoundedBox args={[0.12, 0.96, 0.04]} radius={0.03} smoothness={3}>
            <primitive object={materials.taillightLens} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.32, 0.025]}>
            <circleGeometry args={[0.03, 16]} />
            <primitive object={materials.amberIndicator} attach="material" />
          </mesh>
        </group>

        {/* Rear Recessed License Plate "0000" (Matches Reference Diagram!) */}
        <group position={[0, -0.42, 0.17]}>
          <RoundedBox args={[0.55, 0.18, 0.02]} radius={0.02} smoothness={3}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[0.48, 0.14]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>

        {/* Lower Rear Bumper with Twin Red Reflectors & Exhausts */}
        <group position={[0, -0.85, 0.16]}>
          <RoundedBox args={[2.52, 0.38, 0.22]} radius={0.08} smoothness={3} castShadow>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {/* Circular Red Reflectors */}
          <mesh position={[-0.92, 0.02, 0.12]}>
            <circleGeometry args={[0.045, 16]} />
            <primitive object={materials.taillightLens} attach="material" />
          </mesh>
          <mesh position={[0.92, 0.02, 0.12]}>
            <circleGeometry args={[0.045, 16]} />
            <primitive object={materials.taillightLens} attach="material" />
          </mesh>
          {/* Twin Chrome Exhausts */}
          <mesh position={[-0.60, -0.08, 0.12]}>
            <boxGeometry args={[0.22, 0.06, 0.03]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
          <mesh position={[0.60, -0.08, 0.12]}>
            <boxGeometry args={[0.22, 0.06, 0.03]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>

        {/* Aerodynamic High-Mount Rear Roof Spoiler */}
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
    <div className="w-full h-full relative select-none bg-linear-to-b from-[#38BDF8] via-[#BAE6FD] to-[#E2E8F0]">
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
          far={120}
        />
        <CameraController activeFocusedSeat={activeFocusedSeat} isZoomed={isZoomed} />

        {/* OUTDOOR SUNLIT TRANSIT TERMINAL DAYLIGHT ILLUMINATION */}
        <hemisphereLight args={['#BAE6FD', '#E2E8F0', 1.2]} />

        {/* Primary Sun Spotlight Casting Natural Pavement Shadows */}
        <directionalLight
          position={[14, 25, 12]}
          intensity={2.3}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={16}
          shadow-camera-bottom={-16}
          shadow-bias={0.0001}
          color="#FFFEEA"
        />

        {/* Ambient Sky Fill Light */}
        <directionalLight position={[-12, 14, -8]} intensity={0.9} color="#F8FAFC" />

        {/* Front Nose Illumination */}
        <directionalLight position={[0, 8, -16]} intensity={1.1} color="#FFFDF7" />

        {/* Realistic Modern Transit Terminal Bay Scenario (Ground Tarmac, Bay Markings, Sidewalk Platform) */}
        <ModernTerminalBayEnvironment />

        {/* Exact Reference Metallic Silver Luxury Touring Coach Model */}
        <SilverLuxuryTouringCoachModel isZoomed={isZoomed} />

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
