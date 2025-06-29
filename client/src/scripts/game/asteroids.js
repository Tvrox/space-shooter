import { gameState } from './state.js';
import { bullets } from './fire.js';
import { createExplosion } from './explosions.js';


export class Asteroid {
  constructor(x, y, dx, dy, scale, angle = 0, dxangle = Math.random() * 0.2 - 0.1) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.scale = scale;
    this.angle = angle;
    this.dxangle = dxangle;
  }

  update(canvasWidth, canvasHeight) {
    this.x += this.dx;
    this.y += this.dy;
    this.angle += this.dxangle;

    if (this.x <= 0 || this.x >= canvasWidth - 50) {
      this.dx *= -1;
    }
  }

  isOffScreen(canvasHeight) {
    return this.y >= canvasHeight + 50;
  }

  collidesWithShip(ship) {
    return Math.abs(this.x + 25 - ship.x - 25) < 50 &&
           Math.abs(this.y + 25 - ship.y - 25) < 50;
  }

  collidesWithFire(bullets) {
    return Math.abs(this.x + 25 - bullets.x - 15) < 50 &&
           Math.abs(this.y - bullets.y) < 25;
  }

  render(ctx, image) {
    ctx.save();
    ctx.translate(this.x + 25, this.y + 25);
    ctx.rotate(this.angle);
    ctx.drawImage(image, -25, -25, 50, 50);
    ctx.restore();
  }
}


export let asteroids = [];


export function resetAsteroids() {
  asteroids = [];
}


let difficultyTimer = 0;


export function spawnAsteroids(timer, ship) {
  let spawnRate = 15;

  if (timer % spawnRate === 0) {
    difficultyTimer++;

    const globalDifficultyBoost = Math.min(3, Math.floor(difficultyTimer / 600));

    const homingChance = 0.5;
    const fastChance = 0.4;
    const type = Math.random();
    const scale = 0.8 + Math.random() * 0.7;

    let dx = Math.random() * 2 - 1;
    let dy = Math.random() * 2 + 1 + globalDifficultyBoost;
    let x = Math.random() * 550;
    let y = -50;

    if (type < homingChance) {
      const targetX = ship.x + 25;
      const targetY = ship.y + 25;
      const fromX = Math.random() * 600;
      const fromY = -50;

      const dirX = targetX - fromX;
      const dirY = targetY - fromY;
      const len = Math.sqrt(dirX * dirX + dirY * dirY);
      dx = (dirX / len) * (2 + globalDifficultyBoost);
      dy = (dirY / len) * (2 + globalDifficultyBoost);
      x = fromX;
      y = fromY;
    } else if (type < homingChance + fastChance) {
      dy += 2 + globalDifficultyBoost;
    }

    asteroids.push(new Asteroid(x, y, dx, dy, scale));
  }
}


export function updateAsteroids(ship, endGameCallback) {
  try {
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const a = asteroids[i];
      a.update(600, 650);

      if (a.isOffScreen(650)) {
        asteroids.splice(i, 1);
        continue;
      }

      for (let j = bullets.length - 1; j >= 0; j--) {
        if (a.collidesWithFire(bullets[j])) {
          createExplosion(a.x, a.y);
          bullets.splice(j, 1);
          asteroids.splice(i, 1);
          gameState.score += 150;
          break;
        }
      }

      if (a.collidesWithShip(ship)) {
        asteroids.splice(i, 1);
        gameState.lives--;
        if (gameState.lives <= 0) {
          endGameCallback();
          return;
        }
      }
    }
  } catch (error) {
    console.error('❌ Ошибка в updateAsteroids:', error);
    gameState.paused = true;
    gameState.gameOver = true;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.font = '20px Arial';
    ctx.fillText('⚠️ Ошибка в астероидах. Игра остановлена.', 30, 80);
  }
}


export function renderAsteroids(ctx, image) {
  for (const a of asteroids) {
    a.render(ctx, image);
  }
}