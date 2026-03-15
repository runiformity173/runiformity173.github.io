class DSU {
    constructor(length) {
        this.n = length;
        this.parent = new Int16Array(length);
        this.size = new Int16Array(length);
        for (let i = 0;i<length;i++) {
            this.parent[i] = i;
            this.size[i] = 1;
        }
    }
    get(i) {
        if (this.parent[i] == i) return i;
        const a = this.get(this.parent[i]);
        this.parent[i] = a;
        return a;
    }
    join(i,j) {
        if (this.size[this.get(j)] > this.size[this.get(i)]) {
            this.join(j,i);
            return;
        }
        this.size[this.get(i)] += this.size[this.get(j)];
        this.parent[this.get(j)] = this.get(i);
    }
}
