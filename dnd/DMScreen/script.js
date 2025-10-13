// Name generator
function setCookie(name,value) {
  const prev = JSON.parse(localStorage.getItem("DMScreen") || "{}");
  prev[name] = value;
  localStorage.setItem("DMScreen", JSON.stringify(prev));
}
function getCookie(name) {
  if (location.href.includes("#portfolio") && !localStorage.getItem("DMScreen")) localStorage.setItem("DMScreen",JSON.stringify(portfolioData));
  return JSON.parse(localStorage.getItem("DMScreen") || "{}")[name] || {};
}
function eraseCookie(name) {   
  const prev = JSON.parse(localStorage.getItem("DMScreen"));
  if (name in prev) delete prev[name];
  localStorage.setItem("DMScreen", JSON.stringify(prev));
}
if (!("type" in getCookie("box-1"))) {
  for (let i = 1;i<=12;i++) {
    setCookie(`box-${i}`,{
      type:"blank",
      data:{}
    });
  }
}
if (!Array.isArray(getCookie("defaultPlayerList"))) {
  setCookie("defaultPlayerList",[]);
}
if (!Array.isArray(getCookie("floatingBoxes"))) {
  setCookie("floatingBoxes",[]);
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
  const floatingBoxes = [];
  for (const i of getCookie("floatingBoxes")) {
    document.body.appendChild(document.getElementById("popoutWindowTemplate").content.cloneNode(true));
    const d = document.body.lastElementChild.lastElementChild;
    d.id = i;
    floatingBoxes.push(d);
  }
  [...Array.from(document.getElementsByClassName("static-box")),...floatingBoxes].forEach(function(i) {
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
      } else if (entry.type == "condition") {
        loadCondition(i,data.name);
      } else if (entry.type == "spell") {
        i.children[1].src = data.link;
      } else if (entry.type == "monster") {
        i.children[1].src = data.link;
      }
      
      if (i.classList.contains("floating-box")) {
        i.parentElement.style.left = data.left;
        i.parentElement.style.top = data.top;
      }
    } else if (i.classList.contains("floating-box")) {
      i.parentElement.remove();
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
  box.appendChild(document.getElementById("closeButtonTemplate").content.cloneNode(true));
  box.appendChild(document.getElementById("popoutButtonTemplate").content.cloneNode(true));
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
}
function sortInitiative(box) {
  [...box.children]
  .sort((a, b) => Number(b.lastElementChild.firstElementChild.value) - Number(a.lastElementChild.firstElementChild.value))
  .forEach(node => box.appendChild(node));
}
function save(box=null) {
  if (box) {
    if (Number(box.id.split("-")[1]) > 12) {
      if (!getCookie("floatingBoxes").includes(box.id)) {
        setCookie("floatingBoxes",[...getCookie("floatingBoxes"),box.id]);
      }
    }
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
    if (box.classList.contains("floating-box")) {
      data["left"] = box.parentElement.style.left;
      data["top"] = box.parentElement.style.top;
    }
    setCookie(box.id,{type:type,data:data});
  } else if (box === null) {
    setCookie("floatingBoxes",Array.from(document.getElementsByClassName("floating-box")).map(e => e.id));
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


let dragging = -1;
let dragStartPos = [0,0];
let maxDragPos = [];
function setMaxDragPos() {
  maxDragPos = [
    document.body.clientWidth-document.getElementById("box-1").clientWidth-2,
    document.body.clientHeight-document.getElementById("box-1").clientHeight-22
  ];
}
setMaxDragPos();
window.addEventListener("resize",setMaxDragPos)
function getHoveredBox(e) {
  return Array.from(document.elementsFromPoint(e.clientX, e.clientY)).filter(o=>o.classList.contains("static-box"))[0];
}
document.addEventListener("mousemove", e => {
  if (dragging < 0) return;
  const dragged = document.getElementById("box-"+dragging).parentElement;
  dragged.style.left = Math.min(maxDragPos[0],Math.max(0,e.clientX-dragStartPos[1]))+"px";
  dragged.style.top = Math.min(maxDragPos[1],Math.max(0,e.clientY-dragStartPos[0]))+"px";
  const box = getHoveredBox(e);
  [...document.querySelectorAll(".hovered-box")].forEach(o=>o.classList.remove("hovered-box"));
  if (box && box.querySelector(".addModuleContainer")) {
    box.classList.add("hovered-box");
  }
});
window.addEventListener("mouseout", e => {
  if (e.x < 0 || e.y < 0 || e.x > window.innerWidth || e.y > window.innerHeight) {
    stopDragging(e);
  }
});
window.addEventListener("mouseup",e => {
  stopDragging(e);
});
function stopDragging(e) {
  if (dragging === -1) return;
  [...document.querySelectorAll(".hovered-box")].forEach(o=>o.classList.remove("hovered-box"));
  const box = getHoveredBox(e);
  if (box && box.querySelector(".addModuleContainer")) {
    const from = document.getElementById("box-"+dragging);
    box.innerHTML = "";
    while (from.firstChild) box.appendChild(from.firstChild);
    from.closest(".floating-box-container").remove();
    save(box);
    save(null);
  } else {
    save(document.getElementById("box-"+dragging));
    document.getElementById("box-"+dragging).classList.remove("dragging");
  }
  dragging = -1;
}