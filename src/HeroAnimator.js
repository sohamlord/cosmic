/**
 * HeroAnimator.js
 * Plays the 300-frame JPG sequence on a canvas element
 * using pre-loaded Image objects for stutter-free playback.
 */

const TOTAL_FRAMES = 300;
const FPS = 30; // playback speed

function pad(n) {
  return String(n).padStart(3, '0');
}

export class HeroAnimator {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.frames = [];
    this.currentFrame = 0;
    this.intervalId = null;
    this.loaded = 0;
    this.ready = false;

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // Redraw current frame after resize
    if (this.ready && this.frames[this.currentFrame]) {
      this._drawFrame(this.frames[this.currentFrame]);
    }
  }

  _drawFrame(img) {
    const { canvas, ctx } = this;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth  || img.width;
    const ih = img.naturalHeight || img.height;

    // Cover fit: fill the canvas, centred
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const dx = (cw - sw) / 2;
    const dy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, sw, sh);
  }

  /** Pre-load all frames, then call onReady. */
  preload(onReady) {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/assets/ezgif-frame-${pad(i)}.jpg`;
      img.onload = () => {
        this.loaded++;
        // Start playing as soon as the first 30 frames are ready
        if (this.loaded === 30 && !this.ready) {
          this.ready = true;
          this._play();
          if (onReady) onReady();
        }
      };
      this.frames.push(img);
    }
  }

  _play() {
    const delay = 1000 / FPS;
    this.intervalId = setInterval(() => {
      if (!this.frames[this.currentFrame].complete) return;
      this._drawFrame(this.frames[this.currentFrame]);
      this.currentFrame = (this.currentFrame + 1) % TOTAL_FRAMES;
    }, delay);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
