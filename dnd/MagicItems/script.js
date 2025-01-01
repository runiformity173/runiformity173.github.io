const choose=function(a){
    if (a.length)
        return a[Math.floor(a.length*random.random())]
    let i = Object.keys(a)[Math.floor(Object.keys(a).length*random.random())];
    while (data[i] == "ASI" || data[i] == "skip2") {
        i = Object.keys(a)[Math.floor(Object.keys(a).length*random.random())];
    }
    return i;
};
const rarityMap = ["????","Common","Uncommon","Uncommon","Rare","Rare","Very Rare","Legendary","Artifact","Artifact"];
function evaluateRarity(item) {
    const [i,j] = item.effects.map(o=>rarities[o]);
    const rarityNumber = i===j?i+1:Math.max(i,j);
    item.rarity = rarityMap[rarityNumber];
}
function hasInCommon(a,b) {
    for (const i of a) if (!["Passive Buff","Spell","Skill","Extra Ability","Extra Protection"].includes(i) && b.includes(i)) return true;
    return false;
}
function actuallyHasInCommon(a,b) {
    console.log(a);
    for (const i of a) if (b.includes(i)) return true;
    return false;
}
function getItem(item={
    effects:[]
}) {
    const desiredRarities = [...document.getElementsByClassName("rarityCheckbox")].filter(o=>o.checked).map(o=>o.value);
    if (desiredRarities.length == 0) desiredRarities.push("Common","Uncommon","Rare","Very Rare","Legendary");
    if (!item.item) {
        const itemIndex = Math.floor(random.random()*3);
        item.itemIndex = itemIndex;
    }
    if (item.shuffleItem != undefined || !item.item) {
        const itemType = ["weapon","armor","misc"][item.itemIndex];
        if (itemType == "weapon") {
            item.item = choose(weapons);
        }
        else if (itemType == "armor") {
            item.item = choose(armors);
        }
        else if (itemType == "misc") {
            item.item = choose(misc);
        }
        if (item.shuffleItem != undefined) delete item.shuffleItem;
    }
    if (item.regenerateEffect != undefined) {
        if (item.regenerateEffect == 'prefix') {
            const prev = item.effects[0];
            item.effects[0] = choose(data);
            evaluateRarity(item);
            let count = 0;
            while ((!canApply[item.effects[0]][item.itemIndex] || item.effects[0] == prev || item.effects[0] == item.effects[1] || !desiredRarities.includes(item.rarity) || hasInCommon(categories[item.effects[0]],categories[item.effects[1]])) && count++ < 10000) {
                item.effects[0] = choose(data);
                evaluateRarity(item);
            }
            if (count >= 10000) {
                delete item.regenerateEffect;
                alert("Couldn't make an item with those specifications");
                return item;
            }
            item.shuffleName = 1;
        }
        if (item.regenerateEffect == 'suffix') {
            const prev = item.effects[1];
            item.effects[1] = choose(data);
            evaluateRarity(item);
            let count = 0;
            while ((!canApply[item.effects[1]][item.itemIndex] || item.effects[1] == prev || item.effects[0] == item.effects[1] || !desiredRarities.includes(item.rarity) || hasInCommon(categories[item.effects[0]],categories[item.effects[1]])) && count++ < 10000) {
                item.effects[1] = choose(data);
                evaluateRarity(item);
            }
            if (count >= 10000) {
                delete item.regenerateEffect;
                alert("Couldn't make an item with those specifications");
                return item;
            }
            item.shuffleName = 2;
        }
        delete item.regenerateEffect;
    }
    if (item.shuffleEffect != undefined) {
        if (item.shuffleEffect == "prefix") {
            const prev = item.effects[0];
            while (item.effects[0] == prev) {
                item.effects[0] = choose(commonPrefixes[item.prefix]);
            }
        }
        if (item.shuffleEffect == "suffix") {
            const prev = item.effects[1];
            let count = 0;
            while (item.effects[1] == prev) {
                item.effects[1] = choose(commonSuffixes[item.suffix]);
            }
        }
        delete item.shuffleEffect;
    }
    else if (item.effects.length == 0) {
        let count = 0;
        while ((!desiredRarities.includes(item.rarity) || item.effects[0] == item.effects[1] || hasInCommon(categories[item.effects[0]],categories[item.effects[1]])) && count++ < 100000) {
            item.effects = [];
            item.effects.push(choose(data));
            while (!canApply[item.effects[0]][item.itemIndex])
                item.effects[0] = choose(data);
            item.effects.push(choose(data));
            while (!canApply[item.effects[1]][item.itemIndex])
                item.effects[1] = choose(data);
            evaluateRarity(item);
        }
        if (count >= 100000) {
            alert("Couldn't make an item with those specifications");
        }
    }
    if (item.swapName) {
        [item.effects[0],item.effects[1]] = [item.effects[1],item.effects[0]];
        item.prefix = choose(data[item.effects[0]][0]);
        item.suffix = choose(data[item.effects[1]][1]);
        delete item.swapName;
    } else if (item.shuffleName) {
        if (item.shuffleName == 1) {
            const prev = item.prefix;
            while (prev == item.prefix)
                item.prefix = choose(data[item.effects[0]][0]);
        } else {
            const prev = item.suffix;
            while (prev == item.suffix)
                item.suffix = choose(data[item.effects[1]][1]);
        }
        delete item.shuffleName;
    } else if (!item.name) {
        item.prefix = choose(data[item.effects[0]][0]);
        item.suffix = choose(data[item.effects[1]][1]);
    }
    evaluateRarity(item);
    return item;
}
function formatAbilityNamePrefix(str) {
    return (str+"|").replaceAll("'s|","").replaceAll("|","");
}
function formatAbilityNameSuffix(str) {
    return str.replaceAll("of the ","").replaceAll("of ","");
}
function displayItem(item) {
    item.name = [item.prefix, item.item, item.suffix].filter(o=>o).join(" ");
    document.getElementById("prefix").innerHTML = item.prefix;
    document.getElementById("item").innerHTML = item.item;
    document.getElementById("suffix").innerHTML = item.suffix;
    document.getElementById("rarity").innerHTML = item.rarity;
    document.getElementById("itemDescription1").innerHTML = "<span class='tab'></span><strong>" + formatAbilityNamePrefix(item.prefix) + ".</strong> " + item.effects[0]
    document.getElementById("itemDescription2").innerHTML = "<span class='tab'></span><strong>" + formatAbilityNameSuffix(item.suffix) + ".</strong> " + item.effects[1];
    let prefixCanSwap = item.prefix in commonPrefixes;
    if (prefixCanSwap) {
        let t = false;
        for (const effect of commonPrefixes[item.prefix]) {
            if (canApply[effect][item.itemIndex] && effect != item.effects[0]) {
                t = true;
            }
        }
        prefixCanSwap = t;
    }
    let suffixCanSwap = item.suffix in commonSuffixes;
    if (suffixCanSwap) {
        let t = false;
        for (const effect of commonSuffixes[item.suffix]) {
            if (canApply[effect][item.itemIndex] && effect != item.effects[1]) {
                t = true;
            }
        }
        suffixCanSwap = t;
    }
    if (prefixCanSwap) {
        document.getElementById("itemDescription1").innerHTML = '<button class="emoji-button" onclick="shuffleEffect(\'prefix\')">🔀</button>' + document.getElementById("itemDescription1").innerHTML;
    } else {
        document.getElementById("itemDescription1").innerHTML = '<span class="button-placeholder"></span>' + document.getElementById("itemDescription1").innerHTML;
    } if (suffixCanSwap) {
        document.getElementById("itemDescription2").innerHTML = '<button class="emoji-button" onclick="shuffleEffect(\'suffix\')">🔀</button>' + document.getElementById("itemDescription2").innerHTML;
    } else {
        document.getElementById("itemDescription2").innerHTML = '<span class="button-placeholder"></span>' + document.getElementById("itemDescription2").innerHTML;
    }
    if (data[item.effects[0]][0].length > 1) {
        document.getElementById("prefix").innerHTML = '<button class="emoji-button" onclick="shuffleName(1)">🔀</button>' + document.getElementById("prefix").innerHTML;
    } else {
        document.getElementById("prefix").innerHTML = '<span class="button-placeholder"></span>' + document.getElementById("prefix").innerHTML;
    } if (data[item.effects[1]][1].length > 1) {
        document.getElementById("suffix").innerHTML = document.getElementById("suffix").innerHTML + '<button class="emoji-button" onclick="shuffleName(2)">🔀</button>';
    } else {
        document.getElementById("suffix").innerHTML = document.getElementById("suffix").innerHTML + '<span class="button-placeholder"></span>';
    }
}
function swapName() {
    currentItem.swapName = true;
    getItem(currentItem);
    displayItem(currentItem);
}
function shuffleName(effect) {
    currentItem.shuffleName = effect;
    getItem(currentItem);
    displayItem(currentItem);
}
function shuffleEffect(effect) {
    currentItem.shuffleEffect = effect;
    getItem(currentItem);
    displayItem(currentItem);
}
function shuffleItem() {
    currentItem.shuffleItem = true;
    getItem(currentItem);
    displayItem(currentItem);
}
function regenerate(effect) {
    currentItem.regenerateEffect = effect;
    getItem(currentItem);
    displayItem(currentItem);
}
let currentItem = {};
function generate() {
    document.getElementById("output").style.display = "block";
    currentItem = getItem();
    displayItem(currentItem);
}
function printFinal() {
    const item = currentItem;
    document.getElementById("finalOutput").style.display = "block";
    document.getElementById("finalName").innerHTML = item.name;
    document.getElementById("finalRarity").innerHTML = item.rarity + ((atunements[item.effects[0]] || atunements[item.effects[1]])?(` (requires atunement)`):"");
    document.getElementById("finalItemDescription").innerHTML = "<strong>" + formatAbilityNamePrefix(item.prefix) + ".</strong> " + item.effects[0];
    document.getElementById("finalItemDescription").innerHTML += "<br><strong>" + formatAbilityNameSuffix(item.suffix) + ".</strong> " + item.effects[1];
}