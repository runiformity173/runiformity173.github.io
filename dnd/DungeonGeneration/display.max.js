let MULT = 0;let DESCRIPTIONS = true;let NO_DEAD_ENDS = true;let PIXEL_BOARD = [];let ROOM_DATA = {};
Array.prototype.includes2=function(n){return this.some(e=>e.includes(n))};
function getMax(n){let l=-1/0;for(let t=0;t<n.length;t++)for(let e=0;e<n[t].length;e++)"number"==typeof n[t][e]&&n[t][e]>l&&(l=n[t][e]);return l}
Array.prototype.replace3=function(r,n){const o=this.map(t=>[...t]);for(let e=0;e<o.length;e++)for(let t=0;t<o[e].length;t++)o[e][t]===r&&(o[e][t]=n);return o};
function createPNG(a){const n=document.createElement("canvas");n.width=a[0].length,n.height=a.length;const t=n.getContext("2d"),g=t.createImageData(n.width,n.height);for(let e=0;e<a.length;e++)for(let t=0;t<a[e].length;t++){var r=hexToRgb(a[e][t]),h=4*(e*n.width+t);g.data[h]=r.r,g.data[1+h]=r.g,g.data[2+h]=r.b,g.data[3+h]=255}return t.putImageData(g,0,0),n.toDataURL("image/png")}
function hexToRgb(t){return{r:parseInt(t.substring(1,3),16),g:parseInt(t.substring(3,5),16),b:parseInt(t.substring(5,7),16)}}
function difference2(n,t){var e=n.length,f=n[0].length;for(let r=0;r<e;r++)for(let e=0;e<f;e++)if(n[r][e]!==t[r][e])return[r,e];return[-1,-1]}
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

function getMousePos(event) {
  const img = document.getElementById("output");
  const rect = img.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (img.naturalWidth / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (img.naturalHeight / rect.height));
  return [y, x];
}


function getTextColor(bcolor) {
  let bc = bcolor.slice(4,-1).split(", ");return ("rgb("+(255-Number(bc[0]))+", "+(255-Number(bc[1]))+", "+(255-Number(bc[2]))+")");
  // let bc = bcolor.slice(4,-1).split(", ");return ([Number(bc[0]),Number(bc[1]),Number(bc[2])].reduce((partialSum, a) => partialSum + a, 0)<300)?"rgb(255, 255, 255)":"rgb(0, 0, 0)"
}
function getDistinctColors(e){var o=360/e*3;const t=[];for(let s=0;s<Math.ceil(e/3);s++)t.push(hslToHex(s*o,1,.25)),t.push(hslToHex(s*o,1,.5)),t.push(hslToHex(s*o,1,.75));return t.slice(0,e+1)}
function hslToHex(t,a,r){var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],n=Math.round(255*(n+r)).toString(16).padStart(2,"0"),d=Math.round(255*(d+r)).toString(16).padStart(2,"0"),h=Math.round(255*(h+r)).toString(16).padStart(2,"0"),"#"+n+d+h}
function splitIntoSections(a) {
  let final = [[],[],[]];let details = false;let exits = false;
  if (!a) {return [[],[],[]]}
  for (const element of a) {
    if (element == "Details:") {details = true}
    else if (element == "Exits:") {exits = true}
    else {
      if (!exits && !details) {
        final[0].push(element);
      }
      else if (!exits && details) {
        final[1].push(element);
      }
      else if (exits) {
        final[2].push(element);
      }
    }
  }
  return final;
}
function display(board1) {
  let colors = [WALL];
  let b = JSON.parse(JSON.stringify(board1[0]));
  let roomData = JSON.parse(JSON.stringify(board1[2]));
  let someData = JSON.parse(JSON.stringify(board1[3]));
  let extraData = JSON.parse(JSON.stringify(board1[1]));
  if (NO_DEAD_ENDS) removeDeadEnds(b);
  let max = getMax(b);
  // for (let i = 1;i < max;i++) {colors.push(blendHex(FLOOR,WALL,(i/max/2)))}
  let c = getDistinctColors(Object.keys(roomData).length);
  for (let i = 1;i <= max;i++) {
    if (!(i in roomData) || !DESCRIPTIONS) {colors.push(FLOOR)}
    else {colors.push(c.pop())}
  }
  let board2 = b.map(function(a){return a.map(function(c){return (colors.length > (c)?colors[c]:"#ff0000")})})
  for (let dc in extraData) {
    let dir = extraData[dc].split(" ").slice(-2,-1)[0];
    let offset = [{"up":-1,"right":0,"down":1,"left":0}[dir],{"up":0,"right":1,"down":0,"left":-1}[dir]];
    if (someData[dc] in roomData && extraData[dc].includes(" true") && b[Number(dc.split(",")[0])+offset[0]][Number(dc.split(",")[1])+offset[1]] != 0) {
      let ccc = "";
      if (!extraData[dc].includes("passage") && !extraData[dc].includes("corridor")) {
      ccc = extraData[dc].splitFromEnd(" ",2)[0]+" ";
      if (extraData[dc].includes("up")) ccc += "to the north";
      else if (extraData[dc].includes("right")) ccc += "to the east";
      else if (extraData[dc].includes("down")) ccc += "to the south";
      else if (extraData[dc].includes("left")) ccc += "to the west";
      board2[dc.split(",")[0]][dc.split(",")[1]] = "#ffffff";
      }
      else {
        ccc = "Corridor ";
        if (extraData[dc].includes("up")) ccc += "to the north";
        else if (extraData[dc].includes("right")) ccc += "to the east";
        else if (extraData[dc].includes("down")) ccc += "to the south";
        else if (extraData[dc].includes("left")) ccc += "to the west";
        board2[dc.split(",")[0]][dc.split(",")[1]] = "#ffffff";
      }
      if (!roomData[someData[dc]].includes("Exits:")) {roomData[someData[dc]].push("Exits:");}
  roomData[someData[dc]].push(ccc);}
}
  for (let dc in roomData) {
    // const old = JSON.parse(JSON.stringify(roomData[dc]));
    roomData[dc] = roomData[dc].filter(function (a) {return !a.includes("true")&&!a.includes("false")})
    // if (roomData[dc][0] == "Details:") {console.log(old);}
  }
  document.getElementById("output").src = createPNG(board2);

document.getElementById("output").addEventListener("click", (event) => {
  const [y, x] = getMousePos(event);
  // console.log(PIXEL_BOARD[y][x],x,y,roomData[PIXEL_BOARD[y][x]])
  if (PIXEL_BOARD[y][x] in roomData) {document.getElementById("keyOutput").innerHTML = roomData[PIXEL_BOARD[y][x]].join(".<br>").replaceAll(":.",":")}
});
document.getElementById("output").addEventListener("mousemove", (event) => {
  const [y, x] = getMousePos(event);
  if (PIXEL_BOARD[y][x] in roomData) {document.getElementById("output").style.cursor = "pointer";}
  else {document.getElementById("output").style.cursor = "default";}
});
  
  document.getElementById("keyOutput").style.backgroundColor = "";
  document.getElementById("keyOutput").innerHTML = "";
  if (!DESCRIPTIONS) {document.getElementById("keyOutput").style.height = "0px";document.getElementById("keyOutput").innerHTML = "";document.getElementById("key").innerHTML = "";document.getElementById("output").onload = function(){return};return;}
  let key = "";
  let maxLength = Math.max(...(Object.values(roomData).map((a)=>(a.length))));
  // for (let i in roomData) {
  //   if (roomData[i].length > roomData[i].filter(function (a) {return a[0] === a[0].toUpperCase()}).length) {console.log(roomData[i],i)}
  //   let cccc = ((board2.replace3(colors[i],"#ffffff")));
  //   let dif = difference2(cccc,board2);
  //   roomData[i] = roomData[i].filter(function (a) {return a[0] === a[0].toUpperCase()});
  //   // console.log(dif,board2[dif[0]][dif[1]],cccc[dif[0]][dif[1]]);
  //   key += "<span onmouseover='document.getElementById(\"keyOutput\").style.backgroundColor = this.style.color;document.getElementById(\"keyOutput\").style.color = getTextColor(this.style.color);document.getElementById(\"keyOutput\").innerHTML = \""+roomData[i].join(".<br>").replaceAll("'","")+"."+"\";document.getElementById(\"output\").src=\""+createPNG(cccc)+"\"' class='keyColor' style='color:"+colors[i]+";'><p>█</p></span>";
  // }
  ROOM_DATA = JSON.parse(JSON.stringify(roomData));
  PIXEL_BOARD = JSON.parse(JSON.stringify(b));
  document.getElementById("keyOutput").style.height = (maxLength*24)+"px";
//   for (let row = 0; row < HEIGHT; row++) {
//     for (let col = 0; col < WIDTH; col++) {
//       // const cellElem = document.createElement('div');
//       // cellElem.style.backgroundColor = colors[b[row][col]];
//     container.innerHTML += ("<div style='background-color:"+colors[b[row][col]]+";'></div>");
//   }
// }
  // document.getElementById("container-container").appendChild(container);
}