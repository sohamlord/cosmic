import * as THREE from 'three';

export function createInternetAge(scene) {
  const group = new THREE.Group();

  const NODE_COUNT = 120;
  const SPREAD = 14;
  const nodePositions = [];

  // Nodes (glowing spheres)
  for (let i = 0; i < NODE_COUNT; i++) {
    const x = (Math.random() - 0.5) * SPREAD;
    const y = (Math.random() - 0.5) * SPREAD;
    const z = (Math.random() - 0.5) * SPREAD;
    nodePositions.push(new THREE.Vector3(x, y, z));

    const r = 0.06 + Math.random() * 0.14;
    const geo = new THREE.SphereGeometry(r, 8, 8);
    const brightness = 0.5 + Math.random() * 0.5;
    const color = new THREE.Color().setHSL(0.65 + Math.random() * 0.15, 1.0, brightness);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const node = new THREE.Mesh(geo, mat);
    node.position.set(x, y, z);
    group.add(node);
  }

  // Edges (lines between nearby nodes)
  const linePositions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dist = nodePositions[i].distanceTo(nodePositions[j]);
      if (dist < 5.5) {
        linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
        linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x6644ff,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  // Central glow
  const glow = new THREE.PointLight(0x8866ff, 4, 30);
  group.add(glow);

  group.scale.set(0.01, 0.01, 0.01);
  scene.add(group);
  return group;
}
