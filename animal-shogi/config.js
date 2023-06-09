export const boardShort = 3, boardLong = 4;
export const toggleColor = [[0xF599A4, 0xFBD9DD], [0x8EBCCE, 0xD4E5EC]];

export const PIECE = {
  CHICK: 1,
  HEN: 2,
  ELEPHANT: 3,
  GIRAFFE: 4,
  LION: 5
};

export const MOVES = {
  CHICK: [[0, 1, 0], [0, 0, 0], [0, 0, 0]],
  HEN: [[1, 1, 1], [1, 0, 1], [0, 1, 0]],
  ELEPHANT: [[1, 0, 1], [0, 0, 0], [1, 0, 1]],
  GIRAFFE: [[0, 1, 0], [1, 0, 1], [0, 1, 0]],
  LION: [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
};
