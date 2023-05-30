import { renderAll, renderToggle } from './render.js';
import { initGame } from './game.js';

export const app = new PIXI.Application({
  resolution: window.devicePixelRatio,
  backgroundColor: 0xFFFFFF
});

export let width, height;
export let char1Texture, char2Texture, toggleTexture;

function loadTextures() {
  char1Texture = PIXI.Texture.from('./assets/character1.png')
  char2Texture = PIXI.Texture.from('./assets/character2.png')
  toggleTexture = PIXI.Texture.from('./assets/toggle.png')
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  app.renderer.view.style.width = `${width}px`;
  app.renderer.view.style.height = `${height}px`;
  window.scrollTo(0, 0);
  app.renderer.resize(width, height);
  renderAll();
}

async function init() {
  loadTextures();
  document.body.appendChild(app.view);
  window.addEventListener('resize', resize);
  initGame();
  resize();

  app.ticker.add((delta) => {
    renderToggle(delta);
  });  
}

init();
