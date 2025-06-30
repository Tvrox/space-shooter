const API_URL = import.meta.env.VITE_API_URL;


import { restartGame } from '../game/engine.js';
import { gameState } from '../game/state.js';


function insertTemplate(id) {
    const template = document.getElementById(id);
    const clone = template.content.cloneNode(true);
    document.body.appendChild(clone);
}
insertTemplate('registration-template');
insertTemplate('score-template');
insertTemplate('end-template');
insertTemplate('pause-template');
insertTemplate('help-template');
insertTemplate('about-template');


const buttons = document.querySelectorAll('#menu button');
const startButton = buttons[0];
const scoresButton = buttons[1];
const playerNameInput = document.getElementById('playerName');
const overlay = document.getElementById('overlay');
export const endModal = document.getElementById('endModal');
const helpButton = document.querySelectorAll('#menu button')[2];
const helpModal = document.getElementById('helpModal');
const helpInput = document.getElementById('helpInput');
const helpSubmitBtn = document.getElementById('helpSubmitBtn');
const aboutModal = document.getElementById('aboutModal');
const closeAbout = document.getElementById('closeAbout');
const aboutBtn = document.getElementById('aboutBtn'); 
const scoreModal = document.getElementById('scoreModal');


startButton.addEventListener('click', function () {
    const playerName = playerNameInput.value.trim();

    if (playerName === '') {
        alert('Пожалуйста, введите имя игрока!');
        return;
    }

    gameState.playerName = playerName;
    overlay.style.display = 'none';
    endModal.style.display = 'none';

    restartGame();
});


scoresButton.addEventListener('click', function () {
    const list = document.getElementById('scoreList');
    list.innerHTML = '';
    scoreModal.style.display = 'block';

    loadLeaderboard()
});


document.getElementById('closeModal').onclick = function () {
    scoreModal.style.display = 'none';
};


document.getElementById('restartGameBtn').addEventListener('click', () => {
    restartGame();
});


document.getElementById('returnToMenuBtn').addEventListener('click', () => {
    endModal.style.display = 'none';
    overlay.style.display = 'block';
});


document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const pauseModal = document.getElementById('pauseModal');

        if (helpModal.style.display === 'block') {
            helpModal.style.display = 'none';
            return;
        }

        if (scoreModal.style.display === 'block') {
            scoreModal.style.display = 'none';
            return;
        }

        if (aboutModal && aboutModal.style.display === 'block') {
            aboutModal.style.display = 'none';
            return;
        }

        if (overlay.style.display === 'none' && !gameState.gameOver) {
            if (!gameState.paused) {
                gameState.paused = true;
                pauseModal.style.display = 'block';
            } else {
                gameState.paused = false;
                pauseModal.style.display = 'none';
            }
        }
    }
});


helpButton.addEventListener('click', () => {
    helpModal.style.display = 'block';
    helpInput.value = ''; 
});


document.getElementById('closeHelpModal').addEventListener('click', () => {
    helpModal.style.display = 'none';
});


async function loadLeaderboard() {
  const container = document.getElementById('scoreList');
  const loader = document.getElementById('loader');

  container.classList.add('hidden');
  loader.classList.remove('hidden');

  try {
    const response = await fetch(`${API_URL}/api/scores`);
    
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const scores = await response.json();

    if (!Array.isArray(scores)) {
      throw new Error('Ответ не является массивом');
    }

    setTimeout(() => {
      container.innerHTML = '';
      scores.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name} — ${entry.score} очков`;
        container.appendChild(li);
      });

      loader.classList.add('hidden');
      container.classList.remove('hidden');
    }, 2000);

  } catch (error) {
    console.error('❌ Ошибка при загрузке рекордов:', error);
    loader.classList.add('hidden');
    container.classList.remove('hidden');
    container.innerHTML = '<li>Ошибка загрузки данных</li>';
  }
}


aboutBtn.addEventListener('click', () => {
    aboutModal.style.display = 'block';
});


closeAbout.addEventListener('click', () => {
    aboutModal.style.display = 'none';
});


helpSubmitBtn.addEventListener('click', async () => {
    const name = document.getElementById('helpName')?.value.trim();
    const email = document.getElementById('helpEmail')?.value.trim();
    const message = document.getElementById('helpInput')?.value.trim();

    if (!name || !email || !message) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/help`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        if (!res.ok) {
            throw new Error(`Ошибка сервера: ${res.status}`);
        }

        await res.json();

        alert('Ваше сообщение отправлено!');
        document.getElementById('helpModal').style.display = 'none';

    } catch (err) {
        console.error('❌ Ошибка отправки:', err);
        alert('Произошла ошибка при отправке. Попробуйте позже.');
    }
});