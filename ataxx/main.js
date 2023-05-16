import { init_board } from "./render.js";


const app = new PIXI.Application({
  resolution: Math.max(window.devicePixelRatio, 2),
  backgroundColor: 0x000000,
});

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  app.renderer.view.style.width = `${width}px`;
  app.renderer.view.style.height = `${height}px`;
  window.scrollTo(0, 0);
  app.renderer.resize(width, height);
}

async function init() {
  document.body.appendChild(app.view);
  window.addEventListener('resize', resize);
  resize();
  init_board();
}

init();

const char1_texture = PIXI.utils.TextureCache["./assets/char1.png"];
const char2_texture = PIXI.utils.TextureCache["./assets/char2.png"];
//app.stage.addChild(charater1)
//app.stage.addChild(charater2)
// Create a new Graphics object and add it to the scene
//app.stage.interactive = true;
//const boardDrawer = new PIXI.Graphics();
//app.stage.addChild(boardDrawer);
//
//// Move it to the beginning of the line
//boardDrawer.position.set(100, 100);
//
//// Draw the line (endPoint should be relative to myGraph's position)
//boardDrawer.lineStyle(30, 0x000000)
//       .moveTo(0, 0)
//       .lineTo(50, 0);

const line = new PIXI.Graphics();
line.lineStyle({width: 4, color: 0xFFFFFF, alpha: 1});
line.moveTo(0, 0);
line.lineTo(window.innerWidth, window.innerHeight);
line.x = 0;
line.y = 0;
app.stage.addChild(line);

