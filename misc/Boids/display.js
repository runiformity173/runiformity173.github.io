

const canvas = document.getElementById("output");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

function getMousePos(event) {
  const img = document.getElementById("output");
  const rect = img.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (img.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (img.height / rect.height));
  return [y, x];
}
document.getElementById("output").addEventListener("mousemove",function (e) {
  const [y,x] = getMousePos(e);
  targetX = x;
  targetY = y;
});
ctx.strokeStyle = "black";
var animationCounter = 0;
function frame() {
  update();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  for (let i = 0;i<BOID_AMOUNT;i++) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(xPositions[i], yPositions[i], 3, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);