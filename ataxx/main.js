const app = new PIXI.Application({
  resolution: Math.max(window.devicePixelRatio, 2),
  backgroundColor: 0xFFFFFF,
});

let width = 0;
let height = 0;
let vertical = false;

const boardSize = 7;
const board = Array.from(Array(boardSize), () => Array(boardSize).fill(0));
const boardBlocks = Array.from(Array(boardSize), () => Array(boardSize));
const pieces = Array.from(Array(boardSize), () => Array(boardSize));

let playerRect;
let player = 1;
let winner = 0;

const playerPiece = [0xFF0000, 0x00FF00];
const playerToggle = [0x550000, 0x005500];
const playerBackground = [0xFF0000, 0x00FF00];

let toggled = false;
let toggledPos = [0, 0];

function init_board() {
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j <boardSize; j++) {
      board[i][j] = 0;
    }
  }
  board[0][0] = 1;
  board[boardSize-1][boardSize-1] = 1;
  board[0][boardSize-1] = 2;
  board[boardSize-1][0] = 2;
}

function distance(i1, j1, i2, j2) {
  return Math.max(i1 - i2, i2 - i1, j1 - j2, j2 - j1);
}

function clickBlock(i, j) {
  if(board[i][j] == player) {
    toggled = true;
    toggledPos = [i, j];
    render_board();
  }
  else if(toggled && board[i][j] == 0) {
    const d = distance(toggledPos[0], toggledPos[1], i, j);
    if(d <= 2) {
      movePiece(toggledPos[0], toggledPos[1], i, j, d);
      render_board();
    }
  }
}

function isEnd() {

}

function whoIsWinner() {
  let player1Count = 0;
  let player2Count = 0;
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      if(board[i][j] == 1) {
        player1Count += 1;
      }
      else if(board[i][j] == 2) {
        player2Count += 1;
      }
    }
  }
  if(player1Count > player2Count) {
    return 1;
  }
  else if(player1Count < player2Count) {
    return 2;
  }
}

function movePiece(i1, j1, i2, j2, d) {
  if(d == 1) {
    board[i2][j2] = player;
  }
  else if(d == 2) {
    board[i1][j1] = 0;
    board[i2][j2] = player;
  }

  let xpos, ypos;
  for(let i = -1; i < 2; i++) {
    for(let j = -1; j < 2; j++) {
      xpos = Math.min(Math.max(i2 + i, 0), boardSize-1);
      ypos = Math.min(Math.max(j2 + j, 0), boardSize-1);
      if(board[xpos][ypos] == 3 - player) {
        board[xpos][ypos] = player;
      }
    }
  }
  
  
  toggled = false;
  player = 3 - player;
}

function isToggled(i, j) {
  return toggled && toggledPos[0] == i && toggledPos[1] == j;
}

function render_board() {
  while(app.stage.children.length > 0) {
    let child = app.stage.getChildAt(0); 
    app.stage.removeChild(child);
  }
  const blockSize = Math.min(width, height) / (boardSize + 1);

  playerRect = new PIXI.Graphics();
  playerRect.lineStyle({width: 0});
  playerRect.beginFill(playerBackground[player-1]);
  playerRect.drawRect(0, 0, vertical ? width : width/2, vertical ? height/2 : height);
  playerRect.x = vertical ? 0 : (player-1)*(width-width/2);
  playerRect.y = vertical ? (2-player)*(height-height/2) : 0;
  app.stage.addChild(playerRect);

  const xPad = (width - blockSize * boardSize) / 2;
  const yPad = (height - blockSize * boardSize) / 2;
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      boardBlocks[i][j] = new PIXI.Graphics();
      boardBlocks[i][j].lineStyle({width: 4, color: 0x000000, alpha: 1});
      boardBlocks[i][j].beginFill(isToggled(i, j) ? playerToggle[player-1] : 0xFFFFFF);
      boardBlocks[i][j].drawRect(0, 0, blockSize, blockSize);
      boardBlocks[i][j].endFill();
      boardBlocks[i][j].x = xPad + i * blockSize;
      boardBlocks[i][j].y = yPad + j * blockSize;
      boardBlocks[i][j].eventMode = 'static';
      boardBlocks[i][j].on('pointerdown', (event) => { clickBlock(i, j); });
      app.stage.addChild(boardBlocks[i][j]);
    }
  }
  const pieceSize = blockSize * 2 / 5;
  const piecePad = blockSize / 2;
  for(let i = 0; i < boardSize; i++) {
    for(let j = 0; j < boardSize; j++) {
      if(board[i][j] != 0) {
        pieces[i][j] = new PIXI.Graphics();
        pieces[i][j].lineStyle({width: 2, color: 0x000000, alpha: 1});
        pieces[i][j].beginFill(playerPiece[board[i][j]-1]);
        pieces[i][j].drawCircle(0, 0, pieceSize, pieceSize);
        pieces[i][j].endFill();
        pieces[i][j].x = xPad + i * blockSize + piecePad;
        pieces[i][j].y = yPad + j * blockSize + piecePad;
        app.stage.addChild(pieces[i][j]);
      }
    }
  }
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  app.renderer.view.style.width = `${width}px`;
  app.renderer.view.style.height = `${height}px`;
  window.scrollTo(0, 0);
  app.renderer.resize(width, height);
  vertical = height >= width;
  render_board();
}

async function init() {
  init_board();
  document.body.appendChild(app.view);
  window.addEventListener('resize', resize);
  resize();
}

init();
