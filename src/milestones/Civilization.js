import * as THREE from 'three';

export function createCivilization(scene) {
  const group = new THREE.Group();

  // Ground plane
  const groundGeo = new THREE.PlaneGeometry(30, 30);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x111118,
    roughness: 0.9,
    transparent: true,
    opacity: 1,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  group.add(ground);

  // City grid of buildings
  const buildingColors = [0x1a1a2e, 0x16213e, 0x0f3460, 0x22213d, 0x0a192f];
  const windowColor = 0xffdd88;

  for (let i = 0; i < 55; i++) {
    const w = 0.5 + Math.random() * 1.5;
    const d = 0.5 + Math.random() * 1.5;
    const h = 0.5 + Math.random() * 7;

    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({
      color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
      roughness: 0.6,
      metalness: 0.3,
      transparent: true,
      opacity: 1,
    });
    const building = new THREE.Mesh(geo, mat);

    // Scatter in a grid with some randomness
    const col = (i % 8) - 4;
    const row = Math.floor(i / 8) - 3;
    building.position.set(
      col * 3.2 + (Math.random() - 0.5) * 1.5,
      h / 2,
      row * 3.2 + (Math.random() - 0.5) * 1.5
    );
    group.add(building);

    // Window lights — small emissive planes on sides
    if (Math.random() > 0.3) {
      const wGeo = new THREE.PlaneGeometry(w * 0.6, h * 0.5);
      const wMat = new THREE.MeshBasicMaterial({
        color: windowColor,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.4,
      });
      const windows = new THREE.Mesh(wGeo, wMat);
      windows.position.set(building.position.x, building.position.y, building.position.z + d / 2 + 0.01);
      group.add(windows);
    }
  }

  // City ambient glow light
  const cityGlow = new THREE.PointLight(0xff9944, 3, 40);
  cityGlow.position.set(0, 2, 0);
  group.add(cityGlow);

  const skyGlow = new THREE.HemisphereLight(0x222244, 0x000000, 1);
  group.add(skyGlow);

  group.scale.set(0.01, 0.01, 0.01);
  scene.add(group);
  return group;
}
