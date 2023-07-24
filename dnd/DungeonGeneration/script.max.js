let WIDTH = 0;let HEIGHT = 0;let DUNGEON_TYPE = "";
Array.prototype.unfinished=function(){for(var r=0;r<this.length;r++)for(var t=0;t<this[r].length;t++)if(typeof(this[r][t])!="number")return!0;return!1};
Array.prototype.replace2=function(t){for(var r=0;r<this.length;r++)for(var h=0;h<this[r].length;h++)1===this[r][h]&&(this[r][h]=t)};
Array.prototype.locateNext=function(){for(var t=0;t<this.length;t++)for(var n=this[t],e=0;e<n.length;e++)if(!(typeof(n[e])==="number"))return[t,e];return-1};
function locateEntrance(area){for(var t=0;t<area.length;t++)for(var n=area[t],e=0;e<n.length;e++)if(n[e]==="entrance")return[t,e];return-1};
function random(lower,upper) {return Math.floor(Math.random() * (upper+(1-lower))) + lower;}
function placeArea(r,e,t,u,f){var l=e.length,h=e[0].length;for(let n=0;n<l;n++)for(let l=0;l<h;l++){var i=t+l,g=u+n;if(i<0||g<0||i>=r[0].length||g>=r.length)return null;if(0!==e[n][l]&&0!==r[g][i])return null;if(0!==e[n][l]&&0<g&&0!==r[g-1][i])return null;if(0!==e[n][l]&&g<r.length-1&&0!==r[g+1][i])return null;if(0!==e[n][l]&&0<i&&0!==r[g][i-1])return null;if(0!==e[n][l]&&i<r[0].length-1&&0!==r[g][i+1])return null}for(let n=0;n<l;n++)for(let l=0;l<h;l++)0!==e[n][l]&&(r[u+n][t+l]=e[n][l]),"number"!=typeof e[n][l]&&f.push([u+n,t+l]);return r}
function placeArea2(l,t,n,f,u){var e=t.length,o=t[0].length;for(let r=0;r<e;r++)for(let e=0;e<o;e++){var h=n+e,a=f+r;if(h<0||a<0||h>=l[0].length||a>=l.length)return null;if(0!==t[r][e]&&0!==l[a][h])return null}for(let r=0;r<e;r++)for(let e=0;e<o;e++)0!==t[r][e]&&(l[f+r][n+e]=t[r][e]),"number"!=typeof t[r][e]&&u.push([f+r,n+e]);return l}

const choose=o=>o[Math.floor(Math.random()*o.length)];
String.prototype.splitFromEnd=function(t=" ",n=1){const i=this.split(t);var s=i.length-1;const o=i.slice(s-n+1),e=[];0<o.length&&e.push(o.join(t));const l=i.slice(0,s-n+1);return 0<l.length&&e.unshift(l.join(t)),e};
function replaceSubstringsInArray(e){return e.map(e=>e.map(e=>{if("string"==typeof e)switch(e.split(" ")[e.split(" ").length-1]){case"up":return e.replace("up","right");case"right":return e.replace("right","down");case"down":return e.replace("down","left");case"left":return e.replace("left","up");default:return e}return e}))}
function rotateArray(r,e){for(let t=0;t<e;t++)r=rotateOnce(r);return r}function rotateOnce(e){var n=e.length,t=e[0].length;const o=[];for(let r=0;r<t;r++){const a=[];for(let t=n-1;0<=t;t--)a.push(e[t][r]);o.push(a)}return replaceSubstringsInArray(o)}
function placeExits(t,r,n){var s=t.length,i=t[0].length,d=[];return r.forEach(r=>{let e=0,a,o;switch(r){case"same":for(a=random(0,i-1);1!==t[n[0]][a]&&e<5;)a=random(0,i-1),e++;e<5?t[n[0]][a]="exit down":d.push([n[0],a]);break;case"opposite":for(a=random(0,i-1);1!==t[0][a]&&e<5;)a=random(0,i-1),e++;e<5?t[0][a]="exit up":d.push([0,a]);break;case"left":for(o=random(0,s-1);1!==t[o][0]&&e<5;)o=random(0,s-1),e++;e<5?t[o][0]="exit left":d.push([o,0]);break;case"right":for(o=random(0,s-1);1!==t[o][i-1]&&e<5;)o=random(0,s-1),e++;e<5&&(t[o][i-1]="exit right")}}),d}
function getOffset(area) {let pos = locateEntrance(area);return [-pos[0],-pos[1]]}
function getTreasure() {return "idk, man";}
function getTrap() {return "Trigger: "+choose(trapTriggers)+"; Effect: "+choose(trapEffects)+"; Damage: "+choose(["Setback","Setback","Dangerous","Dangerous","Dangerous","Deadly"]);}
function getTrick() {return "Object: "+choose(trickObjects)+"; Effect: "+choose(trickEffects)}
function getThing(thing) {
  if (thing == "Trap") {return getTrap().split(";").join("<br>");}
  if (thing == "Trick") {return getTrick().split(";").join("<br>");}
  if (thing == "Obstacle") {return choose(obstacles);}
  if (thing == "Book") {return choose(books);}
  if (thing == "Hazard") {return choose(hazards);}
  if (thing == "Room (kinda weird)") {return [choose(tomb),getThing("All"),choose(generalFeatures),choose(generalFeatures),choose(furnishings),choose(furnishings),"","Container Contents: "+choose(containerContents),"Container Contents: "+choose(containerContents)].join("<br>");}
  if (thing == "Furnishings") {
    thing = document.getElementById("furnishings").value;
    if (thing == "General Features") {return choose(generalFeatures);}
    if (thing == "General Furnishings") {return choose(furnishings);}
    
    if (thing == "Container Contents") {return choose(containerContents);}
    if (thing == "Religious") {return choose(religious);}
    if (thing == "Mage") {return choose(mage);}
    if (thing == "Book") {return choose(books);}
    if (thing == "Personal Items") {return choose(personalItems);}
  }
  if (thing == "Dressings" || thing == "All") {
    if (thing != "All") {thing = document.getElementById("dressings").value;}
    if (thing == "Air") {return choose(air);}
    if (thing == "Noise") {return choose(noises);}
    
    if (thing == "Odor") {return choose(odors);}
    if (thing == "Chamber State") {return choose(chamberState).replace("[general]",choose(general).toLowerCase());}
    if (thing == "All") {return "Chamber State: "+choose(chamberState).replace("[general]",choose(general).toLowerCase())+"<br>Noise: "+choose(noises)+"<br>Air: "+choose(air)+"<br>Odor: "+choose(odors);}
  }
}
function extrasChange(val) {document.getElementById("furnishings").style.display="none";document.getElementById("dressings").style.display="none";if (val=="Dressings"){document.getElementById("dressings").style.display="inline"} if (val=="Furnishings"){document.getElementById("furnishings").style.display="inline"}}
document.getElementById('myG').addEventListener("keydown", (event) => {
  if (event.keyCode === 71 && event.altKey) {
  document.getElementById('extraOutput').innerHTML = getThing('Room (kinda weird)');
    return;
      }
  // do something
});
function generateDungeon() {
  let extraData = {};
  let isAChamber = false;
  let dungeon = Array.from({length:HEIGHT},()=>Array.from({length:WIDTH},()=>0));
  let doorPositions1 = [];
  let test=placeArea(dungeon,choose(startingAreas),HEIGHT/2,WIDTH/2,doorPositions1);
  while (test===null){test=placeArea(dungeon,choose(startingAreas),HEIGHT/2,WIDTH/2,doorPositions1);}
  let someData = {};
  doorPositions1.forEach(function (a) {someData[a.join(",")] = 1})
  let roomData = {1:["Starting area"]};
  dungeon = test;
  while (dungeon.unfinished()) {
    let rooms = eval(DUNGEON_TYPE);
    let number = 1;
    let placed = false;
    let pos = dungeon.locateNext();
    let next = dungeon[pos[0]][pos[1]].splitFromEnd();
    let type = next[0];let dir = next[1]
    extraData[String(pos[0])+","+String(pos[1])] = '';
    dungeon[pos[0]][pos[1]]=0;
    if (type==="10% secret door") {type = (random(0,9)===0?"secret door":"nothing");}
    if (!["passage","door","exit","secret door"].includes(type)) {continue;}
    let rotations = {"up":0,"right":1,"down":2,"left":3}[dir];
    let area = [];
    let faileds = [];
    for (let i = 0; i < 30; i++) {
      area = [];
      if (type==="exit") {type=choose(["corridor","door"]);}
      if (type==="passage") {area = JSON.parse(JSON.stringify(choose(passages)));}
      else if (type==="door" || type==="secret door") {area = JSON.parse(JSON.stringify(choose(doors)))}
      else if (type==="corridor") {area = [["passage up"],["entrance"]];}
      // if (type==="door" && pos.join(",") in someData && someData[pos.join(",")] in roomData) {
      //   roomData[someData[pos.join(",")]].push(choose(["wooden door","wooden door","wooden door","wooden door","wooden door","wooden door","wooden door","stone door","iron door","portcullis","secret door",])+choose(["","",", barred",", locked"])+" "+dir);console.log(someData[pos.join(",")]);
        
      // }
      isAChamber = false;
      if (area==="chamber" || type === "chamber") {
        isAChamber = true;
        //Hazard, Obstacle, Trap, Trick
        roomData[Object.keys(extraData).length+1] = [];
        let contents = choose(chamberContents);
        let final = contents;
        if (contents.includes("[hazard]")) {final = contents.replace("[hazard]",choose(hazards));}
        else if (contents.includes("[obstacle]")) {final = contents.replace("[obstacle]",choose(obstacles));}
        else if (contents.includes("[trick]")) {final = contents.replace("[trick]",getTrick());}
        else if (contents.includes("[trap]")) {final = contents.replace("[trap]",getTrap());}
        (final != "Empty room")&&roomData[Object.keys(extraData).length+1].push(final);
        final.includes("Monster")&&(roomData[Object.keys(extraData).length+1][0] += ("; Monster Motivation: "+choose(monsterMotivation)));
        final.toLowerCase().includes("treasure")&&(roomData[Object.keys(extraData).length+1][0] += ("; Treasure: "+getTreasure()));
        roomData[Object.keys(extraData).length+1].push("Details:")
        roomData[Object.keys(extraData).length+1].push(choose(rooms));
        if (roomData[Object.keys(extraData).length+1][roomData[Object.keys(extraData).length+1].length-1].toLowerCase().includes("library")) {
          let chosen = [];let rdj = random(2,5);
          for (let i = 0; i < rdj; i++) {chosen.push(choose(books))}
          roomData[Object.keys(extraData).length+1][roomData[Object.keys(extraData).length+1].length-1] += ("; Books: "+chosen.join(", "));
        }
        let temp = JSON.parse(JSON.stringify(choose(chambers)));area = temp["area"];
        let exits = [];let exitN = random(0,smallExits.length-1);
        exitN = smallExits[exitN]+(temp["isLarge"]?largeExits[exitN]:0);
        for (let i = 0; i < exitN; i++) {exits.push(choose(exitLocations));}
        placeExits(area,exits,locateEntrance(area));
      }
      number = Object.keys(extraData).length+1;
      area = rotateArray(area,rotations);
      let offset = getOffset(area);
      let entrance = locateEntrance(area);
      (entrance===-1)&&console.log(type,area)
      area[entrance[0]][entrance[1]]!=="entrance" && console.log(area,area[entrance[0]],entrance[1]);
      area[entrance[0]][entrance[1]] = number;
      area.replace2(number);
      let doorPositions = [];
      let test = (!isAChamber)?placeArea(dungeon,area,pos[1]+offset[1]+{"up":0,"right":1,"down":0,"left":-1}[dir],pos[0]+offset[0]+{"up":-1,"right":0,"down":1,"left":0}[dir],doorPositions):placeArea2(dungeon,area,pos[1]+offset[1]+{"up":0,"right":1,"down":0,"left":-1}[dir],pos[0]+offset[0]+{"up":-1,"right":0,"down":1,"left":0}[dir],doorPositions);
      if (test !== null) {dungeon = test;placed=true;
          doorPositions.forEach(function (a) {someData[a.join(",")] = number;})
        break;}
      delete roomData[number];
      faileds.push([area,pos,[pos[0]+offset[0]+{"up":-1,"right":0,"down":1,"left":0}[dir],pos[1]+offset[1]+{"up":0,"right":1,"down":0,"left":-1}[dir]],[offset[0],offset[1]]]);
    }
    if (!placed) {delete roomData[number];}
    extraData[String(pos[0])+","+String(pos[1])] = ((type=="door"||isAChamber)?choose(doorTypes):type)+" "+dir+" "+String(placed);
  dungeon[pos[0]][pos[1]]=someData[pos.join(",")];
  }
  for (let dc in extraData) {
    let dir = extraData[dc].split(" ").slice(-2,-1)[0];
    let offset = [{"up":-1,"right":0,"down":1,"left":0}[dir],{"up":0,"right":1,"down":0,"left":-1}[dir]];
    if (someData[dc] in roomData && extraData[dc].includes(" true") && dungeon[Number(dc.split(",")[0])+offset[0]][Number(dc.split(",")[1])+offset[1]] != 0) {
      let ccc = "";
      if (extraData[dc].includes("door")) {
      ccc = choose(doorTypes)+" "+extraData[dc].splitFromEnd(" ",2)[1].split(" ")[0]}
      else {
        ccc = "passage "+extraData[dc].splitFromEnd(" ",2)[1].split(" ")[0];
      }
  // roomData[someData[dc]].push(ccc);
    }}
  let dungeonInfo = [];dungeonInfo.push("Location: "+choose(locations));dungeonInfo.push("Creator(s): "+choose(creator));
  document.getElementById("dungeonInfo").innerHTML = dungeonInfo.join("<br>").replaceAll("[cult]",choose(cults)).replaceAll("[exotic]",choose(exoticLocations));
  return [dungeon,extraData,roomData,someData];
}



let board = [];
function start() {
  // let size = document.querySelector('input[name="sample-range"]:checked').value;
  HEIGHT = Number(document.getElementById("height").value);
  WIDTH = Number(document.getElementById("width").value);
  DUNGEON_TYPE = {"Random":"random","General":"general","Death Trap":"deathTrap","Lair":"lair","Maze":"maze","Mine":"mine","Planar Gate":"planarGate","Stronghold":"stronghold","Temple or Shrine":"shrine","Tomb":"tomb","Treasure Vault":"treasureVault"}[document.getElementById("dungeonType").value];
  if ("random" == DUNGEON_TYPE) {DUNGEON_TYPE = choose(["deathTrap","lair","lair","lair","lair","maze","mine","mine","mine","planarGate","stronghold","stronghold","stronghold","stronghold","shrine","shrine","shrine","tomb","tomb","treasureVault"]);}
  document.getElementById("height").disabled = true;
  document.getElementById("width").disabled = true;
  document.getElementById("keyOutput").innerHTML = "";
  // SAMPLE_RANGE = Math.round((HEIGHT+WIDTH)/2)/({"Medium":32,"Small":64,"Large":16}[size]);
  WALL = document.getElementById("wall").value;
  FLOOR = document.getElementById("floor").value;
  // DESCRIPTIONS = document.getElementById("descriptions").checked;
  NO_DEAD_ENDS = document.getElementById("no-dead-ends").checked;
  
  // ONLY_LARGEST = document.getElementById("largest").checked;
  // // MULT = ((HEIGHT > 128 || WIDTH > 128) ? 0 : 9);
  // MULT = 0;
  // board = boardWithNoise(NOISE, HEIGHT, WIDTH);
  board = generateDungeon();
  display(board);
//   document.querySelector("#run").onclick = function() {board = update(board, HEIGHT, WIDTH, SAMPLE_RANGE);
// display(board);};
  document.querySelector("#run").innerHTML = "Regenerate";
  document.querySelector("#render").onclick = function() {display(board);};
  document.querySelector("#render").style.display = "inline";
  document.querySelector("#rerun").style.display = "inline";
}
function generate() {
  // board = update(board, HEIGHT, WIDTH, SAMPLE_RANGE);
  display(board);
}
function render() {display(board);}
function load2() {
  if (location.href.includes("?")) {
  let obj = JSON.parse(atob(location.search.replace("?data=","")));
  document.getElementById("height").value = obj["height"];
  document.getElementById("width").value = obj["width"];
  // document.getElementById("descriptions").checked = obj["descriptions"];
  document.getElementById("no-dead-ends").checked = obj["no-dead-ends"]
  document.getElementById("height").disabled = false;
  document.getElementById("width").disabled = false;
  // document.querySelector("input[value='"+obj["sample-range"]+"']").checked = true;
  document.getElementById("wall").value = obj["wall"];
  document.getElementById("floor").value = obj["floor"];
}}
function regenerate() {
  let js = JSON.stringify({"height":HEIGHT,"width":WIDTH,"wall":WALL,"floor":FLOOR,"no-dead-ends":NO_DEAD_ENDS});
  js = btoa(js);
  window.location.replace(location.href.replace(location.search,"")+"?data="+js);
}