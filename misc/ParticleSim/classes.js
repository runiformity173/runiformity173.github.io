"use strict";

// Add falling velocity

// When moving with force applied, convert to a particle, which converts back to the type when sees another element

//Lazy Chunks

// Gas is 1, Liquid is 2, Powder is 3, Solid is 4

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
function interact(p2,p1,turn2) {
  if (!p1) {return false;}
  if (p2.type === 7 && (p1.state > 1 && p1.type !== 8 && p1.type !== 20)) {return false;}
  if (p1.type === 7 && p2.type === 7) {
    [p1.id,p2.id] = [p2.id,p1.id];
    return false;
  }
  if (
    (
      DENSITIES[p1.type]>DENSITIES[p2.type] || // Density allows movement
      (
        p1.type != p2.type && p1.state < 2 && p2.state < 2 && DENSITIES[p1.type]===DENSITIES[p2.type] // Gases of equal density mixing
      )
    ) && 
    (
      (
        (!p2.moved) && (!p1.moved) // Hasn't acted this tick
      ) || (p2.state < p1.state) // Things can fall through an object multiple times in a tick
    )
  ) {
    // p2.turn = 1-p2.turn;
    // p2.moved = true;
    return true;
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
    this.friction = FRICTIONS[type];
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
    this.friction = FRICTIONS[type];

    this.age = 0;
    this.special = 0;
  }
  explode(board,row2,col2,height,width,radius2) {
    const explodeStack = new PriorityQueue((a,b) => a[0] > b[0]);
    explodeStack.push([radius2,row2,col2]);
    const explodedThisTime = new Set();
    while (explodeStack.size() > 0) {
      let [radius,row,col] = explodeStack.pop();
      const cur = board[row][col];
      if (cur.type === 0 || cur.type === 21) {cur.become(7);}
      else if (EXPLOSION[cur.type]) {
        radius = EXPLOSION[cur.type];
        cur.become(7);
        cur.heat = 100;
        cur.nextHeat = 100;
      } else if (radius >= radius2-2 && STATES[cur.type]>3) {
        cur.become(0);
      }
      cur.nextHeat = Math.max(50,cur.nextHeat);
      if (radius<=0){continue;}
      const maxRow = (row<height-1?2:1);
      const maxCol = (col<width-1?2:1);
      for (var i = (row>0?-1:0);i<maxRow;i++) {
        for (var j = (col>0?-1:0);j<maxCol;j++) {
          if ((i!==0 || j!==0) && (board[row+i][col+j].type != 7)) {
            const p = (row+i)+","+(col+j);
            if (explodedThisTime.has(p)) {
              continue;
            } 
            explodedThisTime.add(p);
            const newRadius = (radius-((Math.abs(i)+Math.abs(j)==2)?1.414:1))*(Math.random()*0.4+0.8);
            if (newRadius > 0)
              explodeStack.push([newRadius,row+i,col+j]);

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
      if (Math.random()>WIND) {
        if (left.type === 16 && left.special < this.special) {this.special--;left.special++;return;}
        if (right.type === 16 && right.special < this.special) {this.special--;right.special++;return;}
      } else {
        if (right.type === 16 && right.special < this.special) {this.special--;right.special++;return;}
        if (left.type === 16 && left.special < this.special) {this.special--;left.special++;return;}
      }
    // }




    //Grow down, then left/right
      if (down.type === 18) {down.become(16);this.special--;return}

      if (Math.random()>WIND) {

        if (left.type === 0) {left.become(16);this.special--;return}
        if (right.type === 0) {right.become(16);this.special--;return}
      } else {
        if (right.type === 0) {right.become(16);this.special--;return}
        if (left.type === 0) {left.become(16);this.special--;return}
      if (down.type === 0) {down.become(16);this.special--;return}

      }



  }
  spread(other,direction) {
    // Heat spread
    other.nextHeat = Math.max(Math.round((this.heat)/2)-2,other.nextHeat);
    // Powder giving impulse
    if (this.state == 3 && other.state == 3 && this.isFalling==0 && (other.isFalling > 0)) {
      if (Math.random() < 0.25) {
        other.isFalling = 0;
        // console.log("Sand set another to falling");
      }
    }
    const rxn2 = SPREADS[this.type][other.type];
    if (rxn2 !== undefined) {
      let rxn = [];
      let mn = rxn2.length;
      if (typeof rxn2[0] == "number") {
        rxn = rxn2;
        mn = 1;
      }
      for (let i = 0; i < mn; i++) {

        if (mn > 1) {rxn = SPREADS[this.type][other.type][i];}

        if (Math.random() < (rxn[2]||0.05) && (rxn[3]===undefined || rxn[3].includes(direction))) {
          if (other.type !== rxn[0]) {other.become(rxn[0]);}
          if (this.type !== rxn[1]) {this.become(rxn[1]);break;}
        }
      }
    }
    //Lava catching air on fire
    if (this.type == 20 && other.type == 0 && Math.random()>0.95 && direction==0) {
      other.become(7);
      other.heat = Math.max(other.heat,50);
      other.nextHeat = Math.max(other.nextHeat,50);
      other.lastType = 20;
    }


    // Plant getting water
    else if (this.type == 16) {
      if (Math.random()>0.95 && other.type == 2) {this.special+=2;other.become(0);}
    }
    // Plasma and fire making heat
    else if ((this.type == 7 || this.type == 11) && Math.random()>0.99) {
      other.nextHeat = (other.nextHeat+100)/2;
    }
  }
  update(board,row,col,height,width,turn,a=0) {
    this.turn = 1-this.turn;
    this.moved = false;
    const feelingRight = (this.leftLast == this.rightLast || Math.random()<Math.abs(WIND-0.5))?Math.random()<WIND:this.rightLast;
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
    if (this.type == 10 && this.heat <= 0 && (this.isFalling >= 10)) {
      console.log("glass froze");
      this.become(9);
    }
    if (this.type == 20 && this.heat <= 0 && (this.isFalling >= 10)) {
      this.become(4);
    }
    // Sand melting to glass
    if ((this.type == 1 || this.type == 23) && this.heat >= BURN_TEMP[this.type]) {
      this.become(9);
    }

    // Water boiling
    if (this.type == 2 && this.heat >= 15) {
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
      if (EXPLOSION[this.type]) {
        this.explode(board,row,col,height,width,EXPLOSION[this.type]);
      }
      this.become(7);
    }
    // Fire going out
    if (this.type == 7 && ((this.age>60 && Math.random()<0.2) || (this.lastType == 12 && this.heat < 55))) {
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
    if (row>0) this.spread(board[row-1][col],0);
    if (Math.random()>WIND) {
      if (col>0) this.spread(board[row][col-1],3);
      if (col<width-1) this.spread(board[row][col+1],1);
    } else {
      if (col<width-1) this.spread(board[row][col+1],1);
      if (col>0) this.spread(board[row][col-1],3);
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
        if (Math.random() < this.friction) {
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
      } else {
        this.isFalling += 1;
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
          // const k = getChunk(row,col);
          if (this.board[row][col].update(this.board,row,col,this.height,this.width,this.turn)) {
            this.board[row][col].moved = true;
            // const [y,x]= getChunkPos(row,col);
            // updateChunk(row,col);
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

    // lastTurnChunks = thisTurnChunks;
    // thisTurnChunks = Array.from({length:Math.floor(CHUNK_AMOUNT*CHUNK_AMOUNT)},()=>false);
    // alert("ending update");
  }

}