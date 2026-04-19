import * as THREE from 'three';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000007, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000007, 0.008);

    // Camera
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 800);
    this.camera.position.set(0, 0, 0);

    // Global ambient
    const ambient = new THREE.AmbientLight(0x111133, 2);
    this.scene.add(ambient);

    // Persistent deep-space star field (follows camera via scene fog)
    this._addStarField();

    // Resize handler
    window.addEventListener('resize', () => this._onResize());
  }

  _addStarField() {
    const count = 8000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xaaccff),
      new THREE.Color(0xffeedd),
      new THREE.Color(0xddaaff),
    ];
    for (let i = 0; i < count; i++) {
      positions[i*3]   = (Math.random()-0.5)*700;
      positions[i*3+1] = (Math.random()-0.5)*700;
      positions[i*3+2] = (Math.random()-0.5)*700;
      const c = palette[Math.floor(Math.random()*palette.length)];
      colors[i*3]=c.r; colors[i*3+1]=c.g; colors[i*3+2]=c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,3));
    const mat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.starField = new THREE.Points(geo, mat);
    this.scene.add(this.starField);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  startLoop(tickCallback) {
    const loop = () => {
      requestAnimationFrame(loop);
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();
      // Keep star field centered on camera
      this.starField.position.copy(this.camera.position);
      tickCallback(delta, elapsed);
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }
}
