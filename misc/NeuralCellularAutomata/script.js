const defaultSave = {"Worms":[[0.68,-0.9,0.68,-0.9,-0.66,-0.9,0.68,-0.9,0.68],"worm"],"Mitosis":[[-0.939,0.88,-0.939,0.88,0.4,0.88,-0.939,0.88,-0.939],"mitosis"],"Waves":[[0.565,-0.716,0.565,-0.716,0.627,-0.716,0.565,-0.716,0.565],"waves"]};

const canvas = document.getElementById("my-canvas");
let w = canvas.clientHeight;
let h = w;
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
function randomRules() {
  matrix = makeRandomMatrix();
  activationF = Object.keys(functions)[Math.floor(Math.random()*Object.keys(functions).length)]
  activation = functions[activationF];
  for (let i = 0;i<overallLength;i++) {board[i] = Math.random();}
}
const functions = {
  worm: (x)=>(-1/Math.pow(2, (0.6*Math.pow(x, 2)))+1),
  mitosis: (x)=>(-1/(0.9*Math.pow(x, 2)+1)+1),
  waves: (x)=>(Math.abs(1.2*x)),
  identity: (x)=>(x),
}
let activation = functions[activationF];//function(val) {return Math.abs(1.2*val);}
function normalize2(val) {return (val<-1)?-1:((val>1)?1:val)}
// this is incorrect. Wraps around to the next row instead of over to the left.
function normalizeY(val) {return (val+h)%h;}
function normalizeX(val) {return (val+w)%w;}
let newBoard = new Float32Array(overallLength);
function updateBoard() {
  for (let i = 0;i<h;i++) {
    for (let j = 0;j < w;j++) {
      newBoard[i*w+j] = normalize2(activation(board[normalizeY(i-1)*w+normalizeX(j-1)]*matrix[0]+board[normalizeY(i-1)*w+normalizeX(j)]*matrix[1]+board[normalizeY(i-1)*w+normalizeX(j+1)]*matrix[2]+board[normalizeY(i)*w+normalizeX(j-1)]*matrix[3]+board[normalizeY(i)*w+normalizeX(j)]*matrix[4]+board[normalizeY(i)*w+normalizeX(j+1)]*matrix[5]+board[normalizeY(i+1)*w+normalizeX(j-1)]*matrix[6]+board[normalizeY(i+1)*w+normalizeX(j)]*matrix[7]+board[normalizeY(i+1)*w+normalizeX(j+1)]*matrix[8]));
    }
  }
  board = newBoard;
  newBoard = new Float32Array(overallLength);
}



function loop() {
  updateBoard();updateBoard();
  var imgData = ctx.createImageData(w, h);
  var data = imgData.data;
  for (var i = 0, len = overallLength*4; i < len; i+=4) {
      data[i] = board[i/4]*255;data[i+1] = 0;data[i+2] = 0;data[i+3] = 255;
  }
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
  saved[name] = [matrix, activationF];
  setCookie("saved",JSON.stringify(saved));
}
function load() {
  let saved = JSON.parse(getCookie("saved"));
  if (saved === null) {saved = defaultSave;}
  let name = "";
  while (!(name in saved)) {name=prompt("What to load? You currently have "+Object.keys(saved).join(", ")+".");if(name=="none"||name==""){return}}
  matrix = saved[name][0];
  let tt = saved[name][1];
  activation = functions[tt];
  activationF = tt;
  for (let i = 0;i<overallLength;i++) {board[i] = Math.random();}
}
function delet() {}