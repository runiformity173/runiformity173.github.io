class WordTree {
    constructor(words) {
        this.tree = {};
        for (const i of words) {
            let cur = this.tree;
            for (const letter of i) {
                if (letter in cur) {
                    cur = cur[letter]
                } else {
                    cur[letter] = {};
                    cur = cur[letter];
                }
            }
            if ("words" in cur) cur.words.add(i)
            else cur.words = new Set([i]);
        }
    }
    __findWords(regex,cur,index=0,trace="") {
        if ("" === cur) cur = this.tree;
        if (!cur) return new Set();
        const i = regex[index];
        if (regex.length != index) {
            let matches = new Set();
            if (i == "[]") return new Set();
            if (i == "[A-Z]") {
                for (const j of alphabet) {
                    matches = matches.union(this.__findWords(regex,cur[j],index+1,trace+j));
                }
            } else {
                for (const j of i.slice(1,-1)) {
                    matches = matches.union(this.__findWords(regex,cur[j],index+1,trace+j));
                }
            }
            return matches;
        } else {
            return cur.words || new Set();
        }
    }
    findWords(regex) {
        return this.__findWords(regex,"");
    }
}
const wordTree = new WordTree(wordList);