let SEA_LEVEL = 0.0;let COLORS = {};COLORS["coast"] = "#99dd22";COLORS["deep_ocean"] = "#171779";COLORS["shallow_ocean"] = "#0079d9";COLORS["plains"] = "#00ab48";COLORS["forests"] = "#0f5319";COLORS["deserts"] = "#dad978";COLORS["hills"] = "#633f38";COLORS["mountains"] = "#b3b3b3";COLORS["arctic"] = "#eeeeee";
const DEFAULT_COLORS = structuredClone(COLORS);
const biomeMap = {0:"plains",2:"hills",1:"forests",3:"arctic",4:"deserts"};
let CITY_N = 5;
function createPNG(a) {
	const n = document.createElement("canvas");
	n.width = a[0].length, n.height = a.length;
	const t = n.getContext("2d"),
		g = t.createImageData(n.width, n.height);
	for(let e = 0; e < a.length; e++)
		for(let t = 0; t < a[e].length; t++) {
			var r = hexToRgb(a[e][t]),
				h = 4 * (e * n.width + t);
			g.data[h] = r.r, g.data[1 + h] = r.g, g.data[2 + h] = r.b, g.data[3 + h] = 255
		}
  t.putImageData(g, 0, 0)
  t.fillStyle = 'hsl(180,100%,100%)';
  for (const i in CITIES) {
    t.beginPath();
    const screenX = Number(i.split(",")[1]);
    const screenY = Number(i.split(",")[0]);
    t.arc(screenX, screenY, DIST, 0, 2*Math.PI);
    t.fill();
 }
  for (const i in BUILDINGS) {
    t.beginPath();
    const screenX = Number(i.split(",")[1]);
    const screenY = Number(i.split(",")[0]);
    t.arc(screenX, screenY, DIST/2, 0, 2*Math.PI);
    t.fill();
 }
	return n.toDataURL("image/png")
}
function hexToRgb(t){return{r:parseInt(t.substring(1,3),16),g:parseInt(t.substring(3,5),16),b:parseInt(t.substring(5,7),16)}}
function getColor(c,biome) {
  if (c <= SEA_LEVEL) return blendHex(COLORS["shallow_ocean"],COLORS["deep_ocean"],(c+SEA_LEVEL+1))
  if (c <= 0.2) {
    return blendHex(COLORS[biomeMap[biome]],COLORS["coast"],(c-SEA_LEVEL)*5)
  }
  if (c <= 0.8) {
    return blendHex(blendHex(COLORS[biomeMap[biome]],COLORS["mountains"],0.5),COLORS[biomeMap[biome]],(c-SEA_LEVEL-0.2))
  }
  return blendHex(COLORS["mountains"],blendHex(COLORS[biomeMap[biome]],COLORS["mountains"],0.5),(c-SEA_LEVEL-0.2))
}

function blendHex(hex1, hex2, weight) {
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
function getMousePos(event) {
  const img = document.getElementById("output");
  const rect = img.getBoundingClientRect();
  const x = ((event.clientX - rect.left) * (img.naturalWidth / rect.width));
  const y = ((event.clientY - rect.top) * (img.naturalHeight / rect.height));
  return [y, x];}

function display(board1) {
  let b = JSON.parse(JSON.stringify(board1));
  let board2 = b.map(function(a,y){return a.map(function(c,x){return getColor(c,Math.round(BIOMES[y][x])%5)})})
  document.getElementById("output").src = createPNG(board2);
  document.getElementById("output").style.cursor = "default";
  document.getElementById("output").addEventListener("click", (event) => {
  const [y, x] = getMousePos(event);
  for (const i in BUILDINGS) {
    if (distance(i.split(",").map((e)=>(Number(e))),[y,x])<=DIST) {
      document.getElementById("extraOutput").innerHTML = BUILDINGS[i];return;
    }
  }
    for (const i in CITIES) {
    if (distance(i.split(",").map((e)=>(Number(e))),[y,x])<=DIST) {
      document.getElementById("extraOutput").innerHTML = CITIES[i];return;
    }
  }
});
document.getElementById("output").addEventListener("mousemove", (event) => {
  const [y, x] = getMousePos(event);
  for (const i in BUILDINGS) {
    if (distance(i.split(",").map((e)=>(Number(e))),[y,x])<=DIST) {
      document.getElementById("output").style.cursor = "pointer";return;
    }
  }
    for (const i in CITIES) {
    if (distance(i.split(",").map((e)=>(Number(e))),[y,x])<=DIST) {
      document.getElementById("output").style.cursor = "pointer";return;
    }
  }
  document.getElementById("output").style.cursor = "default";
});
}