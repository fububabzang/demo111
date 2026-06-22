
# Simple Tetris Game Design

## Goal

Build a dependency-free browser Tetris game in `fububabzang/demo111`. It should run by opening `index.html` and support desktop keyboard play.

## Architecture

The project uses three files:

- `index.html` defines the game canvas, status panel, controls, and action buttons.
- `style.css` provides a responsive dark arcade-style layout.
- `game.js` contains the game state, rendering loop, tetromino rules, input handling, scoring, and lifecycle controls.

No framework, package manager, build step, backend, persistence, audio, multiplayer, or touch controls are included.

## Game Rules

The board is 10 columns by 20 rows. Seven standard tetrominoes spawn near the top, fall automatically, and lock when they cannot move farther. Completed rows are removed. Clearing lines awards points and increases the level; higher levels shorten the automatic drop interval.

The game ends when a new piece collides at its spawn position. Restart resets the board, score, lines, level, timers, and piece queue.

## Controls

- Left and right arrows move the active piece.
- Up arrow rotates clockwise with a small horizontal wall-kick attempt.
- Down arrow performs a soft drop.
- Space performs a hard drop.
- `P` toggles pause.
- On-screen buttons start/restart and pause/resume the game.

## Interface

The main area displays a crisp Canvas board with a subtle grid. A side panel shows score, cleared lines, level, next piece, keyboard help, and buttons. The layout collapses cleanly on narrow screens.

## Error Handling

Keyboard input is ignored before start and while paused except for pause/resume. Repeated animation frames use elapsed time rather than assuming a fixed frame rate. Collision checks guard all board boundaries and occupied cells.

## Verification

Automated checks cover matrix rotation, collision detection, row clearing, scoring, and hard-drop behavior. Browser verification covers start, movement, pause/resume, restart, responsive layout, and game-over rendering.

