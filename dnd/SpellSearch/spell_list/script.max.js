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

function load() {
  if (window.location.href.includes("?")) {
    let levels = [];
    if (document.getElementById("output").innerHTML == "You have no spellbooks yet.") {document.getElementById("output").innerHTML = "";}
    let vv = JSON.parse(getCookie(window.location.href.split("?list=")[1])).sort(nameSort);
    for (const spell in vv) {
      if (!levels.includes(vv[spell]["level"])) {levels.push(vv[spell]["level"]);document.getElementById("output").innerHTML += ("<br>"+{"0":"Cantrips","1":"1st-level","2":"2nd-level","3":"3rd-level","4":"4th-level","5":"5th-level","6":"6th-level","7":"7th-level","8":"8th-level","9":"9th-level"}[String(vv[spell]["level"])]+"<br>")}
      document.getElementById("output").innerHTML += "<a target='_blank' href='"+vv[spell]["linkd"]+"'>"+vv[spell]["name"]+"</a>&emsp;<span class='remove no-select' onclick='if (confirm(\"Are you sure you want to remove this spell?\")){removeSpell(\""+vv[spell]["linkd"]+"\");}'><p>‾</p></span><br>";
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
    for (const spell in vv) {
      if (vv[spell]["linkd"] != spelll) {
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