
import test from "node:test";
import assert from "node:assert/strict";

import {
  clearLines,
  collides,
  createBoard,
  createInitialState,
  createPiece,
  hardDropDistance,
  lockPiece,
  rotateMatrix,
  scoreForLines,
} from "../game-core.js";

test("createBoard returns an empty board with requested dimensions", () => {
  const board = createBoard(4, 3);
  assert.deepEqual(board, [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});

test("rotateMatrix rotates a matrix clockwise", () => {
  assert.deepEqual(rotateMatrix([[1, 0], [1, 1]]), [[1, 1], [1, 0]]);
});

test("collides detects walls, floor, and occupied cells", () => {
  const board = createBoard(4, 4);
  board[3][1] = 8;
  const piece = [[1, 1]];

  assert.equal(collides(board, piece, -1, 0), true);
  assert.equal(collides(board, piece, 1, 4), true);
  assert.equal(collides(board, piece, 0, 3), true);
  assert.equal(collides(board, piece, 1, 2), false);
});

test("clearLines removes full rows and preserves board height", () => {
  const result = clearLines([
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 2, 0, 0],
    [3, 3, 3, 3],
  ]);

  assert.equal(result.cleared, 2);
  assert.deepEqual(result.board, [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 2, 0, 0],
  ]);
});

test("scoreForLines uses the level multiplier", () => {
  assert.equal(scoreForLines(0, 3), 0);
  assert.equal(scoreForLines(1, 2), 200);
  assert.equal(scoreForLines(4, 3), 2400);
});

test("hardDropDistance returns the last valid downward offset", () => {
  const board = createBoard(4, 6);
  board[5][1] = 9;
  assert.equal(hardDropDistance(board, [[1, 1]], 1, 0), 4);
});

test("createInitialState starts a ready game with an empty board", () => {
  const state = createInitialState("T", "O");

  assert.deepEqual(state.board, createBoard());
  assert.equal(state.current.type, "T");
  assert.equal(state.next.type, "O");
  assert.equal(state.score, 0);
  assert.equal(state.lines, 0);
  assert.equal(state.level, 1);
  assert.equal(state.gameOver, false);
});

test("lockPiece merges the piece and advances the queue", () => {
  const state = createInitialState("O", "I");
  state.current.x = 0;
  state.current.y = 18;

  const nextState = lockPiece(state, "T");

  assert.equal(nextState.board[18][0], "O");
  assert.equal(nextState.board[19][1], "O");
  assert.equal(nextState.current.type, "I");
  assert.equal(nextState.next.type, "T");
});

test("lockPiece clears rows and updates score, lines, and level", () => {
  const state = createInitialState("I", "O");
  state.board[19] = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
  state.current = createPiece("I");
  state.current.x = 6;
  state.current.y = 19;
  state.lines = 9;

  const nextState = lockPiece(state, "T");

  assert.equal(nextState.lines, 10);
  assert.equal(nextState.level, 2);
  assert.equal(nextState.score, 100);
});

test("lockPiece reports game over when the next piece cannot spawn", () => {
  const state = createInitialState("O", "O");
  state.board[0][4] = "Z";
  state.current.x = 0;
  state.current.y = 18;

  const nextState = lockPiece(state, "T");

  assert.equal(nextState.gameOver, true);
});

