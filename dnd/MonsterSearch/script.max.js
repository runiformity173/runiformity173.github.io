const DEBUG = true;
let FILTERS = {
  "level":[],
  "type":[]
};
let filterttt = "";
function getNeutral(a) {
  if (!a.includes("N")) return a;
  if (a.length == 1 && a[0] == "N") return ["NX","NY"]
  return [...a,(a.includes("C") || a.includes("L"))?"NY":"NX"]
}
let monsters = Object.values(monsterData).map(o=>{
  o.alignment2 = [];
  if (o.alignment.includes("A")) {
    o.alignment2.push("NX","NY","G","E","C","L");
  }
  else {
    if (o.alignment[0].alignment) {
      for (const i of o.alignment) {
        o.alignment2.push(...getNeutral(i.alignment));
      }
      o.alignment2 = Array.from(new Set(o.alignment2));
    } else {
      o.alignment2 = getNeutral(o.alignment);
    }
  }
  return o;
});
function lower(s) {
  if (typeof s != "string") {return s;}
  return s.toLowerCase();}
function checkAll(arg,c) {
  let l = document.getElementsByClassName(arg);
  for (const i of l) {
    i.checked = c.checked;
    i.indeterminate = c.indeterminate;
    if (i.classList.contains("indeterminate") != c.classList.contains("indeterminate")) {
      if (i.classList.contains("indeterminate")) {
        i.classList.remove("indeterminate");
      } else {
        i.classList.add("indeterminate");
      }
    }
  }
}
function start() {
  monsters = Object.values(monsterData);
  console.clear();
  FILTERS = {"level":[],"type":[],"yesSpeed":[],"noSpeed":[],"yesSense":[],"noSense":[],"yesAlignment":[],"noAlignment":[]};
  levels = ["0","1/8","1/4","1/2","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];
  const [minValue,maxValue] = slider.noUiSlider.get();
  for (const i of levels) {
    if (eval(i).toFixed(2) <= parseFloat(maxValue) && eval(i).toFixed(2) >= parseFloat(minValue)){
      FILTERS["level"].push(i);
    }
  }
  for (const i of document.getElementsByClassName("speedCheckbox")) {
    let val = i.classList.contains("indeterminate")?undefined:i.checked?1:-1;
    if (val) {
      FILTERS[(val===1?"yes":"no")+"Speed"].push(i.nextElementSibling.innerHTML.toLowerCase());
    }
  }
  for (const i of document.getElementsByClassName("senseCheckbox")) {
    let val = i.classList.contains("indeterminate")?undefined:i.checked?1:-1;
    if (val) {
      FILTERS[(val===1?"yes":"no")+"Sense"].push(i.nextElementSibling.innerHTML.toLowerCase());
    }
  }
  for (const i of document.getElementsByClassName("alignmentCheckbox")) {
    let val = i.classList.contains("indeterminate")?undefined:i.checked?1:-1;
    if (val) {
      FILTERS[(val===1?"yes":"no")+"Alignment"].push(Array.from(i.id).filter(o=>o==o.toUpperCase()).join(""));
    }
  }
  types = ["Aberration","Beast","Celestial","Construct","Dragon","Elemental","Fey","Fiend","Giant","Humanoid","Monstrosity","Ooze","Plant","Undead"];
  for (i in types) {
    if (document.getElementById("type"+types[i]).checked) {
      FILTERS["type"].push(types[i].toLowerCase());
    }
  }
  // if (document.getElementById("ritual").checked) {
  //     FILTERS["ritual"].push(true);
  //   }
  // if (document.getElementById("books").checked) {
  //   ["Xanathar's","Tasha's","Fizban's","Guildmaster's"].forEach(l=>{FILTERS["book"].push(l);})
  // }
  DEBUG && console.log("INITIAL",monsters.length);
  monsters = monsters.filter(filterTypes);
  DEBUG && console.log("TYPES",monsters.length);
  monsters = monsters.filter(filterLevels);
  DEBUG && console.log("CRS",monsters.length);
  monsters = monsters.filter(filterSpeeds);
  DEBUG && console.log("SPEEDS",monsters.length);
  monsters = monsters.filter(filterSenses);
  DEBUG && console.log("SENSES",monsters.length);
  monsters = monsters.filter(filterAlignments);
  DEBUG && console.log("ALIGNMENTS",monsters.length);
  document.getElementById("output").innerHTML = "";
  monsters.sort(monsterSort);
  for (const f of monsters){
    const href = "display/#"+f["name"].toLowerCase().replaceAll("-","--").replaceAll(" ","-");
document.getElementById("output").innerHTML += `<a href="${href}" target="_blank">${f.name}</a> (${f.cr?f.cr.cr?f.cr.cr:f.cr:"None"})<br>`;

  }
}
function filterTypes(s) {
  for (const l of FILTERS["type"]) {
    const c = s["type"];
    if ((c.type||c).toLowerCase()===l.toLowerCase()) {
      return true;
    }
  }
  return false;
}
function filterSpeeds(s) {
  for (const l of FILTERS["yesSpeed"]) {
    if (!(l in s.speed)) return false;
  }
  for (const l of FILTERS["noSpeed"]) {
    if (l in s.speed) return false;
  }
  return true;
}
function filterSenses(s) {
  const senses = (s.senses||[]).join(",");
  for (const l of FILTERS["yesSense"]) {
    if (!senses.includes(l)) return false;
  }
  for (const l of FILTERS["noSense"]) {
    if (senses.includes(l)) return false;
  }
  return true;
}
function filterAlignments(s) {
  for (const l of FILTERS["yesAlignment"]) {
    if (!s.alignment2.includes(l)) return false;
  }
  for (const l of FILTERS["noAlignment"]) {
    if (s.alignment2.includes(l)) return false;
  }
  return true;
}
function filterLevels(s) {
  return FILTERS["level"].includes(s.cr?.cr?s.cr.cr:s.cr);
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
function monsterSort(a,b) {
  const res = levels.indexOf(a.cr?.cr?a.cr.cr:a.cr) - levels.indexOf(b.cr?.cr?b.cr.cr:b.cr);
  return res?res:(a.name.localeCompare(b.name));
}
function loadMainPage() {
  checkAll('typeCheckbox',document.getElementById('typeAll'));
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle=\'tooltip\']');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  const o = document.getElementById('speedAll');
  o.indeterminate = true;
  o.classList.add("indeterminate");
  
  [...document.getElementsByClassName("triCheckbox")].forEach(o=>{
    o.indeterminate = true;
    o.classList.add("indeterminate");
    o.addEventListener("click",function(e) {
      // e.preventDefault();
      // null to true
      if (e.currentTarget.classList.contains("indeterminate")) {
        e.currentTarget.classList.remove("indeterminate");
        e.currentTarget.indeterminate = false;
        e.currentTarget.checked = true;
      }
      // false to null
      else if (e.currentTarget.checked) {
        e.currentTarget.classList.add("indeterminate");
        e.currentTarget.indeterminate = true;
        e.currentTarget.checked = false;
      }
      // true to false
      else {
      }
    });
  });
}