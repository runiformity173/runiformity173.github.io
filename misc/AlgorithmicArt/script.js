const gpu = new GPU.GPU();
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
    sin(channel, freq, t=0) {
        const sinKernel = gpu.createKernel(function(a,freq,t) {
            return 1/2 - 1/2*Math.cos(Math.PI*a[this.thread.x]*2*freq + t);
        }).setOutput([this.width*this.height]);
        this[channel] = sinKernel(this[channel],freq,t);
        sinKernel.destroy();
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
            this.r[i] = clamp(other.r[i]+this.r[i]);
        }
        for (let i = 0; i < this.width*this.height; i++) {
            this.g[i] = clamp(other.g[i]+this.g[i]);
        }
        for (let i = 0; i < this.width*this.height; i++) {
            this.b[i] = clamp(other.b[i]+this.b[i]);
        }
        return this;
    }
    sharpen(channel) {
        sharpenChannel(this[channel],this.width,this.height);
        return this;
    }
}
let aR = 0;
let aG = 1;
let aB = 0.7;
let t = 0;
function frame() {
    const img = new Image(512,512);
    for (const [color, ang] of [["r",aR],["g",aG],["b",aB]]) {
        img.gradient(color, ang)
        .sin(color, 3)
        .addImage(
            new Image(512,512)
                .gradient(color,2*ang)
                .sin(color,3)
        )
        .sin(color, 2)
        .sharpen(color)
    }
        // .gradient("g", aG)
        // .pow("g",3)
        // .addImage(
        //     new Image(512,512)
        //         .gradient("g",aG*2)
        //         .pow("g",4)
        // )
        // .gradient("b", aB)
        // .pow("b",3)
        // .addImage(
        //     new Image(512,512)
        //         .gradient("b",aB*2)
        //         .pow("b",4)
        // )
        // .sin("r", 3, t/5)
        // .sin("r",2, t/9)
        // .gradient("g",aG)
        // .gradient("b",aB)
    aR += 0.007;
    aG += 0.015;
    aB += 0.013;
    makeImage(img);
    t++;
    if (!STOP) {
        requestAnimationFrame(frame);
    } else {
        STOP = false;
    }
}
requestAnimationFrame(frame);
STOP = false;