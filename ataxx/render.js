export const BOARD_SIZE = 7;
export const board = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(0))

export function init_board() {
  for(let i = 0; i < BOARD_SIZE; i++) {
    for(let j = 0; j <BOARD_SIZE; j++) {
      board[i][j] = 0;
    }
  }
  board[0][0] = 1;
  board[BOARD_SIZE-1][BOARD_SIZE-1] = 1;
  board[0][BOARD_SIZE-1] = 2;
  board[BOARD_SIZE-1][0] = 2;
}

export function render_board(view) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  
}
