
let CREATURE_MAX = 1024;
let TURNS = 150;

let GENE_NUMBER = 16;
let INTERNAL_NEURONS = 5;
let MUTATION_CHANCE = document.getElementById("mutationsCheckbox").checked?0.05:0;
let SURVIVAL_CONDITION = document.getElementById("condition-select").value;


let WIDTH = 128;
let HEIGHT = 128;

let CREATURE_AMOUNT = CREATURE_MAX;
let board = Array.from({length:Math.floor(HEIGHT)},()=>Array.from({length:Math.floor(WIDTH)},()=>(-1)));
let creatures = [];

const clampPos = (o)=>(Math.max(Math.min(o,WIDTH-1),0));
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;}
function addCreatures() {
  for (let i = 0;i<CREATURE_AMOUNT;i++) {
    let x = Math.floor(Math.random()*WIDTH), y = Math.floor(Math.random()*HEIGHT);
    while (board[y][x] > -1) {x = Math.floor(Math.random()*WIDTH);y = Math.floor(Math.random()*HEIGHT);}
    board[y][x] = i;
    creatures.push(new Creature(GENE_NUMBER,x,y));
  }
} addCreatures();
function addCreature(x,y) {
    if (board[y][x] > -1) {return}
    board[y][x] = CREATURE_AMOUNT++;
    creatures.push(new Creature(GENE_NUMBER,x,y));
}
let TURN_COUNTER = 0;
function update() {
  if (++TURN_COUNTER > TURNS) {
    const newCreatures = [];
    
    
    shuffle(creatures);
    for (let i = 0;i<CREATURE_AMOUNT;i++) {
      if (!survives(creatures[i],board)) {continue;}
      newCreatures.push(creatures[i].reproduce());
    }
    document.getElementById("survived").innerHTML = 
 String(Math.round(((newCreatures.length/CREATURE_MAX) + Number.EPSILON) * 10000)/100).padEnd(5,"0") + "%";
    const ccc = newCreatures.length;
    for (let i = 0;i<ccc && newCreatures.length<CREATURE_MAX;i++) {
      newCreatures.push(newCreatures[i].reproduce());
    }
    while (newCreatures.length < CREATURE_MAX) {
      newCreatures.push(new Creature(GENE_NUMBER));
    }
    board = Array.from({length:Math.floor(HEIGHT)},()=>Array.from({length:Math.floor(WIDTH)},()=>(-1)));
    for (let i = 0;i<newCreatures.length;i++) {
      let x = Math.floor(Math.random()*WIDTH), y = Math.floor(Math.random()*HEIGHT);
      while (board[y][x] > -1) {x = Math.floor(Math.random()*WIDTH);y = Math.floor(Math.random()*HEIGHT);}
      board[y][x] = i;
      newCreatures[i].x = x;
      newCreatures[i].y = y;
    }
    creatures = newCreatures;
    CREATURE_AMOUNT = CREATURE_MAX;
    TURN_COUNTER = 0;
    document.getElementById("generations").innerHTML = Number(document.getElementById("generations").innerHTML)+1;
  } else {
    for (let i = 0;i<CREATURE_AMOUNT;i++) {
      creatures[i].act(board);
    }
    if (TURN_COUNTER*2 == TURNS) {
      for (let i = 0;i<CREATURE_AMOUNT;i++) {
        creatures[i].midX = creatures[i].x;
        creatures[i].midY = creatures[i].y;
      }
    }
  }
}
function visualizeSurviveFunction() {
  let board2 = Array.from({length:Math.floor(HEIGHT)},()=>Array.from({length:Math.floor(WIDTH)},()=>(-1)));
  for (let y = 0;y<HEIGHT;y++) {
    for (let x = 0;x<WIDTH;x++) {
      board2[y][x] = survives(new Creature(GENE_NUMBER,x,y),board) ? "+" : " ";
    }
  }
  console.log(board2.map((row)=>row.join("")).join("\n"));
}
function survives(creature, board) {
  const y = creature.y;
  const x = creature.x;
  
  return {
    "Cross": ()=>Math.abs(WIDTH-x-y) < 7 || Math.abs(x-y) < 7,
    "Change Sides Halfway Through": ()=>creature.midX < WIDTH/2 && creature.x > WIDTH / 2,
    "Spread Out": ()=>Math.abs(((board[y-1] && board[y-1][x] != -1) + (board[y+1] && board[y+1][x] != -1) + (board[y][x-1] != -1) + (board[y][x+1] != -1) + (board[y-1] && board[y-1][x-1] != -1) + (board[y-1] && board[y-1][x+1] != -1) + (board[y+1] && board[y+1][x-1] != -1) + (board[y+1] && board[y+1][x+1] != -1))) < 1,
    "1-2 Neighbors": ()=>Math.abs(((board[y-1] && board[y-1][x] != -1) + (board[y+1] && board[y+1][x] != -1) + (board[y][x-1] != -1) + (board[y][x+1] != -1) + (board[y-1] && board[y-1][x-1] != -1) + (board[y-1] && board[y-1][x+1] != -1) + (board[y+1] && board[y+1][x-1] != -1) + (board[y+1] && board[y+1][x+1] != -1))-1.5)+0.5 < 2,
    "Sloped Line": ()=>Math.abs(x/2-y+HEIGHT/4) < 7,
    "Right Wall": ()=>x > 120, // Right wall
    // "Diagonal": ()=>Math.abs(WIDTH-x-y) < 7, // Diagonal
    "Plus Sign": ()=>(x >= 48 && x <= 80) || (y >= 48 && y <= 80), // Plus
    "Vertical Line": ()=>x >= 48 && x <= 80, // Vertical line
  }[SURVIVAL_CONDITION]();
}