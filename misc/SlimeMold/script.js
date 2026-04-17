function getBoardValue(board, position) {
  total = 0;
  poss = [position];
  for (let offsetY = -2; offsetY <= 2;offsetY++) {
    for (let offsetX = -2; offsetX <= 2;offsetX++) {
      let y = Math.round(position[0])+offsetY;
      let x = Math.round(position[1])+offsetX;
      if (y < 0 || y > h-2 || x < 0 || x > w-2) {
    total -= 10;
        continue;
  }
      total += board[y*w+x];
      poss.push([y,x]);
    }
  }
  return total;
  // const topLeft = board[y][x];
  // const topRight = board[y][x + 1];
  // const bottomLeft = board[y + 1][x];
  // const bottomRight = board[y + 1][x + 1];

  // const topInterpolation = topLeft + (topRight - topLeft) * deltaX;
  // const bottomInterpolation = bottomLeft + (bottomRight - bottomLeft) * deltaX;

  // return topInterpolation + (bottomInterpolation - topInterpolation) * deltaY;
}
const TURN_RADIUS = Math.PI/32;
const SENSE_RADIUS = Math.PI/32;
function turn2(agent, board) {
  const sensorAngles = [agent.direction+SENSE_RADIUS, agent.direction, agent.direction-SENSE_RADIUS]; // Angles for the sensors
  const sensorOffsets = sensorAngles.map(angle => [-Math.sin(angle)*5, Math.cos(angle)*5]); // Offsets based on sensor angles
  const sensorValues = sensorOffsets.map(offset => {
    const sensorPos = [agent.y + offset[0], agent.x + offset[1]];
    if (sensorPos[0] < 0 || sensorPos[0] >= h || sensorPos[1] < 0 || sensorPos[1] >= w) {
      return Infinity; // Out of bounds position
    }
    return getBoardValue(board,sensorPos); // Use whole number indices for board lookup
  });

  const currentDirection = agent.direction;
  const leftSensorValue = sensorValues[0];
  const forwardSensorValue = sensorValues[1];
  const rightSensorValue = sensorValues[2];
  let newDirection = currentDirection;
  if (!isNaN(currentDirection)) {
    if (rightSensorValue < forwardSensorValue && leftSensorValue < forwardSensorValue) {
      newDirection = currentDirection;
    } else if (rightSensorValue > forwardSensorValue && leftSensorValue > forwardSensorValue) {
      newDirection = currentDirection + (Math.random()-0.5)*TURN_RADIUS;
    } else if (rightSensorValue > leftSensorValue) {
      newDirection = currentDirection - TURN_RADIUS;
    } else if (rightSensorValue < leftSensorValue) {
      newDirection = currentDirection + TURN_RADIUS;
    }
    
  } else {
    newDirection = currentDirection; // Default direction if current direction is NaN
  }
  
  agent.direction = newDirection;

  return agent;
}

const canvas = document.getElementById("my-canvas")
let w = 600;
let h = w;
canvas.height = w;
canvas.width = h;
const agentN = 6250;
const ctx = canvas.getContext("2d");
const agents = [];
function roll(r){return Math.floor(Math.random()*r);}
for (let i = 0; i < agentN;i++) {agents.push({direction:Math.random()*Math.PI*2,x:119+roll(2),y:119+roll(2)})}
let board = new Float32Array(w*h);
for (let i = 0;i<h*w;i++) board[i] = 0;
function normalize2(val) {return (val<0)?0:((val>1)?1:val)}
function normalizeCoord(val) {return val<0?0:(val>w-1?w-1:val)}
const newBoard = new Float32Array(w*h);
function blur(matrix) {
	const rows = w;
	const cols = h;
	blurredMatrix = new Float32Array(cols*rows);
	for(let i = 0; i < rows; i++) {
		for(let j = 0; j < cols; j++) {
			let sum = 0;
			let count = 8;
      for (let row = Math.max(i-1,0);row < Math.min(h,i+2);row++) {
        for (let col = Math.max(j-1,0);col < Math.min(w,j+2);col++) {
          if (row == i && col == j) {sum += matrix[row*w+col]*8;}
          count++;
          sum += matrix[row*w+col];
        }
      }
			// for(let m = -1; m <= 1; m++) {
			// 	for(let n = -1; n <= 1; n++) {
			// 		const row = i + m;
			// 		const col = j + n;
			// 		if(row >= 0 && row < rows && col >= 0 && col < cols) {
      //       if (m == 0 && n == 0) {sum += matrix[row][col]*8;}
      //       count++;
			// 			sum += matrix[row][col];
			// 		}
			// 	}
			// }
			blurredMatrix[i*w+j] = Math.max(0,sum/count-0.001);
		}
	}
	return blurredMatrix;
}

// write a javascript function called "turn" that takes an object "agent" and the board "board" as an argument. The agent has an int x property, an int y property, and an Array (length 2) direction property. The direction [a,b] is what offsets would be applied to [y,x] to get [y+a,x+b]. If the direction offsets are applied to the y and x coordinates, it moves in that direction. Using this information on how the direction works, the function should modify the agent to have a new direction. There are 9 possible values for the direction, and [0,0] will never appear making it 8 possibilities. Using the board information, the agent can turn 45 degrees left, 45 degrees right, or stay in the same place. It decides which one by choosing the lowest of the board values one step away in those 3 directions.
function updateBoard() {
  board = blur(board);
  for (let agent of agents) {
    turn2(agent,board);
    while (agent.direction >= Math.PI * 2) {agent.direction -= Math.PI * 2}
    while (agent.direction < 0) {agent.direction += Math.PI * 2}
    agent.y += -Math.sin(agent.direction);
    agent.x += Math.cos(agent.direction);
    if (agent.y < 0 || agent.y > w-1) {
      agent.y = normalizeCoord(agent.y);
      agent.direction = Math.random()*Math.PI*2;
    }
    if (agent.x < 0 || agent.x > w-1) {
      agent.x = normalizeCoord(agent.x);
      agent.direction = Math.random()*Math.PI*2;
    }
    board[Math.round(agent.y)*w+Math.round(agent.x)] = 1.0;
  }
}

function n2(val) {return val > 255?255:val}
function loop() {
  //update
  updateBoard();
  updateBoard();
  var imgData = ctx.createImageData(w,h); // width x height
  var data = imgData.data;
  
  // copy img byte-per-byte into our ImageData
  for (var i = 0, len = h; i < len; i++) {
    for (var j = 0, len2 = w*4; j < len2; j+=4) {
      data[(w*i*4)+j] = n2(board[i*w+j/4]*318);
      data[(w*i*4)+j+1] = n2(board[i*w+j/4]*318);
      data[(w*i*4)+j+2] = n2(board[i*w+j/4]*318);
      data[(w*i*4)+j+3] = 255;
    }
  }
  // for (let agent of agents) {
  //   // data[((Math.round(agent.y)*w)+Math.round(agent.x))*4] = 255;
  //   data[((Math.round(agent.y)*w)+Math.round(agent.x))*4+1] = 0;
  //   data[((Math.round(agent.y)*w)+Math.round(agent.x))*4+2] = 0;
  // }
  // now we can draw our imagedata onto the canvas
  ctx.putImageData(imgData, 0, 0);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);