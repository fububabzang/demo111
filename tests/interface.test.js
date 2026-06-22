
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("index exposes every element required by the game controller", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const requiredIds = [
    "board",
    "next",
    "score",
    "lines",
    "level",
    "status",
    "start-button",
    "pause-button",
  ];

  for (const id of requiredIds) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing #${id}`);
  }
  assert.match(html, /<script[^>]+type=["']module["'][^>]+src=["']\.\/game\.js["']/);
});

