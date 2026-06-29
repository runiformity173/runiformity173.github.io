function gaussianBlur(grid, width, height, sigma) {
    const kernel = makeGaussianKernel(sigma);
    const radius = kernel.length >> 1;
    

    const tmp = new Float64Array(Math.max(width,height));

    for (let y = 0; y < height; y++) {
        const row = y * width;

        for (let x = 0; x < width; x++) {
            let sum = 0;

            for (let k = -radius; k <= radius; k++) {
                const xx = Math.max(0, Math.min(width - 1, x + k));
                sum += grid[row + xx] * kernel[k + radius];
            }

            tmp[x] = sum;
        }
        grid.set(tmp.subarray(0,width),row);
    }
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let sum = 0;

            for (let k = -radius; k <= radius; k++) {
                const yy = Math.max(0, Math.min(height - 1, y + k));
                sum += grid[yy * width + x] * kernel[k + radius];
            }

            tmp[y] = sum;
        }
        for (let y = 0; y < height; y++) {
            grid[y*width+x] = tmp[y];
        }
    }
}

function makeGaussianKernel(sigma) {
    const radius = Math.ceil(sigma * 3);
    const size = radius * 2 + 1;
    const kernel = new Float32Array(size);
    const s2 = sigma * sigma * 2;
    let sum = 0;
    for (let i = -radius; i <= radius; i++) {
        const w = Math.exp(-(i * i) / s2);
        kernel[i + radius] = w;
        sum += w;
    }
    for (let i = 0; i < size; i++)
        kernel[i] /= sum;
    return kernel;
}
function sharpenChannel(data, width, height) {
    const prev = new Float64Array(width);
    const curr = new Float64Array(width);
    const next = new Float64Array(width);
    let row = 0;
    curr.set(data.subarray(0, width));
    if (height > 1)
        next.set(data.subarray(width, width * 2));
    for (let y = 0; y < height; y++) {
        if (y > 0) {
            const t = prev;
            prev.set(curr);
            curr.set(next);
            row++;
            if (row + 1 < height)
                next.set(data.subarray((row + 1) * width, (row + 2) * width));
        }
        if (y === 0 || y === height - 1)
            continue;
        const out = y * width;
        for (let x = 1; x < width - 1; x++) {
            let v =
                curr[x] * 9
                - prev[x - 1] - prev[x] - prev[x + 1]
                - curr[x - 1]            - curr[x + 1]
                - next[x - 1] - next[x] - next[x + 1];
            data[out + x] = v < 0 ? 0 : v > 1 ? 1 : v;
        }
    }
}
function clamp(a) {return Math.max(0,Math.min(1,a))}