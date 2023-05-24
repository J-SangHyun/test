export const BOARD_SIZE = 7;

export const board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0));
export const score = [2, 2];
export let toggle = undefined;
export let turn = 1;

export function init_game() {
  // init board
  for(let x = 0; x < BOARD_SIZE; x++) {
    for(let y = 0; y < BOARD_SIZE; y++) {
      board[x][y] = 0;
    }
  }
  board[0][0] = board[BOARD_SIZE-1][BOARD_SIZE-1] = 1;
  board[0][BOARD_SIZE-1] = board[BOARD_SIZE-1][0] = 2;

  // init others
  score = [2, 2];
  toggle = undefined;
  turn = 1;
}


