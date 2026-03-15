"use strict";
const ROOT2 = Math.sqrt(2);
var swap = function (x){return x;};
const CHUNK_SIZE = 8;
function getChunk(row,col) {
  return Math.floor(row/CHUNK_SIZE)*CHUNK_AMOUNT + Math.floor(col/CHUNK_SIZE);
}
function getChunkPos(row,col) {
  return [row%CHUNK_SIZE,col%CHUNK_SIZE];
}
function updateChunk(row,col) {
  const k = getChunk(row,col);
  thisTurnChunks[k] = true;
  if (col >= CHUNK_SIZE) {
    thisTurnChunks[k-1] = true;
  }
  if (row >= CHUNK_SIZE) {
    thisTurnChunks[k-CHUNK_AMOUNT] = true;
    if (col >= CHUNK_SIZE) {
      thisTurnChunks[k-1-CHUNK_AMOUNT] = true;
    }
    if (col < WIDTH-CHUNK_SIZE) {
      thisTurnChunks[k+1-CHUNK_AMOUNT] = true;
    }
  }
  if (col < WIDTH-CHUNK_SIZE) {
    thisTurnChunks[k+1] = true;
  }
  if (row < HEIGHT - CHUNK_SIZE) {
    thisTurnChunks[k+CHUNK_AMOUNT] = true;
    if (col >= CHUNK_SIZE) {
      thisTurnChunks[k-1+CHUNK_AMOUNT] = true;
    }
    if (col < WIDTH-CHUNK_SIZE) {
      thisTurnChunks[k+1+CHUNK_AMOUNT] = true;
    }
  }
}
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
function shadingFromSquareCoords(i,j) {
  if (i > 2 && i < 5 && j > 2 && j < 5) return 30;
  if (j > 0 && j < 7 && (i == 1 || i == 6) || i > 0 && i < 7 && (j == 1 || j == 6)) return 0;
  return -30;
}
function addSquare(y,x,color) {
  for (let i = 0;i<8;i++) {
    if (y+i < 0) continue;
    for (let j = 0;j<8;j++) {
      const id = getSandID();
      idToColor[id] = color;
      board.board[y+i][x+j] = id;
      randomColorBoard[id] = shadingFromSquareCoords(i,j);
    }
  }
}
class Shape {
  constructor() { // IOTSZJL
    this.board = [
      [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
      [[1,1],[1,1]],
      [[0,1,0],[1,1,1],[0,0,0]],
      [[0,1,1],[1,1,0],[0,0,0]],
      [[1,1,0],[0,1,1],[0,0,0]],
      [[1,0,0],[1,1,1],[0,0,0]],
      [[0,0,1],[1,1,1],[0,0,0]],
    ][Math.floor(Math.random()*7)];
    this.color = Math.floor(Math.random()*4);
    this.height = this.board.length;
    this.width = this.board[0].length;
    this.left = 50-4*this.width;
    this.top = -8*this.height;
    this.drawShape();
  }
  drawShape() {
    this.el = document.createElement("canvas");
    this.el.width = 8*this.width;
    this.el.height = 8*this.height;
    this.el.classList.add("piece");
    this.el.style.height = (canvas.offsetHeight*8*this.height/128)+"px";
    this.el.style.left = "0px";
    this.el.style.top = "0px";
    this.elCtx = this.el.getContext("2d");
    const el2 = document.createElement("div");
    el2.classList.add("preview");
    el2.appendChild(this.el);
    document.body.appendChild(el2);
    var imgData = this.elCtx.createImageData(this.width*8, this.height*8);
    var data = imgData.data;
    for (var i = 0;i<this.height*8;i++) {
      for (var j = 0;j<this.width*8;j++) {
        const t = 4*(j+(i*this.width*8));
        const b = this.board[Math.floor(i/8)][Math.floor(j/8)];
        if (b > 0) {
          let theColor = colors[this.color];
          const shading = shadingFromSquareCoords(i%8,j%8);
          data[t] = theColor[0]+shading;data[t+1] = theColor[1]+shading;data[t+2] = theColor[2]+shading;data[t+3] = 255;
        }
      }
    }
    this.elCtx.putImageData(imgData, 0, 0);
  }
  rasterize() {
    this.el.parentElement.remove();
    let minI = 1;
    for (let i = 0;i<this.board.length;i++) {
      for (let j = 0;j<this.board[0].length;j++) {
        if (this.board[i][j] > 0) {
          minI = Math.min(minI,i*8+this.top)
          addSquare(this.top+8*i,this.left+8*j,this.color);
        }
      }
    }
    return minI < 1;
  }
  moveDown() {
    for (var i = 1;i<=this.height*8;i++) {
      if (this.top+i < 0) continue
      for (var j = 0;j<this.width*8;j++) {
        const b = this.board[Math.floor((i-1)/8)][Math.floor(j/8)];
        if (b > 0) {
          if (i+this.top == HEIGHT) return false;
          if (board.board[this.top+i][this.left+j] > -1) return false;
        }
      }
    }
    this.top++;
    this.el.style.top = (canvas.offsetHeight*this.top/128)+"px";
    return true;
  }
  moveLeft() {
    for (var i = 0;i<this.height*8;i++) {
      for (var j = -1;j<this.width*8-1;j++) {
        const b = this.board[Math.floor(i/8)][Math.floor((j+1)/8)];
        if (b > 0) {
          if (j+this.left < 0) return false;
          if (this.top+i < 0) continue
          if (board.board[this.top+i][this.left+j] > -1) return false;
        }
      }
    }
    this.left--;
    this.el.style.left = (canvas.offsetWidth*this.left/100)+"px";
    return true;
  }
  moveRight() { //  MAKE IT RIGHT
    for (var i = 0;i<this.height*8;i++) {
      for (var j = 1;j<=this.width*8;j++) {
        const b = this.board[Math.floor(i/8)][Math.floor((j-1)/8)];
        if (b > 0) {
          if (this.left+j == WIDTH) return false;
          if (this.top+i < 0) continue
          if (board.board[this.top+i][this.left+j] > -1) return false;
        }
      }
    }
    this.left++;
    this.el.style.left = (canvas.offsetWidth*this.left/100)+"px";
    return true;
  }
}
class Board {
  constructor(width,height) {
    this.width = width;
    this.height = height;
    var i = 0;
    this.board = Array.from({length:HEIGHT},()=>Array.from({length:WIDTH},a=>(-1)));
    this.lastTurnDir = {};
    this.turn = 0;
  }
  updateBoard(updateNum) {
    const thisTurnDir = {};
    let t = [];
    if (updateNum % 4 == 2) for (var i = 0;i!==this.width;i++) t.push(i);
    else for (var i = this.width-1;i!==-1;i--) {t.push(i)}
    for (let row = this.height-1;row>=0;row--) {
      for (let i = this.width-1;i!==-1;i--) {
        const col = t[i];
        if (this.board[row][col] > -1 && row < this.height-1) {
          let updated = true;
          let canMoveD = false;
          let canMoveDL = false;
          let canMoveDR = false;
          const leftFirst = (updateNum % 4) == 0;
          if (this.board[row+1][col] == -1) {
            canMoveD = true;
          }
          if (leftFirst && col > 0 && this.board[row+1][col-1] == -1) {
            canMoveDL = true;
          } else if (col < this.width-1 && this.board[row+1][col+1] == -1) {
            canMoveDR = true;
          } if (col > 0 && this.board[row+1][col-1] == -1) {
            canMoveDL = true;
          }
          if (canMoveD && (!canMoveDL && !canMoveDR || true)) {
            this.board[row+1][col] = this.board[row][col];
            this.board[row][col] = -1;
          } else if (canMoveDL) {
            this.board[row+1][col-1] = this.board[row][col];
            this.board[row][col] = -1;
          } else if (canMoveDR) {
            this.board[row+1][col+1] = this.board[row][col];
            this.board[row][col] = -1;
          } else {
            updated = false;
          }
          if (updated) {
            // const [y,x]= getChunkPos(row,col);
            // updateChunk(row,col);
          }
        }
      }
    }
  }
    // alert("about to swap");

    // lastTurnChunks = thisTurnChunks;
    // thisTurnChunks = Array.from({length:Math.floor(CHUNK_AMOUNT*CHUNK_AMOUNT)},()=>false);
    // alert("ending update");
  updateShapes(updateNum) {
    if (updateNum % 2 == 0 || MOVING_DOWN) {
      if (!currentShape.moveDown()) {
        if (currentShape.rasterize()) {
          alert("YOU LOSE");
        }
        currentShape = nextShape;
        currentShape.el.parentElement.classList.remove("preview");
        currentShape.el.style.left = (canvas.offsetWidth*currentShape.left/100)+"px";
        currentShape.el.style.top = (canvas.offsetHeight*currentShape.top/128)+"px";
        nextShape = new Shape();
      }
    }
    if (LEFT_MOVE) currentShape.moveLeft();
    LEFT_MOVE = MOVING_LEFT;
    if (RIGHT_MOVE) currentShape.moveRight();
    RIGHT_MOVE = MOVING_RIGHT;
    this.checkForLineClears()
  }
  checkForLineClears() {
    const neighbors = new DSU(this.width*this.height);
    for (let j = 0; j < this.width;j++) {
      for (let i = 0; i < this.height;i++) {
        if (this.board[i][j] > -1) {
          if (j < this.width - 1 && idToColor[this.board[i][j+1]] == idToColor[this.board[i][j]]) neighbors.join(i*this.width+j,i*this.width+j+1);
          if (i < this.height - 1 && idToColor[this.board[i+1][j]] == idToColor[this.board[i][j]]) neighbors.join(i*this.width+j,(i+1)*this.width+j);
        }
      }
    }
    const reachFromLeft = new Set();
    const reachFromRight = new Set();
    for (let i = 0; i < this.height;i++) {
      if (this.board[i][0] > -1) {
        reachFromLeft.add(neighbors.get(i*this.width));
      }
    }
    for (let i = 0; i < this.height;i++) {
      if (this.board[i][this.width-1] > -1) {
        reachFromRight.add(neighbors.get(i*this.width+this.width-1));
      }
    }
    const baleeted = reachFromLeft.intersection(reachFromRight);
    if (baleeted.size > 0) {
      animationFrames = 80;
      toBeRemoved = new Set();
      for (let j = 0; j < this.width;j++) {
        for (let i = 0; i < this.height;i++) {
          if (this.board[i][j] > -1 && baleeted.has(neighbors.get(i*this.width+j))) {
            toBeRemoved.add(i*this.width+j);
          }
        }
      }
    }
  }
  update(updateNum) {
    if (PAUSED && !ONE_STEP) return;
    if (updateNum % 2 == 0) this.updateBoard(updateNum);
    this.updateShapes(updateNum);
    this.checkForLineClears()
    ONE_STEP = false;
  }
}
let highestID = -1;
const reuseIDs = [];
function getSandID() {
  if (reuseIDs.length == 0) {return ++highestID}
  return reuseIDs.pop();
}