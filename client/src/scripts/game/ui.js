import { gameState } from './state.js';


let context;
let images;

export function setUIContext(ctx) {
  context = ctx;
}


export function setUIImages(imgs) {
  images = imgs;
}


export function drawScoreAndLives() {
  if (!context || !images) return;

  context.fillStyle = 'white';
  context.font = '20px Arial';
  context.fillText('Очки: ' + gameState.score, 10, 30);

  for (let i = 0; i < gameState.lives; i++) {
    context.drawImage(images.heart, 600 - (i + 1) * 30 - 10, 10, 24, 24);
  }
}


export function showPauseModal(show = true) {
  document.getElementById('pauseModal').style.display = show ? 'block' : 'none';
}


export function showEndGameModal(score) {
  document.getElementById('finalScoreText').textContent = `Ваши очки: ${score}`;
  document.getElementById('endModal').style.display = 'block';
}