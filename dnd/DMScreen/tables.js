function filterTables() {
  return tables.table.filter(o=>["Screen","ScreenDungeonKit","ScreenWildernessKit","DMG","XGE","TCE","VGM","PHB","XPHB","XDMG"].includes(o.source));
}
const data = {};
for (const i of filterTables()) {
  document.getElementById("tablesDatalist").innerHTML += `<option>${i.name} (${i.source})</option>`;
  data[i.name] = i;
  if (i.colLabels) {
    const t = parseStrings(i.colLabels[0],false);
    if (t != i.colLabels[0]) {i.colLabels[0] = t;}
  }
  if (!i.colStyles) {
    i.colStyles = i.rows[0].map(o=>"");
  }
}
const INDENT = "<div class='indentation'></div>";
function loadTable(box,name) {
  const table = data[name];
  document.querySelector(`#${box.id} .tableName`).innerHTML = table.name;
  // document.querySelector(`#${box.id} .tableCaption`).innerHTML = table.caption;
  let finalHeaders = "";
  let rollable = false;
  for (let i = 0;i<(table.colLabels||[]).length;i++) {
    if (i == 0 && isDice(table.colLabels[i])) rollable = true; 
    finalHeaders += `<th class="${table.colStyles[i]}">${table.colLabels[i]}</th>`;
  }
  document.querySelector(`#${box.id} .tableLabels`).innerHTML = finalHeaders;
  let finalBody = "";
  for (let j = 0;j < table.rows.length;j++) {
    let style = "";
    if (table.rows[j].style) {
      if (table.rows[j].type != "row") {
        alert(`not a row, wdym: ${name}[${j}]`);
        return;
      } if (table.rows[j].style != "row-indent-first") {
        alert(`not a row-indent-first: ${name}[${j}]`);
        return;
      }
      style = table.rows[j].style;
    }
    finalBody += "<tr>";
    for (let i = 0;i<table.colStyles.length;i++) {
      switch (style) {
        case "":
          finalBody += `<td class="${table.colStyles[i]}">${parseStrings(table.rows[j][i])}</td>`;
          break;
        case "row-indent-first":
          finalBody += `<td class="${table.colStyles[i]}">${i==0?INDENT:""}${parseStrings(table.rows[j].row[i])}</td>`;
          break;
        default:
          alert("defaulting on row style, very bad");
          break;
      }
    }
    finalBody += "</tr>";
  }
  document.querySelector(`#${box.id} .tableBody`).innerHTML = finalBody;
  if (rollable) {
    const f = document.querySelector(`#${box.id} .tableLabels`).firstElementChild;
    f.addEventListener("click",function(){rollTable(f.closest(".box"),f.innerHTML);});
    f.classList.add("rollLink");
  }
}
function parseStrings(str,rollLiterals=true) {
  if (typeof str === 'string' || str instanceof String) {
    const regex = /\{@[^\s]+\s+([^|}]+)\s*\|?[^}]*\}/g;
    return str.replace(regex, function(match, item){
      let final = item.trim();
      if (!rollLiterals) {return final;}
      if (match.includes("@dice")) {
        final = `<span onclick='rollDiceGlobal("${final}")' class='rollLink'>${final}</span>`
      } else if (match.includes("@creature")) {
        final = `<a class='rollLink' href='https://runiformity173.github.io/dnd/MonsterSearch/display/#${final.replaceAll(' ','-')}' target='_blank'>${final}</a>`
      } else if (match.includes("@spell")) {
        final = `<a class='rollLink' href='https://runiformity173.github.io/dnd/SpellSearch2024/display/?spell=${final.replaceAll(' ','-')}' target='_blank'>${final}</a>`
      } else {
        const splat = match.split("|");
        if (splat.length == 3) {
          final = splat[splat.length-1].replace(/[{}]/g,"").trim();
        }
      }
      return final;
    });
  } else if (typeof str === 'object' && !Array.isArray(str) && str !== null) {
    return str.roll.exact;
  }
  return str;
}
function isDice(str) {
  return /^\d*d\d+(\s?\+\s?\d*d\d+)*$/.test(str);
}
function roll(dice) {
  let total = 0;
  if (dice.includes("+")) {
    for (const e of dice.split("+")) {
      total += roll(e.trim());
    }
    return total;
  }
  if (!dice.includes("d")) {return Number(dice);}
  let mult;
  if (dice.includes("×")) {
    [dice,mult] = dice.split("×");
  }
  let [n,d] = dice.split("d");
  if (n === "") {n = 1;}
  else {n = Number(n);}
  d = Number(d);
  for (let i = 0;i < n;i++) {
    total += Math.floor(Math.random()*d)+1
  }
  return total*(mult||"1").replace(",","");
}
function rollTable(box,die) {
  const body = document.querySelector(`#${box.id} .tableBody`).children;
  const selected = roll(die);
  console.log(selected);
  for (const row of body) {
    const i = row.firstElementChild.innerHTML.replace("00","100");
    let correct = false;
    if (i.includes("-")) {
      let [lower,upper] = i.split("-");
      correct=(Number(lower)<=selected&&Number(upper)>=selected);
    } else {
      correct = String(selected) == i;
    }
    if (correct) {
      row.classList.add("selectedRow");
      if (row.children.length < 3) alert(row.lastElementChild.innerHTML.replaceAll(/<[^>]*>/g,""));
    } else if (row.classList.contains("selectedRow")) {
      row.classList.remove("selectedRow");
    }
  }
}
function rollDiceGlobal(dice) {
  alert(roll(dice));
}
const EPSILON = 1e-9;
function fractionApprox(dec) {
  let num = 0,denom = 1,best=2,bestNum=0,bestDenom=1;
  while (denom < 1000) {
    if (num/denom-dec > EPSILON) {denom++;}
    else if (Math.abs(num/denom-dec) <= EPSILON) {break;}
    else {num++;}
    if (Math.abs(num/denom-dec) < best) {best=Math.abs(num/denom-dec),bestNum=num,bestDenom=denom}
  }
  if (Math.abs(num/denom-dec) > Math.abs((num+1)/denom-dec))
    num++;
  else if (Math.abs(num/denom-dec) > Math.abs((num-1)/denom-dec))
    num--;
  if (Math.abs(num/denom-dec) < best) {best=Math.abs(num/denom-dec),bestNum=num,bestDenom=denom}
  const final = bestNum + "/" + bestDenom;
  return `${dec}, about ${final}`
}
function getDiceProbability(dice,target) {
  const convolve=(a,b)=>{const c=a,d=b;let e=0;const f=[];for(let g=0;g<c.length;g++){for(let a=0;a<d.length;a++)e+a===f.length?f.push(c[g]*d[a]):f[e+a]=f[e+a]+c[g]*d[a];e++}return f};
  const expressions = dice.split("+").map(o=>o.trim());
  const exps = [];
  let bonus = 0;
  for (const i of expressions) {
    if (i.includes("d")) {
      let [n,d] = i.split("d");
      for (var j = Number(n||"1");j > 0;j--) {
        exps.push(Number(d));
      }
    } else bonus += Number(i)
  }
  bonus += exps.length;
  last = Array.from({length:exps[0]},o=>1);
  for (let i = 1;i<exps.length;i++) {
    last = convolve(last,Array.from({length:exps[i]},o=>1));
  }
  let successes = 0;
  let total = 0;
  for (let i = 0;i<last.length;i++) {
    const w = last[i];
    if (i+bonus >= target) {
      successes += w;
    }
    total += w;
  }
  return fractionApprox(successes/total);
}
function testDie(die,times=100000) {
  total = 0;
  for (let i = 0;i<times;i++) {
    total += roll(die);
  }
  return total / times;
}

function searchTables() {
  for (const table of tables.table) {
    if (!table.colLabels) {continue;}
    if (isDice(table.colLabels[0])) {
      let f = false;
      for (const row of table.rows) {
        if (typeof row[0] === 'object' && !Array.isArray(row[0]) && row[0] !== null) {
          f = true;
          break;
        }
      }
      if (f) {
        console.log(table.name);
      }
    }
  }
}