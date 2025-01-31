let WIDTH = 50;
let HEIGHT = 50;
let PIXEL = Math.floor(document.getElementsByTagName("html")[0].clientHeight/WIDTH);
let rooms = 0;
function display() {
    document.getElementById("output").innerHTML = "";
    colorBoard();
    for (let i = 0;i<HEIGHT;i++) {
        for (let j = 0;j<WIDTH;j++) {
            const el = document.createElement("div");
            el.classList.add("tile");
            const roomId = board[(i*WIDTH + j)];
            el.classList.add("room-"+roomId);
            if (roomId > -1) {
                if (mode == "room") el.style.backgroundColor = roomId == room ? "#0000ff" : colors[roomId];
                else if (mode == "view") el.style.backgroundColor = colors[roomId];
                else el.style.backgroundColor = colors[0];
            }
            el.id = "tile-"+(i*WIDTH + j);
            el.style.top = i*PIXEL + "px";
            el.style.left = j*PIXEL + "px";
            document.getElementById("output").appendChild(el);
        }
    }
    for (const direction in walls) {
        for (const i of walls[direction]) {
            document.getElementById("tile-"+i).classList.add("wall-"+direction);
        }
    }
    for (const direction in doors) {
        for (const i of doors[direction]) {
            document.getElementById("tile-"+i).classList.add("door-"+direction);
        }
    }
    for (const decoration in decorations) {
        for (const i of decorations[decoration]) {
            const newEl = document.createElement("div");
            newEl.classList.add("on-tile-"+i);
            newEl.classList.add("tile");
            newEl.classList.add(decoration);
            newEl.style.top = Math.floor(i/HEIGHT)*PIXEL + "px";
            newEl.style.left = i%WIDTH*PIXEL + "px";
            document.getElementById("output").appendChild(newEl);
        }
    }
}
function getDistinctColors(e){var o=360/e;const t=[];for(let s=0;s<Math.ceil(e);s++)t.push(hslToHex(s*o,0.5,.55));return t.slice(0,e)}
function hslToHex(t,a,r){var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],n=Math.round(255*(n+r)).toString(16).padStart(2,"0"),d=Math.round(255*(d+r)).toString(16).padStart(2,"0"),h=Math.round(255*(h+r)).toString(16).padStart(2,"0"),"#"+n+d+h}
function colorGraph(a){const b=a.length,c=Array(b).fill(-1),d=Array(b).fill(!0);for(let e=0;e<b;e++){for(const b of a[e])-1!==c[b]&&(d[c[b]]=!1);for(let a=0;a<b;a++)if(d[a]){c[e]=a;break}for(const b of a[e])-1!==c[b]&&(d[c[b]]=!0)}const e=Math.max(...c)+1;return[e,c]}
function colorBoard() {
    rooms = 0;
    for (let i = 0;i<HEIGHT*WIDTH;i++) {
        rooms = Math.max(rooms,board[i]);
    }
    colors = ["#808b97"];
    const graph = Array.from({length:rooms}).map(o=>([]));
    for (let i = 0;i<HEIGHT;i++) {
        for (let j = 0;j<WIDTH;j++) {
            const id = i*WIDTH+j;
            const roomId = board[id];
            if (roomId < 1) continue;
            const connected = [];
            if (i > 0 && board[id-WIDTH] > roomId) {
                connected.push(board[id-WIDTH]);
            }
            if (j > 0 && board[id-1] > roomId) {
                connected.push(board[id-1]);
            }
            if (i < HEIGHT-1 && board[id+WIDTH] > roomId) {
                connected.push(board[id+WIDTH]);
            }
            if (j < WIDTH-1 && board[id+1] > roomId) {
                connected.push(board[id+1]);
            }
            for (const connection of connected) {
                if (!graph[roomId-1].includes(connection-1)) {
                    graph[roomId-1].push(connection-1);
                    graph[connection-1].push(roomId-1);
                }
            }
        }
    }
    const [chromaticNumber,coloredGraph] = colorGraph(graph);
    const allColors = getDistinctColors(chromaticNumber);
    for (let i = 0;i<coloredGraph.length;i++)
        colors.push(allColors[coloredGraph[i]]);
}
function recolorBoard() {
    colorBoard();
    for (let i = 0;i<HEIGHT;i++) {
        for (let j = 0;j<WIDTH;j++) {
            const tileId = i*WIDTH+j;
            if (board[tileId] > 0) {
                document.getElementById("tile-"+tileId).style.backgroundColor = room == board[tileId] ? "#0000ff" : colors[board[tileId]];
            }
        }
    }
    roomTypeChangeDisplay(room);
}
function roomChangeDisplay(oldRoom,newRoom) {
    for (let i = 0;i<HEIGHT;i++) {
        for (let j = 0;j<WIDTH;j++) {
            const tileId = (i*WIDTH + j);
            if (board[tileId] == oldRoom) {
                document.getElementById("tile-"+tileId).style.backgroundColor = colors[oldRoom];
            } if (board[tileId] == newRoom) {
                document.getElementById("tile-"+tileId).style.backgroundColor = "#0000ff";
            }
        }
    }
    roomTypeChangeDisplay(newRoom);
}
function roomTypeChangeDisplay(newRoom,el="roomTypeDescription") {
    if (newRoom == 0) {
        document.getElementById("bastionRoomSelect").style.display = "none";
        document.getElementById(el).style.display = "none";
    }
    else {
        document.getElementById("bastionRoomSelect").style.display = "block";
        document.getElementById(el).style.display = "block";
    }
    document.getElementById("bastionRoomSelect").value = roomTypes[newRoom]?(roomTypes[newRoom]+ " (Level " + premadeRooms[roomTypes[newRoom]].level + ")"):"Unassigned";
    let final = "";
    dat = premadeRooms[roomTypes[newRoom] || "Unassigned"];
    if ((roomTypes[newRoom] || "Unassigned") == "Unassigned") {
        final = dat.description;
    } else {
        const actual = document.getElementsByClassName('room-'+newRoom).length;
        const expected = roomSizes[dat.space];
        final += `<em>Level ${dat.level} Bastion Facility</em><br>`;
        final += `<b>Prerequisite:</b> ${dat.prerequisite}<br>`;
        final += `<b>Space:</b> ${dat.space}&emsp;&emsp;${actual}/${expected}   <meter ${actual>expected?"class='overfullMeter' ":""}value="${actual}" min="0" max="${expected}"></meter><br>`;
        final += `<b>Hirelings:</b> ${dat.hirelings}<br>`;
        final += `<b>Order:</b> ${dat.order}<br>`;
        final += dat.description.replaceAll("\n","<br>");
    }
    document.getElementById(el).innerHTML = final;
}
function draw(startX, startY, endX, endY) {
    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);
    const sx = (startX < endX) ? 1 : -1;
    const sy = (startY < endY) ? 1 : -1;
    let err = dx - dy;
    while (true) {
      color(startY, startX, room);
      if (startX === endX && startY === endY) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        startX += sx;
      }
      if (e2 < dx) {
        err += dx;
        startY += sy;
      }
    }
    if (mode == "room") recolorBoard();
}
function fill(lastX,x,lastY,y) {
    for (let i = Math.min(y,lastY);i<=Math.max(y,lastY);i++) {
        for (let j = Math.min(x,lastX);j<=Math.max(x,lastX);j++) {
            color(i,j,room)
        }
    }
    if (mode == "room") recolorBoard();
}
const modeNames = {
    "view":"View Mode",
    "layout":"Layout Editor Mode",
    "room":"Room Editor Mode"
}
const reverseModeNames = Object.fromEntries(Object.entries(modeNames).map(o=>[o[1],o[0]]));
function changeMode(newMode) {
    if (newMode in modeNames) {}
    else if (newMode in reverseModeNames) {
        newMode = reverseModeNames[newMode];
    } else {
        alert("big uh oh | " + newMode);
    }
    document.getElementById(mode + "Tools").style.display = "none";
    document.getElementById(newMode + "Tools").style.display = "block";
    if (mode == "view") document.getElementById("roomSelector").value = room>=0?room:document.getElementById("roomSelector").value;
    mode = newMode;
    if (mode == "layout") changeRoom(document.getElementById("submodeSelect").value,false);
    else if (mode == "room") {changeRoom(Number(document.getElementById("roomSelector").value),false);roomTypeChangeDisplay(Number(document.getElementById("roomSelector").value))}
    else if (mode == "view") {
        roomTypeChangeDisplay(room,"roomDescriptionOutput");
        document.getElementById("roomDescriptionOutput").innerHTML = "<h4>"+(roomTypes[room] || "Unassigned")+"</h4><br>" + document.getElementById("roomDescriptionOutput").innerHTML;
        document.getElementById("roomDescriptionOutput").innerHTML += "<br><br>"+(roomDescriptions[room] || " ").replaceAll("\n","<br>");
    };
    display();
    save();
}
function changeRoom(newRoom,redisplay=true) {
    if (mode == "room") {
        if (redisplay)
            roomChangeDisplay(room,newRoom);
        // if (document.getElementById("roomDescriptionInput").value)
        //     roomDescriptions[room] = document.getElementById("roomDescriptionInput").value;
    }
    room = newRoom;
    if (mode == "layout") {
        if (document.getElementById("freehandSelector").checked) drawMode = "freehand";
        else drawMode = "box"; // else drawMode = "freehand";
        if (["Place Wall","Place Door"].includes(newRoom)) {
            document.getElementById("directionSelect").style.display = "block";
        } else {
            document.getElementById("directionSelect").style.display = "none";
        }
        if (newRoom == "Place Decoration") {
            document.getElementById("decorationSelect").style.display = "block";
        } else {
            document.getElementById("decorationSelect").style.display = "none";
        }
    } else if (mode == "room") {
        document.getElementById("roomDescriptionInput").value = roomDescriptions[room] || "";
    } else if (mode == "view") {
        roomTypeChangeDisplay(newRoom,"roomDescriptionOutput");
        document.getElementById("roomDescriptionOutput").innerHTML = "<h4>"+(roomTypes[newRoom] || "Unassigned")+"</h4><br>" + document.getElementById("roomDescriptionOutput").innerHTML
        document.getElementById("roomDescriptionOutput").innerHTML += "<br><br>"+(roomDescriptions[newRoom] || " ").replaceAll("\n","<br>");
    }
    save();
}
let coloring = false;
let lastX = 0;
let lastY = 0;
document.getElementById("output").addEventListener("click", function(e) {
    if (mode == "view") {
        const y = Math.floor(e.y/PIXEL);
        const x = Math.floor(e.x/PIXEL);
        const roomId = board[y*WIDTH+x];
        changeRoom(roomId);
    }
})
document.getElementById("output").addEventListener("mousedown", function(e) {
    const y = Math.floor(e.y/PIXEL);
    const x = Math.floor(e.x/PIXEL);
    lastY = y;
    lastX = x;
    if (drawMode == "freehand") {
        color(y,x,room);
        save();
    }
    coloring = true;
})
document.getElementById("output").addEventListener("mouseup", function(e) {
    if (drawMode == "box" && coloring) {
        const y = Math.floor(e.y/PIXEL);
        const x = Math.floor(e.x/PIXEL);
        fill(lastX,x,lastY,y);
        document.getElementById("selection").style.display = "none";
    }
    coloring = false;
    save();
})
document.getElementById("output").addEventListener("mouseleave", function(e) {
    if (coloring) {
        coloring = false;
        if (drawMode == "box") {
            document.getElementById("selection").style.display = "none";
        }
        save();
    }
})
document.getElementById("output").addEventListener("mousemove", function(e) {
    if (coloring) {
        const y = Math.floor(e.y/PIXEL);
        const x = Math.floor(e.x/PIXEL);
        if (drawMode == "freehand") {
            draw(x,y,lastX,lastY);
            lastY = y;
            lastX = x;
            save();
        } else {
            const selection = document.getElementById("selection");
            selection.style.display = "block";
            selection.style.left = PIXEL*Math.min(x,lastX) + "px";
            selection.style.top = PIXEL*Math.min(y,lastY) + "px";
            selection.style.width = PIXEL*(Math.abs(x-lastX)+1) + "px";
            selection.style.height = PIXEL*(Math.abs(y-lastY)+1) + "px";
            document.getElementById("selectionSize").innerHTML = 5*(Math.abs(x-lastX)+1) + " x " + 5*(Math.abs(y-lastY)+1);
        }
    }
})
window.addEventListener("resize", function(e) {
    PIXEL = Math.floor(document.getElementsByTagName("html")[0].clientHeight/WIDTH);
    display();
})
document.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });
window.addEventListener("keypress",function(e) {
    if (e.key == " ") {
        if (mode == "layout") {
            if (room == "Delete Tile") changeRoom("Place Tile");
            else if (room == "Place Tile") changeRoom("Delete Tile");
            else if (room == "Clear Walls") changeRoom("Place Wall");
            else if (room == "Place Wall") changeRoom("Clear Walls");
            else if (room == "Clear Doors") changeRoom("Place Door");
            else if (room == "Place Door") changeRoom("Clear Doors");
            else if (room == "Delete Decoration") changeRoom("Place Decoration");
            else if (room == "Place Decoration") changeRoom("Delete Decoration");
            document.getElementById("submodeSelect").value = room;
        }
    }
})