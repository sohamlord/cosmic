import * as THREE from 'three';

export function createPresentDay(scene) {
  const group = new THREE.Group();

  // Central mirror disc
  const discGeo = new THREE.CircleGeometry(3.5, 64);
  const discMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 1.0,
    roughness: 0.05,
    envMapIntensity: 1.0,
    transparent: true,
    opacity: 1,
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  group.add(disc);

  // Outer ring
  const ringGeo = new THREE.TorusGeometry(3.7, 0.08, 16, 128);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.9 });
  group.add(new THREE.Mesh(ringGeo, ringMat));

  // Outer ring 2 — orbiting slower
  const ring2Geo = new THREE.TorusGeometry(5.5, 0.03, 8, 128);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xffaa33, transparent: true, opacity: 0.4 });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI / 3;
  group.add(ring2);

  // Radiating light rays (lines from center outward)
  const rayCount = 24;
  for (let i = 0; i < rayCount; i++) {
    const angle = (i / rayCount) * Math.PI * 2;
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(angle) * 6, Math.sin(angle) * 6, 0),
    ];
    const rayGeo = new THREE.BufferGeometry().setFromPoints(points);
    const rayMat = new THREE.LineBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Line(rayGeo, rayMat));
  }

  // Gold glow light
  const light = new THREE.PointLight(0xffd700, 6, 40);
  group.add(light);

  // Particle halo
  const haloCount = 800;
  const haloPos = new Float32Array(haloCount * 3);
  for (let i = 0; i < haloCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 4 + Math.random() * 4;
    haloPos[i * 3]     = Math.cos(angle) * r;
    haloPos[i * 3 + 1] = Math.sin(angle) * r;
    haloPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
  }
  const haloGeo = new THREE.BufferGeometry();
  haloGeo.setAttribute('position', new THREE.BufferAttribute(haloPos, 3));
  const haloMat = new THREE.PointsMaterial({
    color: 0xffeeaa,
    size: 0.07,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  group.add(new THREE.Points(haloGeo, haloMat));

  group.scale.set(0.01, 0.01, 0.01);
  scene.add(group);
  return group;
}
