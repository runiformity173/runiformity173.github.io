let level = 0;
function validURL(a) {
  for (const v of a.toLowerCase().split("")) {
    if (!("abcdefghijklmnopqrstuvwxyz0123456789-.".includes(v))) {
      return false;
    }
  }
  return true;
}
function set2(name,value) {
  setCookie(name,JSON.stringify(value))
}
function get2(name) {
  return JSON.parse(getCookie(name))
}
function setCookie(name,value) {
  const days = 50000;
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const sizeMap = {
  "T":"tiny",
  "S":"small",
  "SM":"small or Medium",
  "M":"medium",
  "L":"large",
  "H":"huge",
  "HG":"huge or Gargantuan",
  "G":"gargantuan"
}
window.addEventListener("hashchange",function(e) {
  load(window.location.href.split(`#`)[1].replaceAll(`--`,`ayo what is this?`).replaceAll(`-`,` `).replaceAll(`%27`,`'`).replaceAll(`ayo what is this?`,`-`))
})
function load(mName) {
  if (!window.location.href.includes("#")) {return;}
  let ff = getByName(mName);
  document.getElementById("hiddenla").style.display = "none";
  document.getElementById("hiddenr").style.display = "none";
  document.getElementById("hiddenba").style.display = "none";
  document.getElementById("name").innerHTML = ff.name;
  const type = ff["type"];
  document.getElementById("meta").innerHTML = `${cap(sizeMap[ff.size instanceof String ? ff.size : ff.size.join("")])} ${type.type || type}${(type.tags?(" ("+type.tags.join(", ")+")"):"")}, ${alignmentString(ff.alignment)}`;
  let c = ff.ac;
  if (Array.isArray(c)) {
    c = c.map(o=>`${o.ac?o.ac:o}${o.from?(" ("+o.from+")"):""}${o.condition?(" "+o.condition):""}`).join(", ");
  }
  document.getElementById("ac").innerHTML = "<strong>Armor Class </strong>"+c;
  c = Math.floor(ff.dex/2)-5;
  if (ff.initiative) {
    if (ff.initiative.proficiency) {
      c += ff.initiative.proficiency * getProficiencyBonus(ff.cr.cr || ff.cr);
    } else {
      
    }
  }
  document.getElementById("initiative").innerHTML = "<strong>Initiative </strong>"+(c<0?"":"+")+c + " (" + (c+10) + ")";
  document.getElementById("hp").innerHTML = "<strong>Hit Points </strong>"+ff.hp.average + (ff.hp.formula?(` (${ff.hp.formula})`):"");
  let speeds = Object.entries(ff.speed).map(function(o) {
    if (o[1].number) {
      return `${o[0].replace("walk","")} ${o[1].number} ft. ${o[1].condition}`;
    }
    if (o[1] === !!o[1]) {
      return ""
    }
    return `${o[0].replace("walk","")} ${o[1]} ft.`;
  }).filter(o=>o).sort();
  document.getElementById("speed").innerHTML = "<strong>Speed </strong>"+speeds.join(", ");
  document.getElementById("str").innerHTML = `<strong>STR</strong><br><br>${ff.str} (${getAbilityScoreModifier(ff.str)})`;
  document.getElementById("dex").innerHTML = `<strong>DEX</strong><br><br>${ff.dex} (${getAbilityScoreModifier(ff.dex)})`;
  document.getElementById("con").innerHTML = `<strong>CON</strong><br><br>${ff.con} (${getAbilityScoreModifier(ff.con)})`;
  document.getElementById("wis").innerHTML = `<strong>WIS</strong><br><br>${ff.wis} (${getAbilityScoreModifier(ff.wis)})`;
  document.getElementById("int").innerHTML = `<strong>INT</strong><br><br>${ff.int} (${getAbilityScoreModifier(ff.int)})`;
  document.getElementById("cha").innerHTML = `<strong>CHA</strong><br><br>${ff.cha} (${getAbilityScoreModifier(ff.cha)})`;

 // for (let t of ["Saving Throws","Skills","Damage Vulnerabilities","Damage Resistances","Damage Resistance","Damage Immunities","Condition Immunities","Senses","Languages","Challenge"]) {
  //   for (let t of [""]) {
  //   if (t in ff) {
  //     document.getElementById("skills").innerHTML = document.getElementById("skills").innerHTML.replace("<btt>","<br>")
  //     document.getElementById("skills").innerHTML += ("<strong>"+t+" </strong>"+ff[t]+"<btt>");
  //   }
  // }
  document.getElementById("skills").innerHTML = "";
  if (ff.save) {
    const saves = Object.entries(ff.save).sort(saveSort).map(o=>`${cap(o[0])} ${o[1]}`);
    document.getElementById("skills").innerHTML += `<strong>Saving Throws</strong> ${saves.join(", ")}<br>`
  }
  if (ff.skill) {
    const skills = Object.entries(ff.skill).sort(skillSort).map(o=>`${cap(o[0])} ${o[1]}`);
    document.getElementById("skills").innerHTML += `<strong>Skills</strong> ${skills.join(", ")}<br>`
  }
  if (ff.resist) {
    let resistances = "";
    let last = false;
    for (const resistance of ff.resist) {
      if (resistance.resist) {
        let temp = "";
        for (let i = 0;i < resistance.resist.length;i++) {
          const r = resistance.resist[i];
          if (i === 0) {
            temp += r;
          } else if (i === resistance.resist.length-1) {
            temp += ", and "+r;
          } else {
            temp += ", "+r;
          }
        }
        resistances += "; "+temp+" "+resistance.note;
        last = true;
      } else {
        resistances += (last?"; ":", ")+resistance;
      }
    }
    document.getElementById("skills").innerHTML += `<strong>Resistances</strong> ${resistances.slice(2)}<br>`
  }
  let damageImmunityString = "";
  if (ff.immune) {
    let immunities = "";
    let last = false;
    for (const immunity of ff.immune) {
      if (immunity.immune) {
        let temp = "";
        for (let i = 0;i < immunity.immune.length;i++) {
          const r = immunity.immune[i];
          if (i === 0) {
            temp += r;
          } else if (i === immunity.immune.length-1) {
            temp += ", and "+r;
          } else {
            temp += ", "+r;
          }
        }
        immunities += "; "+temp+" "+immunity.note;
        last = true;
      } else {
        immunities += (last?"; ":", ")+immunity;
      }
    }
    damageImmunityString += immunities.slice(2);
  }
  let conditionImmunityString = "";
  if (ff.conditionImmune) {
    let immunities = "";
    let last = false;
    for (const immunity of ff.conditionImmune) {
      if (immunity.conditionImmune) {
        let temp = "";
        for (let i = 0;i < immunity.conditionImmune.length;i++) {
          const r = immunity.conditionImmune[i];
          if (i === 0) {
            temp += r;
          } else if (i === immunity.conditionImmune.length-1) {
            temp += ", and "+r;
          } else {
            temp += ", "+r;
          }
        }
        immunities += "; "+temp+" "+immunity.note;
        last = true;
      } else {
        immunities += (last?"; ":", ")+immunity;
      }
    }
    conditionImmunityString += immunities.slice(2);
  }
  if (ff.conditionImmune || ff.immune) {
    document.getElementById("skills").innerHTML += `<strong>Immunities</strong> ${ff.conditionImmune && ff.immune ? damageImmunityString + "; " + conditionImmunityString : (damageImmunityString || conditionImmunityString)}<br>`
  }
  if (ff.gear) {
    document.getElementById("skills").innerHTML += `<strong>Gear</strong> ${capAll(ff.gear.map(function(o) {
      return typeof o === "string" || o instanceof String ? o.split("|")[0] : o.item.split("|")[0] + " (" + o.quantity + ")";
    }).join(", "))}<br>`;
  }
  let senses = [];
  if (ff.senses) {
    senses = structuredClone(ff.senses);
  }
  senses.push(`passive Perception ${ff.passive}`);
  document.getElementById("skills").innerHTML += `<strong>Senses</strong> ${senses.join(", ")}<br>`;
  document.getElementById("skills").innerHTML += `<strong>Languages</strong> ${ff.languages?ff.languages.join(", "):"&horbar;"}<br>`;
  if (ff.cr) {
    if (ff.cr.cr) {
      document.getElementById("skills").innerHTML += `<strong>CR</strong> ${ff.cr.cr} (${ff.cr.xpLair} XP when in lair)<br>`;
    } else {
      document.getElementById("skills").innerHTML += `<strong>CR</strong> ${ff.cr}<br>`;
    }
  }
  
  if (ff.trait) {
    let traitString = "";
    for (const trait of ff.trait) {
      traitString += `<p><em><strong>${trait.name}.</strong></em> ${entryJoin(trait.entries)}</p>`;
    }
    document.getElementById("abilities").innerHTML = `${traitString}`;
  }
  if (ff.action) {
    let actionString = "";
    for (const action of ff.action) {
        actionString += `<p><em><strong>${action.name}.</strong></em> ${entryJoin(action.entries)}</p>`;
    }
    document.getElementById("actions").innerHTML = `${actionString}`;
  }
  if (ff.spellcasting) {
    for (const spellcasting of ff.spellcasting) {
      let spellString = [];
      if (spellcasting.will) {
        spellString.push(`At will: ${spellcasting.will.join(", ")}`);
      }
      for (let i = 0;i < 10;i++) {
        if ((spellcasting.spells||{})[String(i)]) {
          spellString.push(`${["Cantrips","1st","2nd","3rd","4th","5th","6th","7th","8th","9th"][i]} ${["(at will)","level ("+spellcasting.spells[i].slots+" slots)"][+(i>0)]}: ${spellcasting.spells[String(i)].spells.join(", ")}`);
        }
      }
      for (let i = 1;i < 5;i++) {
        const s = (spellcasting.daily||{})[String(i)] || (spellcasting.daily||{})[String(i)+"e"];
        if (s) {
          spellString.push(`${i}/day each: ${s.join(", ")}`);
        }
      }
      document.getElementById("actions").innerHTML += `<p><em><strong>${spellcasting.name}.</strong></em> ${entryJoin(spellcasting.headerEntries)}</p><p>${spellString.join("<br>")}</p>`;
    }
  }
  if (ff.legendary) {
    document.getElementById("hiddenla").style.display = "block";
    let legendaryString = "";
    for (const legendary of ff.legendary) {
      legendaryString += `<p><em><strong>${legendary.name}.</strong></em> ${entryJoin(legendary.entries)}</p>`;
    }
    document.getElementById("lactions").innerHTML = `${legendaryString}`;
  }
  if (ff.reaction) {
    document.getElementById("hiddenr").style.display = "block";
    let reactionString = "";
    for (const reaction of ff.reaction) {
        reactionString += `<p><em><strong>${reaction.name}.</strong></em> ${entryJoin(reaction.entries)}</p>`;
    }
    document.getElementById("reactions").innerHTML = `${reactionString}`;
  }
  if (ff.bonus) {
    document.getElementById("hiddenba").style.display = "block";
    let bactionString = "";
    for (const baction of ff.bonus) {
        bactionString += `<p><em><strong>${baction.name}.</strong></em> ${entryJoin(baction.entries)}</p>`;
    }
    document.getElementById("bactions").innerHTML = `${bactionString}`;
  }
  document.getElementById("environments").innerHTML = "";
  document.getElementById("treasure").innerHTML = "";
  if (ff.environment) document.getElementById("environments").innerHTML = "<strong>Habitat:</strong> " + formatEnvironments(ff.environment);
  if (ff.treasure) document.getElementById("treasure").innerHTML = "<strong>Treasure:</strong> " + capAll(ff.treasure.join(", "));
  document.getElementById("nall").src=`https://5e.tools/img/bestiary/tokens/${ff.source}/${ff.name}.webp`;
  document.getElementById("all").innerHTML = parseStrings(document.getElementById("all").innerHTML);
  loadFluff(mName);
}
function cap(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
function capAll(str) {
  return str.split(" ").map(cap).join(" ");
}
const alignmentMap = {
  "LG":"lawful good",
  "NG":"neutral good",
  "CG":"chaotic good",
  "LN":"lawful neutral",
  "N":"neutral",
  "CN":"chaotic neutral",
  "LE":"lawful evil",
  "NE":"neutral evil",
  "CE":"chaotic evil",
  "U":"unaligned",
  "A":"any alignment",
  "LNXCNYE":"any non-good alignment",
  "NXCGNYE":"any non-lawful alignment",
  "CGNYE":"any chaotic alignment",
  "LGNYE":"any lawful alignment",
  "LNXCE":"any evil alignment"
}
function alignmentString(str) {
  if (typeof str[0] == "string") {
    return alignmentMap[str.join("")];
  } else {
    if (str[0].special) {return str[0].special;}
    let temp = "";
    for (let i = 0;i < str.length;i++) {
      const r = `${alignmentMap[str[i].alignment.join("")]} (${str[i].chance}%)`;
      if (i === 0) {
        temp += r;
      } else if (i === str.length-1) {
        temp += " or "+r;
      } else if (i === 1) {
        temp += ", " + r + ",";
      } else {
        temp += " "+r + ",";
      }
    }
    return temp;
  }
  throw Error("Alignment isn't normal :')");
}
function getAbilityScoreModifier(as) {
  const final = Math.floor(as/2)-5;
  return (final<0?"":"+")+final
}
const crToProfBonusMap = {"0":2,"1":2,"2":2,"3":2,"4":2,"5":3,"6":3,"7":3,"8":3,"9":4,"10":4,"11":4,"12":4,"13":5,"14":5,"15":5,"16":5,"17":6,"18":6,"19":6,"20":6,"21":7,"22":7,"23":7,"24":7,"25":8,"26":8,"27":8,"28":8,"29":9,"30":9,"1/8":2,"1/4":2,"1/2":2};
function getProficiencyBonus(cr) {
  return crToProfBonusMap[cr];
}
const asIndex = {
  "Str":0,
  "Dex":1,
  "Con":2,
  "Int":3,
  "Wis":4,
  "Cha":5
}
function saveSort(a,b) {
  return asIndex[cap(a[0])] - asIndex[cap(b[0])];
}
function skillSort(a,b) {
  return a[0].localeCompare(b[0]);
}
const attackMatches = {
  "{@atk mw}":"<em>Melee Weapon Attack:</em> ",
  "{@atk rw}":"<em>Ranged Weapon Attack:</em> ",
  "{@atk mw,rw}":"<em>Melee or Ranged Weapon Attack:</em> ",
  "{@atk ms}":"<em>Melee Spell Attack:</em> ",
  "{@atk rs}":"<em>Ranged Spell Attack:</em> ",
  "{@atk ms,rs}":"<em>Melee or Ranged Spell Attack:</em> ",
  "{@atkr m}":"<em>Melee Attack Roll:</em> ",
  "{@atkr m,r}":"<em>Melee or Ranged Attack Roll:</em> ",
  "{@atkr r}":"<em>Ranged Attack Roll:</em> ",
  "{@actSave str}":"<em>Strength Saving Throw:</em> ",
  "{@actSave dex}":"<em>Dexterity Saving Throw:</em> ",
  "{@actSave con}":"<em>Constitution Saving Throw:</em> ",
  "{@actSave int}":"<em>Intelligence Saving Throw:</em> ",
  "{@actSave wis}":"<em>Wisdom Saving Throw:</em> ",
  "{@actSave cha}":"<em>Charisma Saving Throw:</em> ",
  "{@h}":"<em>Hit:</em> ",
  "{@m}":"<em>Miss:</em> ",
  "{@hom}":"<em>Hit or Miss:</em> ",
  "{@recharge}":"(Recharge 6)",
  "{@actSaveFail}":"<em>Failure:</em>",
  "{@actSaveSuccess}":"<em>Success:</em>",
  "{@actSaveSuccessOrFail}":"<em>Failure or Success:</em>",
  "{@actTrigger}":"<em>Trigger:</em>",
  "{@actResponse}":"<em>Response:</em>",
}
function formatEnvironments(environments) {
  let final = [];
  for (const env of environments) {
    if (env.includes(",")) {
      final.push(cap(env.split(", ")[0]) + " (" + cap(env.split(", ")[1]) + ")")
    } else {
      final.push(cap(env));
    }
  }
  return final.join(", ");
}
function parseStrings(str) {
  if (typeof str === 'string' || str instanceof String) {
    const regex = /\{@[^\s}]+(?:\s+([^|}]+)(?:\s*\|[^}]+)?)?\}/g;
    return str.replace(regex, function(match, item){
      // console.log(match);
      if (match in attackMatches) {
        return attackMatches[match];
      }
      if (match.split(" ")[0] === "{@hit") {
        const num = Number(match.slice(6,-1));
        return (num<0?"":"+")+num;
      }
      if (match.split(" ")[0] === "{@recharge") {
        const num = Number(match.slice(11,-1));
        return `(Recharge ${num}${num<6?"-6":""})`;
      }
      if (match.split(" ")[0] === "{@dc") {
        const num = Number(match.slice(5,-1));
        return `DC ${num}`;
      }
      if (match.split(" ")[0] === "{@i") {
        const num = match.slice(4,-1);
        return `<em style="font-size:100%;">${num}</em>`;
      }
      if (match.split(" ")[0] === "{@spell") {
        const spell = match.slice(8,-1).split("|")[0];
        return `<a href="https://runiformity173.github.io/dnd/SpellSearch2024/display/?spell=${spell.replaceAll(" ","-")}" target="_blank">${spell}</a>`;
      }
      if (match.split(" ")[0] === "{@creature") {
        const creature = match.slice(11,-1);
        return `<a href="#${creature.replaceAll(" ","-")}" target="_blank">${creature}</a>`;
      }
      let final = item.trim();
      const splat = match.split("|");
      if (splat.length == 3) {
        final = splat[splat.length-1].replace(/[{}]/g,"").trim();
      }
      return final;
    }).replaceAll("–","-").replaceAll("―","&horbar;").replaceAll("—","&horbar;").replaceAll("−","-");
  } else if (typeof str === 'object' && !Array.isArray(str) && str !== null) {
    return str.roll.exact;
  }
  return str;
}
function entryJoin(entries) {
  return entries.map(multiEntry).join("<br><span class='tab'></span>")
}
function multiEntry(i) {
  if (!i.items) return i;
  let final = "";
  for (const entry of i.items) {
    final += `<br><span class='tab'></span><em>${entry.name}.</em> ${entry.entries?entryJoin(entry.entries):entry.entry}`;
  }
  return final;
}
function loadFluff(mn) {
  const monsterName = getByName(mn).name;
  let fluff = monsterFluff[monsterName.replaceAll(" ","-").toLowerCase()];
  document.getElementById("name2").innerHTML = "";
  document.getElementById("miniDescription").innerHTML = "";
  let tableCounter = 1;
  if (fluff?._copy?._mod?.entries?.items) {
    let final = "";
    const entries = fluff._copy?._mod?.entries?.items[0].entries;
    for (const i of entries) {
      if (typeof i === 'string' || i instanceof String) {
        final += i + "<br>"
      } else {
        console.log(i);
      }
    }
    document.getElementById("miniDescription").innerHTML = final;
    document.getElementById("name2").innerHTML = fluff.name;
    fluff = monsterFluff[fluff._copy.name.toLowerCase().replaceAll(" ","-")];
  }
  if (fluff.entries) {
    document.getElementById("name3").innerHTML = fluff.name;
    const entries = fluff.entries[0].entries;
    document.getElementById("monsterDescription").innerHTML = entries[0];
    document.getElementById("fluff").innerHTML = "";
    for (const i of entries) {
      if (typeof i === 'string' || i instanceof String) {
        if (i.slice(0,3) == "{@i") continue;
        document.getElementById("fluff").innerHTML += `<p>${i}</p>`;
      } else if (i.type == "table") {
        const j = document.createElement("div");
        document.getElementById("fluff").appendChild(j);
        j.appendChild(document.getElementById("tableTemplate").content.cloneNode(true));
        j.id = "table"+tableCounter++;
        j.classList.add("tableContainer");
        loadTable(j,i);
      }else {
        console.log(i);
      }
    }
  }
  document.getElementById("info").innerHTML = parseStrings(document.getElementById("info").innerHTML);
  for (const f of document.getElementsByClassName("rollLink")) {
    f.addEventListener("click",function(){rollTable(f.closest(".tableContainer"),f.innerHTML);});
  }
}

function searchMonsters() {
  const final = {};
  for (const i in monsterData) {
    const ff = monsterData[i];
    for (const j of ff.environment) {
      if (!(j in final)) {final[j] = i;}
    }
  }
  return final;
}

function searchFluff() {
  for (const i in monsterFluff) {
    const ff = monsterFluff[i];
    if (ff.entries) {
      try {
      if (!ff.entries[0].entries[0].includes("{@i")) console.log(i);
      } catch {
        console.log(ff.entries)
      }
    } else if (ff._copy?._mod?.entries?.items) {
      if (ff._copy?._mod?.entries?.items[0].entries.length != 1) console.log(i);
    } else {
      // console.log(i);
    }
  }
}

function testMonsters() {
  for (const i in monsterData) {
    console.log(i);
    load(i)
  }
}
