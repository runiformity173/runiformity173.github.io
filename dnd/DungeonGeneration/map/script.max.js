let HEIGHT = 128;
let WIDTH = 128;
let MAP_SIZE = 16;
let ROUGHNESS = 0.01;
function distance(a,b) {return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2))}
function load2() {resetColors(DEFAULT_COLORS);}
function resetColors(colorset) {
  for (const i in colorset) {
    COLORS[i] = colorset[i];
    document.getElementById(i).value = colorset[i];
  }
}
Array.prototype.insert = function ( index, ...items ) {this.splice( index, 0, ...items );};
function last(a) {return a.at(-1);}
const choose=c=>(c[Math.floor(Math.random()*c.length)]);
function generateMap() {
  let h = w = MAP_SIZE;
  const board = [];for (let i = 0;i<MAP_SIZE;i++) {board.push([]);for (let j = 0;j<MAP_SIZE;j++) {board[i].push(Math.random()*2-1)}}
  while (h < HEIGHT || w < WIDTH) {
    for (let i = 0;i<h;i++) {
      for (let j = w-1;j>0;j--) {
        board[i].insert(j,((board[i][j-1]+board[i][j])/2)+(Math.random()*2-1)*ROUGHNESS)
      }
    }
    for (let i = h-1;i>0;i--) {
      board.insert(i,[])
      for (let j = 0;j<w;j++) {
        board[i].insert(j,((board[i-1][j*2]+board[i+1][j*2])/2)+(Math.random()*2-1)*ROUGHNESS);
      }
      for (let j = w-1;j>0;j--) {
        board[i].insert(j,0)
      }
      let t = 0;
      for (let j = 2*w-3;j>0;j-=2) {
        board[i][j] = (board[i][j-1]+board[i][j+1]+board[i-1][j]+board[i+1][j])/4+((Math.random()*2-1)*ROUGHNESS);t++
      }
    }
    h += h-1;w += w-1;
  }
  return board.slice(0,HEIGHT).map((a)=>(a.slice(0,WIDTH)));
}
let BOARD = [];
let CITIES = {};
let BUILDING_N = 10;
let BIOME_N = 10;
let BUILDINGS = {};
let DIST = 0;
function start() {
  let used_positions = [];
  document.getElementById("render").style.display = "inline";
  HEIGHT = Number(document.getElementById("height").value);
  WIDTH = Number(document.getElementById("width").value);
  CITY_N = Number(document.getElementById("cities").value);
  BIOME_N = Number(document.getElementById("biomes").value);
  BIOMES = roughen(shatter(WIDTH, HEIGHT, BIOME_N),Math.round(WIDTH/128)+1);
  BUILDING_N = Number(document.getElementById("buildings").value);
  ROUGHNESS = Number(document.getElementById("roughness").value)/1000;
  MAP_SIZE = Math.round({"Local":4,"Regional":8,"Continental":16}[document.getElementById("size").value]);
  
  DIST = Math.sqrt(HEIGHT*WIDTH)/128+1;
  BOARD = generateMap();
  CITIES = {};for (let i = 0;i<CITY_N;i++) {
    let pos = [];
    let ts = 0;
    while (pos.length === 0 && ts < 1000) {
      ts++;
      let npos = [Math.floor(Math.random()*HEIGHT),Math.floor(Math.random()*WIDTH)];
      if (BOARD[npos[0]][npos[1]] > 0.0) {
        let k = true;
        for (const p of used_positions) {
          if (distance(p,npos)<2*DIST) k=false
        }
        if (k) {
          pos = npos;
        }
      }
    }
    if (ts == 1000) continue;
    used_positions.push(pos);
    let buildingType = "settlement";
  let final = [];
  final.push("<b>"+getName("ayOOOO")+"</b>: Settlement");final.push("Ruler's Status: "+choose(rulerStatus));final.push("Notable Trait: "+choose(traits));final.push("Known for its...: "+choose(knowns));final.push("Current Calamity&emsp;: "+choose(calamities));final.push("Biome: "+getBiome(pos[0],pos[1]));
  final = final.map(function (a) {return "<td>"+a.split(": ").join("</td><td>")+"</td>"});
  CITIES[pos.join(",")] = ("<table><tr>"+final.join("</tr><tr>")+"</tr></table>");
  }
  BUILDINGS = {};for (let i = 0;i<BUILDING_N;i++) {
    let pos = [];
    let ts = 0;
    while (pos.length === 0 && ts < 1000) {
      ts++;
      let npos = [Math.floor(Math.random()*HEIGHT),Math.floor(Math.random()*WIDTH)];
      if (BOARD[npos[0]][npos[1]] > 0.0) {
        let k = true;
        for (const p of used_positions) {
          if (distance(p,npos)<2*DIST) k=false
        }
        if (k) {
          pos = npos;
        }
      }
    }
    if (ts == 1000) continue;
    used_positions.push(pos);
    let buildingType = choose(["shop","tavern","residence"]);let final = [];
    if (buildingType==="tavern") {final.push(choose(tavern));final.push(choose(tavernFirst)+" "+choose(tavernSecond));}
  else {final.push(choose(eval(buildingType)));}
    final.push("Biome&emsp;: "+getBiome(pos[0],pos[1]));
    final = final.map(function (a) {return "<td>"+a.split(": ").join("</td><td>")+"</td>"});
  BUILDINGS[pos.join(",")] = (buildingType[0].toUpperCase()+buildingType.slice(1)+"<table><tr>"+final.join("</tr><tr>")+"</tr></table>");
  }
  display(BOARD);
}
let BIOMES = [];
const noiseStrength = 5;
// function shatter(width, height, numShards) {
//   const sections = Array.from({ length: height }, () => Array(width).fill(0));
//   const seeds = [];
//   for (let i = 0; i < numShards; i++) {const seed = {x: Math.floor(Math.random() * width),y: Math.floor(Math.random() * height)};seeds.push(seed);}
//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       let minDist = Infinity;
//       let sectionIndex = 0;
//       let nx = x + Math.round(Math.cos(Math.PI*2-y*0.1)*noiseStrength);
//       let ny = y + Math.round(Math.sin(x*0.1)*noiseStrength);
      
//       for (let i = 0; i < numShards; i++) {
//         const seed = seeds[i];
//         const dist = ((seed.x - nx) ** 2 + (seed.y - ny) ** 2);
//         if (dist < minDist) {minDist = dist;sectionIndex = i+1;}
//       }
//       sections[y][x] = sectionIndex;
//     }
//   } return sections;
// }
function ramp(val) {return Math.round((val+1)*2);}
function shatter(width, height, numShards) {
  noise.seed(Math.random());
  const sections = Array.from({ length: height }, () => Array(width).fill(0));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      sections[y][x] = wetness_and_temp_map[ramp(noise.perlin2(x,y))][ramp(noise.perlin2(x+WIDTH,y+HEIGHT))];
    }
  } return sections;
}
function roughen(board, range) {
  const roughenedBoard = [];
  for (let i = 0; i < board.length; i++) {
    const roughenedRow = [];
    for (let j = 0; j < board[i].length; j++) {
      const surroundingPixels = [];
      const startX = Math.max(0, i - range);
      const endX = Math.min(board.length - 1, i + range);
      const startY = Math.max(0, j - range);
      const endY = Math.min(board[i].length - 1, j + range);
      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          surroundingPixels.push(board[x][y]);
        }
      }
      const randomIndex = Math.floor(Math.random() * surroundingPixels.length);
      const randomValue = surroundingPixels[randomIndex];
      roughenedRow.push(randomValue);
    }
    roughenedBoard.push(roughenedRow);
  }
  return roughenedBoard;
}
function getBiome(y,x) {
  if (BOARD[y][x] <= SEA_LEVEL) return "Ocean";
  if (BOARD[y][x] <= 0.1) return "Coast";
  if (BOARD[y][x] > 0.8) return "Mountain";
  return biome_map[BIOMES[y][x]]
}
