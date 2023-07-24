const choose=o=>o[Math.floor(Math.random()*o.length)];
function start() {
  let final = [];let idealPool = JSON.parse(JSON.stringify(anyIdeal));
  alignment = document.getElementById("alignment").value;if (alignment==="Random") {alignment = choose(["Lawful Good","Neutral Good","Chaotic Good","Lawful Neutral","Neutral","Chaotic Neutral","Lawful Evil","Neutral Evil","Chaotic Evil"])}
  if (alignment.includes("Good")) idealPool.push(...goodIdeal);
  else if (alignment.includes("Evil")) idealPool.push(...evilIdeal);
  if (alignment.includes("Chaotic")) idealPool.push(...chaoticIdeal);
  else if (alignment.includes("Lawful")) idealPool.push(...lawfulIdeal);
  if (alignment.includes("Neutral ")||alignment==="Neutral") idealPool.push(...neutralIdeal);
  final.push("Appearance: "+choose(appearance));
  final.push("High Ability Score&emsp;: "+choose(highScore));
  final.push("Low Ability Score: "+choose(lowScore));
  final.push("Talent: "+choose(talents));
  final.push("Mannerism: "+choose(mannerisms));
  final.push("Interaction Traits: "+choose(interactions));
  final.push("Alignment: "+alignment);
  final.push("Ideal: "+choose(idealPool));
  if (choose([0,0,0,0,0,0,0,0,0,1]) === 1) {const b1 = choose(bonds2);let b2 = choose(bonds2);while (b1===b2) {b2 = choose(bonds2);};final.push("Bond: "+b1);final.push("Bond: "+b2);}
  else {final.push("Bond: "+choose(bonds2));}
  final.push("Flaw: "+choose(secrets));
  final = final.map(function (a) {return "<td>"+a.split(": ").join("</td><td>")+"</td>"});
  document.getElementById("output").innerHTML = "<table><tr>"+final.join("</tr><tr>")+"</tr></table>";
}