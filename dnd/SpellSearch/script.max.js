

let FILTERS = {
  "level":[],
  "book":["Player's"],
  "class":[],
  "ritual":[],
  "school":[]
};
let filterttt = "";
let spells = JSON.parse(JSON.stringify(spells2));
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
  spells = JSON.parse(JSON.stringify(spells2));
  FILTERS = {"level":[],"book":[],"class":[],"ritual":[],"school":[]};
  levels = ["level0","level1","level2","level3","level4","level5","level6","level7","level8","level9"];
  for (i in levels) {
    if (document.getElementById(levels[i]).checked){
      FILTERS["level"].push(Number(levels[i].slice(-1)));
    }
  }
  classTransforms = {"classWizard":"wizard","classWarlock":"warlock","classSorcerer":"sorcerer","classDruid":"druid","classBard":"bard","classRanger":"ranger","classPaladin":"paladin","classArtificer":"artificer","classCleric":"cleric"};
  classes = ["classWizard","classWarlock","classSorcerer","classDruid","classBard","classRanger","classPaladin","classArtificer","classCleric"];
  for (i in classes) {
    if (document.getElementById(classes[i]).checked) {
      FILTERS["class"].push(classTransforms[classes[i]]);
    }
  }
  schools = ["Transmutation","Divination","Abjuration","Necromancy","Evocation","Enchantment","Illusion","Conjuration"];
  for (i in schools) {
    console.log(schools[i])
    if (document.getElementById("school"+schools[i]).checked) {
      FILTERS["school"].push(schools[i].toLowerCase());
    }
  }
  if (document.getElementById("ritual").checked) {
      FILTERS["ritual"].push(true);
    }
  if (true) {
    if (document.getElementById("bookPHB").checked) {
      FILTERS["book"].push("Player's");
    }
    if (document.getElementById("bookXGE").checked) {
      FILTERS["book"].push("Xanathar's");
    }
    if (document.getElementById("bookTCE").checked) {
      FILTERS["book"].push("Tasha's");
    }
    if (document.getElementById("bookFTD").checked) {
      FILTERS["book"].push("Fizban's");
    }
  }
  console.log(FILTERS);
  console.log(spells.length);
  spells = spells.filter(filterFunction);
  console.log(spells.length)
  for (filtern in FILTERS) {
    if (filtern.includes("class") && FILTERS[filtern].length > 0) {
      spells = spells.filter(filterClasses);
    }
    else if (filtern.includes("level")){
      spells = spells.filter(filterLevels);
    }
    else if (!filtern.includes("book") && FILTERS[filtern].length > 0) {
      filterttt = filtern;
      spells = spells.filter(filterMisc);
    }
    console.log(spells.length,filtern)
  }
  document.getElementById("output").innerHTML = "";
  for (const f of spells){
    const node = document.createElement("a");
const textnode = document.createTextNode(f["name"]+"");
node.appendChild(textnode);
    node.href = "display/?spell="+f["name"].toLowerCase().replaceAll("-","--").replaceAll(" ","-");
    node.target = "_blank";
document.getElementById("output").appendChild(node);
    document.getElementById("output").appendChild(document.createElement("br"));

  }
}
function getClass(spell) {return spell['class'].split(", ");}
function filterFunction(s) {
  for (const l of FILTERS["book"]) {
    if (s["source"].toLowerCase().includes(l.toLowerCase())) {
      return true;
    }
  }
  return false;
}
function filterClasses(s) {
  for (const l of FILTERS["class"]) {
    if (s["class"].toLowerCase().includes(l.toLowerCase())) {
      return true;
    }
  }
  return false;
}
function filterLevels(s) {
  return FILTERS["level"].includes(s["level"]);
}
function getByName(name) {
  for (const spell of spells) {
    if (spell["name"].toLowerCase() == (name.toLowerCase())) {
      return spell;
    }
  }
  for (const spell of spells) {
    if (spell["name"].toLowerCase().includes(name.toLowerCase())) {
      return spell;
    }
  }
  console.log("No Spell Matching \""+name+"\"");
}
function filterMisc(s) {
  return FILTERS[filterttt].includes(lower(s[filterttt]));
}
