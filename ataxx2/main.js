import { renderAll, renderToggle } from './render.js';
import { initGame } from './game.js';

export const app = new PIXI.Application({
  backgroundColor: 0xFFFFFF,
  resizeTo: window
});

export let char1Texture, char2Texture, toggleTexture;

function loadTextures() {
  char1Texture = PIXI.Texture.from('./assets/character1.png')
  char2Texture = PIXI.Texture.from('./assets/character2.png')
  toggleTexture = PIXI.Texture.from('./assets/toggle.png')
}

function resize() {
  renderAll();
}

async function init() {
  loadTextures();
  document.body.appendChild(app.view);
  window.addEventListener('resize', resize);
  initGame();
  renderAll();

  app.ticker.add((delta) => {
    renderToggle(delta);
  });  
}

init();
