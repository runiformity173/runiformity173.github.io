const boardElement = document.getElementById("board");
const board = Array.from({length:15}).map(o=>[]);
let hand = [];
let bag = ["A","A","A","A","A","A","A","A","A","B","B","C","C","D","D","D","D","E","E","E","E","E","E","E","E","E","E","E","E","F","F","G","G","G","H","H","I","I","I","I","I","I","I","I","I","J","K","L","L","L","L","M","M","N","N","N","N","N","N","O","O","O","O","O","O","O","O","P","P","Q","R","R","R","R","R","R","S","S","S","S","T","T","T","T","T","T","U","U","U","U","V","V","W","W","X","Y","Y","Z","*","*"];
for (let i = 0;i<225;i++) {
    const n = document.createElement("div");
    n.classList.add("board-tile");
    n.id = "tile-"+Math.floor(i/15)+"-"+i%15;
    const [wordMult,letterMult] = specialBoard[Math.floor(i/15)][i%15];
    if (wordMult == 2) n.classList.add("double-word");
    if (wordMult == 3) n.classList.add("triple-word");
    if (letterMult == 2) n.classList.add("double-letter");
    if (letterMult == 3) n.classList.add("triple-letter");
    const m = document.createElement("input");
    m.classList.add("tile-input");
    m.setAttribute("oninput","saveBoard();")
    m.maxLength = 1;
    n.appendChild(m);
    const p = document.createElement("div");
    p.classList.add("tile-suggestion");
    n.appendChild(p);
    board[Math.floor(i/15)].push(n);
    boardElement.appendChild(n);
}
function resetGame() {
    window.localStorage.removeItem("scrabbleSolver");
    window.location.reload();
}
function saveBoard() {
    const c = board.map(row=>row.map(o=>o.querySelector(".tile-suggestion").classList.contains("tile-suggestion-active")?"":o.firstElementChild.value));
    hand = document.getElementById("hand-input").value.split("");
    c.push(hand);
    c.push(bag);
    window.localStorage.setItem("scrabbleSolver",JSON.stringify(c));
    for (const i of document.getElementsByClassName("board-tile")) {
        i.classList.remove("tile-placed");
        i.classList.remove("tile-blank");
        const iVal = i.firstElementChild.value;
        if (iVal) {
            i.classList.add("tile-placed");
            if (iVal != iVal.toUpperCase()) {
                i.classList.add("tile-blank");
            }
        }
    }
}
function loadBoard() {
    const a = JSON.parse(window.localStorage.getItem("scrabbleSolver"));
    if (!a) return;
    for (let row = 0;row < 15;row++) {
        for (let col = 0;col < 15;col++) {
            board[row][col].firstElementChild.value = a[row][col];
        }
    }
    hand = a[15];
    bag = a[16];
    document.getElementById("hand-input").value = hand.join("");
}

loadBoard();
saveBoard();

function clearDisplayedSolution() {
    [...document.getElementsByClassName("tile-suggestion-active")].forEach(o=>{o.classList.remove("tile-suggestion-active");o.parentElement.firstElementChild.value = "";});
}
function acceptSuggestion() {
    [...document.getElementsByClassName("tile-suggestion-active")].forEach(o=>{
        o.classList.remove("tile-suggestion-active");
    });
    saveBoard();
}
function displaySolution([word,index,direction,rowIndex],) {
    clearDisplayedSolution();
    let y,x;
    if (direction == "row") [y,x]=[index,rowIndex];
    else [y,x]=[rowIndex,index];
    for (let i = 0;i<word.length;i++) {
        const tile = document.getElementById("tile-"+y+"-"+x);
        const sug = tile.querySelector(".tile-suggestion");
        if (!alphabets.includes(tile.querySelector(".tile-input").value)) {
            sug.classList.add("tile-suggestion-active");
            tile.firstElementChild.value = word[i];
        }
        if (direction == "row") x++;
        else y++;
    }
}
function solveClicked() {
    const solutions = [solveBoard(board.map(row=>row.map(o=>o.firstElementChild.value)),hand)];
    displaySolution(solutions[0][1]);
    document.getElementById("result-points").innerHTML = (solutions[0][0] + " points")
    console.log(solutions[0][0], "points")
}

function getLetter() {
    const i = Math.floor(Math.random()*bag.length);
    alert(bag.splice(i,1)[0]);
    saveBoard();
}
// function viewBag() {
//     let string = "";
//     const d = {};
//     for (const i of bag) {
//         d[i] = d[i]+1||1;
//     }
//     alert(string);
// }
function testSolve() {
    console.time("100")
    for (let i = 0;i<100;i++) solveBoard(board.map(row=>row.map(o=>o.firstElementChild.value)),hand);
    console.timeEnd("100")
}
if (location.href.includes("localhost")) playGame("test")