let data = {};
let chances = {};
let weapon = "";
let override = -1;
function start() {
  override = Number(document.getElementById("override").value);weapon="";data = {};chances = {};data["weapon"] = weapons;data["history"] = histories;data["property"] = properties;data["origin"] = origins;data["quirk"] = quirks;chances["quirk"] = document.getElementById("quirk").value/100;chances["property"] = document.getElementById("property").value/100;chances["history"] = document.getElementById("history").value/100;chances["origin"] = document.getElementById("origin").value/100;document.getElementById("output").innerHTML="";

  weapon = document.getElementById("weapon").value;
  console.log(chances);
  console.log(weapon,override);
  generateWeaponNames(1);
  
}
function choose(choices) {return choices[Math.floor(Math.random() * choices.length)];}
function tableRoll(table) {
  if (table == "weapon") {
    return (choose(data[table]).split(" ").map((t)=>{return t.substring(0,1).toUpperCase()+t.substring(1)}).join(" ").split("-").map((t)=>{return t.substring(0,1).toUpperCase()+t.substring(1)}).join("-"));
  }
  let x = choose(Object.keys(data[table]));
  return [x,data[table][x]];
}
function checkDisable(el) {
  if (Number(el.value) > -1) {
    document.querySelectorAll(".chanceInput").forEach((l)=>{l.disabled=true;});
  }
  else {
    document.querySelectorAll(".chanceInput").forEach((l)=>{l.disabled=false;});
  }
}


function print(t){document.getElementById("output").innerHTML+=t;console.log(t);}
function generateWeaponNames(number){
  let finalName = "<quirk> <history> <property> <weapon> <origin> ";let finalExtra="";finalName = finalName.replaceAll("<weapon>",(weapon.toLowerCase() == "random"?tableRoll("weapon"):weapon));let chances2 = ((override > -1)?sample(Object.keys(chances),override):((Object.keys(chances))));
  // ((random.sample(list(CHANCES.keys()),OVERRIDE_CHANCES)) if  else (list(CHANCES.keys())))
  for (trait in chances) {
    if (((Math.random() < chances[trait]) && override == -1) || (override > -1 && chances2.includes(trait))){
      let d = tableRoll(trait);
      finalName = finalName.replace("<"+trait+"> ",((!(d[0].includes("no_name")))?(d[0]+" "):""));
      finalExtra += "<br><br>"+d[1];
    }
    else {
      finalName = finalName.replace("<"+trait+"> ","");
    }
  }
  print(finalName+"<br><br>");print(finalExtra);
  if (number > 1){print("\n\n\n\n");generateWeaponNames(number-1)}
}


function random(e,t){return null==t&&(t=e,e=0),e+Math.floor(Math.random()*(t-e+1))}function toArray(e){return e?Array.isArray(e)?Array.prototype.slice.call(e):isString(e)?e.match(reStrSymbol):isArrayLike(e)?map(e,identity):values(e):[]}function sample(e,t,n){if(null==t||n)return isArrayLike(e)||(e=values(e)),e[random(e.length-1)];var r=toArray(e),i=r.length;t=Math.max(Math.min(t,i),0);for(var a=i-1,u=0;u<t;u++){var o=random(u,a),s=r[u];r[u]=r[o],r[o]=s}return r.slice(0,t)}
!function(){var e="(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)",r="([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";function n(e){return e.toLowerCase()}function t(e){return e.substr(0,1).toUpperCase()+e.substr(1)}this.titleCaps=function(a){for(var i=[],s=/[:.;?!] |(?: |^)["Ò]/g,u=0;;){var o=s.exec(a);if(i.push(a.substring(u,o?o.index:a.length).replace(/\b([A-Za-z][a-z.'Õ]*)\b/g,function(e){return/[A-Za-z]\.[A-Za-z]/.test(e)?e:t(e)}).replace(RegExp("\\b"+e+"\\b","ig"),n).replace(RegExp("^"+r+e+"\\b","ig"),function(e,r,n){return r+t(n)}).replace(RegExp("\\b"+e+r+"$","ig"),t)),u=s.lastIndex,o)i.push(o[0]);else break}return i.join("").replace(/ V(s?)\. /ig," v$1. ").replace(/(['Õ])S\b/ig,"$1s").replace(/\b(AT&T|Q&A)\b/ig,function(e){return e.toUpperCase()})}}();