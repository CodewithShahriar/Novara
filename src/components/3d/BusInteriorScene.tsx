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
const OVERVIEW_CAMERA_POS = { x: 4.5, y: 6.8, z: 8.2 };
const OVERVIEW_TARGET = { x: 0, y: 0.2, z: 0.2 };

// Camera controller with smooth GSAP transitions
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
      // Smooth cinematic zoom toward the clicked passenger seat
      const [sx, sy, sz] = activeFocusedSeat.position;

      const targetCameraPos = {
        x: sx > 0 ? sx + 0.48 : sx - 0.48,
        y: sy + 0.52,
        z: sz - 0.75, // Positioned in front of the forward-facing seat looking back
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
      minDistance={1.0}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={0.12}
    />
  );
}

// Photorealistic Volvo 9900 Luxury Touring Coach Model
function Volvo9900LuxuryCoachModel() {
  const carpetFloorTexture = useMemo(() => getWoodFloorTexture(), []);
  const aisleRunnerTexture = useMemo(() => getAisleCarpetTexture(), []);
  const dashTexture = useMemo(() => getDashboardClusterTexture(), []);
  const curtainTexture = useMemo(() => getCurtainTexture(), []);
  const shadowTexture = useMemo(() => getRadialShadowTexture(), []);

  // Premium automotive coach materials (Matching Volvo 9900 in Reference Picture 1 & 2)
  const materials = useMemo(() => {
    // Ice Metallic Sky Blue Body Paint (Volvo 9900 hero color, Picture 1)
    const coachBodyPaint = new THREE.MeshStandardMaterial({
      color: '#9BB8CD', // Elegant Volvo Ice Sky Blue metallic
      roughness: 0.18,
      metalness: 0.42,
    });

    // Deep Obsidian Black Glass Band & Mask (Picture 1)
    const coachBlackMask = new THREE.MeshStandardMaterial({
      color: '#111827',
      roughness: 0.2,
      metalness: 0.6,
    });

    // Polished Mirror Chrome Accents
    const chromeTrim = new THREE.MeshStandardMaterial({
      color: '#F8FAFC',
      roughness: 0.1,
      metalness: 0.95,
    });

    // High-transparency Solar Tinted Panoramic Window Glass (Picture 1)
    const panoramicGlass = new THREE.MeshPhysicalMaterial({
      color: '#0F172A',
      transparent: true,
      opacity: 0.26,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.45,
    });

    // Pleated Royal Blue Window Curtains (Picture 4)
    const curtainMat = new THREE.MeshStandardMaterial({
      map: curtainTexture,
      roughness: 0.7,
      metalness: 0.05,
    });

    // Signature V-shaped LED Headlight Projectors & DRLs (Picture 1)
    const headlightLens = new THREE.MeshStandardMaterial({
      color: '#F0F9FF',
      emissive: '#BAE6FD',
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.3,
    });

    // Ruby Red LED Taillights (Picture 1 & 2)
    const taillightLens = new THREE.MeshStandardMaterial({
      color: '#DC2626',
      emissive: '#991B1B',
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });

    // High-visibility Safety Yellow Grab Rails (Picture 4 & 5)
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

    // Diamond-cut Multi-spoke Alloy Wheels (Picture 1)
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
      coachBodyPaint,
      coachBlackMask,
      chromeTrim,
      panoramicGlass,
      curtainMat,
      headlightLens,
      taillightLens,
      safetyYellowRail,
      tireRubber,
      alloyRim,
      interiorCharcoal,
    };
  }, [curtainTexture]);

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
      {/* 
        Width of coach is 2.55m (interior half-width 1.22m).
        Left platform: x from -1.22 to -0.24 (width 0.98m, center -0.73).
        Seats A (-0.92) and B (-0.38) fit with Seat A right against window wall!
      */}
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
      {/* 2. EXTERIOR LOWER BODY PANELS & SKIRTING (BOTH SIDES)        */}
      {/* ============================================================ */}
      {/* Left Exterior Body Skirt (Volvo Ice Blue & Lower Grey Panel) */}
      <group position={[-1.28, 0, 0.2]}>
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.72, 14.0]} />
          <primitive object={materials.coachBodyPaint} attach="material" />
        </mesh>
        {/* Beltline Black Graphic Band (Picture 1) */}
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.22, 14.0]} />
          <primitive object={materials.coachBlackMask} attach="material" />
        </mesh>
        {/* Chrome Dynamic Accent Line */}
        <mesh position={[-0.045, 0.71, 0]}>
          <boxGeometry args={[0.01, 0.02, 14.0]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>
        {/* Luggage Bay Hatch Seams */}
        {[-3.6, -1.8, 0.0, 1.8].map((z, idx) => (
          <group key={idx} position={[-0.045, 0.32, z]}>
            <mesh>
              <boxGeometry args={[0.005, 0.44, 1.55]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Right Exterior Body Skirt (Volvo Ice Blue & Lower Grey Panel) */}
      <group position={[1.28, 0, 0.2]}>
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.72, 14.0]} />
          <primitive object={materials.coachBodyPaint} attach="material" />
        </mesh>
        {/* Beltline Black Graphic Band */}
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.22, 14.0]} />
          <primitive object={materials.coachBlackMask} attach="material" />
        </mesh>
        {/* Chrome Dynamic Accent Line */}
        <mesh position={[0.045, 0.71, 0]}>
          <boxGeometry args={[0.01, 0.02, 14.0]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>
        {/* Front Passenger Boarding Door Frame on Right Side (Picture 1 & 4) */}
        <group position={[0.045, 0.95, -4.6]}>
          <mesh>
            <boxGeometry args={[0.01, 1.65, 1.15]} />
            <primitive object={materials.coachBlackMask} attach="material" />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 3. PANORAMIC WINDOWS & ROYAL BLUE CURTAINS (Picture 4)       */}
      {/* ============================================================ */}
      {/* 
        raycast: () => null ensures pointer events pass straight through 
        the glass directly to the passenger seats!
      */}
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
              <primitive object={materials.coachBlackMask} attach="material" />
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
              <primitive object={materials.coachBlackMask} attach="material" />
            </mesh>
            {/* Elegant Draped Royal Blue Window Curtain (Picture 4) */}
            <mesh position={[-0.035, 0, 0]} castShadow>
              <boxGeometry args={[0.03, 0.95, 0.14]} />
              <primitive object={materials.curtainMat} attach="material" />
            </mesh>
          </group>
        </React.Fragment>
      ))}

      {/* Aerodynamic Roof Side Rails (Cutaway Silhouette Framing, Picture 1 & 2) */}
      <group position={[-1.25, 2.08, 0.2]}>
        <RoundedBox args={[0.08, 0.12, 14.2]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodyPaint} attach="material" />
        </RoundedBox>
      </group>
      <group position={[1.25, 2.08, 0.2]}>
        <RoundedBox args={[0.08, 0.12, 14.2]} radius={0.02} smoothness={3} castShadow>
          <primitive object={materials.coachBodyPaint} attach="material" />
        </RoundedBox>
      </group>

      {/* 
        Rooftop AC Condenser Unit Pod with Cooling Louvers (Picture 2 CAD Reference)
        Mounted gracefully at the rear roof section without obstructing the cabin!
      */}
      <group position={[0, 2.15, 2.8]}>
        <RoundedBox args={[1.8, 0.16, 2.6]} radius={0.06} smoothness={3} castShadow>
          <primitive object={materials.coachBodyPaint} attach="material" />
        </RoundedBox>
        {/* AC Ventilation Grilles */}
        {[-0.6, 0, 0.6].map((gz, gi) => (
          <mesh key={gi} position={[0, 0.085, gz]}>
            <boxGeometry args={[1.4, 0.01, 0.26]} />
            <primitive object={materials.coachBlackMask} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ============================================================ */}
      {/* 4. REALISTIC 3-AXLE COACH WHEELS (Picture 1 Volvo 9900)       */}
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
          {/* Wheel Arch Fender Liner */}
          <mesh position={[wx > 0 ? -0.05 : 0.05, 0.15, 0]}>
            <boxGeometry args={[0.05, 0.65, 1.05]} />
            <primitive object={materials.interiorCharcoal} attach="material" />
          </mesh>
          {/* Deep Rubber Tire with Tread Profile */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.44, 0.44, 0.24, 24]} />
            <primitive object={materials.tireRubber} attach="material" />
          </mesh>
          {/* Diamond-cut Multi-spoke Alloy Rim (Picture 1) */}
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
      {/* 5. VOLVO 9900 FRONT COACH FACE & DRIVER COCKPIT (Picture 1 & 5) */}
      {/* ============================================================ */}
      <group position={[0, 0, -5.6]}>
        {/* Sculpted Aerodynamic Front Bumper with Lower Air Dam (Picture 1) */}
        <RoundedBox args={[2.54, 0.48, 0.65]} radius={0.12} smoothness={3} position={[0, 0.12, -0.9]} castShadow>
          <primitive object={materials.coachBodyPaint} attach="material" />
        </RoundedBox>

        {/* Lower Gloss Black Grille & Air Intakes */}
        <mesh position={[0, 0.05, -1.23]}>
          <boxGeometry args={[1.8, 0.24, 0.04]} />
          <primitive object={materials.coachBlackMask} attach="material" />
        </mesh>

        {/* Dynamic V-shaped Chrome Slash & Novara Coach Emblem (Picture 1 Volvo iron mark) */}
        <mesh position={[0, 0.22, -1.22]}>
          <boxGeometry args={[1.5, 0.025, 0.02]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>
        <mesh position={[0, 0.22, -1.21]}>
          <circleGeometry args={[0.09, 20]} />
          <primitive object={materials.chromeTrim} attach="material" />
        </mesh>

        {/* Modern Angled LED Headlights with Signature Boomerang DRLs (Picture 1) */}
        <group position={[-0.98, 0.25, -1.18]}>
          <RoundedBox args={[0.42, 0.16, 0.08]} radius={0.03} smoothness={3}>
            <primitive object={materials.headlightLens} attach="material" />
          </RoundedBox>
        </group>
        <group position={[0.98, 0.25, -1.18]}>
          <RoundedBox args={[0.42, 0.16, 0.08]} radius={0.03} smoothness={3}>
            <primitive object={materials.headlightLens} attach="material" />
          </RoundedBox>
        </group>

        {/* Slanted Curved Panoramic Windshield with Dark Ceramic Border */}
        <mesh position={[0, 1.15, -0.85]} rotation={[0.32, 0, 0]} raycast={() => null}>
          <planeGeometry args={[2.46, 1.7]} />
          <primitive object={materials.panoramicGlass} attach="material" />
        </mesh>

        {/* Dual Articulated Windshield Wipers */}
        <mesh position={[-0.45, 0.46, -1.02]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.interiorCharcoal} attach="material" />
        </mesh>
        <mesh position={[0.45, 0.46, -1.02]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.55, 0.018, 0.015]} />
          <primitive object={materials.interiorCharcoal} attach="material" />
        </mesh>

        {/* Upper Windshield Crown Visor & LED Destination Route Display (Picture 1) */}
        <group position={[0, 2.05, -0.6]}>
          <RoundedBox args={[2.52, 0.36, 0.5]} radius={0.08} smoothness={3} castShadow>
            <primitive object={materials.coachBodyPaint} attach="material" />
          </RoundedBox>
          {/* Destination Matrix Sign */}
          <mesh position={[0, -0.02, -0.26]} rotation={[0.22, 0, 0]}>
            <planeGeometry args={[1.9, 0.18]} />
            <meshStandardMaterial color="#0B132B" emissive="#0284C7" emissiveIntensity={0.4} />
          </mesh>
        </group>

        {/* 
          High-Mounted Aerodynamic Wing Mirrors ("Elephant-Ear" Mirrors, Picture 1)
          Curving down gracefully from the roofline on both sides!
        */}
        <group position={[-1.42, 1.62, -0.6]}>
          {/* Curved Stalk */}
          <mesh castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.48, 12]} />
            <primitive object={materials.coachBlackMask} attach="material" />
          </mesh>
          <RoundedBox args={[0.12, 0.42, 0.18]} radius={0.03} smoothness={3} position={[-0.08, 0.16, -0.08]} castShadow>
            <primitive object={materials.coachBodyPaint} attach="material" />
          </RoundedBox>
          {/* Mirror Glass Surface */}
          <mesh position={[-0.02, 0.16, -0.08]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.16, 0.38]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>
        <group position={[1.42, 1.62, -0.6]}>
          {/* Curved Stalk */}
          <mesh castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.48, 12]} />
            <primitive object={materials.coachBlackMask} attach="material" />
          </mesh>
          <RoundedBox args={[0.12, 0.42, 0.18]} radius={0.03} smoothness={3} position={[0.08, 0.16, -0.08]} castShadow>
            <primitive object={materials.coachBodyPaint} attach="material" />
          </RoundedBox>
          {/* Mirror Glass Surface */}
          <mesh position={[0.02, 0.16, -0.08]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.16, 0.38]} />
            <primitive object={materials.chromeTrim} attach="material" />
          </mesh>
        </group>

        {/* 
          DRIVER COCKPIT & DASHBOARD (Exact Match to Picture 5 Reference)
        */}
        <group position={[-0.45, 0.62, -0.2]}>
          {/* Curved Ergonomic Dashboard Console */}
          <RoundedBox args={[1.35, 0.46, 0.78]} radius={0.05} smoothness={4} castShadow>
            <primitive object={materials.interiorCharcoal} attach="material" />
          </RoundedBox>

          {/* Authentic Warm Walnut Instrument Cluster & Pushbutton Console (Picture 5) */}
          <mesh position={[0, 0.24, 0.05]} rotation={[-0.35, 0, 0]}>
            <planeGeometry args={[0.82, 0.28]} />
            <meshStandardMaterial map={dashTexture} roughness={0.25} metalness={0.1} />
          </mesh>

          {/* 3-Spoke Bus Steering Wheel & Column (Picture 5) */}
          <group position={[0, 0.32, 0.24]} rotation={[0.55, 0, 0]}>
            {/* Steering Column */}
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.035, 0.045, 0.3, 16]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            {/* Steering Rim */}
            <mesh castShadow>
              <torusGeometry args={[0.20, 0.02, 16, 32]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            {/* Center Hub */}
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

          {/* High-visibility Safety Yellow Grab Stanchions (Picture 4 & 5) */}
          <mesh position={[0.62, 0.35, 0.25]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 1.1, 16]} />
            <primitive object={materials.safetyYellowRail} attach="material" />
          </mesh>

          {/* Forward-Facing Driver Suspension Seat */}
          <group position={[0, -0.14, 0.62]}>
            {/* Pedestal */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.12, 0.22, 16]} />
              <primitive object={materials.interiorCharcoal} attach="material" />
            </mesh>
            {/* Driver Cushion */}
            <RoundedBox args={[0.52, 0.12, 0.50]} radius={0.03} smoothness={3} position={[0, 0.22, -0.05]} castShadow>
              <primitive object={materials.interiorCharcoal} attach="material" />
            </RoundedBox>
            {/* Driver Backrest (Facing forward toward -Z) */}
            <RoundedBox args={[0.48, 0.68, 0.10]} radius={0.03} smoothness={3} position={[0, 0.62, 0.20]} rotation={[0.12, 0, 0]} castShadow>
              <primitive object={materials.interiorCharcoal} attach="material" />
            </RoundedBox>
            {/* Driver Headrest */}
            <RoundedBox args={[0.28, 0.16, 0.08]} radius={0.03} smoothness={3} position={[0, 1.02, 0.18]} castShadow>
              <primitive object={materials.interiorCharcoal} attach="material" />
            </RoundedBox>
          </group>
        </group>

        {/* Boarding Steps at Front Right Door with Safety Yellow Nosing (Picture 4) */}
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
      {/* 6. REALISTIC TOURING COACH REAR TAIL & BULKHEAD              */}
      {/* ============================================================ */}
      <group position={[0, 0.95, 6.25]}>
        {/* Sculpted Rear Cap with Aerodynamic Corner Pillars (Picture 1 & 2) */}
        <RoundedBox args={[2.54, 2.05, 0.35]} radius={0.12} smoothness={4} castShadow receiveShadow>
          <primitive object={materials.coachBodyPaint} attach="material" />
        </RoundedBox>

        {/* Lower Rear Bumper with Twin Chrome Exhaust Diffusers */}
        <group position={[0, -0.85, 0.18]}>
          <RoundedBox args={[2.56, 0.36, 0.25]} radius={0.08} smoothness={3} castShadow>
            <primitive object={materials.coachBlackMask} attach="material" />
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

        {/* Vertical LED Tail Light Assemblies on Left & Right (Picture 1 & 2) */}
        <group position={[-1.12, 0.12, 0.18]}>
          <RoundedBox args={[0.14, 1.05, 0.05]} radius={0.03} smoothness={3}>
            <primitive object={materials.taillightLens} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.28, 0.028]}>
            <boxGeometry args={[0.11, 0.14, 0.02]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.7} />
          </mesh>
        </group>
        <group position={[1.12, 0.12, 0.18]}>
          <RoundedBox args={[0.14, 1.05, 0.05]} radius={0.03} smoothness={3}>
            <primitive object={materials.taillightLens} attach="material" />
          </RoundedBox>
          <mesh position={[0, -0.28, 0.028]}>
            <boxGeometry args={[0.11, 0.14, 0.02]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.7} />
          </mesh>
        </group>

        {/* Rear Privacy Tinted Window (Picture 4) */}
        <mesh position={[0, 0.35, 0.185]} raycast={() => null}>
          <planeGeometry args={[1.8, 0.85]} />
          <primitive object={materials.panoramicGlass} attach="material" />
        </mesh>

        {/* Aerodynamic High-Mount Rear Roof Spoiler & Third Brake Light (Picture 1) */}
        <group position={[0, 1.05, 0.04]}>
          <RoundedBox args={[2.52, 0.14, 0.40]} radius={0.03} smoothness={3} castShadow>
            <primitive object={materials.coachBlackMask} attach="material" />
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
          fov={42}
        />
        <CameraController activeFocusedSeat={activeFocusedSeat} isZoomed={isZoomed} />

        {/* LUXURY AUTOMOTIVE STUDIO ILLUMINATION */}
        <hemisphereLight args={['#F8FAFC', '#0F172A', 0.95]} />

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
        <directionalLight position={[-10, 12, -8]} intensity={0.8} color="#E2E8F0" />

        {/* Warm Rim Light for Coach Body Silhouette */}
        <directionalLight position={[0, 6, -14]} intensity={0.65} color="#BAE6FD" />

        {/* Realistic Volvo 9900 Luxury Touring Coach Model */}
        <Volvo9900LuxuryCoachModel />

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
