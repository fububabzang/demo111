
# Simple Tetris Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dependency-free browser Tetris game with keyboard controls, scoring, levels, pause, restart, and next-piece preview.

**Architecture:** Pure game rules live in an importable ES module so Node can test them without a browser. A separate browser controller owns animation, input, Canvas rendering, and DOM updates; HTML and CSS provide the accessible responsive shell.

**Tech Stack:** HTML5, CSS, JavaScript ES modules, Canvas 2D, Node.js built-in test runner

---

### Task 1: Pure Game Rules

**Files:**
- Create: `tests/game.test.js`
- Create: `game-core.js`
- Create: `package.json`

- [ ] **Step 1: Write failing tests**

Add Node tests for `createBoard`, `rotateMatrix`, `collides`, `clearLines`, `scoreForLines`, and `hardDropDistance` using `node:test` and `node:assert/strict`.

- [ ] **Step 2: Verify the tests fail**

Run: `node --test`
Expected: FAIL because `game-core.js` does not exist.

- [ ] **Step 3: Implement the minimal rules module**

Export the seven tetromino matrices and pure functions. `clearLines` returns `{ board, cleared }`; `scoreForLines` uses the standard `[0, 100, 300, 500, 800] * level` table.

- [ ] **Step 4: Verify the tests pass**

Run: `node --test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

Run: `git add package.json game-core.js tests/game.test.js && git commit -m "feat: add tested tetris game rules"`

### Task 2: Browser Game Controller

**Files:**
- Create: `game.js`
- Extend test: `tests/game.test.js`

- [ ] **Step 1: Add failing lifecycle tests**

Test that `createInitialState` starts with an empty board and that `lockPiece` merges a piece, clears rows, updates score/lines/level, and reports game over when the next spawn collides.

- [ ] **Step 2: Verify the new tests fail**

Run: `node --test`
Expected: FAIL because lifecycle exports are missing.

- [ ] **Step 3: Implement state transitions and controller**

Add pure `createInitialState` and `lockPiece` exports to `game-core.js`. In `game.js`, render the board and next piece, run an elapsed-time animation loop, handle arrow/space/P keys, and wire start and pause buttons.

- [ ] **Step 4: Verify all tests pass**

Run: `node --test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

Run: `git add game-core.js game.js tests/game.test.js && git commit -m "feat: add tetris gameplay controller"`

### Task 3: Responsive Interface

**Files:**
- Create: `index.html`
- Create: `style.css`

- [ ] **Step 1: Write structure checks**

Add `tests/interface.test.js` to assert that the HTML exposes `#board`, `#next`, `#score`, `#lines`, `#level`, `#start-button`, `#pause-button`, and loads `game.js` as a module.

- [ ] **Step 2: Verify the structure tests fail**

Run: `node --test`
Expected: FAIL because `index.html` does not exist.

- [ ] **Step 3: Implement the page and styles**

Create semantic game markup and a dark responsive arcade theme. Keep the Canvas board at a 1:2 aspect ratio and collapse the side panel below it on narrow screens.

- [ ] **Step 4: Verify the full test suite**

Run: `node --test`
Expected: all tests pass.

- [ ] **Step 5: Commit**

Run: `git add index.html style.css tests/interface.test.js && git commit -m "feat: add responsive tetris interface"`

### Task 4: Documentation and Browser Verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Add usage documentation**

Document local launch, controls, gameplay rules, and test command.

- [ ] **Step 2: Run automated verification**

Run: `node --test`
Expected: all tests pass with zero failures.

- [ ] **Step 3: Run browser verification**

Serve the repository locally, open it in the in-app browser, and verify start, movement, pause/resume, restart, and responsive presentation.

- [ ] **Step 4: Commit documentation**

Run: `git add README.md && git commit -m "docs: add tetris usage guide"`

### Task 5: Publish to GitHub

**Files:**
- No new files

- [ ] **Step 1: Add the target remote**

Run: `git remote add origin https://github.com/fububabzang/demo111.git`

- [ ] **Step 2: Run final verification**

Run: `node --test && git status --short`
Expected: tests pass and the worktree is clean.

- [ ] **Step 3: Push the implementation**

Push the local `master` branch to `origin/master`, then confirm the repository files through the GitHub connector.

