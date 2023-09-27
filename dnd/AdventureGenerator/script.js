let choose = o=>o[Math.floor(Math.random()*o.length)];
function parseOptions(e){let t=e;var r=/\[[^\[\]]+\]/g;let n="";for(;n!==t;){n=t;let l=t.match(r);if(null!==l)for(let e=0;e<l.length;e++)t=t.replace(l[e],choose(l[e].slice(1,-1).split("|")))}return t}

function start(toGenerate) {
  let isATable = true;
  let final = [];
  if (toGenerate === "Villain") {
    final.push(["Villain",choose(villains)]);
    final.push(["Villain's Scheme",choose(villainScheme)]);
    final.push(["Villain's Methods",choose(villainMethods)]);
    final.push(["Villain's Weakness",choose(villainWeakness)]);
  } else if (toGenerate === "Side Quest") {
    isATable = false;
    final = choose(sideQuests);
  } else if (toGenerate === "Twist") {
    isATable = false;
    final = choose(twists);
  } else if (toGenerate === "Framing Event") {
    isATable = false;
    final = choose(framingEvents);
  } else if (toGenerate === "Moral Quandary") {
    isATable = false;
    final = choose(moralQuandaries);
  } else if (toGenerate === "Location-Based Adventure") {
    const okBoomer = Math.floor(Math.random()*4);
    const wilderness = okBoomer==1;
    const other = okBoomer==0;
    final.push([(wilderness?"Wilderness Goal":(other?"Other Goal":"Dungeon Goal")),(wilderness?choose(wildernessGoals):(other?choose(otherGoals):choose(dungeonGoals)))]);
    final.push(["Villain",choose(villains)]);
    final.push(["Villain's Scheme",choose(villainScheme)]);
    final.push(["Villain's Methods",choose(villainMethods)]);
    final.push(["Villain's Weakness",choose(villainWeakness)]);
    final.push(["Ally",choose(allies)]);
    final.push(["Patron",choose(patrons)]);
    final.push(["Introduction",choose(adventureIntroduction)]);
    final.push(["Climax",choose(adventureClimax)]);
  } else if (toGenerate === "Event-Based Adventure") {
    final.push(["Villain",choose(villains)]);
    final.push(["Villain's Scheme",choose(villainScheme)]);
    final.push(["Villain's Methods",choose(villainMethods)]);
    final.push(["Villain's Weakness",choose(villainWeakness)]);
    final.push(["Actions",choose(eventVillainActions)]);
    final.push(["Goals",choose(eventGoals)]);
    
  } 
  document.getElementById("output").innerHTML = isATable?parseOptions("<table><tr><td>"+final.map(o=>o[0]+"&emsp;</td><td>"+o[1]).join("</td></tr><tr><td>")+"</td></tr></table>"):parseOptions(final);
}