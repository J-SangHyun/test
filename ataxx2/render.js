import { app } from './main.js';
import { boardSize, board, toggle, score, clickBlock } from './game.js';

let width = 0;
let height = 0;
let portrait = true;
let scoreMargin = 0;
let boardRenderSize = 0;
let boardBlocks = Array.from(Array(boardSize), () => Array(boardSize));;
let boardPieces = Array.from(Array(boardSize), () => Array(boardSize));;


export function renderAll() {
  removeAll();
  calcRenderVariables();
  renderBoard();
}

function removeAll() {
  while(app.stage.children.length > 0) {
    let child = app.stage.getChildAt(0); 
    app.stage.removeChild(child);
  }
}

function calcRenderVariables() {
  width = app.renderer.width;
  height = app.renderer.height;
  console.log(width, height)
  portrait = height >= width;
  scoreMargin = Math.max(Math.floor(Math.max(width, height) / 8), Math.floor(Math.abs((width - height) / 2)));
  boardRenderSize = Math.max(width, height) - 2 * scoreMargin;
}

function renderTurn() {
  return;
}

function renderBoard() {
  const blockSize = Math.floor(boardRenderSize / (boardSize + 1));
  const pieceSize = Math.floor(blockSize * 7 / 10);
  const xPad = Math.floor(width / 2 - blockSize * boardSize / 2);
  const yPad = Math.floor(height / 2 - blockSize * boardSize / 2);
  const piecePad = Math.floor((blockSize - pieceSize) / 2);
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      boardBlocks[i][j] = new PIXI.Graphics();
      boardBlocks[i][j].lineStyle({width: 4, color: 0x000000, alpha: 1});
      boardBlocks[i][j].beginFill(0xFFFFFF);
      boardBlocks[i][j].drawRect(0, 0, blockSize, blockSize);
      boardBlocks[i][j].endFill();
      boardBlocks[i][j].x = xPad + i * blockSize;
      boardBlocks[i][j].y = yPad + j * blockSize;
      boardBlocks[i][j].eventMode = 'static';
      boardBlocks[i][j].on('pointerdown', (event) => { clickBlock(i, j); });
      app.stage.addChild(boardBlocks[i][j]);

      if(board[i][j] == 1) {
        
      } 
    }
  }
}

function renderAction() {

}

function renderToggle() {
  if(toggle != undefined) {
    const { x, y } = toggle;
    
  }
}

function renderScore() {

}

