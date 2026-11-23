import * as THREE from 'three';

// Module-level singletons to cache generated procedural textures
// Eliminates redundant canvas generation on each seat re-render (instant load times)
let cachedVipLeather: THREE.CanvasTexture | null = null;
let cachedStandardLeather: THREE.CanvasTexture | null = null;
let cachedWoodFloor: THREE.CanvasTexture | null = null;
let cachedAisleRunner: THREE.CanvasTexture | null = null;
let cachedDash: THREE.CanvasTexture | null = null;
let cachedShadow: THREE.CanvasTexture | null = null;
let cachedCurtain: THREE.CanvasTexture | null = null;

// Premium Luxury Coach Seat Upholstery Texture (Matches Reference Pictures 3 & 4)
export function getLeatherTexture(isVip: boolean = false): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);

  if (isVip && cachedVipLeather) return cachedVipLeather;
  if (!isVip && cachedStandardLeather) return cachedStandardLeather;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (isVip) {
      // Warm Executive Cognac / Saddle Leather
      ctx.fillStyle = '#6E3C1B';
      ctx.fillRect(0, 0, 256, 256);

      // Fine leather grain
      for (let x = 0; x < 256; x += 4) {
        for (let y = 0; y < 256; y += 4) {
          const noise = (Math.random() - 0.5) * 20;
          const r = Math.min(255, Math.max(0, 115 + noise));
          const g = Math.min(255, Math.max(0, 68 + noise * 0.7));
          const b = Math.min(255, Math.max(0, 38 + noise * 0.5));
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, y, 4, 4);
        }
      }

      // Elegant diamond quilted stitching
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = -256; i < 512; i += 32) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 256, 256);
        ctx.moveTo(i, 256);
        ctx.lineTo(i + 256, 0);
      }
      ctx.stroke();
    } else {
      // Luxury Intercity Touring Coach Navy Patterned Upholstery (Picture 3 & 4)
      ctx.fillStyle = '#17253D'; // Deep midnight navy base
      ctx.fillRect(0, 0, 256, 256);

      // Woven fabric grain
      for (let x = 0; x < 256; x += 4) {
        for (let y = 0; y < 256; y += 4) {
          const noise = (Math.random() - 0.5) * 16;
          const r = Math.min(255, Math.max(0, 24 + noise));
          const g = Math.min(255, Math.max(0, 40 + noise * 1.2));
          const b = Math.min(255, Math.max(0, 68 + noise * 1.5));
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, y, 4, 4);
        }
      }

      // Dynamic geometric micro-lattice pattern (Warm amber & cyan lines like Picture 3)
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)'; // Amber gold accents
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 28; i++) {
        const x1 = (i * 37) % 256;
        const y1 = (i * 43) % 256;
        const x2 = (x1 + 35 + ((i * 13) % 40)) % 256;
        const y2 = (y1 + 45 + ((i * 17) % 40)) % 256;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'; // Cyan blue accents
      ctx.lineWidth = 1.0;
      for (let i = 0; i < 24; i++) {
        const x1 = (i * 53) % 256;
        const y1 = (i * 61) % 256;
        const x2 = (x1 + 40 + ((i * 19) % 35)) % 256;
        const y2 = (y1 - 30 - ((i * 23) % 35) + 256) % 256;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Small accent triangles (like Picture 3 seat fabric)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)'; // Red-orange accent triangles
      for (let i = 0; i < 12; i++) {
        const tx = (i * 71 + 20) % 240;
        const ty = (i * 83 + 15) % 240;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx + 6, ty + 10);
        ctx.lineTo(tx - 6, ty + 10);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  if (isVip) {
    cachedVipLeather = texture;
  } else {
    cachedStandardLeather = texture;
  }

  return texture;
}

// Raised Platform Flooring: Dark Charcoal Acoustic Bus Carpet (Picture 3 & 4)
export function getWoodFloorTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);
  if (cachedWoodFloor) return cachedWoodFloor;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Charcoal transit carpet base
    ctx.fillStyle = '#222730';
    ctx.fillRect(0, 0, 256, 256);

    for (let x = 0; x < 256; x += 4) {
      for (let y = 0; y < 256; y += 4) {
        const shade = Math.random() > 0.5 ? 42 : 32;
        ctx.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 5})`;
        ctx.fillRect(x, y, 4, 4);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 12);
  cachedWoodFloor = texture;
  return texture;
}

// Center Sunken Aisle: Ribbed / Diamond-Plate Aluminum Tread Runner with Safety Yellow Borders (Picture 3 & 4)
export function getAisleCarpetTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);
  if (cachedAisleRunner) return cachedAisleRunner;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Brushed metallic aluminum tread plate base
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(0, 0, 256, 256);

    // Industrial embossed tread ribs / diamonds
    ctx.fillStyle = '#CBD5E1';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;

    for (let y = 8; y < 256; y += 16) {
      for (let x = 24; x < 232; x += 32) {
        const offsetX = (y % 32 === 0) ? 0 : 16;
        const px = x + offsetX;
        if (px < 232) {
          ctx.beginPath();
          ctx.ellipse(px, y, 8, 3, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(px + 4, y, 8, 3, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    // High-visibility Safety Yellow Boundary Stripes on both edges (Picture 3 & 4)
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(0, 0, 14, 256);
    ctx.fillRect(242, 0, 14, 256);

    // Black safety edge line
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(14, 0, 2, 256);
    ctx.fillRect(240, 0, 2, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 10);
  cachedAisleRunner = texture;
  return texture;
}

// Authentic Bus Driver Cockpit Dashboard Console (Picture 5)
export function getDashboardClusterTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);
  if (cachedDash) return cachedDash;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Dark molded soft-touch dashboard base
    ctx.fillStyle = '#181E29';
    ctx.fillRect(0, 0, 512, 256);

    // Left driver console wing with warm walnut / amber woodgrain bezel (Picture 5)
    ctx.fillStyle = '#854D27';
    ctx.fillRect(40, 20, 200, 140);
    ctx.strokeStyle = '#4A2A14';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 20, 200, 140);

    // Speedometer & Tachometer Dials
    ctx.fillStyle = '#0A0E17';
    ctx.beginPath();
    ctx.arc(95, 90, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(185, 90, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Center Infotainment / Navigation Telemetry Display
    ctx.fillStyle = '#0B132B';
    ctx.fillRect(260, 20, 150, 95);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(260, 20, 150, 95);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('NOVARA 9900 HUD', 270, 44);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('CRUISE: 105 KM/H', 270, 68);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '10px sans-serif';
    ctx.fillText('ROUTE: EXPRESS LINK', 270, 92);

    // Multi-color Pushbutton Switches (Red, Green, Yellow, Amber - Picture 5)
    const switchColors = ['#DC2626', '#16A34A', '#EAB308', '#2563EB', '#F97316', '#9333EA'];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 6; c++) {
        ctx.fillStyle = switchColors[(r * 6 + c) % switchColors.length];
        ctx.fillRect(260 + c * 24, 130 + r * 18, 18, 12);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(260 + c * 24, 130 + r * 18, 18, 12);
      }
    }

    // Lower climate vents & radio
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(260, 180, 140, 50);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(260, 180, 140, 50);
  }

  const texture = new THREE.CanvasTexture(canvas);
  cachedDash = texture;
  return texture;
}

// Fabric Drapes Texture for Window Curtains (Picture 4)
export function getCurtainTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);
  if (cachedCurtain) return cachedCurtain;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Rich Royal Blue Curtain Fabric (Picture 4)
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(0, 0, 128, 256);

    // Vertical drapery shadow folds
    for (let x = 0; x < 128; x += 16) {
      const gradient = ctx.createLinearGradient(x, 0, x + 16, 0);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.6)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.35)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.6)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, 0, 16, 256);
    }

    // Golden tie-back rope detail at mid-height
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(0, 135, 128, 8);
    ctx.fillStyle = '#D97706';
    ctx.fillRect(0, 143, 128, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  cachedCurtain = texture;
  return texture;
}

// Artifact-free soft circular radial shadow for coach undercarriage
export function getRadialShadowTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);
  if (cachedShadow) return cachedShadow;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const gradient = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.45)');
    gradient.addColorStop(0.75, 'rgba(0, 0, 0, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  cachedShadow = texture;
  return texture;
}

// Modern Luxury Transport Terminal Tarmac & Parking Bay Ground Texture
let cachedTarmac: THREE.CanvasTexture | null = null;
export function getTarmacTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(new Image() as any);
  if (cachedTarmac) return cachedTarmac;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // High-grade smooth European airport/terminal apron asphalt
    ctx.fillStyle = '#2A3240';
    ctx.fillRect(0, 0, 1024, 1024);

    // Fine aggregate pavement noise (soft & realistic)
    for (let x = 0; x < 1024; x += 8) {
      for (let y = 0; y < 1024; y += 8) {
        const noise = (Math.random() - 0.5) * 14;
        const gray = Math.min(255, Math.max(0, 48 + noise));
        ctx.fillStyle = `rgb(${gray}, ${gray + 3}, ${gray + 6})`;
        ctx.fillRect(x, y, 8, 8);
      }
    }

    // Subtle concrete expansion joints
    ctx.strokeStyle = '#1E2530';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 512);
    ctx.lineTo(1024, 512);
    ctx.moveTo(512, 0);
    ctx.lineTo(512, 1024);
    ctx.stroke();

    // Clean, crisp yellow coach bay perimeter lines (Single dedicated bay, no repetitive clutter)
    ctx.strokeStyle = '#EAB308';
    ctx.lineWidth = 10;
    ctx.strokeRect(180, 60, 664, 904);

    // Clean white dashed center approach guideline
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.7)';
    ctx.lineWidth = 5;
    ctx.setLineDash([36, 28]);
    ctx.beginPath();
    ctx.moveTo(512, 100);
    ctx.lineTo(512, 924);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  cachedTarmac = texture;
  return texture;
}
