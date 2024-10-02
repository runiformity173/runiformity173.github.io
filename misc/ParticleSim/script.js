"use strict";
// Only draw particles that have changed


const WIDTH = 256;
const HEIGHT = 256;
const CHUNK_AMOUNT = Math.floor(WIDTH/CHUNK_SIZE);
const overallLength = WIDTH*HEIGHT;

let WIND = 0.5;
let PAUSED = false;
let FASTER = false;
let DEBUG = false;


// let lastTurnChunks = Array.from({length:Math.floor(WIDTH/CHUNK_AMOUNT*HEIGHT/CHUNK_AMOUNT)},()=>true);
// let thisTurnChunks = Array.from({length:Math.floor(WIDTH/CHUNK_AMOUNT*HEIGHT/CHUNK_AMOUNT)},()=>false);

const burnColors = {}; // {14:[255,255,255]};

const board = new Board(WIDTH,HEIGHT);
const plantMap = Array.from({ length: HEIGHT },() => Array.from({ length: WIDTH }, a=>(0)));
function hslToRgb(t,a,r){console.log(t,a,r);var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],[Math.round(255*(n+r)),Math.round(255*(d+r)),Math.round(255*(h+r))]}
function rgbToHsl(a,c,e){a/=255,c/=255,e/=255;const f=Math.max(a,c,e),i=Math.min(a,c,e);let j,k,m=(f+i)/2;if(f===i)j=k=0;else{const b=f-i;k=.5<m?b/(2-f-i):b/(f+i);f===a?j=(c-e)/b+(c<e?6:0):f===c?j=(e-a)/b+2:f===e?j=(a-c)/b+4:void 0;j/=6}return{h:Math.round(360*j),s:Math.round(100*k),l:Math.round(100*m)}}
const randomColorBoard = Array.from({ length: WIDTH*HEIGHT }, function() {
  const everything = Math.floor(Math.random()*31) - 15;
  const final = [everything,everything,everything];
  return final
});
const enemyMap = []
let BRUSH = 1;
let THICKNESS = 3;
let HEAT_GUN_HEAT = 100;
const HEAT_COLOR_MOD_1 = [0];
for (var i = 1;i < 1000;i++) {HEAT_COLOR_MOD_1.push(Math.min(Math.round(i*10*(Math.random()+0.5)),255))}
const HEAT_COLOR_MOD_2 = [0];
for (var i = 1;i < 1000;i++) {HEAT_COLOR_MOD_2.push(Math.min(Math.round(i*10+Math.random()*i*2),255))}
// board.board[0][2].type = 1;
// console.log(board.board)
const canvas = document.getElementById("output");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");
function setBrush(val) {
  BRUSH = (DEBUG||val<0)?val:ALIAS[val];
  THICKNESS = ([24].includes(BRUSH))?1:document.getElementById("thicknessSlider").value;
  document.getElementById("thicknessValue").innerHTML = THICKNESS;
  document.getElementById("current").innerHTML = BRUSH+1?NAMES[BRUSH]:"Heat Gun";
}
document.getElementById("brushSelect").addEventListener("click",function(){setBrush(NAMES.indexOf(this.value));})
document.getElementById("brushSelect").addEventListener("change",function(){setBrush(NAMES.indexOf(this.value));})

function freedom() {
  const theFreedom = document.getElementById("freedom");
  theFreedom.classList.add("flyingFreedom");
  var freedomAudio = new Audio('freedom.mp3');
  freedomAudio.play();
  setTimeout(function(){theFreedom.classList.remove("flyingFreedom");},5000);
}
function fill(empty=false,brushFilterClear=null) {
  for (var y = 0;y<HEIGHT;y++) {
    for (var x = 0;x<WIDTH;x++) {
      if (empty && board.board[y][x].type != 0) {continue}
      if (BRUSH == -1) {
        board.board[y][x].heat = HEAT_GUN_HEAT;
        board.board[y][x].nextHeat = HEAT_GUN_HEAT;
        board.board[y][x].lastHeat = HEAT_GUN_HEAT;
        continue;
      }
      if (brushFilterClear!=null && ALIAS[board.board[y][x].type] !== brushFilterClear) {continue;}
      board.board[y][x].become(BRUSH);
      board.board[y][x].heat = HEATS[BRUSH];
      board.board[y][x].nextHeat = HEATS[BRUSH];
      board.board[y][x].lastHeat = HEATS[BRUSH];
      board.board[y][x].lastType = BRUSH;
    }
  }
}
function draw(startX, startY, endX, endY) {
  const dx = Math.abs(endX - startX);
  const dy = Math.abs(endY - startY);
  const sx = (startX < endX) ? 1 : -1;
  const sy = (startY < endY) ? 1 : -1;
  let err = dx - dy;
  const offsets = [];
  for (let i = -THICKNESS + 1; i < THICKNESS; i++) {
    for (let j = -Math.round(Math.sqrt(THICKNESS**2-i**2))+1;j<Math.round(Math.sqrt(THICKNESS**2-i**2));j++) {
      offsets.push([i,j]);
    }
  }
  while (true) {
    for (const [offsetY,offsetX] of offsets) {
        try {
          if (BRUSH > -1) {
            board.board[startY + offsetY][startX + offsetX].become(BRUSH);
            board.board[startY + offsetY][startX + offsetX].heat = HEATS[BRUSH];
            board.board[startY + offsetY][startX + offsetX].nextHeat = HEATS[BRUSH];
            board.board[startY + offsetY][startX + offsetX].lastHeat = HEATS[BRUSH];
            board.board[startY + offsetY][startX + offsetX].lastType = BRUSH;
          }
          else {
            board.board[startY + offsetY][startX + offsetX].heat = HEAT_GUN_HEAT;
            board.board[startY + offsetY][startX + offsetX].nextHeat = HEAT_GUN_HEAT;
            board.board[startY + offsetY][startX + offsetX].lastHeat = HEAT_GUN_HEAT;
          }
          // updateChunk(startY + offsetY,startX + offsetX);
        } catch {}
    }
    if (startX === endX && startY === endY) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      startX += sx;
    }
    if (e2 < dx) {
      err += dx;
      startY += sy;
    }
  }
}
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
  return [y, x];
}

let LAST_POS = [-1,-1];
let CURRENT_POS = [-1,-1]
let IS_DOWN = false;
let lastInterval = -1;
canvas.addEventListener("mousedown", (event) => {
  const [y,x] = getMousePos(event);
  if (event.shiftKey) {
    setBrush(board.board[y][x].type);
    return;
  }
  IS_DOWN = true;
  draw(x,y,x,y);
  LAST_POS = [y,x];
  CURRENT_POS = [y,x];
  if (lastInterval != -1) {clearInterval(lastInterval);}
  lastInterval = setInterval(draw2,10);
});
canvas.addEventListener("mousemove", (event) => {
  if (IS_DOWN) {
    const [y,x] = getMousePos(event);
    draw2();
    LAST_POS = [CURRENT_POS[0],CURRENT_POS[1]];
    CURRENT_POS = [y,x];
  }
});
function draw2() {

  draw(CURRENT_POS[1],CURRENT_POS[0],LAST_POS[1],LAST_POS[0]);
  LAST_POS = [CURRENT_POS[0],CURRENT_POS[1]];

}
window.addEventListener("keydown",function(e) {
  if (e.altKey && e.keyCode == 78) {
    document.getElementById("hiddenBrushes").style.display = "block";
    DEBUG = !DEBUG;
  } else if (e.altKey && e.keyCode == 79) {
      FASTER = !FASTER;
    }
})
canvas.addEventListener("mouseup", (event) => {
  if (lastInterval != -1) {clearInterval(lastInterval);lastInterval = -1;}
  IS_DOWN = false;
});
canvas.addEventListener("mouseleave", (event) => {
  if (lastInterval != -1) {clearInterval(lastInterval);lastInterval = -1;}
  IS_DOWN = false;
});
var t = false;
let frames = 0;
const c = setInterval(function(){document.getElementById("fps").innerHTML = `FPS: ${frames}`;frames = 0;},1000)
const clamp=o=>Math.max(o,1)
function addHeat(rgb, heat, isFire) {
  heat = Math.min(Math.max(heat, 0), 100);
  const factor = isFire?(heat/250+0.6):(heat / 100);
  const red = rgb[0];
  const green = rgb[1];
  const blue = rgb[2];
  const newRed = (red+heat) * clamp(1+factor);
  const newGreen = (green+heat) * clamp(0.6+factor);
  const newBlue = (blue+heat) * clamp(0.3+factor);
  const clampedRed = Math.min(Math.max(newRed, 0), 255);
  const clampedGreen = Math.min(Math.max(newGreen, 0), 255);
  const clampedBlue = Math.min(Math.max(newBlue, 0), 255);
  return [clampedRed, clampedGreen, clampedBlue];
}
function loop() {
  if (t && !PAUSED) {
    // WIND = Number(document.getElementById("windSlider").value);
  board.update();
    if (FASTER) {
      board.update();
    }
  } else {t = true;}
  var imgData = ctx.createImageData(WIDTH, HEIGHT);
  var data = imgData.data;
  for (var i = 0;i<HEIGHT;i++) {
    for (var j = 0;j<WIDTH;j++) {

      const t = 4*(j+(i*WIDTH));
      const b = board.board[i][j];
      let theColor = null;
      if (b.type == 7) {
        if (b.lastType in burnColors) {
          theColor = burnColors[b.lastType];
        } else {
        theColor = [reds[b.type],greens[b.type],blues[b.type]];}
      } else {
        theColor = [reds[b.type],greens[b.type],blues[b.type]];}
      theColor = addHeat(theColor,b.nextHeat,b.type==7);
      const shading = randomColorBoard[b.id];
      data[t] = theColor[0]+shading[0];data[t+1] = theColor[1]+shading[1];data[t+2] = theColor[2]+shading[2];data[t+3] = 255;
      if (b.type == 11) {
        data[t] = reds[11]+shading[0];
        data[t+1] = greens[11]+shading[1];
        data[t+2] = blues[11]+shading[2];
      }
      else if (b.state < 2 && b.type != 7) {
        data[t] = reds[b.type];
        data[t+1] = greens[b.type];
        data[t+2] = blues[b.type];
        // data[t+1] = greens[b.type]-b.heat;
        // data[t+2] = blues[b.type]-b.heat;
      }
      // if (!lastTurnChunks[getChunk(i,j)]) {
      //   data[t] += 25;
      //   data[t+1] -= 25;
      //   data[t+2] -= 25;
      // }
      // else if (b.isFalling == 0) {
      //   data[t] = 255;
      //   data[t+1] = 0;
      //   data[t+2] = 0;
      // }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  frames++;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);