function calculateDC() {
  return target;
  return ((roll(10) * 2) + 5);
}
function print(arg) {
  document.getElementById("output").innerHTML += arg+"<br>";
}
function roll(die) {
  return Math.floor(Math.random() * die) + 1;
}
function start(){document.getElementById("output").innerHTML = "";const BONUS = [Number(document.getElementById("bonus1").value), Number(document.getElementById("bonus2").value), Number(document.getElementById("bonus3").value)];
  const ADVANTAGE = [document.getElementById("adv1").checked, document.getElementById("adv2").checked, document.getElementById("adv3").checked];
  const SIMS = 10000;
  const target = Number(document.getElementById("target").value);
  const total = {0: 0, 1: 0, 2: 0, 3: 0};
  let total2 = 0;
  
  for (let t = 0; t < SIMS; t++) {
    let count = 0;
    for (let i = 0; i < BONUS.length; i++) {
      const rollResult = roll(20);
      const finalRoll = ADVANTAGE[i] ? Math.max(rollResult, roll(20)) : rollResult;
      if ((finalRoll + BONUS[i]) >= target) {
        count++;
      }
      total2 += target;
    }
    total[count]++;
  }
  
  for (let t in total) {
    print(t + ": " + (total[t] / (SIMS/100)) + "%");
  }
  
  const tt = Object.values(total).reduce(function(acc, val,i){return acc+(val*i)});
  print(tt / SIMS);}