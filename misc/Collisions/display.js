let PAUSED = false;
let DISPENSING = false;
let MODE = 0; // 0 is add, 1 is static, 2 is link, 3 is drag

const IMAGE = "starryNight";

const canvas = document.getElementById("output");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

function getMousePos(event) {
  const img = document.getElementById("output");
  const rect = img.getBoundingClientRect();
  const x = ((event.clientX - rect.left) * (img.width / rect.width));
  const y = ((event.clientY - rect.top) * (img.height / rect.height));
  return [y, x];
}
document.getElementById("output").addEventListener("click",function (e) {
  const [y,x] = getMousePos(e);
  if (MODE !== 3) updates.push([y,x]);
});
let dragging = -1;
let dragStatic = false;
let dragX = -1;
let dragXOffset = -1;
let dragYOffset = -1;
let dragY = -1;
document.getElementById("output").addEventListener("mousedown",function (e) {
  if (MODE === 3) {
    const [y,x] = getMousePos(e);
    updates.push([y,x]);
    dragX = x;
    dragY = y;
  }
});
function updateDrag(e) {
  if (MODE === 3) {
    const [y,x] = getMousePos(e);
    dragX = x;
    dragY = y;
  }
}
function stopDragging() {
  if (!dragStatic) {staticCircles.delete(dragging);}
  dragging = -1;
}
document.getElementById("output").addEventListener("mousemove",updateDrag);
document.getElementById("output").addEventListener("mouseleave",stopDragging);
document.getElementById("output").addEventListener("mouseup",stopDragging);
document.body.addEventListener("keydown",function(e) {
  if (e.key==" ") {
    PAUSED=!PAUSED;document.getElementById("pauseButton").innerHTML={'Pause':'Unpause','Unpause':'Pause'}[document.getElementById("pauseButton").innerHTML];
  }
});
function hslToHex(t,a,r){var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],[Math.round(255*(n+r)),Math.round(255*(d+r)),Math.round(255*(h+r))]}
ctx.strokeStyle = "black";
var animationCounter = 0;
let frames = 0;
setInterval(function(){document.getElementById("fps").innerHTML = frames;frames = 0;},1000);
function count() {
  let number = 0;
  for (const row of fixedGrid) {
    for (const cell of row) {
      number += cell.length
    }
  }
  return number;
}
ctx.strokeStyle = "black";
ctx.lineWidth = 2;
ctx.lineCap = "round"
function frame() {
  try {update();} catch (e) {alert(e.stack);}
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = CIRCLE_AMOUNT-1;i>=0;i--) {
    if (MODE !== 2) {
      if (colors.length) {
        ctx.fillStyle = colors[i];
      } else {const ccc = hslToHex(i/(MAX_CIRCLES/4)*360 % 360,1,0.5);
      ctx.fillStyle = `rgb(${ccc[0]},${ccc[1]},${ccc[2]})`;}
    } else {
      if (linkSelected === i) {
        ctx.fillStyle = `rgb(34,34,200)`;
      } else {
        ctx.fillStyle = `rgb(80,80,80)`;
      }
    }
    
    ctx.beginPath();
    ctx.arc(xPositions[i], yPositions[i], radii[i], 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
  }
  if (MODE === 2 || true) {
    for (const constraintKey in distanceConstraintDict) {
      for (const c of distanceConstraintDict[constraintKey]) {
        const i = Number(constraintKey);
        const j = c;
        ctx.beginPath();
        ctx.moveTo(xPositions[i], yPositions[i]);
        ctx.lineTo(xPositions[j], yPositions[j]);
        ctx.stroke();
      }
    }
  }
  frames++;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

async function setColors(colors) {
    const canvas2 = document.createElement('canvas');
    const ctx2 = canvas2.getContext('2d');
    const image = new Image();
    image.src = "images/"+IMAGE+".jpg";

    await new Promise(resolve => {
        image.onload = resolve;
    });

    canvas2.width = image.width;
    canvas2.height = image.height;
    ctx2.drawImage(image, 0, 0, canvas2.width, canvas2.height);

    const xFactor = (canvas2.width/WIDTH);
    const yFactor = (canvas2.height/HEIGHT);
    for (let i = 0;i<CIRCLE_AMOUNT;i++) {
        // Get pixel data at the specified location
        const pixelData = ctx2.getImageData(xPositions[i]*xFactor, yPositions[i]*yFactor, 1, 1).data;
        const averageColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
        const circleIsInsideImage = pixelData[3] !== 0;

        colors.push(circleIsInsideImage ? averageColor : 'transparent');
    }
  console.log("DONE");
}




// document.getElementById("imageInput").addEventListener("change",handleFileSelect,false);
function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const imageDataUrl = e.target.result;
    const img = new Image();
    img.onload = function () {
      const canvas2 = document.createElement('canvas');
      colors = [];
      canvas2.width = img.width;
      canvas2.height = img.height;
      const ctx2 = canvas.getContext('2d');
      
      console.log(canvas2.width, canvas2.height);
      ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
  
      const xFactor = (canvas2.width/WIDTH);
      const yFactor = (canvas2.height/HEIGHT);
      for (let i = 0;i<MAX_CIRCLES;i++) {
        // Get pixel data at the specified location
        const pixelData = ctx2.getImageData(Math.floor(xPositionsFinal[i]*xFactor),Math.floor(yPositionsFinal[i]*yFactor), 1, 1).data;
        const averageColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;

        colors.push(pixelData[3] === 0?"white":averageColor);
      }
  console.log("DONE");
      
    };
    
    img.src = imageDataUrl;
  };

  reader.readAsDataURL(file);
}