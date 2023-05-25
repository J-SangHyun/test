import { app } from './main.js';
import { boardSize, board, toggle, score } from './game.js';

let portrait = true;
let boardRenderSize = 0;
let boardBlocks = undefined;


export function renderAll() {
  calcRenderVariables();
  renderBoardLine();
  renderPieces();

}

function calcRenderVariables() {
  const width = app.renderer.width;
  const height = app.renderer.height;
  portrait = height >= width;
  boardRenderSize = Math.min(width, height);
  return 1;
}

function renderBoardLine() {
  const blockSize = Math.floor(boardRenderSize / boardSize);
  
  const boardLine = new PIXI.Graphics();
  //playerRect.lineStyle({width: 0});
  //playerRect.beginFill(playerBackground[player-1]);
  //playerRect.drawRect(0, 0, vertical ? width : width/2, vertical ? height/2 : height);
  //playerRect.x = vertical ? 0 : (player-1)*(width-width/2);
  //playerRect.y = vertical ? (2-player)*(height-height/2) : 0;
  //app.stage.addChild(playerRect);
}

function renderPieces() {

}

function renderAction() {

}

function renderToggle() {
  if(toggle != undefined) {
    const { x, y } = toggle;
    
  }
}
