import * as THREE from 'three';

export function createBigBang(scene) {
  const group = new THREE.Group();

  // Central flash sphere
  const coreGeo = new THREE.SphereGeometry(1.5, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Explosion particle cloud
  const count = 4000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color(0xff6030),
    new THREE.Color(0xff9020),
    new THREE.Color(0xffffff),
    new THREE.Color(0xffdd60),
    new THREE.Color(0xcc44ff),
  ];

  for (let i = 0; i < count; i++) {
    // Spherical random shell
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 10;
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geo, mat);
  group.add(particles);
  group.userData.particles = particles;

  // Point light for the flash
  const light = new THREE.PointLight(0xff8030, 12, 30);
  group.add(light);

  group.scale.set(0.01, 0.01, 0.01);
  scene.add(group);
  return group;
}
