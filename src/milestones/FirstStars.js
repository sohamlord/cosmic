import * as THREE from 'three';

export function createFirstStars(scene) {
  const group = new THREE.Group();

  const starColors = [0xffffff, 0xaaccff, 0xffddaa, 0xffaaaa, 0xaaffdd];
  const count = 60;

  for (let i = 0; i < count; i++) {
    const radius = 0.08 + Math.random() * 0.35;
    const geo = new THREE.SphereGeometry(radius, 12, 12);
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
    const star = new THREE.Mesh(geo, mat);

    // Scattered in a roughly spherical volume
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2 + Math.random() * 12;
    star.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );

    star.userData.baseIntensity = 0.6 + Math.random() * 0.4;
    star.userData.flickerSpeed = 1 + Math.random() * 3;
    star.userData.flickerOffset = Math.random() * Math.PI * 2;
    group.add(star);

    // Glow light for some stars
    if (Math.random() > 0.7) {
      const light = new THREE.PointLight(color, 0.6, 8);
      light.position.copy(star.position);
      group.add(light);
    }
  }

  // Background star field
  const starFieldCount = 2000;
  const sfPositions = new Float32Array(starFieldCount * 3);
  for (let i = 0; i < starFieldCount; i++) {
    sfPositions[i * 3]     = (Math.random() - 0.5) * 80;
    sfPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    sfPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }
  const sfGeo = new THREE.BufferGeometry();
  sfGeo.setAttribute('position', new THREE.BufferAttribute(sfPositions, 3));
  const sfMat = new THREE.PointsMaterial({
    size: 0.06,
    color: 0xaaaacc,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  group.add(new THREE.Points(sfGeo, sfMat));

  group.scale.set(0.01, 0.01, 0.01);
  scene.add(group);

  // Store star meshes for flicker tick
  group.userData.stars = group.children.filter(c => c instanceof THREE.Mesh);
  return group;
}
