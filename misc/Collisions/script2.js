const staticCircles = new Set([0,10]);
const distanceConstraints = [
    { circle1: 0, circle2: 1, distance: 32 },
  { circle1: 2, circle2: 1, distance: 32 },
  { circle1: 2, circle2: 3, distance: 32 },
  { circle1: 4, circle2: 3, distance: 32 },
  { circle1: 4, circle2: 5, distance: 32 },
  { circle1: 6, circle2: 5, distance: 32 },
  { circle1: 6, circle2: 7, distance: 32 },
  { circle1: 8, circle2: 7, distance: 32 },
  { circle1: 8, circle2: 9, distance: 32 },
  { circle1: 10, circle2: 9, distance: 32 },
];
const distanceConstraintDict = {};
const constraintDistanceDict = {};
for (const i of distanceConstraints) {
  distanceConstraintDict[Math.min(i.circle1,i.circle2)]=[Math.max(i.circle1,i.circle2)];
  if (!(Math.min(i.circle1,i.circle2) in constraintDistanceDict)) {constraintDistanceDict[Math.min(i.circle1,i.circle2)] = {};}
  constraintDistanceDict[Math.min(i.circle1,i.circle2)][Math.max(i.circle1,i.circle2)] = i.distance;}
//Verlet
// Don't change velocities
let CIRCLE_AMOUNT = 0;
let MAX_CIRCLES = 1000;
let CIRCLE_RADIUS = 16;
let WIDTH = 1024;
let HEIGHT = 1024;
let FRICTION = 0.01;
// let MAX_CIRCLES = 1225;
// let CIRCLE_RADIUS = 16;
// let WIDTH = 1024;
// let HEIGHT = 1024;
let SUBSTEPS = 5;

let TIME = 0.5;
let LINK_DISTANCE = 32;

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
let lastGridXs = new Float32Array(MAX_CIRCLES);
let lastGridYs = new Float32Array(MAX_CIRCLES);
let xAccelerations = new Float32Array(MAX_CIRCLES);
let yAccelerations = new Float32Array(MAX_CIRCLES);
let colors = [];
let radii = new Float32Array(MAX_CIRCLES);
const fixedGrid = Array.from({length:Math.floor(HEIGHT/CIRCLE_RADIUS/2)},()=>Array.from({length:Math.floor(WIDTH/CIRCLE_RADIUS/2)},()=>[]));

let updates = [];
let linkSelected = -1;
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
    lastGridXs[CIRCLE_AMOUNT] = clampCell(Math.floor(x / CIRCLE_RADIUS / 2));
    lastGridYs[CIRCLE_AMOUNT] = clampCell(Math.floor(y / CIRCLE_RADIUS / 2));
    radii[CIRCLE_AMOUNT++] = CIRCLE_RADIUS;
  }
}
addCircle(512-120,512,0,0);
addCircle(512,512,0,1);
addCircle(512,512,0,1);
addCircle(512,512,0,1);
addCircle(512,512,0,1);
addCircle(512,512,0,1);
addCircle(512,512,0,1);
addCircle(512,512,0,1);
addCircle(512,512,0,1);
addCircle(512,512,0,1);
addCircle(512+120,512,0,0);
function updateCells() {
  for (let i = 0; i < CIRCLE_AMOUNT; i++) {
  const x = xPositions[i];
  const y = yPositions[i];
  const gridX = clampCell(Math.floor(x / CIRCLE_RADIUS / 2));
  const gridY = clampCell(Math.floor(y / CIRCLE_RADIUS / 2));
  const prevGridX = lastGridXs[i];
  const prevGridY = lastGridYs[i];
    if (gridX !== prevGridX || gridY !== prevGridY) {
      // Remove circle from previous grid cell
      const cellIndex = fixedGrid[prevGridY][prevGridX].indexOf(i);
      if (cellIndex !== -1) {
          fixedGrid[prevGridY][prevGridX].splice(cellIndex, 1);
      }
      // Add circle to the new grid cell
      lastGridXs[i] = gridX;
      lastGridYs[i] = gridY;

      fixedGrid[gridY][gridX].push(i);
    }
  }
}
let CIRCLE_ADD_DIRECTION = 1;
let CIRCLE_ADD_VX = 1;
let FRAME_COUNTER = 1;
function update() {
  
  for (const [y,x] of updates){
    const z = new Set();
    const gridX = clampCell(Math.floor(x / CIRCLE_RADIUS / 2));
  const gridY = clampCell(Math.floor(y / CIRCLE_RADIUS / 2));
  let found = false;
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
          const neighborX = gridX + xOffset;
          const neighborY = gridY + yOffset;

          if (neighborX >= 0 && neighborX < fixedGrid[0].length &&
              neighborY >= 0 && neighborY < fixedGrid.length) {
              const cell = fixedGrid[neighborY][neighborX];
              for (const j of cell) {
                if (!z.has(j)) {
                  z.add(j);
                  if ((x-xPositions[j])**2+(y-yPositions[j])**2 <= radii[j]**2) {
                    if (MODE == 1) {
                      if (staticCircles.has(j)) {
                        staticCircles.delete(j);
                      } else {
                        staticCircles.add(j);
                      }
                    }
                    else if (MODE == 2 && found == false) {
                      if (linkSelected>-1) {
                        if ((distanceConstraintDict[Math.min(linkSelected,j)]||[]).includes(Math.max(linkSelected,j))) {
                          distanceConstraintDict[Math.min(linkSelected,j)].splice(distanceConstraintDict[Math.min(linkSelected,j)].indexOf(Math.max(linkSelected,j)),1)
                        } 
                        else{  
                          distanceConstraintDict[Math.min(linkSelected,j)]=distanceConstraintDict[Math.min(linkSelected,j)]||[];
                          distanceConstraintDict[Math.min(linkSelected,j)].push(Math.max(linkSelected,j))
                          if (!(Math.min(linkSelected,j) in constraintDistanceDict)) {constraintDistanceDict[Math.min(linkSelected,j)] = {}}
                          constraintDistanceDict[Math.min(linkSelected,j)][Math.max(linkSelected,j)] = (LINK_DISTANCE>-1)?LINK_DISTANCE:(Math.sqrt((xPositions[linkSelected]-xPositions[j])**2+(yPositions[linkSelected]-yPositions[j])**2));
                        }
                        linkSelected = -1;
                      }
                      else linkSelected = j;
                    } else if (MODE === 3 && found == false) {
                      dragging = j;
                      dragStatic = staticCircles.has(j);
                      dragXOffset = x-xPositions[j];
                      dragYOffset = y-yPositions[j];

                      staticCircles.add(j);
                    }
                    found=true;

                  }
                }
              }
          }
      }
  }
  if (!found && MODE==0) addCircle(x,y);}
  updates = [];
  if (MODE === 3 && dragging >= 0) {
    xLastPositions[dragging] = xPositions[dragging];
    yLastPositions[dragging] = yPositions[dragging];
    xPositions[dragging] = dragX-dragXOffset;
    yPositions[dragging] = dragY-dragYOffset;
    // xLastPositions[dragging] = dragX;
    // yLastPositions[dragging] = dragY;
  }
  // addCircle(Math.floor(Math.random()*2)*1000,0);
  if (PAUSED) {updateCells();return}
  if (FRAME_COUNTER > 2 && DISPENSING) {
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
    
    if (dragging === i) {
      continue;
    }
    const xVelocity = (xPositions[i]-xLastPositions[i])*(1-FRICTION);

    xLastPositions[i] = xPositions[i];
    const yVelocity = (yPositions[i]-yLastPositions[i])*(1-FRICTION);
    yLastPositions[i] = yPositions[i];
    if (staticCircles.has(i)) {continue;}
    xPositions[i] = xPositions[i] + xVelocity + xAccelerations[i] * TIME * TIME;
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
  
  updateCells();
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
            if (staticCircles.has(i)&&staticCircles.has(j)) {

            } else if (staticCircles.has(i)) {
              xPositions[j] += moveX*2;
              yPositions[j] += moveY*2;
            } else if (staticCircles.has(j)) {
              xPositions[i] -= moveX*2;
              yPositions[i] -= moveY*2;
            } else {
              xPositions[j] += moveX;
              yPositions[j] += moveY;
              xPositions[i] -= moveX;
              yPositions[i] -= moveY;
            }
            // yPositions[i] -= moveY;
            // yPositions[j] += moveY;
            // xPositions[i] -= moveX;
            // xPositions[j] += moveX;
          }
                          }
                      }
                  }
              }
          }
      }
    for (const constraintKey in distanceConstraintDict) {
      for (const c of distanceConstraintDict[constraintKey]) {
        const constraint = {circle1:Number(constraintKey),circle2:c,distance:constraintDistanceDict[constraintKey][c]};
        const circle1ID = constraint.circle1;
        const circle2ID = constraint.circle2;
        const desiredDistance = constraint.distance;
        const dx = xPositions[circle2ID] - xPositions[circle1ID];
        const dy = yPositions[circle2ID] - yPositions[circle1ID];
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 1) {continue;}
        const difference = desiredDistance - distance;
      const moveX = (dx / distance) * (difference / 2) / SUBSTEPS;
      const moveY = (dy / distance) * (difference / 2) / SUBSTEPS;
        if (staticCircles.has(circle1ID)&&staticCircles.has(circle2ID)) {

        } else if (staticCircles.has(circle1ID)) {
          xPositions[circle2ID] += moveX*2;
          yPositions[circle2ID] += moveY*2;
        } else if (staticCircles.has(circle2ID)) {
          xPositions[circle1ID] -= moveX*2;
          yPositions[circle1ID] -= moveY*2;
        } else {
          xPositions[circle2ID] += moveX;
          yPositions[circle2ID] += moveY;
          xPositions[circle1ID] -= moveX;
          yPositions[circle1ID] -= moveY;
        }
      }
    }
    
  }
}