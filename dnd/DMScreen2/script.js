// Name generator
function setCookie(name,value) {
  const prev = JSON.parse(localStorage.getItem("DMScreen2") || "{}");
  prev[name] = value;
  localStorage.setItem("DMScreen2", JSON.stringify(prev));
}
function getCookie(name) {
  if (location.href.includes("#portfolio") && !localStorage.getItem("DMScreen2")) localStorage.setItem("DMScreen2",JSON.stringify(portfolioData));
  return JSON.parse(localStorage.getItem("DMScreen2") || "{}")[name] || {};
}
function eraseCookie(name) {   
  const prev = JSON.parse(localStorage.getItem("DMScreen2"));
  if (name in prev) delete prev[name];
  localStorage.setItem("DMScreen2", JSON.stringify(prev));
}
if (!Array.isArray(getCookie("defaultPlayerList"))) {
  setCookie("defaultPlayerList",[]);
}
if (!Array.isArray(getCookie("windows"))) {
  setCookie("windows",[]);
}
function datalistInput(element) {
    var val = element.value;
    var opts = element.list.children;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value === val) {
        element.parentElement.lastElementChild.click();
        break;
      }
    }
  }
function load() {
  getCookie("windows").forEach(function(j) {
    const i = createWindow(j.windowData[0],j.windowData[1],j.windowData[2],j.windowData[3],j.windowData[4]);
    const entry = j;
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
      } else if (entry.type == "condition") {
        loadCondition(i,data.name);
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
  "monster":"monster",
  "Condition Select":"conditionSelect",
  "conditionSelect":"conditionSelect",
  "Condition":"condition",
  "condition":"condition"
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
  if (module == "initiativeTracker") {
    if (addDefault) {
      for (const item of getCookie("defaultPlayerList")) {
        const node = document.getElementById("initiative").content.cloneNode(true);
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
      if (!(extraData.name.split(" (").slice(0,-1).join(" (") in data)) {
        alert("Table does not exist");
        addModule("tableSelect",box,true);
        return;
      }
      loadTable(box,extraData.name.split(" (").slice(0,-1).join(" ("));
    }
  } else if (module == "condition") {
    if (addDefault) {
      if (!(extraData.name in conditions)) {
        alert("Condition does not exist");
        addModule("conditionSelect",box,true);
        return;
      }
      loadCondition(box,extraData.name);
    }
  } else if (module == "spell") {
    if (addDefault) {
      if (!spells.includes(extraData.name)) {
        alert("Spell does not exist!");
        addModule("spellSelect",box,true);
        return;
      }
      box.children[1].src = "https://runiformity173.github.io/dnd/SpellSearch2024/display/?spell="+extraData.name.toLowerCase().replaceAll(" ","-")+"&savebutton=false";
    }
  } else if (module == "monster") {
    if (addDefault) {
      box.children[1].src = "https://runiformity173.github.io/dnd/MonsterSearch/display/#"+extraData.name.toLowerCase().replaceAll(" ","-");
    }
  }
  if (addDefault) save(box);
  box.closest(".window").renderFunction();
}
function sortInitiative(box) {
  [...box.children]
  .sort((a, b) => Number(b.lastElementChild.firstElementChild.value) - Number(a.lastElementChild.firstElementChild.value))
  .forEach(node => box.appendChild(node));
}
function save(box=null) {
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
    } else if (type == "condition") {
      data["name"] = document.querySelector(`#${box.id} .title, #${box.id} .tableName`).innerHTML;
    } else if (type == "spell") {
      data["link"] = box.children[1].src;
    } else if (type == "monster") {
      data["link"] = box.children[1].src;
    }
    const newWindows = getCookie("windows");
    const boxIndex = newWindows.findIndex(i=>i.name == box.id);
    if (boxIndex > -1)
      newWindows[boxIndex] = {name:box.id,type:type,data:data,windowData:box.closest(".window").getData()};
    else
      newWindows.push({name:box.id,type:type,data:data,windowData:box.closest(".window").getData()});
    setCookie("windows",newWindows);
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