function setCookie(e,t){var n="",o=new Date;o.setTime(o.getTime()+432e10),n="; expires="+o.toUTCString(),document.cookie=e+"="+(t||"")+n+"; path=/"}function getCookie(e){for(var t=e+"=",n=document.cookie.split(";"),o=0;o<n.length;o++){for(var r=n[o];" "==r.charAt(0);)r=r.substring(1,r.length);if(0==r.indexOf(t))return r.substring(t.length,r.length)}return null}function test(t){let n=1/0,o=-1/0;for(let e=0;e<1e5;e++){var r=roll(t);r<n&&(n=r),r>o&&(o=r)}console.log(n,o)}
function choose(choices) {var index = Math.floor(Math.random() * choices.length);return choices[index];}
function roll(a){if(!a.includes("d")&&!a.includes("+")){var t=parseInt(a);return isNaN(t)?0:Math.floor(Math.random()*t)+1}const r=a.split("+");let e=0;for(let a=0;a<r.length;a++){const o=r[a].trim();if(o.includes("d")){var[s,i,l]=o.replace("*","d").split("d").map(a=>parseInt(a));if(!isNaN(s)&&!isNaN(i)){let t=0;for(let a=0;a<s;a++){var n=Math.floor(Math.random()*i)+1;isNaN(n)||(t+=n)}isNaN(l)||(t*=l),e+=t}}else{l=parseInt(o);isNaN(l)||(e+=l)}}return e}

let male = ["Aseir,Bardeid,Haseid,Khemed,Mehmed,Sudeiman,Zasheir","Darvin,Dorn,Evandur,Gorstag,Grim,Helm,Malark,Morn,Randal,Stedd","Bor,Fodel,Glar,Grigor,Igan,Ivor,Kosef,Mival,Orel,Pavel,Sergor","Ander,Blath,Bran,Frath,Geth,Lander,Luth,Malcer,Stor,Taman,Urth","Aoth,Bareris,Ehput-Ki,Kethoth,Mumed,Ramas,So-Kehur,Thazar-De,Urhur","Borivik,Faurgar,Jandar,Kanithar,Madislak,Ralmevik,Shaumar,Vladislak","An,Chen,Chi,Fai,Jiang,Jun,Lian,Long,Meng,On,Shan,Shui,Wen","Anton,Diero,Marcon,Pieron,Rimardo,Romero,Salazar,Umbero"];
let female = ["Atala,Ceidil,Hama,Jasmal,Meilil,Seipora,Yasheira,Zasheida","Arveene,Esvele,Jhessail,Kerri,Lureene,Miri,Rowan,Shandri,Tessele","Alethra,Kara,Katernin,Mara,Natali,Olma,Tana,Zora","Amafrey,Betha,Cefrey,Kethra,Mara,Olga,Silifrey,Westra","Arizima,Chathi,Nephis,Nulara,Murithi,Sefris,Thola,Umara,Zolis","Fyevarra,Hulmarra,Immith,Imzel,Navarra,Shevarra,Tammith,Yuldra","Bai,Chao,Jia,Lei,Mei,Qiao,Shui,Tai","Balama,Dona,Faila,Jalana,Luisa,Marta,Quara,Selise,Vonda"];
let family = ["Basha,Dumein,Jassan,Khalid,Mostana,Pashar,Rein","Amblecrown,Buckman,Dundragon,Evenwood,Greycastle,Tallstag","Bersk,Chernin,Dotsk,Kulenov,Marsk,Nemetsk,Shemov,Starag","Brightwood,Helder,Hornraven,Lackman,Stormwind,Windrivver","Ankhalab,Anskuld,Fezim,Hahpet,Nathandem,Sepret,Uuthrakt","Chergoba,Dyernina,Ilazyara,Murnyethara,Stayanoga,Ulmokina","Chien,Huang,Kao,Kung,Lao,Ling,Mei,Pin,Shin,Sum,Tan,Wan","Agosto,Astorio,Calabra,Domine,Falone,Marivaldi,Pisacar,Ramondo"];
function run() {
  if (getCookie("used") === null) {setCookie("used",JSON.stringify([]));console.log("should've set the cookie");}
  option1 = document.getElementById("tableTable").value;
  let l = roll("8+-1");
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