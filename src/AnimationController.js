import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

// Z positions for each milestone along the tunnel
const MILESTONE_Z = [-10, -60, -110, -160, -210, -260, -310];

export class AnimationController {
  constructor(scene, camera, milestones) {
    this.scene = scene;
    this.camera = camera;
    this.milestones = milestones;
    this.tl = null;
  }

  buildTimeline() {
    const sections = document.querySelectorAll('.milestone');
    const totalSections = sections.length; // 7

    // Main camera tunnel scroll timeline
    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.8,
      },
    });

    // Camera flies forward along Z-axis through all milestones
    this.tl.to(this.camera.position, {
      z: MILESTONE_Z[MILESTONE_Z.length - 1] + 15,
      ease: 'none',
      duration: totalSections,
    }, 0);

    // Subtle camera Y bob between sections
    this.tl.to(this.camera.position, {
      y: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: totalSections - 1,
      duration: 1,
    }, 0);

    // Animate each milestone group in/out as camera passes
    this.milestones.forEach((group, i) => {
      if (!group) return;
      group.position.z = MILESTONE_Z[i];

      const marker = i / totalSections;  // 0..1

      // Scale up as camera approaches
      this.tl.fromTo(group.scale,
        { x: 0.1, y: 0.1, z: 0.1 },
        {
          x: 1, y: 1, z: 1,
          ease: 'power2.out',
          duration: 0.7,
        },
        marker
      );

      // Spin / special rotation per milestone
      if (i === 0) {
        // Big Bang: fast burst rotation
        this.tl.to(group.rotation, { y: Math.PI * 2, ease: 'power1.inOut', duration: 0.7 }, marker);
      } else if (i === 2) {
        // Solar system: continuous slow spin handled in tick
      } else {
        this.tl.to(group.rotation, { y: 0.6, ease: 'sine.inOut', duration: 0.7 }, marker);
      }

      // Fade out as camera passes
      this.tl.to(group.children, {
        opacity: 0,
        ease: 'power2.in',
        duration: 0.2,
        stagger: 0.02,
        modifiers: {
          opacity: (v, target) => {
            if (target.material) target.material.opacity = parseFloat(v);
            return v;
          }
        }
      }, marker + 1 / totalSections - 0.05);
    });
  }

  tick(delta, elapsed) {
    // Solar system planet orbits
    const solar = this.milestones[2];
    if (solar) {
      solar.children.forEach((child) => {
        if (!child.userData.orbitRadius) return; // skip sun, rings, lights
        const r = child.userData.orbitRadius;
        const spd = child.userData.orbitSpeed || 0.5;
        const off = child.userData.orbitOffset || 0;
        const angle = elapsed * spd + off;
        child.position.x = Math.cos(angle) * r;
        child.position.y = 0;
        child.position.z = Math.sin(angle) * r * 0.35; // slight ellipse tilt
        child.rotation.y += delta * 0.5;
      });
    }

    const internet = this.milestones[5];
    if (internet) internet.rotation.y += delta * 0.12;

    const bigBang = this.milestones[0];
    if (bigBang && bigBang.userData.particles) {
      bigBang.userData.particles.rotation.y += delta * 0.08;
      bigBang.userData.particles.rotation.x += delta * 0.04;
    }

    const earth = this.milestones[3];
    if (earth) earth.rotation.y += delta * 0.08;

    const present = this.milestones[6];
    if (present) present.rotation.y += delta * 0.05;
  }
}
