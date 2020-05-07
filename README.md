# <img src="app/favicon.png" alt="Logo" width="32px" style="image-rendering: crisp-edges;"> WASM TerrainGeneration

Terrain Generator written with C (compiled into WebAssembly) and visualized with HTML5/JavaScript.
Prototyped in Python using the Noise module.

<h2>Table of Contents</h2>
    <ol id="toc">
      <li><a href="#about">About</a></li>
      <li><a href="#usage">Usage</a></li>
      <li><a href="#architecture">Architecture</a></li>
      <li><a href="#bugs">Bugs/Compatibility</a></li>
    </ol>
    <h2 id="about">About</h2>
    <p>This terrain generator uses Perlin noise and was built with WebAssembly,
    C, and JavaScript. My motivation to build this stems from my interest in
    producing complex behavior from simple systems. While noise generation is not
    entirely simple, to the perceiver, giving a noisy map even a little
    bit of context (e.g. letting the values represent depth or height) forms
    an entirely new perspective. Assigning meaning to numerical values can
    elevate a noise function to a model resembling the natural world.</p>
    <h2 id="usage">Usage</h2>
<h3>Movement</h3>
    <p>
      Move by ten sudo-pixels (i.e. one coordinate value) using the directional
      navigation buttons. Alternatively, go to a specific position by entering
      two non-negative integers and clicking the button. The left plus (+) and
      minus (-) buttons zoom, in and out respectively, relative to the top left
      pixel of the map.
    </p>
    <p>
      The keyboard can also be used to navigate the terrain with the following controls.
      <ul>
        <li><code>W</code> - Move Up / Increase Y Value</li>
        <li><code>A</code> - Move Left / Decrease X Value</li>
        <li><code>S</code> - Move Down / Decrease Y Value</li>
        <li><code>D</code> - Move Right / Increase X Value</li>
      </ul>
    </p>
    <h3>Seed</h3>
    <p>
      The initial seed is randomized when the document loads, but you can
      manually enter new seeds or load up previously encountered ones for the
      same generation.
    </p>
    <p>
      While any string can be entered as a seed, repeat values may be found as
      strings, that are not already positive integers, are hashed into an integer
      value and the safe integer limit can be passed when using extraneous or
      lengthy strings. When this occurs the seed falls back to the absolute value of 
      the integer wrap-around.
    </p>
    <p>
      Overriding the integer limit check can be done by simply entering an integer
      larger than <code>2<sup>53</sup></code>. At this point significant
      stretching and artifacting is noticeable. 
    </p>
    <h3>Limitations</h3>
    <p>You cannot navigate towards or go to negative values using the UI (all there is to see is artifact clutter). Additionally artifacts begin appearing as X and Y approach infinity.</p>
    <h2 id="architecture">Architecture</h2>
    <h3>Algorithm</h3>
    <p>Using a simplified 2D Perlin noise algorithm implemented in C to calculate depth information for each point value. For speed and simplicity, the program works optimally when <code>X, Y ∈ {a | 0 ≤ a ≤ 15000, a ∈ Z}</code> where X and Y are integers representing horizontal and vertical position values respectively. The C algorithm has been compiled into WebAssembly (WASM) to run as a binary executable in the web browser. The compiled WASM module is able to provide unmatched speed when compared to JavaScript.</p>
    <h3>Chunking</h3>
    <p>Each coordinate position in the interface represents a 10 by 10 fat pixel chunk which are kept in state to save on memory for small movements. This is especially important due to existing issues with excessive WebAssembly calls (and memory leaking) on some versions of Chromium resulting in a dead tab.</p>
    <h3>Rendering</h3>
    <p>The last, and arguably most important, part of a terrain generator is rendering. Graphics are what contextualize a 2D array of integers into a visual that can be perceived as an aerial view of a landscape. A constant <code>WATER_LEVEL</code> is used to find what is present at each height of the terrain and assign both a color, for material, and an accenting shade for height or depth. Lastly, some shades are randomly altered to add more texture to the map.</p>
    <p>This process is repeated for every fat pixel on the display and uses JavaScript to draw each chunk onto an HTML5 canvas. The final fat pixel density is determined by the <code>RESOLUTION</code> constant currently set to 100 for the amount of colored squares of each axis. Increasing this constant to a high number (e.g. 400) would increase perceived resemblance to an organic map, but with additional noise values to estimate and an O<sup>2</sup> iteration of the map on render time this process becomes exponentially complex in both time and space. A better solution to achieve a more organic shapes would be to estimate interpolated curves between the points.</p>
    <h2 id="bugs">Bugs/Compatibility</h2>
    <p>Did something go wrong? Make sure you have a compatible browser. This program works with all web browsers supporting WebAssembly and HTML5 Canvas. I have compiled a list of popular browser versions in the table below. If your browser should be compatible and you are still facing errors <a target="_blank" href="https://github.com/SirajChokshi/TerrainGeneration/issues/new">open an issue on Github</a> or feel free to shoot an email to <a href="mailto:sirajsc2@illinois.edu">sirajsc2@illinois.edu</a>.</p>
    <table id="comp-table">
      <tr><th>Browser</th><th>Minimum Version</th><th>Recommended Version</th></tr>
      <tr><td>Firefox</td><td>52</td><td>58</td></tr>
      <tr><td>Chrome</td><td>57</td><td>61</td></tr>
      <tr><td>Safari</td><td>11</td><td>11</td></tr>
      <tr><td>Edge</td><td>16</td><td>16</td></tr>
      <tr><td>Opera</td><td>44</td><td>47</td></tr>
    </table>
    <ol class="bib">
      <li><cite>WebAssembly. (2020, April 22). Retrieved May 1, 2020, from <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/WebAssembly" target="_blank" >https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/WebAssembly</a></cite></li>
      <li><cite>WebGL API. (2020, March 31). Retrieved May 1, 2020, from <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API" target="_blank">https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API</a></cite></li>
    </ol>
