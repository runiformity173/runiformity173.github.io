//TODO: 
//  Make shell sort work visually
//  Bar view *
let SIZE = 128;
let HEIGHT = 128;
let VIEW = {'Colors':'color','Bars':'bar', 'Colored Bars':'both'}[document.getElementById("displayMode").value];
let colorMap = ['#ff0000', '#ffffff', '#0000ff'];
let swaps = [];
Array.prototype.swap = function(i,j) {
  swaps.unshift([i,j,Math.min(this[i],this[j])]);
  const temp = this[i];
  this[i] = this[j];
  this[j] = temp;
}
Array.prototype.shiftDown = function(i,j) {
  swaps.unshift([i,j,this[j],j+i]);
  const temp = this[j];
  for (let k = j;k>i;k--) {
    this[k] = this[k-1];
  }
  this[i] = temp;
}
Array.prototype.equals = function(other) {
  if (this.length !== other.length) {return false;}
  for (let i = 0;i<this.length;i++) {
    if (this[i] !== other[i]) {return false;}
  }
  return true;
}
function isSorted(arr) {
  for (let i=1;i<arr.length;i++) {if(arr[i]<arr[i-1])return false}
  return true;
}
function shuffle(a) {let c=a.length;while (c!=0) {let r=Math.floor(Math.random()*c);c--;[a[r],a[c]]=[a[c],a[r]];}}
const canvas = document.getElementById("output");
canvas.width = SIZE;
canvas.height = SIZE;
const ctx = canvas.getContext("2d");
function testSorts(arr) {
  const correct = structuredClone(arr);
  correct.sort((a,b)=>a-b);
  for (const i in sortingAlgorithms) {
    const temp = structuredClone(arr);
    sortingAlgorithms[i](temp);
    swaps = [];
    if (temp.equals(correct)) {
      console.log(i,"works")
    } else {
      console.log(i,"doesn't work")
      console.log(correct);
      console.log(temp);
    }
  }
}
const {abs,min,max,round}=Math;
function hslToRgb(a,c,d){let e,f,h;if(0===c)e=f=h=d;else{const b=.5>d?d*(1+c):d+c-d*c,g=2*d-b;e=hueToRgb(g,b,a+1/3),f=hueToRgb(g,b,a),h=hueToRgb(g,b,a-1/3)}return[round(255*e),round(255*f),round(255*h)];return"#"+[round(255*e),round(255*f),round(255*h)].map(a=>a.toString(16).padStart(2,"0")).join("")}function hueToRgb(a,b,c){return 0>c&&(c+=1),1<c&&(c-=1),c<1/6?a+6*(b-a)*c:c<1/2?b:c<2/3?a+6*((b-a)*(2/3-c)):a}
function changeSize(size) {
  SIZE = size;
  arr = Array.from({length:SIZE}).map((i,j)=>j);
  copy = arr.map((i)=>i+1);

  HEIGHT = size;
  clearInterval(swapInterval);
  swapInterval = -1;
  swaps = [];
  canvas.width = size;
  canvas.height = size;
  document.getElementById("size").innerHTML = size;

}
function evaluateColors() {
  colorMap = [];
  Array.from(document.getElementsByClassName("allTheColorInputs")).forEach(function(a){
    colorMap.push(a.value);
  });
  if (copy.length > 0) {COLORS = copy.map(o=>interpolateColor((o-1)/SIZE));display();}
}
let arr = Array.from({length:SIZE}).map((i,j)=>j);
let COLORS = [];
let swapInterval = -1;
let copy = [];

function interpolateColor(point) {
    point = Math.max(0, Math.min(1, point));
    const index = Math.floor(point * (colorMap.length - 1));
    const fraction = point * (colorMap.length - 1) - index;
    const leftColor = hexToRgb(colorMap[index]);
    const rightColor = hexToRgb(colorMap[index + 1]);
  const interpolatedColor = [
        Math.round(leftColor[0] + fraction * (rightColor[0] - leftColor[0])),
        Math.round(leftColor[1] + fraction * (rightColor[1] - leftColor[1])),
        Math.round(leftColor[2] + fraction * (rightColor[2] - leftColor[2]))
    ];
  return interpolatedColor;
    // return rgbToHex(interpolatedColor);
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function rgbToHex(rgb) {
    return '#' + rgb.map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}





function changeView(view) {
  VIEW=view;
  if (view == 'color' || view == 'both') {
    // canvas.classList.remove("unpixelated");
    if (document.getElementById('vertical').checked) canvas.classList.add("vertical");
    document.getElementById('colorStuff').style.display = "block";
  } else if (view == 'bar' || view == 'both') {
    // canvas.classList.add("unpixelated");
    
    if (view == 'bar') {document.getElementById('colorStuff').style.display = "none";canvas.classList.remove("vertical");}

  }
  if (copy.length) display();
}
let opTime = 0;
function start() {
  const sortMethod = document.getElementById("sortMethod").value;
  if (SIZE > 256 && badMethods.includes(sortMethod)) {alert("Choose a smaller size (256 or below) for sorts this inefficient");return;}
  if (swapInterval !== -1) {clearInterval(swapInterval);swaps=[];}
  shuffle(arr);
  // COLORS = arr.map((i)=>hslToRgb((i/SIZE+2)/3,1,0.5));
  COLORS = arr.map((i)=>interpolateColor((i)/SIZE));
  copy = arr.map(o=>o+1);
  if (noteInterval !== -1) {clearInterval(noteInterval);noteInterval=-1;oscillator.stop()}
  display();
  sortingAlgorithms[sortMethod](arr);
  console.log(swaps.length)
  opTime = Math.min(Math.ceil(10000/swaps.length),333);
  setTimeout(function(){playSort();},opTime-1);
  swapInterval = setInterval(function(){
    if (swaps.length==0) {
      clearInterval(swapInterval);playFinal();
      if (VIEW == 'bar') playFinalAnimation();
      swapInterval=-1;return;
    }
    const s = swaps.pop();
    if (s.length == 3) {
      const [i,j,_] = s;
      [COLORS[i],COLORS[j]] = [COLORS[j],COLORS[i]];
      [copy[i],copy[j]] = [copy[j],copy[i]];
      const c = COLORS[i];
      const d = COLORS[j];
      if (VIEW == 'color') {
        ctx.fillStyle = "rgb("+c.map(String).join(",")+")";
        ctx.fillRect(i,0,1,HEIGHT);
        ctx.fillStyle = "rgb("+d.map(String).join(",")+")";
        ctx.fillRect(j,0,1,HEIGHT);
      } else if (VIEW == 'bar' || VIEW == 'both') {
        ctx.clearRect(i,0,1,HEIGHT-copy[i]);
        ctx.fillStyle = (VIEW=='bar'?"white":"rgb("+c.map(String).join(",")+")");
        ctx.fillRect(i,HEIGHT-copy[i],1,copy[i]);
        ctx.clearRect(j,0,1,HEIGHT-copy[j]);
        ctx.fillStyle = (VIEW=='bar'?"white":"rgb("+d.map(String).join(",")+")");
        ctx.fillRect(j,HEIGHT-copy[j],1,copy[j]);
      }
    } else if (s.length == 4) {
      const [i,j,_,_2] = s;
      const temp = COLORS[j];
      const temp2 = copy[j];
      for (let k = j;k>i;k--) {
        COLORS[k] = COLORS[k-1];
        copy[k] = copy[k-1];
        if (VIEW == 'color') {
          ctx.fillStyle = "rgb("+COLORS[k].map(String).join(",")+")";
          ctx.fillRect(k,0,1,HEIGHT);
        } else if (VIEW == 'bar' || VIEW == 'both') {
          ctx.clearRect(k,0,1,HEIGHT-copy[k]);
          ctx.fillStyle = (VIEW=='bar'?"white":"rgb("+COLORS[k].map(String).join(",")+")");
          ctx.fillRect(k,HEIGHT-copy[k],1,copy[k]);
        }
      }
      COLORS[i] = temp;
      copy[i] = temp2;
      if (VIEW == 'color') {
        ctx.fillStyle = "rgb("+temp.map(String).join(",")+")";
        ctx.fillRect(i,0,1,HEIGHT);
      } else if (VIEW == 'bar' || VIEW == 'both') {
        ctx.clearRect(i,0,1,HEIGHT-temp2);
        ctx.fillStyle = (VIEW == 'bar'?"white":"rgb("+temp.map(String).join(",")+")");
        ctx.fillRect(i,HEIGHT-temp2,1,temp2);
      }
    }
  },opTime);
}
function display() {
  ctx.clearRect(0,0,SIZE,HEIGHT);
  for (let i = 0;i<SIZE;i++) {
    if (VIEW == "color") {
      ctx.fillStyle = "rgb("+COLORS[i].map(String).join(",")+")";
      ctx.fillRect(i,0,1,HEIGHT);
    } else {
      ctx.clearRect(i,0,1,HEIGHT-copy[i]);
      ctx.fillStyle = (VIEW=='bar'?"white":"rgb("+COLORS[i].map(String).join(",")+")");
      ctx.fillRect(i,HEIGHT-copy[i],1,copy[i]);
    }
  }
}
function playSweep(i) {
  ctx.fillStyle = "lime";
  ctx.fillRect(i,HEIGHT-copy[i],1,copy[i]);
  setTimeout(function(){
    ctx.fillStyle = "white";
    ctx.fillRect(i,HEIGHT-copy[i],1,copy[i]);
  },4/7*SIZE*Math.ceil(700/SIZE));
  setTimeout(function(){
    if (i == SIZE) {return;}
    playSweep(i+1);
  },Math.ceil(700/SIZE));
}
function playFinalAnimation() {
  playSweep(0);
}
const options = [...document.getElementById("sortMethod").children].map(o=>o.value);
document.getElementById("sortMethod").value = options[Math.floor(Math.random()*options.length)];