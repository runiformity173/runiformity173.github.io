function load() {
    if (window.location.href.includes("?")) {
      let ff = getByName(window.location.href.split("?feat=")[1].replaceAll("-"," ").replaceAll("%27","'"));
    
      document.getElementById("all").style.opacity = 1;
    
      document.getElementById("output2").innerHTML = ff["name"];
    
      if (ff["prerequisite"]) {document.getElementById("output").innerHTML += `<i>Prerequisite: ${ff["prerequisite"]}</i>`;}
    
      document.getElementById("output").innerHTML += "<br><br>"+ff["description"].replaceAll("\n\n","<br>&emsp;");
    
      document.getElementById("output").innerHTML += "<strong>Source: </strong>"+ff["source"]+"<br>";
      
    }}
    
    function getByName(name) {
      for (feat of data) {
        if (feat.name.toLowerCase() === name.toLowerCase()) return feat;
      }
      return False;
    }