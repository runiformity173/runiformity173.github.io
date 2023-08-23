const help = document.createElement("div");
const overlay = document.createElement("div");
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.opacity = 0.0;
overlay.style.transition = "opacity 0.2s ease-out";
overlay.style.backgroundColor = "#292521";
overlay.style.cursor = "pointer";
overlay.style.color = "#ffffff";
overlay.style.textAlign = "center";
overlay.style.display = "none";
overlay.style.position = "absolute";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.zIndex = 100000000;
overlay.innerHTML = "<p style='font-family:verdana;'>"+helpText.replaceAll("\n","<br>")+"</p>"
// overlay.firstElementChild.style.opacity = "1.0";
let helpIsDisplayed = false;
document.onkeyup = function(e) {
  if (e.keyCode == 72 && e.altKey) {
  
    if (!helpIsDisplayed) {
      overlay.style.opacity = 0.0;
      overlay.style.display = "block";
      setTimeout(function(){overlay.style.opacity = 1.0;},0);
    } else {
      overlay.style.opacity = 0.0;
      setTimeout(function(){overlay.style.display = "none";},200);
    }
    helpIsDisplayed = !helpIsDisplayed;
    console.log("hi");
  }
};
overlay.addEventListener("click",function(){
  overlay.style.opacity = 0.0;
  setTimeout(function(){overlay.style.display = "none";},200);
  helpIsDisplayed = false;
})
help.id="help";
help.style.backgroundColor = "#39332d";
help.style.cursor = "pointer";
help.style.borderRadius = "100px";
help.style.position = "absolute";
help.style.right = "10px";
help.style.top = "10px";
help.style.width = "50px";
help.style.height = "50px";
help.innerHTML = '<img src="/images/help.png" style="width:100%;height:100%;opacity:0.5;border-radius:100px;">';
// help.addEventListener("keydown",function(){
//   overlay.style.display = "block";
//   overlay.style.transition = "opacity 0.2s ease-out";
//   setTimeout(function(){overlay.style.opacity = 0.5;},0);
//   helpIsDisplayed = true;
// })
// document.body.appendChild(help);
document.body.appendChild(overlay);