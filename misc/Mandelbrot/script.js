const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const overallLength = WIDTH*HEIGHT;
const canvas = document.getElementById("output");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

let X_MIN = -2;
let Y_MIN = -1.25;
let X_MAX = 1;
let Y_MAX = 1.25;
let X_ZOOM = (X_MAX-X_MIN);
let Y_ZOOM = (Y_MAX-Y_MIN);
function resetZoom() {
  X_MIN = -2;
  Y_MIN = -1.25;
  X_MAX = 1;
  Y_MAX = 1.25;
  X_ZOOM = (X_MAX-X_MIN);
  Y_ZOOM = (Y_MAX-Y_MIN);
  display();
}

function getValue(y,x) {
  return [X_MIN+(x/WIDTH*X_ZOOM),Y_MIN+(y/HEIGHT*Y_ZOOM)];
}
// alert(getValue(0,0));
// alert(getValue(HEIGHT,WIDTH));
function hslToHex(t,a,r){console.log(t,a,r);var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],[Math.round(255*(n+r)),Math.round(255*(d+r)),Math.round(255*(h+r))]}

let ITERATIONS = 1000;
const D_BAIL = 1000000;
const D_BAIL2 = D_BAIL**2;
const BOX_SIZE = 6;
function display() {
  var imgData = ctx.createImageData(WIDTH, HEIGHT);
  var data = imgData.data;
  for (var i = 0;i<HEIGHT;i++) {
    for (var j = 0;j<WIDTH;j++) {
      // if (i%(BOX_SIZE+1) > 0 && j % (BOX_SIZE+1) > 0) {continue;}
      const t = 4*(j+(i*WIDTH));
      let x2 = 0;
      let y2 = 0;
      let x = 0;
      let y = 0;
      // let dx_sum = 0;
      // let dy_sum = 0;
      const [x0,y0] = getValue(i,j);
      let k = 0;
      
      while (x2+y2 <= 4 && k < ITERATIONS) {
        k++;
        y = 2 * x * y + y0;
        x = x2 - y2 + x0;
        x2 = x * x;
        y2 = y * y;
        // dx_sum += (dx * x - dy * y) * 2 + 1
        // dy_sum += (dy * x + dx * y) * 2
      }
      if (k === ITERATIONS){data[t] = 0;data[t+1] = 0;data[t+2] = 0;data[t+3] = 255;}
      else if (k > -1) {
        const nu = Math.log2(Math.log2(x2 + y2) / 2);
        [data[t],data[t+1],data[t+2]] = hslToHex(((k-nu)/ITERATIONS*360)**1.5%360,1,0.5);data[t+3] = 255;
      }
      else {
        data[t] = 255;data[t+1] = 255;data[t+2] = 255;data[t+3] = 255;
      }
    }
  }
  // for (var yOff = 0;yOff<HEIGHT;yOff+=(BOX_SIZE+1)) {
  //   for (var xOff = 0;xOff<WIDTH;xOff+=(BOX_SIZE+1)) {
  //     let is = false;
  //     if (data[4*(xOff+yOff*WIDTH)] == 0 && data[4*(xOff+(yOff+BOX_SIZE+1)*WIDTH)] == 0 && data[4*(1+BOX_SIZE+xOff+(yOff+BOX_SIZE+1)*WIDTH)] == 0 && data[4*(1+BOX_SIZE+xOff+yOff*WIDTH)] == 0) {
  //       alert("saving");
  //       is = true;
  //     }
  //     alert(is);
  //     for (var i = yOff+1;i <= yOff+BOX_SIZE && i < HEIGHT;i++) {
  //       for (var j = xOff+1;j <= xOff+BOX_SIZE && j < WIDTH;j++) {
        
  //       const t = 4*(j+(i*WIDTH));
  //       let k = 0;
  //       if (!is) {
  //         let x2 = 0;
  //         let y2 = 0;
  //         let x = 0;
  //         let y = 0;
  //         // let dx_sum = 0;
  //         // let dy_sum = 0;
  //         const [x0,y0] = getValue(i,j);
    
  //         while (x2+y2 <= 4 && k < ITERATIONS) {
  //           k++;
  //           y = 2 * x * y + y0;
  //           x = x2 - y2 + x0;
  //           x2 = x * x;
  //           y2 = y * y;
  //           // dx_sum += (dx * x - dy * y) * 2 + 1
  //           // dy_sum += (dy * x + dx * y) * 2
  //         }
  //       }
  //       if (k === ITERATIONS || is){data[t] = 0;data[t+1] = 0;data[t+2] = 0;data[t+3] = 255;}
  //       else if (k > -1) {
  //         const nu = Math.log2(Math.log2(x2 + y2) / 2);
  //         [data[t],data[t+1],data[t+2]] = hslToHex(((k-nu)/ITERATIONS*360)**1.5%360,1,0.5);data[t+3] = 255;
  //       }
  //       else {
  //         data[t] = 255;data[t+1] = 255;data[t+2] = 255;data[t+3] = 255;
  //       }
  //     }}
  //   }
  // }
  ctx.putImageData(imgData, 0, 0);
  document.getElementById("loading").style.display = "none";
}
display();
let boxX = 0;
let boxY = 0;
let startX = 0;
let startY = 0;
window.addEventListener("mousedown",function(e) {
  boxX = e.clientX;boxY = e.clientY
  startX = e.clientX/document.body.clientWidth*X_ZOOM + X_MIN;
  startY = e.clientY/document.body.clientHeight*Y_ZOOM + Y_MIN;
});
window.addEventListener("mousemove",function(e) {
  if (startY == 0) {return;}
  document.getElementById("zoomBox").style.display = "block";
  document.getElementById("zoomBox").style.left = Math.min(e.clientX,boxX)-2 + "px";
  document.getElementById("zoomBox").style.top = Math.min(e.clientY,boxY)-2 + "px";
  document.getElementById("zoomBox").style.width = Math.max(e.clientX,boxX)-Math.min(e.clientX,boxX) + "px";
  document.getElementById("zoomBox").style.height = Math.max(e.clientY,boxY)-Math.min(e.clientY,boxY) + "px";
  // alert("Should've set");
});
window.addEventListener("mouseup",function(e) {
  setTimeout(function(){document.getElementById("loading").style.display = "block";},1);
  document.getElementById("zoomBox").style.display = "none";
  const endX = e.clientX/document.body.clientWidth*X_ZOOM + X_MIN;
  const endY = e.clientY/document.body.clientHeight*Y_ZOOM + Y_MIN;
  if (startX == endX || startY == endY) {
    startY = 0;
    return 0;
  }
  X_MIN = Math.min(startX,endX);
  X_MAX = Math.max(startX,endX);
  Y_MIN = Math.min(startY,endY);
  Y_MAX = Math.max(startY,endY);
  X_ZOOM = (X_MAX-X_MIN);
  Y_ZOOM = (Y_MAX-Y_MIN);
  startY = 0;

  // alert("displaying");
  document.getElementById("loading").style.display = "block";
  setTimeout(display,1);
  
  // alert("displayed");
});
window.addEventListener("keydown",function(e) {
  document.getElementById("loading").style.display = "block";
  setTimeout(resetZoom,1);
});
