
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  TETROMINOES,
  collides,
  createInitialState,
  hardDropDistance,
  lockPiece,
  rotateMatrix,
} from "./game-core.js";

const boardCanvas = document.querySelector("#board");
const nextCanvas = document.querySelector("#next");
const boardContext = boardCanvas.getContext("2d");
const nextContext = nextCanvas.getContext("2d");
const scoreElement = document.querySelector("#score");
const linesElement = document.querySelector("#lines");
const levelElement = document.querySelector("#level");
const statusElement = document.querySelector("#status");
const startButton = document.querySelector("#start-button");
const pauseButton = document.querySelector("#pause-button");

const TYPES = Object.keys(TETROMINOES);
const CELL_SIZE = boardCanvas.width / BOARD_WIDTH;
let state = createInitialState(randomType(), randomType());
let previousTime = 0;
let dropElapsed = 0;

function randomType() {
  return TYPES[Math.floor(Math.random() * TYPES.length)];
}

function drawCell(context, x, y, size, color, alpha = 1) {
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
  context.fillStyle = "rgba(255,255,255,.22)";
  context.fillRect(x * size + 3, y * size + 3, size - 6, 3);
  context.globalAlpha = 1;
}

function drawBoard() {
  boardContext.fillStyle = "#080d1a";
  boardContext.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

  boardContext.strokeStyle = "rgba(148,163,184,.08)";
  for (let x = 0; x <= BOARD_WIDTH; x += 1) {
    boardContext.beginPath();
    boardContext.moveTo(x * CELL_SIZE, 0);
    boardContext.lineTo(x * CELL_SIZE, boardCanvas.height);
    boardContext.stroke();
  }
  for (let y = 0; y <= BOARD_HEIGHT; y += 1) {
    boardContext.beginPath();
    boardContext.moveTo(0, y * CELL_SIZE);
    boardContext.lineTo(boardCanvas.width, y * CELL_SIZE);
    boardContext.stroke();
  }

  state.board.forEach((row, y) => row.forEach((type, x) => {
    if (type) drawCell(boardContext, x, y, CELL_SIZE, TETROMINOES[type].color);
  }));

  if (!state.gameOver) {
    const ghostY = state.current.y + hardDropDistance(
      state.board,
      state.current.matrix,
      state.current.x,
      state.current.y,
    );
    drawPiece(state.current, ghostY, 0.2);
    drawPiece(state.current, state.current.y, 1);
  }
}

function drawPiece(piece, yPosition, alpha) {
  piece.matrix.forEach((row, y) => row.forEach((cell, x) => {
    if (cell && yPosition + y >= 0) {
      drawCell(
        boardContext,
        piece.x + x,
        yPosition + y,
        CELL_SIZE,
        TETROMINOES[piece.type].color,
        alpha,
      );
    }
  }));
}

function drawNext() {
  nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  const size = 24;
  const matrix = state.next.matrix;
  const offsetX = (nextCanvas.width / size - matrix[0].length) / 2;
  const offsetY = (nextCanvas.height / size - matrix.length) / 2;
  matrix.forEach((row, y) => row.forEach((cell, x) => {
    if (cell) drawCell(nextContext, offsetX + x, offsetY + y, size, TETROMINOES[state.next.type].color);
  }));
}

function updateInterface() {
  scoreElement.textContent = state.score.toLocaleString();
  linesElement.textContent = state.lines;
  levelElement.textContent = state.level;
  pauseButton.textContent = state.paused ? "继续" : "暂停";
  pauseButton.disabled = !state.started || state.gameOver;

  if (state.gameOver) statusElement.textContent = "游戏结束";
  else if (state.paused) statusElement.textContent = "已暂停";
  else if (!state.started) statusElement.textContent = "准备好了吗？";
  else statusElement.textContent = "";
}

function render() {
  drawBoard();
  drawNext();
  updateInterface();
}

function move(dx, dy) {
  const { current, board } = state;
  if (!collides(board, current.matrix, current.x + dx, current.y + dy)) {
    current.x += dx;
    current.y += dy;
    return true;
  }
  return false;
}

function settlePiece() {
  state = lockPiece(state, randomType());
}

function softDrop() {
  if (!move(0, 1)) settlePiece();
  dropElapsed = 0;
}

function hardDrop() {
  const distance = hardDropDistance(
    state.board,
    state.current.matrix,
    state.current.x,
    state.current.y,
  );
  state.current.y += distance;
  state.score += distance * 2;
  settlePiece();
  dropElapsed = 0;
}

function rotate() {
  const rotated = rotateMatrix(state.current.matrix);
  for (const offset of [0, -1, 1, -2, 2]) {
    if (!collides(state.board, rotated, state.current.x + offset, state.current.y)) {
      state.current.matrix = rotated;
      state.current.x += offset;
      return;
    }
  }
}

function togglePause() {
  if (!state.started || state.gameOver) return;
  state.paused = !state.paused;
  previousTime = performance.now();
  render();
}

function startGame() {
  state = createInitialState(randomType(), randomType());
  state.started = true;
  previousTime = performance.now();
  dropElapsed = 0;
  startButton.textContent = "重新开始";
  render();
}

function frame(time) {
  const delta = Math.min(time - previousTime, 100);
  previousTime = time;
  if (state.started && !state.paused && !state.gameOver) {
    dropElapsed += delta;
    const interval = Math.max(120, 900 - (state.level - 1) * 70);
    if (dropElapsed >= interval) softDrop();
    render();
  }
  requestAnimationFrame(frame);
}

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyP") {
    togglePause();
    return;
  }
  if (!state.started || state.paused || state.gameOver) return;

  const actions = {
    ArrowLeft: () => move(-1, 0),
    ArrowRight: () => move(1, 0),
    ArrowDown: softDrop,
    ArrowUp: rotate,
    Space: hardDrop,
  };
  const action = actions[event.code];
  if (action) {
    event.preventDefault();
    action();
    render();
  }
});

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
render();
requestAnimationFrame(frame);

