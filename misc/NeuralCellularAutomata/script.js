const defaultSave = {"Worms":[[0.68,-0.9,0.68,-0.9,-0.66,-0.9,0.68,-0.9,0.68],"worm"],"Mitosis":[[-0.939,0.88,-0.939,0.88,0.4,0.88,-0.939,0.88,-0.939],"mitosis"],"Waves":[[0.565,-0.716,0.565,-0.716,0.627,-0.716,0.565,-0.716,0.565],"waves"]};

const canvas = document.getElementById("my-canvas")
let w = 800;
let h = 800;
canvas.height = w;
canvas.width = h;
const ctx = canvas.getContext("2d");
const overallLength = h*w;
let activationF = "waves";
let symmetry = true;
let matrix = [0.565,-0.716,0.565,-0.716,0.627,-0.716,0.565,-0.716,0.565];//makeRandomMatrix();
let board = new Float32Array(overallLength);
for (let i = 0;i<overallLength;i++) {board[i] = Math.random();}

function makeRandomMatrix() {
  let rows = [];
  for (let i = 0;i<9;i++) {
    rows.push(Math.random()*2-1);
  }
  if (symmetry) {rows[2] = rows[0];rows[6] = rows[0];rows[8] = rows[0];rows[3] = rows[1];rows[5] = rows[1];rows[7] = rows[1];}
  while (Math.abs(rows[0]+rows[1]+rows[4])>1) {
    rows = [];
    for (let i = 0;i<9;i++) {
      rows.push(Math.random()*2-1);
    }
    if (symmetry) {rows[2] = rows[0];rows[6] = rows[0];rows[8] = rows[0];rows[3] = rows[1];rows[5] = rows[1];rows[7] = rows[1];}
  }
  return rows;
}

function worm(x) {return -1/Math.pow(2, (0.6*Math.pow(x, 2)))+1;}
function mitosis(x) {return -1/(0.9*Math.pow(x, 2)+1)+1;}
function waves(x) {return Math.abs(1.2*x);}
function identity(x) {return x;}
let activation = waves;//function(val) {return Math.abs(1.2*val);}
function normalize2(val) {return (val<-1)?-1:((val>1)?1:val)}
function normalizeCoord(val) {return (val<0)?val+overallLength:((val>=overallLength)?val-overallLength:val)}
const newBoard = new Float32Array(overallLength);
function updateBoard() {
  for (let i = 0;i<overallLength;i++) {
    newBoard[i] = normalize2(activation(board[normalizeCoord(i-(w)-1)]*matrix[0]+board[normalizeCoord(i-(w))]*matrix[1]+board[normalizeCoord(i-(w)+1)]*matrix[2]+board[normalizeCoord(i-1)]*matrix[3]+board[i]*matrix[4]+board[normalizeCoord(i+1)]*matrix[5]+board[normalizeCoord(i+(w)-1)]*matrix[6]+board[normalizeCoord(i+(w))]*matrix[7]+board[normalizeCoord(i+(w)+1)]*matrix[8]));
  }
  board = newBoard;
}
// function updateBoard() {
//   // const newBoard = new Float32Array(w * h);

//   const width = w;
//   const height = h;
//   const boardLength = board.length;
//   const normalizedCoord = normalizeCoord;

//   const matrix0 = matrix[0];
//   const matrix1 = matrix[1];
//   const matrix2 = matrix[2];
//   const matrix3 = matrix[3];
//   const matrix4 = matrix[4];
//   const matrix5 = matrix[5];
//   const matrix6 = matrix[6];
//   const matrix7 = matrix[7];
//   const matrix8 = matrix[8];

//   const activationFn = activation;
//   const normalize2Fn = normalize2;

//   for (let i = 0; i < boardLength; i++) {
//     const x = i % width;
//     const y = (i / width) | 0;

//     const topLeft = normalizedCoord(i - width - 1);
//     const top = normalizedCoord(i - width);
//     const topRight = normalizedCoord(i - width + 1);
//     const left = normalizedCoord(i - 1);
//     const center = normalizedCoord(i);
//     const right = normalizedCoord(i + 1);
//     const bottomLeft = normalizedCoord(i + width - 1);
//     const bottom = normalizedCoord(i + width);
//     const bottomRight = normalizedCoord(i + width + 1);

//     const newValue =
//       activationFn(board[topLeft] * matrix0 + board[top] * matrix1 + board[topRight] * matrix2 + board[left] * matrix3 + board[center] * matrix4 + board[right] * matrix5 + board[bottomLeft] * matrix6 + board[bottom] * matrix7 + board[bottomRight] * matrix8);

//     newBoard[i] = normalize2Fn(newValue);
//   }
//   board = newBoard;
// }




function loop() {
  //update
  updateBoard();updateBoard();
  var imgData = ctx.createImageData(w, h); // width x height
  var data = imgData.data;
  
  // copy img byte-per-byte into our ImageData
  for (var i = 0, len = overallLength*4; i < len; i+=4) {
      data[i] = board[i/4]*255;data[i+1] = 0;data[i+2] = 0;data[i+3] = 255;
  }
  
  // now we can draw our imagedata onto the canvas
  ctx.putImageData(imgData, 0, 0);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
function setCookie(name,value) {
    var expires = "";
    if (true) {
        var date = new Date();
        date.setTime(date.getTime() + (100000*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function save() {
  let name = prompt("What should it be named?");
  let saved = JSON.parse(getCookie("saved"));
  if (saved === null) {saved = defaultSave;}
  console.log(saved);
  saved[name] = matrix;
  setCookie("saved",JSON.stringify(saved));
}
function load() {
  let saved = JSON.parse(getCookie("saved"));
  if (saved === null) {saved = defaultSave;}
  let name = "";
  while (!(name in saved)) {name=prompt("What to load? You currently have "+Object.keys(saved).join(", ")+".");if(name=="none"||name==""){return}}
  matrix = saved[name][0];
  let tt = saved[name][1];
  if (tt == "identity") activation = (val)=>(val);
  else if (tt == "mitosis") activation = function(val) {return -1/(0.9*Math.pow(val, 2)+1)+1;}
  else if (tt == "worm") activation = worm;
  else if (tt=="waves") activation = waves;
  for (let i = 0;i<overallLength;i++) {board[i] = Math.random();}
}
function delet() {}