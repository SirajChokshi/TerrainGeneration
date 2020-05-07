const pSBC=(r,e,t,l)=>{let n,g,i,a,s,b,p,u=parseInt,o=Math.round,c="string"==typeof t;return"number"!=typeof r||r<-1||r>1||"string"!=typeof e||"r"!=e[0]&&"#"!=e[0]||t&&!c?null:(this.pSBCr||(this.pSBCr=(r=>{let e=r.length,t={};if(e>9){if([n,g,i,c]=r=r.split(","),(e=r.length)<3||e>4)return null;t.r=u("a"==n[3]?n.slice(5):n.slice(4)),t.g=u(g),t.b=u(i),t.a=c?parseFloat(c):-1}else{if(8==e||6==e||e<4)return null;e<6&&(r="#"+r[1]+r[1]+r[2]+r[2]+r[3]+r[3]+(e>4?r[4]+r[4]:"")),r=u(r.slice(1),16),9==e||5==e?(t.r=r>>24&255,t.g=r>>16&255,t.b=r>>8&255,t.a=o((255&r)/.255)/1e3):(t.r=r>>16,t.g=r>>8&255,t.b=255&r,t.a=-1)}return t})),p=e.length>9,p=c?t.length>9||"c"==t&&!p:p,s=pSBCr(e),a=r<0,b=t&&"c"!=t?pSBCr(t):a?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},a=1-(r=a?-1*r:r),s&&b?(l?(n=o(a*s.r+r*b.r),g=o(a*s.g+r*b.g),i=o(a*s.b+r*b.b)):(n=o((a*s.r**2+r*b.r**2)**.5),g=o((a*s.g**2+r*b.g**2)**.5),i=o((a*s.b**2+r*b.b**2)**.5)),c=s.a,b=b.a,c=(s=c>=0||b>=0)?c<0?b:b<0?c:c*a+b*r:0,p?"rgb"+(s?"a(":"(")+n+","+g+","+i+(s?","+o(1e3*c)/1e3:"")+")":"#"+(4294967296+16777216*n+65536*g+256*i+(s?o(255*c):0)).toString(16).slice(1,s?void 0:-2)):null)};

const hashCode = (s) => {
	let h;
	for(let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
	return Math.abs(h);
}

const randomSeed = () => {
  SEED = Math.floor(Math.random() * 1000000);
  document.getElementById("enter-seed").value = SEED;
  paintMap(true);
}

const loadSeed = () => {
  const seedIn = document.getElementById("enter-seed").value;
  if (isNaN(seedIn) || seedIn < 0) {
	  SEED = hashCode(document.getElementById("enter-seed").value);
  } else SEED = seedIn
  paintMap(true);
}

const mag = () => {
  if (SCALE >= -6) SCALE -= 3;
  if (SCALE < -6) document.getElementById('zoom-in').disabled = true;
  if (SCALE <= 30) document.getElementById('zoom-out').disabled = false;
  paintMap(true);
}

const min = () => {
  if (SCALE <= 30) SCALE += 3;
  if (SCALE >= -6) document.getElementById('zoom-in').disabled = false;
  if (SCALE > 30) document.getElementById('zoom-out').disabled = true;
  paintMap(true);
}

const isPosValid = () => {
  if (document.getElementById('x-pos').value < 0 || document.getElementById('y-pos').value < 0) document.getElementById('go-to-btn').disabled = true;
  else document.getElementById('go-to-btn').disabled= false;
}

const goTo = () => {
  const x = document.getElementById("x-pos").value
  const y = document.getElementById('y-pos').value
  
  if (x >= 0 && y >= 0) {
	  X_POS = x * 10;
	  Y_POS = y * 10;
  }
  
  paintMap(true);
}

const disableDir = (dir) => {
  const btns = document.getElementsByClassName(dir);
  for (let btn of btns) btn.disabled = true; 
}

const enableDir = (dir) => {
  const btns = document.getElementsByClassName(dir);
  for (let btn of btns) btn.disabled = false; 
}

const checkDir = () => {
  enableDir('up')
  enableDir('left')
  if (X_POS - 10 < 0) disableDir('left')
  if (Y_POS - 10 < 0) disableDir('up')
}