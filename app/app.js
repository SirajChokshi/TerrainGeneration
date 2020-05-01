const pSBC=(p,c0,c1,l)=>{
  let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
  if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
  if(!this.pSBCr)this.pSBCr=(d)=>{
    let n=d.length,x={};
    if(n>9){
      [r,g,b,a]=d=d.split(","),n=d.length;
      if(n<3||n>4)return null;
      x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
    }else{
      if(n==8||n==6||n<4)return null;
      if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
      d=i(d.slice(1),16);
      if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
      else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
    }return x};
  h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
  if(!f||!t)return null;
  if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
  else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
  a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
  if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
  else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

const WATER_LEVEL = 2, COMPLEXITY = 25, RESOLUTION = 100

let SCALE = 1, X_POS = 0, Y_POS = 0, arr = Array(RESOLUTION).fill().map(() => Array(RESOLUTION).fill(0)), SEED = Math.floor(Math.random() * 1000000);
document.getElementById("enter-seed").value = SEED;

const hashCode = (s) => {
    let h;
    for(let i = 0; i < s.length; i++) 
          h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return Math.abs(h);
}

const randomSeed = () => {
  SEED = Math.floor(Math.random() * 1000000);
  document.getElementById("enter-seed").value = SEED;
  paintMap();
}

const loadSeed = () => {
  const seedIn = document.getElementById("enter-seed").value;
  if (isNaN(seedIn) || seedIn < 0) {
      SEED = hashCode(document.getElementById("enter-seed").value);
  } else SEED = seedIn
  console.log(SEED)
  paintMap();
}

const mag = () => {
  if (SCALE >= 0.5) SCALE -= 0.1;
  if (SCALE < 0.5) document.getElementById('zoom-in').disabled = true;
  if (SCALE <= 3.3) document.getElementById('zoom-out').disabled = false;
  paintMap();
}

const min = () => {
  if (SCALE <= 3.3) SCALE += 0.1;
  if (SCALE >= 0.5) document.getElementById('zoom-in').disabled = false;
  if (SCALE > 3.3) document.getElementById('zoom-out').disabled = true;
  paintMap();
}

const isPosValid = () => {
  if (document.getElementById('x-pos').value < 0 || document.getElementById('y-pos').value < 0) {
    document.getElementById('go-to-btn').disabled = true;
  } else document.getElementById('go-to-btn').disabled= false;
}

const goTo = () => {
  const x = document.getElementById("x-pos").value
  const y = document.getElementById('y-pos').value
  if (x >= 0 && y >= 0) {
      X_POS = x * 10;
      Y_POS = y * 10;
  }
  paintMap();
}

const disableDir = (dir) => {
  const btns = document.getElementsByClassName(dir);
  for (let btn of btns) {
    btn.disabled = true; 
  }
}

const enableDir = (dir) => {
  const btns = document.getElementsByClassName(dir);
  for (let btn of btns) {
    btn.disabled = false; 
  }
}

const checkDir = () => {
  enableDir('up')
  enableDir('left')
  if (X_POS - 10 < 0) disableDir('left')
  if (Y_POS - 10 < 0) disableDir('up')
}

const move = (vector) => {
  if (X_POS + vector[0] * 5 >= 0) X_POS += vector[0] * 5;
  if (Y_POS + vector[1] * 5 >= 0) Y_POS += vector[1] * 5;
  paintMap();
}

const paintMap = () => {
  let scaler = 600 / RESOLUTION
  console.time("paintMap");
  
  fetch('/bin/main.wasm').then(response =>
    response.arrayBuffer()
  ).then(bytes => WebAssembly.instantiate(bytes)).then(results => {
    instance = results.instance;
    for (let x = 0; x < arr.length; x++) {
      for (let y = 0; y < arr[0].length; y++) {
        nx = ((x + X_POS)/arr.length) * SCALE * 0.3
        ny = ((y + Y_POS)/arr[0].length) * SCALE * 0.3
        arr[x][y] = Math.floor(instance.exports.perlin2d(nx, ny, 10, 19, SEED) * COMPLEXITY - 12);
        ctx.beginPath();
        ctx.rect(scaler * x, scaler * y, scaler, scaler);
        if (arr[x][y] < WATER_LEVEL) ctx.fillStyle = "#3399ff";
        else if (arr[x][y] < WATER_LEVEL + 2 && arr[x][y] > WATER_LEVEL - 1) {
          ctx.fillStyle = "#ffe6b3";
          if (Math.random() > 0.4) {
            ctx.fillStyle = pSBC(0.02, ctx.fillStyle)
          }
        }
        else if (arr[x][y] < WATER_LEVEL + 6) ctx.fillStyle = "#5cd65c";
        else if (arr[x][y] < WATER_LEVEL + 7) ctx.fillStyle = "#6e9668";
        else if (arr[x][y] < WATER_LEVEL + 9) ctx.fillStyle = "#85adad";
        else ctx.fillStyle = "#eff5f5";
        let difference = arr[x][y] - WATER_LEVEL;
        if (difference < -7) difference = 7;
        
        let shade = -0.04;
        if (arr[x][y] >= WATER_LEVEL) {
          shade = -0.08
        }
        ctx.fillStyle = pSBC(Math.abs(difference) * shade, ctx.fillStyle)
        if (Math.random() > 0.7) {
          ctx.fillStyle = pSBC(0.012, ctx.fillStyle)
        }
        
        ctx.fill();
      }
    }
    
    // Print Crosshair
    
    ctx.beginPath();
    ctx.fillStyle = "black"
    ctx.rect(scaler * (arr.length/2 - 1.3), scaler * (arr[0].length/2 - 0.1), scaler * 3.6, scaler * 1.2);
    ctx.rect(scaler * (arr.length/2 - 0.1), scaler * (arr[0].length/2 - 1.3), scaler * 1.2, scaler * 3.6);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "red"
    ctx.rect(scaler * (arr.length/2 - 1), scaler * (arr[0].length/2 + 0.25), scaler * 3, scaler * 0.5);
    ctx.rect(scaler * (arr.length/2 + 0.25), scaler * (arr[0].length/2 - 1), scaler * 0.5, scaler * 3);
    ctx.fill();
    
    checkDir();
    document.getElementById('x-pos').value = X_POS / 10
    document.getElementById('y-pos').value = Y_POS / 10
    
    console.timeEnd("paintMap");
    // console.log(Math.max(...arr.flat(1)))
  }).catch(console.error);
}