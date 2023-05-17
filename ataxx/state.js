class AtaxxAction {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.distance = this._distance(x1, y1, x2, y2);
  }

  _distance(x1, y1, x2, y2) {
    return Math.max(x1 - x2, x2 - x1, y1 - y2, y2 - y1);
  }
}

class AtaxxState {
  constructor(board, boardSize, turn) {
    this.board = board;
    this.boardSize = boardSize;
    this.turn = turn;

    this.possibleActions = [];
    this._updatePossibleActions();
  }

  _updatePossibleActions() {
    const actions = [];
    const dupDirection = [];
    const movDirection = [];

    for(let i = -2; i < 3; i++) {
      for(let j = -2; j < 3; j++) {
        if(i == -2 || i == 2 || j == -2 || j == 2) {
          movDirection.push([i, j]);
        }
        else if(i == -1 || i == 1 || j == -1 || j == 1) {
          dupDirection.push([i, j]);
        }
      }
    }

    let xDir, yDir, xPos, yPos;
    for(let i = 0; i < this.boardSize; i++) {
      for(let j = 0; j < this.boardSize; j++) {
        if(this.board[i][j] == 0) {
          for(let k = 0; k < dupDirection.length; k++) {
            [xDir, yDir] = dupDirection[k];
            xPos = Math.max(0, Math.min(this.boardSize - 1, i + xDir));
            yPos = Math.max(0, Math.min(this.boardSize - 1, j + yDir));
            if(this.board[xPos][yPos] == this.turn) {
              this.possibleActions.push(new AtaxxAction(xPos, yPos, i, j));
              break;
            }
          }
        }
      }
    }

    for(let i = 0; i < this.boardSize; i++) {
      for(let j = 0; j < this.boardSize; j++) {
        if(this.board[i][j] == 0) {
          for(let k = 0; k < movDirection.length; k++) {
            [xDir, yDir] = movDirection[k];
            xPos = Math.max(0, Math.min(this.boardSize - 1, i + xDir));
            yPos = Math.max(0, Math.min(this.boardSize - 1, j + yDir));
            if(this.board[xPos][yPos] == this.turn) {
              this.possibleActions.push(new AtaxxAction(xPos, yPos, i, j));
            }
          }
        }
      }
    }
    this.possibleActions = possibleActions;
  }

  isTerminal() {
    return this.possibleActions.length == 0;
  }

  whoIsWinner() {
    const playerScores = [0, 0, 0];
    for(let i = 0; i < this.boardSize; i++) {
      for(let j = 0; j < this.boardSize; j++) {
        
  }
}
