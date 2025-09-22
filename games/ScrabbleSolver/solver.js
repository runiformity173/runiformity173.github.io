// LIMITATIONS: if 2 same letters and one is a blank, might not put correct one on triple letter spot or vertical play.
// Score remaining letters in hand, under-/over-valued?
// STRUCTURED CLONE IS BAD. Fixed it a bit with overriding to JSON, but still could do better by repairing the letter list probably.
const wordSet = new Set(wordList);
const alphabetSet = new Set("QWERTYUIOPASDFGHJKLZXCVBNM");
const wordsByHash = {};
let random;
function structuredClone(a) {
    return JSON.parse(JSON.stringify(a));
}
const wordListByLength = Array.from({length:16}).map(o=>[]);
for (const i of wordSet) {
    wordListByLength[i.length].push(i);
    let hash = Array.from(i).fill(".");
    if (hash.join("") in wordsByHash) wordsByHash[hash.join("")].push(i);
    else wordsByHash[hash.join("")] = [i];
    for (let j = 0;j < i.length;j++) {
        hash[j] = i[j];
        if (hash.join("") in wordsByHash) wordsByHash[hash.join("")].push(i);
        else wordsByHash[hash.join("")] = [i];
        hash[j] = ".";
    }
}

function getBoardSpecial(y,x) {
    return specialBoard[y][x];
}
function canPlayWord(letters, word, blanks) {
    for (const i of word) {
        if (letters[i] > 0) letters[i] -= 1;
        else if (blanks > 0) blanks -= 1;
        else return false;
    }
    return true;
}
function wordBlanksPosition(letters, word) {
    const blanks = []
    for (let i = 0;i<word.length;i++) {
        if (letters[word[i]] > 0) letters[word[i]] -= 1;
        else blanks.push(i)
    }
    return blanks;
}
function bestWordAlone(letters) {
    const letterDict = {};
    let bestPoints = 0;
    let bestWords = [];
    let blanks = 0;
    for (const i of letters) {
        if (alphabetSet.has(i)) letterDict[i] = letterDict[i]+1||1;
        else if (i == "*") blanks++;
    }
    for (const word of wordList) {
        if (canPlayWord(structuredClone(letterDict),word,blanks)) {
            points = word.split("").map(o=>letterPoints[o]||0).reduce((a,b)=>a+b) + (word.length==7 ? 50 : 0);
            if (points > bestPoints) {
                bestPoints = points;
                bestWords = [word];
            } else if (points == bestPoints) bestWords.push(word);
        }
    }
    return [bestPoints,bestWords];
}
function findMatches(expression,length,hash) { // 36% of 65%... 53-55% of solveRow
    const matches = [];
    let hashString = Array.from(hash);
    let foundLetter = false;
    for (let i = 0;i<hashString.length;i++) {
        if (foundLetter || !alphabet.includes(hashString[i])) hashString[i] = ".";
        else foundLetter = true;
    }
    if (!(hashString.join("") in wordsByHash)) return [];
    const a = new RegExp(`^${expression}$`,"g");
    for (const word of wordsByHash[hashString.join("")]) {
        if (word.match(a)) {
            matches.push(word);
        }
    }
    return matches;
}
function solveRow(board, index, direction, row, rowRegex, rowHash, handLetters, blanks) {
    let bestScore = 0;
    let bestWord = [];
    for (let i = 0; i < 15;i++) {
        if (i > 0 && alphabets.includes(row[i-1])) continue; 
        let validA = false;
        let validB = false;
        let c = "";
        for (let j = i; j < 15;j++) {
            if (!validA && rowRegex[j] != "[A-Z]") validA = true;
            if (!validB && rowRegex[j].includes("[")) validB = true;
            c += rowRegex[j];
            if (validA && validB && (j == 14 || rowRegex[j+1].includes("["))) {
                const newLetters = structuredClone(handLetters);
                for (let k = i; k <= j;k++) {
                    if (alphabetSet.has(row[k])) {
                        if (row[k] in newLetters) newLetters[row[k]]++;
                        else newLetters[row[k]] = 1;
                    }
                }
                for (const l of findMatches(c,j-i+1,rowHash.slice(i,j+1))) {
                    if (canPlayWord(structuredClone(newLetters),l,blanks)) {
                        const score = scorePlay(board,l,index,i,direction,row,handLetters,structuredClone(newLetters),blanks);
                        if (score > bestScore) {
                            bestScore = score;
                            bestWord = [l, index, direction, i];
                        }
                    }
                }
            }
        }
    }
    return [bestScore, bestWord];
}
function isValidRow(row) {
    for (const i of row.split(" ")) {
        if (i.length > 1 && !wordSet.has(i)) return false;
    }
    return true;
}
function solveFirstTurn(board,handLetters,blanks) {
    let regexString = "[A-Z]";
    let hashString = ".";
    let bestScore = 0;
    let bestWord = [];
    for (let j = 2;j<=hand.length;j++) {
        regexString += "[A-Z]";
        hashString += ".";
        for (const l of findMatches(regexString,j,hashString)) {
            if (canPlayWord(structuredClone(handLetters),l,blanks)) {
                for (let k = 0;k<8;k++) {
                    if (k+j < 7) continue;
                    const score = scorePlay(board,l,7,k,"row","               ",handLetters,structuredClone(handLetters),blanks);
                    if (score > bestScore) {
                        bestScore = score;
                        bestWord = [l, 7, "row", k];
                    }
                }
            }
        }
    }
    console.log(bestScore,bestWord);
    return [bestScore,bestWord];
}
function solveBoard(board, hand) {
    const rows = Array.from({length:15}).map(o=>"");
    const cols = Array.from({length:15}).map(o=>"");
    const handLetters = {};
    let bestScore = 0;
    let bestWord = [];
    let blanks = 0;
    for (const i of hand) {
        if (alphabetSet.has(i)) handLetters[i] = handLetters[i]+1||1;
        else if (i == "*") blanks++;
    }
    let foundAnything = false;
    for (let row = 0;row<15;++row) {
        for (let col = 0;col<15;++col) {
            let i = board[row][col].toUpperCase();
            if (i == "") i = " ";
            else foundAnything = true;
            rows[row] += i;
            cols[col] += i;
        }
    }
    if (!foundAnything) {
        return solveFirstTurn(board,handLetters,blanks);
    }
    const colRegexes = [];
    const colHashes = [];
    for (let col = 0;col<15;++col) {
        let c = [];
        let h = "";
        for (let row = 0;row<15;++row) {
            if (cols[col][row] != " ") {
                c.push(cols[col][row].toUpperCase());
                h += cols[col][row].toUpperCase();
                continue;
            }
            const a = rows[row].split("");
            let letters = "";
            for (const letter of alphabet) {
                a[col] = letter;
                if (isValidRow(a.join(""))) {
                    letters += letter;
                }
            }
            c.push(`[${letters.length==26?"A-Z":letters}]`);
            h += ".";
        }
        colRegexes.push(c);
        colHashes.push(h);
    }
    const rowRegexes = [];
    const rowHashes = [];
    for (let row = 0;row<15;++row) {
        let c = [];
        let h = "";
        for (let col = 0;col<15;++col) {
            if (rows[row][col] != " ") {
                c.push(rows[row][col].toUpperCase());
                h += rows[row][col].toUpperCase();
                continue;
            }
            const a = cols[col].split("");
            let letters = "";
            for (const letter of alphabet) {
                a[row] = letter;
                if (isValidRow(a.join(""))) {
                    letters += letter;
                }
            }
            c.push(`[${letters.length==26?"A-Z":letters}]`);
            h += ".";
        }
        rowRegexes.push(c);
        rowHashes.push(h);
    }
    for (let i = 0;i<15;i++) {
        const [a,b] = solveRow(board, i, "col", cols[i], colRegexes[i], colHashes[i], handLetters, blanks);
        const [c,d] = solveRow(board, i, "row", rows[i], rowRegexes[i], rowHashes[i], handLetters, blanks);
        if (a > bestScore) {bestScore = a;bestWord = b;}
        if (c > bestScore) {bestScore = c;bestWord = d;}
    }
    return [bestScore, bestWord];
}

function scorePlay(board, word, rowIndex, index, direction, row, handLetters, newLetterDict, blanks) {
    let points = 0;
    let extra = 0;
    let mult = 1;
    let newLetters = 0;
    const blankPositions = wordBlanksPosition(newLetterDict,word);
    for (let i = index;i < index+word.length;i++) {
        if (row[i] == " ") {
            newLetters++;
            const [wordMult,letterMult] = getBoardSpecial(direction=="row"?rowIndex:i,direction=="row"?i:rowIndex);
            mult *= wordMult;
            points += blankPositions.includes(i-index)?0:letterPoints[word[i-index]]*letterMult; // figure out which are blanks
            if (direction == "col") {
                let l = rowIndex;
                let r = rowIndex;
                while (l > 0 && alphabets.includes(board[i][l-1])) l--;
                while (r < 14 && alphabets.includes(board[i][r+1])) r++;
                for (let j = l;j <= r;j++) {
                    if (j == rowIndex) continue;
                    extra += letterPoints[board[i][j]]*wordMult;
                }
                if (l != r) extra += blankPositions.includes(i-index)?0:letterPoints[word[i-index]]*letterMult*wordMult;
            } else {
                let l = rowIndex;
                let r = rowIndex;
                while (l > 0 && alphabets.includes(board[l-1][i])) l--;
                while (r < 14 && alphabets.includes(board[r+1][i])) r++;
                for (let j = l;j <= r;j++) {
                    if (j == rowIndex) continue;
                    extra += letterPoints[board[j][i]]*wordMult;
                }
                if (l != r) extra += blankPositions.includes(i-index)?0:letterPoints[word[i-index]]*letterMult*wordMult;
            }
        } else {
            points += letterPoints[row[i]];
        }
    }
    points *= mult;
    points += extra;
    if (newLetters == 7) points += 50;
    // Add remaining letters scoring eventually.
    return points;
}

function playGame(seed) {
    random = new Alea(seed);
    const simulatedBag = ["A","A","A","A","A","A","A","A","A","B","B","C","C","D","D","D","D","E","E","E","E","E","E","E","E","E","E","E","E","F","F","G","G","G","H","H","I","I","I","I","I","I","I","I","I","J","K","L","L","L","L","M","M","N","N","N","N","N","N","O","O","O","O","O","O","O","O","P","P","Q","R","R","R","R","R","R","S","S","S","S","T","T","T","T","T","T","U","U","U","U","V","V","W","W","X","Y","Y","Z","*","*"];
    function getTile() {
        if (simulatedBag.length == 0) return;
        return simulatedBag.splice(Math.floor(simulatedBag.length*random()),1)[0];
    }
    function addTile(hand) {
        const tile = getTile();
        if (tile) hand.push(tile);
    }
    function removeTiles(hand,tiles) {
        for (const i of tiles) {
            hand.splice(hand.index(i),1);
        }
    }
    const player1Hand = [];
    const player2Hand = [];
    for (let i = 0;i<7;i++) {
        addTile(player1Hand);
        addTile(player2Hand);
    }
    let player1Turn = true;
    while (player1Hand.length && player2Hand.length) {
        if (player1Turn) {
            // ADD LOGIC FOR WEIGHT SWITCHING
        }
        const [bestScore, bestWord] = solveBoard
        player1Turn = !player1Turn;
    }
}
playGame("123");
// [["L","A","P","","","","","V","I","T","A","E","","","C"],["","R","A","J","","","","","","W","I","N","D","E","R"],["","","D","I","F","","","","Q","I","","","","","Y"],["","","","N","E","O","N","","I","N","","","","",""],["","","","","R","E","A","M","","G","","","","",""],["C","H","O","R","E","","","A","P","E","","","","",""],["U","","","","","S","A","M","O","S","A","","","",""],["T","","","","","","W","A","X","","A","G","O","N","S"],["E","T","","","","","","","","","","","F","O","E"],["L","O","","","","","","","","","","","","B","I"],["Y","O","","","","","","","","","","","","",""],["","N","","","","","","","","","","","","",""],["","I","","","","","","","","","","","","",""],["","E","","","","","","","","","","","","",""],["","","","","","","","","","","","","","",""],["L","O","I","U","E","B","S"],["A","A","A","A","A","A","A","A","A","B","B","C","C","D","D","D","D","E","E","E","E","E","E","E","E","E","E","E","E","F","F","G","G","G","H","H","I","I","I","I","I","I","I","I","I","J","K","L","L","L","L","M","M","N","N","N","N","N","N","O","O","O","O","O","O","O","O","P","P","Q","R","R","R","R","R","R","S","S","S","S","T","T","T","T","T","T","U","U","U","U","V","V","W","W","X","Y","Y","Z","*","*"]]