let conditionDatalist = "";
for (const condition in conditions) {
    conditionDatalist += `<option>${condition}</option>`;
}
document.getElementById("conditionsDatalist").innerHTML = conditionDatalist;
function loadCondition(box, name) {
    if (name == "Exhaustion2") {
        [...box.querySelectorAll(`#${box.id} h2,#${box.id} p`)].forEach(o=>o.remove());
        box.appendChild(document.getElementById("tableTemplate").content.cloneNode(true));
        loadTable(box,name);
        return;
    } else if (document.querySelector(`#${box.id} .tableName`)) {
        [...box.querySelectorAll(`#${box.id} table`)].forEach(o=>o.remove());
        
        box.appendChild(document.getElementById("conditionTemplate").content.cloneNode(true));
    }
    let final = "";
    final += `<ul><li>${conditions[name].entries[1].entries.map(o=>`<strong><em>${o.name}</em></strong>. ${o.entries[0]}`).join("</li><li>")}</li></ul>`;
    document.querySelector(`#${box.id} .title`).innerHTML = name;
    document.querySelector(`#${box.id} .content`).innerHTML = parseStrings(final);
}