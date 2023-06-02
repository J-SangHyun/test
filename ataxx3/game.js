import { width, height } from './main.js';

const boardSize = 7;
const board = Array.from(Array(boardSize), () => Array(boardSize));
const boardBlocks = Array.from(Array(boardSize), () => Array(boardSize));
const boardPieces = Array.from(Array(boardSize), () => Array(boardSize));
const boardToggle = Array.from(Array(boardSize), () => Array(boardSize));
const score = [2, 2];
let toggle, player;

let pieceTexture, toggleTexture;
let portrait = true;
let scoreMargin = 0;
let boardRenderSize = 0;
let toggleSprite = undefined;
let blockSize, pieceSize;
let xPad = 0;
let yPad = 0;
let piecePad = 0;
const toggleColor = [[0xF599A4, 0xFBD9DD], [0x8EBCCE, 0xD4E5EC]];
let score1;
let score2;
let turn1;
let turn2;

export function loadTextures() {
  pieceTexture = [PIXI.Texture.from('./assets/character2.png'),
                  PIXI.Texture.from('./assets/character2.png')]
  toggleTexture = PIXI.Texture.from('./assets/toggle.png')
}

export function initGame() {
  // init board
  for(let x = 0; x < boardSize; x++) {
    for(let y = 0; y < boardSize; y++) {
      board[x][y] = 0;
      boardBlocks[x][y] = undefined;
      boardPieces[x][y] = undefined;
      boardToggle[x][y] = undefined;
    }
  }

  // initial pieces
  addPiece(0, 0, 1);
  addPiece(boardSize-1, boardSize-1, 1);
  addPiece(0, boardSize-1, 2);
  addPiece(boardSize-1, 0, 2);

  // init others
  score[0] = score[1] = 2;
  toggle = undefined;
  player = 1;
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

function addPiece(x, y, turn) {
  board[x][y] = turn;
  const newPiece = new PIXI.Sprite(pieceTexture[turn-1]);
  newPiece.width = pieceSize;
  newPiece.height = pieceSize;
  newPiece.x = xPad + i * blockSize + piecePad;
  newPiece.y = yPad + j * blockSize + piecePad;
  app.stage.addChild(newPiece);
}

function removePiece(x, y) {

}

export function clickBlock(i, j) {
  if(board[i][j] == player) {
    if(toggle != undefined) {
      const x = toggle[0];
      const y = toggle[1];
      renderUnToggle(x, y);
    }
    toggle = [i, j];
    renderToggleBlock();
  }
  else if(board[i][j] == 0 && toggle != undefined) {
    const x = toggle[0];
    const y = toggle[1];
    const d = distance(x, y, i, j);
    if(d <= 2) {
      renderUnToggle(x, y);
      action(x, y, i, j, d);
      toggle = undefined;
    }
  }
}

function distance(x1, y1, x2, y2) {
  return Math.max(x1 - x2, x2 - x1, y1 - y2, y2 - y1);
}

function action(x, y, i, j, d) {
  if(d == 1) {
    board[i][j] = player;
  }
  else if (d == 2) {
    board[x][y] = 0;
    board[i][j] = player;
  }

  for(let k = Math.max(0, i-1); k < Math.min(boardSize, i+2); k++) {
    for(let l = Math.max(0, j-1); l < Math.min(boardSize, j+2); l++) {
      if(board[k][l] != 0) {
        board[k][l] = player;
      }
    }
  }
  renderAction(x, y, i, j, d);
  if(isGameEnd()) {
    renderEnd();
  }
  updateScore();
  renderScore();
  player = 3 - player;
  renderTurn();
}

function isGameEnd() {
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      if(board[i][j] == 0) {
        for(let k = Math.max(0, i-2); k < Math.min(boardSize, i+3); k++) {
          for(let l = Math.max(0, j-2); l < Math.min(boardSize, j+3); l++) {
            if(board[k][l] == 3 - player) {
              return false;
            }
          }
        }
      }
    }
  }
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      if(board[i][j] == 0) {
        board[i][j] = player;
      }
    }
  }
  return true;
}

function updateScore() {
  score[1] = 0;
  score[2] = 0;
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      if(board[i][j] != 0) {
        score[board[i][j]]++;
      }
    }
  }
}
