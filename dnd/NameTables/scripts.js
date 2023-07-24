// function reevaluate() {
//   let l = document.getElementById("tableType").value;
//   let treasures = ["Hoard","Individual"];
//   let monsters = ["Swamp","Arctic","Coastal","Desert","Forest","Grassland","Hill","Mountain","Underdark","Underwater","Urban"];
//   let options = document.getElementsByTagName("option");
//   for (let i = 0; i < options.length; i++) {
//     options[i].style.display = "none";
//     console.log(l);
//     if (["Treasure","Encounters","All","0-4","5-10","11-16","17+"].includes(options[i].innerHTML)) {
//       options[i].style.display = "block";
//     }
//     if (l=="All") {
//       options[i].style.display = "block";
//     }
//     if (treasures.includes(options[i].innerHTML)&&l=="Treasure") {
//       options[i].style.display = "block";
//     }
//     if (monsters.includes(options[i].innerHTML)&&l=="Encounters") {
//       options[i].style.display = "block";
//     }
//   }
// }

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
function choose(choices) {var index = Math.floor(Math.random() * choices.length);return choices[index];}
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
function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
}
let male = loadFile("tables/male.txt").split("\n");
let female = loadFile("tables/female.txt").split("\n");
let family = loadFile("tables/family.txt").split("\n");
function run() {
  if (getCookie("used") === null) {setCookie("used",JSON.stringify([]));console.log("should've set the cookie");}
  option1 = document.getElementById("tableTable").value;
  let l = roll(8)-1;
  let final = "";
  if (option1 == "Male") {
    final += choose(male[l].split(",")) + " ";
  }
  else {
    final += choose(female[l].split(",")) + " ";
  }
  final += choose(family[l].split(","));
  if ((getCookie("used").includes(final))) {
    console.log(final);
    run();
  }
    else {
     
  document.getElementById("output").innerHTML = final+"&emsp;<span id='add' onclick='if (confirm(\"Are you sure you wish to use this name?\")) {let ff = JSON.parse(getCookie(\"used\"));ff.push(\""+final+"\");setCookie(\"used\",JSON.stringify(ff))}'><p>+</p></span>";
  document.getElementById("load").innerHTML = "<br>";
    }
    
}