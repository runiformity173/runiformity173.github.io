const helpText = "asdf";
window.portfolioText = `<h1>Basics</h1>
Click and hold (or drag) in the square on the left side of the screen to add particles.<br>
You can change what material you're adding (your brush) using the selector on the right.<br>
In addition to the selector, you can also set your brush to Heat Gun to make the targeted particles hot or Erase to remove what's there.<br>
Alternatively, you can Shift+Click on the board to copy whatever you target to your brush.<br>
Finally, use the slider to adjust the radius of the brush.<br>
<h1>Tools</h1>
The central section of the sidebar are useful tools.<br>
You can reset the whole board, clear everything matching your current brush, fill the whole board with the current brush, or fill all empty spots (air) with the current brush.<br>
You can use a combination of filling and replacing to great effect. For example, on a board divided in two by a stone wall, you can fill the air with plants, burn away half, fill that part that's now air with material 1, and clear the remaining plants and replace air with material 2.<br>
<h1>About the Simulation (if you want to, skip this and just start messing around!)</h1>
Solids float in the air, powders fall and form piles, liquids fall and flow until flat, and gasses disperse.<br>
Many materials interact with other materials, and the combinations are too numerous to list here. Some basics are ice freezing water, sand turning to glass, plants drinking water to grow, many materials burning or exploding, and sand absorbing water. (Also try using the ancient technique to make some fireworks...)<br>
There is also support for density, which is why wet sand sinks to the bottom of the normal sand, and why gasses such as steam and methane rise (on average).<br>
<h1>About the Code</h1>
This system is largely data-driven, so if you want to add some sort of new element that has complex rules, the system makes it much easier. The bamboo's behavior is quite complex, yet I didn't change a line of code to add it.<br>
Every cell can only view its immediate neighbors! (And 1 further for powders.) All of this complex behavior emerges from simple rules.<br>
`;