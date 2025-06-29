import { sounds } from './assets.js';


export class Bullet {
  constructor(x, y, dx = 0, dy = -5) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  isOffScreen() {
    return this.y < -30;
  }

  render(ctx, img) {
    ctx.drawImage(img, this.x, this.y, 30, 30);
  }
}


export let bullets = [];


export function resetFire() {
  bullets = [];
}


export function updateFire() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    if (bullets[i].isOffScreen()) {
      bullets.splice(i, 1);
    }
  }
}


export function renderFire(ctx, img) {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].render(ctx, img);
  }
}


export function shootManually(ship) {
  bullets.push(new Bullet(ship.x + 10, ship.y, 0, -5.2));
  if (sounds.fire) {
    sounds.fire.currentTime = 0;
    sounds.fire.play();
  }
}