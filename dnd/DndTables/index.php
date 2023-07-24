<!DOCTYPE html>
<html>
  <head>
    <title>Tables</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    <script src="data.js"></script>
    <script src="scripts.js"></script>
    <script src="monsters.js"></script>
    <script src="treasure.js"></script>
  </head>
  <body onload="reevaluate();">
    Filter: <select name="tableType" id="tableType" onchange="reevaluate()">
      <option name="all">All</option>
      <option name="treasure">Treasure</option>
      <option name="monsters">Encounters</option>
    </select><br><br>
    Category: <select name="tableTable" id="tableTable" onchange="reevaluate()">
      <option name="hoard">Hoard</option>
      <option name="individual">Individual</option>
      <option name="dragon">Dragon Hoard</option>
      <option name="swamp">Arctic</option>
      <option name="swamp">Coastal</option>
      <option name="swamp">Desert</option>
      <option name="swamp">Forest</option>
      <option name="swamp">Grassland</option>
      <option name="swamp">Hill</option>
      <option name="swamp">Mountain</option>
      <option name="swamp">Swamp</option>
      <option name="swamp">Underdark</option>
      <option name="swamp">Underwater</option>
      <option name="swamp">Urban</option>
    </select><br><br>
    Challenge Rating: <select name="tableChallenge" id="tableChallenge">
      <option name="0">0-4</option>
      <option name="5">5-10</option>
      <option name="11">11-16</option>
      <option name="17">17+</option>
      <option name="wyrmling">Wyrmling</option>
      <option name="young">Young</option>
      <option name="adult">Adult</option>
      <option name="ancient">Ancient</option>
    </select><br><br>
    <button onclick="document.getElementById('load').innerHTML='Rolling...';document.getElementById('output').innerHTML='';setTimeout(run,10)">Roll!</button>
    <p id="load"><br></p>
    <p id="output"></p>
  </body>
</html>