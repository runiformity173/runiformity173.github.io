let feats = JSON.parse(JSON.stringify(allFeats));
function lower(s) {if (typeof s != "string") {return s;} return s.toLowerCase();}
let filterScore = "";
function start() {
  feats = JSON.parse(JSON.stringify(allFeats));
  filterScore = "";
  filterScore = document.querySelector('input[name="score"]:checked').value;
  feats = feats.filter(filterByScore)
  document.getElementById("output").innerHTML = "";
  for (let f of feats){
    const node = document.createElement("a");
const textnode = document.createTextNode(f["name"]+"");
node.appendChild(textnode);
    node.href = "display/?feat="+f["name"].toLowerCase().replaceAll(" ","-");
    node.target = "_blank";
document.getElementById("output").appendChild(node);
    document.getElementById("output").appendChild(document.createElement("br"));

  }
}
function filterByScore(a) {
  return (a["scores"].includes(filterScore))
}
