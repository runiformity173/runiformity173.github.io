const COLORS = {"sea":"#0000ff","plains":"#00ff00","coast":"#ffff00","hills":"#00aa00","mountains":"#323232"}
const table = {
  "sea":[
    {"sea":7,"coast":1}
  ],
  "coast":[
    {"plains":10,"sea":1},
    {"plains":1,"sea":10},
    {"plains":10,"sea":1},
    {"plains":1,"sea":10}
  ],
  "plains":[
    {"plains":7,"coast":1,"hills":1}
  ],
  "hills":[
    {"hills":7,"plains":1,"mountains":1}
  ],
  "mountains":[
    {"hills":1,"mountains":3}
  ]
}

let template = {
  
  "test":[
    {},
    {},
    {},
    {}
  ]
  
}

for (const i in table) {while (table[i].length < 4) {table[i].push(table[i][0]);}}
function isObject(a) {return (typeof a === 'object' && !Array.isArray(a) && a !== null)}
let uncollapsedCell = {};
for (const i in table) {

    uncollapsedCell[i] = 1;
}
console.log(uncollapsedCell);