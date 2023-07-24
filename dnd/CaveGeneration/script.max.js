// Board dimensions
let HEIGHT = 128;
let WIDTH = 128;

// Noise level and sample range for smoothing
let NOISE = 0.5;
let SAMPLE_RANGE = 3;
let WALL = "#212529";
let FLOOR = "#bbbbbb";

// Create initial board with noise
function boardWithNoise(weight, height, width) {
  const board = Array.from({ length: height }, () => []);
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      board[row].push(weight > Math.random() ? 0 : 1);
    }
  }
  return board;
}

// Smooth the board using the cellular automata algorithm
function change(x, y, board, h, w, sampleRange, debug = false) {
  if (!debug) {
    let walls = 0;
    let floors = 0;
    let newX, newY;
    for (let i = -sampleRange; i <= sampleRange; i++) {
      for (let j = -sampleRange; j <= sampleRange; j++) {
        newX = x + i;
        newY = y + j;
        if (newX === x && newY === y) {
          continue;
        }
        if (
          newX >= sampleRange &&
          newX < w - sampleRange &&
          newY >= sampleRange &&
          newY < h - sampleRange
        ) {
          if (board[newY][newX] === 0) {
            walls++;
          } else {
            floors++;
          }
        } else {
          walls++;
        }
      }
    }
    return walls > Math.floor((sampleRange * 2 + 1) ** 2 / 2) ? 0 : 1;
  }
}

// Update the board with the new smoothed values
function update(board, h, w, sr) {
  if (sr > 0) {
  const newBoard = board.map((row) => [...row]);
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      newBoard[row][col] = change(col, row, board, h, w, sr);
    }
  }
  return newBoard;}
  return board;
}
let board = boardWithNoise(NOISE, HEIGHT, WIDTH);
// Start the program
function start() {
  let size = document.querySelector('input[name="sample-range"]:checked').value;
  HEIGHT = Number(document.getElementById("height").value);
  WIDTH = Number(document.getElementById("width").value);
  document.getElementById("height").disabled = true;
  document.getElementById("width").disabled = true;
  SAMPLE_RANGE = Math.round((HEIGHT+WIDTH)/2)/({"Medium":32,"Small":64,"Large":16}[size]);
  WALL = document.getElementById("wall").value;
  FLOOR = document.getElementById("floor").value;
  ONLY_LARGEST = document.getElementById("largest").checked;
  MULT = ((HEIGHT > 128 || WIDTH > 128) ? 0 : 9);
  board = boardWithNoise(NOISE, HEIGHT, WIDTH);
  board = update(board, HEIGHT, WIDTH, SAMPLE_RANGE);board = update(board, HEIGHT, WIDTH, SAMPLE_RANGE);
  display(printDistance(board));
  document.querySelector("#run").onclick = function() {board = update(board, HEIGHT, WIDTH, SAMPLE_RANGE);
display(printDistance(board));};
  document.querySelector("#run").innerHTML = "Smooth";
  document.querySelector("#render").onclick = function() {display(printDistance(board));};
  document.querySelector("#render").style.display = "inline";
  document.querySelector("#rerun").style.display = "inline";
}
function generate() {board = update(board, HEIGHT, WIDTH, SAMPLE_RANGE);display(printDistance(board));}
function render() {display(printDistance(board));}
function load2() {
  if (location.href.includes("?")) {
  let obj = JSON.parse(atob(location.search.replace("?data=","")));
  document.getElementById("height").value = obj["height"];
  document.getElementById("width").value = obj["width"];
  document.getElementById("height").disabled = false;
  document.getElementById("width").disabled = false;
  document.querySelector("input[value='"+obj["sample-range"]+"']").checked = true;
  document.getElementById("wall").value = obj["wall"];
  document.getElementById("floor").value = obj["floor"];
  document.getElementById("largest").checked = obj["largest"];
}}
function regenerate() {
  let js = JSON.stringify({"height":HEIGHT,"width":WIDTH,"sample-range":document.querySelector('input[name="sample-range"]:checked').value,"wall":WALL,"floor":FLOOR,"largest":ONLY_LARGEST});
  js = btoa(js);
  window.location.replace(location.href.replace(location.search,"")+"?data="+js);
}