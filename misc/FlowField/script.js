const WIDTH = 128;
const HEIGHT = 128;
// const PARTICLE_AMOUNT = 512;
const PARTICLE_AMOUNT = 4096;

const MAX_SPEED = 2;
const PERLIN_MULT = 1;

var a = Math.random() * 4 - 2;
var b = Math.random() * 4 - 2;
var c = Math.random() * 4 - 2;
var d = Math.random() * 4 - 2;


// 0.4798911697942878 1.9338179819040464 0.6359464669781958 -0.2975054553073342


// a = -0.26960632598463175
// b = 0.49012040764123554
// c = 1.5127242709306228
// d = -0.9764703814894751

const xPositions = new Float32Array(PARTICLE_AMOUNT);
const yPositions = new Float32Array(PARTICLE_AMOUNT);
let xPositionsLast = new Float32Array(PARTICLE_AMOUNT);
let yPositionsLast = new Float32Array(PARTICLE_AMOUNT);
const xVelocities = new Float32Array(PARTICLE_AMOUNT);
const yVelocities = new Float32Array(PARTICLE_AMOUNT);
let yField = Array(HEIGHT).fill(0).map(()=>(Array(WIDTH)));
let xField = Array(HEIGHT).fill(0).map(()=>(Array(WIDTH)));


const speedSquared = MAX_SPEED**2;
const PI = Math.PI;
function moveParticle(x,y) {
  const i = Math.floor(Math.random()*PARTICLE_AMOUNT);
  xPositions[i] = x;yPositions[i] = y;
  xPositionsLast[i] = x;yPositionsLast[i] = y;
  xVelocities[i] = 0;yVelocities[i] = 0;
}
function addParticles() {
  for (let i = 0; i < PARTICLE_AMOUNT;i++) {
    xPositions[i] = Math.random()*(WIDTH-1);
    yPositions[i] = Math.random()*(HEIGHT-1);
    xPositionsLast[i] = xPositions[i];
    yPositionsLast[i] = yPositions[i];
    xVelocities[i] = 0;
    yVelocities[i] = 0;
  }
  // for (let y = 0;y<64;y++) {
  //   for (let x = 0;x<64;x++) {
  //     const i = y*64 + x;
  //     xPositions[i] = x*2;
  //     yPositions[i] = y*2;
  //     xPositionsLast[i] = xPositions[i];
  //     yPositionsLast[i] = yPositions[i];
  //     xVelocities[i] = 0;
  //     yVelocities[i] = 0;
  //   }
  // }
}
function addPoints() {
  if (CLIFFORD) {
    for (let x = 0;x<WIDTH;x++) {
      for (let y = 0;y<HEIGHT;y++) {
        // const noiseVal = ((noise.perlin2(x/WIDTH*PERLIN_MULT,y/HEIGHT*PERLIN_MULT)) + 1) * PI;
        var x1 = (x-WIDTH/2)/30;
        var y1 = (y-HEIGHT/2)/30;
  
        var x2 = Math.sin(a * y1) + c * Math.cos(a * x1);
        var y2 = Math.sin(b * x1) + d * Math.cos(b * y1);
        const noiseVal = Math.atan2(y2-y1,x2-x1);
        yField[y][x] = Math.sin(noiseVal) / 5;
        xField[y][x] = Math.cos(noiseVal) / 5;
  
        
      }
    }
  }
  else {
    noise.seed(Math.random());
    for (let x = 0;x<WIDTH;x++) {
      for (let y = 0;y<HEIGHT;y++) {
        yField[y][x] = noise.perlin2(x/WIDTH*PERLIN_MULT,y/HEIGHT*PERLIN_MULT);
  
      }
    }
    noise.seed(Math.random());
    for (let x = 0;x<WIDTH;x++) {
      for (let y = 0;y<HEIGHT;y++) {
        xField[y][x] = Math.sqrt(1 - yField[y][x]**2) * Math.sign(noise.perlin2(x/WIDTH*PERLIN_MULT,y/HEIGHT*PERLIN_MULT));
  
  
      }
    }
  }
}

// const clampPos = o=>Math.max(Math.min(o,WIDTH-2),0);
const clampPos = function(o){return (o<0?(WIDTH-1)+o:(o>(WIDTH-1)?o-WIDTH+1:o))};

function update() {
  for (let i = 0;i<PARTICLE_AMOUNT;i++) {
    const rx = Math.round(xPositions[i]);
    const ry = Math.round(yPositions[i]);
    xVelocities[i] += xField[ry][rx];
    yVelocities[i] += yField[ry][rx];
    
    if (yVelocities[i]**2 + xVelocities[i]**2 > speedSquared) {
      const speed = Math.sqrt(yVelocities[i]**2 + xVelocities[i]**2);
      xVelocities[i] = xVelocities[i]*(MAX_SPEED/speed);
      yVelocities[i] = yVelocities[i]*(MAX_SPEED/speed);
      if (!isFinite(xVelocities[i])) {
        console.log(speed)
      }
    }
    xPositions[i] = clampPos(xPositions[i] + xVelocities[i]);
    yPositions[i] = clampPos(yPositions[i] + yVelocities[i]);
  }
}