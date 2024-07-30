let FILTERS = {
  "level":[],
  "type":[]
};
let filterttt = "";
let monsters = Object.values(monsterData);
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
  monsters = Object.values(monsterData);
  FILTERS = {"level":[],"type":[]};
  levels = ["0","1/8","1/4","1/2","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];
  for (i in levels) {
    if (document.getElementById("level"+levels[i]).checked){
      FILTERS["level"].push(levels[i]);
    }
  }
  types = ["Aberration","Beast","Celestial","Construct","Dragon","Elemental","Fey","Fiend","Giant","Humanoid","Monstrosity","Ooze","Plant","Undead"];
  for (i in types) {
    console.log(types[i])
    if (document.getElementById("school"+types[i]).checked) {
      FILTERS["type"].push(types[i].toLowerCase());
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
    node.href = "display/?monster="+f["name"].toLowerCase().replaceAll("-","--").replaceAll(" ","-");
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
    const c = s["type"];
    if ((c.type||c).toLowerCase().includes(l.toLowerCase())) {
      return true;
    }
  }
  return false;
}
function filterLevels(s) {
  return FILTERS["level"].includes(s["cr"]);
}
var stringDistance=function(a,b){var c,d,e,f,g,h,k,l,m,n=a.length,o=b.length,p={insert:function(){return 0.1},delete:function(){return 1},replace:function(){return 1}};if(0==n||0==o){for(e=0;n;)e+=p.delete(a[--n]);for(;o;)e+=p.insert(b[--o]);return e}for(m=[],m[0]=0,d=1;d<=o;++d)m[d]=m[d-1]+p.insert(b[d-1]);for(c=1;c<=n;++c)for(k=m[0],m[0]+=p.delete(a[c-1]),d=1;d<=o;++d)l=m[d],a[c-1]==b[d-1]?m[d]=k:(f=m[d-1]+p.insert(b[d-1]),g=m[d]+p.delete(a[c-1]),h=k+p.replace(a[c-1],b[d-1]),m[d]=f<g?f:g<h?g:h),k=l;return e=m[o],e};
function getByName(name) {
  for (const monster of monsters) {
    if (monster.name.toLowerCase() == (name.toLowerCase())) {
      return monster;
    }
  }
  // for (const monster of monsters) {
  //   if (monster.name.toLowerCase().includes(name.toLowerCase())) {
  //     return monster;
  //   }
  // }
  let minDist = Infinity;
  let selected;
  for (const monster of monsters) {
    let dist = stringDistance(name.toLowerCase(),monster.name.toLowerCase());
    if (monster.name.toLowerCase().startsWith(name.toLowerCase())) dist -= 100;
    if (dist < minDist) {
      minDist = dist;
      selected = monster;
    }
  }
  return selected;
}
function filterMisc(s) {
  return FILTERS[filterttt].includes(lower(s[filterttt]));
}