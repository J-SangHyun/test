import { renderAll } from './render.js';
import { initGame } from './game.js';

export const app = new PIXI.Application({
  resolution: window.devicePixelRatio,
  backgroundColor: 0xFFFFFF,
  resizeTo: window
});

function resize() {
  renderAll();
}

async function init() {
  document.body.appendChild(app.view);
  window.addEventListener('resize', resize);
  initGame();
  renderAll();
}

init();
