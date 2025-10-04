const randomRandom = new Alea("84ae70150aca1a56");
function seedHunt(desired) {
    while (true) {
        const c = getString();
        const l = new Alea(c);
        l();
        if (Math.floor(l()*27) == desired && l() < 0.5) return c;
    }
}
function getString(random=randomRandom,n=16) {
    let a = "";
    for (let i = 0;i<n;i++) a += "0123456789abcdef"[Math.floor(random()*16)]
    return a;
}
async function getWinPercentage(n=10,random=randomRandom) {
    let winsFor1 = 0;
    console.log(JSON.stringify(weighting1));
    console.log(JSON.stringify(weighting2));
    for (let i = 0;i<n;i++) {
        console.log(i);
        const seed = getString(random);
        [weighting1,weighting2] = [weighting2,weighting1];
        if (i%2 == 0) {
            const [points2, points1] = playGame(seed);
            if (points1 > points2) winsFor1++;
            else if (points1 == points2) winsFor1 += 0.5;
        } else {
            const seed = getString(random);
            const [points1, points2] = playGame(seed);
            if (points1 > points2) winsFor1++;
            else if (points1 == points2) winsFor1 += 0.5;
        }

        if (i > 48 && stdNormal(testStatistic(1-(winsFor1/(i+1)),i+1)) < 0.45) return winsFor1/(i+1);
    }
    return winsFor1/n;
}
function stdNormal(r){var n,t,o,u,f,a,e,i,l;if(r<-6)return 0;if(6<r)return 1;for(t=1,e=(a=(l=r)*r)*a,o=[],n=0;n<100;n+=2)f=l/((i=2*n+1)*t),f*=1-i*a/((1+i)*(2+i)),o.push(f),t*=4*(n+1)*(n+2),l*=e;for(u=0,n=49;0<=n;n--)u+=o[n];return.5+.3989422804014327*u}
function testStatistic(proportion, n, p) {
    return (proportion-p)/Math.sqrt((p*(1-p))/n);
}
async function tuneWeights(cycles, n, step) {
    const cycleSeed = randomRandom();
    let cycleRandom = new Alea(cycleSeed);
    weighting2 = structuredClone(weighting1);
    window.calibration = true;
    const p = 1-await getWinPercentage(n,cycleRandom);
    window.calibration = false;
    for (let i = 0;i<cycles;i++) {
        cycleRandom = new Alea(cycleSeed);
        weighting2 = structuredClone(weighting1);
        // const rKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZ*"[Math.floor(randomRandom()*27)];
        // console.log(rKey);
        // weighting2[rKey] += randomRandom() < 0.5 ? step : -step
        // console.log(`${rKey} now worth ${weighting2[rKey]}`);
        weighting2["S"] = 6;
        weighting2["*"] = 8;
        const pHat = 1-await getWinPercentage(n, cycleRandom);
        console.log(pHat,n,p)
        const z = testStatistic(pHat, n, p);
        const pScore = stdNormal(z)
        console.log(pHat,z,pScore);
        if (pScore > 0.85) {
            weighting1 = weighting2;
            console.log("DEFINITELY BETTER")
            console.log(JSON.stringify(weighting1));
        }
    }
}
// tuneWeights(1, 30, 1)