const canvas = document.getElementById("output");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "white";
ctx.lineWidth = 2;

function getMousePos(event) {
  const img = document.getElementById("output");
  const rect = img.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (img.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (img.height / rect.height));
  return [y, x];
}
function hslToHex(t,a,r){var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],n=Math.round(255*(n+r)),d=Math.round(255*(d+r)),h=Math.round(255*(h+r)),"rgb("+n+","+d+","+h+")"}
function getDistinctColors(e){var o=360/e;const t=[];for(let s=0;s<Math.ceil(e);s++)t.push(hslToHex(s*o,1,.5));return t}

// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
// function calcNearestPointOnLine(line1, line2, pnt) {
//     var L2 = ( ((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)) );
//     if(L2 == 0) return false;
//     var r = ( ((pnt.x - line1.x) * (line2.x - line1.x)) + ((pnt.y - line1.y) * (line2.y - line1.y)) ) / L2;

//     return {
//         x: line1.x + (r * (line2.x - line1.x)), 
//         y: line1.y + (r * (line2.y - line1.y))
//     };
// }


// function calcDistancePointToLine(line1, line2, pnt) {
//     var L2 = ( ((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)) );
//     if(L2 == 0) return false;
//     var s = (((line1.y - pnt.y) * (line2.x - line1.x)) - ((line1.x - pnt.x) * (line2.y - line1.y))) / L2;
//     return Math.abs(s) * Math.sqrt(L2);
// }

// function calcIsInsideLineSegment(line1, line2, pnt) {
//     var L2 = ( ((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)) );
//     if(L2 == 0) return false;
//     var r = ( ((pnt.x - line1.x) * (line2.x - line1.x)) + ((pnt.y - line1.y) * (line2.y - line1.y)) ) / L2;

//     return (0 <= r) && (r <= 1);
// }

function calcIsInsideThickLineSegment(line1, line2, pnt, lineThickness) {
    var L2 = ( ((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)) );
    if(L2 == 0) return false;
    var r = ( ((pnt.x - line1.x) * (line2.x - line1.x)) + ((pnt.y - line1.y) * (line2.y - line1.y)) ) / L2;
    if(r < 0) {
        return (Math.sqrt(( (line1.x - pnt.x) * (line1.x - pnt.x) ) + ( (line1.y - pnt.y) * (line1.y - pnt.y) )) <= lineThickness);
    } else if((0 <= r) && (r <= 1)) {
        var s = (((line1.y - pnt.y) * (line2.x - line1.x)) - ((line1.x - pnt.x) * (line2.y - line1.y))) / L2;
        return (Math.abs(s) * Math.sqrt(L2) <= lineThickness);
    } else {
        return (Math.sqrt(( (line2.x - pnt.x) * (line2.x - pnt.x) ) + ( (line2.y - pnt.y) * (line2.y - pnt.y) )) <= lineThickness);
    }
}
let hasLoggedOnce = false;
function intersects(a,b,c,d,p,q,r,s) {
  if (p == r && q == s) {
    return calcIsInsideThickLineSegment({x:a,y:b},{x:c,y:d},{x:p,y:q},3);
  }
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};
let isDeleting = false;
let lastPos = [-1,-1];
let currentPos = [0,0];
let lastInterval = -1;
window.addEventListener("mousedown",function(event){
  isDeleting = true;
  lastPos = getMousePos(event);
  currentPos = [lastPos[0],lastPos[1]];
  if (lastInterval != -1) clearInterval(lastInterval);
  lastInterval = setInterval(cut,10);
});
window.addEventListener("mouseup",function(){
  if (lastInterval != -1) {clearInterval(lastInterval);lastInterval = -1;}
  isDeleting = false;
});
function removeItemOnce(arr, value) {var index = arr.indexOf(value);if (index > -1) {arr.splice(index, 1);} return arr;}
function midpoint(p1,p2) {return [(p1.y+p2.y)/2,(p1.x+p2.x)/2]}
function cut() {
  const toBeRemoved = [];
  const [y,x] = currentPos;
  for (const spring2 in springs) {
    const spring = springs[spring2];
    if (spring.particleA===undefined || spring.particleB===undefined) continue;
    if (intersects(particles[spring.particleB].x,particles[spring.particleB].y,particles[spring.particleA].x,particles[spring.particleA].y,x,y,lastPos[1],lastPos[0])) {
      removeItemOnce(graph[spring.particleA],spring.particleB);removeItemOnce(graph[spring.particleB],spring.particleA);toBeRemoved.unshift(spring2)
    }
  }
  for (const i of toBeRemoved) {
    // const p1 = particles[springs[i].particleA];
    // const p2 = particles[springs[i].particleB];
    // const [my,mx] = midpoint(p1,p2);
    // const w = particles.length;
    // // og: A to mp1
    // // new: B to mp2
    // particles.push({x:p2.x,y:p2.y});
    // p2.y = my;p2.x = mx;
    // springs.push(springs[i].particleB);
    springs.splice(i,1);
    
  }
  lastPos = [currentPos[0],currentPos[1]];
}

window.addEventListener("mousemove",function(event){
  if (isDeleting) {
    const [y,x] = getMousePos(event);
    
    lastPos = [currentPos[0],currentPos[1]];
    currentPos = [y,x];
  }
});
function getCC(graph) {
  const visited = new Set();
  const ccList = [];
  let currentCC = 0;

  function dfs(node) {
    visited.add(node);
    ccList[node] = currentCC;

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
  }

  for (let vertex = 0; vertex < graph.length; vertex++) {
    if (!visited.has(vertex)) {
      dfs(vertex);
      currentCC++;
    }
  }

  return ccList;
}


let PAUSED = false;
let frames = 0;
setInterval(function(){document.getElementById("fps").innerHTML = "FPS: "+frames;frames = 0;},1000);

const shouldBe = structuredClone(graph);
function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!PAUSED) {
    simulateCloth();
  }
  const ccs = getCC(graph);
  const colors = getDistinctColors(Math.max(...ccs)+1);
  for (spring of springs) {
    if (spring.particleA===undefined || spring.particleB===undefined) {continue;}
    if (springs.length == originalSpringNumber && (shouldBe[spring.particleA].length == 4 || shouldBe[spring.particleB].length == 4)) {continue;}
    // else if ((shouldBe[spring.particleA].length > graph[spring.particleA].length || shouldBe[spring.particleB].length > graph[spring.particleB].length) && (graph[spring.particleA].length < 3 || graph[spring.particleB].length < 3)) {}
    // else {continue;}
    ctx.beginPath();
    ctx.moveTo(particles[spring.particleA].x, particles[spring.particleA].y);
    ctx.lineTo(particles[spring.particleB].x, particles[spring.particleB].y);
    ctx.stroke();
  } for (particle in particles) {
    continue;
    if (graph[particle].length == 4) {continue;}
    const joint = particles[particle];
    ctx.beginPath();
    ctx.arc(joint.x, joint.y, 6, 0, 2*Math.PI);
    // if (!joint.rooted) {
      ctx.fillStyle = colors[ccs[particle]];
    // } else {ctx.fillStyle = "orange";}
    ctx.fill();
  }
  frames++;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);