import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneManager } from './SceneManager.js';
import { AnimationController } from './AnimationController.js';
import { HeroAnimator } from './HeroAnimator.js';
import { createBigBang } from './milestones/BigBang.js';
import { createFirstStars } from './milestones/FirstStars.js';
import { createSolarSystem } from './milestones/SolarSystem.js';
import { createEarth } from './milestones/Earth.js';
import { createCivilization } from './milestones/Civilization.js';
import { createInternetAge } from './milestones/InternetAge.js';
import { createPresentDay } from './milestones/PresentDay.js';

gsap.registerPlugin(ScrollTrigger);

// --- Hero frame-sequence animator ---
const heroCanvas = document.getElementById('hero-canvas');
const heroAnimator = new HeroAnimator(heroCanvas);
heroAnimator.preload(); // starts playing automatically when first 30 frames are loaded

// --- Intro overlay dismiss ---
const introOverlay = document.getElementById('intro-overlay');
let introDismissed = false;
function dismissIntro() {
  if (introDismissed) return;
  introDismissed = true;
  introOverlay.classList.add('hidden');
  // Stop the frame animator once the intro is gone (saves memory/GPU)
  setTimeout(() => heroAnimator.stop(), 1200);
}
window.addEventListener('scroll', dismissIntro, { once: true });
introOverlay.addEventListener('click', dismissIntro);

// --- Scene setup ---
const canvas = document.getElementById('cosmos-canvas');
const sceneManager = new SceneManager(canvas);
const { scene, camera, renderer } = sceneManager;

// --- Create milestone objects, positioned along Z-axis ---
const milestones = [
  createBigBang(scene),
  createFirstStars(scene),
  createSolarSystem(scene),
  createEarth(scene),
  createCivilization(scene),
  createInternetAge(scene),
  createPresentDay(scene),
];

// --- Animation Controller ---
const animController = new AnimationController(scene, camera, milestones);
animController.buildTimeline();

// --- HUD updates ---
const hudFill = document.getElementById('hud-progress-fill');
const hudYear = document.getElementById('hud-year');
const hudYears = [
  '13,800,000,000 BC',
  '13,799,620,000 BC',
  '4,600,000,000 BC',
  '3,800,000,000 BC',
  '10,000 BC',
  '1969 AD',
  'Present Day',
];

ScrollTrigger.create({
  trigger: '#scroll-container',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    hudFill.style.width = `${self.progress * 100}%`;
    const idx = Math.min(Math.floor(self.progress * 7), 6);
    hudYear.textContent = hudYears[idx];
  },
});

// --- Milestone card reveal on scroll ---
const cards = document.querySelectorAll('.milestone-content');
cards.forEach((card) => {
  ScrollTrigger.create({
    trigger: card.parentElement,
    start: 'top 70%',
    onEnter: () => card.classList.add('visible'),
    onLeaveBack: () => card.classList.remove('visible'),
  });
});

// --- Render loop ---
sceneManager.startLoop((delta, elapsed) => {
  animController.tick(delta, elapsed);
});
