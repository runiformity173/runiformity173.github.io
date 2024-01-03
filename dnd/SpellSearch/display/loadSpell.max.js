let level = 0;
const includes7 = function(thi,a){for (element of thi) {
  let t = true;
    for (c in element) {
      if (element[c] != a[c]) {t = false;}
    }
  if (t) {return true;}
  } return false;}
function validURL(a) {
  for (const v of a.toLowerCase().split("")) {
    if (!("abcdefghijklmnopqrstuvwxyz0123456789-.".includes(v))) {
      return false;
    }
  }
  return true;
}
function set2(name,value) {
  setCookie(name,JSON.stringify(value))
}
function get2(name) {
  return JSON.parse(getCookie(name))
}
function setCookie(name,value) {
  const prev = JSON.parse(localStorage.getItem("spellSearch") || "{}");
  prev[name] = value;
  localStorage.setItem("spellSearch", JSON.stringify(prev));
}
function getCookie(name) {
  return JSON.parse(localStorage.getItem("spellSearch"))[name];
}
function eraseCookie(name) {   
  const prev = JSON.parse(localStorage.getItem("spellSearch"));
  delete prev[name];
  localStorage.setItem("spellSearch", JSON.stringify(prev));
}
ordinal = {
  "1":"1st-level ",
  "2":"2nd-level ",
  "3":"3rd-level ",
  "4":"4th-level ",
  "5":"5th-level ",
  "6":"6th-level ",
  "7":"7th-level ",
  "8":"8th-level ",
  "9":"9th-level "};
function load() {
if (window.location.href.includes("?")) {
  let ff = getByName(window.location.href.split("?spell=")[1].replaceAll("--","ayo what is this?").replaceAll("-"," ").replaceAll("%27","'").replaceAll("ayo what is this?","-"));

  document.getElementById("all").style.opacity = 1;

  document.getElementById("output2").innerHTML = ff["name"];

  document.getElementById("output").innerHTML += "<i>";

  level = ff["level"];
  if (ff["level"] > 0) {
    document.getElementById("output").innerHTML += (ordinal[String(ff["level"])] + ff["school"]).italics();
  }
  else {
    document.getElementById("output").innerHTML += (ff["school"]+" cantrip").italics();
  }
  if (ff["ritual"]) {
    document.getElementById("output").innerHTML += " (ritual)".italics();
  }
  document.getElementById("output").innerHTML += "</i>";
  document.getElementById("output").innerHTML += "<br><br><strong>Casting Time: </strong>"+ff["casting"];
  document.getElementById("output").innerHTML += "<br><strong>Range: </strong>"+ff["range"];
  document.getElementById("output").innerHTML += "<br><strong>Components: </strong>"+ff["components"];
      document.getElementById("output").innerHTML += "<br><strong>Duration: </strong>"+ff["duration"];

  document.getElementById("output").innerHTML += "<br><br>"+ff["description"].replaceAll("\n\n","<br>&emsp;");
  document.getElementById("output").innerHTML += "<br><strong>Classes: </strong>"+ff["class"]+"<br>";
  document.getElementById("output").innerHTML += "<strong>Source: </strong>"+ff["source"]+"<br>";
}}

function saveSpell(multi=false) {
  let l = [];
  const books = Object.keys(JSON.parse(localStorage.getItem("spellSearch") || "{}"));
  for (let i = 0;i<books.length;i++) {
    const val = books[i];
    if (!val.includes("_")) {
      l.push("\""+val.replace(" ",""));
    }
  }
  if (l.length==1) {
    l[0] += "\""
  }
  else if (l.length == 2) {
    l[0] += "\" and "+l.pop()+"\"";
  }
  else if (l.length > 2) {
    l[l.length-1] = "and "+l[l.length-1]+"\"";
  }
  let list = prompt("Which list would you like to add this spell to? Currently, you have "+(l.length>0?l.join(",\" "):"none")+". Alternatively, enter a name not on that list to create a new one.").replaceAll(" ","-").toLowerCase();
  if (!validURL(list)) {
    alert("Please use only letters, digits, and hyphens.");return "";
  }
  if (books.includes(list)) {

    let fff = get2(list);
    if (multi) {
      for (const w of spells) {
        let c2 = {"name":w.name,"linkd":"https://ezhgamer173.github.io/dnd/SpellSearch/display/?spell="+w.name.toLowerCase().replaceAll("-","--").replaceAll(" ","-"),"level":w.level,"enabled":false};
        let c = {"name":w.name,"linkd":c2.linkd,"level":w.level,"enabled":true};
        if (!includes7(fff,c) && !includes7(fff,c2)) {
          fff.push(c2);
        }
      }
    }
    else {
      let c2 = {"name":document.getElementById("output2").innerHTML,"linkd":window.location.href,"level":level,"enabled":false};
      let c = {"name":document.getElementById("output2").innerHTML,"linkd":window.location.href,"level":level,"enabled":true};
      if (!includes7(fff,c) && !includes7(fff,c2)) {
        fff.push(c);
      }
    }
    set2(list,fff);
  }
  else {
    if (multi) {
      const fff = [];
      for (const w of spells) {
        let c2 = {"name":w.name,"linkd":"https://ezhgamer173.github.io/dnd/SpellSearch/display/?spell="+w.name.toLowerCase().replaceAll("-","--").replaceAll(" ","-"),"level":w.level,"enabled":false};
        let c = {"name":w.name,"linkd":c2.linkd,"level":w.level,"enabled":true};
        if (!includes7(fff,c) && !includes7(fff,c2)) {
          fff.push(c2);
        }
      }
      set2(list,fff);
    }
    else {set2(list,[{"name":document.getElementById("output2").innerHTML,"linkd":window.location.href,"level":level,"enabled":true}]);}
  }
  console.log(books,list);
}
function getByName(name) {
  for (const spell of spells2) {
    if (spell["name"].toLowerCase() == (name.toLowerCase())) {
      return spell;
    }
  }
  for (const spell of spells2) {
    if (spell["name"].toLowerCase().includes(name.toLowerCase())) {
      return spell;
    }
  }
  console.log("No Spell Matching \""+name+"\"");
}

/*
function load2() {
  try {
  return fetch(`https://SpellAPI.ezhgamer173.repl.co/api/spells/${encodeURIComponent(window.location.href.split("?spell=")[1].replaceAll("--","ayo what is this?").replaceAll("-"," ").replaceAll("%27","'").replaceAll("ayo what is this?","-"))}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        load(data.data);
      } else {
        console.error('Spell not found');
      }
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  } catch {
    load2();
  }
}
*/
