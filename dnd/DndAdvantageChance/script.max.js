let final = 0;
let final2 = 0;
function start() {
  final = 0;
  final2 = 0;
  let target = Number(document.getElementById("target").value);
  if (document.getElementById("disadvantage").checked) {
  for (let i = 1; i<21; i++) {
    for (let j = 1; j < 21; j++) {
      if (Math.min(i,j)>=target) {
        final++;
      }
    }
  }}
  else if (document.getElementById("advantage").checked) {
  for (let i = 1; i<21; i++) {
    for (let j = 1; j < 21; j++) {
      if (Math.max(i,j)>=target) {
        final++;}}}}
  else {
  for (let i = 1; i<21; i++) {
    for (let j = 1; j < 21; j++) {
      if (i>=target) {
        final++;
      }
    }
  }}
  for (let i = 1; i<21; i++) {
    final2 += (i>=target)?1:0;
  }
  let dif = (final/4)-(final2*5);
  document.getElementById("output").innerHTML = "Chance with modifier: "+String(final/(4))+"%"+"<br>Difference from without modifier: "+((final2*5<=final/4)?"+":"-")+String(Math.abs(dif))+"%<br>Equivilant Bonus: "+((final2*5<=final/4)?"+":"-")+String(Math.abs(dif/5));
}