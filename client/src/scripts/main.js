import '../styles/style.css';
import './game/engine.js';
import { loadAllImages } from './game/assets.js';
import { setImages } from './game/engine.js';
import './menu/menu.js';


(async () => {
  try {
    const loaded = await loadAllImages();
    setImages(loaded);
  } catch (err) {
    console.error("❌ Ошибка загрузки изображений:", err);
  }
})();