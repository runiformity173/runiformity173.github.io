// LIMITATIONS: if 2 same letters and one is a blank, might not put correct one on triple letter spot or vertical play.
// Score remaining letters in hand, under-/over-valued?

// ~940ms for 1 game (seed "123") currently

const wordSet = new Set(wordList);
const alphabetSet = new Set("QWERTYUIOPASDFGHJKLZXCVBNM");
const wordsByHash = {};
let random;
function repair(a,b) {
    for (const i of b) a[i] += 1;
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
    const repairList = [];
    for (const i of word) {
        if (letters[i] > 0) {
            letters[i] -= 1;
            repairList.push(i);
        }
        else if (blanks > 0) blanks -= 1;
        else {
            repair(letters,repairList)
            return false;
        }
    }
    repair(letters,repairList);
    return true;
}
function wordBlanksPosition(letters, word) {
    const blanks = [];
    const repairList = [];
    for (let i = 0;i<word.length;i++) {
        if (letters[word[i]] > 0) {
            letters[word[i]] -= 1;
            repairList.push(word[i]);
        }
        else blanks.push(i)
    }
    repair(letters,repairList);
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
        if (canPlayWord(letterDict,word,blanks)) {
            points = word.split("").map(o=>letterPoints[o]||0).reduce((a,b)=>a+b) + (word.length==7 ? 50 : 0);
            if (points > bestPoints) {
                bestPoints = points;
                bestWords = [word];
            } else if (points == bestPoints) bestWords.push(word);
        }
    }
    return [bestPoints,bestWords];
}

function matchesRegex(expressionArr,word) {
    for (let j = expressionArr.length-1;j>-1;j--) {
        const i = expressionArr[j];
        if (i != "[A-Z]" && !(i.length==1?i:i.slice(1,-1)).includes(word[j])) return false;
    }
    return true;
}
const memoizationTable = {};
function findMatches(expression,expressionArr,length,hash) {
    if (expression in memoizationTable) return memoizationTable[expression];
    const matches = [];
    let hashString = Array.from(hash);
    let foundLetter = false;
    for (let i = 0;i<hashString.length;i++) {
        if (foundLetter || !alphabet.includes(hashString[i])) hashString[i] = ".";
        else foundLetter = true;
    }
    if (!(hashString.join("") in wordsByHash)) return [];
    for (const word of wordsByHash[hashString.join("")]) {
        if (matchesRegex(expressionArr,word)) {
            matches.push(word);
        }
    }
    memoizationTable[expression] = matches;
    return matches;
}
function solveRow(board, index, direction, row, rowRegex, rowHash, handLetters, blanks, bag) {
    let bestScore = 0;
    let bestWord = [];
    for (let i = 0; i < 15;i++) {
        if (i > 0 && alphabets.includes(row[i-1])) continue; 
        let validA = false;
        let validB = false;
        let c = "";
        let cc = [];
        for (let j = i; j < 15;j++) {
            if (!validA && rowRegex[j] != "[A-Z]") validA = true;
            if (!validB && rowRegex[j].includes("[")) validB = true;
            c += rowRegex[j];
            cc.push(rowRegex[j]);
            if (validA && validB && (j == 14 || rowRegex[j+1].includes("["))) {
                const newLetters = handLetters;
                for (let k = i; k <= j;k++) {
                    if (alphabetSet.has(row[k])) {
                        if (row[k] in newLetters) newLetters[row[k]]++;
                        else newLetters[row[k]] = 1;
                    }
                }
                for (const l of findMatches(c,cc,j-i+1,rowHash.slice(i,j+1))) {
                    if (canPlayWord(newLetters,l,blanks)) {
                        const [score, playedLetters, wordAsPlayed, points] = scorePlay(board,l,index,i,direction,row,handLetters,newLetters,blanks,bag);
                        if (score > bestScore) {
                            bestScore = score;
                            bestWord = [l, index, direction, i, playedLetters, wordAsPlayed, points];
                        }
                    }
                }
                for (let k = i; k <= j;k++) {
                    if (alphabetSet.has(row[k])) {
                        newLetters[row[k]]--;
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
function solveFirstTurn(board,hand,handLetters,blanks,bag) {
    let regexString = "[A-Z]";
    const regexArr = ["[A-Z]"];
    let hashString = ".";
    let bestScore = 0;
    let bestWord = [];
    for (let j = 2;j<=hand.length;j++) {
        regexString += "[A-Z]";
        regexArr.push("[A-Z]");
        hashString += ".";
        for (const l of findMatches(regexString,regexArr,j,hashString)) {
            if (canPlayWord(handLetters,l,blanks)) {
                for (let k = 0;k<8;k++) {
                    if (k+j < 7) continue;
                    const [score, playedLetters, wordAsPlayed, points] = scorePlay(board,l,7,k,"row","               ",handLetters,handLetters,blanks,bag);
                    if (score > bestScore) {
                        bestScore = score;
                        bestWord = [l, 7, "row", k, playedLetters, wordAsPlayed, points];
                    }
                }
            }
        }
    }
    return [bestScore,bestWord];
}
function solveBoard(board, hand) {
    const rows = Array.from({length:15}).map(o=>"");
    const cols = Array.from({length:15}).map(o=>"");
    const leftInBag = ["A","A","A","A","A","A","A","A","A","B","B","C","C","D","D","D","D","E","E","E","E","E","E","E","E","E","E","E","E","F","F","G","G","G","H","H","I","I","I","I","I","I","I","I","I","J","K","L","L","L","L","M","M","N","N","N","N","N","N","O","O","O","O","O","O","O","O","P","P","Q","R","R","R","R","R","R","S","S","S","S","T","T","T","T","T","T","U","U","U","U","V","V","W","W","X","Y","Y","Z","*","*"];
    const handLetters = {};
    let bestScore = -10000;
    let bestWord = [];
    let blanks = 0;
    for (const i of hand) {
        if (alphabetSet.has(i)) handLetters[i] = handLetters[i]+1||1;
        else if (i == "*") blanks++;
        leftInBag.splice(leftInBag.indexOf(i), 1);
    }
    let foundAnything = false;
    for (let row = 0;row<15;++row) {
        for (let col = 0;col<15;++col) {
            let i = board[row][col].toUpperCase();
            if (i == "") i = " ";
            else foundAnything = true;
            const a = leftInBag.indexOf(i.toUpperCase())
            if (a > -1) leftInBag.splice(a, 1);
            rows[row] += i;
            cols[col] += i;
        }
    }
    if (!foundAnything) {
        return solveFirstTurn(board,hand,handLetters,blanks,bag);
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
        const [a,b] = solveRow(board, i, "col", cols[i], colRegexes[i], colHashes[i], handLetters, blanks, bag);
        const [c,d] = solveRow(board, i, "row", rows[i], rowRegexes[i], rowHashes[i], handLetters, blanks, bag);
        if (a > bestScore) {bestScore = a;bestWord = b;}
        if (c > bestScore) {bestScore = c;bestWord = d;}
    }
    return [bestScore, bestWord];
}

function scorePlay(board, word, rowIndex, index, direction, row, handLetters, newLetterDict, blanks, bag) {
    let points = 0;
    let extra = 0;
    let mult = 1;
    let newLetters = 0;
    let playedLetters = "";
    const blankPositions = wordBlanksPosition(newLetterDict,word);
    let wordAsPlayed = "";
    for (let i = index;i < index+word.length;i++) {
        if (row[i] == " ") {
            newLetters++;
            const [wordMult,letterMult] = getBoardSpecial(direction=="row"?rowIndex:i,direction=="row"?i:rowIndex);
            mult *= wordMult;
            const isABlank = blankPositions.includes(i-index);
            playedLetters += isABlank ? "*" : word[i-index];
            points += isABlank?0:letterPoints[word[i-index]]*letterMult; // figure out which are blanks
            wordAsPlayed += isABlank?word[i-index].toLowerCase():word[i-index].toUpperCase();
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
            wordAsPlayed += row[i];
            points += letterPoints[row[i]];
        }
    }
    points *= mult;
    points += extra;
    if (newLetters == 7) points += 50;
    let score = points;
    let used;
    if (window.firstPlayerTurn) used = weighting1;
    else used = weighting2;
    for (const i of playedLetters) score -= used[i];
    return [score,playedLetters,wordAsPlayed,points];
}

function playGame(seed,display=false) {
    console.time("playGame");
    random = new Alea(seed);
    const gameBoard = Array.from({length:15}).map(o=>Array.from({length:15}).map(p=>""));
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
            hand.splice(hand.indexOf(i),1);
        }
    }
    const player1Hand = [];
    const player2Hand = [];
    let player1Score = 0;
    let player2Score = 0;
    for (let i = 0;i<7;i++) {
        addTile(player1Hand);
        addTile(player2Hand);
    }
    let player1Turn = random() < 0.5;
    let lastTurnCouldntPlay = false;
    while (player1Hand.length && player2Hand.length) {
        let newTiles = 0;
        if (player1Turn) {
            window.firstPlayerTurn = true;
            // TODO: ADD LOGIC FOR WEIGHT SWITCHING
            const [bestScore, bestData] = solveBoard(gameBoard,player1Hand.join(""));
            const [word,index,direction,rowIndex, playedLetters, wordAsPlayed, points] = bestData;
            if (word) {
                let y,x;
                if (direction == "row") [y,x]=[index,rowIndex];
                else [y,x]=[rowIndex,index];
                for (let i = 0;i<wordAsPlayed.length;i++) {
                    if (gameBoard[y][x] == "") gameBoard[y][x] = wordAsPlayed[i];
                    if (direction == "row") x++;
                    else y++;
                }
                player1Score += points;
                removeTiles(player1Hand,playedLetters);
                for (let i = 0;i<playedLetters.length;i++) addTile(player1Hand);
                lastTurnCouldntPlay = false;
            } else {
                if (lastTurnCouldntPlay) break;
                lastTurnCouldntPlay = true;
            }
        } else {
            window.firstPlayerTurn = false;
            const [bestScore, bestData] = solveBoard(gameBoard,player2Hand.join(""));
            const [word,index,direction,rowIndex, playedLetters, wordAsPlayed, points] = bestData;
            if (word) {
                let y,x;
                if (direction == "row") [y,x]=[index,rowIndex];
                else [y,x]=[rowIndex,index];
                for (let i = 0;i<wordAsPlayed.length;i++) {
                    if (gameBoard[y][x] == "") gameBoard[y][x] = wordAsPlayed[i];
                    if (direction == "row") x++;
                    else y++;
                }
                player2Score += points;
                removeTiles(player2Hand,playedLetters);
                for (let i = 0;i<playedLetters.length;i++) addTile(player2Hand);
                lastTurnCouldntPlay = false;
            } else {
                if (lastTurnCouldntPlay) break;
                lastTurnCouldntPlay = true;
            }
        } 
        player1Turn = !player1Turn;
    }
    if (player1Hand.length == 0) {
        for (const i of player2Hand) {
            player1Score += letterPoints[i];
            player2Score -= letterPoints[i];
        }
    } else {
        for (const i of player1Hand) {
            player2Score += letterPoints[i];
            player1Score -= letterPoints[i];
        }
    }
    console.timeEnd("playGame");
    if (display) {
        console.log(player1Score,player2Score);
        gameBoard.push([],[]);
        window.localStorage.setItem("scrabbleSolver",JSON.stringify(gameBoard));
        loadBoard();
        saveBoard();
    }
    return [player1Score, player2Score];
}