import { app, width, height } from './main.js';
import { boardSize, toggleColor } from './config.js';
import { board, player, toggle, score, clickBlock } from './game.js';
import { distance } from './utils.js';

let boardBlocks, boardPieces, boardToggle;
let turnBlocks, scoreBlocks;

let pieceTexture, toggleTexture;
let toggleSprite;

let portrait, scoreMargin, boardRenderSize, blockSize, pieceSize;
let xPad, yPad;


export function loadTextures() {
  pieceTexture = [PIXI.Texture.from('./assets/character1.png'),
                  PIXI.Texture.from('./assets/character2.png')];
  toggleTexture = PIXI.Texture.from('./assets/toggle.png');
}

export function initRender() {
  boardBlocks = Array.from(Array(boardSize), () => Array(boardSize).fill(undefined));
  boardPieces = Array.from(Array(boardSize), () => Array(boardSize).fill(undefined));
  boardToggle = Array.from(Array(boardSize), () => Array(boardSize).fill(undefined));
  toggleSprite = undefined;
  turnBlocks = [undefined, undefined];
  scoreBlocks = [undefined, undefined];
}

export function renderAll() {
  removeAll();
  initRender();
  calcRenderVariables();
  renderTurn();
  renderBoard();
  renderPieces();
  renderToggleBlock();
  renderScore();
}

function removeAll() {
  while(app.stage.children.length > 0) {
    let child = app.stage.getChildAt(0);
    app.stage.removeChild(child);
  }
}

function calcRenderVariables() {
  portrait = height >= width;
  scoreMargin = Math.max(Math.max(width, height) / 8, Math.abs((width - height) / 2));
  boardRenderSize = Math.max(width, height) - 2 * scoreMargin;

  blockSize = boardRenderSize / (boardSize + 1);
  pieceSize = 0.8 * blockSize;
  xPad = width / 2 - blockSize * boardSize / 2;
  yPad = height / 2 - blockSize * boardSize / 2;
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
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      const newBlock = new PIXI.Graphics();
      newBlock.lineStyle({width: 4, color: 0x000000, alpha: 1});
      newBlock.beginFill(0xFFFFFF);
      newBlock.drawRect(0, 0, blockSize, blockSize);
      newBlock.endFill();
      newBlock.x = xPad + i * blockSize;
      newBlock.y = yPad + j * blockSize;
      newBlock.eventMode = 'static';
      newBlock.on('pointerdown', (event) => { clickBlock(i, j); });
      app.stage.addChild(newBlock);
      boardBlocks[i][j] = newBlock;
    }
  }
}

function renderPieces() {
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      if(board[i][j] != 0) {
        addPiece(i, j, board[i][j]);
      }
    }
  }
}

export function renderToggle(delta) {
  if(toggleSprite == undefined) {
    toggleSprite = new PIXI.Sprite(toggleTexture);
    toggleSprite.width = 0.95 * blockSize;
    toggleSprite.height = 0.95 * blockSize;
    toggleSprite.anchor.set(0.5);
    app.stage.addChild(toggleSprite);
  }

  if(toggle == undefined) {
    toggleSprite.visible = false;
  }
  else {
    toggleSprite.x = xPad + toggle[0] * blockSize + blockSize / 2;
    toggleSprite.y = yPad + toggle[1] * blockSize + blockSize / 2;
    toggleSprite.rotation += 0.02 * delta;
    toggleSprite.visible = true;
  }
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

export function addPiece(x, y, turn) {
  const newPiece = new PIXI.Sprite(pieceTexture[turn-1]);
  newPiece.width = pieceSize;
  newPiece.height = pieceSize;
  newPiece.x = xPad + (x + 0.5) * blockSize;
  newPiece.y = yPad + (y + 0.5) * blockSize;
  newPiece.anchor.set(0.5);
  newPiece.rotation = portrait ? (turn - 1) * Math.PI : (1.5 - turn) * Math.PI;
  app.stage.addChild(newPiece);
  boardPieces[x][y] = newPiece;
}

export function removePiece(x, y) {
  app.stage.removeChild(boardPieces[x][y]);
  boardPieces[x][y] = undefined;
}

export function renderScore() {
  for(let i = 0; i < 2; i++) {
    if(scoreBlocks[i] != undefined) {
      app.stage.removeChild(scoreBlocks[i]);
      scoreBlocks[i] = undefined;
    }
    const scoreText = new PIXI.Text(String(score[i]));
    let scale = Math.min(scoreMargin / 2, 1.5 * blockSize) / scoreText.height;
    scoreText.height *= scale;
    scoreText.width *= scale;
    scoreText.x = portrait ? width / 2 : i * width + (1 - 2*i) * scoreMargin / 2;
    scoreText.y = portrait ? (1 - i) * height + (2*i - 1) * scoreMargin / 2 : height / 2;
    scoreText.rotation = portrait ? i * Math.PI : (0.5 - i) * Math.PI;
    scoreText.anchor.set(0.5);
    app.stage.addChild(scoreText);
    scoreBlocks[i] = scoreText;
  }
}

export function renderLoop(delta) {
  renderToggle(delta);
  return;
}
