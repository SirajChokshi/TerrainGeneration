// get canvas
let c = document.getElementById("canvas"), ctx = c.getContext("2d")

// init constants/vars
const WATER_LEVEL = 2, COMPLEXITY = 25, RESOLUTION = 100
let SCALE = 3, X_POS = 0, Y_POS = 0, SEED = Math.floor(Math.random() * 1000000);

// init array
const arr = Array(RESOLUTION).fill().map(() => Array(RESOLUTION).fill(NaN))

// set seed display
document.getElementById("enter-seed").value = SEED;

let noise, paintMap, scaler = 600 / RESOLUTION


const getColorFromDepth = (depth) => {
  // Get Color
  let color = "red";
  if (depth < WATER_LEVEL) color = "#3399ff";
  else if (depth < WATER_LEVEL + 2 && depth > WATER_LEVEL - 1) {
    color = "#ffe6b3";
    if (Math.random() > 0.4) color = pSBC(0.02, color)
  }
  else if (depth < WATER_LEVEL + 6) color = "#5cd65c";
  else if (depth < WATER_LEVEL + 7) color = "#6e9668";
  else if (depth < WATER_LEVEL + 9) color = "#85adad";
  else color = "#eff5f5";
  
  // Shade for depth/height
  let difference = (depth - WATER_LEVEL < -7 ? -7 : depth - WATER_LEVEL), shade = (depth >= WATER_LEVEL ? -0.08 : -0.04);
  color = pSBC(Math.abs(difference) * shade, color)
  if (Math.random() > 0.7) color = pSBC(0.012, color)
  
  return color;
}

function shift(arr, x, y) {
    while (x > 0) {
        arr.forEach(function (a) {
            a.pop();
            a.unshift(NaN);
        });
        x--;
    }
    while (x < 0) {
        arr.forEach(function (a) {
            a.shift();
            a.push(NaN);
        });
        x++;
    }
    while (y > 0) {
        arr.unshift(arr.pop().map(function () { return NaN; }));
        y--;
    }
    while (y < 0) {
        arr.push(arr.shift().map(function () { return NaN; }));
        y++;
    }
}

const move = (vector) => {
  if (X_POS + vector[0] * 5 >= 0) {
    X_POS += vector[0] * 5;
    shift(arr, 0, -vector[0] * 5)
  }
  if (Y_POS + vector[1] * 5 >= 0) {
    Y_POS += vector[1] * 5;
    shift(arr, -vector[1] * 5, 0)
  }
  paintMap(false);
}

try {
 WebAssembly.instantiateStreaming(fetch('bin/main.wasm'), {imports: {imported_func: arg => console.log(arg)}, js: {mem: new WebAssembly.Memory({initial:10, maximum:100})}}).then(
  results => {
    noise = (x, y, f, d, s) => results.instance.exports.perlin2d(x,y,f,d,s);
    paintMap = (change) => {
      // console.time("paintMap");
      
      let count = 0;
      
      for (let x = 0; x < arr.length; x++) {
        for (let y = 0; y < arr[0].length; y++) {
          // check if value needs refresh
          if(change || isNaN(arr[x][y])) {
            count++;
            // calculate scaled values
            nx = ((x + X_POS * RESOLUTION / 100)/arr.length) * 0.3
            ny = ((y + Y_POS * RESOLUTION / 100)/arr[0].length) * 0.3
            
            // find value
            arr[x][y] = Math.floor(noise(nx, ny, 10 + SCALE, 19, SEED) * COMPLEXITY - COMPLEXITY / 2.0833333333333333);
          }
            // begin drawing pixel
            ctx.beginPath();
            ctx.rect(scaler * x, scaler * y, scaler, scaler);
            
            // Find color from depth
            ctx.fillStyle = getColorFromDepth(arr[x][y]);
            ctx.fill();
        }
      }
      
      // console.log("Saved " + (10000 - count) + " calls.")
      
      // Draw Crosshair
      ctx.beginPath();ctx.fillStyle = "black";
      ctx.rect(scaler * (arr.length/2 - 1.3), scaler * (arr[0].length/2 - 0.1), scaler * 3.6, scaler * 1.2);
      ctx.rect(scaler * (arr.length/2 - 0.1), scaler * (arr[0].length/2 - 1.3), scaler * 1.2, scaler * 3.6);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.rect(scaler * (arr.length/2 - 1), scaler * (arr[0].length/2 + 0.25), scaler * 3, scaler * 0.5);
      ctx.rect(scaler * (arr.length/2 + 0.25), scaler * (arr[0].length/2 - 1), scaler * 0.5, scaler * 3);
      ctx.fill();
      
      checkDir();
      document.getElementById('x-pos').value = X_POS / 10;
      document.getElementById('y-pos').value = Y_POS / 10;
      // console.timeEnd("paintMap");
    }
  }
  ).then(() => {
    paintMap();
    document.getElementById('controls').style.display = "grid";
    document.getElementById('canvas').style.display = "block"
  }).catch(() => {
    document.getElementById('wasm-warning').innerText = "🚨 Failed to load WebAssembly Module";
    document.getElementById('wasm-warning').style.display = "block";
  }); 
} catch(e) {
  console.log(e)
  document.getElementById('wasm-warning').style.display = "block";
}