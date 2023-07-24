function reevaluate() {
  let l = document.getElementById("tableType").value;
  let p = document.getElementById("tableTable").value;
  let treasures = ["Hoard","Individual","Dragon Hoard"];
  let monsters = ["Swamp","Arctic","Coastal","Desert","Forest","Grassland","Hill","Mountain","Underdark","Underwater","Urban"];
  let options = document.getElementsByTagName("option");
  for (let i = 0; i < options.length; i++) {
    options[i].style.display = "none";
    if (["Treasure","Encounters","All"].includes(options[i].innerHTML)) {
      options[i].style.display = "block";
    }
    else if (["0-4","5-10","11-16","17+"].includes(options[i].innerHTML)) {
      if (p != "Dragon Hoard") options[i].style.display = "block";
    }
    else if (["Wyrmling","Young","Adult","Ancient"].includes(options[i].innerHTML)) {
      if (p == "Dragon Hoard") options[i].style.display = "block";
    } 
    else if (l=="All") {
      options[i].style.display = "block";
    }
    else if (treasures.includes(options[i].innerHTML)&&l=="Treasure") {
      options[i].style.display = "block";
    }
    else if (monsters.includes(options[i].innerHTML)&&l=="Encounters") {
      options[i].style.display = "block";
    }
  }
}
function roll(die) {
  if (typeof(die)=="number"){return Math.floor(Math.random() * die) + 1}
  else{
    let t = die.split("d");
  let rolls = Number(t[0]);
  let f = Number(t[1])
  let final = 0;
  for (let i = 0; i < rolls; i++) {
    final += roll(f);
  }
    return final;
  }
}
// 72
// 85
function loadFile(filePath) {
  if (filePath in allFiles) {return allFiles[filePath];}
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  allFiles[filePath] = result;
  return result;
}
function run() {
  option1 = document.getElementById("tableTable").value+" "+document.getElementById("tableChallenge").value;
  if (option1 == "Hoard 0-4") {
    document.getElementById("output").innerHTML = hoard0();
  }
  else if (option1 == "Hoard 5-10") {
    document.getElementById("output").innerHTML = hoard5();
  }
  else if (option1 == "Hoard 11-16") {
    document.getElementById("output").innerHTML = hoard11();
  }
  else if (option1 == "Hoard 17+") {
    document.getElementById("output").innerHTML = hoard17();
  }
  else if (option1 == "Individual 0-4") {
    document.getElementById("output").innerHTML = individual0();
  }
  else if (option1 == "Individual 5-10") {
    document.getElementById("output").innerHTML = individual5();
  }
  else if (option1 == "Individual 11-16") {
    document.getElementById("output").innerHTML = individual11();
  }
  else if (option1 == "Individual 17+") {
    document.getElementById("output").innerHTML = individual17();
  }
  else if (option1 == "Dragon Hoard Wyrmling") {
    document.getElementById("output").innerHTML = hoardWyrmling();
  }
  else if (option1 == "Dragon Hoard Young") {
    document.getElementById("output").innerHTML = hoardYoung();
  }
  else if (option1 == "Dragon Hoard Adult") {
    document.getElementById("output").innerHTML = hoardAdult();
  }
  else if (option1 == "Dragon Hoard Ancient") {
    document.getElementById("output").innerHTML = hoardAncient();
  }
  else {
    console.log(option1.replace(" ","").toLowerCase().replace("-","+").split("+")[0]);
    document.getElementById("output").innerHTML = monster(option1.replace(" ","").toLowerCase().replace("-","+").split("+")[0]);
  }
  document.getElementById("load").innerHTML = "<br>";
}
function removeBR(str) {
  var charpos = str.lastIndexOf("<br>");
  if (charpos<0) return str;
  ptone = str.substring(0,charpos);
  pttwo = str.substring(charpos+(4));
  return (ptone+pttwo);
}

function combineItems(items) {
  const itemsArray = items.split("<br>");
  const combinedArray = [];
  let currentItem = itemsArray[0];
  let currentItemOccurrences = 1;
  for (let i = 1; i < itemsArray.length; i++) {
    if (itemsArray[i] === currentItem) {
      currentItemOccurrences++;
    } else {
      combinedArray.push(currentItem + (currentItemOccurrences > 1 ? " * "+currentItemOccurrences : ""));
      currentItem = itemsArray[i];
      currentItemOccurrences = 1;
    }
  }
  combinedArray.push(currentItem + (currentItemOccurrences > 1 ? " * "+currentItemOccurrences : ""));
  return combinedArray.join("<br>");
}
