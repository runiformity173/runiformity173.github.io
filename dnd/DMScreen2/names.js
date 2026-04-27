const choose = o=>o[Math.floor(Math.random()*o.length)];
const capitalize = o=>o[0].toUpperCase()+o.slice(1).toLowerCase();
function generateName() {
  return generateNameThreeTables();
}
function generateNameThreeTables() {
  const [startTable,middleTable,endTable] = tables.tableGroup[11].tables.map(o=>o.rows.map(k=>k[1]))
  return capitalize((choose(startTable) + choose(middleTable) + choose(endTable)).replaceAll(/[—-]/g,""));
}