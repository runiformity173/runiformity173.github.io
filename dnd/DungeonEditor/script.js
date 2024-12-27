function remove(a,b){const c=a.indexOf(b);return-1<c&&a.splice(c,1),-1<c}
function color(y, x, roomId, recursed=false) {
    if (y < 0 || y >= HEIGHT || x < 0 || x >= WIDTH) return;
    const tileId = y*WIDTH+x;
    const el = document.getElementById("tile-"+tileId);
    if (mode == "room") {
        if (board[tileId] == -1) return;
        el.classList.remove("room-"+board[tileId]);
        el.classList.add("room-"+roomId);
        el.style.backgroundColor = "#0000ff";
        board[tileId] = roomId;
    } else if (mode == "layout") {
        if (roomId == "Delete Tile" && board[tileId] > -1) {
            el.classList.remove("room-"+board[tileId]);
            el.classList.add("room--1");
            el.style.backgroundColor = "#212529";
            board[tileId] = -1;
            if (remove(walls.top,tileId)) el.classList.remove("wall-top");
            if (remove(walls.left,tileId)) el.classList.remove("wall-left");
            if (remove(walls.right,tileId)) el.classList.remove("wall-right");
            if (remove(walls.bottom,tileId)) el.classList.remove("wall-bottom");
            if (remove(doors.top,tileId)) el.classList.remove("door-top");
            if (remove(doors.left,tileId)) el.classList.remove("door-left");
            if (remove(doors.right,tileId)) el.classList.remove("door-right");
            if (remove(doors.bottom,tileId)) el.classList.remove("door-bottom");
            if (remove(decorations["water-tile"],tileId)) document.querySelector(".water-tile.on-tile-"+tileId).remove();
            if (remove(decorations["circular-object"],tileId)) document.querySelector(".circular-object.on-tile-"+tileId).remove();
            if (remove(decorations["square-object"],tileId)) document.querySelector(".square-object.on-tile-"+tileId).remove();
        } else if (roomId == "Place Tile" && board[tileId] < 0) {
            el.classList.remove("room-"+-1);
            el.classList.add("room-"+0);
            el.style.backgroundColor = colors[0];
            board[tileId] = 0;
        } else if (room == "Place Wall" && board[tileId] > -1) {
            const direction = recursed || document.getElementById("directionSelector").value.toLowerCase();
            if (!walls[direction].includes(tileId)) walls[direction].push(tileId);
            el.classList.add("wall-"+direction);
            if (!recursed) {
                switch (direction) {
                    case "top":
                        color(y-1,x,roomId,"bottom");
                        break;
                    case "bottom":
                        color(y+1,x,roomId,"top");
                        break;
                    case "right":
                        color(y,x+1,roomId,"left");
                        break;
                    case "left":
                        color(y,x-1,roomId,"right");
                        break;
                }
            }
        } else if (roomId == "Clear Walls" && board[tileId] > -1) {
            if (remove(walls.top,tileId)) el.classList.remove("wall-top");
            if (remove(walls.left,tileId)) el.classList.remove("wall-left");
            if (remove(walls.right,tileId)) el.classList.remove("wall-right");
            if (remove(walls.bottom,tileId)) el.classList.remove("wall-bottom");
        } else if (room == "Place Door" && board[tileId] > -1) {
            const direction = recursed || document.getElementById("directionSelector").value.toLowerCase();
            if (!doors[direction].includes(tileId)) doors[direction].push(tileId);
            el.classList.add("door-"+direction);
            if (!recursed) {
                switch (direction) {
                    case "top":
                        color(y-1,x,roomId,"bottom");
                        break;
                    case "bottom":
                        color(y+1,x,roomId,"top");
                        break;
                    case "right":
                        color(y,x+1,roomId,"left");
                        break;
                    case "left":
                        color(y,x-1,roomId,"right");
                        break;
                }
            }
        } else if (roomId == "Clear Doors" && board[tileId] > -1) {
            if (remove(doors.top,tileId)) el.classList.remove("door-top");
            if (remove(doors.left,tileId)) el.classList.remove("door-left");
            if (remove(doors.right,tileId)) el.classList.remove("door-right");
            if (remove(doors.bottom,tileId)) el.classList.remove("door-bottom");
        } else if (roomId == "Place Decoration" && board[tileId] > -1) {
            const decoration = document.getElementById("decorationSelector").value.toLowerCase().replaceAll(" ","-");
            if (!decorations[decoration].includes(tileId)) {
                decorations[decoration].push(tileId);
                const newEl = document.createElement("div");
                newEl.classList.add("on-tile-"+tileId);
                newEl.classList.add("tile");
                newEl.classList.add(decoration);
                newEl.style.top = Math.floor(tileId/HEIGHT)*PIXEL + "px";
                newEl.style.left = tileId%WIDTH*PIXEL + "px";
                document.getElementById("output").appendChild(newEl);
            }
        } else if (roomId == "Delete Decoration" && board[tileId] > -1) {
            if (remove(decorations["water-tile"],tileId)) document.querySelector(".water-tile.on-tile-"+tileId).remove();
            if (remove(decorations["circular-object"],tileId)) document.querySelector(".circular-object.on-tile-"+tileId).remove();
            if (remove(decorations["square-object"],tileId)) document.querySelector(".square-object.on-tile-"+tileId).remove();
        }
    }
}
function removeRoom(current) {
    for (let i = 0;i<WIDTH*HEIGHT;i++) {
        if (board[i] >= current) {
            if (board[i] == current) board[i] = 0;
            else board[i] -= 1;
        }
    }
    roomDescriptions.splice(current,1);
    document.getElementById("roomDescriptionInput").value = roomDescriptions[current]?roomDescriptions[current]:"";
    recolorBoard();
}
function addRoom(newRoom) {
    for (let i = 0;i<WIDTH*HEIGHT;i++)
        if (board[i] > newRoom)
            board[i] += 1;
    for (let i = roomDescriptions.length;i>newRoom;i--) {
        roomDescriptions[i] = roomDescriptions[i-1];
    }
    roomDescriptions[newRoom+1] = undefined;
    recolorBoard();
}
function clearBoard() {
    for (let i = 0;i<WIDTH*HEIGHT;i++) {
        color(Math.floor(i/50),i%50,"Delete Tile");
    }
    walls = {"top":[],"bottom":[],"left":[],"right":[]};
    doors = {"top":[],"bottom":[],"left":[],"right":[]};
    save();
}
/* Test Save
eyJkaXJlY3Rpb24iOiJUb3AiLCJkZWNvcmF0aW9uIjoiV2F0ZXIgVGlsZSIsInJvb21OIjowLCJkb29ycyI6eyJ0b3AiOls4NzQsMTA3MywxMDc0XSwiYm90dG9tIjpbMTAyMywxMDI0LDgyNF0sImxlZnQiOls3NzMsNzY5LDgxOV0sInJpZ2h0IjpbNzY4LDgxOCw3NzJdfSwid2FsbHMiOnsidG9wIjpbMTA3MywxMDc0LDg3Myw4NzQsMTA2OSwxMDcwLDEwNzEsMTA3Miw4NjksODcwLDg3MSw4NzIsOTU1LDk1Niw5NTcsOTU4LDk1OSw5NjAsOTYxLDk2Miw5NjMsOTY0XSwiYm90dG9tIjpbMTAyMywxMDI0LDgyMyw4MjQsMTAxOSwxMDIwLDEwMjEsMTAyMiw4MTksODIwLDgyMSw4MjIsNjA1LDYwNiw2MDcsNjA4LDYwOSw2MTAsNjExLDYxMiw2MTMsNjE0XSwibGVmdCI6WzgyMyw4NjksOTE5LDk2OSwxMDE5LDg3Myw5MjMsOTczLDEwMjMsNjY1LDcxNSw3NjUsODE1LDg2NSw5MTVdLCJyaWdodCI6WzgyMiw4NzIsOTIyLDk3MiwxMDIyLDg2OCw5MTgsOTY4LDEwMTgsNjU0LDcwNCw3NTQsODA0LDg1NCw5MDRdfSwicm9vbURlc2NyaXB0aW9ucyI6WyIiLCJFbnRyYW5jZSByb29tICIsIlRoaXMgaXMgYSBoYWxsd2F5IiwiQSBzaWxseSBsaXR0bGUgY29ybmVyIiwiQW5vdGhlciBIYWxsd2F5IiwiQm9zcyBmaWdodCIsIlNlY3JldCByb29tIiwiIl0sImRlY29yYXRpb25zIjp7IndhdGVyLXRpbGUiOls2NTUsNjU2LDY1Nyw2NTgsNjU5LDY2MCw2NjEsNjYyLDY2Myw2NjQsNzA1LDcwNiw3MDcsNzA4LDcwOSw3MTAsNzExLDcxMiw3MTMsNzE0LDc1NSw3NTYsNzU3LDc1OCw3NTksNzYwLDc2MSw3NjIsNzYzLDc2NCw4MDUsODA2LDgwNyw4MDgsODA5LDgxMCw4MTEsODEyLDgxMyw4MTQsODU1LDg1Niw4NTcsODU4LDg1OSw4NjAsODYxLDg2Miw4NjMsODY0LDkwNSw5MDYsOTA3LDkwOCw5MDksOTEwLDkxMSw5MTIsOTEzLDkxNF0sImNpcmN1bGFyLW9iamVjdCI6W10sInNxdWFyZS1vYmplY3QiOltdfSwiZHJhd01vZGUiOiJib3giLCJyb29tIjo1LCJtb2RlIjoidmlldyIsImJvYXJkIjpb{LTEs},{551}{NSw1LDUs},{5}NSw1LDU{sLTE},{32}sN{Sw1LDUsN},{5}Sw1LDUs{LTEs},{32}NS{w1LDUsNS},{5}w1LDUsL{TEsL},{31}TEsNSw{1LDUsNSw},{5}1LDUsLT{EsLT},{31}EsNSw1{LDUsNSw1},{5}LDUsNCw0LDQsNCwzLDM{sLTE},{26}sNSw1L{DUsNSw1L},{5}DUsNCw0LDQsNCwzLDMs{LTEs},{26}NSw1LD{UsNSw1LD},{5}UsNiw2LDYsNiwyLDIsL{TEsL},{25}TE{sNSw1LDU},{5}sNSw1LDUsNiw2LDYsNiwyLDIsLT{EsLT},{25}Es{NSw1LDUs},{4}{NSw1LDUs},{2}Niw2LDYsNiwyLDI{sLTE},{25}sLTEsN{Sw1LDUsN},{4}{Sw1LDUsN},{2}iw2LDYsNiwyLDI{sLTE},{44}{sMSwxLDE},{3}s{MSwt},{40}{MSwxLDEs},{3}MSw{xLC0},{40}xLDEsM{SwxLDEsM},{2}SwxLD{EsLT},{40}EsMS{wxLDEsMS},{2}wxLDEsM{SwtM},{40}Sw{xLDEsMSw},{2}xLDEsMSwx{LC0x},{40}{LDEsMSwx},{2}LDEsMSwxLDE{sLTE},{40}sMSwxL{DEsMSwxL},{2}DEsMS{wtMS},{40}wxLD{EsMSwxLD},{2}EsMSwxL{C0xL},{40}DE{sMSwxLDE},{2}sMSwxLDEs{LTEs},{40}{MSwxLDEs},{2}MSwxLDEsMSw{tMSw},{40}{xLDEsMSw},{3}xLC{0xLC},{39}0xLDEs{MSwxLDEs},{3}L{TEsL},{39}TEsMSwx{LDEsMSwx},{2}LDEs{MSwt},{39}MSwtM{SwxLDEsM},{3}Sw{xLC0},{39}xLC0xL{DEsMSwxL},{2}DEsMSwxLD{EsLT},{39}EsLT{EsMSwxLD},{2}EsMSwxLDEsM{SwtM},{39}SwtMS{wxLDEsMS},{3}wx{LC0x},{39}LC0xLDE{sMSwxLDE},{2}sMSwxLDEsL{TEsL},{550}{TEsL},{20}TFdfQ==

Zoe's Bathroom
eyJkaXJlY3Rpb24iOiJCb3R0b20iLCJkZWNvcmF0aW9uIjoiU3F1YXJlIE9iamVjdCIsInJvb21OIjowLCJkb29ycyI6eyJ0b3AiOlsxNDE4LDE0MTksNjc5LDY4MF0sImJvdHRvbSI6W10sImxlZnQiOls3MzEsODgxLDEwMzEsMTE4MSwxMzI5LDEzNzldLCJyaWdodCI6WzEzMjgsMTM3OF19LCJ3YWxscyI6eyJ0b3AiOls2ODEsNjgyLDY4Myw2ODQsNjg1LDgzMSw4MzIsODMzLDgzNCw4MzUsOTgxLDk4Miw5ODMsOTg0LDk4NSwxMTMxLDExMzIsMTEzMywxMTM0LDExMzUsMTI4MSwxMjgyLDEyODMsMTI4NCwxMjg1LDE2MjAsMTYyMSwxNjcwLDE2NzEsMTcyMCwxNzIxLDE3NzAsMTc3MSwxODIwLDE4MjEsMTg3MCwxODcxLDE5MjAsMTkyMSwxOTcwLDE5NzEsMjAyMCwyMDIxLDIwNzAsMjA3MSwyMTIwLDIxMjEsMjE3MCwyMTcxLDIyMjAsMjIyMV0sImJvdHRvbSI6W10sImxlZnQiOlsxMjMxLDExMzEsMTA4MSw5ODEsOTMxLDgzMSw3ODEsNjgxLDUyOSw2MjksNTc5LDcyOSw2NzksODI5LDc3OSw5MjksODc5LDEwMjksOTc5LDEwNzksMTEyOSwxMTc5LDEzMjksMTI3OSwxMjI5XSwicmlnaHQiOls1MjgsNTc4LDYyOCw2NzgsNzI4LDc3OCw4MjgsODc4LDkyOCw5NzgsMTAyOCwxMDc4LDExMjgsMTE3OCwxMjI4LDEyNzhdfSwicm9vbURlc2NyaXB0aW9ucyI6W251bGwsIkhhbGx3YXkiLCJQb29sIHJvb20iLCJCYXRocm9vbSIsIlBpbGxhcnMiLCJQb29sIiwiQmlnIHN0YWxsIiwiQ2hlY2sgaW4gZGVzayIsIlNpbmtzIiwiTG9ja2VycyJdLCJkZWNvcmF0aW9ucyI6eyJ3YXRlci10aWxlIjpbNjE5LDYyMCw2MjEsNjIyLDYyMyw2MjQsNjI1LDY2OSw2NzAsNjcxLDY3Miw2NzMsNjc0LDY3NSw3MTksNzIwLDcyMSw3MjIsNzIzLDcyNCw3MjUsNzY5LDc3MCw3NzEsNzcyLDc3Myw3NzQsNzc1LDgxOSw4MjAsODIxLDgyMiw4MjMsODI0LDgyNSw4NjksODcwLDg3MSw4NzIsODczLDg3NCw4NzUsOTE5LDkyMCw5MjEsOTIyLDkyMyw5MjQsOTI1LDk2OSw5NzAsOTcxLDk3Miw5NzMsOTc0LDk3NSwxMDE5LDEwMjAsMTAyMSwxMDIyLDEwMjMsMTAyNCwxMDI1LDEwNjksMTA3MCwxMDcxLDEwNzIsMTA3MywxMDc0LDEwNzUsMTExOSwxMTIwLDExMjEsMTEyMiwxMTIzLDExMjQsMTEyNSwxMTY5LDExNzAsMTE3MSwxMTcyLDExNzMsMTE3NCwxMTc1LDEyMTksMTIyMCwxMjIxLDEyMjIsMTIyMywxMjI0LDEyMjVdLCJjaXJjdWxhci1vYmplY3QiOlsxMTc3LDU3Nyw1ODQsNzM0LDg4NCwxMDM0LDExODRdLCJzcXVhcmUtb2JqZWN0IjpbMTI4NSwxMzM1LDEzODUsNTg1LDczNSwxMDM1LDg4NSwxMTg1LDUzMCw1MjAsNTIxLDUyMiw1MjMsNTI0LDEzNzEsMTM3MiwxMzczLDEzNzQsMjMyMCwyMzcwLDI0MjAsMjQ3MCwyMzcxLDI0NzFdfSwiZHJhd01vZGUiOiJib3giLCJyb29tIjoiQ2xlYXIgV2FsbHMiLCJtb2RlIjoibGF5b3V0IiwiYm9hcmQiOls{tMSw},{518}{yLDIsMiw},{3}yLDI{sNiw2LDY},{2}sNi{wtMS},{32}{wyLDIsMi},{3}w0LDIs{Niw2LDYs},{2}Niw{tMSw},{32}y{LDUsNSw1},{2}LDUsMiwyLDIsN{iw2LDYsN},{2}iwt{MSwt},{31}MSwyL{DUsNSw1L},{2}DUsMiwyLDI{sMywzLDM},{2}sMywtM{SwtM},{31}SwyLD{UsNSw1LD},{2}UsMiwyLDIs{MywzLDMs},{2}My{wtMS},{31}wtMSwyLDU{sNSw1LDU},{2}sMiwyLDIsM{ywzLDMsM},{2}yw{tMSw},{31}tMSwyLDUs{NSw1LDUs},{2}MiwyLDIsMy{wzLDMsMy},{2}{wtMS},{6}ww{LC0x},{25}LDI{sNSw1LDU},{2}sNSwyLDIsMiw{zLDMsMyw},{2}z{LC0x},{6}LDA{sLTE},{25}sMiw1{LDUsNSw1},{2}LDIsMiwyLDM{sMywzLDM},{2}{sLTE},{6}sMC{wtMS},{25}wyL{DUsNSw1L},{2}DUsMiwyLDIs{MywzLDMs},{2}Myw{tMSw},{6}wL{C0xL},{25}DIs{NSw1LDUs},{2}NSwyLDIsMi{wzLDMsMy},{2}wzL{C0xL},{6}DAsMCww{LC0x},{23}LDI{sNSw1LDU},{2}sNSwyLDIsMiw{zLDMsMyw},{2}zLC{0xLC},{24}{0xLC},{7}0xLDIs{NSw1LDUs},{2}NSwyLDIsMi{wzLDMsMy},{2}wzLC0{xLC0},{24}{xLC0},{7}xLDI{sNSw1LDU},{2}sNSwyLDQsMiw{zLDMsMyw},{2}z{LC0x},{24}{LC0x},{8}LDIs{NSw1LDUs},{2}NSwyLDIsMi{wzLDMsMy},{2}wzL{C0xL},{24}{C0xL},{8}{DIsMiwyL},{3}DIsMiw{zLDMsMyw},{2}4LC{0xLC},{23}{0xLC},{8}0x{LDIsMiwy},{3}LDIsMi{wzLDMsMy},{2}w4LC0{xLC0},{23}{xLC0},{8}xLD{IsMiwyLD},{3}IsMiw{zLDMsMyw},{2}4L{C0xL},{23}{C0xL},{9}DEs{MSwt},{48}MSwxLDEs{LTEs},{25}{LTEs},{23}MSwxLC{0xLC},{22}0{xLC0},{22}{xLC0},{3}xLDEsMSw5LDks{LTEs},{6}MCwtMSwwLC0xLDAsMC{wtMS},{34}wxLDEsOSw5LC{0xLC},{5}0xLDAsLTEsMCwtMSwwLC0xLDAsL{TEsL},{24}{TEsL},{8}TEsMSwxLDksO{SwtM},{7}SwwLC0xLC0xLDAsLT{EsLT},{24}{EsLT},{10}EsMSwxLDksO{SwtM},{46}SwxLDEsOSw5{LC0x},{22}L{C0xL},{22}C0xLC0xLDEsMSw5LDk{sLTE},{24}{sLTE},{22}sMSwxLDksO{SwtM},{4}SwwLC0xLDA{sLTE},{3}sMC{wtMS},{3}wwLC0xLDAs{LTEs},{24}{LTEs},{5}MSwxLDksO{SwtM},{3}SwwLC0xLDAsLTEsMCwtMSwwLC0xLDAsLTEsMCwtMSwwLC0xLDAsL{TEsL},{23}{TEsL},{4}TEsMSwxLDksOSw{tMSw},{3}w{LC0x},{3}LDAsLTEsLTEsMCwtMSwtMSwwL{C0xL},{3}DAsLT{EsLT},{23}{EsLT},{4}EsMSwxLDksOS{wtMS},{46}wxLDEsOSw5LC{0xLC},{21}0{xLC0},{21}{xLC0},{3}xLDEsMSw5LDk{sLTE},{23}sL{TEsL},{22}TEsMSwxLDksOSw{tMSw},{46}xLDEsOSw5{LC0x},{21}L{C0xL},{21}{C0xL},{4}DEsM{SwtM},{48}SwxLDEsNyw3LDcsLT{EsLT},{22}Es{LTEs},{22}MSwxLDcsNyw3LC{0xLC},{20}0{xLC0},{20}{xLC0},{4}xLDEsMSw3LDcsNy{wtMS},{45}wxLDEsNyw3LDcsL{TEsL},{21}{TEsL},{5}TFdfQ==
*/