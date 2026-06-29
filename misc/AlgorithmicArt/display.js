let STOP = false;
function makeImage(img) {
    const n=document.createElement("canvas");
    n.width=img.width,n.height=img.height;
    const t=n.getContext("2d"),g=t.createImageData(n.width,n.height);
    for(let e=0;e<img.height;e++) {
        for(let t=0;t<img.width;t++) {
            h=4*(e*n.width+t);
            g.data[h]=img.r[e*img.width+t]*255,g.data[1+h]=img.g[e*img.width+t]*255,g.data[2+h]=img.b[e*img.width+t]*255,g.data[3+h]=255;
        }
    }
    t.putImageData(g,0,0);
    document.getElementById("output").src = n.toDataURL("image/png");
}