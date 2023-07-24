let skyrimArmors = {};
let skyrimWeapons = {};
// Magic damage, stamina damage, Banish, paralyze, soul trap
// Absorb magic
// Description for turning
let skyrimWeaponLevels = { "absorb": ["Absorption", "Consuming", "Devouring", "Leeching", "the Vampire"], "absorbMagic": ["Siphoning", "Harrowing", "Winnowing", "Evoking", "the Sorcerer"], "absorbStamina": ["Gleaning", "Reaping", "Harvesting", "Garnering", "Subsuming"], "elementalDamage": { "Fire": ["Embers", "Burning", "Scorching", "Fire", "the Blaze", "the Inferno"], "Cold": ["Cold", "Frost", "Ice", "Freezing", "Blizzards", "Winter"], "Lightning": ["Sparks", "Arcing", "Shocks", "Thunderbolts", "Lightning", "Storms"] }, "fear": ["Dismay", "Cowardice", "Fear", "Despair", "Dread", "Terror"], "turn": ["Blessed", "Sanctified", "Reverent", "Hallowed", "Virtuous", "Holy"] };
let skyrimArmorLevels = { "skill": ["Minor ", "", "Major ", "Eminent ", "Extreme ", "Peerless "], "carry": ["Lifting", "Hauling", "Strength", "Brawn", "the Ox", "the Mammoth"], "regen": ["", "", "Remedy", "Mending", "Regeneration", "Revival"], "stamina_regen": ["", "", "Recuperation", "Rejuvination", "Invigoration", "Renewal"], "muffle": ["Muffling"], "disease": ["Disease Resistance", "Disease Immunity"], "resistance": ["Waning {}", "Dwindling {}", "{} Suppression", "{} Abatement", "{immunity}"], "immunity": { "Fire": "the Firewalker", "Cold": "Warmth", "Lightning": "Grounding", "Acid": "the Alchemist", "Poison": "the Viper", "Thunder": "the Stormfront" }, "waterbreathing": ["Waterbreathing", "Waterbreathing", "Waterbreathing", "Waterbreathing", "Waterbreathing", "Waterbreathing", "Waterbreathing", "the Fishies"] }
let skills = { "Athletics": ["Athletics"], "Acrobatics": ["Acrobatics"], "Sleight of Hand": ["Sleight of Hand", "Deft Hands"], "Stealth": ["Stealth", "Sneaking"], "Arcana": ["Arcana"], "History": ["History"], "Investigation": ["Investigation"], "Nature": ["Nature"], "Religion": ["Religion"], "Animal Handling": ["Animal Handling"], "Insight": ["Insight"], "Medicine": ["Medicine"], "Perception": ["Perception"], "Survival": ["Survival"], "Deception": ["Deception"], "Intimidation": ["Intimidation"], "Performance": ["Performance"], "Persuasion": ["Persuasion"] };
let armors = ["Leather Armor", "Studded Leather", "Padded Armor", "Hide Armor", "Ring Mail", "Half Plate", "Full Plate", "Scale Mail", "Chain Mail", "Breastplate", "Splint Mail", "Shield"]
let weapons = ["Club", "Dagger", "Greatclub", "Handaxe", "Javelin", "Light Hammer", "Mace", "Quarterstaff", "Sickle", "Spear", "Light Crossbow", "Dart", "Shortbow", "Sling", "Battleaxe", "Flail", "Glaive", "Greataxe", "Greatsword", "Halberd", "Lance", "Longsword", "Maul", "Morningstar", "Pike", "Rapier", "Scimitar", "Shortsword", "Trident", "War Pick", "Warhammer", "Whip", "Blowgun", "Hand Crossbow", "Heavy Crossbow", "Longbow", "Net"]
let choose = function(o) { if (Array.isArray(o)) return o[Math.floor(Math.random() * o.length)]; return choose(Object.keys(o)); }

function armor(want = false) {
  let final = choose(armors) + " of ";
  let description = [""];
  let enchantment = choose(["skill", "skill", "resistance", "special"]);
  let ench = "";
  if (enchantment == "skill") {
    const skill = choose(skills);
    let level = Math.floor(Math.random() * 6);
    final += skyrimArmorLevels["skill"][level] + choose(skills[skill]);
    description.push(level < 3 ? `Gives a +${level + 1} to ${skill} checks.` : (level < 5 ? `Gives advantage on ${skill} checks.` : `When making a ${skill} check, treat any roll lower than a 10 on the die as a 10.`));
  } else if (enchantment == "resistance") {
    const type = choose(skyrimArmorLevels["immunity"]);
    let level = Math.floor(Math.random() * 5);
    final += level < 4 ? skyrimArmorLevels["resistance"][level].replace("{}", type) : skyrimArmorLevels["immunity"][type];
    description.push(level < 4 ? `Gives resistance to ${type.toLowerCase()} damage.` : `Gives immunity to ${type.toLowerCase()} damage.`);
  } else if (enchantment == "special") {
    ench = choose(["carry", "muffle", "carry", "waterbreathing"]);
    if (ench == "carry") {
      let level = Math.floor(Math.random() * 6);
      final += skyrimArmorLevels["carry"][level];
      description.push("You count as one size larger when determining lifting or carrying strength.");
    } else if (ench == "waterbreathing") {
      final += choose(skyrimArmorLevels["waterbreathing"]);
      description.push("You can breath underwater as well as on land.");
    } else if (ench == "muffle") {
      final += choose(skyrimArmorLevels["muffle"]);
      description.push("You make very little sound when you move. You have advantage on Stealth checks to avoid being heard.");
    }
  }
  if (enchantment != "resistance" && ench != "muffle") { let nd = structuredClone(description); description = [" (requires attunement)"]; for (const t of nd) { if (t != "") { description.push(t); } } }
  if (want && !(final + "<br>" + description.join("<br>")).includes(want)) {
    return false;
  }
  document.getElementById("output").innerHTML = "<h3>" + final + "</h3><p></p>";
  document.getElementById("output").lastChild.innerHTML = description.join("<br>");
  return true;
}

function weapon(want = false) {
  let final = choose(weapons);
  let description = [""];
  let enchantment = choose(["elementalDamage","elementalDamage","elementalDamage","fear","turn","absorb","absorbStamina"]);
  let ench = "";
  if (enchantment == "elementalDamage") {
    final += " of ";
    const type = choose(skyrimWeaponLevels["elementalDamage"]);
    let level = Math.floor(Math.random() * 6);
    final += skyrimWeaponLevels["elementalDamage"][type][level];
    let amount = ["1","1d4","1d6","1d8","1d10","1d12"][level];
    description.push(`When this weapon scores a critical hit, the target takes an additional ${amount} ${type.toLowerCase()} damage.`);
  } else if (enchantment == "absorb") {
    final += " of ";
    let level = Math.floor(Math.random() * 5);
    final += skyrimWeaponLevels["absorb"][level];
    let amount = ["1d4","1d6","1d8","1d10","1d12"][level];
    description.push(`When this weapon scores a critical hit, the target takes an additional ${amount} necrotic damage, and its wielder regains that many hit points.`);
  } else if (enchantment == "fear") {
    final += " of ";
    let level = Math.floor(Math.random() * 6);
    final += skyrimWeaponLevels["fear"][level];
    let amount = [11,12,13,14,15,16][level];
    description.push(`When this weapon scores a critical hit, the target must succeed on a DC ${amount} Wisdom save or be frightened until the beginning of your next turn.`);
  } else if (enchantment == "absorbStamina") {
    final += " of ";
    let level = Math.floor(Math.random() * 5);
    final += skyrimWeaponLevels["absorbStamina"][level];
    let amount = ["1d4","1d6","1d8","1d10","1d12"][level];
    description.push(`When this weapon scores a critical hit, its wielder gains ${amount} temporary hit points. Additionally, the target's movement speed is halved and it cannot take reactions, both until the beginning of your next turn.`);
  } else if (enchantment == "turn") {
    let level = Math.floor(Math.random() * 6);
    final = skyrimWeaponLevels["turn"][level] + " " + final;
    let amount = [11,12,13,14,15,16][level];
    description.push(`When this weapon scores a critical hit against an undead, the undead must succeed on a DC ${amount} saving throw wor literally be turned`);
  }
  if (enchantment != "elementalDamage") { let nd = structuredClone(description); description = [" (requires attunement)"]; for (const t of nd) { if (t != "") { description.push(t); } } }

  if (want && !(final + "<br>" + description.join("<br>")).includes(want)) {
    return false;
  }
  document.getElementById("output").innerHTML = "<h3>" + final + "</h3><p></p>";
  document.getElementById("output").lastChild.innerHTML = description.join("<br>");
  return true;
}


function get(x = "Deft Hands") {
  while (!weapon(x)) { }
}