function start() {
    let canFly = undefined;
    let optionalFly = false;
    if (document.getElementById("fly").value == "Yes") {canFly = true;}
    else if (document.getElementById("fly").value == "No") {canFly = false;}
    else {optionalFly = true;}
    let canSwim = undefined;
    let optionalSwim = false;
    if (document.getElementById("swim").value == "Yes") {canSwim = true;}
    else if (document.getElementById("swim").value == "No") {canSwim = false;}
    else {optionalSwim = true;}
    const t = document.getElementById("cr").value;const cr = t=="<= 1/4"?0.25:t=="<= 1/2"?0.5:1;
    const climb = document.getElementById("climb").value=="Optional";
    document.getElementById("output").innerHTML = (animals.filter((o)=>(optionalFly||o.speeds.includes("fly")==canFly)).filter((o)=>(optionalSwim||o.speeds.includes("swim")==canSwim)).filter((o)=>(o.cr <= cr)).filter((o)=>(climb||o.speeds.includes("climb")))).sort((a,b)=>((a.cr*8+a.name)<(b.cr*8+b.name)?-1:1)).map((o)=>(o.name)).join("<br>");
  }