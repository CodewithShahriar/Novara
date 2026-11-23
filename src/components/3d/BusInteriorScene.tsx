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

// Elevated 3/4 cutaway camera position: full luxury coach visible from front to rear
const OVERVIEW_CAMERA_POS = { x: 5.2, y: 7.2, z: 8.8 };
const OVERVIEW_TARGET = { x: 0, y: 0.35, z: 0.2 };

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

// Fully Integrated, Photorealistic Luxury Touring Coach Model (Volvo 9900 / Scania Touring Inspired)
function LuxuryTouringCoachModel({ isZoomed }: { isZoomed: boolean }) {
  const carpetFloorTexture = useMemo(() => getWoodFloorTexture(), []);
  const aisleRunnerTexture = useMemo(() => getAisleCarpetTexture(), []);
  const dashTexture = useMemo(() => getDashboardClusterTexture(), []);
  const curtainTexture = useMemo(() => getCurtainTexture(), []);
  const shadowTexture = useMemo(() => getRadialShadowTexture(), []);

  // Automotive materials with high visual fidelity and metallic luster
  const materials = useMemo(() => {
    // Rich Champagne / Gold Metallic Coach Body Paint (Image 6)
    const coachBodyGold = new THREE.MeshStandardMaterial({
      color: '#C8AB73',
      roughness: 0.22,
      metalness: 0.38,
    });

    // Dark Gloss Trim & Window Surround
    const coachDarkMask = new THREE.MeshStandardMaterial({
      color: '#1A202C',
      roughness: 0.3,
      metalness: 0.4,
    });

    // Polished Mirror Chrome
    const chromeTrim = new THREE.MeshStandardMaterial({
      color: '#F8FAFC',
      roughness: 0.1,
      metalness: 0.95,
    });

    // High-transparency Solar Tinted Panoramic Window Glass (Visible from both sides!)
    const panoramicGlass = new THREE.MeshPhysicalMaterial({
      color: '#0F172A',
      transparent: true,
      opacity: isZoomed ? 0.15 : 0.30,
      roughness: 0.05,
      metalness: 0.15,
      transmission: 0.85,
      ior: 1.45,
      side: THREE.DoubleSide,
    });

    // Windshield Glass with Realistic Tint & Reflection
    const windshieldGlass = new THREE.MeshPhysicalMaterial({
      color: '#182438',
      transparent: true,
      opacity: 0.45,
      roughness: 0.08,
      metalness: 0.2,
      transmission: 0.75,
      ior: 1.48,
      side: THREE.DoubleSide,
    });

    // Draped Royal Blue Window Curtains (Picture 4)
    const curtainMat = new THREE.MeshStandardMaterial({
      map: curtainTexture,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // Triple LED Projector Headlights
    const headlightLens = new THREE.MeshStandardMaterial({
      color: '#FFFDF0',
      emissive: '#FEF08A',
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.2,
    });

    // Ruby Red LED Taillights
    const taillightLens = new THREE.MeshStandardMaterial({
      color: '#DC2626',
      emissive: '#991B1B',
      emissiveIntensity: 0.85,
      roughness: 0.2,
    });

    // Circular Fog Lamps
    const fogLampLens = new THREE.MeshStandardMaterial({
      color: '#FEF08A',
      emissive: '#F59E0B',
      emissiveIntensity: 0.8,
      roughness: 0.15,
    });

    // High-visibility Safety Yellow Rails
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

    // Diamond-cut Multi-spoke Alloy Wheels
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
      windshieldGlass,
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
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.5, 14.5]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={0.65} depthWrite={false} />
      </mesh>

      {/* ============================================================ */}
      {/* 1. CABIN FLOORING & AISLE                                    */}
      {/* ============================================================ */}
      {/* 
        Unified Z range: from Z = -4.8 (front cockpit partition) to Z = +5.4 (rear bulkhead)
        Total interior floor length: 10.2m, centered at Z = 0.3
      */}
      {/* Left Raised Platform with Charcoal Transit Carpet */}
      <mesh position={[-0.73, 0.04, 0.3]} receiveShadow>
        <boxGeometry args={[0.98, 0.12, 10.2]} />
        <meshStandardMaterial map={carpetFloorTexture} roughness={0.7} metalness={0.08} />
      </mesh>

      {/* Right Raised Platform with Charcoal Transit Carpet */}
      <mesh position={[0.73, 0.04, 0.3]} receiveShadow>
        <boxGeometry args={[0.98, 0.12, 10.2]} />
        <meshStandardMaterial map={carpetFloorTexture} roughness={0.7} metalness={0.08} />
      </mesh>

      {/* Center Sunken Aisle with Diamond-Plate Aluminum Tread & Yellow Safety Borders */}
      <mesh position={[0, 0.015, 0.3]} receiveShadow>
        <boxGeometry args={[0.48, 0.07, 10.2]} />
        <meshStandardMaterial map={aisleRunnerTexture} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Chassis Base Plate */}
      <mesh position={[0, -0.06, 0.0]} receiveShadow>
        <boxGeometry args={[2.50, 0.12, 11.2]} />
        <primitive object={materials.interiorCharcoal} attach="material" />
      </mesh>

      {/* ============================================================ */}
      {/* 2. EXTERIOR LOWER BODY SIDE PANELS (Spans from Z = -5.5 to +5.5) */}
      {/* ============================================================ */}
      {/* Left Exterior Side Body Panel */}
      <group position={[-1.25, 0, 0.0]}>
        {/* Main Champagne Gold Lower Skirt */}
        <mesh position={[0, 0.38, 0.0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.76, 11.0]} />
          <primitive object={materials.coachBodyGold} attach="material" />
        </mesh>
        {/* Black Beltline Graphic Trim */}
        <mesh position={[0, 0.82, 0.0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.14, 11.0]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        {/* Luggage Bay Hatch Seams */}
        {[-3.0, -1.5, 0.0, 1.5, 3.0].map((z, idx) => (
          <group key={idx} position={[-0.045, 0.34, z]}>
            <mesh>
              <boxGeometry args={[0.005, 0.44, 1.35]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Right Exterior Side Body Panel */}
      <group position={[1.25, 0, 0.0]}>
        {/* Main Champagne Gold Lower Skirt */}
        <mesh position={[0, 0.38, 0.0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.76, 11.0]} />
          <primitive object={materials.coachBodyGold} attach="material" />
        </mesh>
        {/* Black Beltline Graphic Trim */}
        <mesh position={[0, 0.82, 0.0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.14, 11.0]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        {/* Front Passenger Boarding Door Outline on Right Side */}
        <group position={[0.045, 0.92, -4.2]}>
          <mesh>
            <boxGeometry args={[0.01, 1.60, 1.05]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 3. PANORAMIC SIDE WINDOWS & DRAPED CURTAINS                  */}
      {/* ============================================================ */}
      {/* Left Panoramic Window Glass */}
      <mesh position={[-1.23, 1.48, 0.1]} raycast={() => null}>
        <boxGeometry args={[0.02, 1.10, 10.4]} />
        <primitive object={materials.panoramicGlass} attach="material" />
      </mesh>

      {/* Right Panoramic Window Glass */}
      <mesh position={[1.23, 1.48, 0.1]} raycast={() => null}>
        <boxGeometry args={[0.02, 1.10, 10.4]} />
        <primitive object={materials.panoramicGlass} attach="material" />
      </mesh>

      {/* Structural Window Pillars on Both Sides with Royal Blue Curtains (Picture 4) */}
      {[-3.8, -1.9, 0.0, 1.9, 3.8].map((z, idx) => (
        <React.Fragment key={idx}>
          {/* Left Pillar & Curtain */}
          <group position={[-1.23, 1.48, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 1.12, 0.14]} />
              <primitive object={materials.coachDarkMask} attach="material" />
            </mesh>
            <mesh position={[0.035, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.95, 0.14]} />
              <primitive object={materials.curtainMat} attach="material" />
            </mesh>
          </group>

          {/* Right Pillar & Curtain */}
          <group position={[1.23, 1.48, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 1.12, 0.14]} />
              <primitive object={materials.coachDarkMask} attach="material" />
            </mesh>
            <mesh position={[-0.035, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.95, 0.14]} />
              <primitive object={materials.curtainMat} attach="material" />
            </mesh>
          </group>
        </React.Fragment>
      ))}

      {/* 
        Sleek Aerodynamic Roof Side Rails (Cutaway Silhouette Framing, Image 6)
        Spans EXACTLY from Front Crown (Z = -4.5) to Rear Bulkhead (Z = +5.5).
        Length = 10.0m, Centered at Z = 0.5.
        ZERO OVERHANGING POLES! Seamlessly connects front to back!
      */}
      <group position={[-1.24, 2.12, 0.5]}>
        <RoundedBox args={[0.08, 0.14, 10.0]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodyGold} attach="material" />
        </RoundedBox>
      </group>
      <group position={[1.24, 2.12, 0.5]}>
        <RoundedBox args={[0.08, 0.14, 10.0]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodyGold} attach="material" />
        </RoundedBox>
      </group>

      {/* ============================================================ */}
      {/* 4. REALISTIC 3-AXLE WHEELS                                   */}
      {/* ============================================================ */}
      {[
        [-1.26, -0.05, -3.6],
        [1.26, -0.05, -3.6],
        [-1.26, -0.05, 3.4],
        [1.26, -0.05, 3.4],
        [-1.26, -0.05, 4.6],
        [1.26, -0.05, 4.6],
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
          {/* Multi-spoke Diamond-cut Alloy Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.27, 0.27, 0.24, 16]} />
            <primitive object={materials.alloyRim} attach="material" />
          </mesh>
          {/* Chrome Central Hubcap */}
          <mesh position={[wx > 0 ? 0.13 : -0.13, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.09, 16]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ============================================================ */}
      {/* 5. AUTHENTIC FRONT COACH FASCIA & COCKPIT (Image 6 Coach)    */}
      {/* ============================================================ */}
      {/* Front end connects seamlessly from Z = -4.5 to Z = -5.5 */}
      <group position={[0, 0, -4.5]}>
        {/* Front Left and Right A-Pillars sweeping down from roof to bumper */}
        <mesh position={[-1.22, 1.48, -0.45]} rotation={[-0.32, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.45, 0.08]} />
          <primitive object={materials.coachBodyGold} attach="material" />
        </mesh>
        <mesh position={[1.22, 1.48, -0.45]} rotation={[-0.32, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.45, 0.08]} />
          <primitive object={materials.coachBodyGold} attach="material" />
        </mesh>

        {/* Front Hood / Dash Cowl Deck (Sloping up from bumper to base of glass) */}
        <mesh position={[0, 0.82, -0.80]} rotation={[-0.22, 0, 0]} castShadow>
          <boxGeometry args={[2.46, 0.06, 0.55]} />
          <primitive object={materials.coachBodyGold} attach="material" />
        </mesh>

        {/* Sculpted Curved Aerodynamic Front Bumper (Image 6) */}
        <RoundedBox args={[2.50, 0.72, 0.55]} radius={0.16} smoothness={4} position={[0, 0.38, -1.02]} castShadow receiveShadow>
          <primitive object={materials.coachBodyGold} attach="material" />
        </RoundedBox>

        {/* Recessed Dark Horizontal Air Intake Grille (Image 6) */}
        <mesh position={[0, 0.18, -1.31]}>
          <boxGeometry args={[1.5, 0.22, 0.02]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>

        {/* Novara Chrome Emblem & Horizontal Grille Line */}
        <mesh position={[0, 0.44, -1.31]}>
          <boxGeometry args={[1.2, 0.02, 0.02]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>
        <mesh position={[0, 0.44, -1.30]}>
          <circleGeometry args={[0.08, 20]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>

        {/* Swept-Back Triple Projector LED Headlamps (Image 6) */}
        {/* Left Headlamp */}
        <group position={[-0.92, 0.44, -1.26]}>
          <RoundedBox args={[0.42, 0.16, 0.04]} radius={0.03} smoothness={3}>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {[-0.13, 0, 0.13].map((lx, li) => (
            <mesh key={li} position={[lx, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.042, 0.042, 0.02, 16]} />
              <primitive object={materials.headlightLens} attach="material" />
            </mesh>
          ))}
        </group>

        {/* Right Headlamp */}
        <group position={[0.92, 0.44, -1.26]}>
          <RoundedBox args={[0.42, 0.16, 0.04]} radius={0.03} smoothness={3}>
            <primitive object={materials.coachDarkMask} attach="material" />
          </RoundedBox>
          {[-0.13, 0, 0.13].map((lx, li) => (
            <mesh key={li} position={[lx, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.042, 0.042, 0.02, 16]} />
              <primitive object={materials.headlightLens} attach="material" />
            </mesh>
          ))}
        </group>

        {/* Lower Circular Fog Lamps in Chrome Bezels (Image 6) */}
        <mesh position={[-0.88, 0.14, -1.31]}>
          <circleGeometry args={[0.05, 16]} />
          <primitive object={materials.fogLampLens} attach="material" />
        </mesh>
        <mesh position={[0.88, 0.14, -1.31]}>
          <circleGeometry args={[0.05, 16]} />
          <primitive object={materials.fogLampLens} attach="material" />
        </mesh>

        {/* 
          Large Sweeping Aerodynamic Panoramic Windshield (Image 6)
          Visible from both front & inside with realistic tint & dual wipers!
        */}
        <mesh position={[0, 1.55, -0.45]} rotation={[-0.32, 0, 0]} raycast={() => null}>
          <planeGeometry args={[2.42, 1.50]} />
          <primitive object={materials.windshieldGlass} attach="material" />
        </mesh>

        {/* Windshield Dual Articulated Wipers (Image 6) */}
        <mesh position={[-0.42, 0.92, -0.68]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>
        <mesh position={[0.42, 0.92, -0.68]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.coachDarkMask} attach="material" />
        </mesh>

        {/* Aerodynamic Front Roof Crown & Destination Matrix Sign (Image 6) */}
        <group position={[0, 2.12, 0.0]}>
          <RoundedBox args={[2.50, 0.20, 0.38]} radius={0.06} smoothness={3} castShadow>
            <primitive object={materials.coachBodyGold} attach="material" />
          </RoundedBox>
          <mesh position={[0, 0, -0.20]} rotation={[0.15, 0, 0]}>
            <planeGeometry args={[1.8, 0.12]} />
            <meshStandardMaterial color="#0B132B" emissive="#0284C7" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Streamlined "Elephant-Ear" Wing Mirrors (Image 6) */}
        <group position={[-1.38, 1.75, -0.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.45, 12]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
          <RoundedBox args={[0.12, 0.38, 0.16]} radius={0.03} smoothness={3} position={[-0.06, 0.14, -0.06]} castShadow>
            <primitive object={materials.coachBodyGold} attach="material" />
          </RoundedBox>
          <mesh position={[-0.01, 0.14, -0.06]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.14, 0.34]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
        <group position={[1.38, 1.75, -0.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.45, 12]} />
            <primitive object={materials.coachDarkMask} attach="material" />
          </mesh>
          <RoundedBox args={[0.12, 0.38, 0.16]} radius={0.03} smoothness={3} position={[0.06, 0.14, -0.06]} castShadow>
            <primitive object={materials.coachBodyGold} attach="material" />
          </RoundedBox>
          <mesh position={[0.01, 0.14, -0.06]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.14, 0.34]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>

        {/* 
          DRIVER COCKPIT CONSOLE (Picture 5 Reference)
          Cleanly nested behind the front cowl inside the cabin!
        */}
        <group position={[-0.45, 0.65, 0.15]}>
          <RoundedBox args={[1.25, 0.42, 0.65]} radius={0.04} smoothness={3} castShadow>
            <primitive object={materials.interiorCharcoal} attach="material" />
          </RoundedBox>

          {/* Warm Walnut Instrument Cluster & Telemetry (Picture 5) */}
          <mesh position={[0, 0.22, 0.02]} rotation={[-0.35, 0, 0]}>
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

          {/* Safety Yellow Grab Rails (Picture 4 & 5) */}
          <mesh position={[0.58, 0.35, 0.20]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 1.05, 16]} />
            <primitive object={materials.safetyYellowRail} attach="material" />
          </mesh>

          {/* Forward-Facing Driver Suspension Seat */}
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

        {/* Boarding Steps at Front Entrance with Safety Yellow Nosing (Picture 4) */}
        <group position={[0.78, -0.08, 0.15]}>
          <mesh receiveShadow>
            <boxGeometry args={[0.70, 0.10, 0.40]} />
            <primitive object={materials.interiorCharcoal} attach="material" />
          </mesh>
          <mesh position={[0, 0.052, 0.19]}>
            <boxGeometry args={[0.70, 0.008, 0.02]} />
            <primitive object={materials.safetyYellowRail} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 6. COHESIVE, FLUSH REAR BULKHEAD & TAIL (Z = +5.50)           */}
      {/* ============================================================ */}
      {/* 
        Caps the rear of the bus COMPLETELY flush with side skirts and roof rails!
        ZERO overhanging rails! ZERO open flatbed gap!
      */}
      <group position={[0, 0.95, 5.50]}>
        {/* Full-width Rear Curved Body Cap (Wraps flush into side skirts!) */}
        <RoundedBox args={[2.50, 2.10, 0.35]} radius={0.12} smoothness={4} castShadow receiveShadow>
          <primitive object={materials.coachBodyGold} attach="material" />
        </RoundedBox>

        {/* Lower Rear Bumper with Twin Chrome Exhaust Diffusers */}
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

        {/* Flush Vertical LED Tail Light Assemblies on Left & Right Corners (Image 6) */}
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

        {/* Large Rear Privacy Tinted Window (Picture 4) */}
        <mesh position={[0, 0.38, 0.18]} raycast={() => null}>
          <planeGeometry args={[1.85, 0.85]} />
          <primitive object={materials.panoramicGlass} attach="material" />
        </mesh>

        {/* Aerodynamic Integrated Rear Roof Spoiler & Third Brake Light (Seamlessly caps roof rails!) */}
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
