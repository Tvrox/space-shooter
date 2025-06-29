class Star {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 1;
    this.speed = Math.random() * 1.5 + 0.5;
    this.color = Star.getRandomColor();
    this.alphaPhase = Math.random() * Math.PI * 2;
  }

  static getRandomColor() {
    const colors = ['#ffffff', '#aaddff', '#ffccaa', '#aaffee', '#ddeeff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(height) {
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0;
      this.x = Math.random() * 600;
    }
    this.alphaPhase += 0.05;
  }

  render(ctx) {
    const alpha = 0.5 + 0.5 * Math.sin(this.alphaPhase);
    ctx.fillStyle = Star.hexToRgba(this.color, alpha);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  static hexToRgba(hex, alpha) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
  }
}


class Nebula {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = 100 + Math.random() * 100;
    this.color = Nebula.getRandomColor();
    this.alpha = 0.05 + Math.random() * 0.1;
  }

  static getRandomColor() {
    const colors = ['rgba(128,0,255,', 'rgba(0,255,255,', 'rgba(255,100,0,'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  render(ctx) {
    const grad = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );
    grad.addColorStop(0, this.color + this.alpha + ')');
    grad.addColorStop(1, this.color + '0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}


class Background {
  constructor(width = 600, height = 600, starCount = 120, nebulaCount = 5) {
    this.width = width;
    this.height = height;
    this.stars = Array.from({ length: starCount }, () => new Star(width, height));
    this.nebulas = Array.from({ length: nebulaCount }, () => new Nebula(width, height));
  }

  update() {
    this.stars.forEach(star => star.update(this.height));
  }

  render(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#000010');
    gradient.addColorStop(1, '#12003a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    this.nebulas.forEach(n => n.render(ctx));
    this.stars.forEach(s => s.render(ctx));
  }
}


export const background = new Background();


export function updateBackground() {
  background.update();
}


export function renderBackground(ctx) {
  background.render(ctx);
}