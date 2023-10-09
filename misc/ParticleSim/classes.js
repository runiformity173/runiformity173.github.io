"use strict";
// Add falling velocity
// Only let sand go sideways diagonally if it's currently falling, set when falling or an adjacent object is falling (with a chance of inertia val)

// When moving with force applied, convert to a particle, which converts back to the type when sees another element

//Lazy Chunks


// Gas is 1, Liquid is 2, Powder is 3, Solid is 4
const NAMES = ["Air","Sand","Water","Oil","Stone","Wood","Steam","Fire","Ash","Glass","Molten Glass","Plasma","Fuse","Spring","Gunpowder","Phase Dust","Plant","Methane","Soil"]
const DENSITIES = [0,10,5,4,100,50,-5,0,10,50,6,100,50,100,10,101,50,-10,10];
const STATES = [1,3,2,2,4,4,1,1,3,4,2,4,4,4,3,3,4,1,3];
const HEATS = [0,0,0,0,0,0,10,100,5,0,25,100,0,0,0,0,0,0,0];
const FALL_RATES = [0,];
const HEATS_MATTER = [false,true,true,true,false,true,true,false,true,true,false,true,false,true,false,true,true,false];
const BURN_TEMP = [1000,25,1000,15,1000,30,1000,1000,1000,1000,1000,1000,10,1000,15,1000,30,1,1000];
const FUEL = [0,0,0,100,0,50,0,100,0,0,0,100,50,0,100,0,40,100,0];

const ROOT2 = Math.sqrt(2);
var swap = function (x){return x};
const CHUNK_AMOUNT = 16;
function getChunk(row,col) {
  return Math.floor(row/CHUNK_AMOUNT)*CHUNK_AMOUNT + Math.floor(col/CHUNK_AMOUNT);
}
function getChunkPos(row,col) {
  return [row%CHUNK_AMOUNT,col%CHUNK_AMOUNT];
}
function interact(p2,p1,turn2,gravity=true) {
  if (!p1) {return false;}
  if (p2.type === 7) {return false;}
  if (gravity) {
  if (DENSITIES[p1.type]>DENSITIES[p2.type] && (((!p2.moved) && (!p1.moved)) || (p2.state < p1.state))) {
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
  constructor(type = 0) {
    this.type = type;
    this.turn = 1;
    this.state = STATES[type];
    this.heat = HEATS[type]
    this.lastHeat = HEATS[type];
    this.moved = false;
    this.isFalling = false;
    this.leftLast = false;
    this.rightLast = false;
    this.nextHeat = HEATS[type];
    this.age = 0;
    this.heatMatters = HEATS_MATTER[type];
    this.special = 0;
  }
  become(type) {
    this.lastType = this.type;
    this.type = type;
    this.state = STATES[type];
    this.age = 0;
    this.heatMatters = HEATS_MATTER[type];
    this.special = 0;
  }
  explode(board,row2,col2,height,width,radius2) {
    const explodeStack = [[row2,col2,radius2]];
    while (explodeStack.length > 0) {
      const [row,col,radius] = structuredClone(explodeStack.pop(0));
      const cur = board[row][col];
      if (cur.type === 0) {cur.become(7);cur.lastType = 17;}
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
    // Fuse spreading
    if (other.type == 12 && this.heat > 9 && other.heat < 10) {
      other.nextHeat += FUEL[12];
    } 
    // Spring making water
    if (this.type == 13 && Math.random()>0.95 && other.type == 0) {other.become(2);}
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
    // Glass melting, heat needed at 1000 rn
    if (this.type == 9 && this.heat >= 1000) {
      this.become(10);
    }
    // Sand melting to molten glass
    // if (this.type == 1 && this.heat >= 25) {
    //   this.become(10);
    // }
    
    // Water boiling
    if (this.type == 2 && this.heat >= 25) {
      this.become(6);
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
    // Heat stuff
    this.lastHeat = this.heat;
    this.heat = this.nextHeat;
    this.nextHeat = this.type!=-1?Math.max(0,this.heat-(Math.floor(Math.random()*5))-(this.lastType==12?Math.floor(Math.random()*6)+7:0)):100;
    // Powder
    if (this.state == 3) {
      if (row < height-1) {
        if (interact(board[row+1][col],this,turn)) {
          this.isFalling = true;
          this.velocity = 5;
          board[row+1][col] = swap(board[row][col], board[row][col]=board[row+1][col]);
          return true;}
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
        this.isFalling = false;
      }
      
    }
    // Liquid
    if (this.state == 2 || this.state == 1) {
      if (row < height-1) {
        if (interact(board[row+1][col],this,turn)) {
          board[row+1][col] = swap(board[row][col], board[row][col]=board[row+1][col]);
        return true;}
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
      }
    }
    //PLASMA
    if (this.state == 8) {
      const canUp = (row>0 && interact(board[row-1][col],this));
      const canDown = (row<height-1 && interact(board[row+1][col],this));
      const canLeft = (col>0 && interact(board[row][col-1],this));
      const canRight = (col<width-1 && interact(board[row][col+1],this));
      const canUL = (canUp && canLeft && interact(board[row-1][col-1],this));
      const canUR = (canUp && canRight && interact(board[row-1][col+1],this));
      const canDR = (canDown && canRight && interact(board[row+1][col+1],this));
      const canDL = (canDown && canLeft && interact(board[row+1][col-1],this));
      var ups = 0;
      var downs = 0;
      var lefts = 0;
      var rights = 0;
      var uls = 0;
      var urs = 0;
      var drs = 0;
      var dls = 0;
      var current = 0;
      /*
       +++ 
      +   +
      +   +
      +   +
       +++ 
      */
      if (isPlasma(board[row-2],col)) {ups++;uls++;urs++;}
      if (isPlasma(board[row-2],col-1)) {ups++;uls++;}
      if (isPlasma(board[row-2],col+1)) {ups++;urs++;}
      if (isPlasma(board[row+2],col+1)) {downs++;drs++;}
      if (isPlasma(board[row+2],col-1)) {downs++;dls++;}
      if (isPlasma(board[row+2],col)) {downs++;dls++;drs++;}
      if (isPlasma(board[row],col-2)) {lefts++;dls++;uls++}
      if (isPlasma(board[row+1],col-2)) {lefts++;dls++}
      if (isPlasma(board[row-1],col-2)) {lefts++;uls++}
      if (isPlasma(board[row],col+2)) {rights++;urs++;drs++;}
      if (isPlasma(board[row+1],col+2)) {rights++;drs++;}
      if (isPlasma(board[row-1],col+2)) {rights++;urs++;}
      /*
       + 
      + +
       + 
      */
      if (isPlasma(board[row-1],col)) {lefts++;current++;rights++;uls++;urs++;}
      if (isPlasma(board[row],col+1)) {ups++;current++;downs++;urs++;drs++;}
      if (isPlasma(board[row+1],col)) {rights++;current++;lefts++;dls++;drs++;}
      if (isPlasma(board[row],col-1)) {ups++;current++;downs++;dls++;uls++}
      /*
      + +

      + +
      */
      if (isPlasma(board[row-1],col-1)) {lefts++;current++;ups++;}
      if (isPlasma(board[row-1],col+1)) {rights++;current++;ups++;}
      if (isPlasma(board[row+1],col+1)) {rights++;current++;downs++;}
      if (isPlasma(board[row+1],col-1)) {lefts++;current++;downs++;}
      /*
      +   +



      +   +
      */
      if (isPlasma(board[row-2],col-2)) {uls++;}
      if (isPlasma(board[row-2],col+2)) {urs++;}
      if (isPlasma(board[row+2],col+2)) {drs++;}
      if (isPlasma(board[row+2],col-2)) {dls++;}
      const the_biggest = Math.max(canDR?drs:0,canDL?dls:0,canUR?urs:0,canUL?uls:0,canUp?ups:0,canDown?downs:0,canRight?rights:0,canLeft?lefts:0,current);
      if (the_biggest == current) {return false;}
      //Diagonal movement
      if (the_biggest == urs) {board[row-1][col+1] = swap(board[row][col], board[row][col]=board[row-1][col+1]);return true;}
      if (the_biggest == uls) {board[row-1][col-1] = swap(board[row][col], board[row][col]=board[row-1][col-1]);return true;}
      if (the_biggest == drs) {board[row+1][col+1] = swap(board[row][col], board[row][col]=board[row+1][col+1]);return true;}
      if (the_biggest == dls) {board[row+1][col-1] = swap(board[row][col], board[row][col]=board[row+1][col-1]);return true;}
      //Orthagonal movement
      if (the_biggest == ups) {board[row-1][col] = swap(board[row][col], board[row][col]=board[row-1][col]);return true;}
      if (the_biggest == downs) {board[row+1][col] = swap(board[row][col], board[row][col]=board[row+1][col]);return true;}
      if (the_biggest == lefts) {board[row][col-1] = swap(board[row][col], board[row][col]=board[row][col-1]);return true;}
      if (the_biggest == rights) {board[row][col+1] = swap(board[row][col], board[row][col]=board[row][col+1]);return true;}
      
    }
    return false
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
    
    this.board = Array.from({ length: HEIGHT },() => Array.from({ length: WIDTH }, a=>(new Particle())));
    this.turn = 0;
  }
  update() {
    let t = [];
    for (var i = 0;i!==this.width;i++) {t.push(i)}
    this.turn = 1-this.turn;
    BURNED_OIL_YET_THIS_FRAME = false;
    for (let row = this.height-1;row>=0;row--) {
      shuffle(t);
      for (let i = this.width-1;i!==0;i--) {
        const col = t[i];
        if (this.board[row][col].turn == this.turn) {
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
      }
    } else {BURNED_OIL_FRAMES_CONSECUTIVE = 0;}
  }
}