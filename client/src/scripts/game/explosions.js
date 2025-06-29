import { sounds } from './assets.js';


export class Explosion {
  constructor(x, y) {
    this.x = x - 25;
    this.y = y - 25;
    this.animx = 0;
    this.animy = 0;

    if (sounds.explosion) {
      sounds.explosion.currentTime = 0;
      sounds.explosion.play();
    }
  }

  update() {
    this.animx += 0.5;
    if (this.animx > 7) {
      this.animy++;
      this.animx = 0;
    }
    return this.animy > 7;
  }

  render(ctx, img) {
    ctx.drawImage(
      img,
      128 * Math.floor(this.animx), 128 * Math.floor(this.animy),
      128, 128,
      this.x, this.y,
      100, 100
    );
  }
}


export let explosions = [];


export function resetExplosions() {
  explosions = [];
}


export function createExplosion(x, y) {
  explosions.push(new Explosion(x, y));
}


export function updateExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    if (explosions[i].update()) {
      explosions.splice(i, 1);
    }
  }
}


export function renderExplosions(ctx, img) {
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].render(ctx, img);
  }
}