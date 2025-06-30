const API_URL = import.meta.env.VITE_API_URL;


import { gameState } from './state.js';
import { setUIContext, setUIImages, drawScoreAndLives, showEndGameModal } from './ui.js';
import { Ship } from './ship.js';
const ship = new Ship();
import { resetAsteroids, spawnAsteroids, updateAsteroids, renderAsteroids } from './asteroids.js';
import { resetFire, updateFire, renderFire, shootManually } from './fire.js';
import { resetExplosions, updateExplosions, renderExplosions } from './explosions.js';
import { updateBackground, renderBackground } from './background.js';
import { sounds } from './assets.js';
import { endModal } from '../menu/menu.js';


const canvas = document.getElementById('game');
const context = canvas.getContext('2d');


const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};


let useMouse = true;


document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    return;
  }

  if (e.key in keys) {
    keys[e.key] = true;
    useMouse = false;
  }

  if (e.code === 'Space') {
    const now = Date.now();
    if (now - lastShotTime > fireCooldown &&
        !gameState.paused && !gameState.gameOver) {
      shootManually(ship);
      lastShotTime = now;
    }
    e.preventDefault();
  }
});


document.addEventListener('keyup', (e) => {
  if (e.key in keys) keys[e.key] = false;
});


ship.moveWithMouse(canvas, () => useMouse, (val) => useMouse = val);


let images = {};
let Timer;
let lastShotTime = 0;
const fireCooldown = 500;


function startBackgroundMusic() {
  if (sounds.background) {
    sounds.background.loop = true;
    sounds.background.volume = 0.3;
    sounds.background.play().catch(() => {
      console.warn('Фоновая музыка не может быть воспроизведена автоматически');
    });
  }
}


var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 20);
        };
})();


export function init() {
    Timer = 0;

    canvas.addEventListener('mousedown', function (event) {
        const now = Date.now();
        if (event.button === 0 && now - lastShotTime > fireCooldown &&
            !gameState.paused && !gameState.gameOver) {
            shootManually(ship);
            lastShotTime = now;
        }
    });
}


export function game() {
  try {
    if (gameState.gameOver) return;

    if (!gameState.paused) {
      update();
      render();
    }

    requestAnimFrame(game);
  } catch (error) {
    console.error('❌ Ошибка в игровом цикле:', error);
    gameState.paused = true;
    gameState.gameOver = true;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.font = '20px Arial';
    ctx.fillText('⚠️ Ошибка! Игра остановлена.', 30, 50);
  }
}


function update() {
    updateBackground();

    Timer++;

    ship.moveWithKeyboard(keys, canvas);

    spawnAsteroids(Timer, ship);

    updateFire();

    updateAsteroids(ship, endGame);

    updateExplosions();
}


function render() {
    context.clearRect(0, 0, 600, 600);

    renderBackground(context);

    renderFire(context, images.fire);

    context.drawImage(images.ship, ship.x, ship.y);

    renderAsteroids(context, images.aster);

    renderExplosions(context, images.expl);

    drawScoreAndLives();
}


function endGame() {
    gameState.gameOver = true;

    let player = gameState.playerName || 'Безымянный';

    let currentScore = gameState.score;

    showEndGameModal(currentScore);

    saveScoreToServer(player, currentScore);

    if (sounds.background) {
        sounds.background.pause();
        sounds.background.currentTime = 0;
    }

    if (sounds.gameOver) {
        sounds.gameOver.currentTime = 0;
        sounds.gameOver.play();
    }
}


export function setImages(loadedImages) {
    images = loadedImages;

    setUIImages(loadedImages);
}


export function restartGame() {
    startBackgroundMusic()

    gameState.score = 0;
    gameState.lives = 3;
    gameState.paused = false;
    gameState.gameOver = false;

    resetAsteroids();
    resetFire();
    resetExplosions();
    ship.reset();

    endModal.style.display = 'none';

    init();
    setUIContext(context);
    game();
}


export function saveScoreToServer(name, score) {
    fetch(`${API_URL}/api/score`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, score })
    })

    .then(response => response.json())
    .catch(error => {
        console.error('❌ Ошибка при сохранении:', error);
    });
}