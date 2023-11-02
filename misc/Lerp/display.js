let DISPLAY_LINES = document.getElementById("displayLines").checked;
let ANIMATING = false;
let GOING_RIGHT = true;

const canvas = document.getElementById("output");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

function getMousePos(event) {
  const img = document.getElementById("output");
  const rect = img.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (img.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (img.height / rect.height));
  return [y, x];
}
ctx.strokeStyle = "black";
var animationCounter = 0;
function animateLerp() {
  ANIMATING = ANIMATING?0:1;
  animationCounter = Number(document.getElementById("point").value)*100;
}
function frame() {
  if (animationCounter > 99) {GOING_RIGHT = false;}
  else if (animationCounter < 1) {GOING_RIGHT = true;}
  if (!ANIMATING) interpolate(Number(document.getElementById("point").value));
  else interpolate((GOING_RIGHT?animationCounter++:animationCounter--)/100,true);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  if (DISPLAY_LINES) {
    for (line of lines) {
      ctx.beginPath();
      ctx.moveTo(points[line[0]][0], points[line[0]][1]);
      ctx.lineTo(points[line[1]][0], points[line[1]][1]);
      ctx.stroke();
    } 
    ctx.fillStyle = "grey";
    for (point of points) {
      ctx.beginPath();
      ctx.arc(point[0], point[1], 5, 0, 2*Math.PI);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.arc(points[points.length-1][0], points[points.length-1][1], 5, 0, 2*Math.PI);
  ctx.fill();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);