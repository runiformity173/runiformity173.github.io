let SETTING = "modernArt";
const WIDTH = 256;
const HEIGHT = 160;
let STATES = RULE_TABLE[SETTING].colors;
let ANT_STATES = RULE_TABLE[SETTING].states;
let RULES = RULE_TABLE[SETTING].rules;
let REDS = [255];
let GREENS=[255];
let BLUES =[255];
function hslToHex(t,a,r){console.log(t,a,r);var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],[Math.round(255*(n+r)),Math.round(255*(d+r)),Math.round(255*(h+r))]}
function getDistinctColors(e){var o=360/e*3;const t=[];for(let s=0;s<Math.ceil(e/3);s++)t.push(hslToHex(s*o,1,.25)),t.push(hslToHex(s*o,1,.5)),t.push(hslToHex(s*o,1,.75));return t.slice(0,e+1)}
if (STATES < 3) {REDS.push(0);GREENS.push(0);BLUES.push(0);}
else {for ([r,g,b] of getDistinctColors(STATES-1)) {REDS.push(r);GREENS.push(g);BLUES.push(b)}}
const overallLength = WIDTH*HEIGHT;
let board = Array.from({ length: HEIGHT }, () => new Array(WIDTH).fill(0));
const clamp = (o,m1,m2)=>(Math.min(Math.max(o,m1),m2));
function reloadJavaScript() {
  antDir = 0;
  antState = 0;
  antPos[0] = Math.floor(HEIGHT/2);
  antPos[1] = Math.floor(WIDTH/2);
  REDS=[255];GREENS=[255];BLUES=[255]
  SETTING = window.location.hash.substring(1);
  STATES = RULE_TABLE[SETTING].colors;
  ANT_STATES = RULE_TABLE[SETTING].states;
  RULES = RULE_TABLE[SETTING].rules;
  if (STATES < 3) {REDS.push(0);GREENS.push(0);BLUES.push(0);}
  else {for ([r,g,b] of getDistinctColors(STATES-1)) {REDS.push(r);GREENS.push(g);BLUES.push(b)}}
  board = Array.from({ length: HEIGHT }, () => new Array(WIDTH).fill(0));
}
window.addEventListener('hashchange', reloadJavaScript);

// board.board[0][2].type = 1;
// console.log(board.board)
const canvas = document.getElementById("output");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");
// function shuffle(t){let f=t.length,n;for(;0!=f;)n=Math.floor(Math.random()*f),f--,[t[f],t[n]]=[t[n],t[f]];return t}

const antPos = [Math.floor(HEIGHT/2),Math.floor(WIDTH/2)];
let antDir = 0;
let antState = 0;
function update() {
  const rule = RULES[board[antPos[0]][antPos[1]]][antState];
  antDir = (antDir + rule[1]) % 4;
  board[antPos[0]][antPos[1]] = rule[0];
  antState = rule[2];
  if (antDir === 0 && antPos[0] > 0) {antPos[0]-=1;}
  else if (antDir === 1 && antPos[1] < WIDTH-1) {antPos[1]+=1;}
  else if (antDir === 2 && antPos[0] < HEIGHT-1) {antPos[0]+=1;}
  else if (antDir === 3 && antPos[1] > 0) {antPos[1]-=1;}
}
var counter = 0;
function loop() {
  for (var i = 0;i<100;i++)
    update();

  var imgData = ctx.createImageData(WIDTH, HEIGHT);
  var data = imgData.data;
  for (var i = 0;i<HEIGHT;i++) {
    for (var j = 0;j<WIDTH;j++) {
      const t = 4*(j+(i*WIDTH));
      const b = board[i][j];
      data[t] = REDS[b];data[t+1] = GREENS[b];data[t+2] = BLUES[b];data[t+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  requestAnimationFrame(loop);
}
reloadJavaScript();
requestAnimationFrame(loop);