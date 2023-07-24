let test_points = [{x:300,y:300}, {x:100,y:100}, {x:200,y:500}, {x:250,y:450}, {x:600,y:150}];
let POINTS;
let POINT_N = 7;
let WIDTH = 800;
let HEIGHT = 600;
let CELLS = [];
let AUTO_RELAX = true;
let NEW_POINTS = [];
let AUTOMATIC = true;
let COUNTER = 0;
Array.prototype.includes2=function(n){for(var i of this){let r=0;for(l in n)l in i&&i[l]==n[l]&&r++;if(2==r)return!0}return!1};
function voronoi(sites) {
  var bbox = {xl:0, xr:800, yt:0, yb:600};
  var voronoi = new Voronoi();
  try {return (voronoi.compute(sites, bbox));}
  catch {location.reload();}
}
function getArea(r){var t=r.length;let n=0;for(let e=0;e<t;e++){var a=r[e],l=r[(e+1)%t];n+=a[0]*l[1]-l[0]*a[1]}return n/2}
function findCentroid(vertices) {
	const num_vertices = vertices.length;
	let sum_x = 0;
	let sum_y = 0;
	let sum_cp = 0;
	for (let i = 0; i < num_vertices;i++){
		const current_vertex = vertices[i];
		const next_vertex = vertices[(i + 1) % num_vertices];
		const cross_product = (current_vertex[0] * next_vertex[1]) - (next_vertex[0] * current_vertex[1]);
		sum_x += (current_vertex[0] + next_vertex[0]) * cross_product;
		sum_y += (current_vertex[1] + next_vertex[1]) * cross_product;
		sum_cp += cross_product;
  }
	const area = sum_cp/2;
	const centroid_x = sum_x / (6 * area)
	const centroid_y = sum_y / (6 * area)
	return {x:centroid_x, y:centroid_y};
}

const canvas = document.getElementById("output");
canvas.width = WIDTH;canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "white";

function order(points) {
  const center = points.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);
  center[0] /= points.length;
  center[1] /= points.length;
  points.sort(([x1, y1], [x2, y2]) => {
    const angle1 = Math.atan2(y1 - center[1], x1 - center[0]);
    const angle2 = Math.atan2(y2 - center[1], x2 - center[0]);
    return angle1 - angle2;
  });
  return points;
}
function hslToHex(t,a,r){var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],n=Math.round(255*(n+r)).toString(16).padStart(2,"0"),d=Math.round(255*(d+r)).toString(16).padStart(2,"0"),h=Math.round(255*(h+r)).toString(16).padStart(2,"0"),"#"+n+d+h}
function getDistinctColors(e){var o=360/e;const t=[];for(let s=0;s<Math.ceil(e);s++)t.push(hslToHex(s*o,1,.5));return t}

function display(relax=false,t=true) {
  if (!relax) {
    CELLS = [];
  POINT_N = Number(document.getElementById("point-n").value);
  POINTS = [];
    for (let i = 0;i<POINT_N;i++) {
      POINTS.push({x:Math.random()*WIDTH,y:Math.random()*HEIGHT});
    }
  } else {
    if (t) {
    POINTS = CELLS.map(findCentroid);
    }
    while (POINTS.length < POINT_N) {
      POINTS.push(NEW_POINTS.pop());
    }
    if (AUTOMATIC) {
      if (COUNTER > 120) {
      POINTS.splice(Math.floor(Math.random()*POINT_N), 1);
      POINTS.push({x:Math.random()*WIDTH,y:Math.random()*HEIGHT});
      COUNTER = 0;
      }
      else {
        COUNTER++;
      }
    }
  }
  document.getElementById("point-display").innerHTML = POINTS.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const map = voronoi(POINTS);
// ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,canvas.height);ctx.stroke();ctx.beginPath();ctx.moveTo(0,canvas.height);ctx.lineTo(canvas.width,canvas.height);ctx.stroke();ctx.beginPath();ctx.moveTo(canvas.width,canvas.height);ctx.lineTo(canvas.width,0);ctx.stroke();ctx.beginPath();ctx.moveTo(canvas.width,0);ctx.lineTo(0,0);ctx.stroke();
  const colors = getDistinctColors(POINT_N);
  
  for (let j = 0;j < POINT_N;j++) {
    
    const i = map.cells[j];
    if (!i) {
      console.log(i,j,POINT_N,POINTS)
    }
    // ctx.fillStyle = "#212529";
    ctx.fillStyle = colors[j];
    const edges = i.halfedges;
   
    const points = [];
    for (const f of edges) {
      if (!(points.includes([f.edge.va.x,f.edge.va.y]))) {
        points.push([f.edge.va.x,f.edge.va.y]);
      }
      if (!(points.includes([f.edge.vb.x,f.edge.vb.y]))) {
        points.push([f.edge.vb.x,f.edge.vb.y]);
      }
    }
    
    order(points);
    CELLS[j] = points;
    ctx.beginPath();
    let last = points[0];
    for (let i = 1;i<points.length;i++) {
      if (i == 1) {ctx.moveTo((points[0][0]),(points[0][1]))}
      let next = points[i];
      ctx.lineTo(next[0],next[1]);
      last = points[i];
    }
    ctx.closePath();
    ctx.fill();
  }

  for (let j = 0;j < map.edges.length;j++) {
    const i = map.edges[j];
    if (i.va && i.vb) {
    ctx.beginPath();
    ctx.moveTo(i.va.x,i.va.y);
    ctx.lineTo(i.vb.x,i.vb.y);
    ctx.stroke();
    }
  }
  let areas = CELLS.map(getArea);
  let mean = Math.round(areas.reduce((a,b)=>(a+b),0)/POINT_N);
  document.getElementById("average-area").innerHTML = mean;
  document.getElementById("stdev-area").innerHTML = Math.round(Math.sqrt(areas.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / POINT_N));
}
function update() {
  if (AUTO_RELAX) {
    display(true);
  }
  requestAnimationFrame(update);
}
function getMousePos(event) {
  const img = document.getElementById("output");
  const rect = img.getBoundingClientRect();
  const x = ((event.clientX - rect.left) * (img.width / rect.width));
  const y = ((event.clientY - rect.top) * (img.height / rect.height));
  return [y, x];
}

display();
document.getElementById("output").addEventListener("click",function(event){
  const w = getMousePos(event);
  if (!(POINTS.includes2({x:w[1],y:w[0]}))) {
    NEW_POINTS.push({x:w[1],y:w[0]});
    POINT_N++;
  }
  display(true,false);
});
document.getElementById("output").addEventListener("contextmenu",function(event){
  event.preventDefault();
  const w = getMousePos(event);
  let md = Infinity;
  let j = 0;
  for (let i = 0;i<POINT_N;i++) {
    const dist = Math.pow(w[0]-POINTS[i].y,2)+Math.pow(w[1]-POINTS[i].x,2);
    if (dist < md) {
      md = dist;j = i;
    }
  }
  CELLS.splice(j,1);POINTS.splice(j,1);
  POINT_N--;
  display(true,false);
  return false;
});
requestAnimationFrame(update);