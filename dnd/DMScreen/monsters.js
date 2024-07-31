let monsterDatalist = "";
for (const monster of monsters) {
    monsterDatalist += `<option>${monster}</option>`;
}
document.getElementById("monstersDatalist").innerHTML = monsterDatalist;