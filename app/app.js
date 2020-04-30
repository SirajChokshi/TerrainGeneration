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

const WATER_LEVEL = 2
const COMPLEXITY = 25
const RESOLUTION = 100

let SCALE = 1
let X_POS = 0
let Y_POS = 0


let arr = Array(RESOLUTION).fill().map(() => Array(RESOLUTION).fill(0));

const mag = () => {
  if (SCALE >= 0.5) {
    SCALE -= 0.1;
  }
  paintMap();
}

const min = () => {
    if (SCALE <= 2.2) {
    SCALE += 0.1;
  }
  paintMap();
}

const move = (vector) => {
  X_POS += vector[0];
  Y_POS += vector[1];
  paintMap();
}

const paintMap = () => {
  fetch('/bin/main.wasm').then(response =>
    response.arrayBuffer()
  ).then(bytes => WebAssembly.instantiate(bytes)).then(results => {
    instance = results.instance;
    // // document.getElementById("container").textContent = instance.exports.main(1);
    // perlin = (xpos, ypos, freq, depth, seed) => (instance.exports.perlin2d(xpos, ypos, freq, depth, seed));
    for (let x = 0; x < arr.length; x++) {
      for (let y = 0; y < arr[0].length; y++) {
        nx = ((x + X_POS)/arr.length) * SCALE * 0.3
        ny = ((y + Y_POS)/arr[0].length) * SCALE * 0.3
        arr[x][y] = Math.floor(instance.exports.perlin2d(nx, ny, 10, 19, 0) * COMPLEXITY - 12);
        ctx.beginPath();
        let scaler = 600 / RESOLUTION
        ctx.rect(scaler * x, scaler * y, scaler, scaler);
        if (arr[x][y] < WATER_LEVEL) ctx.fillStyle = "#3399ff";
        else if (arr[x][y] < WATER_LEVEL + 2 && arr[x][y] > WATER_LEVEL - 1) ctx.fillStyle = "#ffe6b3";
        else if (arr[x][y] < WATER_LEVEL + 6) ctx.fillStyle = "#5cd65c";
        else if (arr[x][y] < WATER_LEVEL + 7) ctx.fillStyle = "#009933";
        else if (arr[x][y] < WATER_LEVEL + 11) ctx.fillStyle = "#85adad";
        else ctx.fillStyle = "#eff5f5";
        let difference = arr[x][y] - WATER_LEVEL;
        if (difference < -7) difference = 7;
        ctx.fillStyle = pSBC(Math.abs(difference) * -0.04, ctx.fillStyle)
        if (Math.random() > 0.7) {
          ctx.fillStyle = pSBC(0.012, ctx.fillStyle)
        }
        ctx.fill();
      }
    }
    // console.table(arr)
  }).catch(console.error);
}