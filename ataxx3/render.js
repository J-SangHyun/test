import { app, width, height, char1Texture, char2Texture, toggleTexture } from './main.js';
import { boardSize, board, toggle, score, clickBlock, distance, turn } from './game.js';

let portrait = true;
let scoreMargin = 0;
let boardRenderSize = 0;
let boardBlocks = Array.from(Array(boardSize), () => Array(boardSize).fill(undefined));
let boardPieces = Array.from(Array(boardSize), () => Array(boardSize).fill(undefined));
let boardToggle = Array.from(Array(boardSize), () => Array(boardSize).fill(undefined));
let toggleSprite = undefined;
let blockSize = 0;
let pieceSize = 0;
let xPad = 0;
let yPad = 0;
let piecePad = 0;
const toggleColor = [[0xF599A4, 0xFBD9DD], [0x8EBCCE, 0xD4E5EC]];
let score1;
let score2;
let turn1;
let turn2;

export function renderAll() {
  removeAll();
  calcRenderVariables();

  turn1 = new PIXI.Graphics();
  turn2 = new PIXI.Graphics();

  turn1.lineStyle({width: 0});
  turn1.beginFill(0xF599A4);
  turn1.drawRect(0, 0, portrait ? width : width / 2, portrait ? height / 2 : height);
  turn1.endFill();
  turn1.x = 0;
  turn1.y = portrait ? height / 2 : 0;

  turn2.lineStyle({width: 0});
  turn2.beginFill(0x8EBCCE);
  turn2.drawRect(0, 0, portrait ? width : width / 2, portrait ? height / 2 : height);
  turn2.endFill();
  turn2.x = portrait ? 0 : width / 2;
  turn2.y = 0;

  app.stage.addChild(turn1);
  app.stage.addChild(turn2);
  renderTurn();
  renderBoard();
  renderToggleBlock();
  score1 = new PIXI.Text(String(score[1]));
  score2 = new PIXI.Text(String(score[2]));
  score1.x = portrait ? width / 2 : width - scoreMargin / 2;
  score1.y = portrait ? height - scoreMargin / 2 : height / 2;
  score2.x = portrait ? width / 2 : scoreMargin / 2;
  score2.y = portrait ? scoreMargin / 2 : height / 2;
  app.stage.addChild(score1);
  app.stage.addChild(score2);
  renderScore();
}

export function initRender() {
  boardBlocks = Array.from(Array(boardSize), () => Array(boardSize).fill(undefined));
  boardPieces = Array.from(Array(boardSize), () => Array(boardSize).fill(undefined));
  boardToggle = Array.from(Array(boardSize), () => Array(boardSize).fill(undefined));
  toggleSprite = undefined;
}

function removeAll() {
  while(app.stage.children.length > 0) {
    let child = app.stage.getChildAt(0); 
    app.stage.removeChild(child);
  }
  toggleSprite = undefined;
}

function calcRenderVariables() {
  portrait = height >= width;
  scoreMargin = Math.max(Math.floor(Math.max(width, height) / 8), Math.floor(Math.abs((width - height) / 2)));
  boardRenderSize = Math.max(width, height) - 2 * scoreMargin;

  blockSize = Math.floor(boardRenderSize / (boardSize + 1));
  pieceSize = Math.floor(blockSize * 8 / 10);
  xPad = Math.floor(width / 2 - blockSize * boardSize / 2);
  yPad = Math.floor(height / 2 - blockSize * boardSize / 2);
  piecePad = Math.floor((blockSize - pieceSize) / 2);
}

export function renderTurn() {
  turn1.visible = turn == 1;
  turn2.visible = turn == 2;
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

      if(board[i][j] == 1) {
        const newPiece = new PIXI.Sprite(char1Texture);
        newPiece.width = pieceSize;
        newPiece.height = pieceSize;
        newPiece.x = xPad + i * blockSize + piecePad;
        newPiece.y = yPad + j * blockSize + piecePad;
        app.stage.addChild(newPiece);
        boardPieces[i][j] = newPiece;
      }
      else if(board[i][j] == 2) {
        const newPiece = new PIXI.Sprite(char2Texture);
        newPiece.width = pieceSize;
        newPiece.height = pieceSize;
        newPiece.x = xPad + i * blockSize + piecePad;
        newPiece.y = yPad + j * blockSize + piecePad;
        app.stage.addChild(newPiece);
        boardPieces[i][j] = newPiece;
      }
    }
  }
}

export function renderAction(x, y, i, j, d) {
  const newPiece = new PIXI.Sprite(turn == 1 ? char1Texture : char2Texture);
  newPiece.width = pieceSize;
  newPiece.height = pieceSize;
  newPiece.x = xPad + i * blockSize + piecePad;
  newPiece.y = yPad + j * blockSize + piecePad;
  app.stage.addChild(newPiece);
  boardPieces[i][j] = newPiece;
  if(d == 2) {
    app.stage.removeChild(boardPieces[x][y]);
    delete boardPieces[x][y];
  }

  for(let k = Math.max(0, i-1); k < Math.min(boardSize, i+2); k++) {
    for(let l = Math.max(0, j-1); l < Math.min(boardSize, j+2); l++) {
      if(boardPieces[k][l] != undefined) {
        boardPieces[k][l].texture = turn == 1 ? char1Texture : char2Texture;
      }
    }
  }
}

export function renderToggle(delta) {
  if(toggleSprite == undefined) {
    toggleSprite = new PIXI.Sprite(toggleTexture);
    app.stage.addChild(toggleSprite);
  }

  if(toggle == undefined) {
    if(toggleSprite.visible) {
      toggleSprite.visible = false;
    }
  }
  else {
    const x = toggle[0];
    const y = toggle[1];
    toggleSprite.x = xPad + x * blockSize + Math.floor(blockSize / 2);
    toggleSprite.y = yPad + y * blockSize + Math.floor(blockSize / 2);
    toggleSprite.width = Math.floor(95 * blockSize / 100);
    toggleSprite.height = Math.floor(95 * blockSize / 100);
    toggleSprite.anchor.set(0.5);
    toggleSprite.rotation += 0.02 * delta;
    toggleSprite.visible = true;
  }
}

export function renderToggleBlock() {
  if(toggle != undefined) {
    const x = toggle[0];
    const y = toggle[1];
    let d = 0;
    for(let i = -2; i < 3; i++) {
      for(let j = -2; j < 3; j++) {
        if(x + i < 0 || x + i >= boardSize || y + j < 0 || y + j >= boardSize) {
          continue;
        }
        d = distance(x, y, x+i, y+j);
        if(board[x+i][y+j] != 0 || d == 0 || d > 2) {
          continue;
        }
        const newBlock = new PIXI.Graphics();
        newBlock.lineStyle({width: 4, color: 0x000000, alpha: 1});
        newBlock.beginFill(toggleColor[turn-1][d-1]);
        newBlock.drawRect(0, 0, blockSize, blockSize);
        newBlock.endFill();
        newBlock.x = xPad + (x + i) * blockSize;
        newBlock.y = yPad + (y + j) * blockSize;
        app.stage.addChild(newBlock);
        boardToggle[x+i][y+j] = newBlock;
      }
    }
  }
}

export function renderUnToggle(x, y) {
  for(let i = -2; i < 3; i++) {
    for(let j = -2; j < 3; j++) {
      if(x + i < 0 || x + i >= boardSize || y + j < 0 || y + j >= boardSize) {
        continue;
      }
      if(boardToggle[x+i][y+j] != undefined) {
        app.stage.removeChild(boardToggle[x+i][y+j]);
        delete boardToggle[x+i][y+j];
        boardToggle[x+i][y+j] = undefined;
      }
    }
  }
}

export function renderEnd() {
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      if(boardPieces[i][j] == undefined) {
        const newPiece = new PIXI.Sprite(turn == 1 ? char1Texture : char2Texture);
        newPiece.width = pieceSize;
        newPiece.height = pieceSize;
        newPiece.x = xPad + i * blockSize + piecePad;
        newPiece.y = yPad + j * blockSize + piecePad;
        app.stage.addChild(newPiece);
        boardPieces[i][j] = newPiece;
      }
    }
  }
}


export function renderScore() {
  score1.text = String(score[1]);
  score2.text = String(score[2]);
}
