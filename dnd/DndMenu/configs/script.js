function nameSort(a,b) {
  let final = ((a["level"]||0) + a["name"]);
  let final2 = ((b["level"]||0) + b["name"]);
  return final>final2?1:(final<final2?-1:0);
}

function fromName(l) {
  return l.replaceAll("-"," ").replaceAll("%27","'")
}

function set2(name,value) {
  setCookie(name,JSON.stringify(value));
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
function eraseCookie(name) {   
    document.cookie = name +'=""; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function load() {
  if (window.location.href.includes("?")) {
    let levels = [];
    if (document.getElementById("output").innerHTML == "You have no spellbooks yet.") {document.getElementById("output").innerHTML = "";}
    let vv = JSON.parse(getCookie(window.location.href.split("?list=")[1])).sort(nameSort);
    for (const spell in vv) {
      if (!levels.includes(vv[spell]["level"])) {levels.push(vv[spell]["level"]);document.getElementById("output").innerHTML += ("<br>"+{"0":"Cantrips","1":"1st-level","2":"2nd-level","3":"3rd-level","4":"4th-level","5":"5th-level","6":"6th-level","7":"7th-level","8":"8th-level","9":"9th-level"}[String(vv[spell]["level"])]+"<br>")}
      document.getElementById("output").innerHTML += "<a target='_blank' href='"+vv[spell]["linkd"]+"'>"+vv[spell]["name"]+"</a>&emsp;<span class='remove no-select' onclick='if (confirm(\"Are you sure you want to remove this spell?\")){removeSpell(\""+vv[spell]["linkd"]+"\");}'><p>‾</p></span><br>";
    }
    
  }
  else {
    for (let l of document.cookie.split(";")) {
      
      if (!l.includes("_") && l.includes("=")) {
        if (document.getElementById("output").innerHTML == "You have no configurations yet.") {
          document.getElementById("output").innerHTML = "";
        }
        console.log("ok");
        document.getElementById("output").innerHTML += '<a>'+fromName(l.split("=")[0])+'</a>&emsp;<span class=\'remove no-select\' onclick=\'if (confirm(\"Are you sure you want to remove this configuration?\")){removeList("'+l.split("=")[0].replaceAll(" ","")+'");}\'><p>-</p></span><br>';}
    }
     document.getElementById("output").innerHTML += '<center><span class=\'add no-select\' onclick=\'newConfig()\'><p>+</p></span></center><br>';
  }
}

function newConfig() {
  let name = prompt("What would you like this config's name to be?").toLowerCase().replaceAll(" ","-");
  let final = [];
  const dd = {
    "Spell Search & Spellbook":"https://dndspellsearch.ezhgamer173.repl.co",
    "Advantage and Downtime Chance":"https://dndadvantagechance.ezhgamer173.repl.co",
    "Feat Search":"https://dndfeatsearch.ezhgamer173.repl.co",
    // "Monster Search":"https://dndmonstersearch.ezhgamer173.repl.co",
    "Dungeon, Settlement, and Map Generation":"https://dungeongenerator.ezhgamer173.repl.co",
    "Cave Generator":"https://cavegenerator.ezhgamer173.repl.co",
    "Encounter Balancer":"https://dndencounterbalancer.ezhgamer173.repl.co",
    "Treasure and Encounter Tables":"https://dndtables.ezhgamer173.repl.co",
    "Enchanted Weapon Generator":"https://dnd-weapon-generator.ezhgamer173.repl.co/",
    // "Loot Generator":"https://randomgen.ezhgamer173.repl.co/?gen=loot.txt&amount=7",
    // "Weapon & Party Generator":"https://nested.ezhgamer173.repl.co",
    // "Battle Simulator":"https://dndbattlesimulator.ezhgamer173.repl.co",
    "Name Generator":"https://dndnametables.ezhgamer173.repl.co",
    "NPC/Backstory Generator":"https://dungeongeneration.ezhgamer173.repl.co/npc/"
  };
  for (let c in dd) {
    if (confirm("Would you like "+c+" to be in this config?")) {
      final.push(dd[c]);
    }
  }
  if (final.length > 0) {setCookie(name,JSON.stringify(final))};
  location.reload();
}

function removeSpell(spell2) {
  let spelll = spell2;
  let vv = JSON.parse(getCookie(window.location.href.split("?list=")[1])).sort(nameSort);
  let final = [];
    for (const spell in vv) {
      if (vv[spell]["linkd"] != spelll) {
        final.push(vv[spell]);
      }
      
    }
  setCookie(window.location.href.split("?list=")[1],JSON.stringify(final))
location.reload();
}
function removeList(spell2) {
  eraseCookie(spell2);
  // let final = [];
  //   for (const spell in vv) {
      
  //     if (vv[spell]["linkd"] != spelll) {
  //       console.log(vv[spell]["linkd"],spelll);
  //       final.push(vv[spell]);
  //     }
      
  //     console.log(vv[spell]);
  //   }
  // setCookie(window.location.href.split("?list=")[1],JSON.stringify(final))
  location.reload();
}