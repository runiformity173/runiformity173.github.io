let seed = Math.floor(Math.random()*100000000);
let random = new Alea(seed);
const choose=function(a){
    if (a.length)
        return a[Math.floor(a.length*random.random())]
    let i = Object.keys(a)[Math.floor(Object.keys(a).length*random.random())];
    while (data[i] == "ASI" || data[i] == "skip2") {
        i = Object.keys(a)[Math.floor(Object.keys(a).length*random.random())];
    }
    return i;
};
function getItem(item={
    effects:[]
}) {
    if (!item.item) {
        const itemIndex = Math.floor(random.random()*3);
        item.itemIndex = itemIndex;
        const itemType = ["weapon","armor","misc"][itemIndex];
        if (itemType == "weapon") {
            item.item = choose(weapons);
        }
        else if (itemType == "armor") {
            item.item = choose(armors);
        }
        else if (itemType == "misc") {
            item.item = choose(misc);
        }
    }
    if (item.regenerateEffect != undefined) {
        if (item.regenerateEffect == 'prefix') {
            const prev = item.effects[0];
            item.effects[0] = choose(data);
            while (!canApply[item.effects[0]][item.itemIndex] || item.effects[0] == prev)
                item.effects[0] = choose(data);
            item.shuffleName = 1;
        }
        if (item.regenerateEffect == 'suffix') {
            const prev = item.effects[1];
            item.effects[1] = choose(data);
            while (!canApply[item.effects[1]][item.itemIndex] || item.effects[1] == prev)
                item.effects[1] = choose(data);
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
        item.effects.push(choose(data));
        while (!canApply[item.effects[0]][item.itemIndex])
                item.effects[0] = choose(data);
        item.effects.push(choose(data));
        while (!canApply[item.effects[1]][item.itemIndex])
                item.effects[1] = choose(data);
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
    
    item.name = [item.prefix, item.item, item.suffix].filter(o=>o).join(" ");
    return item;
}
function formatAbilityName(str) {
    return str.replaceAll("'s","").replaceAll("of the ","").replaceAll("of ","");
}
function displayItem(item) {
    // document.getElementById("itemName").innerHTML = item.name;
    document.getElementById("prefix").innerHTML = item.prefix;
    document.getElementById("item").innerHTML = item.item;
    document.getElementById("suffix").innerHTML = item.suffix;
    document.getElementById("itemDescription1").innerHTML = "<span class='tab'></span><strong>" + formatAbilityName(item.prefix) + ".</strong> " + item.effects[0]
    document.getElementById("itemDescription2").innerHTML = "<span class='tab'></span><strong>" + formatAbilityName(item.suffix) + ".</strong> " + item.effects[1];
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
// while (generate() != "of Eavesdropping") {
//     seed += 1;
//     random = new Alea(seed);
// }
// random = new Alea(seed);
// console.log(seed);