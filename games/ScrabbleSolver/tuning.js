const randomRandom = new Alea("E7AB2EFED48F2570");
function seedHunt(desired) {
    while (true) {
        const c = getString();
        const l = new Alea(c);
        if (Math.floor(l()*27) == desired && l() < 0.5) return c;
    }
}
function getString(n=16) {
    let a = "";
    for (let i = 0;i<n;i++) a += "0123456789abcdef"[Math.floor(randomRandom()*16)]
    return a;
}
async function getWinPercentage(n=10) {
    let winsFor1 = 0;
    console.log(JSON.stringify(weighting1));
    console.log(JSON.stringify(weighting2));
    for (let i = 0;i<n;i++) {
        console.log(i);
        const seed = getString();
        const [points1, points2] = playGame(seed);
        if (points1 > points2)
            winsFor1++;
        else if (points1 == points2) winsFor1 += 0.5;
    }
    return winsFor1/n;
}
function stdNormal(r){var n,t,o,u,f,a,e,i,l;if(r<-6)return 0;if(6<r)return 1;for(t=1,e=(a=(l=r)*r)*a,o=[],n=0;n<100;n+=2)f=l/((i=2*n+1)*t),f*=1-i*a/((1+i)*(2+i)),o.push(f),t*=4*(n+1)*(n+2),l*=e;for(u=0,n=49;0<=n;n--)u+=o[n];return.5+.3989422804014327*u}
function testStatistic(proportion, n) {
    return (proportion-0.5)/Math.sqrt(0.25/n);
}
async function tuneWeights(cycles, n, step) {
    for (let i = 0;i<cycles;i++) {
        weighting2 = structuredClone(weighting1);
        const rKey = "QWERTYUIOPASDFGHJKLZXCVBNM*"[Math.floor(randomRandom()*27)];
        console.log(rKey);
        weighting2[rKey] += randomRandom() < 0.5 ? step : -step
        console.log(`${rKey} now worth ${weighting2[rKey]}`);
        const pHat = 1-await getWinPercentage(n);
        const z = testStatistic(pHat, n);
        const pScore = stdNormal(z)
        console.log(pHat,z,pScore);
        if (pScore > 0.95) {
            weighting1 = weighting2;
            console.log(JSON.stringify(weighting1));
        }
    }
}
// tuneWeights(1, 30, 1)