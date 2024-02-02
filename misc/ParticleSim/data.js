"use strict";
const DATA = [
  {
    "index": 0,
    "name": "Air",
    "density": 0,
    "state": 1,
    "color": [
      255,
      255,
      255
    ]
  },
  {
    "index": 1,
    "name": "Sand",
    "density": 10,
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
    ]
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
    "state": 3,
    "color": [
      106,
      108,
      109
    ],
    "heat": 5
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
    ]
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
    ]
  },
  {
    "index": 14,
    "name": "Gunpowder",
    "density": 10,
    "state": 3,
    "color": [
      72,
      71,
      83
    ],
    "burnTemp": 15,
    "fuel": 100
  },
  {
    "index": 15,
    "name": "Phase Dust",
    "density": 101,
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
    "fuel": 100
  },
  {
    "index": 18,
    "name": "Soil",
    "density": 10,
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
    ]//,
    // "burnTemp": 40
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
      230,
      255,
      230
    ]
  },
]
// const ALL = []
// for (var i = 0; i < NAMES.length; i++) {
//   const final = {"index":i,"name":NAMES[i],"density":DENSITIES[i],"state":STATES[i],"color":[reds[i],greens[i],blues[i]]};
//   if (HEATS[i] != 0) {final.heat = HEATS[i];}
//   if (BURN_TEMP[i] != 1000) {final.burnTemp = BURN_TEMP[i];}
//   if (FUEL[i] != 0) {final.fuel = FUEL[i];}
//   ALL.push(final);
// }
const NAMES = [];
const STATES = [];
const DENSITIES = [];
const HEATS = [];
const BURN_TEMP = [];
const FUEL = [];
const reds = [];
const greens = [];
const blues = [];

for (const i of DATA) {
  NAMES.push(i.name);
  STATES.push(i.state);
  DENSITIES.push(i.density);
  reds.push(i.color[0]);
  greens.push(i.color[1]);
  blues.push(i.color[2]);
  HEATS.push(i.heat?i.heat:0);
  BURN_TEMP.push(i.burnTemp?i.burnTemp:1000);
  FUEL.push(i.fuel?i.fuel:0);
  document.getElementById(i.hidden?"hiddenBrushes":(i.state+"Options")).innerHTML += `<option>${i.name}</option>`;
}