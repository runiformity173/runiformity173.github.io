let HEIGHT = 16;let WIDTH = 16;
function load2() {}
function gcd(a, b) {return !b?a:gcd(b,a%b);}
function lcm2(a, b) {return(a*b)/gcd(a,b);}
function lcm(a,b,c,d) {let t = Math.min(a,b,c,d);[a,b,c,d].forEach(function(n) {t = lcm2(t, n);});return t;}
function isUnfinished(board) {for (const row of board) {for (const cell of row) {if (isObject(cell))return true}}return false}
function getLeastEntropy(board) {
  let kPos = [0,0]
  let kEntropy = Infinity;
  for (let row = 0;row<HEIGHT;row++) {
    for (let col = 0;col<WIDTH;col++) {
      const cell = board[row][col];
      if (isObject(cell)) {
        const w = entropy(cell);
        if (w<kEntropy) {kEntropy = w;kPos = [row,col];}
      }
  }}
  return kPos;
}
function calculate(board,change) {
  for (let p = 0;p<4;p++) {
    const newChange = [change[0]+[-1,0,0,1][p],change[1]+[0,-1,1,0][p]];
    const w = board[change[0]][change[1]];
    for (const i in w) {w[i] = 0;}
    if (newChange[0] < HEIGHT && newChange[0] > -1 && newChange[1] < WIDTH && newChange[1] > -1) {
      const cell = board[change[0]][change[1]];
      const cell2 = board[newChange[0]][newChange[1]];
      let t = {};
      if (!isObject(cell2)) {
        t = table[cell2][[2,3,0,1][p]];
        if (!(cell2 in w)) {
          w[cell2] = 0;
        }
      }
      for (const k in t) {
        w[k] += t[k];
      }
    }
  }
}
function propagate(board,changePos) {
  const changes = [changePos];
  while (changes.length > 0) {
    const change = changes.pop();
    for (let p = 0;p<4;p++) {
      const newChange = [change[0]+[-1,0,0,1][p],change[1]+[0,-1,1,0][p]];
      if (newChange[0] < HEIGHT && newChange[0] > -1 && newChange[1] < WIDTH && newChange[1] > -1) {
        const cell = board[change[0]][change[1]];
        const cell2 = board[newChange[0]][newChange[1]];
        for (const i in cell2) {
          if (!(i in table[cell][[2,3,0,1][p]])) {delete cell2[i];}
          else {cell2[i] = table[cell][p][i];}
        }
      }
    }
//    changes.push_back(change);
  }
}
const choose=c=>(c[Math.floor(Math.random()*c.length)]);
function weightedChoose(e){console.log(e);const n=[];for(var r in e)for(let o=0;o<e[r];o++)n.push(r);return choose(n)}
function entropy(e){var t=Object.values(e).reduce((e,t)=>e+t,0);let r=0;for(const a of Object.values(e)){var n=a/t;r-=n*Math.log2(n)}return r}
function start() {
  const board = [];
  for (let i = 0;i<HEIGHT;i++) {
    board.push([]);
    for (let j = 0;j<WIDTH;j++) {
      board[i].push(structuredClone(uncollapsedCell));
    }
  }
  while (isUnfinished(board)) {
    let pos = getLeastEntropy(board);
    board[pos[0]][pos[1]] = weightedChoose(board[pos[0]][pos[1]]);
    propagate(board,pos);
    
  }
  display(board);
}