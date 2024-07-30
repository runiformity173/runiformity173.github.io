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
  "M":"medium",
  "L":"large",
  "H":"huge",
  "G":"gargantuan"
}
function load(mName) {
  if (!window.location.href.includes("?")) {return;}
  let ff = getByName(mName);
  document.getElementById("hiddenla").style.display = "none";
  document.getElementById("hiddenr").style.display = "none";
  document.getElementById("hiddenba").style.display = "none";
  document.getElementById("name").innerHTML = ff.name;
  const type = ff["type"];
  document.getElementById("meta").innerHTML = `${cap(sizeMap[ff.size])} ${type.type || type}${(type.tags?(" ("+type.tags.join(", ")+")"):"")}, ${alignmentString(ff.alignment)}`;
  let c = ff.ac;
  if (Array.isArray(c)) {
    c = c.map(o=>`${o.ac?o.ac:o}${o.from?(" ("+o.from+")"):""}${o.condition?(" "+o.condition):""}`).join(", ");
  }
  document.getElementById("ac").innerHTML = "<strong>Armor Class </strong>"+c;
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
    document.getElementById("skills").innerHTML += `<strong>Damage Resistances</strong> ${resistances.slice(2)}<br>`
  }
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
    document.getElementById("skills").innerHTML += `<strong>Damage Immunities</strong> ${immunities.slice(2)}<br>`
  }
  if (ff.conditionImmune) {
    let immunities = "";
    let last = false;
    for (const immunity of ff.conditionImmune) {
      if (immunity.immune) {
        alert("bad, condition immunity with condition");
        throw Error("yo");
      } else {
        immunities += (last?"; ":", ")+immunity;
      }
    }
    document.getElementById("skills").innerHTML += `<strong>Condition Immunities</strong> ${immunities.slice(2)}<br>`;
  }
  let senses = "";
  if (ff.senses) {
    senses = ff.senses.map(o=>o+", ");
  }
  senses += `passive Perception ${ff.passive}`;
  document.getElementById("skills").innerHTML += `<strong>Senses</strong> ${senses}<br>`;
  document.getElementById("skills").innerHTML += `<strong>Languages</strong> ${ff.languages?ff.languages.join(", "):"---"}<br>`;
  if (ff.cr) {
    document.getElementById("skills").innerHTML += `<strong>Challenge</strong> ${ff.cr}<br>`;
  }
  
  if (ff.trait) {
    let traitString = "";
    for (const trait of ff.trait) {
      traitString += `<p><em><strong>${trait.name}.</strong></em> ${entryJoin(trait.entries)}</p>`;
    }
    document.getElementById("abilities").innerHTML = `${traitString}`;
  }
  if (ff.spellcasting) {
    for (const spellcasting of ff.spellcasting) {
      let spellString = [];
      if (spellcasting.will) {
        spellString.push(`At will: <em>${spellcasting.will.join(", ")}</em>`);
      }
      for (let i = 0;i < 10;i++) {
        if ((spellcasting.spells||{})[String(i)]) {
          spellString.push(`${["Cantrips","1st","2nd","3rd","4th","5th","6th","7th","8th","9th"][i]} ${["(at will)","level ("+spellcasting.spells[i].slots+" slots)"][+(i>0)]}: <em>${spellcasting.spells[String(i)].spells.join(", ")}</em>`);
        }
      }
      for (let i = 1;i < 5;i++) {
        const s = (spellcasting.daily||{})[String(i)] || (spellcasting.daily||{})[String(i)+"e"];
        if (s) {
          spellString.push(`${i}/day each: <em>${s.join(", ")}</em>`);
        }
      }
      document.getElementById("abilities").innerHTML += `<p><em><strong>${spellcasting.name}.</strong></em> ${entryJoin(spellcasting.headerEntries)}</p><p>${spellString.join("<br>")}</p>`;
    }
  }
  if (ff.action) {
    let actionString = "";
    for (const action of ff.action) {
        actionString += `<p><em><strong>${action.name}.</strong></em> ${entryJoin(action.entries)}</p>`;
    }
    document.getElementById("actions").innerHTML = `${actionString}`;
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
  // document.getElementById("nall").src=ff["img_url"];
  document.getElementById("all").innerHTML = parseStrings(document.getElementById("all").innerHTML);
}
function recolorImage(img, oldRed, oldGreen, oldBlue, newRed, newGreen, newBlue) {

    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var w = img.width;
    var h = img.height;

    c.width = w;
    c.height = h;
    // draw the image on the temporary canvas
    ctx.drawImage(img, 0, 0, w, h);
    // pull the entire image into an array of pixel data
    var imageData = ctx.getImageData(0, 0, w, h);

    // examine every pixel, 
    // change any old rgb to the new-rgb
    for (var i = 0; i < imageData.data.length; i += 4) {
        // is this pixel the old rgb?
        if (imageData.data[i] == oldRed &&
            imageData.data[i + 1] == oldGreen &&
            imageData.data[i + 2] == oldBlue
        ) {
            // change to your new rgb
            imageData.data[i] = newRed;
            imageData.data[i + 1] = newGreen;
            imageData.data[i + 2] = newBlue;
            imageData.data[i + 3] = 0;
        }
    }
    // put the altered data back on the canvas  
    ctx.putImageData(imageData, 0, 0);
    // put the re-colored image back on the image
    var img1 = document.getElementById("nall");
    img1.src = c.toDataURL('image/png');

}
function cap(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
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
  "{@h}":"<em>Hit:</em> ",
  "{@recharge}":"(Recharge 6)",
}
function parseStrings(str) {
  if (typeof str === 'string' || str instanceof String) {
    const regex = /\{@[^\s}]+(?:\s+([^|}]+)(?:\s*\|[^}]+)?)?\}/g;
    return str.replace(regex, function(match, item){
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
      if (match.split(" ")[0] === "{@spell") {
        const spell = match.slice(8,-1);
        return `<a href="https://runiformity173.github.io/dnd/SpellSearch/display/?spell=${spell.replaceAll(" ","-")}" target="_blank">${spell}</a>`;
      }
      let final = item.trim();
      const splat = match.split("|");
      if (splat.length == 3) {
        final = splat[splat.length-1].replace(/[{}]/g,"").trim();
      }
      return final;
    });
  } else if (typeof str === 'object' && !Array.isArray(str) && str !== null) {
    return str.roll.exact;
  }
  return str;
}
function entryJoin(entries) {
  return entries.join("<br><span class='tab'></span>")
}
// Beholder, Brass Dragon Wyrmling
// List attacks