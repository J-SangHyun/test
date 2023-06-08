import { app, width, height } from './main.js';
import { boardShort, boardLong, toggleColor } from './config.js';
import { board, player, toggle, clickBlock } from './game.js';
import { distance } from './utils.js';

let boardBlocks, boardPieces, boardToggle;
let turnBlocks, scoreBlocks;

let pieceTexture;

let portrait, catchMargin, boardRenderShort, boardRenderLong, blockSize, pieceSize;
let boardxPad, boardyPad;


export function loadTextures() {
  pieceTexture = [PIXI.Texture.from('./assets/chick.png'),
                  PIXI.Texture.from('./assets/hen.png'),
                  PIXI.Texture.from('./assets/elephant.png'),
                  PIXI.Texture.from('./assets/giraffe.png'),
                  PIXI.Texture.from('./assets/lion.png')];
}

export function initRender() {
  boardBlocks = Array.from(Array(boardLong), () => Array(boardShort).fill(undefined));
  boardPieces = Array.from(Array(boardLong), () => Array(boardShort).fill(undefined));
  //boardCatchBlocks1 = Array.from(Array(2), () => Array(boardWidth).fill(undefined));
  //boardCatchBlocks2 = Array.from(Array(2), () => Array(boardWidth).fill(undefined));
  //boardCatchPieces1 = Array.from(Array(2), () => Array(boardWidth).fill(undefined));
  //boardCatchPieces2 = Array.from(Array(2), () => Array(boardWidth).fill(undefined));
  boardToggle = Array.from(Array(boardLong), () => Array(boardShort).fill(undefined));
  turnBlocks = [undefined, undefined];
}

export function renderAll() {
  removeAll();
  initRender();
  calcRenderVariables();
  renderTurn();
  renderBoard();
  renderPieces();
  renderCatchPieces();
  renderToggleBlock();
}

function removeAll() {
  while(app.stage.children.length > 0) {
    let child = app.stage.getChildAt(0);
    app.stage.removeChild(child);
  }
}

function calcRenderVariables() {
  portrait = height >= width;
  const short = portrait ? width : height;
  const long = portrait ? height : width;
  blockSize = Math.min(short / (boardShort + 1), long / (boardLong + 3));
  boardRenderShort = short * (boardShort + 1);
  boardRenderLong = long * (boardLong + 1);
  catchMargin = 1;
  pieceSize = 0.8 * blockSize;
  boardxPad = width / 2 - blockSize * (portrait ? boardShort : boardLong) / 2;
  boardyPad = height / 2 - blockSize * (portrait ? boardLong : boardShort) / 2;
}

export function renderTurn() {
  for(let i = 0; i < 2; i++) {
    if(turnBlocks[i] == undefined) {
      const turnRect = new PIXI.Graphics();
      turnRect.lineStyle({width: 0});
      turnRect.beginFill(toggleColor[i][0]);
      turnRect.drawRect(0, 0, portrait ? width : width / 2, portrait ? height / 2 : height);
      turnRect.endFill();
      turnRect.x = portrait ? 0 : i * width / 2;
      turnRect.y = portrait ? (1 - i) * height / 2 : 0;
      app.stage.addChild(turnRect);
      turnBlocks[i] = turnRect;
    }
    turnBlocks[i].visible = (player == i+1);
  }
}

function renderBoard() {
  for(let i = 0; i < boardLong; i++) {
    for(let j = 0; j < boardShort; j++) {
      const newBlock = new PIXI.Graphics();
      newBlock.lineStyle({width: 4, color: 0x000000, alpha: 1});
      newBlock.beginFill(0xFFFFFF);
      newBlock.drawRect(0, 0, blockSize, blockSize);
      newBlock.endFill();
      newBlock.x = boardxPad + (portrait ? j : i) * blockSize;
      newBlock.y = boardyPad + (portrait ? boardLong - i - 1 : j) * blockSize;
      newBlock.eventMode = 'static';
      newBlock.on('pointerdown', (event) => { clickBlock(i, j); });
      app.stage.addChild(newBlock);
      boardBlocks[i][j] = newBlock;
    }
  }
}

function renderPieces() {
  for(let i = 0; i < boardLong; i++) {
    for(let j = 0; j < boardShort; j++) {
      if(board[i][j] != 0) {
        addPiece(i, j, board[i][j]);
      }
    }
  }
}

function renderCatchPieces() {
  return;
}

export function renderToggleBlock() {
  if(toggle != undefined) {
    let x, y, d;
    [x, y] = toggle;
    for(let i = Math.max(0, x-2); i < Math.min(boardSize, x+3); i++) {
      for(let j = Math.max(0, y-2); j < Math.min(boardSize, y+3); j++) {
        d = distance(x, y, i, j);
        if(board[i][j] == 0 && d != 0) {
          const newBlock = new PIXI.Graphics();
          newBlock.lineStyle({width: 4, color: 0x000000, alpha: 1});
          newBlock.beginFill(toggleColor[player-1][d-1]);
          newBlock.drawRect(0, 0, blockSize, blockSize);
          newBlock.endFill();
          newBlock.x = xPad + i * blockSize;
          newBlock.y = yPad + j * blockSize;
          app.stage.addChild(newBlock);
          boardToggle[i][j] = newBlock;
        }
      }
    }
  }
}

export function removeToggleBlock(x, y) {
  for(let i = Math.max(0, x-2); i < Math.min(boardSize, x+3); i++) {
    for(let j = Math.max(0, y-2); j < Math.min(boardSize, y+3); j++) {
      if(boardToggle[i][j] != undefined) {
        app.stage.removeChild(boardToggle[i][j]);
        delete boardToggle[i][j];
        boardToggle[i][j] = undefined;
      }
    }
  }
}

export function addPiece(x, y, piece) {
  const type = (piece - 1) % 5;
  const turn = (piece - 1 - type) / 5 + 1;
  const newPiece = new PIXI.Sprite(pieceTexture[type]);
  newPiece.width = pieceSize;
  newPiece.height = pieceSize;
  newPiece.x = boardxPad + ((portrait ? y : x) + 0.5) * blockSize;
  newPiece.y = boardyPad + ((portrait ? boardLong - x - 1 : y) + 0.5) * blockSize;
  newPiece.anchor.set(0.5);
  newPiece.rotation = portrait ? (turn - 1) * Math.PI : (1.5 - turn) * Math.PI;
  app.stage.addChild(newPiece);
  boardPieces[x][y] = newPiece;
}

export function removePiece(x, y) {
  app.stage.removeChild(boardPieces[x][y]);
  boardPieces[x][y] = undefined;
}

export function renderLoop(delta) {
  return;
}
