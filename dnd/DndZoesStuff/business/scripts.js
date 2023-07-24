function roll2(a){if(!a.includes("d")&&!a.includes("+")){var t=parseInt(a);return isNaN(t)?0:Math.floor(Math.random()*t)+1}const r=a.split("+");let e=0;for(let a=0;a<r.length;a++){const o=r[a].trim();if(o.includes("d")){var[s,i,l]=o.replace("*","d").split("d").map(a=>parseInt(a));if(!isNaN(s)&&!isNaN(i)){let t=0;for(let a=0;a<s;a++){var n=Math.floor(Math.random()*i)+1;isNaN(n)||(t+=n)}isNaN(l)||(t*=l),e+=t}}else{l=parseInt(o);isNaN(l)||(e+=l)}}return e}
function join2(a) {
  if (a.length==0) return "nothing";
  if (a.length==1) return a[0];
  if (a.length==2) return `${a[0]} and ${a[1]}`;
  if (a.length>2) {let t = structuredClone(a);t[t.length-1] = "and "+t[t.length-1];return t.join(", ");}
}
function toMoney(val) {
  let valLeft = val;let final = {"gp":Math.floor(val),"sp":Math.round((Math.floor(val*10)/10-Math.floor(val))*10),"cp":Math.round((Math.round(val*100)/100-Math.floor(val*10)/10)*100)};let final2 = [];
  for (const w in final) {if (final[w] > 0) {final2.push(final[w]+" "+w);}}
  return join2(final2);
}

function run() {
  let cost = {"Shop":2,"Abbey":20,"Farm":0.5,"Town or city guildhall":5,"Rural roadside inn":10,"Town or city inn":5,"Keep or small castle":100,"Hunting lodge":0.5,"Noble estate":10,"Outpost or fort":50,"Palace or large castle":400,"Large temple":25,"Small temple":1,"Fortified tower":25,"Trading post":10}[document.getElementById("tableTable").value];
  let days = Number(document.getElementById("days").value);let dayBonus = days>30?30:days;
  let roll = Math.ceil(Math.random()*100)+dayBonus;
  let val = "";
  if (roll < 21) {
    val = `You must pay ${toMoney(cost*days*1.5)}.`;
  } else if (roll < 31) {
    val = `You must pay ${toMoney(cost*days)}.`;
  } else if (roll < 41) {
    val = `You must pay ${toMoney(cost*days*0.5)}. Profits cover the rest.`;
  } else if (roll < 61) {
    val = `The business covers its own maintenance cost for each of the days.`;
  } else if (roll < 81) {
    val = `The business covers its own maintenance cost for each of the days. It earns a profit of ${toMoney(roll2('1d6*5'))}.`;
  } else if (roll < 91) {
    val = `The business covers its own maintenance cost for each of the days. It earns a profit of ${toMoney(roll2('2d8*5'))}.`;
  } else {
    val = `The business covers its own maintenance cost for each of the days. It earns a profit of ${toMoney(roll2('3d10*5'))}.`;
  }
  document.getElementById("output").innerHTML = val;
  document.getElementById("load").innerHTML = "";
}
