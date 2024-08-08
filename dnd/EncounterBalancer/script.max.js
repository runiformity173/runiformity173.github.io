function getMult(amount) {return mults[Math.min(Math.max(amount,1),15)];}
function fractionize(val) {if (!["0.125","0.25","0.5"].includes(val)) {return val} else {return "1/"+String(Number(1/val))}}
function getRating(crsa) {let total = 0;crsa.forEach(function(a){if (a=="-1") {return;}total += crs[(fractionize(a))];});return total*getMult(crsa.length);}
let crs = {"0":10,"1/8":25,"1/4":50,"1/2":100,"1":200,"2":450,"3":700,"4":1100,"5":1800,"6":2300,"7":2900,"8":3900,"9":5000,"10":5900,"11":7200,"12":8400,"13":10000,"14":11500,"15":13000,"16":15000,"17":18000,"18":20000,"19":22000,"20":25000,"21":33000,"22":41000,"23":50000,"24":62000,"25":75000,"26":90000,"27":105000,"28":120000,"29":135000,"30":155000};
let mults = {1:1,2:1.5,3:2,4:2,5:2,6:2,7:2.5,8:2.5,9:2.5,10:2.5,11:3,12:3,13:3,14:3,15:4};
let xps = {"1":[25,50,75,100],"2":[50,100,150,200],"3":[75,150,225,400],"4":[125,250,375,500],"5":[250,500,750,1100],"6":[300,600,900,1400],"7":[350,750,1100,1700],"8":[450,900,1400,2100],"9":[550,1100,1600,2400],"10":[600,1200,1900,2800],"11":[800,1600,2400,3600],"12":[1000,2000,3000,4500],"13":[1100,2200,3400,5100],"14":[1250,2500,3800,5700],"15":[1400,2800,4300,6400],"16":[1600,3200,4800,7200],"17":[2000,3900,5900,8800],"18":[2100,4200,6300,9500],"19":[2400,4900,7300,10900],"20":[2800,5700,8500,12700]};
function start() {
  let c = [];
  for (let dd = 0;dd < document.getElementsByClassName("inp").length;dd++) {
    let f = document.getElementsByClassName("inp")[dd];
    for (let i = 0;i < (Number(f.getElementsByClassName("n")[0].value)||0); i++) {
      c.push(f.firstElementChild.value||"-1");}}
  while (c.includes("-1")) {c.pop(c.indexOf("-1"));}
  let xp = getRating(c);
  let playerLevel = document.getElementById("playerLevel").value;
  let playerAmount = Number(document.getElementById("playerAmount").value);
  //easy, medium, hard, deadly
  let easy = xps[playerLevel][0]*playerAmount;let medium = xps[playerLevel][1]*playerAmount;let hard = xps[playerLevel][2]*playerAmount;let deadly = xps[playerLevel][3]*playerAmount;
  let difficulty = (xp<=easy)?"Easy":(xp<=medium)?"Medium":(xp<=hard)?"Hard":(xp<=deadly)?"Deadly":"Impossible";
  document.getElementById("output").innerHTML = "Rating: "+difficulty+"<br><br>"+xp+" xp<br>Easy: "+easy+" xp<br>Medium: "+medium+" xp<br>Hard: "+hard+" xp<br>Deadly: "+deadly+" xp";
  document.getElementById("output").innerHTML = document.getElementById("output").innerHTML.replaceAll(difficulty,("<b>"+difficulty+"<\/b>"));
}