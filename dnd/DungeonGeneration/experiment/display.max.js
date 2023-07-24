let NO_DEAD_ENDS = false;
function createPNG(a){const n=document.createElement("canvas");n.width=a[0].length,n.height=a.length;const t=n.getContext("2d"),g=t.createImageData(n.width,n.height);for(let e=0;e<a.length;e++)for(let t=0;t<a[e].length;t++){var r=hexToRgb(a[e][t]),h=4*(e*n.width+t);g.data[h]=r.r,g.data[1+h]=r.g,g.data[2+h]=r.b,g.data[3+h]=255}return t.putImageData(g,0,0),n.toDataURL("image/png")}
function hexToRgb(t){return{r:parseInt(t.substring(1,3),16),g:parseInt(t.substring(3,5),16),b:parseInt(t.substring(5,7),16)}}

function removeDeadEnds(board) {
  let changed = true;
  while (changed) {
    changed = false;
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] !== 0) {
          const numZeros = countAdjacentZeros(board, r, c);
          if (numZeros >= 3) {
            board[r][c] = 0;
            changed = true;
          }
        }
      }
    }
  }
  return board;
}


function countAdjacentZeros(board, row, col) {
  let numZeros = 0;
  if (row > 0 && board[row-1][col] === 0) numZeros++;
  if (col > 0 && board[row][col-1] === 0) numZeros++;
  if (row < board.length-1 && board[row+1][col] === 0) numZeros++;
  if (col < board[row].length-1 && board[row][col+1] === 0) numZeros++;
  if (row === 0) numZeros++;
  if (row === board.length-1) numZeros++;
  if (col === 0) numZeros++;
  if (col === board[row].length-1) numZeros++;
  return numZeros;
}



function blendHex(hex2, hex1, weight) {
  const r1 = parseInt(hex1.substring(1, 3), 16);
  const g1 = parseInt(hex1.substring(3, 5), 16);
  const b1 = parseInt(hex1.substring(5, 7), 16);
  const r2 = parseInt(hex2.substring(1, 3), 16);
  const g2 = parseInt(hex2.substring(3, 5), 16);
  const b2 = parseInt(hex2.substring(5, 7), 16);
  let r = Math.round((r1 * weight + r2 * (1 - weight)));
  let g = Math.round((g1 * weight + g2 * (1 - weight)));
  let b = Math.round((b1 * weight + b2 * (1 - weight)));
  r = r>255 ? 255 : r;
  g = g>255 ? 255 : g;
  b = b>255 ? 255 : b;
  const blendedHex = "#" +r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
  return blendedHex;
}

function getDistinctColors(e){var o=360/e*3;const t=[];for(let s=0;s<Math.ceil(e/3);s++)t.push(hslToHex(s*o,1,.25)),t.push(hslToHex(s*o,1,.5)),t.push(hslToHex(s*o,1,.75));return t.slice(0,e+1)}
function hslToHex(t,a,r){var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],n=Math.round(255*(n+r)).toString(16).padStart(2,"0"),d=Math.round(255*(d+r)).toString(16).padStart(2,"0"),h=Math.round(255*(h+r)).toString(16).padStart(2,"0"),"#"+n+d+h}

function display(board1) {
  let b = JSON.parse(JSON.stringify(board1));
  if (NO_DEAD_ENDS) removeDeadEnds(b);
  let board2 = b.map(function(a){return a.map(function(c){return (c in COLORS?COLORS[c]:"#ff0000")})})
  
  document.getElementById("output").src = createPNG(board2);
  document.getElementById("output").style.cursor = "default";

  document.getElementById("keyOutput").style.backgroundColor = "";
  document.getElementById("keyOutput").innerHTML = "";
  // for (let i in roomData) {
  //   if (roomData[i].length > roomData[i].filter(function (a) {return a[0] === a[0].toUpperCase()}).length) {console.log(roomData[i],i)}
  //   let cccc = ((board2.replace3(colors[i],"#ffffff")));
  //   let dif = difference2(cccc,board2);
  //   roomData[i] = roomData[i].filter(function (a) {return a[0] === a[0].toUpperCase()});
  //   // console.log(dif,board2[dif[0]][dif[1]],cccc[dif[0]][dif[1]]);
  //   key += "<span onmouseover='document.getElementById(\"keyOutput\").style.backgroundColor = this.style.color;document.getElementById(\"keyOutput\").style.color = getTextColor(this.style.color);document.getElementById(\"keyOutput\").innerHTML = \""+roomData[i].join(".<br>").replaceAll("'","")+"."+"\";document.getElementById(\"output\").src=\""+createPNG(cccc)+"\"' class='keyColor' style='color:"+colors[i]+";'><p>█</p></span>";
  // }
//   for (let row = 0; row < HEIGHT; row++) {
//     for (let col = 0; col < WIDTH; col++) {
//       // const cellElem = document.createElement('div');
//       // cellElem.style.backgroundColor = colors[b[row][col]];
//     container.innerHTML += ("<div style='background-color:"+colors[b[row][col]]+";'></div>");
//   }
// }
  // document.getElementById("container-container").appendChild(container);
}