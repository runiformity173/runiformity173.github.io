"use strict";
// Only draw particles that have changed?


const WIDTH = 100;
const HEIGHT = 128;
const overallLength = WIDTH*HEIGHT;
let SCORE = 0;
let DISPLAYED_SCORE = 0;
let PAUSED = false;
let ONE_STEP = false;
let GAME_OVER = false;
let FASTER = false;
let DEBUG = false;
const colors = [[187,46,84],[113,201,64],[72,153,199],[199,164,71]];
const idToColor = new Int8Array(overallLength);
let animationFrames = 0;
let toBeRemoved = new Set();

// let lastTurnChunks = Array.from({length:Math.floor(WIDTH/CHUNK_AMOUNT*HEIGHT/CHUNK_AMOUNT)},()=>true);
// let thisTurnChunks = Array.from({length:Math.floor(WIDTH/CHUNK_AMOUNT*HEIGHT/CHUNK_AMOUNT)},()=>false);

let board;
let currentShape;
let nextShape;
function hslToRgb(t,a,r){console.log(t,a,r);var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],[Math.round(255*(n+r)),Math.round(255*(d+r)),Math.round(255*(h+r))]}
function rgbToHsl(a,c,e){a/=255,c/=255,e/=255;const f=Math.max(a,c,e),i=Math.min(a,c,e);let j,k,m=(f+i)/2;if(f===i)j=k=0;else{const b=f-i;k=.5<m?b/(2-f-i):b/(f+i);f===a?j=(c-e)/b+(c<e?6:0):f===c?j=(e-a)/b+2:f===e?j=(a-c)/b+4:void 0;j/=6}return{h:Math.round(360*j),s:Math.round(100*k),l:Math.round(100*m)}}
const randomColorBoard = new Int8Array(overallLength);
const canvas = document.getElementById("output");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");
let MOVING_LEFT = false;
let LEFT_MOVE = false;
let MOVING_RIGHT = false;
let RIGHT_MOVE = false;
let MOVING_DOWN = false;
let ROTATING = false;
let ROTATING_POSSIBLE = true;
window.addEventListener("keydown",function(e) {
  if (e.code == "ArrowLeft") {
    MOVING_LEFT = true;
    LEFT_MOVE = true;
  }
  if (e.code == "ArrowRight") {
    MOVING_RIGHT = true;
    RIGHT_MOVE = true;
  }
  if (e.code == "ArrowDown") {
    MOVING_DOWN = true;
  }
  if (e.code == "ArrowUp" && ROTATING_POSSIBLE) {
    ROTATING_POSSIBLE = false;
    ROTATING = true;
  }
});
window.addEventListener("keyup",function(e) {
  if (e.code == "ArrowLeft") {
    MOVING_LEFT = false;
  }
  if (e.code == "ArrowRight") {
    MOVING_RIGHT = false;
  }
  if (e.code == "ArrowDown") {
    MOVING_DOWN = false;
  }
  if (e.code == "ArrowUp") {
    ROTATING_POSSIBLE = true;
  }
});
let frames = 0;
let numberOfUpdates = 0;
const c = setInterval(function(){document.getElementById("fps").innerHTML = `FPS: ${frames}`;frames = 0;},1000)
const clamp=o=>Math.max(o,1);
function loop() {
  frames++;
  if (animationFrames == 0) {
    if (board.update(numberOfUpdates) || (FASTER && board.update(++numberOfUpdates))) {
      GAME_OVER = true;
      newGame();
      return;
    }
  }
  numberOfUpdates++
  var imgData = ctx.createImageData(WIDTH, HEIGHT);
  var data = imgData.data;
  for (var i = 0;i<HEIGHT;i++) {
    for (var j = 0;j<WIDTH;j++) {
      const t = 4*(j+(i*WIDTH));
      const b = board.board[i][j];
      if (b > -1) {
        let theColor = (animationFrames > 0 && toBeRemoved.has(i*WIDTH+j) && numberOfUpdates % 20 > 9) ? [230,230,230] : colors[idToColor[b]];
        try {theColor[0]} catch {console.log(idToColor[b],b)}
        const shading = (animationFrames > 0 && toBeRemoved.has(i*WIDTH+j) && numberOfUpdates % 20 > 9) ? 0 : randomColorBoard[b];
        data[t] = theColor[0]+shading;data[t+1] = theColor[1]+shading;data[t+2] = theColor[2]+shading;data[t+3] = 255;
      }
      // if (!lastTurnChunks[getChunk(i,j)]) {
      //   data[t] += 25;
      //   data[t+1] -= 25;
      //   data[t+2] -= 25;
      // }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  if (animationFrames > 0) {
    animationFrames--;
    if (animationFrames == 0) {
      for (const i of toBeRemoved) {
        reuseIDs.push(board.board[Math.floor(i/WIDTH)][i%WIDTH]);
        board.board[Math.floor(i/WIDTH)][i%WIDTH] = -1;
      }
      toBeRemoved = [];
    }
  }
  if (DISPLAYED_SCORE < SCORE) {
    DISPLAYED_SCORE += Math.min(SCORE-DISPLAYED_SCORE,9);
    document.getElementById("scoreDisplay").innerHTML = DISPLAYED_SCORE;
  }
  requestAnimationFrame(loop);
}
function newGame() {
  SCORE = 0;
  DISPLAYED_SCORE = 0;
  document.getElementById("scoreDisplay").innerHTML = DISPLAYED_SCORE;
  for (const el of document.querySelectorAll(".piece")) {
    el.parentElement.remove();
  }
  board = new Board(WIDTH,HEIGHT)
  currentShape = new Shape();
  currentShape.el.parentElement.classList.remove("preview");
  currentShape.el.style.left = (canvas.offsetWidth*currentShape.left/100)+"px";
  currentShape.el.style.top = (canvas.offsetHeight*currentShape.top/128)+"px";
  nextShape = new Shape();
  highestID = -1;
  reuseIDs = [];
  MOVING_LEFT = false;
  LEFT_MOVE = false;
  MOVING_RIGHT = false;
  RIGHT_MOVE = false;
  MOVING_DOWN = false;
  ROTATING = false;
  ROTATING_POSSIBLE = true;
  requestAnimationFrame(loop);
}
newGame();