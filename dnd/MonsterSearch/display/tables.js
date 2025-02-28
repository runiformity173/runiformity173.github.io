const INDENT = "<div class='indentation'></div>";
function loadTable(box,table) {
  if (table.colLabels) {
    const t = parseStrings(table.colLabels[0],false);
    if (t != table.colLabels[0]) {table.colLabels[0] = t;}
  }
  if (!table.colStyles) {
    table.colStyles = table.rows[0].map(o=>"");
  }
  document.querySelector(`#${box.id} .tableName`).innerHTML = table.caption;
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
          finalBody += `<td class="${table.colStyles[i]}">${parseStrings2(table.rows[j][i])}</td>`;
          break;
        case "row-indent-first":
          finalBody += `<td class="${table.colStyles[i]}">${i==0?INDENT:""}${parseStrings2(table.rows[j].row[i])}</td>`;
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
    f.classList.add("rollLink");
  }
}
function parseStrings2(str,rollLiterals=true) {
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
        final = `<a class='rollLink' href='https://runiformity173.github.io/dnd/SpellSearch/display/?spell=${final.replaceAll(' ','-')}' target='_blank'>${final}</a>`
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
  // console.log(selected);
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
      // if (row.children.length < 3) alert(row.lastElementChild.innerHTML.replaceAll(/<[^>]*>/g,""));
    } else if (row.classList.contains("selectedRow")) {
      row.classList.remove("selectedRow");
    }
  }
}
function rollDiceGlobal(dice) {
  alert(roll(dice));
}