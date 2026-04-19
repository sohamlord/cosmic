import * as THREE from 'three';

export function createEarth(scene) {
  const group = new THREE.Group();

  // Strong key light so Earth is well-lit
  const sunLight = new THREE.DirectionalLight(0xffffff, 4);
  sunLight.position.set(15, 8, 15);
  group.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0x4466ff, 1.5);
  fillLight.position.set(-10, -5, 5);
  group.add(fillLight);

  // Earth sphere — vivid blue ocean
  const earthGeo = new THREE.SphereGeometry(3, 64, 64);
  const earthMat = new THREE.MeshStandardMaterial({
    color: 0x1a5fb4,
    emissive: 0x061230,
    emissiveIntensity: 0.3,
    roughness: 0.7,
    metalness: 0.05,
    transparent: true,
    opacity: 1,
  });
  const earth = new THREE.Mesh(earthGeo, earthMat);
  group.add(earth);

  // Land masses — vivid green continent patches on the sphere
  const landColors = [0x3aaa45, 0x5abf60, 0x2d8c35, 0x4ab850];
  for (let i = 0; i < 32; i++) {
    const w = 0.5 + Math.random() * 1.4;
    const h = 0.4 + Math.random() * 1.0;
    const geo = new THREE.PlaneGeometry(w, h, 2, 2);
    const mat = new THREE.MeshStandardMaterial({
      color: landColors[Math.floor(Math.random() * landColors.length)],
      emissive: 0x1a4a1e,
      emissiveIntensity: 0.2,
      roughness: 0.9,
      transparent: true,
      opacity: 1,
    });
    const land = new THREE.Mesh(geo, mat);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3.02;
    land.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    land.lookAt(land.position.clone().multiplyScalar(2));
    group.add(land);
  }

  // Ice caps
  for (const sign of [1, -1]) {
    const capGeo = new THREE.ConeGeometry(1.2, 0.6, 32);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xeef8ff, roughness: 0.5 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = sign * 2.9;
    cap.rotation.z = sign === -1 ? Math.PI : 0;
    group.add(cap);
  }

  // Cloud layer
  const cloudGeo = new THREE.SphereGeometry(3.22, 48, 48);
  const cloudMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });
  const clouds = new THREE.Mesh(cloudGeo, cloudMat);
  group.add(clouds);
  group.userData.clouds = clouds;

  // Atmosphere glow rim
  const atmGeo = new THREE.SphereGeometry(3.6, 32, 32);
  const atmMat = new THREE.MeshBasicMaterial({
    color: 0x55aaff,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(atmGeo, atmMat));

  group.scale.set(0.01, 0.01, 0.01);
  scene.add(group);
  return group;
}
