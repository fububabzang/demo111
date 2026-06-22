
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOES = {
  I: { color: "#38bdf8", matrix: [[1, 1, 1, 1]] },
  J: { color: "#3b82f6", matrix: [[1, 0, 0], [1, 1, 1]] },
  L: { color: "#fb923c", matrix: [[0, 0, 1], [1, 1, 1]] },
  O: { color: "#facc15", matrix: [[1, 1], [1, 1]] },
  S: { color: "#4ade80", matrix: [[0, 1, 1], [1, 1, 0]] },
  T: { color: "#c084fc", matrix: [[0, 1, 0], [1, 1, 1]] },
  Z: { color: "#f87171", matrix: [[1, 1, 0], [0, 1, 1]] },
};

export function createBoard(width = BOARD_WIDTH, height = BOARD_HEIGHT) {
  return Array.from({ length: height }, () => Array(width).fill(0));
}

export function rotateMatrix(matrix) {
  return matrix[0].map((_, column) =>
    matrix.map((row) => row[column]).reverse(),
  );
}

export function collides(board, matrix, x, y) {
  for (let row = 0; row < matrix.length; row += 1) {
    for (let column = 0; column < matrix[row].length; column += 1) {
      if (!matrix[row][column]) continue;

      const boardX = x + column;
      const boardY = y + row;
      if (boardX < 0 || boardX >= board[0].length || boardY >= board.length) {
        return true;
      }
      if (boardY >= 0 && board[boardY][boardX]) return true;
    }
  }
  return false;
}

export function clearLines(board) {
  const width = board[0].length;
  const remaining = board.filter((row) => row.some((cell) => !cell));
  const cleared = board.length - remaining.length;
  const emptyRows = Array.from({ length: cleared }, () => Array(width).fill(0));
  return { board: [...emptyRows, ...remaining], cleared };
}

export function scoreForLines(lines, level) {
  return [0, 100, 300, 500, 800][lines] * level;
}

export function hardDropDistance(board, matrix, x, y) {
  let distance = 0;
  while (!collides(board, matrix, x, y + distance + 1)) distance += 1;
  return distance;
}

export function createPiece(type) {
  const definition = TETROMINOES[type];
  const matrix = definition.matrix.map((row) => [...row]);
  return {
    type,
    matrix,
    x: Math.floor((BOARD_WIDTH - matrix[0].length) / 2),
    y: 0,
  };
}

export function createInitialState(currentType = "T", nextType = "I") {
  return {
    board: createBoard(),
    current: createPiece(currentType),
    next: createPiece(nextType),
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    paused: false,
    started: false,
  };
}

function mergePiece(board, piece) {
  const merged = board.map((row) => [...row]);
  piece.matrix.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const boardY = piece.y + rowIndex;
      if (cell && boardY >= 0) merged[boardY][piece.x + columnIndex] = piece.type;
    });
  });
  return merged;
}

export function lockPiece(state, nextType) {
  const merged = mergePiece(state.board, state.current);
  const { board, cleared } = clearLines(merged);
  const lines = state.lines + cleared;
  const current = createPiece(state.next.type);
  const next = createPiece(nextType);

  return {
    ...state,
    board,
    current,
    next,
    score: state.score + scoreForLines(cleared, state.level),
    lines,
    level: Math.floor(lines / 10) + 1,
    gameOver: collides(board, current.matrix, current.x, current.y),
  };
}

