function fromName(l) {
  return l.replaceAll(" ","").replaceAll("-"," ").replaceAll("%27","'")
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function openSites(f) {
  let cc = JSON.parse(getCookie(f));
  console.log(f,getCookie(f))
//   var linkArray = cc; // your links
//   for (var i = 1; i < linkArray.length; i++) {
//     // will open each link in the current window
//     chrome.tabs.create({
//         url: linkArray[i]
//     });
// }
  for (let i in cc) {
    if (i!=0) {
      setTimeout(()=>{window.open(cc[i],"_blank")},100);
    }
  }
  window.location.href = cc[0];
 
}
function load2() {
    for (let l of document.cookie.split(";")) {
      const name = l.split("=")[0].replaceAll(" ","");
      console.log(name);
      if (!l.includes("_") && l.includes("=")) {
        document.getElementById("output").innerHTML += '<a onclick="'+"openSites('"+name+"');"+'">'+fromName(name)+'</a><br>';}
    }
}