const choose=o=>o[Math.floor(Math.random()*o.length)];
function start() {
  let buildingType = {"Settlement":"settlement","Residence":"residence","Shop":"shop","Tavern":"tavern","Building":"random","Warehouse":"warehouse","Religious":"religious"}[document.getElementById("choice").value];
  if (buildingType==="random") {buildingType = choose(["residence","residence","residence","residence","residence","residence","residence","residence","residence","residence","religious","religious","tavern","tavern","tavern","warehouse","warehouse","shop","shop","shop"]);}
  let final = [];
  if (buildingType==="settlement") {final.push("Ruler's Status: "+choose(rulerStatus));final.push("Notable Trait: "+choose(traits));final.push("Known for its...: "+choose(knowns));final.push("Current Calamity&emsp;: "+choose(calamities))}
  else if (buildingType==="tavern") {final.push(choose(tavern));final.push(choose(tavernFirst)+" "+choose(tavernSecond));}
  else {final.push(choose(eval(buildingType)));}
  final = final.map(function (a) {return "<td>"+a.split(": ").join("</td><td>")+"</td>"});
  document.getElementById("output").innerHTML = buildingType[0].toUpperCase()+buildingType.slice(1)+"<table><tr>"+final.join("</tr><tr>")+"</tr></table>";
}