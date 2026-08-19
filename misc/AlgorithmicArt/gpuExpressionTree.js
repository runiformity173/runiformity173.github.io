const gpu = new GPU.GPU();
sin(channel, freq, t=0) {
    const sinKernel = gpu.createKernel(function(a,freq,t) {
        return 1/2 - 1/2*Math.cos(Math.PI*a[this.thread.x]*2*freq + t);
    }).setOutput([this.width*this.height]);
    this[channel] = sinKernel(this[channel],freq,t);
    sinKernel.destroy();
    return this;
}
class Image {
    constructor(width,height) {
        this.width = width;
        this.height = height;
        this.r = new Float64Array(width*height);
        this.g = new Float64Array(width*height);
        this.b = new Float64Array(width*height);
        this.queuedShaders = [];
    }
    copy() {
        const out = new Image(this.width,this.height);
        for (let i = 0; i < this.width*this.height; i++) {
            out.r[i] = this.r[i];
            out.g[i] = this.g[i];
            out.b[i] = this.b[i];
        }
        return out;
    }
    add(channel, amt) {
        for (let i = 0; i < this.width * this.height;i++) {
            this[channel][i] += amt;
        }
        return this;
    }
    
    gradient(channel, angle) {
        const dx = Math.cos(-angle);
        const dy = Math.sin(-angle);

        const corners = [
            [0, 0],
            [this.width - 1, 0],
            [0, this.height - 1],
            [this.width - 1, this.height - 1]
        ];

        const projections = corners.map(([x, y]) => x * dx + y * dy);

        const minProj = Math.min(...projections);
        const maxProj = Math.max(...projections);
        const range = maxProj - minProj || 1;

        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const p = x * dx + y * dy;
                this[channel][y*this.width+x] = (p - minProj) / range;
            }
        }
        return this;
    }
    randGradient() {
        const angle = Math.random()*2*Math.PI;
        this.gradient("r",angle);
        this.gradient("g",angle);
        this.gradient("b",angle);
        return this;
    }
    blur(channel, size) {
        gaussianBlur(this[channel],this.width,this.height,size);
        return this;
    }
    round(channel) {
        for (let i = 0; i < this.width*this.height;i++) {
            this[channel][i] = Math.round(this[channel][i]);
        }
        return this;
    }
    pow(channel, a) {
        for (let i = 0; i < this.width*this.height;i++) {
            this[channel][i] = Math.pow(this[channel][i],a);
        }
        return this;
    }
    sqrt(channel) {
        return this.pow(channel,1/2);
    }
    subtractImage(other) { // more lines of code, but processing each channel separately helps with cache hits.
        for (let i = 0; i < this.width*this.height; i++) {
            this.r[i] -= other.r[i];
        }
        for (let i = 0; i < this.width*this.height; i++) {
            this.g[i] -= other.g[i];
        }
        for (let i = 0; i < this.width*this.height; i++) {
            this.b[i] -= other.b[i];
        }
        return this;
    }
    addImage(other) { // more lines of code, but processing each channel separately helps with cache hits.
        for (let i = 0; i < this.width*this.height; i++) {
            this.r[i] = other.r[i]+this.r[i];
        }
        for (let i = 0; i < this.width*this.height; i++) {
            this.g[i] = other.g[i]+this.g[i];
        }
        for (let i = 0; i < this.width*this.height; i++) {
            this.b[i] = other.b[i]+this.b[i];
        }
        return this;
    }
    multiplyImage(other) { // more lines of code, but processing each channel separately helps with cache hits.
        for (let i = 0; i < this.width*this.height; i++) {
            this.r[i] = other.r[i]*this.r[i];
        }
        for (let i = 0; i < this.width*this.height; i++) {
            this.g[i] = other.g[i]*this.g[i];
        }
        for (let i = 0; i < this.width*this.height; i++) {
            this.b[i] = other.b[i]*this.b[i];
        }
        return this;
    }
    divideImage(other) { // more lines of code, but processing each channel separately helps with cache hits.
        for (let i = 0; i < this.width*this.height; i++) {
            this.r[i] = this.r[i]/Math.max(0.001,other.r[i]);
        }
        for (let i = 0; i < this.width*this.height; i++) {
            this.g[i] = this.g[i]/Math.max(0.001,other.g[i]);
        }
        for (let i = 0; i < this.width*this.height; i++) {
            this.b[i] = this.b[i]/Math.max(0.001,other.b[i]);
        }
        return this;
    }
    sharpen(channel) {
        sharpenChannel(this[channel],this.width,this.height);
        return this;
    }
    randSin() {
        this.sin("r");
        this.sin("g");
        this.sin("b");
        return this
    }
    randCos() {
        this.cos("r");
        this.cos("g");
        this.cos("b");
        return this
    }
    randArctan() {
        this.arctan("r");
        this.arctan("g");
        this.arctan("b");
        return this
    }
    randColor() {
        this.add("r",Math.random());
        this.add("g",Math.random());
        this.add("b",Math.random());
        return this;
    }
    cleanup() {
        for (const channel of ["r","g","b"]) {
            for (let i = 0; i < this.width * this.height; i++) {
                this[channel][i] = clamp(this[channel][i]);
            }
        }
        return this;
    }
}
let aR = 0;
let aG = 1;
let aB = 0.7;
let t = 0;
const functions = [
    ["randColor",0],
    ["randGradient",0],
    ["randSin",1],
    ["randCos",1],
    ["randArctan",1],
    ["addImage",2],
    ["subtractImage",2],
    ["multiplyImage",2],
    ["divideImage",2],
    // ["screenImage",2],
    // mult, safe divide, arctan
]
const MIN_DEPTH = 10;
const MAX_DEPTH = 15;
function generate(depth=0) {
    const possibleFuncs = functions.filter(o=>(
        o[1] > 0 && depth < MAX_DEPTH || o[1] == 0 && depth >= MIN_DEPTH
    ))
    const func = possibleFuncs[Math.floor(Math.random()*possibleFuncs.length)];
    if (func[1] == 0) {
        return (new Image(512, 512))[func[0]]();
    }
    const args = [];
    while (args.length < func[1]) {
        args.push(generate(depth+1));
    }
    console.log(args, func)
    return args[0][func[0]](...args.slice(1));
}
makeImage(generate().cleanup());