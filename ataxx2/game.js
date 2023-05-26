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
  if(toggle == undefined) {
    toggle = [i, j];
  }
  else {
    const {x, y} = toggle;



    toggle = undefined;
  }
}

function distance(x1, y1, x2, y2) {
  return Math.max(x1 - x2, x2 - x1, y1 - y2, y2 - y1);
}


