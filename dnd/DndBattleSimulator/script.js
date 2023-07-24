let Monsters = {};
let Players = {};
let wins1 = 0;
let wins2 = 0;
let sims = 0;
let m1 = {};
let m2 = {};
let in2 = 0
function start() {
  let c1 = document.getElementById("m1").value.toLowerCase().replaceAll(" ","_");
  let c2 = document.getElementById("m2").value.toLowerCase().replaceAll(" ","_");
  if (c1=="player") {
    ism1 = false;
    c1 = document.getElementById("p1").value.toLowerCase().replaceAll(" ","_");
    m1 = Players[c1];
  }
  else {
    c1 = document.getElementById("mm1").value.toLowerCase().replaceAll(" ","_");
    m1 = Monsters[c1];
  }
  if (c2=="player") {
    c2 = document.getElementById("p2").value.toLowerCase().replaceAll(" ","_");
    m2 = Players[c2];
  }
  else {
    c2 = document.getElementById("mm2").value.toLowerCase().replaceAll(" ","_");
    m2 = Monsters[c2];
  }
  console.log(m1);
  console.log(m2);
  document.getElementById("startButton").remove();
  sims = document.getElementById("sims").value;
  for (let i = 0;i<sims;i++) {
    game()
  }
  in2 = setInterval(done,1000);
  
}
function done() {
  console.log(wins1+wins2>=sims);
  if (wins1+wins2>=sims) {
    document.getElementById("output").innerHTML = String(wins1)+"|"+wins2;
    clearInterval(in2)
  }
}
function turn(monster,enemy,health){
  let final = health;
  for (const key in monster.attacks) {
    for (let i = 0;i<monster.attacks[key].amount;i++) {
      if ((monster.attacks[key].to_hit+roll(20))>=enemy.ac) {
        let damage = parseRolls(monster.attacks[key].damage);
        if ("vulnerabilities" in enemy && enemy.vulnerabilities.includes(monster.attacks[key].type)) {
          damage *= 2;
        }
        if ("resistances" in enemy && enemy.resistances.includes(monster.attacks[key].type)) {
          damage = Math.floor(damage/2);
        }
        if ("immunities" in enemy && enemy.immunities.includes(monster.attacks[key].type)) {
          damage = 0;
        }
        final -= damage;
      }
    }
  }
  return final;
}
function game(){
  health1 = m1.health;
  health2 = m2.health;
  if ((roll(20)+m2.initiative+(roll(2)-1))>(roll(20)+m1.initiative)) {
    health1 = turn(m2,m1,health1);
  }
  while (health1>0 && health2>0) {
    health2 = turn(m1,m2,health2);
    if (health1>0 && health2>0) {
      health1 = turn(m2,m1,health1);
    }
  }
  if (health1>0) {wins1++;}
  else {wins2++;}
}
function duplicateChoice() {
  let node = document.getElementById("m1").cloneNode(true);
  node.id = "m2";
  node.classList.toggle("left");
  node.classList.toggle("right");
  node.onchange = function onchange(event) {checkPlayer("2")};
  document.getElementById("bod").appendChild(node);
  let node2 = document.getElementById("p1").cloneNode(true);
  node2.id = "p2";
  node2.classList.toggle("left-down");
  node2.classList.toggle("right-down");
  document.getElementById("bod").appendChild(node2);
  let node3 = document.getElementById("mm1").cloneNode(true);
  node3.id = "mm2";
  node3.classList.toggle("left-down");
  node3.classList.toggle("right-down");
  document.getElementById("bod").appendChild(node3);
  checkPlayer('1');
  checkPlayer('2');
}
function checkPlayer(p) {
  if (document.getElementById("m"+p).value.toLowerCase()=="player") {
    document.getElementById("p"+p).style.display = "block";
  }
  else {
    document.getElementById("p"+p).style.display = "none";
  }
  if (document.getElementById("m"+p).value.toLowerCase()=="monster") {
    document.getElementById("mm"+p).style.display = "block";
  }
  else {
    document.getElementById("mm"+p).style.display = "none";
  }
}
function roll(die) {
  if (typeof(die)=="number"){return Math.floor(Math.random() * die) + 1}
  else{
    let t = die.split("d");
  let rolls = Number(t[0]);
  let f = Number(t[1])
  let final = 0;
  for (let i = 0; i < rolls; i++) {
    final += roll(f);
  }
    return final;
  }
}
function parseRolls(text) {
  let mathRegex = /\d+d\d+\s*\+*\s*\d*/g;
  let matches = text.match(mathRegex);
  let final = text;
  if (matches!==null) {
    for (let i = 0;i < matches.length; i++) {
      let t = matches[i].split("+");
      t.push("0");
      let new1 = [];
      t.forEach(function(d){new1.push(d.replace(" ",""))});
      t = roll(new1[0])+Number(new1[1]);
      if (matches[i].slice(-1)==" ") {
        t+=" ";
      }
      final = final.replace(matches[i],t);
    }}
  return parseInt(final);
}