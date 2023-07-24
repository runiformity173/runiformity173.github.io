function hoard0() {
  let final = "";
  final += String((roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6))*100);
  final += " copper pieces<br>";
  final += String((roll(6)+roll(6)+roll(6))*100);
  final += " silver pieces<br>";
  final += String((roll(6)+roll(6))*10);
  final += " gold pieces<br>";
  final += eval(itemTable("treasures/hoard0"));
  return final;
}
function hoard5() {
  let final = "";
  final += String((roll(6)+roll(6))*100);
  final += " copper pieces<br>";
  final += String((roll(6)+roll(6))*1000);
  final += " silver pieces<br>";
  final += String((roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6))*100);
  final += " gold pieces<br>";
  final += String((roll(6)+roll(6)+roll(6))*10);
  final += " platinum pieces<br>";
  final += eval(itemTable("treasures/hoard5"));
  return final;
}
function hoard11() {
  let final = "";
  final += String((roll(6)+roll(6)+roll(6)+roll(6))*1000);
  final += " gold pieces<br>";
  final += String((roll(6)+roll(6)+roll(6)+roll(6)+roll(6))*100);
  final += " platinum pieces<br>";
  final += eval(itemTable("treasures/hoard11"));
  return final;
}
function hoard17() {
  let final = "";
  final += String((roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6))*1000);
  final += " gold pieces<br>";
  final += String((roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6)+roll(6))*1000);
  final += " platinum pieces<br>";
  final += eval(itemTable("treasures/hoard17"));
  return final;
}
function individual0() {
  let final = "";
  final += eval(itemTable("treasures/individual0"));
  return final;
}
function individual5() {
  let final = "";
  final += eval(itemTable("treasures/individual5"));
  return final;
}
function individual11() {
  let final = "";
  final += eval(itemTable("treasures/individual11"));
  return final;
}
function individual17() {
  let final = "";
  final += eval(itemTable("treasures/individual17"));
  return final;
}
function monster(type) {
  return parseRolls(itemTable("encounters/"+type))
}
function hoardWyrmling() {
  let dragon = "wyrmling";
  let final = "<h3>Coins</h3>";
  final += String(roll("12d6")*100);
  final += " copper pieces<br>";
  final += String(roll("6d6")*100);
  final += " silver pieces<br>";
  final += String(roll("4d6")*10);
  final += " gold pieces";
  final += "<h3>Mundane Items</h3>";
  final += mundane(roll("1d6"));
  final += "<h3>Gems</h3>";
  final += dragonGems(roll("2d8"),dragon);
  final += "<h3>Art Objects</h3>";
  final += dragonArt(roll("1d4"),dragon);
  final += "<h3>Magic Items</h3>";
  final += dragonItems(roll("1d8"),dragon);
  return final;
}
function hoardYoung() {
  let dragon = "young";
  let final = "<h3>Coins</h3>";
  final += String(roll("12d6")*100);
  final += " copper pieces<br>";
  final += String(roll("4d6")*1000);
  final += " silver pieces<br>";
  final += String(roll("12d6")*100);
  final += " gold pieces<br>";
  final += String(roll("6d6")*10);
  final += " platinum pieces";
  final += "<h3>Mundane Items</h3>";
  final += mundane(roll("1d8"));
  final += "<h3>Gems</h3>";
  final += dragonGems(roll("6d6"),dragon);
  final += "<h3>Art Objects</h3>";
  final += dragonArt(roll("2d4"),dragon);
  final += "<h3>Magic Items</h3>";
  final += dragonItems(roll("1d8"),dragon);
  return final;
}
function hoardAdult() {
  let dragon = "adult";
  let final = "<h3>Coins</h3>";
  final += String(roll("12d6")*100);
  final += " copper pieces<br>";
  final += String(roll("4d6")*1000);
  final += " silver pieces<br>";
  final += String(roll("8d6")*1000);
  final += " gold pieces<br>";
  final += String(roll("10d6")*100);
  final += " platinum pieces";
  final += "<h3>Mundane Items</h3>";
  final += mundane(roll("2d6"));
  final += "<h3>Gems</h3>";
  final += dragonGems(roll("6d6"),dragon);
  final += "<h3>Art Objects</h3>";
  final += dragonArt(roll("3d6"),dragon);
  final += "<h3>Magic Items</h3>";
  final += dragonItems(roll("1d8"),dragon);
  return final;
}
function hoardAncient() {
  let dragon = "ancient";
  let final = "<h3>Coins</h3>";
  final += String(roll("12d6")*100);
  final += " copper pieces<br>";
  final += String(roll("4d6")*1000);
  final += " silver pieces<br>";
  final += String(roll("6d6")*10000);
  final += " gold pieces<br>";
  final += String(roll("12d6")*1000);
  final += " platinum pieces";
  final += "<h3>Mundane Items</h3>";
  final += mundane(roll("2d8"));
  final += "<h3>Gems</h3>";
  final += dragonGems(roll("6d6"),dragon);
  final += "<h3>Art Objects</h3>";
  final += dragonArt(roll("2d10"),dragon);
  final += "<h3>Magic Items</h3>";
  final += dragonItems(roll("2d6"),dragon);
  return final;
}
function itemTable(table,num=1,arr=false,roll1=null) {
  if (num>1){
    final = [];
    for (let i = 0;i<num;i++) {
      final.push(itemTable(table,1,false,roll1));
    }
    return final;}
  let loaded = loadFile("tables/"+table+".txt").split("\n");
  if (roll1 == null){roll1 = roll(eval(loaded[0]));}
  loaded.shift();
  for (let i = loaded.length-1;i>=0;i--) {
    if (roll1 >= Number(loaded[i].split(" ")[0])) {
      let line = loaded[i].split(" ");
      line.shift();
      if (!arr) {
      return String(line.join(" "));
      }
      else {
        return [String(line.join(" "))]
      }
    }
  }
}
function parseRolls(text) {
  let mathRegex = /\d+d\d+\s*\+*\s*\d*/g;
  let matches = text.match(mathRegex);
  let final = text;
  if (matches!==null) {
    for (let i = 0;i < matches.length; i++) {
      let t = matches[i].split("+");
      t.push("0");
      let new1 = [];
      t.forEach(function(d){new1.push(d.replace(" ",""))});
      t = roll(new1[0])+Number(new1[1]);
      if (matches[i].slice(-1)==" ") {
        t+=" ";
      }
      final = final.replace(matches[i],t);
    }}
  return final;
}
function gem(val,amount){
  if (typeof amount == "number") {return gem(val,`${amount}d1`)}
  let t = amount.split("d");
  let rolls = Number(t[0]);
  let f = Number(t[1])
  let final = 0;
  for (let i = 0; i < rolls; i++) {
    final += roll(f);
  }
  return String(final)+" "+itemTable("treasures/gem"+val)+" worth "+val+"gp"+(final>1?" each":"")+"<br>";
}
function art(val,amount){
  if (typeof amount == "number") {return art(val,`${amount}d1`)}
  let t = amount.split("d");
  let rolls = Number(t[0]);
  let f = Number(t[1]);
  let final = 0;
  for (let i = 0; i < rolls; i++) {
    final += roll(f);
  }
  return itemTable("treasures/art"+val,final,true).sort().join(" worth " + val + "gp<br>")+" worth " + val + "gp<br>";
}
function item(table, amount) {
  let f;
  let rolls;
  if (typeof(amount) == "string") {
  let t = amount.split("d");
  rolls = Number(t[0]);
  f = Number(t[1])}
  else {
  rolls = 1;
  f = amount}
  final = 0;
  for (let i = 0; i < rolls; i++) {
    final += roll(f);
  }
  return itemTable("treasures/magic"+table,final,true).sort().join("<br>")+"<br>";
}
function dragonGems(amount,dragon) {
  const totals = {};
  let final = "";
  for (var i = 0;i<amount;i++) {
    const w = (itemTable("treasures/"+dragon+"Gems"));
    if (w in totals) {
      totals[w]++;
    } else {
      totals[w] = 1;
    }
  }
  for (const i in totals) {
    final += gem(i,totals[i]);
  }
  return removeBR(final);
}
function dragonArt(amount,dragon) {
  const totals = {};
  let final = "";
  for (var i = 0;i<amount;i++) {
    const w = (itemTable("treasures/"+dragon+"Art"));
    if (w in totals) {
      totals[w]++;
    } else {
      totals[w] = 1;
    }
  }
  for (const i in totals) {
    final += art(i,totals[i]);
  }
  return combineItems(removeBR(final));
}
function dragonItems(amount,dragon) {
  const totals = {};
  let final = "";
  for (var i = 0;i<amount;i++) {
    const w = (itemTable("treasures/"+dragon+"Items"));
    if (w in totals) {
      totals[w]++;
    } else {
      totals[w] = 1;
    }
  }
  for (const i in totals) {
    final += item(i,totals[i]+"d1");
  }
  return combineItems(removeBR(final));
}
function mundane(amount) {
  const final = [];
  for (var i = 0;i<amount;i++) {final.push(itemTable("treasures/mundane"))}
  return combineItems(final.sort().join("<br>"));
}