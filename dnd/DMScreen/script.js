// Table Test
// Spells
// Maybe monsters and such
// Name generator
function setCookie(name,value) {
  const prev = JSON.parse(localStorage.getItem("DMScreen") || "{}");
  prev[name] = value;
  localStorage.setItem("DMScreen", JSON.stringify(prev));
}
function getCookie(name) {
  return JSON.parse(localStorage.getItem("DMScreen") || "{}")[name] || {};
}
function eraseCookie(name) {   
  const prev = JSON.parse(localStorage.getItem("DMScreen"));
  if (name in prev) delete prev[name];
  localStorage.setItem("DMScreen", JSON.stringify(prev));
}
if (!("type" in getCookie("box-1"))) {
  if (!Array.isArray(getCookie("defaultPlayerList"))) {
    setCookie("defaultPlayerList",[]);
  }
  for (let i = 1;i<=12;i++) {
    setCookie(`box-${i}`,{
      type:"blank",
      data:{}
    });
  }
}
function load() {
  Array.from(document.getElementsByClassName("box")).forEach(function(i) {
    i.appendChild(document.getElementById("plusButtonTemplate").content.cloneNode(true));
    const entry = getCookie(i.id);
    if (entry.type != "blank") {
      const data = entry.data;
      addModule(entry.type,i,false);
      if (entry.type == "initiativeTracker") {
        const wrapper = document.querySelector(`#${i.id} .wrapper`)
        for (const [name,initiative] of data.rows) {
          const node = document.getElementById("initiative").content.cloneNode(true).firstElementChild;
          node.firstElementChild.firstElementChild.innerHTML = name;
          node.lastElementChild.firstElementChild.value = initiative;

          wrapper.appendChild(node);
        }
      } else if (entry.type == "healthTracker") {
        const wrapper = document.querySelector(`#${i.id} .wrapper`)
        for (const [name,initiative] of data.rows) {
          const node = document.getElementById("health").content.cloneNode(true).firstElementChild;
          node.firstElementChild.firstElementChild.innerHTML = name;
          node.lastElementChild.firstElementChild.value = initiative;
  
          wrapper.appendChild(node);
        }
      } else if (entry.type == "notes") {
        document.querySelector(`#${i.id} .notesArea`).value = data.text;
      } else if (entry.type == "table") {
        loadTable(i,data.name);
      } else if (entry.type == "spell") {
        i.children[1].src = data.link;
      } else if (entry.type == "monster") {
        i.children[1].src = data.link;
      }
    }
  });
  
}
const moduleMap = {
  "Initiative Tracker":"initiativeTracker",
  "initiativeTracker":"initiativeTracker",
  "Health Tracker":"healthTracker",
  "healthTracker":"healthTracker",
  "Notes":"notes",
  "notes":"notes",
  "Table Select":"tableSelect",
  "tableSelect":"tableSelect",
  "Table":"table",
  "table":"table",
  "Spell Select":"spellSelect",
  "spellSelect":"spellSelect",
  "Spell":"spell",
  "spell":"spell",
  "Monster Select":"monsterSelect",
  "monsterSelect":"monsterSelect",
  "Monster":"monster",
  "monster":"monster"
}
function addModule(addedModule,box,addDefault=true,extraData={}) {
  if (!(addedModule in moduleMap)) {
    alert("Please select a module to add");
    return;
  }
  const id = box.id;
  const module = moduleMap[addedModule];
  Array.from(box.children).forEach(i=>i.remove());
  box.appendChild(document.getElementById(module+"Template").content.cloneNode(true));
  box.appendChild(document.getElementById("closeButtonTemplate").content.cloneNode(true));
  if (module == "initiativeTracker") {
    if (addDefault) {
      for (const item of getCookie("defaultPlayerList")) {
        const node = document.getElementById("initiative").content.cloneNode(true);
        console.log(node);
        node.firstElementChild.firstElementChild.firstElementChild.innerHTML = item;
        document.querySelector(`#${id} .wrapper`).appendChild(node);
      }
      if (document.querySelector(`#${id} .wrapper`).children.length == 0) {
        const node = document.getElementById("initiative").content.cloneNode(true);
        document.querySelector(`#${id} .wrapper`).appendChild(node);
      }
    }
  } else if (module == "healthTracker") {
    if (addDefault) {
      if (document.querySelector(`#${id} .wrapper`).children.length == 0) {
        const node = document.getElementById("health").content.cloneNode(true);
        document.querySelector(`#${id} .wrapper`).appendChild(node);
      }
    }
  } else if (module == "notes") {
    document.querySelector(`#${id} .notesArea`).value = "";
    if (addDefault) {
      // Default notes content
    }
  } else if (module == "table") {
    if (addDefault) {
      if (!(extraData.name in data)) {alert("Table does not exist");return;}
      loadTable(box,extraData.name);
    }
  } else if (module == "spell") {
    if (addDefault) {
      box.children[1].src = "https://runiformity173.github.io/dnd/SpellSearch/display/?spell="+extraData.name.toLowerCase().replace(" ","-")+"&savebutton=false";
    }
  } else if (module == "monster") {
    if (addDefault) {
      box.children[1].src = "https://runiformity173.github.io/dnd/MonsterSearch/display/?monster="+extraData.name.toLowerCase().replace(" ","-");
    }
  }
  if (addDefault) save(box);
}
function sortInitiative(box) {
  [...box.children]
  .sort((a, b) => Number(b.lastElementChild.firstElementChild.value) - Number(a.lastElementChild.firstElementChild.value))
  .forEach(node => box.appendChild(node));
}
function save(box) {
  if (box) {
    const type = (box?.firstElementChild?.id) || "blank";
    const data = {};
    if (type == "initiativeTracker") {
      data["rows"] = [];
      for (const row of box.children[2].children) {
        const num = row.lastElementChild.firstElementChild.value;
        data["rows"].push([row.firstElementChild.firstElementChild.innerHTML,(num?Number(num):"")]);
      }
    } else if (type == "healthTracker") {
      data["rows"] = [];
      for (const row of box.children[2].children) {
        const num = row.lastElementChild.firstElementChild.value;
        data["rows"].push([row.firstElementChild.firstElementChild.innerHTML,(num?Number(num):"")]);
      }
    } else if (type == "notes") {
      data["text"] = box.children[1].value;
    } else if (type == "table") {
      data["name"] = document.querySelector(`#${box.id} .tableName`).innerHTML;
    } else if (type == "spell") {
      data["link"] = box.children[1].src;
    } else if (type == "monster") {
      data["link"] = box.children[1].src;
    }
    setCookie(box.id,{type:type,data:data});
  } else {
    console.log(box);
    alert("didn't pass box to 'save()' correctly");
  }
}
function saveInitiative(box) {
  const list = [];
  for (const row of box.children) {
    list.push(row.firstElementChild.firstElementChild.innerHTML);
  }
  setCookie("defaultPlayerList",list);
}