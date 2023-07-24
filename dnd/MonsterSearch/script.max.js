

let FILTERS = {
  "level":[],
  "type":[]
};
let filterttt = "";
let monsters = JSON.parse(JSON.stringify(monsters2));
function lower(s) {
  if (typeof s != "string") {return s;}
  return s.toLowerCase();}
function checkAll(arg,c) {
  if (c.checked) {
    let l = document.getElementsByClassName(arg);
    for (const c of l) {
	   c.checked = true;
	}
    return
  }
  let l = document.getElementsByClassName(arg);
  for (const c of l) {
    c.checked = false;
  }
}
function start() {
  monsters = JSON.parse(JSON.stringify(monsters2));
  FILTERS = {"level":[],"type":[]};
  levels = ["0","1/8","1/4","1/2","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];
  for (i in levels) {
    if (document.getElementById("level"+levels[i]).checked){
      FILTERS["level"].push(levels[i]);
    }
  }
  schools = ["Aberration","Beast","Celestial","Construct","Dragon","Elemental","Fey","Fiend","Giant","Humanoid","Monstrosity","Ooze","Plant","Undead"];
  for (i in schools) {
    console.log(schools[i])
    if (document.getElementById("school"+schools[i]).checked) {
      FILTERS["type"].push(schools[i].toLowerCase());
    }
  }
  // if (document.getElementById("ritual").checked) {
  //     FILTERS["ritual"].push(true);
  //   }
  // if (document.getElementById("books").checked) {
  //   ["Xanathar's","Tasha's","Fizban's","Guildmaster's"].forEach(l=>{FILTERS["book"].push(l);})
  // }
  console.log(FILTERS);
  console.log(monsters.length);
  monsters = monsters.filter(filterFunction);
  console.log(monsters.length)
  for (filtern in FILTERS) {
    console.log(filtern);
    if (filtern.includes("type") && FILTERS[filtern].length > 0) {
      monsters = monsters.filter(filterTypes);
    }
    else if (filtern.includes("level")){
      monsters = monsters.filter(filterLevels);
    }
    else if (!filtern.includes("book") && FILTERS[filtern].length > 0) {
      filterttt = filtern;
      monsters = monsters.filter(filterMisc);
    }
    console.log(monsters.length,filtern)
  }
  document.getElementById("output").innerHTML = "";
  for (const f of monsters){
    const node = document.createElement("a");
const textnode = document.createTextNode(f["name"]+"");
node.appendChild(textnode);
    node.href = "https://dndmonstersearch.ezhgamer173.repl.co/display/?monster="+f["name"].toLowerCase().replaceAll("-","--").replaceAll(" ","-");
    node.target = "_blank";
document.getElementById("output").appendChild(node);
    document.getElementById("output").appendChild(document.createElement("br"));

  }
}
function getClass(spell) {return spell['class'].split(", ");}
function filterFunction(s) {
  return true;
  for (const l of FILTERS["book"]) {
    if (s["source"].toLowerCase().includes(l.toLowerCase())) {
      return true;
    }
  }
  return false;
}
function filterTypes(s) {
  for (const l of FILTERS["type"]) {
    if (s["meta"].toLowerCase().includes(l.toLowerCase())) {
      return true;
    }
  }
  return false;
}
function filterLevels(s) {
  return FILTERS["level"].includes(s["Challenge"].split(" (")[0]);
}
function getByName(name) {
  for (const spell of monsters) {
    if (spell["name"].toLowerCase() == (name.toLowerCase())) {
      return spell;
    }
  }
  for (const spell of monsters) {
    if (spell["name"].toLowerCase().includes(name.toLowerCase())) {
      return spell;
    }
  }
  console.log("No Spell Matching \""+name+"\"");
}
function filterMisc(s) {
  return FILTERS[filterttt].includes(lower(s[filterttt]));
}
