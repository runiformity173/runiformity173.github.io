let CLIFFORD = document.getElementById("clif").checked;
let FADE = document.getElementById("fade").checked;


const DISPLAY_WIDTH = 1024;
const DISPLAY_HEIGHT = 1024;
const LINE_MULT = 5

const PARTICLE_RADIUS = DISPLAY_WIDTH/WIDTH/2;
const WIDTH_MULTIPLIER = DISPLAY_WIDTH/WIDTH;
const HEIGHT_MULTIPLIER = DISPLAY_HEIGHT/HEIGHT;

const canvas = document.getElementById("output");
canvas.width = DISPLAY_WIDTH;
canvas.height = DISPLAY_HEIGHT;
const ctx = canvas.getContext("2d");

function randomizeColor() {
  const ccc = hslToHex(Math.random()*360,1,0.5);
  ctx.strokeStyle = `rgba(${ccc[0]},${ccc[1]},${ccc[2]},0.05)`;
}
function getMousePos(event) {
  const img = document.getElementById("output");
  const rect = img.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (img.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (img.height / rect.height));
  return [Math.floor(y/HEIGHT_MULTIPLIER), Math.floor(x/WIDTH_MULTIPLIER)];
}
document.getElementById("output").addEventListener("click",function (e) {
  const [y,x] = getMousePos(e);
  moveParticle(clampPos(x),clampPos(y));
});
function hslToHex(t,a,r){var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],[Math.round(255*(n+r)),Math.round(255*(d+r)),Math.round(255*(h+r))]}
ctx.strokeStyle = "black";
var animationCounter = 0;
let frames = 0;
setInterval(function(){document.getElementById("fps").innerHTML = frames;frames = 0;},1000);


function reduceAlpha() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 3; i < data.length; i += 4) {
        data[i] = Math.max(0, data[i] - 1);
    }

    ctx.putImageData(imageData, 0, 0);
}
function frame() {
  update();
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (FADE) reduceAlpha();
  
  ctx.lineWidth = PARTICLE_RADIUS;
  // ctx.lineCap = "round";


  // ctx.fillStyle = `white`;
  for (let i = 0;i<PARTICLE_AMOUNT;i++) {
    // const ccc = hslToHex(creatures[i].hue,1,0.5);
    // ctx.fillStyle = `rgb(${ccc[0]},${ccc[1]},${ccc[2]})`;
    // ctx.fillStyle = `black`;
    if ((xPositionsLast[i]-xPositions[i])**2 + (yPositionsLast[i]-yPositions[i])**2 > MAX_SPEED**2 + 1) {
      // console.log(Math.sqrt((xPositionsLast[i]-xPositions[i])**2 + (yPositionsLast[i]-yPositions[i])**2));
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(xPositionsLast[i]*WIDTH_MULTIPLIER, yPositionsLast[i]*HEIGHT_MULTIPLIER);
    ctx.lineTo(xPositions[i]*WIDTH_MULTIPLIER, yPositions[i]*HEIGHT_MULTIPLIER);

    ctx.stroke();
  }
  if (false) {
  for (let x = 0;x<WIDTH;x++) {
    for (let y = 0;y<HEIGHT;y++) {
      ctx.beginPath();
      ctx.moveTo(x*WIDTH_MULTIPLIER, y*HEIGHT_MULTIPLIER);
      ctx.lineTo((x+(xField[y][x]*LINE_MULT))*WIDTH_MULTIPLIER, (y+(yField[y][x]*LINE_MULT))*HEIGHT_MULTIPLIER);
      ctx.stroke();
    }
  }}
  xPositionsLast = structuredClone(xPositions);
  yPositionsLast = structuredClone(yPositions);

  frames++;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);