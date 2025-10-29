"use strict";
const DATA = [
  {
    "index": 0,
    "name": "Air",
    "density": 0,
    "state": 1,
    "color": [
      33,
      37,
      41
    ]
  },
  {
    "index": 1,
    "name": "Sand",
    "density": 10,
    "friction":0.25,
    "state": 3,
    "color": [
      222,
      192,
      96
    ],
    "burnTemp": 25
  },
  {
    "index": 2,
    "name": "Water",
    "density": 5,
    "state": 2,
    "color": [
      3,
      8,
      252
    ],
    "spread":{
      // "18":[16,0],
      "1":[23,0,0.05]
    }
  },
  {
    "index": 3,
    "name": "Oil",
    "density": 4,
    "state": 2,
    "color": [
      149,
      62,
      0
    ],
    "burnTemp": 15,
    "fuel": 100
  },
  {
    "index": 4,
    "name": "Stone",
    "density": 100,
    "state": 4,
    "color": [
      128,
      128,
      128
    ]
  },
  {
    "index": 5,
    "name": "Wood",
    "density": 50,
    "state": 4,
    "color": [
      161,
      102,
      47
    ],
    "burnTemp": 30,
    "fuel": 50
  },
  {
    "index": 6,
    "name": "Steam",
    "density": -5,
    "state": 1,
    "color": [
      180,
      190,
      210
    ],
    "heat": 10
  },
  {
    "index": 7,
    "name": "Fire",
    "density": -1,
    "state": 1,
    "color": [
      161,
      102,
      47
    ],
    "heat": 100,
    "fuel": 100
  },
  {
    "index": 8,
    "name": "Ash",
    "density": 10,
    "friction": 0.5,
    "state": 3,
    "color": [
      106,
      108,
      109
    ],
    "heat": 5,
    "hidden":true
  },
  {
    "index": 9,
    "name": "Glass",
    "density": 50,
    "state": 4,
    "color": [
      235,
      230,
      225
    ],
    "hidden":true
  },
  {
    "index": 10,
    "name": "Molten Glass",
    "density": 6,
    "state": 2,
    "color": [
      230,
      230,
      230
    ],
    "heat": 25,
    "hidden":true
  },
  {
    "index": 11,
    "name": "Plasma",
    "density": 100,
    "state": 4,
    "color": [
      255,
      200,
      150
    ],
    "heat": 100,
    "fuel": 100
  },
  {
    "index": 12,
    "name": "Fuse",
    "density": 50,
    "state": 4,
    "color": [
      215,
      215,
      205
    ],
    "burnTemp": 10,
    "fuel": 50
  },
  {
    "index": 13,
    "name": "Spring",
    "density": 100,
    "state": 4,
    "color": [
      53,
      58,
      252
    ],
    "spread":{
      "0":[2,13]
    }
  },
  {
    "index": 14,
    "name": "Gunpowder",
    "density": 10,
    "friction":0.1,
    "state": 3,
    "color": [
      72,
      71,
      83
    ],
    "burnTemp": 15,
    "fuel": 100,
    "explosion":5,
    "spread":{
      25:[28,0,1],
      26:[28,0,1],
      28:[28,0]
    }
  },
  {
    "index": 15,
    "name": "Phase Dust",
    "density": 101,
    "friction":0.1,
    "state": 3,
    "color": [
      0,
      0,
      0
    ],
    "hidden":true
  },
  {
    "index": 16,
    "name": "Plant",
    "density": 50,
    "state": 4,
    "color": [
      75,
      230,
      75
    ],
    "burnTemp": 30,
    "fuel": 40
  },
  {
    "index": 17,
    "name": "Methane",
    "density": -10,
    "state": 1,
    "color": [
      190,
      190,
      200
    ],
    "burnTemp": 1,
    "fuel": 100,
    "explosion":5
  },
  {
    "index": 18,
    "name": "Soil",
    "density": 10,
    "friction": 0.2,
    "state": 3,
    "color": [
      155,
      118,
      83
    ]
  },
  {
    "index": 19,
    "name": "Ice",
    "density": 50,
    "state": 4,
    "color": [
      200,
      200,
      255
    ],
    "spread": {
      "2":[19,19]
    }
  },
  {
    "index": 20,
    "name": "Lava",
    "density": 10,
    "state": 2,
    "color": [
      255,
      200,
      64
    ],
    "heat":100
  },
  {
    "index": 21,
    "name": "Poison",
    "density": 0,
    "state": 1,
    "color": [
      33,
      60,
      41
    ],
    "spread":{
      "0":[21,21],
      "16":[21,21],
      "25":[26,21]
    }
  },
  {
    "index": 22,
    "name": "C4",
    "density": 50,
    "state": 4,
    "color": [
      230,
      230,
      200
    ],
    "burnTemp": 1,
    "fuel": 100,
    "explosion":5
  },
  {
    "index": 23,
    "name": "Wet Sand",
    "density": 11,
    "friction":0.5,
    "state": 3,
    "color": [
      202,
      172,
      76
    ],
    "burnTemp": 50,
    "hidden": true,
    "alias": 1
  },
  {
    "index": 24,
    "name": "Bamboo Seeds",
    "density": 9,
    "state": 3,
    "color": [
      140,
      202,
      76
    ],
    "burnTemp": 10,
    "fuel":50,
    "spread":{
      18:[18,25,1,[2]],
      26:[26,0,1,[2]],
      27:[27,0,1,[2]]

    }
  },
  {
    "index": 25,
    "name": "Bamboo Shoot",
    "density": 50,
    "state": 4,
    "color": [
      100,
      202,
      76
    ],
    "burnTemp": 10,
    "fuel":50,
    "spread":{
      0:[[25,26,0.1,[0]],[27,25,0.01,[1,3]]],
      24:[25,26,0.1,[0]],
      25:[25,26,0.1,[0]]
    },
    "alias":26,
    "hidden":true
  },
  {
    "index": 26,
    "name": "Bamboo",
    "density": 50,
    "state": 4,
    "color": [
      100,
      202,
      76
    ],
    "burnTemp": 10,
    "fuel":50,
    "hidden":true
  },
  {
    "index": 27,
    "name": "Bamboo Leaf",
    "density": 50,
    "state": 4,
    "color": [
      100,
      202,
      76
    ],
    "burnTemp": 10,
    "fuel":50,
    "hidden":true,
    "alias":26,
    "spread":{
      0:[24,26,0.01,[1,3]]
    }
  },
  {
    "index": 28,
    "name": "Fireworks",
    "density": 50,
    "state": 4,
    "color": [
      100,
      202,
      76
    ],
    "burnTemp": 15,
    "fuel": 100,
    "explosion":5,
    "hidden":true
  }
];
const NAMES = [];
const STATES = [];
const DENSITIES = [];
const FRICTIONS = [];
const HEATS = [];
const BURN_TEMP = [];
const EXPLOSION = [];
const SPREADS = [];
const ALIAS = [];

const FUEL = [];
const reds = [];
const greens = [];
const blues = [];

for (const i of DATA) {
  NAMES.push(i.name);
  STATES.push(i.state);
  DENSITIES.push(i.density);
  FRICTIONS.push(i.friction);
  SPREADS.push(i.spread!==undefined?i.spread:{});

  ALIAS.push(i.alias?i.alias:i.index);

  reds.push(i.color[0]);
  greens.push(i.color[1]);
  blues.push(i.color[2]);
  HEATS.push(i.heat?i.heat:0);
  BURN_TEMP.push(i.burnTemp?i.burnTemp:1000);
  EXPLOSION.push(i.explosion?i.explosion:0);
  FUEL.push(i.fuel?i.fuel:0);
  document.getElementById(i.hidden?"hiddenBrushes":(i.state+"Options")).innerHTML += `<option${i.hidden?" class='hiddenBrush' style='display:none;'":""} value="${i.name}">${i.name}</option>`;
}
document.getElementById("3Options").firstElementChild.selected = true;
document.querySelector("option[value='Soil']").parentNode.insertBefore(document.querySelector("option[value='Soil']"), document.querySelector("option[value='Gunpowder']"));