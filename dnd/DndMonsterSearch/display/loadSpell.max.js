

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
  let ff = getByName(window.location.href.split("?monster=")[1].replaceAll("--","ayo what is this?").replaceAll("-"," ").replaceAll("%27","'").replaceAll("ayo what is this?","-"));
  document.getElementById("name").innerHTML = ff["name"];
  document.getElementById("meta").innerHTML = ff["meta"];
  let c = ff["Armor Class"].split(" ")[0]
  if (ff["Armor Class"].includes(" ")) {
    c = ff["Armor Class"].replace(" "," ")+"";
  }
  document.getElementById("ac").innerHTML += c;
  document.getElementById("hp").innerHTML += ff["Hit Points"];
  document.getElementById("speed").innerHTML += ff["Speed"];
  document.getElementById("str").innerHTML = "<strong>STR</strong>"+"<br><br>"+ff["STR"]+" "+ff["STR_mod"];
  document.getElementById("dex").innerHTML = "<strong>DEX</strong>"+"<br><br>"+ff["DEX"]+" "+ff["DEX_mod"];
  document.getElementById("cha").innerHTML = "<strong>CHA</strong>"+"<br><br>"+ff["CHA"]+" "+ff["CHA_mod"];
  document.getElementById("con").innerHTML = "<strong>CON</strong>"+"<br><br>"+ff["CON"]+" "+ff["CON_mod"];
  document.getElementById("wis").innerHTML = "<strong>WIS</strong>"+"<br><br>"+ff["WIS"]+" "+ff["WIS_mod"];
  document.getElementById("int").innerHTML = "<strong>INT</strong>"+"<br><br>"+ff["INT"]+" "+ff["INT_mod"];

  for (let t of ["Saving Throws","Skills","Damage Vulnerabilities","Damage Resistances","Damage Resistance","Damage Immunities","Condition Immunities","Senses","Languages","Challenge"]) {
    if (t in ff) {
      document.getElementById("skills").innerHTML = document.getElementById("skills").innerHTML.replace("<btt>","<br>")
      document.getElementById("skills").innerHTML += ("<strong>"+t+" </strong>"+ff[t]+"<btt>");
    }
  }
  
  document.getElementById("skills").innerHTML = document.getElementById("skills").innerHTML.replace("<btt>","</p>");
  if ("Traits" in ff){document.getElementById("abilities").innerHTML += ff["Traits"];}
  document.getElementById("actions").innerHTML += ff["Actions"];
  if ("Legendary Actions" in ff) {
    document.getElementById("hiddenla").style.display = "block";
    document.getElementById("lactions").innerHTML += ff["Legendary Actions"];
  }
  if ("Reactions" in ff) {
    document.getElementById("hiddenr").style.display = "block";
    document.getElementById("reactions").innerHTML += ff["Reactions"];
  }
  document.getElementById("nall").src=ff["img_url"];

  
}}
function recolorImage(img, oldRed, oldGreen, oldBlue, newRed, newGreen, newBlue) {

    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var w = img.width;
    var h = img.height;

    c.width = w;
    c.height = h;
    // draw the image on the temporary canvas
    ctx.drawImage(img, 0, 0, w, h);
    // pull the entire image into an array of pixel data
    var imageData = ctx.getImageData(0, 0, w, h);

    // examine every pixel, 
    // change any old rgb to the new-rgb
    for (var i = 0; i < imageData.data.length; i += 4) {
        // is this pixel the old rgb?
        if (imageData.data[i] == oldRed &&
            imageData.data[i + 1] == oldGreen &&
            imageData.data[i + 2] == oldBlue
        ) {
            // change to your new rgb
            imageData.data[i] = newRed;
            imageData.data[i + 1] = newGreen;
            imageData.data[i + 2] = newBlue;
            imageData.data[i + 3] = 0;
        }
    }
    // put the altered data back on the canvas  
    ctx.putImageData(imageData, 0, 0);
    // put the re-colored image back on the image
    var img1 = document.getElementById("nall");
    img1.src = c.toDataURL('image/png');

}
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