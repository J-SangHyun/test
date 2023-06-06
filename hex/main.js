import { loadTextures, initRender, renderAll, renderLoop } from './render.js'
import { initGame } from './game.js';

export const app = new PIXI.Application({
  resolution: window.devicePixelRatio,
  backgroundColor: 0xFFFFFF
});

export let width, height;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  app.renderer.view.style.width = `${width}px`;
  app.renderer.view.style.height = `${height}px`;
  window.scrollTo(0, 0);
  app.renderer.resize(width, height);
  renderAll();
}

function init() {
  loadTextures();
  document.body.appendChild(app.view);
  window.addEventListener('resize', resize);
  initRender();
  initGame();
  resize();

  app.ticker.add((delta) => {
    renderLoop(delta);
  });  
}

init();
