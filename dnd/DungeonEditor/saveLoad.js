let board = [];
let walls = {"top":[],"bottom":[],"left":[],"right":[]};
let doors = {"top":[],"bottom":[],"left":[],"right":[]};
let colors = ["#808b97"];
let room = 1;
let roomDescriptions = [];
let mode = "view";
let drawMode = "box";
let roomN = 0;
let decorations = {"water-tile":[],"circular-object":[],"square-object":[]};
function customEncode(a,amount=6) {
    let final = a;
    const replacements = [];
    for (let step = 3;step <= amount;step++) {
        for (let i = 0;i < a.length-step;i++) {
            const substring = a.slice(i,i+step);
            let runningReplacement = substring;
            let amount = 1;
            for (let j = i+step;j <= a.length-step;j+=step) {
                if (a.slice(j,j+step) == substring) {
                    amount += 1
                    runningReplacement += substring;
                } else break;
            }
            if (runningReplacement.length > substring.length+6+Math.floor(Math.log10(amount))) {
                replacements.push([runningReplacement,"{"+substring+"},{"+amount+"}"]);
            }
        }
    }
    for (const [a,b] of replacements) {
        final = final.replace(a,b);
    }
    return final;
}
function customDecode(a) {
    if (!a) return a;
    const matches = a.matchAll("\{[^\}]+\},\{[0-9]+\}");
    let final = a;
    if (matches) {
        for (const [match] of matches) {
            const thing = match.slice(1,match.length-1).split("},{");
            let temp = "";
            for (let i = Number(thing[1]);i>0;i--) {
                temp += thing[0];
            }
            final = final.replace(match,temp)
        }
    }
    return final;
}
function setCookie(value) {
    localStorage.setItem("dungeonEditor", btoa(JSON.stringify(value)));
}
function compressCookie(amount=6) {
    localStorage.setItem("dungeonEditor", customEncode(localStorage.getItem("dungeonEditor"),amount));
}
function getCookie() {
    return JSON.parse(atob(customDecode(localStorage.getItem("dungeonEditor")) || "e30="));
}
function load() {
    const data = getCookie();
    let newMode = "view";
    let newRoom = 1;
    if (!data.board) {
        for (let i = 0;i<WIDTH*HEIGHT;i++) {
            board.push(-1);
        }
        newMode = "layout";
        newRoom = "Place Tile";
        save();
    } else {
        roomN = data.roomN;
        drawMode = data.drawMode;
        doors = data.doors;
        walls = data.walls;
        newRoom = data.room;
        board = data.board;
        decorations = data.decorations;
        newMode = data.mode;
        roomDescriptions = data.roomDescriptions;
        document.getElementById("directionSelector").value = data.direction;
        document.getElementById("decorationSelector").value = data.decoration;
        document.getElementById("roomSelector").value = data.room;
        document.getElementById("freehandSelector").checked = drawMode=="freehand";
    }
    changeMode(newMode);
    changeRoom(newRoom);
    document.getElementById("modeSelect").value = modeNames[newMode];
    if (typeof newRoom === 'string' || newRoom instanceof String) {
        document.getElementById("submodeSelect").value = newRoom;
    }
    compressCookie();
}
function save() {
    const data = {}
    data.direction = document.getElementById("directionSelector").value;
    data.decoration = document.getElementById("decorationSelector").value;
    data.roomN = roomN;
    data.doors = doors;
    data.walls = walls;
    data.roomDescriptions = roomDescriptions;
    data.decorations = decorations;
    data.drawMode = drawMode;
    data.room = room;
    data.mode = mode;
    data.board = board;
    setCookie(data)
}