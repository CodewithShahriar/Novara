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

// Initial Intro Position (Pic 1 - 3/4 side profile overview)
const INTRO_CAMERA_POS = { x: -8.8, y: 7.2, z: 8.4 };
const INTRO_TARGET = { x: 0, y: 0.5, z: 0.3 };

// Final Aligned Overhead Cabin Position (Pic 2 - Aligned rear looking down center aisle)
const OVERVIEW_CAMERA_POS = { x: 0.05, y: 10.8, z: 9.4 };
const OVERVIEW_TARGET = { x: 0, y: 0.4, z: 0.5 };

// Camera controller: ALWAYS places camera in the central aisle looking toward the seat
function CameraController({
  activeFocusedSeat,
  isZoomed,
}: {
  activeFocusedSeat: SeatData | null;
  isZoomed: boolean;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const hasAnimatedIntro = useRef(false);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    // First visit intro swoop: starts at Pic 1 (side angle) and smoothly rotates to Pic 2 (cabin overview)
    if (!hasAnimatedIntro.current && !isZoomed) {
      hasAnimatedIntro.current = true;
      camera.position.set(INTRO_CAMERA_POS.x, INTRO_CAMERA_POS.y, INTRO_CAMERA_POS.z);
      controls.target.set(INTRO_TARGET.x, INTRO_TARGET.y, INTRO_TARGET.z);
      controls.update();

      gsap.to(camera.position, {
        x: OVERVIEW_CAMERA_POS.x,
        y: OVERVIEW_CAMERA_POS.y,
        z: OVERVIEW_CAMERA_POS.z,
        duration: 2.2,
        ease: 'power2.inOut',
        delay: 0.15,
        onUpdate: () => controls.update(),
      });

      gsap.to(controls.target, {
        x: OVERVIEW_TARGET.x,
        y: OVERVIEW_TARGET.y,
        z: OVERVIEW_TARGET.z,
        duration: 2.2,
        ease: 'power2.inOut',
        delay: 0.15,
        onUpdate: () => controls.update(),
      });
      return;
    }

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);

    if (isZoomed && activeFocusedSeat) {
      const [sx, sy, sz] = activeFocusedSeat.position;

      // Position camera in the central open aisle directly adjacent/in front of the seat
      // In the open aisle (x: ±0.28) where zero geometry ever obstructs the lens.
      // Elevated comfortably (y: sy + 1.10) with gentle setback (z: sz - 1.25)
      // and centered on the midpoint of the seat (y: sy + 0.40) so the entire suite
      // (headrest badge, backrest, cushion, armrest, floor runner) is framed with breathing room.
      const targetCameraPos = {
        x: sx < 0 ? 0.28 : -0.28,
        y: sy + 1.10,
        z: sz - 1.25,
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
        y: sy + 0.40,
        z: sz,
        duration: 1.15,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
      });
    } else {
      // Smoothly zoom back out to aligned cabin overview (Pic 2)
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
      minDistance={1.0}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={0.18}
    />
  );
}

// ============================================================================
// CLEAN EXPANSIVE TARMAC APRON ENVIRONMENT
// 100% clean ground plane at Y = -0.50 (tires rest flush with surface!)
// Zero white platforms, zero poles blocking camera, dark sleek asphalt
// ============================================================================
function ModernTerminalBayEnvironment() {
  const tarmacTexture = useMemo(() => getTarmacTexture(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* Vast Transit Apron Asphalt Ground Plane (Extends smoothly to horizon at Y = -0.50) */}
      <mesh position={[0, -0.50, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial map={tarmacTexture} roughness={0.70} metalness={0.20} color="#0D1929" />
      </mesh>
    </group>
  );
}

// ============================================================================
// AUTHENTIC 3-AXLE EUROPEAN LUXURY TOURING COACH MODEL
// Exact 1:1 match to reference photos & orthographic diagrams:
// - Solid, continuous aerodynamic front nose (cowl + bumper + swept-back windshield)
// - Sleek continuous silver side body (zero black boxes!) with flush door
// - 3-Axle 6x2 flagship coach setup with 6 detailed wheels
// - 100% open cutaway roof with zero floating slabs covering seats
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
      roughness: 0.18,
      metalness: 0.45,
    });

    // Dark Piano Gloss Black Trim & Window Surround
    const coachDarkMask = new THREE.MeshStandardMaterial({
      color: '#0B0F19',
      roughness: 0.16,
      metalness: 0.50,
    });

    // Polished Mirror Chrome
    const chromeTrim = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.05,
      metalness: 0.98,
    });

    // High-transparency Solar Tinted Panoramic Window Glass
    const panoramicGlass = new THREE.MeshPhysicalMaterial({
      color: '#0A1120',
      transparent: true,
      opacity: isZoomed ? 0.12 : 0.25,
      roughness: 0.04,
      metalness: 0.20,
      transmission: 0.88,
      ior: 1.50,
      side: THREE.DoubleSide,
    });

    // Windshield Glass with Realistic Tint & Reflection
    const windshieldGlass = new THREE.MeshPhysicalMaterial({
      color: '#0F172A',
      transparent: true,
      opacity: 0.40,
      roughness: 0.06,
      metalness: 0.25,
      transmission: 0.78,
      ior: 1.52,
      side: THREE.DoubleSide,
    });

    // Draped Royal Blue Window Curtains
    const curtainMat = new THREE.MeshStandardMaterial({
      map: curtainTexture,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // Almond Cyan/Blue Projector Headlights
    const headlightLensCyan = new THREE.MeshStandardMaterial({
      color: '#38BDF8',
      emissive: '#0284C7',
      emissiveIntensity: 0.95,
      roughness: 0.08,
      metalness: 0.2,
    });

    // Headlight White LED DRL Strip
    const drlStrip = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      emissive: '#F0F9FF',
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });

    // Curved Ruby Red LED Taillights
    const taillightLens = new THREE.MeshStandardMaterial({
      color: '#DC2626',
      emissive: '#EF4444',
      emissiveIntensity: 0.90,
      roughness: 0.15,
    });

    // Circular Fog / Marker Lamps
    const fogLampLens = new THREE.MeshStandardMaterial({
      color: '#FEF08A',
      emissive: '#EAB308',
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

    // Silver Multi-Spoke Alloy Wheels
    const alloyRim = new THREE.MeshStandardMaterial({
      color: '#E2E8F0',
      roughness: 0.16,
      metalness: 0.90,
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
      <mesh position={[0, -0.495, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.5, 17.0]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={0.65} depthWrite={false} />
      </mesh>

      {/* ============================================================ */}
      {/* 1. CABIN FLOORING & AISLE (Spans across all 9 rows)           */}
      {/* ============================================================ */}
      {/* Left Raised Platform with Wood Floor Texture */}
      <mesh position={[-0.73, 0.04, 1.275]} receiveShadow>
        <boxGeometry args={[0.98, 0.12, 9.85]} />
        <meshStandardMaterial map={carpetFloorTexture} roughness={0.7} metalness={0.08} />
      </mesh>

      {/* Right Raised Platform with Wood Floor Texture */}
      <mesh position={[0.73, 0.04, 1.275]} receiveShadow>
        <boxGeometry args={[0.98, 0.12, 9.85]} />
        <meshStandardMaterial map={carpetFloorTexture} roughness={0.7} metalness={0.08} />
      </mesh>

      {/* Center Sunken Aisle with Diamond-Plate Aluminum Tread */}
      <mesh position={[0, 0.015, 0.80]} receiveShadow>
        <boxGeometry args={[0.48, 0.07, 10.80]} />
        <meshStandardMaterial map={aisleRunnerTexture} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Chassis Base Under-Shield */}
      <mesh position={[0, -0.06, 0.20]} receiveShadow>
        <boxGeometry args={[2.52, 0.12, 12.80]} />
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
      {/* 3. SOLID, SEAMLESS AERODYNAMIC FRONT COACH FASCIA            */}
      {/* Perfectly unified bumper, cowl, swept-back windshield, crown */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* A. Lower Sculpted Silver Front Bumper */}
        <RoundedBox
          args={[2.52, 0.54, 0.45]}
          radius={0.16}
          smoothness={4}
          position={[0, 0.28, -5.45]}
          castShadow
          receiveShadow
        >
          <primitive object={materials.coachBodySilver} attach="material" />
        </RoundedBox>

        {/* Lower Chin Aerodynamic Air Splitter */}
        <RoundedBox
          args={[2.46, 0.10, 0.30]}
          radius={0.04}
          smoothness={3}
          position={[0, 0.06, -5.55]}
          castShadow
        >
          <primitive object={materials.coachDarkMask} attach="material" />
        </RoundedBox>

        {/* B. Solid Front Cowl / Hood (Seamlessly connects bumper to windshield base!) */}
        <RoundedBox
          args={[2.52, 0.60, 0.42]}
          radius={0.12}
          smoothness={4}
          position={[0, 0.80, -5.35]}
          castShadow
          receiveShadow
        >
          <primitive object={materials.coachBodySilver} attach="material" />
        </RoundedBox>

        {/* C. Gloss Black Aerodynamic Grille Band with Chrome Wing & Emblem */}
        <mesh position={[0, 0.75, -5.57]}>
          <boxGeometry args={[1.85, 0.12, 0.02]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        <mesh position={[0, 0.75, -5.58]}>
          <boxGeometry args={[1.80, 0.02, 0.03]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>
        <mesh position={[0, 0.75, -5.60]}>
          <circleGeometry args={[0.065, 24]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>

        {/* D. Front Recessed European License Plate "0000" */}
        <group position={[0, 0.32, -5.69]}>
          <RoundedBox args={[0.56, 0.16, 0.02]} radius={0.02} smoothness={3}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} />
          </RoundedBox>
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[0.50, 0.12]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>

        {/* E. Swept-Back Cyan Almond Projector Headlight Clusters */}
        {/* Left Headlamp */}
        <group position={[-0.95, 0.62, -5.50]} rotation={[0, 0.20, 0.08]}>
          <RoundedBox args={[0.42, 0.20, 0.06]} radius={0.04} smoothness={3}>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {[-0.10, 0.08].map((lx, li) => (
            <mesh key={li} position={[lx, -0.01, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.042, 0.042, 0.02, 16]} />
              <primitive object={materials.headlightLensCyan} attach="material" />
            </mesh>
          ))}
          <mesh position={[-0.01, 0.075, 0.038]}>
            <boxGeometry args={[0.34, 0.02, 0.015]} />
            <primitive object={materials.drlStrip} attach="material" />
          </mesh>
          <mesh position={[0.15, -0.04, 0.038]}>
            <circleGeometry args={[0.028, 16]} />
            <primitive object={materials.amberIndicator} attach="material" />
          </mesh>
        </group>

        {/* Right Headlamp */}
        <group position={[0.95, 0.62, -5.50]} rotation={[0, -0.20, -0.08]}>
          <RoundedBox args={[0.42, 0.20, 0.06]} radius={0.04} smoothness={3}>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {[-0.08, 0.10].map((lx, li) => (
            <mesh key={li} position={[lx, -0.01, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.042, 0.042, 0.02, 16]} />
              <primitive object={materials.headlightLensCyan} attach="material" />
            </mesh>
          ))}
          <mesh position={[0.01, 0.075, 0.038]}>
            <boxGeometry args={[0.34, 0.02, 0.015]} />
            <primitive object={materials.drlStrip} attach="material" />
          </mesh>
          <mesh position={[-0.15, -0.04, 0.038]}>
            <circleGeometry args={[0.028, 16]} />
            <primitive object={materials.amberIndicator} attach="material" />
          </mesh>
        </group>

        {/* Circular Lower Fog Lamps */}
        <mesh position={[-0.92, 0.22, -5.69]} rotation={[0, 0.16, 0]}>
          <circleGeometry args={[0.05, 16]} />
          <primitive object={materials.fogLampLens} attach="material" />
        </mesh>
        <mesh position={[0.92, 0.22, -5.69]} rotation={[0, -0.16, 0]}>
          <circleGeometry args={[0.05, 16]} />
          <primitive object={materials.fogLampLens} attach="material" />
        </mesh>

        {/* F. Swept-Back Aerodynamic Panoramic Windshield */}
        {/* Leans BACKWARD from cowl (Y=1.08, Z=-5.30) to meet Roof Crown (Y=2.18, Z=-4.85) */}
        <mesh position={[0, 1.63, -5.075]} rotation={[0.39, 0, 0]} raycast={() => null}>
          <planeGeometry args={[2.42, 1.19]} />
          <primitive object={materials.windshieldGlass} attach="material" />
        </mesh>

        {/* Structural Left & Right Windshield A-Pillars in Metallic Silver */}
        <mesh position={[-1.23, 1.63, -5.075]} rotation={[0.39, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.20, 0.12]} />
          <primitive object={materials.coachBodySilver} attach="material" />
        </mesh>
        <mesh position={[1.23, 1.63, -5.075]} rotation={[0.39, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.20, 0.12]} />
          <primitive object={materials.coachBodySilver} attach="material" />
        </mesh>

        {/* Windshield Dual Wipers */}
        <mesh position={[-0.42, 1.14, -5.25]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        <mesh position={[0.42, 1.14, -5.25]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>

        {/* G. Front Roof Crown & Destination Matrix Display */}
        <group position={[0, 2.18, -4.85]}>
          <RoundedBox args={[2.52, 0.18, 0.35]} radius={0.06} smoothness={3} castShadow>
            <primitive object={materials.coachBodySilver} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.01, -0.18]} rotation={[0.08, 0, 0]}>
            <planeGeometry args={[1.85, 0.11]} />
            <meshStandardMaterial color="#0B132B" emissive="#0284C7" emissiveIntensity={0.65} />
          </mesh>
        </group>

        {/* H. High-Mounted Curved Elephant-Ear Aero Mirrors */}
        <group position={[-1.34, 1.95, -4.90]}>
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
        <group position={[1.34, 1.95, -4.90]}>
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

        {/* I. Enclosed Driver Cockpit & Dashboard */}
        <group position={[-0.50, 0.65, -4.90]}>
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

          <mesh position={[0.58, 0.35, 0.20]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 1.05, 16]} />
            <primitive object={materials.safetyYellowRail} attach="material" />
          </mesh>

          {/* Driver Ergonomic Seat */}
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
        </group>

        {/* Boarding Steps at Front Right Entrance */}
        <group position={[0.78, -0.08, -4.60]}>
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
      {/* 4. SLEEK METALLIC SILVER SIDE BODY PANELS (NO BLACK BOXES!)  */}
      {/* ============================================================ */}
      {/* Left Exterior Side Body Panel */}
      <group position={[-1.25, 0, 0.55]}>
        {/* Continuous Smooth Silver Lower Skirt */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.84, 11.80]} />
          <primitive object={materials.coachBodySilver} attach="material" />
        </mesh>
        {/* Elegant Mid-Body Chrome Accent Line */}
        <mesh position={[-0.042, 0.46, 0]}>
          <boxGeometry args={[0.005, 0.02, 11.80]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>
        {/* Dark Beltline Trim along window bottom */}
        <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.08, 11.80]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
      </group>

      {/* Right Exterior Side Body Panel */}
      <group position={[1.25, 0, 0.55]}>
        {/* Continuous Smooth Silver Lower Skirt */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.84, 11.80]} />
          <primitive object={materials.coachBodySilver} attach="material" />
        </mesh>
        {/* Elegant Mid-Body Chrome Accent Line */}
        <mesh position={[0.042, 0.46, 0]}>
          <boxGeometry args={[0.005, 0.02, 11.80]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>
        {/* Dark Beltline Trim along window bottom */}
        <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.08, 11.80]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>

        {/* Front Passenger Boarding Door (Integrated with body paint & tinted glass!) */}
        <group position={[0.042, 0.95, -4.9]}>
          {/* Lower Silver Door Panel */}
          <mesh position={[0, -0.52, 0]}>
            <boxGeometry args={[0.01, 0.80, 0.90]} />
            <primitive object={materials.coachBodySilver} attach="material" />
          </mesh>
          {/* Upper Tinted Glass Door Window */}
          <mesh position={[0, 0.35, 0]} raycast={() => null}>
            <planeGeometry args={[0.82, 0.90]} />
            <primitive object={materials.panoramicGlass} attach="material" />
          </mesh>
          {/* Door Frame Border */}
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[0.012, 0.02, 0.90]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
          {/* Vertical Chrome Grab Handle */}
          <mesh position={[0.012, -0.15, 0.34]}>
            <boxGeometry args={[0.015, 0.22, 0.025]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 5. PANORAMIC SIDE WINDOWS & DRAPED CURTAINS                  */}
      {/* ============================================================ */}
      {/* Left Panoramic Window Glass */}
      <mesh position={[-1.23, 1.50, 0.75]} raycast={() => null}>
        <boxGeometry args={[0.02, 1.15, 11.20]} />
        <primitive object={materials.panoramicGlass} attach="material" />
      </mesh>

      {/* Right Panoramic Window Glass */}
      <mesh position={[1.23, 1.50, 0.75]} raycast={() => null}>
        <boxGeometry args={[0.02, 1.15, 11.20]} />
        <primitive object={materials.panoramicGlass} attach="material" />
      </mesh>

      {/* Structural Window Pillars & Draped Curtains */}
      {[-3.6, -1.8, 0.0, 1.8, 3.6, 5.2].map((z, idx) => (
        <React.Fragment key={idx}>
          {/* Left Pillar & Curtain */}
          <group position={[-1.23, 1.50, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 1.16, 0.12]} />
              <primitive object={materials.coachDarkMask} attach="material" />
            </mesh>
            <mesh position={[0.035, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.95, 0.12]} />
              <primitive object={materials.curtainMat} attach="material" />
            </mesh>
          </group>

          {/* Right Pillar & Curtain */}
          <group position={[1.23, 1.50, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 1.16, 0.12]} />
              <primitive object={materials.coachDarkMask} attach="material" />
            </mesh>
            <mesh position={[-0.035, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.95, 0.12]} />
              <primitive object={materials.curtainMat} attach="material" />
            </mesh>
          </group>
        </React.Fragment>
      ))}

      {/* ============================================================ */}
      {/* 6. 100% UNOBSTRUCTED CUTAWAY ROOF SILHOUETTE RAILS           */}
      {/* Zero central cover slabs! All 36 seats 100% visible from top */}
      {/* ============================================================ */}
      <group position={[-1.24, 2.15, 0.75]}>
        <RoundedBox args={[0.08, 0.14, 11.20]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodySilver} attach="material" />
        </RoundedBox>
      </group>
      <group position={[1.24, 2.15, 0.75]}>
        <RoundedBox args={[0.08, 0.14, 11.20]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodySilver} attach="material" />
        </RoundedBox>
      </group>

      {/* ============================================================ */}
      {/* 7. AUTHENTIC 3-AXLE SETUP (6 WHEELS: DUAL REAR AXLES)         */}
      {/* ============================================================ */}
      {[
        [-1.27, -0.05, -4.20], // Front Left Steering
        [1.27, -0.05, -4.20],  // Front Right Steering
        [-1.27, -0.05, 3.80],  // Rear Left Drive Axle
        [1.27, -0.05, 3.80],   // Rear Right Drive Axle
        [-1.27, -0.05, 5.00],  // Rear Left Tag/Trailing Axle
        [1.27, -0.05, 5.00],   // Rear Right Tag/Trailing Axle
      ].map(([wx, wy, wz], wi) => (
        <group key={wi} position={[wx, wy, wz]}>
          {/* Wheel Arch Fender Liner */}
          <mesh position={[wx > 0 ? -0.04 : 0.04, 0.15, 0]}>
            <boxGeometry args={[0.05, 0.65, 1.05]} />
            <primitive object={materials.interiorCharcoal} attach="material" />
          </mesh>
          {/* Rubber Tire with Deep Tread */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.24, 24]} />
            <primitive object={materials.tireRubber} attach="material" />
          </mesh>
          {/* Silver Multi-Hole Alloy Wheel */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.28, 0.28, 0.25, 20]} />
            <primitive object={materials.alloyRim} attach="material" />
          </mesh>
          {/* Central Hub & Lug Bolt Cap */}
          <mesh position={[wx > 0 ? 0.135 : -0.135, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.12, 20]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ============================================================ */}
      {/* 8. COHESIVE, SOLID REAR BULKHEAD & TAIL (Z = +6.40)          */}
      {/* ============================================================ */}
      <group position={[0, 0.98, 6.40]}>
        {/* Full-width Rear Curved Body Cap in Metallic Silver */}
        <RoundedBox args={[2.52, 2.14, 0.30]} radius={0.14} smoothness={4} castShadow receiveShadow>
          <primitive object={materials.coachBodySilver} attach="material" />
        </RoundedBox>

        {/* Upper Slanted Rear Privacy Window */}
        <mesh position={[0, 0.52, 0.16]} raycast={() => null}>
          <planeGeometry args={[1.75, 0.78]} />
          <primitive object={materials.panoramicGlass} attach="material" />
        </mesh>

        {/* Tall Curved Vertical Red Taillights on Outer Corners */}
        {/* Left Taillight */}
        <group position={[-1.15, 0.02, 0.16]}>
          <RoundedBox args={[0.12, 0.96, 0.04]} radius={0.03} smoothness={3}>
            <primitive object={materials.taillightLens} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.32, 0.025]}>
            <circleGeometry args={[0.03, 16]} />
            <primitive object={materials.amberIndicator} attach="material" />
          </mesh>
        </group>

        {/* Right Taillight */}
        <group position={[1.15, 0.02, 0.16]}>
          <RoundedBox args={[0.12, 0.96, 0.04]} radius={0.03} smoothness={3}>
            <primitive object={materials.taillightLens} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.32, 0.025]}>
            <circleGeometry args={[0.03, 16]} />
            <primitive object={materials.amberIndicator} attach="material" />
          </mesh>
        </group>

        {/* Rear Recessed License Plate "0000" */}
        <group position={[0, -0.42, 0.16]}>
          <RoundedBox args={[0.55, 0.18, 0.02]} radius={0.02} smoothness={3}>
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[0.48, 0.14]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>

        {/* Lower Rear Bumper with Twin Reflectors & Chrome Exhaust Tips */}
        <group position={[0, -0.88, 0.16]}>
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
    <div className="w-full h-full relative select-none bg-[#071322] bg-linear-to-b from-[#030712] via-[#071322] to-[#0A1B2E]">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.30,
        }}
      >
        {/* Deep dark atmospheric depth fog for sleek blurred background effect */}
        <fog attach="fog" args={['#071322', 15, 65]} />

        <PerspectiveCamera
          makeDefault
          position={[INTRO_CAMERA_POS.x, INTRO_CAMERA_POS.y, INTRO_CAMERA_POS.z]}
          fov={38}
          near={0.1}
          far={140}
        />
        <CameraController activeFocusedSeat={activeFocusedSeat} isZoomed={isZoomed} />

        {/* ATMOSPHERIC DUSK / NIGHT APRON ILLUMINATION */}
        <hemisphereLight args={['#1E293B', '#071322', 1.0]} />

        {/* Primary Warm Key Spotlight Casting Soft Shadows on Tarmac */}
        <directionalLight
          position={[14, 25, 12]}
          intensity={2.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={16}
          shadow-camera-bottom={-16}
          shadow-bias={0.0001}
          color="#FFF8EB"
        />

        {/* Cool Azure Rim & Fill Light */}
        <directionalLight position={[-12, 14, -8]} intensity={1.1} color="#60A5FA" />

        {/* Front Nose & Windshield Crisp Highlight */}
        <directionalLight position={[0, 7, -16]} intensity={1.4} color="#FFFDF7" />

        {/* Warm Golden Interior Passenger Cabin Glow (Adds luxury depth against dark apron) */}
        <pointLight position={[0, 1.2, -2.5]} intensity={1.8} distance={8} color="#FEF08A" />
        <pointLight position={[0, 1.2, 1.2]} intensity={1.8} distance={8} color="#FEF08A" />
        <pointLight position={[0, 1.2, 4.5]} intensity={1.8} distance={8} color="#FEF08A" />

        {/* Clean Expansive Transit Tarmac Apron (Zero platforms, zero poles) */}
        <ModernTerminalBayEnvironment />

        {/* 3-Axle Metallic Silver Flagship Luxury Touring Coach Model */}
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
