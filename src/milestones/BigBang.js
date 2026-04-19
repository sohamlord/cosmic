import * as THREE from 'three';

/**
 * Creates a circular soft-glow sprite texture procedurally.
 * Using a 2D canvas so no external image is needed.
 */
function makeCircleTexture(size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const center = size / 2;
  const radius = size / 2;

  // Radial gradient: bright white core → transparent edge
  const grad = ctx.createRadialGradient(center, center, 0, center, center, radius);
  grad.addColorStop(0.0,  'rgba(255, 255, 255, 1.0)');  // hot white core
  grad.addColorStop(0.2,  'rgba(220, 200, 255, 0.9)');  // soft violet mid
  grad.addColorStop(0.5,  'rgba(100, 160, 255, 0.4)');  // blue-ish halo
  grad.addColorStop(1.0,  'rgba(0,   0,   0,   0.0)');  // fully transparent

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

export function createBigBang(scene) {
  const group = new THREE.Group();

  const spriteMap = makeCircleTexture(128);

  // ── Layer 1: Core burst — dense, bright, small particles ──────────────────
  const coreCount = 3000;
  const corePos   = new Float32Array(coreCount * 3);
  const coreCol   = new Float32Array(coreCount * 3);
  const corePalette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xfff0cc),
    new THREE.Color(0xffcc88),
    new THREE.Color(0xff8844),
  ];

  for (let i = 0; i < coreCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = Math.pow(Math.random(), 0.5) * 4;   // bias toward center
    corePos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    corePos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    corePos[i*3+2] = r * Math.cos(phi);

    const c = corePalette[Math.floor(Math.random() * corePalette.length)];
    coreCol[i*3] = c.r; coreCol[i*3+1] = c.g; coreCol[i*3+2] = c.b;
  }

  const coreGeo = new THREE.BufferGeometry();
  coreGeo.setAttribute('position', new THREE.BufferAttribute(corePos, 3));
  coreGeo.setAttribute('color',    new THREE.BufferAttribute(coreCol, 3));

  const coreMat = new THREE.PointsMaterial({
    size: 0.28,
    map: spriteMap,
    vertexColors: true,
    transparent: true,
    opacity: 1.0,
    alphaTest: 0.01,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  group.add(new THREE.Points(coreGeo, coreMat));

  // ── Layer 2: Shell explosion — bigger, more colorful, further out ─────────
  const shellCount = 5000;
  const shellPos   = new Float32Array(shellCount * 3);
  const shellCol   = new Float32Array(shellCount * 3);
  const shellPalette = [
    new THREE.Color(0xff5522),
    new THREE.Color(0xff9900),
    new THREE.Color(0xffdd00),
    new THREE.Color(0xffffff),
    new THREE.Color(0xcc66ff),
    new THREE.Color(0x88aaff),
  ];

  for (let i = 0; i < shellCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 3 + Math.pow(Math.random(), 0.4) * 11;  // shell, 3-14 units
    shellPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    shellPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    shellPos[i*3+2] = r * Math.cos(phi);

    const c = shellPalette[Math.floor(Math.random() * shellPalette.length)];
    shellCol[i*3] = c.r; shellCol[i*3+1] = c.g; shellCol[i*3+2] = c.b;
  }

  const shellGeo = new THREE.BufferGeometry();
  shellGeo.setAttribute('position', new THREE.BufferAttribute(shellPos, 3));
  shellGeo.setAttribute('color',    new THREE.BufferAttribute(shellCol, 3));

  const shellMat = new THREE.PointsMaterial({
    size: 0.18,
    map: spriteMap,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    alphaTest: 0.01,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const shellPoints = new THREE.Points(shellGeo, shellMat);
  group.add(shellPoints);

  // ── Layer 3: Far gossamer streaks — tiny dim dust at edges ───────────────
  const dustCount = 2000;
  const dustPos   = new Float32Array(dustCount * 3);

  for (let i = 0; i < dustCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 8 + Math.random() * 8;
    dustPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    dustPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    dustPos[i*3+2] = r * Math.cos(phi);
  }

  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

  const dustMat = new THREE.PointsMaterial({
    size: 0.10,
    map: spriteMap,
    color: 0xffbbaa,
    transparent: true,
    opacity: 0.35,
    alphaTest: 0.005,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  group.add(new THREE.Points(dustGeo, dustMat));

  // ── Central point light flash ──────────────────────────────────────────────
  const flash = new THREE.PointLight(0xff8844, 14, 35);
  group.add(flash);

  // Store reference for AnimationController tick
  group.userData.particles = shellPoints;

  group.scale.set(0.01, 0.01, 0.01);
  scene.add(group);
  return group;
}
