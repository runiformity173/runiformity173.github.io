const animals = [
    {
      "name": "Ape",
      "speeds": "climb",
      "cr": 0.5
    },
    {
      "name": "Axe Beak",
      "speeds": "",
      "cr": 0.25
    },
    {
      "name": "Baboon",
      "speeds": "climb",
      "cr": 0
    },
    {
      "name": "Badger",
      "speeds": "burrow",
      "cr": 0
    },
    {
      "name": "Bat",
      "speeds": "fly",
      "cr": 0
    },
    {
      "name": "Black Bear",
      "speeds": "climb",
      "cr": 0.5
    },
    {
      "name": "Blood Hawk",
      "speeds": "fly",
      "cr": 0.125
    },
    {
      "name": "Boar",
      "speeds": "",
      "cr": 0.25
    },
    {
      "name": "Brown Bear",
      "speeds": "climb",
      "cr": 1
    },
    {
      "name": "Camel",
      "speeds": "",
      "cr": 0.125
    },
    {
      "name": "Cat",
      "speeds": "climb",
      "cr": 0
    },
    {
      "name": "Constrictor Snake",
      "speeds": "swim",
      "cr": 0.25
    },
    {
      "name": "Crab",
      "speeds": "swim",
      "cr": 0
    },
    {
      "name": "Crocodile",
      "speeds": "swim",
      "cr": 0.5
    },
    {
      "name": "Deer",
      "speeds": "",
      "cr": 0
    },
    {
      "name": "Dire Wolf",
      "speeds": "",
      "cr": 1
    },
    {
      "name": "Draft Horse",
      "speeds": "",
      "cr": 0.25
    },
    {
      "name": "Eagle",
      "speeds": "fly",
      "cr": 0
    },
    {
      "name": "Elk",
      "speeds": "",
      "cr": 0.25
    },
    {
      "name": "Flying Snake",
      "speeds": "fly,swim",
      "cr": 0.125
    },
    {
      "name": "Frog",
      "speeds": "swim",
      "cr": 0
    },
    {
      "name": "Giant Badger",
      "speeds": "burrow",
      "cr": 0.25
    },
    {
      "name": "Giant Bat",
      "speeds": "fly",
      "cr": 0.25
    },
    {
      "name": "Giant Centipede",
      "speeds": "climb",
      "cr": 0.25
    },
    {
      "name": "Giant Crab",
      "speeds": "swim",
      "cr": 0.125
    },
    {
      "name": "Giant Eagle",
      "speeds": "fly",
      "cr": 1
    },
    {
      "name": "Giant Fire Beetle",
      "speeds": "",
      "cr": 0
    },
    {
      "name": "Giant Frog",
      "speeds": "swim",
      "cr": 0.25
    },
    {
      "name": "Giant Goat",
      "speeds": "",
      "cr": 0.5
    },
    {
      "name": "Giant Hyena",
      "speeds": "",
      "cr": 1
    },
    {
      "name": "Giant Lizard",
      "speeds": "climb,swim",
      "cr": 0.25
    },
    {
      "name": "Giant Octopus",
      "speeds": "swim",
      "cr": 1
    },
    {
      "name": "Giant Owl",
      "speeds": "fly",
      "cr": 0.25
    },
    {
      "name": "Giant Poisonous Snake",
      "speeds": "swim",
      "cr": 0.25
    },
    {
      "name": "Giant Rat",
      "speeds": "",
      "cr": 0.125
    },
    {
      "name": "Giant Sea Horse",
      "speeds": "swim",
      "cr": 0.5
    },
    {
      "name": "Giant Spider",
      "speeds": "climb",
      "cr": 1
    },
    {
      "name": "Giant Toad",
      "speeds": "swim",
      "cr": 1
    },
    {
      "name": "Giant Vulture",
      "speeds": "fly",
      "cr": 1
    },
    {
      "name": "Giant Wasp",
      "speeds": "fly",
      "cr": 0.5
    },
    {
      "name": "Giant Weasel",
      "speeds": "",
      "cr": 0.125
    },
    {
      "name": "Giant Wolf Spider",
      "speeds": "climb",
      "cr": 0.25
    },
    {
      "name": "Goat",
      "speeds": "",
      "cr": 0
    },
    {
      "name": "Hawk",
      "speeds": "fly",
      "cr": 0
    },
    {
      "name": "Hyena",
      "speeds": "",
      "cr": 0
    },
    {
      "name": "Jackal",
      "speeds": "",
      "cr": 0
    },
    {
      "name": "Lion",
      "speeds": "",
      "cr": 1
    },
    {
      "name": "Lizard",
      "speeds": "climb",
      "cr": 0
    },
    {
      "name": "Mastiff",
      "speeds": "",
      "cr": 0.125
    },
    {
      "name": "Mule",
      "speeds": "",
      "cr": 0.125
    },
    {
      "name": "Octopus",
      "speeds": "swim",
      "cr": 0
    },
    {
      "name": "Owl",
      "speeds": "fly",
      "cr": 0
    },
    {
      "name": "Panther",
      "speeds": "climb",
      "cr": 0.25
    },
    {
      "name": "Poisonous Snake",
      "speeds": "swim",
      "cr": 0.125
    },
    {
      "name": "Pony",
      "speeds": "",
      "cr": 0.125
    },
    {
      "name": "Quipper",
      "speeds": "swim",
      "cr": 0
    },
    {
      "name": "Rat",
      "speeds": "",
      "cr": 0
    },
    {
      "name": "Raven",
      "speeds": "fly",
      "cr": 0
    },
    {
      "name": "Reef Shark",
      "speeds": "swim",
      "cr": 0.5
    },
    {
      "name": "Riding Horse",
      "speeds": "",
      "cr": 0.25
    },
    {
      "name": "Scorpion",
      "speeds": "",
      "cr": 0
    },
    {
      "name": "Sea Horse",
      "speeds": "swim",
      "cr": 0
    },
    {
      "name": "Spider",
      "speeds": "climb",
      "cr": 0
    },
    {
      "name": "Tiger",
      "speeds": "",
      "cr": 1
    },
    {
      "name": "Vulture",
      "speeds": "fly",
      "cr": 0
    },
    {
      "name": "Warhorse",
      "speeds": "",
      "cr": 0.5
    },
    {
      "name": "Weasel",
      "speeds": "",
      "cr": 0
    },
    {
      "name": "Wolf",
      "speeds": "",
      "cr": 0.25
    },
    {
      "name": "Pteranodon",
      "speeds": "fly",
      "cr": 0.25
    }
  ];