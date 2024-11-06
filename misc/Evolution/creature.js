const geneLength = 16;
const fromLength = 5;
const toLength = 4;
const strengthLength = 7;
const fromStart = geneLength-fromLength;
const toStart = fromStart-toLength;
const geneNormalizer = Math.round((1<<strengthLength) / 6);

const maxGene = 1<<geneLength;
function bin(dec) {
  return (dec >>> 0).toString(2).padStart(geneLength,"0");
}
function randomGenes(n) {
  const final = [];
  for (let i = 0;i<n;i++) {
    final.push(Math.floor(Math.random()*2**geneLength));
  }
  return final;
}
function printGenes(genes) {
  for (gene of genes) {console.log(bin(gene));}
}
let firstCreature = true;
class Creature {
  constructor(genes,x,y) {
    this.genes = (typeof genes !== "number")?genes:randomGenes(genes);
    if (firstCreature) {this.genes = this.genes;firstCreature = false;}
    this.geneN = this.genes.length;
    this.x = x;
    this.y = y;
    this.froms = [];
    this.tos = [];
    this.strengths = [];
    this.hue = Math.floor(Math.random()*360);
    for (const gene of this.genes) {
      const from = gene>>>fromStart;
      const to = (gene-(from<<fromStart))>>>toStart;
      const strength = (gene-(from<<fromStart)-(to<<toStart))/geneNormalizer-3;
      if (from < INTERNAL_NEURONS) {
        this.froms.push(from);
        this.tos.push(to);
        this.strengths.push(strength);
      } else {
        this.froms.unshift(from);
        this.tos.unshift(to);
        this.strengths.unshift(strength);
      }
    }
  }
  reproduce() {
    const mutate = (Math.random()<MUTATION_CHANCE);
    const final = mutate?this.mutate():(new Creature(structuredClone(this.genes)));
    !mutate && (final.hue = this.hue);
    return final;
  }
  mutate() {
    const geneToMutate = Math.floor(Math.random()*this.geneN);
    const genes = structuredClone(this.genes);
    const r = Math.floor(Math.random()*4); // CHANGE THE 2 TO 4 TO ALLOW INSERTION AND DELETION
    if (r<2) {
      genes[geneToMutate] ^= 1<<(Math.floor(Math.random()*geneLength));
    } else if (r === 3) {
      genes[geneToMutate] >>>= 1;
    } else {
      genes[geneToMutate] <<= 1;
      if (genes[geneToMutate] >= maxGene) {
        genes[geneToMutate] -= maxGene;
      }
    }
    const final = new Creature(genes,this.x,this.y);
    final.hue = this.hue + 5*(Math.floor(Math.random()*2)*2-1);
    return final;
  }
  move(board,dy,dx,secondTry=false) {
    const w = board[this.y + dy];
    if (w && w[this.x + dx] === -1) {
      const p = board[this.y][this.x];
      board[this.y][this.x] = -1;
      this.y += dy;
      this.x += dx;
      board[this.y][this.x] = p;
    } else if (!secondTry) {
      this.move(board,-dy,-dx,true);
    }
  }
  act(board) {
    const outputs = Array(16).fill(0);
    /*
      INPUTS:
      11: Age
      10: Oscillates
      0F: Always on
      0E: -1 if up is blocked, 1 if not
      0D: -1 if right is blocked, 1 if not
      0C: -1 if down is blocked, 1 if not
      0B: -1 if left is blocked, 1 if not
      0A: Y position between -1 and 1
      09: X position between -1 and 1
      08: -1 if up right is blocked, 1 if not
      07: -1 if down right is blocked, 1 if not
      06: -1 if down left is blocked, 1 if not
      05: -1 if up left is blocked, 1 if not
    */
    for (let i = 0;i<this.geneN;i++) {
      let val = 0;
      let f = this.froms[i];
      if (f < INTERNAL_NEURONS) {
        val = Math.tanh(outputs[f]);
      } else if (f === 17) {
        val = TURN_COUNTER/TURNS;
      } else if (f === 16) {
        val = Math.sin(TURN_COUNTER/10) / 2 + 0.5;
      } else if (f === 15) {
        val = 1;
      } else if (f === 14) {
        val = Number((board[this.y-1] && board[this.y-1][this.x] === -1)) * 2 - 1;
      } else if (f === 13) {
        val = Number((board[this.y][this.x+1] === -1)) * 2 - 1;
      } else if (f === 12) {
        val = Number((board[this.y+1] && board[this.y+1][this.x] === -1)) * 2 - 1;
      } else if (f === 11) {
        val = Number((board[this.y][this.x-1] === -1)) * 2 - 1;
      } else if (f === 10) {
        val = this.y/HEIGHT * 2 - 1;
      } else if (f === 9) {
        val = this.x/WIDTH * 2 - 1;
      } else if (f === 8) {
        val = Number((board[this.y-1] && board[this.y-1][this.x+1] === -1)) * 2 - 1;
      } else if (f === 7) {
        val = Number((board[this.y+1] && board[this.y+1][this.x+1] === -1)) * 2 - 1;
      } else if (f === 6) {
        val = Number((board[this.y+1] && board[this.y+1][this.x-1] === -1)) * 2 - 1;
      } else if (f === 5) {
        val = Number((board[this.y-1] && board[this.y-1][this.x-1] === -1)) * 2 - 1;
      }
      outputs[this.tos[i]] += this.strengths[i]*val;
    }
    /*
      OUTPUTS:
      F: Nothing
      E: Move random
      D: Move up
      C: Move right
      B: Move down
      A: Move left
      9: Move up right
      8: Move down right
      7: Move down left
      6: Move up left
    */
    const final = outputs.slice(INTERNAL_NEURONS,).toReversed();
    const m = Math.max(...final);
    if (m <= 0) {return;}
    if (m === final[0]) {}
    else if (m === final[1]) {
      const q = Math.floor(Math.random()*4);
      if (q === 0) {this.move(board,-1,0);}
      else if (q === 1) {this.move(board,0,1);}
      else if (q === 2) {this.move(board,1,0);}
      else {this.move(board,0,-1);}
    }
    else if (m === final[2]) {this.move(board,-1,0);}
    else if (m === final[3]) {this.move(board,0,1);}
    else if (m === final[4]) {this.move(board,1,0);}
    else if (m === final[5]) {this.move(board,0,-1);}
    else if (m === final[6]) {this.move(board,-1,1);}
    else if (m === final[7]) {this.move(board,1,1);}
    else if (m === final[8]) {this.move(board,1,-1);}
    else if (m === final[9]) {this.move(board,-1,-1);}
  }
}
// creatures = creatures.map(o=>{return new Creature(perfectGenesDiagonal,o.x,o.y)})
// creatures = creatures.map(o=>{return new Creature(testGenes,o.x,o.y)})