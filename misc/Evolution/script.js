
let CREATURE_MAX = 1024;
let TURNS = 150;

let GENE_NUMBER = 16;
let INTERNAL_NEURONS = 6;
let MUTATION_CHANCE = 0.05;


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
    creatures.push(new Creature(perfectGenesMiddle,x,y));
}
let TURN_COUNTER = 0;
function update() {
  if (++TURN_COUNTER > TURNS) {
    const newCreatures = [];
    
    board = Array.from({length:Math.floor(HEIGHT)},()=>Array.from({length:Math.floor(WIDTH)},()=>(-1)));
    shuffle(creatures);
    for (let i = 0;i<CREATURE_AMOUNT;i++) {
      if (creatures[i].x < 48 || creatures[i].x > 80) {continue;}
      let x = Math.floor(Math.random()*WIDTH), y = Math.floor(Math.random()*HEIGHT);
      while (board[y][x] > -1) {x = Math.floor(Math.random()*WIDTH);y = Math.floor(Math.random()*HEIGHT);}
      board[y][x] = newCreatures.length;
      
      newCreatures.push(creatures[i].reproduce(x,y));
    }
    document.getElementById("survived").innerHTML = 
 Math.round(((newCreatures.length/CREATURE_MAX) + Number.EPSILON) * 10000)/100 + "%";
    const ccc = newCreatures.length;
    for (let i = 0;i<ccc && newCreatures.length<CREATURE_MAX;i++) {
      let x = Math.floor(Math.random()*WIDTH), y = Math.floor(Math.random()*HEIGHT);
      while (board[y][x] > -1) {x = Math.floor(Math.random()*WIDTH);y = Math.floor(Math.random()*HEIGHT);}
      board[y][x] = newCreatures.length;
      
      newCreatures.push(newCreatures[i].reproduce(x,y));
    } while (newCreatures.length < CREATURE_MAX) {
      let x = Math.floor(Math.random()*WIDTH), y = Math.floor(Math.random()*HEIGHT);
      while (board[y][x] > -1) {x = Math.floor(Math.random()*WIDTH);y = Math.floor(Math.random()*HEIGHT);}
      board[y][x] = newCreatures.length;
      
      newCreatures.push(new Creature(GENE_NUMBER,x,y));
    }
    creatures = newCreatures;
    CREATURE_AMOUNT = CREATURE_MAX;
    TURN_COUNTER = 0;
  } else {
    for (let i = 0;i<CREATURE_AMOUNT;i++) {
      creatures[i].act(board);
    }
  }
}
