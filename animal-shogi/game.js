import { boardShort, boardLong, PIECE } from './config.js'
import * as RENDER from './render.js';
import { distance } from './utils.js';

export const board = Array.from(Array(boardLong), () => Array(boardShort));
export let toggle, player;

export function initGame() {
  // init board
  for(let x = 0; x < boardLong; x++) {
    for(let y = 0; y < boardShort; y++) {
      board[x][y] = 0;
    }
  }

  // initial pieces
  board[0][0] = turnAndPiece(1, PIECE.ELEPHANT);
  board[0][1] = turnAndPiece(1, PIECE.LION);
  board[0][2] = turnAndPiece(1, PIECE.GIRAFFE);
  board[1][1] = turnAndPiece(1, PIECE.CHICK);

  board[2][1] = turnAndPiece(2, PIECE.CHICK);
  board[3][0] = turnAndPiece(2, PIECE.GIRAFFE);
  board[3][1] = turnAndPiece(2, PIECE.LION);
  board[3][2] = turnAndPiece(2, PIECE.ELEPHANT);
  //board[0][boardSize-1] = board[boardSize-1][0] = 2;
  //RENDER.addPiece(0, 0, 1);
  //RENDER.addPiece(boardSize-1, boardSize-1, 1);
  //RENDER.addPiece(0, boardSize-1, 2);
  //RENDER.addPiece(boardSize-1, 0, 2);

  // init others
  toggle = undefined;
  player = 1;
}

export function clickBlock(i, j) {
  let x, y;
  console.log(i, j);
  if(board[i][j] == player) {
    if(toggle != undefined) {
      [x, y] = toggle;
      RENDER.removeToggleBlock(x, y);
    }
    toggle = [i, j];
    RENDER.renderToggleBlock();
  }
  else if(board[i][j] == 0 && toggle != undefined) {
    [x, y] = toggle;
    const d = distance(x, y, i, j);
    if(d <= 2) {
      RENDER.removeToggleBlock(x, y);
      action(x, y, i, j, d);
      toggle = undefined;
    }
  }
}

function action(x, y, i, j, d) {
  if(d == 1) {
    board[i][j] = player;
    RENDER.addPiece(i, j, player);
  }
  else if (d == 2) {
    board[x][y] = 0;
    RENDER.removePiece(x, y);
    board[i][j] = player;
    RENDER.addPiece(i, j, player);
  }

  for(let k = Math.max(0, i-1); k < Math.min(boardSize, i+2); k++) {
    for(let l = Math.max(0, j-1); l < Math.min(boardSize, j+2); l++) {
      if(board[k][l] == 3 - player) {
        board[k][l] = player;
        RENDER.removePiece(k, l);
        RENDER.addPiece(k, l, player);
      }
    }
  }
  if(isGameEnd()) {
    //renderEnd();
  }
  updateScore();
  changeTurn();
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
        RENDER.addPiece(i, j, player);
      }
    }
  }
  return true;
}

function updateScore() {
  score[0] = score[1] = 0;
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      if(board[i][j] != 0) {
        score[board[i][j] - 1]++;
      }
    }
  }
  RENDER.renderScore();
}

function changeTurn() {
  player = 3 - player;
  RENDER.renderTurn();
}

function turnAndPiece(turn, piece) {
  return (turn - 1) * 5 + piece;
}
