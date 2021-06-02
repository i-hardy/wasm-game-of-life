import { Universe, UniverseType } from "wasm-game-of-life";

import { UNIVERSE_SIZE, CELL_SIZE, createCanvas } from "./render";

let universe = Universe.new(UNIVERSE_SIZE, UniverseType.Random);

const playPause = document.querySelector('#play-pause');
const newRandom = document.querySelector('#random');
const newEmpty = document.querySelector('#empty');
const canvas = document.querySelector('#game-of-life-canvas');

let gameInterval = null;

const {
  drawGrid,
  drawCells,
} = createCanvas(canvas);

function draw(universe) {
  drawGrid();
  drawCells(universe);
}

function renderLoop(universe) {
  draw(universe);
  universe.tick();
}

function drawPulsar(universe, clickRow, clickCol) {
  universe.toggle_cell(clickRow -1, clickCol);
  universe.toggle_cell(clickRow, clickCol);
  universe.toggle_cell(clickRow + 1, clickCol);
}

function drawGlider(universe, clickRow, clickCol) {
  universe.toggle_cell(clickRow - 1, clickCol - 1);
  universe.toggle_cell(clickRow, clickCol);
  universe.toggle_cell(clickRow, clickCol + 1);
  universe.toggle_cell(clickRow + 1, clickCol);
  universe.toggle_cell(clickRow + 1, clickCol - 1);
}

playPause.addEventListener('click', () => {
  if (gameInterval === null) {
    gameInterval = setInterval(() => renderLoop(universe), 100);
    playPause.textContent = 'Pause';
  } else {
    clearInterval(gameInterval);
    gameInterval = null;
    playPause.textContent = 'Play';
  }
});

newRandom.addEventListener('click', () => {
  universe = Universe.new(UNIVERSE_SIZE, UniverseType.Random);
  draw(universe);
});

newEmpty.addEventListener('click', () => {
  universe = Universe.new(UNIVERSE_SIZE, UniverseType.Empty);
  draw(universe);
});

canvas.addEventListener('contextmenu', event => event.preventDefault());

canvas.addEventListener("mousedown", event => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), UNIVERSE_SIZE - 1);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), UNIVERSE_SIZE - 1);

  if (event.shiftKey) {
    drawPulsar(universe, row, col);
  } else if (event.ctrlKey) {
    drawGlider(universe, row, col);
  } else {
    universe.toggle_cell(row, col);
  }

  draw(universe);
});

(() => {
  draw(universe);
})();