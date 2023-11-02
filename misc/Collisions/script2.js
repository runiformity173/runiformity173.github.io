//Verlet
// Don't change velocities
let CIRCLE_AMOUNT = 0;
let MAX_CIRCLES = 900;
let CIRCLE_RADIUS = 16;
let WIDTH = 1024;
let HEIGHT = 1024;
let FRICTION = 0.0;
// let MAX_CIRCLES = 1225;
// let CIRCLE_RADIUS = 16;
// let WIDTH = 1024;
// let HEIGHT = 1024;
let SUBSTEPS = 4;

let TIME = 0.5;

const PI = Math.PI;
const TAU = PI*2;
const ROOT2 = Math.sqrt(2);
const CENTER_X = WIDTH/2;
const CENTER_Y = HEIGHT/2;
const RAD = (HEIGHT/2)-CIRCLE_RADIUS;
const SQUARED_RAD = RAD**2;

let xPositions = new Float32Array(MAX_CIRCLES);
let yPositions = new Float32Array(MAX_CIRCLES);
let xLastPositions = new Float32Array(MAX_CIRCLES);
let yLastPositions = new Float32Array(MAX_CIRCLES);
let xAccelerations = new Float32Array(MAX_CIRCLES);
let yAccelerations = new Float32Array(MAX_CIRCLES);
let colors = [];
let radii = new Float32Array(MAX_CIRCLES);
const fixedGrid = Array.from({length:Math.floor(HEIGHT/CIRCLE_RADIUS/2)},()=>Array.from({length:Math.floor(WIDTH/CIRCLE_RADIUS/2)},()=>[]));


const clampSpeed = (o)=>(Math.min(o,16));
// const clampPos = (o)=>(o%WIDTH);
const clampPos = (o)=>(Math.max(Math.min(o,WIDTH),0));
const clamp1 = (o)=>(Math.max(Math.min(o,1),-1));
const clampCell = (o)=>(Math.max(Math.min(o,31),0));

function addCircle(x,y,vx=0,vy=0) {
  if (CIRCLE_AMOUNT < MAX_CIRCLES) {
  
    xPositions[CIRCLE_AMOUNT] = x;
    yPositions[CIRCLE_AMOUNT] = y;
    xLastPositions[CIRCLE_AMOUNT] = x-vx;
    yLastPositions[CIRCLE_AMOUNT] = y-vy;
    xAccelerations[CIRCLE_AMOUNT] = 0;
    yAccelerations[CIRCLE_AMOUNT] = 1;
    // radii[CIRCLE_AMOUNT++] = Math.floor(Math.random()*5)+5;


    fixedGrid[clampCell(Math.floor(y / CIRCLE_RADIUS / 2))][clampCell(Math.floor(x / CIRCLE_RADIUS / 2))].push(CIRCLE_AMOUNT);
    
    radii[CIRCLE_AMOUNT++] = CIRCLE_RADIUS;
  }
}
let CIRCLE_ADD_DIRECTION = 1;
let CIRCLE_ADD_VX = 1;
let FRAME_COUNTER = 1;
function update() {
  // addCircle(Math.floor(Math.random()*2)*1000,0);
  if (FRAME_COUNTER > 2) {
    // if (CIRCLE_ADD_VX<0) {
    //   addCircle(0,11,16,7);
    // } else if (CIRCLE_ADD_VX > 0) {
    //   addCircle(1023,11,-16,7);
    // } else {
    //   // addCircle(512,16,CIRCLE_ADD_DIRECTION*-16,7);
    // }
    addCircle(512,15,CIRCLE_ADD_VX*2,Math.abs(CIRCLE_ADD_VX)+10);
    // addCircle(550,15,CIRCLE_ADD_VX,10);
    CIRCLE_ADD_VX += CIRCLE_ADD_DIRECTION
    if (Math.abs(CIRCLE_ADD_VX) == 5) {CIRCLE_ADD_DIRECTION *= -1;}
    FRAME_COUNTER = 0;
  } FRAME_COUNTER++;
  
  for (let i = 0;i<CIRCLE_AMOUNT;i++) {
    
    const xVelocity = (xPositions[i]-xLastPositions[i])*(1-FRICTION);

    xLastPositions[i] = xPositions[i];
    xPositions[i] = xPositions[i] + xVelocity + xAccelerations[i] * TIME * TIME;
    const yVelocity = (yPositions[i]-yLastPositions[i])*(1-FRICTION);
    yLastPositions[i] = yPositions[i];
    yPositions[i] = yPositions[i] + yVelocity + yAccelerations[i] * TIME * TIME;
    const sqdist = (xPositions[i]-CENTER_X)**2 + (yPositions[i]-CENTER_Y)**2;
    if (sqdist > SQUARED_RAD) {
      const dist = RAD/Math.sqrt(sqdist);
      xPositions[i] = CENTER_X + (xPositions[i]-CENTER_X) * dist;
      yPositions[i] = CENTER_Y + (yPositions[i]-CENTER_Y) * dist;
    }
    // if (xPositions[i] > WIDTH-radii[i]) {
    //   xPositions[i] = WIDTH-radii[i];
    // } else if (xPositions[i] < radii[i]) {
    //   xPositions[i] = radii[i];
    // } if (yPositions[i] > HEIGHT-radii[i]) {
    //   yPositions[i] = HEIGHT-radii[i];
    // } else if (yPositions[i] < radii[i]) {
    //   yPositions[i] = radii[i];
    // }
  }
  
  for (let i = 0; i < CIRCLE_AMOUNT; i++) {
    const x = xPositions[i];
    const y = yPositions[i];
    const gridX = clampCell(Math.floor(x / CIRCLE_RADIUS / 2));
    const gridY = clampCell(Math.floor(y / CIRCLE_RADIUS / 2));
    const prevGridX = clampCell(Math.floor(xLastPositions[i] / CIRCLE_RADIUS / 2));
    const prevGridY = clampCell(Math.floor(yLastPositions[i] / CIRCLE_RADIUS / 2));
      if (gridX !== prevGridX || gridY !== prevGridY) {
        // Remove circle from previous grid cell
        const cellIndex = fixedGrid[prevGridY][prevGridX].indexOf(i);
        if (cellIndex !== -1) {
            fixedGrid[prevGridY][prevGridX].splice(cellIndex, 1);
        }
  
        // Add circle to the new grid cell
        fixedGrid[gridY][gridX].push(i);
      }
    }
  for (let substep = 0;substep < SUBSTEPS;substep++) {
    for (let i = 0; i < CIRCLE_AMOUNT; i++) {
          const gridX = Math.floor(xPositions[i] / CIRCLE_RADIUS / 2);
          const gridY = Math.floor(yPositions[i] / CIRCLE_RADIUS / 2);
  
          for (let xOffset = -1; xOffset <= 1; xOffset++) {
              for (let yOffset = -1; yOffset <= 1; yOffset++) {
                  const neighborX = gridX + xOffset;
                  const neighborY = gridY + yOffset;
  
                  if (neighborX >= 0 && neighborX < fixedGrid[0].length &&
                      neighborY >= 0 && neighborY < fixedGrid.length) {
                      const cell = fixedGrid[neighborY][neighborX];
                      for (const j of cell) {
                          if (i !== j) {
                              const radiusSum = radii[i] + radii[j];
          const dx = xPositions[j]-xPositions[i];
          const dy = yPositions[j]-yPositions[i];
          const distanceSquared = dx * dx + dy * dy;
      
          if (distanceSquared < radiusSum * radiusSum) {
            const distance = Math.sqrt(distanceSquared);
            const overlap = radiusSum - distance;
            let moveX = ((dx / distance) * (overlap / 2) / SUBSTEPS) || overlap / SUBSTEPS / 2;
            let moveY = ((dy / distance) * (overlap / 2) / SUBSTEPS) || overlap / SUBSTEPS / 2;
            yPositions[i] -= moveY;
            yPositions[j] += moveY;
            xPositions[i] -= moveX;
            xPositions[j] += moveX;
          }
                          }
                      }
                  }
              }
          }
      }
  }

}