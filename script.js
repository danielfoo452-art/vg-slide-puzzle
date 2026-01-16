let moves = 0;
let gameWon = false;
const puzzle = document.getElementById("puzzle");
const size = 4;
const tileSize = 100;
let tiles = [];

function createPuzzle() {
  puzzle.innerHTML = "";
  tiles = [];

  moves = 0;
  updateMoves();

  for (let i = 0; i < size * size; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");

    const row = Math.floor(i / size);
    const col = i % size;

    tile.dataset.pos = i;

    if (i === size * size - 1) {
      tile.classList.add("empty");
    } else {
      tile.style.backgroundPosition = `${-col * tileSize}px ${-row * tileSize}px`;
    }

    setPosition(tile, row, col);

    tile.addEventListener("click", () => moveTile(tile));

    tiles.push(tile);
    puzzle.appendChild(tile);
  }

  shuffle();
}

function setPosition(tile, row, col) {
  tile.style.transform = `translate(${col * tileSize}px, ${row * tileSize}px)`;
}

function moveTile(tile) {
  if (gameWon) return;

  const empty = tiles.find(t => t.classList.contains("empty"));

  const tilePos = Number(tile.dataset.pos);
  const emptyPos = Number(empty.dataset.pos);

  const tr = Math.floor(tilePos / size);
  const tc = tilePos % size;
  const er = Math.floor(emptyPos / size);
  const ec = emptyPos % size;

  const adjacent =
    (tr === er && Math.abs(tc - ec) === 1) ||
    (tc === ec && Math.abs(tr - er) === 1);

  if (!adjacent) return;

  swapTiles(tile, empty);
  playSlideSound();
  moves++;
  updateMoves();
  checkWin();
}

function checkWin() {
  for (let i = 0; i < tiles.length; i++) {
    if (Number(tiles[i].dataset.pos) !== i) return;
  }

  gameWon = true;

  document.getElementById("winMessage").classList.add("show");
  
  const sound = document.getElementById("winSound");
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function playAgain() {
  gameWon = false;
  moves = 0;
  updateMoves();
  document.getElementById("winMessage").classList.remove("show");
  createPuzzle();
}

function swapTiles(tileA, tileB) {
  const posA = tileA.dataset.pos;
  tileA.dataset.pos = tileB.dataset.pos;
  tileB.dataset.pos = posA;

  const rowA = Math.floor(tileA.dataset.pos / size);
  const colA = tileA.dataset.pos % size;
  const rowB = Math.floor(tileB.dataset.pos / size);
  const colB = tileB.dataset.pos % size;

  setPosition(tileA, rowA, colA);
  setPosition(tileB, rowB, colB);
}

function shuffle() {
  for (let i = 0; i < 300; i++) {
    const empty = tiles.find(t => t.classList.contains("empty"));
    const emptyPos = Number(empty.dataset.pos);
    const row = Math.floor(emptyPos / size);
    const col = emptyPos % size;

    const neighbors = tiles.filter(t => {
      const pos = Number(t.dataset.pos);
      const r = Math.floor(pos / size);
      const c = pos % size;
      return (
        (r === row && Math.abs(c - col) === 1) ||
        (c === col && Math.abs(r - row) === 1)
      );
    });

    const randomTile = neighbors[Math.floor(Math.random() * neighbors.length)];
    swapTiles(randomTile, empty);
  }
}

function updateMoves() {
  document.getElementById("moveCount").textContent = moves;
}

function playSlideSound() {
  const sound = document.getElementById("slideSound");
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

createPuzzle();
