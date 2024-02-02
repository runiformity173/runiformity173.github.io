"use strict";
// Add falling velocity
// Only let sand go sideways diagonally if it's currently falling, set when falling or an adjacent object is falling (with a chance of inertia val)

// When moving with force applied, convert to a particle, which converts back to the type when sees another element

//Lazy Chunks

// Gas is 1, Liquid is 2, Powder is 3, Solid is 4

// const NAMES = ["Air","Sand","Water","Oil","Stone","Wood","Steam","Fire","Ash","Glass","Molten Glass","Plasma","Fuse","Spring","Gunpowder","Phase Dust","Plant","Methane","Soil"]
// const DENSITIES = [0,10,5,4,100,50,-5,0,10,50,6,100,50,100,10,101,50,-10,10];
// const STATES = [1,3,2,2,4,4,1,1,3,4,2,4,4,4,3,3,4,1,3];
// const HEATS = [0,0,0,0,0,0,10,100,5,0,25,100,0,0,0,0,0,0,0];
// const FALL_RATES = [0,];
// const HEATS_MATTER = [false,true,true,true,false,true,true,false,true,true,false,true,false,true,false,true,true,false];
// const BURN_TEMP = [1000,25,1000,15,1000,30,1000,1000,1000,1000,1000,1000,10,1000,15,1000,30,1,1000];
// const FUEL = [0,0,0,100,0,50,0,100,0,0,0,100,50,0,100,0,40,100,0];

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
function interact(p2,p1,turn2,gravity=true) {
  if (!p1) {return false;}
  if (p2.type === 7 && (p1.state > 1 && p1.type !== 8)) {return false;}
  if (gravity) {
  if ((DENSITIES[p1.type]>DENSITIES[p2.type] || (p1.type != p2.type && DENSITIES[p1.type]===DENSITIES[p2.type] && p1.state < 2 && p2.state < 2)) && (((!p2.moved) && (!p1.moved)) || (p2.state < p1.state))) {
    // p2.turn = 1-p2.turn;
    // p2.moved = true;
    return true;
  }
  } else {
    if (DENSITIES[p1.type]<DENSITIES[p2.type] && ((!p2.moved) && (!p1.moved)) || (p2.state < p1.state)) {
    p2.turn = 1-p2.turn;
    // p2.moved = true;
    return true;
  }
  }

  return false;
}
function isPlasma(p1,p2) {return ((p1) && (p1[p2]) && p1[p2].state == 8);}

let BURNED_OIL_YET_THIS_FRAME = false;
let BURNED_OIL_FRAMES_CONSECUTIVE = 0;

class Particle {
  constructor(id,type = 0) {
    this.type = type;
    this.turn = 1;
    this.state = STATES[type];
    this.heat = HEATS[type]
    this.lastHeat = HEATS[type];
    this.moved = false;
    this.isFalling = 1000;
    this.leftLast = false;
    this.rightLast = false;
    this.nextHeat = HEATS[type];
    this.age = 0;
    // this.heatMatters = HEATS_MATTER[type];
    this.special = 0;
    this.id = id;
  }
  become(type) {
    this.isFalling = 1000;
    this.lastType = this.type;
    this.type = type;
    this.state = STATES[type];
    this.age = 0;
    // this.heatMatters = HEATS_MATTER[type];
    this.special = 0;
  }
  explode(board,row2,col2,height,width,radius2) {
    const explodeStack = [[row2,col2,radius2]];
    while (explodeStack.length > 0) {
      const [row,col,radius] = structuredClone(explodeStack.pop(0));
      const cur = board[row][col];
      if (cur.type === 0 || cur.type === 21) {cur.become(7);cur.lastType = 17;}
      cur.nextHeat = Math.max(50,cur.nextHeat);
      if (radius<=0){continue;}
      const maxRow = (row<height-1?2:1);
      const maxCol = (col<width-1?2:1);
      for (var i = (row>0?-1:0);i<maxRow;i++) {
        for (var j = (col>0?-1:0);j<maxCol;j++) {
          //  && (board[row+i][col+j].type == 0 || board[row+i][col+j].type == 7)
          if ((i!==0 || j!==0) && (board[row+i][col+j].type != 17 && board[row+i][col+j].type != 7)) {
            explodeStack.push([row+i,col+j,radius-(i===0||j===0?1:ROOT2)])
          }
        }
      }
    }

  }
  plantGrow(up,down,left,right) {
    // Grow up
    if (up.type === 0) {up.become(16);this.special--;return}
    // Spread up
    if (up.type === 16 && up.special < this.special && Math.random()<0.6) {
      this.special--;up.special++;return;
    }
    //Spread sideways
    // if (Math.random()>0.5) {
      if (Math.random()>0.5) {
        if (left.type === 16 && left.special < this.special) {this.special--;left.special++;return;}
        if (right.type === 16 && right.special < this.special) {this.special--;right.special++;return;}
      } else {
        if (right.type === 16 && right.special < this.special) {this.special--;right.special++;return;}
        if (left.type === 16 && left.special < this.special) {this.special--;left.special++;return;}
      }
    // }




    //Grow down, then left/right
      if (down.type === 18) {down.become(16);this.special--;return}

      if (Math.random()>0.5) {

        if (left.type === 0) {left.become(16);this.special--;return}
        if (right.type === 0) {right.become(16);this.special--;return}
      } else {
        if (right.type === 0) {right.become(16);this.special--;return}
        if (left.type === 0) {left.become(16);this.special--;return}
      if (down.type === 0) {down.become(16);this.special--;return}

      }



  }
  spread(other,a) {
    // Heat spread
    other.nextHeat = Math.max(Math.round((this.heat)/2)-2,other.nextHeat);
    // Powder giving impulse
    if (this.state == 3 && other.state == 3 && this.isFalling==0 && (other.isFalling > 0)) {
      if (Math.random() < 0.25) {
        other.isFalling = 0;
        // console.log("Sand set another to falling");
      }
    }
    // Fuse spreading
    if (other.type == 12 && this.heat > 9 && other.heat < 10) {
      other.nextHeat += FUEL[12];
    } 
    // Spring making water
    if (this.type == 13 && Math.random()>0.95 && other.type == 0) {other.become(2);}

    // Ice Freezing Water
    if (this.type == 19 && Math.random()>0.95 && other.type == 2 && other.heat < 1) {other.become(19);}

    // Poison Spreading
    if (this.type == 21 && Math.random()>0.95) {
      if (other.type === 0 || other.type === 16) {
        other.become(21);
      } else if (other.type === 16) {
        other.become(5);
      }
    }

    // Plant getting water
    else if (this.type == 16) {
      if (Math.random()>0.95 && other.type == 2) {this.special++;other.become(0);}
    }
    // Soil getting water
    else if (this.type == 18) {
      if (Math.random()>0.95 && other.type == 2) {this.become(16);other.become(0);}
    }
    // Plasma making heat
    else if (this.type == 11 && Math.random()>0.99) {other.nextHeat = (other.nextHeat+100)/2;}
  }
  update(board,row,col,height,width,turn,a=0) {
    this.turn = 1-this.turn;
    this.moved = false;
    const feelingRight = (this.leftLast == this.rightLast)?Math.random()<0.5:this.rightLast;
    this.leftLast = false;
    this.rightLast = false;
    this.age++;

    //Plant growing
    if (this.type == 16 && this.special > 0) {
      let tempUp = {type:4}, tempDown = {type:4}, tempLeft = {type:4}, tempRight = {type:4};
      if (row>0) tempUp = board[row-1][col];
      if (col>0) tempLeft = board[row][col-1];
      if (col<width-1) tempRight = board[row][col+1];
      if (row<height-1) tempDown = board[row+1][col];
      this.plantGrow(tempUp,tempDown,tempLeft,tempRight);
    }
    // Steam condensing
    if (this.type == 6 && this.heat <= 0 && Math.random()>0.975) {
      this.become(2);
    }
    // Molten glass freezing
    if (this.type == 10 && this.heat <= 0) {
      console.log("glass froze");
      this.become(9);
    }
    if (this.type == 20 && this.heat <= 0 && (this.isFalling >= 10)) {
      this.become(4);
    }
    // Glass melting, heat needed at 1000 rn
    // if (this.type == 9 && this.heat >= 1000) {
    //   this.become(10);
    // }
    // Sand melting to glass
    if (this.type == 1 && this.heat >= BURN_TEMP[1]) {
      this.become(9);
    }

    // Water boiling
    if (this.type == 2 && this.heat >= 50) {
      this.become(6);
    }
    // Ice melting
    if (this.type == 19 && this.heat >= 1) {
      this.become(2);
      this.nextHeat = Math.max(0,this.nextHeat-100)
    }
    // Burning
    if (this.heat >= BURN_TEMP[this.type]) {
      this.heat = Math.min(this.heat+FUEL[this.type],100);
      this.nextHeat += FUEL[this.type];
      if (this.type == 3) {BURNED_OIL_YET_THIS_FRAME = true;}
      if (this.type == 17) {
        this.explode(board,row,col,height,width,5);
      }
      this.become(7);
    }
    // Fire going out
    if (this.type == 7 && (this.heat < 1 || (this.age>180) || (this.lastType == 12 && this.heat < 55))) {
      if (this.lastType == 5) {
        this.become(8);
      } else if (this.lastType == 2) {
        this.become(6)
      } else if (this.lastType == 1) {
        this.become(9)
      } else {
        this.become(0);
      }
    }
    // Spreading
    if (row>0) this.spread(board[row-1][col],2);
    if (Math.random()>0.5) {
      if (col>0) this.spread(board[row][col-1],2);
      if (col<width-1) this.spread(board[row][col+1],2);
    } else {
      if (col<width-1) this.spread(board[row][col+1],2);
      if (col>0) this.spread(board[row][col-1],2);
    }
    if (row<height-1) this.spread(board[row+1][col],2);
    // Heat stuff
    this.lastHeat = this.heat;
    this.heat = this.nextHeat;
    this.nextHeat = this.type!=-1?Math.max(0,this.heat-(Math.floor(Math.random()*5))-(this.lastType==12?Math.floor(Math.random()*6)+7:0)):100;
    // Powder
    if (this.state == 3) {
      if (row < height-1) {
        //Down
        if (interact(board[row+1][col],this,turn)) {
          this.isFalling = 0;
          this.velocity = 5;
          board[row+1][col] = swap(board[row][col], board[row][col]=board[row+1][col]);
          return true;}
        // Down-Diagonal
        if (this.isFalling > 0) {
          this.isFalling += 1;
          return false;
        }
        if (feelingRight) {
        if (col < width-1 && interact(board[row+1][col+1],this,turn)  && interact(board[row][col+1],this,turn)) {
          board[row+1][col+1] = swap(board[row][col], board[row][col]=board[row+1][col+1]);
          this.rightLast = true;
          return true;
        }}
        if (col > 0 && interact(board[row+1][col-1],this,turn) && interact(board[row][col-1],this,turn)) {
          board[row+1][col-1] = swap(board[row][col], board[row][col]=board[row+1][col-1]);
          this.leftLast = true;
          return true;
        }
        if (!feelingRight) {
        if (col < width-1 && interact(board[row+1][col+1],this,turn)  && interact(board[row][col+1],this,turn)) {
          board[row+1][col+1] = swap(board[row][col], board[row][col]=board[row+1][col+1]);
          this.rightLast = true;
          return true;
        }}
        // More Falling
        if (Math.random > 0.8) {
          this.isFalling += 1;
          return false;
        }
        if (feelingRight) {
        if (col < width-2 && interact(board[row+1][col+2],this,turn) && interact(board[row][col+1],this,turn) && interact(board[row][col+2],this,turn)) {
          board[row+1][col+2] = swap(board[row][col], board[row][col]=board[row+1][col+2]);
          this.rightLast = true;
          return true;
        }}
        if (col > 1 && interact(board[row+1][col-2],this,turn) && interact(board[row][col-1],this,turn) && interact(board[row][col-2],this,turn)) {
          board[row+1][col-2] = swap(board[row][col], board[row][col]=board[row+1][col-2]);
          this.leftLast = true;
          return true;
        }
        if (!feelingRight) {
        if (col < width-2 && interact(board[row+1][col+2],this,turn) && interact(board[row][col+1],this,turn) && interact(board[row][col+2],this,turn)) {
          board[row+1][col+2] = swap(board[row][col], board[row][col]=board[row+1][col+2]);
          this.rightLast = true;
          return true;
        }}
        this.isFalling += 1;
      } else {
        this.isFalling += 1;
      }

    }
    // Liquid
    if (this.state == 2 || this.state == 1) {
      if (row < height-1) {
        if (interact(board[row+1][col],this,turn)) {
          board[row+1][col] = swap(board[row][col], board[row][col]=board[row+1][col]);
          this.isFalling = 0;return true;}
        this.isFalling += 1;
        if (feelingRight) {
        if (col < width-1 && interact(board[row+1][col+1],this,turn) && interact(board[row][col+1],this,turn)) {
          board[row+1][col+1] = swap(board[row][col], board[row][col]=board[row+1][col+1]);
          this.rightLast = true;
          return true;

        }}

        if (col > 0 && interact(board[row+1][col-1],this,turn) && interact(board[row][col-1],this,turn)) {
          board[row+1][col-1] = swap(board[row][col], board[row][col]=board[row+1][col-1]);
          this.leftLast = true;
          return true;
        }
        if (!feelingRight) {
        if (col < width-1 && interact(board[row+1][col+1],this,turn) && interact(board[row][col+1],this,turn)) {
          board[row+1][col+1] = swap(board[row][col], board[row][col]=board[row+1][col+1]);
          this.rightLast = true;
          return true;
        }}
        // if (feelingRight) {
        // if (col < width-2 && interact(board[row+1][col+2],this,turn)) {
        //   board[row+1][col+2] = swap(board[row][col], board[row][col]=board[row+1][col+2]);
        //   this.rightLast = true;
        //   return true;

        // }}
        // if (col > 1 && interact(board[row+1][col-2],this,turn)) {
        //   board[row+1][col-2] = swap(board[row][col], board[row][col]=board[row+1][col-2]);
        //   this.leftLast = true;
        //   return true;
        // }
        // if (!feelingRight) {
        // if (col < width-2 && interact(board[row+1][col+2],this,turn)) {
        //   board[row+1][col+2] = swap(board[row][col], board[row][col]=board[row+1][col+2]);
        //   this.rightLast = true;
        //   return true;
        // }}
      }
        if (feelingRight) {
        if (col < width-1 && interact(board[row][col+1],this,turn)) {
            board[row][col+1] = swap(board[row][col], board[row][col]=board[row][col+1]);
          this.rightLast = true;
            return true;
          }}
        if (col > 0 && interact(board[row][col-1],this,turn)) {
          board[row][col-1] = swap(board[row][col], board[row][col]=board[row][col-1]);
          this.leftLast = true;
          return true;
        }
      if (!feelingRight) {
        if (col < width-1 && interact(board[row][col+1],this,turn)) {
            board[row][col+1] = swap(board[row][col], board[row][col]=board[row][col+1]);
          this.rightLast = true;
            return true;
          }}
      if (Math.random()<0.01 && row>0 && interact(board[row-1][col])) {
        board[row-1][col] = swap(board[row][col], board[row][col]=board[row-1][col]);
        return true;
      } else {
        this.isFalling += 1;
        return false;
      }
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
class Board {
  constructor(width,height) {
    this.width = width;
    this.height = height;
    var i = 0;
    this.board = Array.from({length:HEIGHT},()=>Array.from({length:WIDTH},a=>(new Particle(i++))));
    this.turn = 0;
  }
  update() {
    // alert("starting update");
    let t = [];
    for (var i = 0;i!==this.width;i++) {t.push(i)}
    this.turn = 1-this.turn;
    BURNED_OIL_YET_THIS_FRAME = false;
    for (let row = this.height-1;row>=0;row--) {
      shuffle(t);
      for (let i = this.width-1;i!==0;i--) {
        const col = t[i];
        if (this.board[row][col].turn == this.turn) {
          const k = getChunk(row,col);
          if (this.board[row][col].update(this.board,row,col,this.height,this.width,this.turn)) {
            this.board[row][col].moved = true;
          }
        }
      }
    }
    if (BURNED_OIL_YET_THIS_FRAME == true) {
      BURNED_OIL_FRAMES_CONSECUTIVE++;
      if (BURNED_OIL_FRAMES_CONSECUTIVE == 500) {
        freedom();
        BURNED_OIL_FRAMES_CONSECUTIVE = 0;
      }
    } else {BURNED_OIL_FRAMES_CONSECUTIVE = 0;}
    // alert("about to swap");

    // alert("ending update");
  }

}
