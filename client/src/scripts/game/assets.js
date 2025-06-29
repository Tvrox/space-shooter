const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Не удалось загрузить: ${src}`));
  });
};


export async function loadAllImages() {
  const entries = {
    ship: '/images/ship01.png',
    fire: '/images/fire.png',
    aster: '/images/astero.png',
    expl: '/images/expl222.png',
    heart: '/images/heart.png'
  };

  const results = {};

  for (const [key, path] of Object.entries(entries)) {
    results[key] = await loadImage(path);
  }

  return results; // объект с загруженными изображениями
}

export const sounds = {
  background: new Audio('/sounds/background.mp3'),
  fire: new Audio('/sounds/fire.mp3'),
  explosion: new Audio('/sounds/explosion.wav'),
  gameOver: new Audio('/sounds/gameover.mp3')
};

sounds.background.loop = true; // чтобы музыка не заканчивалась
sounds.background.volume = 1.0;     
sounds.fire.volume = 0.1;           
sounds.explosion.volume = 0.1;
sounds.gameOver.volume = 0.8;