import * as THREE from 'three';

export function createSolarSystem(scene) {
  const group = new THREE.Group();

  // Sun
  const sunGeo = new THREE.SphereGeometry(2, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  group.add(sun);

  const sunLight = new THREE.PointLight(0xffcc33, 8, 80);
  group.add(sunLight);

  // Planets config: [color, size, orbitRadius, orbitSpeed]
  const planetData = [
    { color: 0xb0b0b0, size: 0.22, orbitRadius: 4.5,  speed: 1.6 },  // Mercury
    { color: 0xe8aa60, size: 0.35, orbitRadius: 6.5,  speed: 1.2 },  // Venus
    { color: 0x3377ff, size: 0.40, orbitRadius: 8.5,  speed: 1.0 },  // Earth
    { color: 0xcc4422, size: 0.30, orbitRadius: 10.5, speed: 0.8 },  // Mars
    { color: 0xd4a050, size: 0.90, orbitRadius: 14.0, speed: 0.4 },  // Jupiter
    { color: 0xc8b060, size: 0.75, orbitRadius: 17.5, speed: 0.3 },  // Saturn
  ];

  planetData.forEach((pd, i) => {
    const geo = new THREE.SphereGeometry(pd.size, 16, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: pd.color,
      roughness: 0.7,
      metalness: 0.1,
      transparent: true,
      opacity: 1,
    });
    const planet = new THREE.Mesh(geo, mat);
    planet.position.x = pd.orbitRadius;
    planet.userData.orbitRadius = pd.orbitRadius;
    planet.userData.orbitSpeed = pd.speed;
    planet.userData.orbitOffset = Math.random() * Math.PI * 2;
    group.add(planet);

    // Orbit ring (thin torus)
    const ringGeo = new THREE.TorusGeometry(pd.orbitRadius, 0.012, 8, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x334466, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Saturn rings special
    if (i === 5) {
      const satRingGeo = new THREE.RingGeometry(pd.size * 1.4, pd.size * 2.4, 64);
      const satRingMat = new THREE.MeshBasicMaterial({ color: 0xc8b560, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const satRing = new THREE.Mesh(satRingGeo, satRingMat);
      satRing.rotation.x = Math.PI / 3;
      planet.add(satRing);
    }
  });

  group.scale.set(0.01, 0.01, 0.01);
  scene.add(group);
  return group;
}
