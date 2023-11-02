let VISUAL_RANGE = 40;
let AVOID_RANGE = 6;
let MIN_SPEED = 3;
let MAX_SPEED = 6;
let ALIGNMENT_FACTOR = 0.05;
let COHESION_FACTOR = 0.005;
let SEPERATION_FACTOR = 0.5;
let TARGETING_FACTOR = 0.25;
let TURNING_FACTOR = 1;

let BOID_AMOUNT = 200;
let WIDTH = 1000;
let HEIGHT = 1000;
let MARGIN = 100;
let targetX = WIDTH/2;
let targetY = HEIGHT/2;

const PI = Math.PI;
const TAU = PI*2;
const ROOT2 = Math.sqrt(2);

let xPositions = new Float32Array(BOID_AMOUNT);
let yPositions = new Float32Array(BOID_AMOUNT);
let xVelocities = new Float32Array(BOID_AMOUNT);
let yVelocities = new Float32Array(BOID_AMOUNT);

const clampSpeed = (o)=>(Math.max(Math.min(o,MAX_SPEED),MIN_SPEED));
const clampPos = (o)=>(o%WIDTH);
// const clampPos = (o)=>(Math.max(Math.min(o,WIDTH),0));
const clamp1 = (o)=>(Math.max(Math.min(o,1),-1));

function addBoids() {
  for (let i = 0;i<BOID_AMOUNT;i++) {
    xPositions[i] = (Math.random()*WIDTH);
    yPositions[i] = (Math.random()*HEIGHT);
    xVelocities[i] = ((Math.random()*(MAX_SPEED-MIN_SPEED))+MIN_SPEED)/ROOT2 * (Math.floor(Math.random()*2)*-1);
    yVelocities[i] = ((Math.random()*(MAX_SPEED-MIN_SPEED))+MIN_SPEED)/ROOT2 * (Math.random()>0.5?-1:1);
  }
}
addBoids();
function update() {
  for (let i = 0;i<BOID_AMOUNT;i++) {
    let x = xPositions[i];
    let y = yPositions[i];
    let averageSpeed = 0;
    let closeAmount = 0;
    let averageX = 0;
    let averageY = 0;
    let averageXV = 0;
    let averageYV = 0;
    let averageX2 = 0;
    let averageY2 = 0;
    for (let j = 0;j<BOID_AMOUNT;j++) {
      if (i===j) continue;
      if (Math.abs(yPositions[j]-y)>VISUAL_RANGE || Math.abs(xPositions[j]-x)>VISUAL_RANGE || Math.hypot(xPositions[j]-x,yPositions[j]-y)>VISUAL_RANGE) continue;
      closeAmount++;
      averageX += xPositions[j];
      averageY += yPositions[j];
      averageXV += xVelocities[j];
      averageYV += yVelocities[j];
      if (Math.hypot(xPositions[j]-x,yPositions[j]-y)>AVOID_RANGE) continue;
      averageX2 += x-xPositions[j];
      averageY2 += y-yPositions[j];
    }
    if (closeAmount != 0) {
      xVelocities[i] += (averageX2*SEPERATION_FACTOR) + ((averageXV/closeAmount - xVelocities[i])*ALIGNMENT_FACTOR) + ((averageX/closeAmount - x)*COHESION_FACTOR);
      
      yVelocities[i] += (averageY2*SEPERATION_FACTOR) + ((averageYV/closeAmount - yVelocities[i])*ALIGNMENT_FACTOR) + ((averageY/closeAmount - y)*COHESION_FACTOR);
    }
    xVelocities[i] += (clamp1(targetX-x)*TARGETING_FACTOR)
    yVelocities[i] += (clamp1(targetY-y)*TARGETING_FACTOR)
    if (x<MARGIN) {xVelocities[i]+=TURNING_FACTOR}
    if (x>WIDTH-MARGIN) {xVelocities[i]-=TURNING_FACTOR}
    if (y<MARGIN) {yVelocities[i]+=TURNING_FACTOR}
    if (y>HEIGHT-MARGIN) {yVelocities[i]-=TURNING_FACTOR}
    const speed = Math.hypot(xVelocities[i],yVelocities[i]);
    if (speed>MAX_SPEED) {
      xVelocities[i] = (xVelocities[i]/speed)*MAX_SPEED;
      yVelocities[i] = (yVelocities[i]/speed)*MAX_SPEED;
    } else if (speed<MIN_SPEED) {
      xVelocities[i] = (xVelocities[i]/speed)*MIN_SPEED;
      yVelocities[i] = (yVelocities[i]/speed)*MIN_SPEED;
    }
    xPositions[i] = clampPos(xPositions[i] + xVelocities[i]);
    yPositions[i] = clampPos(yPositions[i] + yVelocities[i]);
  }
  // for (let i = 0;i<BOID_AMOUNT;i++) {
  //   xPositions[i] = clampPos(xPositions[i] + xVelocities[i]);
  //   yPositions[i] = clampPos(yPositions[i] + yVelocities[i]);
  // }
}