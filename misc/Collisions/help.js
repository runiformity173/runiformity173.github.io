const helpText = "asdf";
window.portfolioText = `<h1>Instructions</h1>
Use the buttons to switch between mouse modes.<br>
In Add Mode, click to add a circle.<br>
In Drag Mode, you can hold click and move the mouse to drag existing circles.<br>
In Static Mode, click to make a circle immovable.<br>
<h3>Link Mode</h3>
In Link Mode, a circle to begin linking. Then, click a second circle to link the two.<br>
The length of the link is determined by the slider, unless the checkbox for links to preserve current length is checked.<br>
If that checkbox is checked, then the length of the created link will be equal to the current distance between the two circles.<br>
<h1>About the Simulation</h1>
There are definitely some bugs in this simulation because I'm not using actual physics.<br>
I'm using Verlet integration for motion, which gives good results but does not entirely reflect reality.<br>
This ends up largely conserving momentum and dissipating kinetic energy, but individual edge cases can definitely break this.<br>
`;