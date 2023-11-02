let og_points = [[5,495],[5,5],[495,5],[495,495]];
let og_lines = [];
let lines = [];
let points = [];
function lerp(x1,y1,x2,y2,t) {
  return [x1+(x2-x1)*t,y1+(y2-y1)*t];
}
function polygonPoints(sides, height=490, width=490) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width / 2, height / 2);
  const angleIncrement = (2 * Math.PI) / sides;
  const angleOffset = Math.PI / 2 + (Math.PI/sides);
  const points2 = [];
  let maxY = -1;
  for (let i = 0; i < sides; i++) {
    const angle = angleOffset + i * angleIncrement;
    const x = Math.round(centerX + radius * Math.cos(angle)) + 5;
    const y = Math.round(centerY + radius * Math.sin(angle)) + 5;
    points2.push([x, y]);
    maxY = Math.max(maxY,y);
  }
  
  return points2.map((a)=>([a[0],a[1]+495-maxY]));
}
og_points = polygonPoints(4);

function interpolate(t,updateSlider=false) {
  if (updateSlider) {
    document.getElementById("point").value = t;
  }
  let lastPoints = og_points;
  points = structuredClone(og_points);
  lines = structuredClone(og_lines);
  var counter = 0;
  for (var k = 0;k<og_points.length;k++) {
    const newPoints = [];
    for (var i = 0;i<lastPoints.length-1;i++) {
      const w = lerp(lastPoints[i][0],lastPoints[i][1],lastPoints[i+1][0],lastPoints[i+1][1],t);
      newPoints.push(w);
      points.push(w);
      lines.push([counter++,counter]);
    }
    counter++;
    lastPoints = newPoints;
  }
}