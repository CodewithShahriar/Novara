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

// Elevated 3/4 cutaway camera position: full coach visible from front to rear
const OVERVIEW_CAMERA_POS = { x: 4.8, y: 7.2, z: 8.6 };
const OVERVIEW_TARGET = { x: 0, y: 0.2, z: 0.2 };

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
      // For left seats (A & B, sx < 0): stand in aisle at x = +0.06 looking left-forward at the seat
      // For right seats (C & D, sx > 0): stand in aisle at x = -0.06 looking right-forward at the seat
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
      maxDistance={25}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={0.12}
    />
  );
}

// Photorealistic Champagne Metallic Luxury Touring Coach Model (Reference Picture 6)
function ChampagneLuxuryCoachModel({ isZoomed }: { isZoomed: boolean }) {
  const carpetFloorTexture = useMemo(() => getWoodFloorTexture(), []);
  const aisleRunnerTexture = useMemo(() => getAisleCarpetTexture(), []);
  const dashTexture = useMemo(() => getDashboardClusterTexture(), []);
  const curtainTexture = useMemo(() => getCurtainTexture(), []);
  const shadowTexture = useMemo(() => getRadialShadowTexture(), []);

  // Premium automotive coach materials (Matching Image 6 Gold/Champagne Touring Coach)
  const materials = useMemo(() => {
    // Rich Champagne / Gold Metallic Coach Body Paint (Image 6)
    const coachBodyGold = new THREE.MeshStandardMaterial({
      color: '#C8AB73', // Elegant metallic champagne gold (Image 6)
      roughness: 0.22,
      metalness: 0.38,
    });

    // Dark Gloss Trim & Window Surround
    const coachDarkMask = new THREE.MeshStandardMaterial({
      color: '#1A202C',
      roughness: 0.25,
      metalness: 0.5,
    });

    // Polished Mirror Chrome
    const chromeTrim = new THREE.MeshStandardMaterial({
      color: '#F8FAFC',
      roughness: 0.1,
      metalness: 0.95,
    });

    // High-transparency Solar Tinted Panoramic Window Glass (Image 6)
    const panoramicGlass = new THREE.MeshPhysicalMaterial({
      color: '#0F172A',
      transparent: true,
      opacity: isZoomed ? 0.15 : 0.25,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.88,
      ior: 1.45,
    });

    // Draped Royal Blue Window Curtains (Picture 4)
    const curtainMat = new THREE.MeshStandardMaterial({
      map: curtainTexture,
      roughness: 0.65,
      metalness: 0.05,
    });

    // Triple LED Projector Headlights (Image 6)
    const headlightLens = new THREE.MeshStandardMaterial({
      color: '#FFFDF0',
      emissive: '#FEF08A',
      emissiveIntensity: 0.85,
      roughness: 0.1,
      metalness: 0.2,
    });

    // Ruby Red LED Taillights (Image 6)
    const taillightLens = new THREE.MeshStandardMaterial({
      color: '#DC2626',
      emissive: '#991B1B',
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });

    // Circular Fog Lamps (Image 6)
    const fogLampLens = new THREE.MeshStandardMaterial({
      color: '#FEF08A',
      emissive: '#F59E0B',
      emissiveIntensity: 0.75,
      roughness: 0.15,
    });

    // High-visibility Safety Yellow Rails (Picture 4 & 5)
    const safetyYellowRail = new THREE.MeshStandardMaterial({
      color: '#FACC15',
      roughness: 0.25,
      metalness: 0.3,
    });

    // Tires
    const tireRubber = new THREE.MeshStandardMaterial({
      color: '#181D24',
      roughness: 0.85,
      metalness: 0.1,
    });

    // Diamond-cut Multi-spoke Alloy Wheels (Image 6)
    const alloyRim = new THREE.MeshStandardMaterial({
      color: '#CBD5E1',
      roughness: 0.2,
      metalness: 0.9,
    });

    // Interior Molded Charcoal
    const interiorCharcoal = new THREE.MeshStandardMaterial({
      color: '#1E2530',
      roughness: 0.5,
    });

    return {
      coachBodyGold,
      coachDarkMask,
      chromeTrim,
      panoramicGlass,
      curtainMat,
      headlightLens,
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
      <mesh position={[0, -0.16, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.5, 16.5]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={0.65} depthWrite={false} />
      </mesh>

      {/* ============================================================ */}
      {/* 1. CABIN FLOORING & AISLE (Picture 3 & 4 Alignment)           */}
      {/* ============================================================ */}
      {/* Left Raised Seating Platform with Charcoal Transit Carpet */}
      <mesh position={[-0.73, 0.04, 0.3]} receiveShadow>
        <boxGeometry args={[0.98, 0.12, 11.2]} />
        <meshStandardMaterial map={carpetFloorTexture} roughness={0.7} metalness={0.08} />
      </mesh>

      {/* Right Raised Seating Platform with Charcoal Transit Carpet */}
      <mesh position={[0.73, 0.04, 0.3]} receiveShadow>
        <boxGeometry args={[0.98, 0.12, 11.2]} />
        <meshStandardMaterial map={carpetFloorTexture} roughness={0.7} metalness={0.08} />
      </mesh>

      {/* Center Sunken Aisle with Diamond-Plate Aluminum Runner & Safety Yellow Lines (Picture 3 & 4) */}
      <mesh position={[0, 0.015, 0.3]} receiveShadow>
        <boxGeometry args={[0.48, 0.07, 11.2]} />
        <meshStandardMaterial map={aisleRunnerTexture} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Main Structural Undercarriage Chassis Frame */}
      <mesh position={[0, -0.06, 0.2]} receiveShadow>
        <boxGeometry args={[2.55, 0.12, 14.2]} />
        <primitive object={materials.interiorCharcoal} attach="material" />
      </mesh>

      {/* ============================================================ */}
      {/* 2. EXTERIOR LOWER BODY PANELS & SKIRTING (Image 6 Champagne) */}
      {/* ============================================================ */}
      {/* Left Exterior Body Skirt */}
      <group position={[-1.28, 0, 0.2]}>
        <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.76, 14.0]} />
          <primitive object={materials.coachBodyGold} attach="material" />
        </mesh>
        {/* Beltline Dark Mask Band (Image 6) */}
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.16, 14.0]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        {/* Luggage Bay Hatch Seams */}
        {[-3.6, -1.8, 0.0, 1.8].map((z, idx) => (
          <group key={idx} position={[-0.045, 0.34, z]}>
            <mesh>
              <boxGeometry args={[0.005, 0.44, 1.55]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Right Exterior Body Skirt */}
      <group position={[1.28, 0, 0.2]}>
        <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.76, 14.0]} />
          <primitive object={materials.coachBodyGold} attach="material" />
        </mesh>
        {/* Beltline Dark Mask Band */}
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.16, 14.0]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        {/* Front Passenger Boarding Door Frame on Right Side (Image 6) */}
        <group position={[0.045, 0.95, -4.6]}>
          <mesh>
            <boxGeometry args={[0.01, 1.65, 1.15]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 3. PANORAMIC WINDOWS & ROYAL BLUE CURTAINS (Picture 4)       */}
      {/* ============================================================ */}
      {/* Left Panoramic Window Glass */}
      <mesh position={[-1.24, 1.48, 0.2]} raycast={() => null}>
        <boxGeometry args={[0.02, 1.1, 12.6]} />
        <primitive object={materials.panoramicGlass} attach="material" />
      </mesh>

      {/* Right Panoramic Window Glass */}
      <mesh position={[1.24, 1.48, 0.2]} raycast={() => null}>
        <boxGeometry args={[0.02, 1.1, 12.6]} />
        <primitive object={materials.panoramicGlass} attach="material" />
      </mesh>

      {/* Structural Window Pillars on BOTH sides with Royal Blue Curtains (Picture 4) */}
      {[-4.6, -2.3, 0.0, 2.3, 4.6].map((z, idx) => (
        <React.Fragment key={idx}>
          {/* Left Pillar */}
          <group position={[-1.24, 1.48, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 1.12, 0.16]} />
              <primitive object={materials.coachDarkMask} attach="material" />
            </mesh>
            {/* Elegant Draped Royal Blue Window Curtain (Picture 4) */}
            <mesh position={[0.035, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.95, 0.14]} />
              <primitive object={materials.curtainMat} attach="material" />
            </mesh>
          </group>

          {/* Right Pillar */}
          <group position={[1.24, 1.48, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 1.12, 0.16]} />
              <primitive object={materials.coachDarkMask} attach="material" />
            </mesh>
            {/* Elegant Draped Royal Blue Window Curtain (Picture 4) */}
            <mesh position={[-0.035, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.95, 0.14]} />
              <primitive object={materials.curtainMat} attach="material" />
            </mesh>
          </group>
        </React.Fragment>
      ))}

      {/* 
        Sleek Aerodynamic Roof Side Rails (Cutaway Silhouette Framing, Image 6)
        NOTE: ROOF IS 100% UNCOVERED/OPEN — NO OBSTRUCTING BOX OVER BACK SEATS!
      */}
      <group position={[-1.25, 2.08, 0.2]}>
        <RoundedBox args={[0.08, 0.12, 14.2]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodyGold} attach="material" />
        </RoundedBox>
      </group>
      <group position={[1.25, 2.08, 0.2]}>
        <RoundedBox args={[0.08, 0.12, 14.2]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodyGold} attach="material" />
        </RoundedBox>
      </group>

      {/* ============================================================ */}
      {/* 4. REALISTIC 3-AXLE WHEELS (Image 6 Touring Coach)           */}
      {/* ============================================================ */}
      {[
        [-1.30, -0.05, -3.8],
        [1.30, -0.05, -3.8],
        [-1.30, -0.05, 3.6],
        [1.30, -0.05, 3.6],
        [-1.30, -0.05, 4.8],
        [1.30, -0.05, 4.8],
      ].map(([wx, wy, wz], wi) => (
        <group key={wi} position={[wx, wy, wz]}>
          {/* Wheel Arch Liner */}
          <mesh position={[wx > 0 ? -0.05 : 0.05, 0.15, 0]}>
            <boxGeometry args={[0.05, 0.65, 1.05]} />
            <primitive object={materials.interiorCharcoal} attach="material" />
          </mesh>
          {/* Deep Rubber Tire with Tread Profile */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.44, 0.44, 0.24, 24]} />
            <primitive object={materials.tireRubber} attach="material" />
          </mesh>
          {/* Diamond-cut Multi-spoke Alloy Rim (Image 6) */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.27, 0.27, 0.26, 16]} />
            <primitive object={materials.alloyRim} attach="material" />
          </mesh>
          {/* Chrome Central Hubcap */}
          <mesh position={[wx > 0 ? 0.14 : -0.14, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.09, 16]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ============================================================ */}
      {/* 5. SLEEK CHAMPAGNE FRONT COACH FASCIA (Image 6 Exact Match)  */}
      {/* ============================================================ */}
      <group position={[0, 0, -5.6]}>
        {/* Curved Aerodynamic Front Bumper & Chin (Image 6) */}
        <RoundedBox args={[2.54, 0.52, 0.8]} radius={0.18} smoothness={4} position={[0, 0.14, -0.92]} castShadow>
          <primitive object={materials.coachBodyGold} attach="material" />
        </RoundedBox>

        {/* Lower Central Dark Air Intake Grille (Image 6) */}
        <mesh position={[0, 0.06, -1.33]}>
          <boxGeometry args={[1.5, 0.22, 0.04]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>

        {/* Triple Round LED Projector Headlamp Clusters (Image 6) */}
        {/* Left Headlamp */}
        <group position={[-0.95, 0.24, -1.24]}>
          <RoundedBox args={[0.44, 0.16, 0.06]} radius={0.03} smoothness={3}>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {[-0.14, 0, 0.14].map((lx, li) => (
            <mesh key={li} position={[lx, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
              <primitive object={materials.headlightLens} attach="material" />
            </mesh>
          ))}
        </group>
        {/* Right Headlamp */}
        <group position={[0.95, 0.24, -1.24]}>
          <RoundedBox args={[0.44, 0.16, 0.06]} radius={0.03} smoothness={3}>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {[-0.14, 0, 0.14].map((lx, li) => (
            <mesh key={li} position={[lx, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
              <primitive object={materials.headlightLens} attach="material" />
            </mesh>
          ))}
        </group>

        {/* Circular Lower Fog Lamps (Image 6) */}
        <mesh position={[-0.92, -0.04, -1.30]}>
          <circleGeometry args={[0.05, 16]} />
          <primitive object={materials.fogLampLens} attach="material" />
        </mesh>
        <mesh position={[0.92, -0.04, -1.30]}>
          <circleGeometry args={[0.05, 16]} />
          <primitive object={materials.fogLampLens} attach="material" />
        </mesh>

        {/* Slanted Curved Panoramic Windshield with Dark Border (Image 6) */}
        <mesh position={[0, 1.18, -0.85]} rotation={[0.34, 0, 0]} raycast={() => null}>
          <planeGeometry args={[2.46, 1.75]} />
          <primitive object={materials.panoramicGlass} attach="material" />
        </mesh>

        {/* Dual Articulated Windshield Wipers (Image 6) */}
        <mesh position={[-0.45, 0.46, -1.05]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.interiorCharcoal} attach="material" />
        </mesh>
        <mesh position={[0.45, 0.46, -1.05]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.interiorCharcoal} attach="material" />
        </mesh>

        {/* Upper Windshield Crown Visor & LED Destination Route Display (Image 6) */}
        <group position={[0, 2.05, -0.6]}>
          <RoundedBox args={[2.52, 0.36, 0.5]} radius={0.08} smoothness={3} castShadow>
            <primitive object={materials.coachBodyGold} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.02, -0.26]} rotation={[0.22, 0, 0]}>
            <planeGeometry args={[1.9, 0.18]} />
            <meshStandardMaterial color="#0B132B" emissive="#0284C7" emissiveIntensity={0.4} />
          </mesh>
        </group>

        {/* 
          High-Mounted Aerodynamic Wing Mirrors in Champagne Body Color (Image 6)
        */}
        <group position={[-1.42, 1.62, -0.6]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.48, 12]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
          <RoundedBox args={[0.12, 0.42, 0.18]} radius={0.03} smoothness={3} position={[-0.08, 0.16, -0.08]} castShadow>
            <primitive object={materials.coachBodyGold} attach="material" />
          </RoundedBox>
          <mesh position={[-0.02, 0.16, -0.08]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.16, 0.38]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
        <group position={[1.42, 1.62, -0.6]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.48, 12]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
          <RoundedBox args={[0.12, 0.42, 0.18]} radius={0.03} smoothness={3} position={[0.08, 0.16, -0.08]} castShadow>
            <primitive object={materials.coachBodyGold} attach="material" />
          </RoundedBox>
          <mesh position={[0.02, 0.16, -0.08]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.16, 0.38]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>

        {/* 
          DRIVER COCKPIT & DASHBOARD (Picture 5 Reference)
        */}
        <group position={[-0.45, 0.62, -0.2]}>
          <RoundedBox args={[1.35, 0.46, 0.78]} radius={0.05} smoothness={4} castShadow>
            <primitive object={materials.interiorCharcoal} attach="material" />
          </RoundedBox>

          {/* Warm Walnut Instrument Cluster & Telemetry (Picture 5) */}
          <mesh position={[0, 0.24, 0.05]} rotation={[-0.35, 0, 0]}>
            <planeGeometry args={[0.82, 0.28]} />
            <meshStandardMaterial map={dashTexture} roughness={0.25} metalness={0.1} />
          </mesh>

          {/* 3-Spoke Bus Steering Wheel & Column (Picture 5) */}
          <group position={[0, 0.32, 0.24]} rotation={[0.55, 0, 0]}>
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.035, 0.045, 0.3, 16]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            <mesh castShadow>
              <torusGeometry args={[0.20, 0.02, 16, 32]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.065, 0.065, 0.035, 20]} />
              <primitive object={materials.chromeTrim} attach="material" />
            </mesh>
          </group>

          {/* Floor-mounted Gear Shift Lever with Wood/Amber Knob (Picture 5) */}
          <group position={[0.32, -0.12, 0.35]}>
            <mesh>
              <cylinderGeometry args={[0.012, 0.014, 0.24, 12]} />
              <primitive object={materials.chromeTrim} attach="material" />
            </mesh>
            <mesh position={[0, 0.13, 0]}>
              <sphereGeometry args={[0.028, 16, 16]} />
              <meshStandardMaterial color="#854D27" roughness={0.3} metalness={0.2} />
            </mesh>
          </group>

          {/* Safety Yellow Grab Rails (Picture 4 & 5) */}
          <mesh position={[0.62, 0.35, 0.25]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 1.1, 16]} />
            <primitive object={materials.safetyYellowRail} attach="material" />
          </mesh>

          {/* Forward-Facing Driver Suspension Seat */}
          <group position={[0, -0.14, 0.62]}>
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.12, 0.22, 16]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            <RoundedBox args={[0.52, 0.12, 0.50]} radius={0.03} smoothness={3} position={[0, 0.22, -0.05]} castShadow>
              <primitive object={materials.interiorCharcoal} attach="material" />
            </RoundedBox>
            <RoundedBox args={[0.48, 0.68, 0.10]} radius={0.03} smoothness={3} position={[0, 0.62, 0.20]} rotation={[0.12, 0, 0]} castShadow>
              <primitive object={materials.interiorCharcoal} attach="material" />
            </RoundedBox>
            <RoundedBox args={[0.28, 0.16, 0.08]} radius={0.03} smoothness={3} position={[0, 1.02, 0.18]} castShadow>
              <primitive object={materials.interiorCharcoal} attach="material" />
            </RoundedBox>
          </group>
        </group>

        {/* Boarding Steps with Safety Yellow Nosing (Picture 4) */}
        <group position={[0.82, -0.08, 0.2]}>
          <mesh receiveShadow>
            <boxGeometry args={[0.72, 0.1, 0.42]} />
            <primitive object={materials.interiorCharcoal} attach="material" />
          </mesh>
          <mesh position={[0, 0.052, 0.20]}>
            <boxGeometry args={[0.72, 0.008, 0.02]} />
            <primitive object={materials.safetyYellowRail} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 6. SCULPTED REAR TOURING COACH TAIL (Image 6 Aerodynamic)    */}
      {/* ============================================================ */}
      <group position={[0, 0.95, 6.25]}>
        {/* Sculpted Rear Cap with Rounded Aerodynamic Corners (Image 6) */}
        <RoundedBox args={[2.54, 2.05, 0.42]} radius={0.16} smoothness={4} castShadow receiveShadow>
          <primitive object={materials.coachBodyGold} attach="material" />
        </RoundedBox>

        {/* Lower Rear Bumper with Twin Chrome Exhaust Diffusers */}
        <group position={[0, -0.85, 0.22]}>
          <RoundedBox args={[2.56, 0.36, 0.25]} radius={0.08} smoothness={3} castShadow>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          <mesh position={[-0.82, -0.05, 0.13]}>
            <boxGeometry args={[0.26, 0.07, 0.04]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
          <mesh position={[0.82, -0.05, 0.13]}>
            <boxGeometry args={[0.26, 0.07, 0.04]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
          {/* Illuminated License Plate */}
          <mesh position={[0, 0.02, 0.14]}>
            <boxGeometry args={[0.55, 0.16, 0.02]} />
            <meshStandardMaterial color="#0B132B" />
          </mesh>
        </group>

        {/* Vertical LED Tail Light Assemblies (Image 6) */}
        <group position={[-1.12, 0.12, 0.22]}>
          <RoundedBox args={[0.14, 1.05, 0.05]} radius={0.03} smoothness={3}>
            <primitive object={materials.taillightLens} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.28, 0.028]}>
            <boxGeometry args={[0.11, 0.14, 0.02]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.7} />
          </mesh>
        </group>
        <group position={[1.12, 0.12, 0.22]}>
          <RoundedBox args={[0.14, 1.05, 0.05]} radius={0.03} smoothness={3}>
            <primitive object={materials.taillightLens} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.28, 0.028]}>
            <boxGeometry args={[0.11, 0.14, 0.02]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.7} />
          </mesh>
        </group>

        {/* Rear Privacy Tinted Window (Picture 4) */}
        <mesh position={[0, 0.35, 0.22]} raycast={() => null}>
          <planeGeometry args={[1.8, 0.85]} />
          <primitive object={materials.panoramicGlass} attach="material" />
        </mesh>

        {/* Aerodynamic High-Mount Rear Roof Spoiler & Third Brake Light (Image 6) */}
        <group position={[0, 1.05, 0.06]}>
          <RoundedBox args={[2.52, 0.14, 0.40]} radius={0.03} smoothness={3} castShadow>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          <mesh position={[0, 0.02, 0.21]}>
            <boxGeometry args={[0.9, 0.035, 0.02]} />
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

        {/* Warm Golden Rim Light for Coach Body Silhouette (Image 6) */}
        <directionalLight position={[0, 6, -14]} intensity={0.8} color="#FEF08A" />

        {/* Realistic Champagne Gold Luxury Touring Coach Model (Image 6) */}
        <ChampagneLuxuryCoachModel isZoomed={isZoomed} />

        {/* 
          All 28 Forward-Facing Passenger Seats (100% Unobstructed and Fully Interactive) 
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
