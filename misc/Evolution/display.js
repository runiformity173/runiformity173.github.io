const DISPLAY_WIDTH = 1024;
const DISPLAY_HEIGHT = 1024;

let UPDATES = 40;

const CREATURE_RADIUS = DISPLAY_WIDTH/WIDTH/2;
const WIDTH_MULTIPLIER = DISPLAY_WIDTH/WIDTH;
const HEIGHT_MULTIPLIER = DISPLAY_HEIGHT/HEIGHT;

const canvas = document.getElementById("output");
canvas.width = DISPLAY_WIDTH;
canvas.height = DISPLAY_HEIGHT;
const ctx = canvas.getContext("2d");


function getMousePos(event) {
  const img = document.getElementById("output");
  const rect = img.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (img.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (img.height / rect.height));
  return [Math.floor(y/HEIGHT_MULTIPLIER), Math.floor(x/WIDTH_MULTIPLIER)];
}
document.getElementById("output").addEventListener("click",function (e) {
  const [y,x] = getMousePos(e);
  addCreature(x,y);
});
function hslToHex(t,a,r){var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],[Math.round(255*(n+r)),Math.round(255*(d+r)),Math.round(255*(h+r))]}
ctx.strokeStyle = "black";
var animationCounter = 0;
let frames = 0;
setInterval(function(){document.getElementById("fps").innerHTML = frames;frames = 0;},1000);
function frame() {
  for (let i = 0;i<UPDATES;i++) update();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  
  // ctx.fillStyle = `white`;
  for (let i = 0;i<CREATURE_AMOUNT;i++) {
    const ccc = hslToHex(creatures[i].hue,1,0.5);
    ctx.fillStyle = `rgb(${ccc[0]},${ccc[1]},${ccc[2]})`;
    
    ctx.beginPath();
    ctx.arc(creatures[i].x*WIDTH_MULTIPLIER+CREATURE_RADIUS, creatures[i].y*HEIGHT_MULTIPLIER+CREATURE_RADIUS, CREATURE_RADIUS, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
  }
  frames++;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);