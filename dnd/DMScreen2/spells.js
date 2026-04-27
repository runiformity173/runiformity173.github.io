let spellDatalist = "";
for (const spell of spells) {
  spellDatalist += `<option>${spell}</option>`;
}
document.getElementById("spellsDatalist").innerHTML = spellDatalist;