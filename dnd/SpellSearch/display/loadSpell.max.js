let level = 0;
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
  const days = 50000;
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
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

function saveSpell() {
  let books = [];
  let spellbookList = (document.cookie).split(";");
  let l = [];
  for (val in spellbookList) {
    if (!spellbookList[val].includes("_")) {
      l.push("\""+spellbookList[val].split("=")[0].replace(" ",""));
      books.push(spellbookList[val].split("=")[0].replace(" ",""));
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
  console.log(JSON.stringify({"name":document.getElementById("output2").innerHTML,"linkd":window.location.href,"level":level}));
  if (books.includes(list)) {
    let fff = get2(list);
    let c = {"name":document.getElementById("output2").innerHTML,"linkd":window.location.href,"level":level};
    if (!fff.includes(c)) {
      fff.push(c);
    }
    set2(list,fff);
  }
  else {
    set2(list,[{"name":document.getElementById("output2").innerHTML,"linkd":window.location.href,"level":level}]);
  }
  console.log(books,list);
}