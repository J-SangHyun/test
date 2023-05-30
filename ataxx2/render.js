import { app, width, height, char1Texture, char2Texture, toggleTexture } from './main.js';
import { boardSize, board, toggle, score, clickBlock, distance } from './game.js';

let portrait = true;
let scoreMargin = 0;
let boardRenderSize = 0;
let boardBlocks = Array.from(Array(boardSize), () => Array(boardSize));
let boardPieces = Array.from(Array(boardSize), () => Array(boardSize));
let toggleSprite = undefined;
let blockSize = 0;
let pieceSize = 0;
let xPad = 0;
let yPad = 0;
let piecePad = 0;


export function renderAll() {
  removeAll();
  calcRenderVariables();
  renderBoard();
  renderToggleBlock();
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

function renderTurn() {
  return;
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

export function renderAction(x, y, i, j, d, turn) {
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
    toggleSprite.width = blockSize;
    toggleSprite.height = blockSize;
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
        newBlock.beginFill(d == 1 ? 0xFFFFFF : 0xFBD9DD);
        newBlock.drawRect(0, 0, blockSize, blockSize);
        newBlock.endFill();
        newBlock.x = xPad + (x + i) * blockSize;
        newBlock.y = yPad + (y + j) * blockSize;
        newBlock.eventMode = 'static';
        newBlock.on('pointerdown', (event) => { clickBlock(x+i, y+j); });
        app.stage.removeChild(boardPieces[x+i][y+j]);
        delete boardPieces[x+i][y+j];
        app.stage.addChild(newBlock);
        boardBlocks[x+i][y+j] = newBlock;
      }
    }
  }
}


function renderScore() {

}
