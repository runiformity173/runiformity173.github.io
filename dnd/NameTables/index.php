<!DOCTYPE html>
<html>
  <head>
    <title>Tables</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    <script src="scripts.js"></script>
  </head>
  <body>
    Category: <select name="tableTable" id="tableTable">
      <option name="male">Male</option>
      <option name="female">Female</option>
    </select><br><br>
    <button onclick="document.getElementById('load').innerHTML='Rolling...';document.getElementById('output').innerHTML='';setTimeout(run,0);">Roll!</button>
    <p id="load"><br></p>
    <p id="output"></p>
  </body>
</html>