const WATER_LEVEL = 2, COMPLEXITY = 25, RESOLUTION = 100
let c = document.getElementById("canvas"), ctx = c.getContext("2d"), SCALE = 1, X_POS = 0, Y_POS = 0, arr = Array(RESOLUTION).fill().map(() => Array(RESOLUTION).fill(0)), SEED = Math.floor(Math.random() * 1000000);
document.getElementById("enter-seed").value = SEED;

let noise, paintMap, scaler = 600 / RESOLUTION

WebAssembly.instantiateStreaming(fetch('build/main.wasm'), {imports: {imported_func: arg => console.log(arg)}, js: {mem: new WebAssembly.Memory({initial:10, maximum:100})}}).then(
  results => {
    noise = (x, y, f, d, s) => results.instance.exports.perlin2d(x,y,f,d,s);
    paintMap = () => {
      // console.time("paintMap");
      for (let x = 0; x < arr.length; x++) {
        for (let y = 0; y < arr[0].length; y++) {
          nx = ((x + X_POS)/arr.length) * SCALE * 0.3
          ny = ((y + Y_POS)/arr[0].length) * SCALE * 0.3
          arr[x][y] = Math.floor(noise(nx, ny, 10, 19, SEED) * COMPLEXITY - 12);
          ctx.beginPath();
          ctx.rect(scaler * x, scaler * y, scaler, scaler);
          
          if (arr[x][y] < WATER_LEVEL) ctx.fillStyle = "#3399ff";
          else if (arr[x][y] < WATER_LEVEL + 2 && arr[x][y] > WATER_LEVEL - 1) {
            ctx.fillStyle = "#ffe6b3";
            if (Math.random() > 0.4) ctx.fillStyle = pSBC(0.02, ctx.fillStyle)
          }
          else if (arr[x][y] < WATER_LEVEL + 6) ctx.fillStyle = "#5cd65c";
          else if (arr[x][y] < WATER_LEVEL + 7) ctx.fillStyle = "#6e9668";
          else if (arr[x][y] < WATER_LEVEL + 9) ctx.fillStyle = "#85adad";
          else ctx.fillStyle = "#eff5f5";
          let difference = (arr[x][y] - WATER_LEVEL < -7 ? -7 : arr[x][y] - WATER_LEVEL), shade = (arr[x][y] >= WATER_LEVEL ? -0.08 : -0.04);
          ctx.fillStyle = pSBC(Math.abs(difference) * shade, ctx.fillStyle)
          if (Math.random() > 0.7) ctx.fillStyle = pSBC(0.012, ctx.fillStyle)
          ctx.fill();
        }
      }
    
      ctx.beginPath();ctx.fillStyle = "black"; ctx.rect(scaler * (arr.length/2 - 1.3), scaler * (arr[0].length/2 - 0.1), scaler * 3.6, scaler * 1.2); ctx.rect(scaler * (arr.length/2 - 0.1), scaler * (arr[0].length/2 - 1.3), scaler * 1.2, scaler * 3.6); ctx.fill(); ctx.beginPath();ctx.fillStyle = "red"; ctx.rect(scaler * (arr.length/2 - 1), scaler * (arr[0].length/2 + 0.25), scaler * 3, scaler * 0.5); ctx.rect(scaler * (arr.length/2 + 0.25), scaler * (arr[0].length/2 - 1), scaler * 0.5, scaler * 3); ctx.fill();
      
      checkDir(); document.getElementById('x-pos').value = X_POS / 10; document.getElementById('y-pos').value = Y_POS / 10;
      // console.timeEnd("paintMap");
    }
  }
  ).then(() => paintMap()).catch(console.error);