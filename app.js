const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const photoInput = document.getElementById('photoInput');
const scaleRange = document.getElementById('scaleRange');
const rotRange   = document.getElementById('rotRange');
const resetBtn   = document.getElementById('resetBtn');
const centerBtn  = document.getElementById('centerBtn');
const downloadBtn= document.getElementById('downloadBtn');

const hatImg = new Image();
hatImg.src = 'assets/overlays/hat.png';

let baseImg = null;
let hat = {x:0,y:0,scale:1,rot:0,w:600,h:400,dragging:false,offset:{x:0,y:0}};

function fitCanvas(img){
  canvas.width = img.width>900?900:img.width;
  canvas.height = (canvas.width/img.width)*img.height;
}

function centerHat(){
  hat.x=canvas.width/2;
  hat.y=canvas.height*0.3;
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(baseImg){ctx.drawImage(baseImg,0,0,canvas.width,canvas.height);}
  const rad=hat.rot*Math.PI/180;
  ctx.save();
  ctx.translate(hat.x,hat.y);
  ctx.rotate(rad);
  ctx.drawImage(hatImg,-(hat.w*hat.scale)/2,-(hat.h*hat.scale)/2,hat.w*hat.scale,hat.h*hat.scale);
  ctx.restore();
}

photoInput.addEventListener('change',e=>{
  const file=e.target.files[0]; if(!file) return;
  const url=URL.createObjectURL(file);
  const img=new Image();
  img.onload=()=>{baseImg=img;fitCanvas(img);centerHat();draw();}
  img.src=url;
});

canvas.addEventListener('mousedown',e=>{
  const rect=canvas.getBoundingClientRect();
  const x=(e.clientX-rect.left)*(canvas.width/rect.width);
  const y=(e.clientY-rect.top)*(canvas.height/rect.height);
  hat.dragging=true; hat.offset.x=x-hat.x; hat.offset.y=y-hat.y;
});
canvas.addEventListener('mousemove',e=>{
  if(!hat.dragging) return;
  const rect=canvas.getBoundingClientRect();
  hat.x=(e.clientX-rect.left)*(canvas.width/rect.width)-hat.offset.x;
  hat.y=(e.clientY-rect.top)*(canvas.height/rect.height)-hat.offset.y;
  draw();
});
canvas.addEventListener('mouseup',()=>hat.dragging=false);

scaleRange.addEventListener('input',()=>{hat.scale=parseFloat(scaleRange.value);draw();});
rotRange.addEventListener('input',()=>{hat.rot=parseFloat(rotRange.value);draw();});
resetBtn.addEventListener('click',()=>{hat.scale=1;hat.rot=0;centerHat();draw();});
centerBtn.addEventListener('click',()=>{centerHat();draw();});
downloadBtn.addEventListener('click',()=>{
  const link=document.createElement('a');
  link.download='hat-photo.jpg';
  link.href=canvas.toDataURL('image/jpeg',0.9);
  link.click();
});

hatImg.onload=()=>{hat.h=hat.w*(hatImg.height/hatImg.width);centerHat();draw();}
