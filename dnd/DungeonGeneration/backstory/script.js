function choose(o,a=null){
  let x = a?a:o[Math.floor(Math.random()*o.length)];
  try {
    x.includes("test");
  } catch {
    console.log(x)
  }
  if (x.includes("{cause of death}")) {
    x = x.replace("{cause of death}","")+"</td></tr><tr><td></td><td><table><tr><td>Cause of Death&emsp;</td><td>"+choose(causeOfDeath)+"</td></tr></table>"
  }
  if (x.includes("{war}")) {
    x = x.replace("{war}","")+"</td></tr><tr><td></td><td><table><tr><td>War&emsp;</td><td>"+choose(war)+"</td></tr></table>"
  }
  if (x.includes("{adventures}")) {
    x = x.replace("{adventures}","")+"</td></tr><tr><td></td><td><table><tr><td>Adventure&emsp;</td><td>"+choose(adventures)+"</td></tr></table>"
  }
  if (x.includes("{tragedies}")) {
    x = x.replace("{tragedies}","")+"</td></tr><tr><td></td><td><table><tr><td>Tragedy&emsp;</td><td>"+choose(tragedies)+"</td></tr></table>"
  }
  if (x.includes("{boons}")) {
    x = x.replace("{boons}","")+"</td></tr><tr><td></td><td><table><tr><td>Boon&emsp;</td><td>"+choose(boons)+"</td></tr></table>"
  }
  if (x.includes("{supernatural events}")) {
    x = x.replace("{supernatural events}","")+"</td></tr><tr><td></td><td><table><tr><td>Supernatural Event&emsp;</td><td>"+choose(supernaturalEvents)+"</td></tr></table>"
  }
  if (x.includes("{crime}")) {
    x = x.replace("{crime}","")+"</td></tr><tr><td></td><td><table><tr><td>Crime&emsp;</td><td>"+choose(crime)+"</td></tr></table>"
  }
  if (x.includes("{punishment}")) {
    x = x.replace("{punishment}","")+"</td></tr><tr><td></td><td><table><tr><td>Punishment&emsp;</td><td>"+choose(punishment)+"</td></tr></table>"
  }
  if (x.includes("{arcane matters}")) {
    x = x.replace("{arcane matters}","")+"</td></tr><tr><td></td><td><table><tr><td>Arcane Matters&emsp;</td><td>"+choose(arcaneMatters)+"</td></tr></table>"
  }
  if (x.includes("{weird stuff}")) {
    x = x.replace("{weird stuff}","")+"</td></tr><tr><td></td><td><table><tr><td>Weird Stuff&emsp;</td><td>"+choose(weirdStuff)+"</td></tr></table>"
  }
  if (x.includes("{class}")) {
    x = x.replace("{class}","")+"</td></tr><tr><td></td><td><table><tr><td>Class&emsp;</td><td>"+choose(classTable)+"</td></tr></table>"
  }
  if (x.includes("{life events}")) {
    x = x.replace("{life events}","")+"</td></tr><tr><td></td><td><table><tr><td>Future Event&emsp;</td><td>"+choose(lifeEvents)+"</td></tr></table>"
  }
  if (x.includes("{person}")) {
    x = x.replace("{person}","")+"</td></tr><tr><td></td><td><table><tr><td>Alignment&emsp;</td><td>"+choose2(alignment,"3d6")+"</td></tr>"+(!x.includes("adventurer")?"<tr><td>Occupation&emsp;</td><td>"+choose(occupation)+"</td></tr>":"<tr><td>Class&emsp;</td><td>"+choose(classTable)+"</td></tr>")+"<tr><td>Race&emsp;</td><td>"+choose(races)+"</td></tr>"+((!x.includes("enemy")&&!x.includes("friend"))?"<tr><td>Relationship&emsp;</td><td>"+choose(relationship)+"</td></tr>":"")+("<tr><td>Status&emsp;</td><td>"+choose2(statusTable,"3d6")+"</td></tr>")+"</table>"
  }
  return x;
}
//TODO add the d12 murder chance
function parseOptions(text) {
  let final = text;
  let mathRegex = /\[[^\[\]]+\]/g;
  let last = "";
  while (last !== final) {
    last = final;
  let matches = final.match(mathRegex);
  if (matches!==null) {
    for (let i = 0;i < matches.length; i++) {
      final = final.replace(matches[i],choose(matches[i].slice(1,-1).split("|")));
    }}
}
  return final;
}
function parseRolls(text) {
  let mathRegex = /\d+d\d+\s*\+*\s*\d*/g;
  let matches = text.match(mathRegex);
  let final = text;
  if (matches!==null) {
    for (let i = 0;i < matches.length; i++) {
      let t = matches[i].split("+");
      t.push("0");
      let new1 = [];
      t.forEach(function(d){new1.push(d.replace(" ",""))});
      t = roll(new1[0])+Number(new1[1]);
      if (matches[i].slice(-1)==" ") {
        t+=" ";
      }
      final = final.replace(matches[i],t);
    }}
  return final;
}
function roll(die) {
  if (die==0) {return 0}
  if (typeof(die)=="number"){return Math.floor(Math.random() * die) + 1}
  else{
    let t = die.split("d");
  let rolls = Number(t[0]);
    let q = t[1].includes("+")?t[1].split("+"):[t[1],0];
  let f = Number(q[0])
  let final = 0;
  for (let i = 0; i < rolls; i++) {
    final += roll(f);
  }
    return final+Number(q[1]);
  }
}
function choose2(o,rol) {
  let r = roll(rol)-1;
  r = r>o.length-1?o.length-1:(r<0?0:r);
  return o[r];
}
function start() {
  let temp = "";
  let final = [];
  let race = document.getElementById("race").value;
  let background = document.getElementById("background").value;
  let charClass = document.getElementById("class").value;
  let chaMod = document.getElementById("chaMod").value;
  if (race==="Random") {race = choose(races);final.push("Race: "+race)}
  if (background==="Random") {background = choose(backgrounds);final.push("Background: "+background)}
  let background2 = background.split(" ");
  background2[0] = background2[0].toLowerCase();
  background2 = background2.join("");
if (charClass==="Random") {charClass = choose(classTable);final.push("Class: "+charClass)}
  let charClass2 = charClass.toLowerCase();
  if (chaMod==="Random") {chaMod = choose(chaMods);final.push("Charisma Mod: "+(chaMod<0?chaMod:"+"+chaMod))}
 
  if (race==="Half-elf") final.push("Half-elf Parents: "+choose(halfElfParents))
  else if (race==="Half-orc") final.push("Half-orc Parents: "+choose(halfOrcParents))
  else if (race==="Tiefling") final.push("Tiefling Parents: "+choose(tieflingParents))
  final.push("Birthplace: "+choose(birthplace));
  let siblingNumber = roll(choose2([0,0,3,3,"1d4+1","1d4+1","1d6+2","1d6+2","1d8+3","1d8+3"],"1d10"+(["Dwarf","Elf"].includes(race)?"+-2":"")));
  siblingNumber = siblingNumber===0?"None":siblingNumber
  final.push("Siblings: "+siblingNumber);
  temp = choose(family);
  final.push("Family: "+temp);
  if (temp !== "Mother and father") {
    final.push("Absent Parent: "+choose(absentParent));
  }
  temp = choose2(familyLifestyle,"3d6");
  final.push("Family Lifestyle: "+temp);
  final.push("Childhood Home: "+choose2(childhoodHome,"1d100+"+({"Wretched":-40,"Squalid":-20,"Poor":-10,"Modest":0,"Comfortable":10,"Wealthy":20,"Aristocratic":40}[temp]-1)));
  final.push("Childhood Memories: "+choose2(childhoodMemories,"3d6+"+Number(chaMod)));
  if (background2!=="other") final.push(background+": "+choose(eval(background2)))
  if (charClass2!=="other") final.push(charClass+": "+choose(eval(charClass2)))
  let yourAge = choose(age);
  final.push("Age: "+roll(yourAge));
  let eventN = roll({"1d4+16":1,"1d10+20":4,"1d10+30":6,"1d10+40":8,"1d10+50":10,"1d20+60":12}[yourAge]);
  for (let i = 0;i<eventN;i++) {
    final.push(": ");
    final.push("Event #"+(i+1)+": "+choose(lifeEvents));
  }
  final = final.map(function (a) {return "<td>"+a.split(": ").join("&emsp;</td><td>")+"</td>"});
  document.getElementById("output").innerHTML = "<table><tr>"+parseRolls(parseOptions(final.join("</tr><tr>")))+"</tr></table>";
  if (document.getElementById("output").innerHTML.includes("indirectly")) {
    alert("WATCH OUT!");
  }
}