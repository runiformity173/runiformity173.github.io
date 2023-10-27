//    2

function spellIndex(list,spell) {
  for (let i = 0;i<list.length;i++) {
    if (list[i].name.replaceAll(" ","").toLowerCase().includes(spell)) {
      return i;
    }
  }
  return -1;
}
window.addEventListener("keydown",function(e){
  if (e.altKey && e.keyCode === 80) {
    const i = spellIndex(CURRENT_LIST,prompt("Which spell?").replaceAll(" ","").toLowerCase());
    changeSpellColor(i);
  }
});
function changeSpellColor(spell) {
  if (!(spell in CURRENT_LIST)) {
    return;
  }
  CURRENT_LIST[spell].color = CURRENT_LIST[spell].color?undefined:prompt("Which color would you like " + CURRENT_LIST[spell].name + " to be?");
  setCookie(window.location.href.split('?list=')[1],JSON.stringify(CURRENT_LIST));
  // this.previousElementSibling.previousElementSibling.style.color = color;
}

function nameSort(a,b) {
  let final = ((a["level"]||0) + a["name"]);
  let final2 = ((b["level"]||0) + b["name"]);
  return final>final2?1:(final<final2?-1:0);
}

function fromName(l) {
  return l.replaceAll("-"," ").replaceAll("%27","'")
}

function set2(name,value) {
  setCookie(name,JSON.stringify(value));
}

function setCookie(name,value) {
  localStorage.setItem(name, value);
}
function getCookie(name) {
  return localStorage.getItem(name);
}
function eraseCookie(name) {   
  localStorage.removeItem(name);
}
let CURRENT_LIST = [];
function load() {
  if (window.location.href.includes("?")) {
    let levels = [];
    if (document.getElementById("output").innerHTML == "You have no spellbooks yet.") {document.getElementById("output").innerHTML = "";}
    let vv = JSON.parse(getCookie(window.location.href.split("?list=")[1])).sort(nameSort);
    CURRENT_LIST = structuredClone(vv);
    for (const spell in vv) {
      // CURRENT_LIST["+spell+"].enabled = !(CURRENT_LIST["+spell+"].enabled);setCookie(window.location.href.split(\'?list=\')[1],JSON.stringify(CURRENT_LIST));this.parentElement.firstElementChild.classList.toggle(\'disabled\')
      if (!levels.includes(vv[spell]["level"])) {levels.push(vv[spell]["level"]);document.getElementById("output").insertAdjacentHTML("beforeend",("<br>"+{"0":"Cantrips","1":"1st-level","2":"2nd-level","3":"3rd-level","4":"4th-level","5":"5th-level","6":"6th-level","7":"7th-level","8":"8th-level","9":"9th-level"}[String(vv[spell]["level"])]+"<br>"))}
      document.getElementById("output").insertAdjacentHTML("beforeend","<a "+(vv[spell].enabled?"":"class=\'disabled\'")+"target='_blank' href='"+vv[spell]["linkd"]+"' "+(vv[spell].color?("style='color:"+vv[spell].color+"'"):"")+">"+vv[spell]["name"]+"</a>&emsp;<span class='remove no-select' onclick='if (confirm(\"Are you sure you want to remove this spell?\")){removeSpell(\""+vv[spell]["linkd"]+"\");}'><p>‾</p></span>&emsp;<span class='toggle no-select'><p>~</p></span><br>");
      document.getElementById("output").lastElementChild.previousElementSibling.addEventListener("click",function(){
        CURRENT_LIST[spell].enabled = !(CURRENT_LIST[spell].enabled);
        setCookie(window.location.href.split('?list=')[1],JSON.stringify(CURRENT_LIST));
        this.previousElementSibling.previousElementSibling.classList.toggle('disabled');
      });
    }
  }
  else {
    for (let i = 0;i<localStorage.length;i++) {
      let l = localStorage.key(i)
      if (!l.includes("_")) {
        if (document.getElementById("output").innerHTML == "You have no spellbooks yet.") {
          document.getElementById("output").innerHTML = "";
        }
        document.getElementById("output").innerHTML += '<a href="?list='+l.replace(" ","")+'">'+fromName(l)+'</a>&emsp;<span class=\'remove no-select\' onclick=\'if (confirm(\"Are you sure you want to remove this spell list?\")){removeList("'+l+'");}\'><p>‾</p></span><br>';}
    }
  }
}
function removeSpell(spell2) {
  let spelll = spell2;
  let vv = JSON.parse(getCookie(window.location.href.split("?list=")[1])).sort(nameSort);
  let final = [];
  let d = true;
    for (const spell in vv) {
      if (vv[spell]["linkd"] != spelll) {
        final.push(vv[spell]);
      } else if (d) {
        d = false;
      } else {
        final.push(vv[spell]);
      }

    }
  setCookie(window.location.href.split("?list=")[1],JSON.stringify(final))
location.reload();
}
function removeList(spell2) {
  eraseCookie(spell2);
  // let final = [];
  //   for (const spell in vv) {

  //     if (vv[spell]["linkd"] != spelll) {
  //       console.log(vv[spell]["linkd"],spelll);
  //       final.push(vv[spell]);
  //     }

  //     console.log(vv[spell]);
  //   }
  // setCookie(window.location.href.split("?list=")[1],JSON.stringify(final))
location.reload();
}

window.addEventListener("keydown",function(e){
  if (e.altKey && e.keyCode===66) {
    this.alert(getCookie(prompt("Name of the spell list")));
  }
});
window.addEventListener("keydown",function(e){
  if (e.key==="¬") {
    setCookie(prompt("Name of the spell list"),prompt("data"));
  }
});