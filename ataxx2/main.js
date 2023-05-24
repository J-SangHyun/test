import { render_all } from './render.js';
import { init_game } from './game.js';

export const app = new PIXI.Application({
  resolution: window.devicePixelRatio,
  backgroundColor: 0xFFFFFF,
  resizeTo: window
});

function resize() {
  render_all();
}

async function init() {
  document.body.appendChild(app.view);
  window.addEventListener('resize', resize);
  init_game();
  render_all();
}

init();
