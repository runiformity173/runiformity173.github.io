const defaultSave = {"Snake":[[1,0.2,0,0,0,0],[0,1,0.2,0,0,0],[0,0,1,0.2,0,0],[0,0,0,1,0.2,0],[0,0,0,0,1,0.2],[0.2,0,0,0,0,1]]};

const canvas = document.getElementById("my-canvas")
const ctx = canvas.getContext("2d")
let threeD = true;
const n = 1000;
const dt = 0.02;
const frictionHalfLife = 0.04;
let rMax = 0.4;
const m = 6;
let heightDivisor = 2;
// const matrix = [[1,0.2,0,0,0,0],[0,1,0.2,0,0,0],[0,0,1,0.2,0,0],[0,0,0,1,0.2,0],[0,0,0,0,1,0.2],[0.2,0,0,0,0,1]];
let matrix = makeRandomMatrix();
const frictionFactor = Math.pow(0.5,dt/frictionHalfLife)
const colors = new Int32Array(n);
const positionsX = new Float32Array(n);
const positionsY = new Float32Array(n);
const positionsZ = new Float32Array(n);
const velocitiesX = new Float32Array(n);
const velocitiesY = new Float32Array(n);
const velocitiesZ = new Float32Array(n);
let forceFactor = 10;
for (let i = 0;i<n;i++) {
  colors[i] = Math.floor(Math.random()*m);
  positionsX[i] = Math.random()*2-1;
  positionsY[i] = Math.random()*2-1;
  positionsZ[i] = Math.random()*2-1;
  velocitiesX[i] = 0;
  velocitiesY[i] = 0;
  velocitiesZ[i] = 0;
}

function makeRandomMatrix() {
  const rows = [];
  for (let i = 0;i<m;i++) {
    const row = [];
    for (let j = 0;j < m;j++) {
      row.push(Math.random()*2-1);
    }
    rows.push(row);
  }
  return rows
}
function force(r,a) {
  const beta = 0.3;
  if (r < beta) {
    return r/beta-1;
  } else if (beta < r && r < 1) {
    return a * (1-Math.abs(2*r-1-beta)/(1-beta))
  } else {return 0;}
}
function normalize2(val) {return (val<-1)?val+2:((val>1)?val-2:val)}
function updateParticles() {
  for (let i = 0;i<n;i++) {
    let totalForceX = 0;
    let totalForceY = 0;
    let totalForceZ = 0;
    for (let j = 0;j<n;j++) {
      if (j===i) continue;
      const rx = positionsX[j]-positionsX[i];
      const ry = positionsY[j]-positionsY[i];
      const rz = (positionsZ[j]-positionsZ[i])/heightDivisor;
      const r = threeD?Math.sqrt(rx*rx + ry*ry + rz*rz):Math.hypot(rx,ry);
      if (r>0 && r<rMax) {
        const f = force(r/rMax,matrix[colors[i]][colors[j]]);
        totalForceX += rx/r*f;
        totalForceY += ry/r*f;
        if (threeD) totalForceZ += rz/r*f;
      }
    }
    totalForceX *= rMax * forceFactor;
    totalForceY *= rMax * forceFactor;
    if (threeD) totalForceZ *= rMax * forceFactor;
    velocitiesX[i] *= frictionFactor;
    velocitiesY[i] *= frictionFactor;
    if (threeD) velocitiesZ[i] *= frictionFactor;
    velocitiesX[i] += totalForceX*dt;
    velocitiesY[i] += totalForceY*dt;
    if (threeD) velocitiesZ[i] += totalForceZ*dt;
  }
  
  for (let i = 0; i<n;i++) {
    positionsX[i] = normalize2((velocitiesX[i] * dt)+positionsX[i]);
    positionsY[i] = normalize2((velocitiesY[i] * dt)+positionsY[i]);
    if (threeD) positionsZ[i] = normalize2((velocitiesZ[i] * dt)+positionsZ[i]);
  }
}
function loop() {
  //update
  updateParticles();
  //draw
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < n;i++) {
    ctx.beginPath();
    const f = threeD?2/(positionsZ[i]+2):1;
    const screenX = (positionsX[i]+1)/2 * canvas.width;
    const screenY = (positionsY[i]+1)/2 * canvas.height;
    ctx.arc(screenX, screenY, (f), 0, 2*Math.PI);
    ctx.fillStyle = 'hsl('+(360*colors[i]/m)+',100%,50%)';
    ctx.fill();
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
function setCookie(name,value) {
    var expires = "";
    if (true) {
        var date = new Date();
        date.setTime(date.getTime() + (100000*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function save() {
  let name = prompt("What should it be named?");
  let saved = JSON.parse(getCookie("saved"));
  if (saved === null) {saved = defaultSave;}
  console.log(saved);
  saved[name] = matrix;
  setCookie("saved",JSON.stringify(saved));
}
function load() {
  let saved = JSON.parse(getCookie("saved"));
  if (saved === null) {saved = defaultSave;}
  let name = "";
  while (!(name in saved)) {name=prompt("What to load? You currently have "+Object.keys(saved).join(", ")+".");if(name=="none"||name==""){return}}
  matrix = saved[name];
}
function delet() {}