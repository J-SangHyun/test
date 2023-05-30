import { renderAction, renderToggleBlock, renderUnToggle, renderEnd, renderScore } from './render.js';

export const boardSize = 7;

export const board = Array.from(Array(boardSize), () => Array(boardSize).fill(0));
export const score = [0, 2, 2];
export let toggle = undefined;
export let turn = 1;

export function initGame() {
  // init board
  for(let x = 0; x < boardSize; x++) {
    for(let y = 0; y < boardSize; y++) {
      board[x][y] = 0;
    }
  }
  board[0][0] = board[boardSize-1][boardSize-1] = 1;
  board[0][boardSize-1] = board[boardSize-1][0] = 2;

  // init others
  score[1] = 2;
  score[2] = 2;
  toggle = undefined;
  turn = 1;
}

export function clickBlock(i, j) {
  if(board[i][j] == turn) {
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

export function distance(x1, y1, x2, y2) {
  return Math.max(x1 - x2, x2 - x1, y1 - y2, y2 - y1);
}

function action(x, y, i, j, d) {
  if(d == 1) {
    board[i][j] = turn;
  }
  else if (d == 2) {
    board[x][y] = 0;
    board[i][j] = turn;
  }

  for(let k = Math.max(0, i-1); k < Math.min(boardSize, i+2); k++) {
    for(let l = Math.max(0, j-1); l < Math.min(boardSize, j+2); l++) {
      if(board[k][l] != 0) {
        board[k][l] = turn;
      }
    }
  }
  renderAction(x, y, i, j, d);
  if(isGameEnd()) {
    renderEnd();
  }
  updateScore();
  renderScore();
  turn = 3 - turn;
}

function isGameEnd() {
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      if(board[i][j] == 0) {
        for(let k = Math.max(0, i-2); k < Math.min(boardSize, i+3); k++) {
          for(let l = Math.max(0, j-2); l < Math.min(boardSize, j+3); l++) {
            if(board[k][l] == 3 - turn) {
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
        board[i][j] = turn;
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
