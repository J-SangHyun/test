import { renderAll } from './render.js';
import { initGame } from './game.js';

export const app = new PIXI.Application({
  backgroundColor: 0xFFFFFF,
  resizeTo: window
});

function loadResources() {
  app.Assets
    .add('./assets/character1.png')
    .add('./assets/character2.png')
    .add('./assets/toggle.png')
    .load();
}

function resize() {
  renderAll();
}

async function init() {
  loadResources();
  document.body.appendChild(app.view);
  window.addEventListener('resize', resize);
  initGame();
  renderAll();
}

init();
