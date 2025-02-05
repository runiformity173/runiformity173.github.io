let redacted = true;
function changeRedacted(newVal) {
    redacted = newVal;
    for (const i of document.getElementsByClassName("redactedSpan")) {
        const thingy = i.getAttribute("thingy");
        i.innerHTML = (words[format(thingy)] && words[format(thingy)] <= lastValue) ? (thingy) : dashify(thingy);
    }
    for (let i = 0; i < lastValue2;i++) {
        [...document.getElementsByClassName("frequent-"+i)].forEach(o=>o.innerHTML = o.getAttribute("thingy"));
    }
}
function dashify(word) {
    if (redacted) return [...word].map(o=>"█").join("");
    const c = new Alea(word.toLowerCase());
    return [...word].map(o=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(c()*26)]).join("");
}
function format(word) {
    return word.toLowerCase().replaceAll("'","");
}
let frequentWords = [];
function start() {
    const frequencyDict = {};
    let final = document.getElementById("inputArea").value.replaceAll(/\[[^\]]*\]/g,"");
    while (true) {
        const lastLength = final.length;
        final = final.replaceAll(/\{[^\}\{}]+\}/g,"");
        if (final.length == lastLength) break;
    }
    localStorage.setItem("wordFrequency",final);
    let final2 = "";
    let word = "";
    let isNumeric = false;
    for (let i = 0;i<final.length;i++) {
        const char = final[i];
        if (char.replace(/[A-Za-zÀ-ÿ0-9']/g,"").length == 0) {
            word += char;
            if ("1234567890".includes(char)) isNumeric = true;
        } else {
            if (word.length > 0) {
                if (!isNumeric) {
                    final2 += `<span thingy="${word}" q="${format(word)}" class="redactedSpan word-${words[format(word)] || "-1"}${words[format(word)]?ranges[words[format(word)]]:""}">${dashify(word)}</span>`;
                    if (!(format(word) in words)) {
                        if (format(word) in frequencyDict) frequencyDict[format(word)]++;
                        else frequencyDict[format(word)] = 1;
                    }
                }
                else final2 += word;
            }
            word = "";
            final2 += char;
            isNumeric = false;
        }
    }
    document.getElementById("output").innerHTML = final2.replaceAll("\n","<br>");
    document.getElementById("sidebar").style.display = "none";
    frequentWords = Object.entries(frequencyDict).sort((a,b)=>b[1]-a[1]).slice(0,20);
    for (let i = 0;i<20;i++) {
        [...document.querySelectorAll("span[q="+frequentWords[i][0]+"]")].forEach(o=>o.classList.add("frequent-"+(i)));
    }

}
const saveTestText = localStorage.getItem("wordFrequency");
if (saveTestText) {
    document.getElementById("inputArea").value = saveTestText;
    start();
}
function erase() {
    localStorage.removeItem("wordFrequency");
}
let lastValue = 0;
let lastValue2 = 0;
function sliderChange(newVal,fromSlider=true) {
    const val = fromSlider?(newVal != 0.005 ? Math.round(10000**newVal) : 0):newVal;
    if (!fromSlider) {
        if (newVal > 10000 || newVal < 0 || newVal != Math.floor(newVal)) return;
        const sliderVal = Math.log(val)/Math.log(10000);
        document.querySelector("#controlContainer > input:nth-child(1)").value = sliderVal;
    }
    document.getElementById("sliderValueDisplay").value = val;
    if (lastValue < val) {
        changeRange(1,10000,lastValue+1,val,true);
    } else if (lastValue > val) {
        changeRange(1,10000,val+1,lastValue,false);
    }
    lastValue = val;
}
function slider2Change(val) {
    document.getElementById("slider2ValueDisplay").value = val;
    document.querySelector("#controlContainer > input:nth-child(6)").value = val;
    if (lastValue2 < val) {
        for (let i = lastValue2 + 1;i <= val;i++)[...document.getElementsByClassName("frequent-"+(i-1))].forEach(o=>o.innerHTML = o.getAttribute("thingy"));
    } else if (lastValue2 > val) {
        for (let i = val + 1;i <= lastValue2;i++)[...document.getElementsByClassName("frequent-"+(i-1))].forEach(o=>o.innerHTML = dashify(o.getAttribute("thingy")));
    }
    lastValue2 = val;
}
// const ranges = Array.from({length:10001}).fill("");
// function createRange(left,right) {
//     if (left == right) return;
//     for (let i = left;i<=right;i++) {
//         ranges[i] += " range-"+left+"-"+right;
//     }
//     const mid = Math.floor((left+right)/2);
//     createRange(left,mid);
//     createRange(mid+1,right);
// }
// createRange(1,10000);
function changeRange(left,right,qleft,qright,query) {
    if (qleft > qright) return;
    if (qleft == qright) {
        [...document.getElementsByClassName("word-"+qleft)].forEach(o=>o.innerHTML = query?o.getAttribute("thingy"):dashify(o.getAttribute("thingy")));
        return;
    }
    if (qleft > right || qright < left) return;
    if (left == qleft && right == qright) {
        [...document.getElementsByClassName("range-"+left+"-"+right)].forEach(function(o){
            o.innerHTML = query?o.getAttribute("thingy"):dashify(o.getAttribute("thingy"));
        });
        return;
    }
    const mid = Math.floor((left+right)/2);
    changeRange(left,mid,qleft,Math.min(mid,qright),query);
    changeRange(mid+1,right,Math.max(mid+1,qleft),qright,query);
}
document.querySelector("#controlContainer > input:nth-child(1)").value = 0.005;
document.querySelector("#controlContainer > input:nth-child(6)").value = 0;
document.querySelector("#sliderValueDisplay").value = 0;
document.querySelector("#slider2ValueDisplay").value = 0;
changeRedacted(document.querySelector("#controlContainer > input:nth-child(4)").checked);
