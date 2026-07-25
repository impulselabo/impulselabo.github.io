
(() => {
"use strict";
const APP_VERSION="CV082A03";
const $=id=>document.getElementById(id);
function syncBuildVersion(){
 const build=document.querySelector(".build");
 if(build)build.textContent=APP_VERSION;
 document.documentElement.dataset.appVersion=APP_VERSION;
}
const canvas=$("viewer");
const gl=canvas.getContext("webgl",{alpha:false,antialias:true,depth:true,premultipliedAlpha:false});
if(!gl){
  canvas.outerHTML='<div style="padding:30px">この端末ではWebGLを初期化できません。</div>';
  return;
}

/* ---------- math ---------- */
const M4={
 ident(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])},
 mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o},
 perspective(fovy,aspect,n,f){const t=1/Math.tan(fovy/2),o=new Float32Array(16);o[0]=t/aspect;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f);return o},
 ortho(l,r,b,t,n,f){const o=M4.ident();o[0]=2/(r-l);o[5]=2/(t-b);o[10]=-2/(f-n);o[12]=-(r+l)/(r-l);o[13]=-(t+b)/(t-b);o[14]=-(f+n)/(f-n);return o},
 translate(x,y,z){const o=M4.ident();o[12]=x;o[13]=y;o[14]=z;return o},
 scale(x,y,z){const o=M4.ident();o[0]=x;o[5]=y;o[10]=z;return o},
 rotX(a){const c=Math.cos(a),s=Math.sin(a),o=M4.ident();o[5]=c;o[6]=s;o[9]=-s;o[10]=c;return o},
 rotY(a){const c=Math.cos(a),s=Math.sin(a),o=M4.ident();o[0]=c;o[2]=-s;o[8]=s;o[10]=c;return o},
 rotZ(a){const c=Math.cos(a),s=Math.sin(a),o=M4.ident();o[0]=c;o[1]=s;o[4]=-s;o[5]=c;return o},
 lookAt(e,c,u){let zx=e[0]-c[0],zy=e[1]-c[1],zz=e[2]-c[2];let zl=Math.hypot(zx,zy,zz);zx/=zl;zy/=zl;zz/=zl;
   let xx=u[1]*zz-u[2]*zy,xy=u[2]*zx-u[0]*zz,xz=u[0]*zy-u[1]*zx;let xl=Math.hypot(xx,xy,xz);xx/=xl;xy/=xl;xz/=xl;
   const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
   const o=M4.ident();o[0]=xx;o[1]=yx;o[2]=zx;o[4]=xy;o[5]=yy;o[6]=zy;o[8]=xz;o[9]=yz;o[10]=zz;
   o[12]=-(xx*e[0]+xy*e[1]+xz*e[2]);o[13]=-(yx*e[0]+yy*e[1]+yz*e[2]);o[14]=-(zx*e[0]+zy*e[1]+zz*e[2]);return o}
};
const V3={
 sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],
 cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 norm(a){const l=Math.hypot(...a)||1;return[a[0]/l,a[1]/l,a[2]/l]}
};

/* ---------- shaders ---------- */
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
const prog=gl.createProgram();
gl.attachShader(prog,shader(gl.VERTEX_SHADER,`
attribute vec3 aPos;attribute vec3 aNor;
uniform mat4 uMVP;uniform mat4 uModel;
varying vec3 vNor;varying vec3 vPos;
void main(){vec4 wp=uModel*vec4(aPos,1.0);vPos=wp.xyz;vNor=mat3(uModel)*aNor;gl_Position=uMVP*vec4(aPos,1.0);}
`));
gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,`
precision mediump float;
uniform vec4 uColor;uniform vec3 uLight;uniform float uUnlit;
varying vec3 vNor;varying vec3 vPos;
void main(){vec3 n=normalize(vNor);float d=max(dot(n,normalize(uLight-vPos)),0.0);float lit=mix(0.72+0.28*d,1.0,uUnlit);gl_FragColor=vec4(uColor.rgb*lit,uColor.a);}
`));
gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));
gl.useProgram(prog);
const loc={pos:gl.getAttribLocation(prog,"aPos"),nor:gl.getAttribLocation(prog,"aNor"),mvp:gl.getUniformLocation(prog,"uMVP"),model:gl.getUniformLocation(prog,"uModel"),color:gl.getUniformLocation(prog,"uColor"),light:gl.getUniformLocation(prog,"uLight"),unlit:gl.getUniformLocation(prog,"uUnlit")};

/* ---------- meshes ---------- */
function makeMesh(pos,nor,idx){
 const m={count:idx.length};
 m.pb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,m.pb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(pos),gl.STATIC_DRAW);
 m.nb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,m.nb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(nor),gl.STATIC_DRAW);
 m.ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx),gl.STATIC_DRAW);
 return m;
}
function boxMesh(){
 const p=[],n=[],i=[];const faces=[
 [[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],[0,0,1]],[[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1],[0,0,-1]],
 [[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1],[1,0,0]],[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,0,0]],
 [[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1],[0,1,0]],[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[0,-1,0]]
 ];faces.forEach(f=>{const b=p.length/3;for(let k=0;k<4;k++){p.push(...f[k]);n.push(...f[4])}i.push(b,b+1,b+2,b,b+2,b+3)});return makeMesh(p,n,i)
}
function sphereMesh(seg=28,rings=18){
 const p=[],n=[],i=[];for(let y=0;y<=rings;y++){const v=y/rings,ph=v*Math.PI;for(let x=0;x<=seg;x++){const u=x/seg,th=u*Math.PI*2;const nx=Math.sin(ph)*Math.cos(th),ny=Math.cos(ph),nz=Math.sin(ph)*Math.sin(th);p.push(nx,ny,nz);n.push(nx,ny,nz)}}
 for(let y=0;y<rings;y++)for(let x=0;x<seg;x++){const a=y*(seg+1)+x,b=a+seg+1;i.push(a,b,a+1,b,b+1,a+1)}return makeMesh(p,n,i)
}
function cylMesh(seg=18){
 const p=[],n=[],i=[];for(let y=0;y<=1;y++)for(let s=0;s<=seg;s++){const a=s/seg*Math.PI*2,x=Math.cos(a),z=Math.sin(a);p.push(x,y*2-1,z);n.push(x,0,z)}
 for(let y=0;y<1;y++)for(let s=0;s<seg;s++){const a=y*(seg+1)+s,b=a+seg+1;i.push(a,b,a+1,b,b+1,a+1)}
 return makeMesh(p,n,i)
}
function cappedCylinderMesh(seg=32){
 const p=[],n=[],i=[];
 for(let y=0;y<=1;y++)for(let s=0;s<=seg;s++){
   const a=s/seg*Math.PI*2,x=Math.cos(a),z=Math.sin(a);
   p.push(x,y*2-1,z);n.push(x,0,z);
 }
 for(let s=0;s<seg;s++){
   const a=s,b=a+seg+1;i.push(a,b,a+1,b,b+1,a+1);
 }
 let base=p.length/3;
 p.push(0,-1,0);n.push(0,-1,0);
 for(let s=0;s<=seg;s++){const a=s/seg*Math.PI*2;p.push(Math.cos(a),-1,Math.sin(a));n.push(0,-1,0)}
 for(let s=0;s<seg;s++)i.push(base,base+s+2,base+s+1);
 base=p.length/3;
 p.push(0,1,0);n.push(0,1,0);
 for(let s=0;s<=seg;s++){const a=s/seg*Math.PI*2;p.push(Math.cos(a),1,Math.sin(a));n.push(0,1,0)}
 for(let s=0;s<seg;s++)i.push(base,base+s+1,base+s+2);
 return makeMesh(p,n,i)
}
function frustumMesh(startRadius=.18,endRadius=1,seg=28){
 const p=[],n=[],i=[];
 const slope=(startRadius-endRadius)/2;
 for(let y=0;y<=1;y++){
   const r=y?endRadius:startRadius,py=y*2-1;
   for(let k=0;k<=seg;k++){
     const a=k/seg*Math.PI*2,c=Math.cos(a),z=Math.sin(a);
     p.push(c*r,py,z*r);
     const nn=V3.norm([c,slope,z]);n.push(...nn);
   }
 }
 for(let k=0;k<seg;k++){const a=k,b=a+seg+1;i.push(a,b,a+1,b,b+1,a+1)}
 return makeMesh(p,n,i)
}
function ringPrism(outer,inner,outerDepth,innerDepth){
 const p=[],n=[],i=[],L=outer.length;
 function quad(a,b,c,d,normal){
   const base=p.length/3;p.push(...a,...b,...c,...d);
   for(let k=0;k<4;k++)n.push(...normal);
   i.push(base,base+1,base+2,base,base+2,base+3);
 }
 for(const side of [-1,1]){
   const zo=side*outerDepth/2,zi=side*innerDepth/2;
   for(let k=0;k<L;k++){
     const j=(k+1)%L;
     const o0=[outer[k][0],outer[k][1],zo],o1=[outer[j][0],outer[j][1],zo];
     const q0=[inner[k][0],inner[k][1],zi],q1=[inner[j][0],inner[j][1],zi];
     if(side<0)quad(o0,q0,q1,o1,[0,0,-1]); else quad(o0,o1,q1,q0,[0,0,1]);
   }
 }
 for(let k=0;k<L;k++){
   const j=(k+1)%L;
   const a=outer[k],b=outer[j],eo=[b[0]-a[0],b[1]-a[1],0],no=V3.norm([eo[1],-eo[0],0]);
   quad([a[0],a[1],-outerDepth/2],[b[0],b[1],-outerDepth/2],[b[0],b[1],outerDepth/2],[a[0],a[1],outerDepth/2],no);
   const c=inner[k],d=inner[j],ei=[d[0]-c[0],d[1]-c[1],0],ni=V3.norm([-ei[1],ei[0],0]);
   quad([c[0],c[1],innerDepth/2],[d[0],d[1],innerDepth/2],[d[0],d[1],-innerDepth/2],[c[0],c[1],-innerDepth/2],ni);
 }
 return makeMesh(p,n,i)
}
const mesh={box:boxMesh(),sphere:sphereMesh(),cyl:cylMesh(),disc:cappedCylinderMesh(),beam:frustumMesh(.16,1,30),fov:frustumMesh(.24,1,30)};
const GEOM=Object.freeze({
 armY:-29.50, armHalfSpan:36.65, torsionWireLength:40.00,
 smallBallDiameter:2.00, smallBallDrop:5.50, readerRadius:38.30,
 largeOrbitRadius:36.65, largeNearOffset:8.85,
 largeHalfAngle:0.243883893124, largeSwitchAngleDeg:27.94703553,
 copperRodUpper:46.00, copperRodBallSegment:16.00, copperRodTotal:62.00,
 largeBallRadius:6.00, stopGap:0.20,
 caseInnerX:3.50, caseInnerY:3.60, caseInnerZ:6.75, caseThickness:0.75,
 caseOuterX:39.15, caseEndInnerWallX:34.15,
 caseEndBottomY:-37.55, caseFloorY:-32.45, caseShoulderEndY:-29.50,
 caseTowerBaseY:-24.25, caseTowerBaseHalfWidth:5.20,
 caseTowerTopY:10.50, caseTowerTopHalfWidth:2.75
});
const C_WORLD=Object.freeze([0,GEOM.armY,0]);
const toWorld=p=>[p[0]+C_WORLD[0],p[1]+C_WORLD[1],p[2]+C_WORLD[2]];
const fromWorld=p=>[p[0]-C_WORLD[0],p[1]-C_WORLD[1],p[2]-C_WORLD[2]];
// Fig.1 ABCDDCBAEFFE front contour. The main sloping case and the two end
// chambers are separate prisms whose union reproduces A-B-C-D-D-C-B-A-E-F-F-E.
const caseOuterProfile=[
 [-GEOM.caseOuterX,GEOM.caseFloorY],[GEOM.caseOuterX,GEOM.caseFloorY],
 [GEOM.caseOuterX,GEOM.caseShoulderEndY],
 [GEOM.caseTowerBaseHalfWidth,GEOM.caseTowerBaseY],[GEOM.caseTowerTopHalfWidth,GEOM.caseTowerTopY],
 [-GEOM.caseTowerTopHalfWidth,GEOM.caseTowerTopY],[-GEOM.caseTowerBaseHalfWidth,GEOM.caseTowerBaseY],
 [-GEOM.caseOuterX,GEOM.caseShoulderEndY]
];
const caseInnerProfile=[
 [-GEOM.caseOuterX+GEOM.caseThickness,GEOM.caseFloorY+GEOM.caseThickness],
 [GEOM.caseOuterX-GEOM.caseThickness,GEOM.caseFloorY+GEOM.caseThickness],
 [GEOM.caseOuterX-GEOM.caseThickness,GEOM.caseShoulderEndY-GEOM.caseThickness],
 [GEOM.caseTowerBaseHalfWidth-GEOM.caseThickness,GEOM.caseTowerBaseY-GEOM.caseThickness],
 [GEOM.caseTowerTopHalfWidth-GEOM.caseThickness,GEOM.caseTowerTopY-GEOM.caseThickness],
 [-GEOM.caseTowerTopHalfWidth+GEOM.caseThickness,GEOM.caseTowerTopY-GEOM.caseThickness],
 [-GEOM.caseTowerBaseHalfWidth+GEOM.caseThickness,GEOM.caseTowerBaseY-GEOM.caseThickness],
 [-GEOM.caseOuterX+GEOM.caseThickness,GEOM.caseShoulderEndY-GEOM.caseThickness]
];
mesh.caseShell=ringPrism(caseOuterProfile,caseInnerProfile,GEOM.caseInnerZ+2*GEOM.caseThickness,GEOM.caseInnerZ);
const caseEndOuterLeft=[
 [-GEOM.caseOuterX,GEOM.caseFloorY],[-GEOM.caseOuterX,GEOM.caseEndBottomY],
 [-GEOM.caseEndInnerWallX,GEOM.caseEndBottomY],[-GEOM.caseEndInnerWallX,GEOM.caseFloorY]
];
const caseEndInnerLeft=[
 [-GEOM.caseOuterX+GEOM.caseThickness,GEOM.caseFloorY-GEOM.caseThickness],
 [-GEOM.caseOuterX+GEOM.caseThickness,GEOM.caseEndBottomY+GEOM.caseThickness],
 [-GEOM.caseEndInnerWallX-GEOM.caseThickness,GEOM.caseEndBottomY+GEOM.caseThickness],
 [-GEOM.caseEndInnerWallX-GEOM.caseThickness,GEOM.caseFloorY-GEOM.caseThickness]
];
const mirrorProfile=profile=>profile.map(([x,y])=>[-x,y]).reverse();
mesh.caseEndShellLeft=ringPrism(caseEndOuterLeft,caseEndInnerLeft,GEOM.caseInnerZ+2*GEOM.caseThickness,GEOM.caseInnerZ);
mesh.caseEndShellRight=ringPrism(mirrorProfile(caseEndOuterLeft),mirrorProfile(caseEndInnerLeft),GEOM.caseInnerZ+2*GEOM.caseThickness,GEOM.caseInnerZ);

/* ---------- scene ---------- */
const parts={
 case:{name:"木製ケース",symbol:"ABCDDCBAEFFE",value:"端部内寸3.50×3.60×6.75 in／板厚0.75 in／EFテーパー縦室",basis:"本文＋Fig.1",dof:"固定"},
 support:{name:"大球支持・FK調整機構",symbol:"P / RrPrR / rr / FK",value:"支持半径36.65 in／r–R 16+46=62 in／P分岐120°／rr剛体横木",basis:"本文・Fig.1・Fig.6",dof:"P軸回転φ・FK調整"},
 large:{name:"大鉛球",symbol:"W, W",value:"約158.04 kg／直径約12 in／近接偏位8.85 in",basis:"本文＋Fig.2復元",dof:"支持系と一体"},
 wire:{name:"ねじり線",symbol:"gl",value:"40.00 in",basis:"本文",dof:"ねじり"},
 arm:{name:"水平アーム",symbol:"bmb / bgb",value:"中心間73.30 in／中心落差5.50 in",basis:"本文",dof:"θ回転"},
 small:{name:"小鉛球",symbol:"x, x",value:"直径約2 in／中心(±36.65,-5.50,0)",basis:"本文・Fig.1",dof:"アームと一体"},
 telescope:{name:"望遠鏡",symbol:"T, T",value:"左右各1",basis:"本文・Fig.1",dof:"固定"},
 lamp:{name:"ランプ",symbol:"L, L",value:"左右各1",basis:"本文・Fig.1",dof:"固定"},
 reader:{name:"読取部",symbol:"h / n",value:"中心距離38.30 in／主尺1/20・副尺1/100 in",basis:"本文",dof:"主尺固定・副尺追従"},
 pulley:{name:"中央ピン・滑車・操作コード",symbol:"Pp / p / MM / Mm",value:"Pp・MM同軸／Mm溝接線導入／形状寸法はFig.1比例復元",basis:"本文＋Fig.1",dof:"Pp鉛直軸まわり回転φ"}
};
const partOrder=["case","support","pulley","wire","arm","small","large","reader","telescope","lamp"];
const partList=$("parts");
partOrder.forEach(k=>{const b=document.createElement("button");b.className="part";b.dataset.part=k;b.innerHTML=`<span>${parts[k].name}</span><small>${parts[k].symbol}</small>`;b.onclick=()=>selectPart(k);partList.appendChild(b)});
const assemblyTree=$("assemblyTree");
[
 ["A001","建物フレーム","case"],["A010","中央垂直ピンPp","pulley"],["A011","保持板・頭部p","pulley"],
 ["A012","溝付き水平滑車MM","pulley"],["A013","操作コードMm","pulley"],["A014","分岐ハブP","pulley"],
 ["A015","Mm壁ガイド・外部操作端","pulley"],["A020","P–r斜行支持","support"],["A021","左右r継手","support"],
 ["A022","木製剛体横木rr","support"],["A023","左右銅棒Rr","support"],["A060","左大球","large"],["A061","右大球","large"],
 ["A100","木製ケースABCDDCBAEFFE","case"],["A101","中央テーパー縦室EF","case"],
 ["A102","左右傾斜肩部AE","case"],["A103","左右端部段差ABCD","case"],["A104","主室底面DD","case"],
 ["A110","ねじり線","wire"],["A120","水平アーム","arm"],["A130","左右小球","small"],
 ["A140","読取部","reader"],["A150","望遠鏡","telescope"],["A160","ランプ","lamp"]
].forEach(([id,name,part])=>{const b=document.createElement("button");b.className="assembly-node";b.innerHTML=`<span class="aid">${id}</span><span class="aname">${name}</span><span class="atype">mesh</span>`;b.onclick=()=>selectPart(part);assemblyTree.appendChild(b)});
const constraintList=$("constraintList");
["WebGL深度バッファ：有効","座標原点C：ねじり軸とアームの交点","X長手・Y鉛直上向き・Z前方","gl：アーム中心から上端まで40.00 in","小球中心：X=±36.65 in・Y=-5.50 in","読取尺度：中心から38.30 in","大球支持半径：36.65 in","近接位置Z偏位：8.85 in","正・負位置の近接偏位角：27.95°","r–R：16+46=62.00 in","P→左右支持線：120°（Fig.1校正）","rr：左右rを結ぶ73.30 in剛体横木","ケース端部内寸：3.50×3.60×6.75 in","ケース板厚：0.75 in","ケースABCD：左右端部のB–C–D段差","ケースAE：左右対称の傾斜肩部","ケースEF：上端Fへ狭まるテーパー縦室","ケースF：ねじり線gl上端と高さ一致","Pp・p・MM：同軸拘束","Mm：MM溝への接線導入＋壁外操作端","大球配置：正位置・負位置・中間位置（中間位置座標は説明用再構成）"].forEach((t,j)=>{const d=document.createElement("div");d.className="constraint-item";d.innerHTML=`<div><b>${t}</b></div><div class="ok">OK</div>`;constraintList.appendChild(d)});

let selected="support",mode="all",phase=0,armValue=0,caseOpacity=.55,depthContrast=.52;
const opticsViz={source:false,path:false,axis:false,fov:false,occlusion:true};
let opticsAutoActivated=false;
const mobileQuery=window.matchMedia(
 "(max-width:780px), ((orientation: landscape) and (max-height:600px) and (pointer:coarse))"
);
const mobileFitQuery=window.matchMedia(
 "(max-width:700px) and (pointer:coarse), ((orientation: landscape) and (max-height:600px) and (pointer:coarse))"
);
let isMobile=mobileQuery.matches;
let mobileOpticsItem="path";
const opticsKeys=["source","path","axis","fov"];
const opticsLegend={
 source:{title:"ランプ光源",text:"黄色の発光部：ランプ点灯中",cls:"legend-source"},
 path:{title:"照射光路",text:"黄色の実線：点灯したランプから読取部への照射経路",cls:"legend-path"},
 axis:{title:"望遠鏡視線",text:"青色の破線：望遠鏡から読取部へ向かう視線軸",cls:"legend-axis"},
 fov:{title:"視野範囲",text:"青色の半透明範囲：望遠鏡が捉える説明用視野",cls:"legend-fov"}
};
function lampIsLit(){return !!(opticsViz.source||opticsViz.path)}
function lampStateText(){
 if(opticsViz.path)return "ランプ点灯・照射中";
 if(opticsViz.source)return "ランプ点灯中";
 return "ランプ位置表示";
}
const DEFAULT_FREE_CAMERA=Object.freeze({yaw:-0.55,pitch:-0.22,distance:125,panX:0,panY:0});
const CAMERA_DISTANCE_MIN=65,CAMERA_DISTANCE_MAX=280,MOBILE_FIT_LIMIT=.93;
function buildMobileFitPoints(){
 const points=[];
 // CV082A02 adds the Fig.1 Mm operating end outside the left wall.
 for(const x of [-59,54])for(const y of [-52,45])for(const z of [-19,19])points.push([x,y,z]);
 for(let i=0;i<72;i++){
   const a=i/72*Math.PI*2,x=43*Math.cos(a),z=43*Math.sin(a);
   points.push([x,-50,z],[x,35,z]);
 }
 return points;
}
const MOBILE_FIT_POINTS=buildMobileFitPoints();
let yaw=DEFAULT_FREE_CAMERA.yaw,pitch=DEFAULT_FREE_CAMERA.pitch,distance=DEFAULT_FREE_CAMERA.distance,ortho=false;
let panX=0,panY=0;
let fixedView="free",showAxes=true,showCoordLabels=true;
let freeCamera={yaw,pitch,distance,panX,panY};
let currentVP=M4.ident();
const pointers=new Map();let lastPinch=0,lastMidpoint=null;
let cameraUserAdjusted=false,lastMobileFitViewport=null,mobileFitTimer=0;

function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function zoomToDistance(v){return clamp(12500/v,CAMERA_DISTANCE_MIN,CAMERA_DISTANCE_MAX)}
function distanceToZoom(v){return Math.round(clamp(12500/v,45,190))}
function syncCameraControls(){
 const z=distanceToZoom(distance);
 $("zoomLevel").value=z;$("zoomLevelValue").textContent=z+"%";
 $("panX").value=Math.round(panX/0.7);$("panXValue").textContent=Math.round(panX/0.7);
 $("panY").value=Math.round(panY/0.7);$("panYValue").textContent=Math.round(panY/0.7);
}
function setPan(x,y){
 panX=clamp(x,-35,35);panY=clamp(y,-35,35);syncCameraControls();
}
function mobileFitExtentAtDistance(testDistance,aspect){
 const target=[0,0,0];
 const eye=[
   testDistance*Math.sin(DEFAULT_FREE_CAMERA.yaw)*Math.cos(DEFAULT_FREE_CAMERA.pitch),
   testDistance*Math.sin(DEFAULT_FREE_CAMERA.pitch),
   testDistance*Math.cos(DEFAULT_FREE_CAMERA.yaw)*Math.cos(DEFAULT_FREE_CAMERA.pitch)
 ];
 const view=M4.lookAt(eye,target,[0,1,0]),tanHalf=Math.tan(Math.PI/8);
 let extent=0;
 for(const p of MOBILE_FIT_POINTS){
   const vx=view[0]*p[0]+view[4]*p[1]+view[8]*p[2]+view[12];
   const vy=view[1]*p[0]+view[5]*p[1]+view[9]*p[2]+view[13];
   const vz=view[2]*p[0]+view[6]*p[1]+view[10]*p[2]+view[14];
   const depth=-vz;
   if(depth<=.1)return Infinity;
   extent=Math.max(extent,Math.abs(vx)/(depth*tanHalf*aspect),Math.abs(vy)/(depth*tanHalf));
 }
 return extent;
}
function calculateMobileFit(){
 const rect=canvas.getBoundingClientRect(),aspect=Math.max(.35,rect.width/Math.max(1,rect.height));
 let low=CAMERA_DISTANCE_MIN,high=CAMERA_DISTANCE_MAX;
 const clamped=mobileFitExtentAtDistance(high,aspect)>MOBILE_FIT_LIMIT;
 if(!clamped){
   for(let i=0;i<36;i++){
     const mid=(low+high)/2;
     if(mobileFitExtentAtDistance(mid,aspect)<=MOBILE_FIT_LIMIT)high=mid;else low=mid;
   }
 }
 const fitDistance=clamped?CAMERA_DISTANCE_MAX:high;
 return {distance:fitDistance,extent:mobileFitExtentAtDistance(fitDistance,aspect),aspect,clamped,width:rect.width,height:rect.height};
}
function applyMobileViewFit(reason="initial"){
 if(!mobileFitQuery.matches||fixedView!=="free")return false;
 yaw=DEFAULT_FREE_CAMERA.yaw;pitch=DEFAULT_FREE_CAMERA.pitch;
 panX=DEFAULT_FREE_CAMERA.panX;panY=DEFAULT_FREE_CAMERA.panY;
 const fit=calculateMobileFit();distance=fit.distance;
 lastMobileFitViewport={width:fit.width,height:fit.height,landscape:fit.width>fit.height};
 const root=document.documentElement;
 root.dataset.mobileFitReason=reason;
 root.dataset.mobileFitDistance=fit.distance.toFixed(2);
 root.dataset.mobileFitMaxNdc=fit.extent.toFixed(4);
 root.dataset.mobileFitAspect=fit.aspect.toFixed(4);
 root.dataset.mobileFitClamped=String(fit.clamped);
 syncCameraControls();
 return true;
}
function scheduleMobileViewFit(reason){
 clearTimeout(mobileFitTimer);
 mobileFitTimer=setTimeout(()=>{
   if(!cameraUserAdjusted&&mobileFitQuery.matches&&fixedView==="free")applyMobileViewFit(reason);
 },120);
}
const LARGE_BALL_PHASE_ANGLES=Object.freeze({
 positive:Math.PI-Math.asin(GEOM.largeNearOffset/GEOM.largeOrbitRadius),
 midway:Math.PI/2,
 negative:Math.asin(GEOM.largeNearOffset/GEOM.largeOrbitRadius)
});
function largeBallPhaseAngle(v=phase){
 const q=clamp(v,0,1);
 if(q<=.5){
  const t=q/.5;
  return LARGE_BALL_PHASE_ANGLES.positive+(LARGE_BALL_PHASE_ANGLES.midway-LARGE_BALL_PHASE_ANGLES.positive)*t;
 }
 const t=(q-.5)/.5;
 return LARGE_BALL_PHASE_ANGLES.midway+(LARGE_BALL_PHASE_ANGLES.negative-LARGE_BALL_PHASE_ANGLES.midway)*t;
}
function largeBallPlanarCoordinates(v=phase){
 const r=GEOM.largeOrbitRadius;
 const angle=largeBallPhaseAngle(v);
 const x=r*Math.cos(angle),z=r*Math.sin(angle);
 return {left:[x,z],right:[-x,-z]};
}
function largeBallCoordinatePoints(){
 const planar=largeBallPlanarCoordinates();
 const pY=34,rY=pY-GEOM.largeOrbitRadius/Math.sqrt(3);
 const worldBallY=rY-GEOM.copperRodTotal+GEOM.copperRodBallSegment/2;
 const relY=worldBallY-GEOM.armY;
 return {left:[planar.left[0],relY,planar.left[1]],right:[planar.right[0],relY,planar.right[1]]};
}
function coordinateAuditPoints(){
 const large=largeBallCoordinatePoints();
 return [
  {id:"C",name:"アーム中心 C",coord:[0,0,0],basis:"原点",basisClass:"confirmed",views:["front","side","top"]},
  {id:"gl",name:"ねじり線上端",coord:[0,GEOM.torsionWireLength,0],basis:"本文確定",basisClass:"confirmed",views:["front","side"]},
  {id:"xL",name:"左小球中心",coord:[-GEOM.armHalfSpan,-GEOM.smallBallDrop,0],basis:"本文確定",basisClass:"confirmed",views:["front","top"]},
  {id:"xR",name:"右小球中心",coord:[GEOM.armHalfSpan,-GEOM.smallBallDrop,0],basis:"本文確定",basisClass:"confirmed",views:["front","side","top"]},
  {id:"hL",name:"左読取尺度中心",coord:[-GEOM.readerRadius,1,0],basis:"X確定・Y校正",basisClass:"measured",views:["front","top"]},
  {id:"hR",name:"右読取尺度中心",coord:[GEOM.readerRadius,1,0],basis:"X確定・Y校正",basisClass:"measured",views:["front","side","top"]},
  {id:"WL",name:"左大球中心",coord:large.left,basis:"本文値から算出",basisClass:"reconstructed",views:["front","side","top"]},
  {id:"WR",name:"右大球中心",coord:large.right,basis:"本文値から算出",basisClass:"reconstructed",views:["front","side","top"]},
  {id:"P",name:"支持分岐点 P",coord:fromWorld([0,34,0]),basis:"Fig.1校正",basisClass:"measured",views:["front","side"]},
  {id:"MM",name:"滑車中心 MM",coord:fromWorld([0,40.15,0]),basis:"Fig.1校正",basisClass:"measured",views:["front","side","top"]}
 ];
}
function coordinateMasterPoints(){
 const core=coordinateAuditPoints();
 const optics=opticsGeometry();
 const left=optics[0],right=optics[1];
 const supportPlanar=largeBallPlanarCoordinates(),supportRY=34-GEOM.largeOrbitRadius/Math.sqrt(3);
 const extra=[
  {id:"p",part:"上部駆動",name:"保持板p中心",coord:fromWorld([0,44.25,0]),basisClass:"measured",basis:"Fig.1比例校正",source:"Fig.1"},
  {id:"rrL",part:"大球支持",name:"支持横木rr左端",coord:fromWorld([supportPlanar.left[0],supportRY,supportPlanar.left[1]]),basisClass:"reconstructed",basis:"支持半径＋P分岐120°から算出",source:"本文＋Fig.1"},
  {id:"rrR",part:"大球支持",name:"支持横木rr右端",coord:fromWorld([supportPlanar.right[0],supportRY,supportPlanar.right[1]]),basisClass:"reconstructed",basis:"支持半径＋P分岐120°から算出",source:"本文＋Fig.1"},
  {id:"caseC",part:"木製ケース",name:"ケース主室基準C",coord:[0,0,0],basisClass:"confirmed",basis:"ねじり軸・アーム交点",source:"本文"},
  {id:"caseA_L",part:"木製ケース",name:"左肩端A",coord:fromWorld([-GEOM.caseOuterX,GEOM.caseShoulderEndY,0]),basisClass:"measured",basis:"Fig.1比例校正",source:"Fig.1"},
  {id:"caseA_R",part:"木製ケース",name:"右肩端A",coord:fromWorld([GEOM.caseOuterX,GEOM.caseShoulderEndY,0]),basisClass:"measured",basis:"Fig.1比例校正",source:"Fig.1"},
  {id:"caseB_L",part:"木製ケース",name:"左端部外下角B",coord:fromWorld([-GEOM.caseOuterX,GEOM.caseEndBottomY,0]),basisClass:"measured",basis:"Fig.1比例校正",source:"Fig.1"},
  {id:"caseB_R",part:"木製ケース",name:"右端部外下角B",coord:fromWorld([GEOM.caseOuterX,GEOM.caseEndBottomY,0]),basisClass:"measured",basis:"Fig.1比例校正",source:"Fig.1"},
  {id:"caseC_L",part:"木製ケース",name:"左端部内下角C",coord:fromWorld([-GEOM.caseEndInnerWallX,GEOM.caseEndBottomY,0]),basisClass:"measured",basis:"Fig.1比例校正",source:"Fig.1"},
  {id:"caseC_R",part:"木製ケース",name:"右端部内下角C",coord:fromWorld([GEOM.caseEndInnerWallX,GEOM.caseEndBottomY,0]),basisClass:"measured",basis:"Fig.1比例校正",source:"Fig.1"},
  {id:"caseD_L",part:"木製ケース",name:"左主室底面端D",coord:fromWorld([-GEOM.caseEndInnerWallX,GEOM.caseFloorY,0]),basisClass:"measured",basis:"Fig.1比例校正",source:"Fig.1"},
  {id:"caseD_R",part:"木製ケース",name:"右主室底面端D",coord:fromWorld([GEOM.caseEndInnerWallX,GEOM.caseFloorY,0]),basisClass:"measured",basis:"Fig.1比例校正",source:"Fig.1"},
  {id:"caseE_L",part:"木製ケース",name:"左縦室基部E",coord:fromWorld([-GEOM.caseTowerBaseHalfWidth,GEOM.caseTowerBaseY,0]),basisClass:"measured",basis:"Fig.1比例校正",source:"Fig.1"},
  {id:"caseE_R",part:"木製ケース",name:"右縦室基部E",coord:fromWorld([GEOM.caseTowerBaseHalfWidth,GEOM.caseTowerBaseY,0]),basisClass:"measured",basis:"Fig.1比例校正",source:"Fig.1"},
  {id:"caseF_L",part:"木製ケース",name:"左縦室上端F",coord:fromWorld([-GEOM.caseTowerTopHalfWidth,GEOM.caseTowerTopY,0]),basisClass:"measured",basis:"Fig.1比例校正・gl上端高",source:"本文＋Fig.1"},
  {id:"caseF_R",part:"木製ケース",name:"右縦室上端F",coord:fromWorld([GEOM.caseTowerTopHalfWidth,GEOM.caseTowerTopY,0]),basisClass:"measured",basis:"Fig.1比例校正・gl上端高",source:"本文＋Fig.1"},
  {id:"caseTop",part:"木製ケース",name:"中央縦室上端中心",coord:fromWorld([0,GEOM.caseTowerTopY,0]),basisClass:"measured",basis:"Fig.1比例校正・gl上端高",source:"本文＋Fig.1"},
  {id:"lampL",part:"ランプ",name:"左ランプ中心",coord:fromWorld(left.lamp),basisClass:"inferred",basis:"合理推定",source:"本文＋Fig.1概略"},
  {id:"lampR",part:"ランプ",name:"右ランプ中心",coord:fromWorld(right.lamp),basisClass:"inferred",basis:"合理推定",source:"本文＋Fig.1概略"},
  {id:"sourceL",part:"ランプ",name:"左発光点",coord:fromWorld(left.source),basisClass:"inferred",basis:"合理推定",source:"光路説明座標"},
  {id:"sourceR",part:"ランプ",name:"右発光点",coord:fromWorld(right.source),basisClass:"inferred",basis:"合理推定",source:"光路説明座標"},
  {id:"eyeL",part:"望遠鏡",name:"左望遠鏡視点",coord:fromWorld(left.eye),basisClass:"inferred",basis:"合理推定",source:"本文＋Fig.1概略"},
  {id:"eyeR",part:"望遠鏡",name:"右望遠鏡視点",coord:fromWorld(right.eye),basisClass:"inferred",basis:"合理推定",source:"本文＋Fig.1概略"},
  {id:"scopeL",part:"望遠鏡",name:"左望遠鏡鏡筒中心",coord:fromWorld(left.scope),basisClass:"inferred",basis:"合理推定",source:"本文＋Fig.1概略"},
  {id:"scopeR",part:"望遠鏡",name:"右望遠鏡鏡筒中心",coord:fromWorld(right.scope),basisClass:"inferred",basis:"合理推定",source:"本文＋Fig.1概略"}
 ];
 const partMap={C:"ねじり天秤",gl:"ねじり線",xL:"小球",xR:"小球",hL:"読取部",hR:"読取部",WL:"大球",WR:"大球",P:"上部駆動",MM:"上部駆動"};
 return core.map(p=>({...p,part:partMap[p.id]||"その他",source:p.basis})).concat(extra);
}
function pointMap(){return Object.fromEntries(coordinateMasterPoints().map(p=>[p.id,p]))}
function pointDistance(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])}
function radialDistance(a){return Math.hypot(a[0],a[2])}
function dimensionAuditDefinitions(){
 const map=pointMap();
 return [
  {id:"torsionWire",name:"ねじり線長",endpoints:"C–gl",actual:()=>pointDistance(map.C.coord,map.gl.coord),reference:GEOM.torsionWireLength,basisClass:"confirmed",basis:"本文確定"},
  {id:"armSpan",name:"左右小球中心間隔",endpoints:"xL–xR",actual:()=>pointDistance(map.xL.coord,map.xR.coord),reference:GEOM.armHalfSpan*2,basisClass:"confirmed",basis:"本文確定"},
  {id:"readerSpan",name:"左右読取尺度中心間隔",endpoints:"hL–hR",actual:()=>pointDistance(map.hL.coord,map.hR.coord),reference:GEOM.readerRadius*2,basisClass:"confirmed",basis:"本文確定"},
  {id:"leftOrbit",name:"左大球支持軌道半径",endpoints:"C–WL（X–Z）",actual:()=>radialDistance(map.WL.coord),reference:GEOM.largeOrbitRadius,basisClass:"reconstructed",basis:"本文値から算出"},
  {id:"rightOrbit",name:"右大球支持軌道半径",endpoints:"C–WR（X–Z）",actual:()=>radialDistance(map.WR.coord),reference:GEOM.largeOrbitRadius,basisClass:"reconstructed",basis:"本文値から算出"},
  {id:"rrSpan",name:"支持横木rrの左右間隔",endpoints:"rrL–rrR",actual:()=>pointDistance(map.rrL.coord,map.rrR.coord),reference:GEOM.armHalfSpan*2,basisClass:"reconstructed",basis:"本文値＋Fig.1支持条件から算出"},
  {id:"smallDropL",name:"左小球中心落差",endpoints:"C–xL（Y）",actual:()=>Math.abs(map.xL.coord[1]-map.C.coord[1]),reference:GEOM.smallBallDrop,basisClass:"confirmed",basis:"本文確定"},
  {id:"smallDropR",name:"右小球中心落差",endpoints:"C–xR（Y）",actual:()=>Math.abs(map.xR.coord[1]-map.C.coord[1]),reference:GEOM.smallBallDrop,basisClass:"confirmed",basis:"本文確定"},
  {id:"pulleyHeight",name:"P–MM中心距離",endpoints:"P–MM",actual:()=>pointDistance(map.P.coord,map.MM.coord),reference:6.15,basisClass:"measured",basis:"Fig.1比例校正"},
  {id:"caseEndInnerWidth",name:"端部小球室内幅",endpoints:"左右AB–CD内面",actual:()=>(GEOM.caseOuterX-GEOM.caseThickness)-(GEOM.caseEndInnerWallX+GEOM.caseThickness),reference:GEOM.caseInnerX,basisClass:"confirmed",basis:"本文・Fig.9対応"},
  {id:"caseEndInnerHeight",name:"端部小球室内高",endpoints:"BC内面–上面内側",actual:()=>(GEOM.caseFloorY-GEOM.caseThickness)-(GEOM.caseEndBottomY+GEOM.caseThickness),reference:GEOM.caseInnerY,basisClass:"confirmed",basis:"本文・Fig.9対応"},
  {id:"caseEndInnerDepth",name:"端部小球室奥行",endpoints:"前後内面",actual:()=>GEOM.caseInnerZ,reference:6.75,basisClass:"confirmed",basis:"本文・Fig.9対応"},
  {id:"caseTopAlignment",name:"ケースF上端とgl上端の高さ",endpoints:"caseTop–gl（Y）",actual:()=>Math.abs(map.caseTop.coord[1]-map.gl.coord[1]),reference:0,basisClass:"measured",basis:"本文40 in＋Fig.1対応"},
  {id:"caseTowerTaper",name:"中央縦室EFの幅減少",endpoints:"E幅–F幅",actual:()=>GEOM.caseTowerBaseHalfWidth*2-GEOM.caseTowerTopHalfWidth*2,reference:4.90,basisClass:"measured",basis:"Fig.1比例校正"},
  {id:"lampSymmetry",name:"左右ランプ中心対称距離",endpoints:"lampL–lampR",actual:()=>pointDistance(map.lampL.coord,map.lampR.coord),reference:94.76,basisClass:"inferred",basis:"合理推定座標から算出"}
 ];
}
function basisLabel(cls){return {confirmed:"本文確定",reconstructed:"算出",measured:"図版校正",inferred:"合理推定"}[cls]||cls}
function populateCoordinateMaster(){
 const rows=$("coordinateMasterRows");if(!rows)return;
 const points=coordinateMasterPoints(),partFilter=$("coordPartFilter");
 if(partFilter&&partFilter.options.length===1){
   [...new Set(points.map(p=>p.part))].sort().forEach(part=>{const o=document.createElement("option");o.value=part;o.textContent=part;partFilter.appendChild(o)});
 }
 const basis=$("coordBasisFilter")?.value||"all",part=$("coordPartFilter")?.value||"all";
 const filtered=points.filter(p=>(basis==="all"||p.basisClass===basis)&&(part==="all"||p.part===part));
 rows.innerHTML=filtered.map(p=>`<tr><td><b>${p.id}</b></td><td>${p.part}<small>${p.name}</small></td><td>${p.coord[0].toFixed(2)}</td><td>${p.coord[1].toFixed(2)}</td><td>${p.coord[2].toFixed(2)}</td><td><span class="basis-state ${p.basisClass}">${basisLabel(p.basisClass)}</span></td><td>${p.source}<small>${p.basis}</small></td></tr>`).join("");
}
function populateDimensionAudit(){
 const defs=dimensionAuditDefinitions(),select=$("dimensionAuditSelect"),rows=$("dimensionAuditRows");
 if(!select||!rows)return;
 if(!select.options.length)defs.forEach(d=>{const o=document.createElement("option");o.value=d.id;o.textContent=d.name;select.appendChild(o)});
 rows.innerHTML=defs.map(d=>{const actual=d.actual(),delta=actual-d.reference,pass=Math.abs(delta)<.005;return `<tr><td>${d.name}<small>${d.endpoints}</small></td><td>${actual.toFixed(3)} in</td><td>${d.reference.toFixed(3)} in</td><td>${delta>=0?"+":""}${delta.toFixed(3)} in</td><td class="${d.basisClass}">${d.basis}</td><td class="${pass?"audit-pass":"audit-fail"}">${pass?"整合":"要確認"}</td></tr>`}).join("");
 updateDimensionDetail();
}
function updateDimensionDetail(){
 const id=$("dimensionAuditSelect")?.value,d=dimensionAuditDefinitions().find(x=>x.id===id);if(!d)return;
 const actual=d.actual(),delta=actual-d.reference,pass=Math.abs(delta)<.005;
 $("dimensionEndpoints").textContent=d.endpoints;
 $("dimensionActual").textContent=actual.toFixed(3)+" in";
 $("dimensionReference").textContent=d.reference.toFixed(3)+" in";
 $("dimensionDelta").textContent=(delta>=0?"+":"")+delta.toFixed(3)+" in";
 $("dimensionDelta").className=pass?"audit-pass":"audit-fail";
 $("dimensionBasis").textContent="根拠："+d.basis+"。差分判定閾値は0.005 inです。";
}

function fmtCoord(p){return `(${p.map(v=>(Math.abs(v)<.0005?0:v).toFixed(2)).join(", ")})`}
function coordinateResiduals(){
 const pts=coordinateAuditPoints(),map=Object.fromEntries(pts.map(p=>[p.id,p.coord]));
 const radial=p=>Math.hypot(p[0],p[2]);
 const checks=[
  {name:"小球左右対称",value:Math.max(Math.abs(map.xL[0]+map.xR[0]),Math.abs(map.xL[1]-map.xR[1]),Math.abs(map.xL[2]+map.xR[2]))},
  {name:"読取尺度左右対称",value:Math.max(Math.abs(map.hL[0]+map.hR[0]),Math.abs(map.hL[1]-map.hR[1]),Math.abs(map.hL[2]+map.hR[2]))},
  {name:"大球支持対称",value:Math.max(Math.abs(map.WL[0]+map.WR[0]),Math.abs(map.WL[1]-map.WR[1]),Math.abs(map.WL[2]+map.WR[2]))},
  {name:"ねじり線軸心",value:Math.hypot(map.gl[0],map.gl[2])},
  {name:"左大球軌道半径",value:Math.abs(radial(map.WL)-GEOM.largeOrbitRadius)},
  {name:"右大球軌道半径",value:Math.abs(radial(map.WR)-GEOM.largeOrbitRadius)}
 ];
 return checks;
}
function populateCoordinateAudit(){
 const rows=$("coordinateAuditRows");if(!rows)return;
 const points=coordinateAuditPoints();
 rows.innerHTML=points.map(p=>`<tr><td>${p.name}<small>${p.id}</small></td><td>${fmtCoord(p.coord)}</td><td class="${p.basisClass}">${p.basis}</td><td class="audit-pass">0.000</td></tr>`).join("");
 const checks=coordinateResiduals(),max=Math.max(...checks.map(c=>c.value),0);
 $("coordAuditCount").textContent=String(points.length);
 $("coordAuditSymmetry").textContent=checks.slice(0,3).filter(c=>c.value<1e-8).length+"/3";
 $("coordAuditMax").textContent=max.toFixed(3)+" in";
 $("projectionAuditResult").textContent=max<1e-8?"主要中心点整合":"要再監査";
 populateCoordinateMaster();
 populateDimensionAudit();
}
function projectionMeta(view){
 return {
  free:{name:"自由視点",plane:"透視投影／回転可能"},
  front:{name:"正面正投影",plane:"X–Y平面／+Z方向から観察"},
  side:{name:"側面正投影",plane:"Z–Y平面／+X方向から観察"},
  top:{name:"上面正投影",plane:"X–Z平面／+Y方向から観察"}
 }[view];
}
function updateProjectionUI(){
 const meta=projectionMeta(fixedView),fixed=fixedView!=="free";
 document.body.classList.toggle("fixed-projection",fixed);
 document.querySelectorAll(".projection").forEach(b=>b.classList.toggle("active",b.dataset.view===fixedView));
 $("projectionStatus").hidden=!fixed;
 $("axisLegend").hidden=!(fixed&&showAxes&&mode!=="audit");
 $("coordinateStatus").textContent=meta.name;
 $("coordAuditView").textContent=meta.name;
 if(fixed){
   $("projectionName").textContent=meta.name;$("projectionPlane").textContent=meta.plane;
   $("viewTitle").textContent=meta.name+"｜"+document.querySelector(".mode.active").textContent;
   document.querySelector(".viewer-head span").textContent="1本指ドラッグ：移動　ピンチ：拡大　回転：固定";
 }else{
   $("viewTitle").textContent=document.querySelector(".mode.active").textContent+"表示";
   document.querySelector(".viewer-head span").textContent="1本指ドラッグ：回転　ピンチ：拡大　2本指ドラッグ：移動";
 }
 $("toggleAxes").textContent="XYZ軸 "+(showAxes?"ON":"OFF");$("toggleAxes").classList.toggle("active",showAxes);
 $("toggleCoordLabels").textContent="中心点 "+(showCoordLabels?"ON":"OFF");$("toggleCoordLabels").classList.toggle("active",showCoordLabels);
}
function setProjectionView(view){
 if(view===fixedView)return;
 if(fixedView==="free")freeCamera={yaw,pitch,distance,panX,panY};
 fixedView=view;ortho=view!=="free";
 if(view==="free"){
   ({yaw,pitch,distance,panX,panY}=freeCamera);
 }else{
   distance=125;panX=0;panY=0;
 }
 syncCameraControls();updateProjectionUI();populateCoordinateAudit();
}
document.querySelectorAll(".projection").forEach(b=>b.onclick=()=>setProjectionView(b.dataset.view));
$("toggleAxes").onclick=()=>{showAxes=!showAxes;updateProjectionUI()};
$("toggleCoordLabels").onclick=()=>{showCoordLabels=!showCoordLabels;updateProjectionUI()};
$("coordBasisFilter").onchange=populateCoordinateMaster;
$("coordPartFilter").onchange=populateCoordinateMaster;
$("dimensionAuditSelect").onchange=updateDimensionDetail;
function selectPart(k){
 selected=k;document.querySelectorAll(".part").forEach(b=>b.classList.toggle("active",b.dataset.part===k));
 const p=parts[k];$("partTitle").textContent=p.name;$("partRole").textContent=p.name+"の実メッシュと拘束関係を表示します。";
 $("partId").textContent="—";$("partSymbol").textContent=p.symbol;$("partValue").textContent=p.value;$("partBasis").textContent=p.basis;$("partDof").textContent=p.dof;
 $("partParent").textContent="CADアセンブリ";$("partConstraint").textContent="WebGL実座標";$("partCoord").textContent="X長手・Y鉛直・Z前後";
}
function applyOpticsModeState(){
 const focus=isMobile&&mode==="optics";
 document.body.classList.toggle("mobile-optics-focus",focus);
 $("mobileOpticsLegend").hidden=!focus;
 $("mobileOpticsGuide").hidden=!focus;
 if(focus) opticsKeys.forEach(k=>opticsViz[k]=k===mobileOpticsItem);
 document.querySelectorAll("[data-mobile-optics]").forEach(b=>{
   const on=b.dataset.mobileOptics===mobileOpticsItem;
   b.classList.toggle("active",on);
   b.setAttribute("aria-pressed",String(on));
 });
}
document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>{
 mode=b.dataset.mode;
 document.querySelectorAll(".mode").forEach(x=>x.classList.toggle("active",x===b));
 $("viewTitle").textContent=fixedView==="free"?b.textContent+"表示":projectionMeta(fixedView).name+"｜"+b.textContent;
 if(mode==="optics"&&!opticsAutoActivated){
   if(isMobile){
     mobileOpticsItem="path";
     opticsKeys.forEach(k=>opticsViz[k]=k===mobileOpticsItem);
   }else{
     opticsViz.source=opticsViz.path=opticsViz.axis=opticsViz.fov=true;
   }
   opticsAutoActivated=true;
 }
 applyOpticsModeState();
 updateOpticsControls();
 setAudit();updateProjectionUI();
});
function updateMobileOpticsLegend(){
 const item=opticsLegend[mobileOpticsItem];
 if(!item)return;
 $("mobileOpticsLegendTitle").textContent=item.title;
 $("mobileOpticsLegendText").textContent=item.text;
 $("mobileOpticsGuideTitle").textContent=item.title;
 const badge=$("lampStateBadge");
 if(badge){badge.textContent=lampStateText();badge.classList.toggle("lit",lampIsLit());badge.classList.toggle("idle",!lampIsLit())}
 const mark=$("mobileOpticsLegendMark");
 mark.className="legend-mark "+item.cls;
}
function updateOpticsControls(){
 const labels={source:"光源",path:"光路",axis:"視線",fov:"視野"};
 document.querySelectorAll(".optics-toggle").forEach(b=>{
   const key=b.dataset.optics,on=!!opticsViz[key];
   b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));
 });
 const active=Object.keys(labels).filter(k=>opticsViz[k]);
 const visualText=active.length?active.map(k=>labels[k]).join("・"):"OFF";
 $("opticsVisualStatus").textContent=visualText;
 $("opticsStatusStrip").textContent=visualText;
 updateMobileOpticsLegend();
 updateOpticsOcclusionStatus();
}
document.querySelectorAll(".optics-toggle").forEach(b=>b.onclick=()=>{
 const key=b.dataset.optics;
 if(isMobile&&mode==="optics"&&opticsKeys.includes(key)){
   mobileOpticsItem=key;
   opticsKeys.forEach(k=>opticsViz[k]=k===key);
 }else{
   opticsViz[key]=!opticsViz[key];
 }
 opticsAutoActivated=true;applyOpticsModeState();updateOpticsControls();
});
function handleMobileChange(e){
 isMobile=e.matches;
 if(isMobile&&mode==="optics"){
   const current=opticsKeys.find(k=>opticsViz[k]);
   mobileOpticsItem=current||"source";
 }else if(!isMobile&&mode==="optics"){
   opticsKeys.forEach(k=>opticsViz[k]=true);
 }
 applyOpticsModeState();updateOpticsControls();
}
if(mobileQuery.addEventListener)mobileQuery.addEventListener("change",handleMobileChange);
else mobileQuery.addListener(handleMobileChange);
function handleMobileFitChange(e){
 if(e.matches){
   if(!cameraUserAdjusted)scheduleMobileViewFit("media-change");
 }else if(!cameraUserAdjusted&&fixedView==="free"){
   yaw=DEFAULT_FREE_CAMERA.yaw;pitch=DEFAULT_FREE_CAMERA.pitch;
   distance=DEFAULT_FREE_CAMERA.distance;panX=0;panY=0;syncCameraControls();
 }
}
if(mobileFitQuery.addEventListener)mobileFitQuery.addEventListener("change",handleMobileFitChange);
else mobileFitQuery.addListener(handleMobileFitChange);
window.addEventListener("orientationchange",()=>scheduleMobileViewFit("orientation-change"));
window.addEventListener("resize",()=>{
 if(cameraUserAdjusted||!mobileFitQuery.matches||fixedView!=="free")return;
 const rect=canvas.getBoundingClientRect(),landscape=rect.width>rect.height;
 if(!lastMobileFitViewport||landscape!==lastMobileFitViewport.landscape||Math.abs(rect.width-lastMobileFitViewport.width)>40){
   scheduleMobileViewFit("viewport-change");
 }
});

document.querySelectorAll("[data-mobile-optics]").forEach(b=>b.onclick=()=>{
 mobileOpticsItem=b.dataset.mobileOptics;
 opticsKeys.forEach(k=>opticsViz[k]=k===mobileOpticsItem);
 opticsAutoActivated=true;
 applyOpticsModeState();
 updateOpticsControls();
});
$("exitMobileOptics").onclick=()=>{
 const allBtn=[...document.querySelectorAll(".mode")].find(b=>b.dataset.mode==="all");
 if(allBtn)allBtn.click();
};
function setAudit(){const on=mode==="audit";$("auditStage").hidden=!on;$("auditControls").hidden=!on;canvas.style.visibility=on?"hidden":"visible";$("coordinateOverlay").hidden=on||fixedView==="free"||!showCoordLabels;$("axisLegend").hidden=on||fixedView==="free"||!showAxes}
function phaseState(v=phase){
 if(Math.abs(v-.5)<.035)return {key:"midway",label:"中間位置",snap:.5};
 if(v<.5)return {key:"positive",label:"正位置",snap:0};
 return {key:"negative",label:"負位置",snap:1};
}
function setPhase(v){
 phase=clamp(v,0,1);
 const state=phaseState();
 $("ballPhase").value=phase;
 $("ballPhaseValue").textContent=state.label+(phase===state.snap?"":"（補間 "+Math.round(phase*100)+"%）");
 $("driveStatus").textContent=state.label;
 $("posA").classList.toggle("active",state.key==="positive"&&phase===0);
 $("posMid").classList.toggle("active",state.key==="midway"&&phase===.5);
 $("posB").classList.toggle("active",state.key==="negative"&&phase===1);
 populateCoordinateAudit();
}
$("ballPhase").oninput=e=>setPhase(+e.target.value);$("armAngle").oninput=e=>{armValue=+e.target.value;$("armAngleValue").textContent=armValue.toFixed(3)};
$("caseOpacity").oninput=e=>{caseOpacity=+e.target.value/100;$("caseOpacityValue").textContent=e.target.value+"%"};
$("depthContrast").oninput=e=>{depthContrast=+e.target.value/100;$("depthContrastValue").textContent=e.target.value+"%"};
$("zoomLevel").oninput=e=>{cameraUserAdjusted=true;distance=zoomToDistance(+e.target.value);$("zoomLevelValue").textContent=e.target.value+"%"};
$("panX").oninput=e=>{cameraUserAdjusted=true;panX=+e.target.value*.7;$("panXValue").textContent=e.target.value};
$("panY").oninput=e=>{cameraUserAdjusted=true;panY=+e.target.value*.7;$("panYValue").textContent=e.target.value};
$("posA").onclick=()=>setPhase(0);$("posMid").onclick=()=>setPhase(.5);$("posB").onclick=()=>setPhase(1);
$("playMove").onclick=()=>{
 const targets=[0,.5,1,.5,0];
 const current=phase<.25?0:phase<.75?.5:1;
 let index=Math.max(0,targets.indexOf(current));
 function moveNext(){
  if(index>=targets.length-1)return;
  const a=phase,b=targets[++index],start=performance.now();
  function f(t){const q=Math.min(1,(t-start)/1500),e=.5-.5*Math.cos(Math.PI*q);setPhase(a+(b-a)*e);if(q<1)requestAnimationFrame(f);else setTimeout(moveNext,320)}
  requestAnimationFrame(f);
 }
 moveNext();
};
$("armDemo").onclick=()=>{const s=performance.now();function f(t){const q=Math.min(1,(t-s)/2400);armValue=Math.sin(q*Math.PI*4)*Math.exp(-q*2);$("armAngle").value=armValue;$("armAngleValue").textContent=armValue.toFixed(3);if(q<1)requestAnimationFrame(f)}requestAnimationFrame(f)};
$("resetView").onclick=()=>{
 if(fixedView==="free"){
   cameraUserAdjusted=false;
   if(!applyMobileViewFit("reset")){yaw=DEFAULT_FREE_CAMERA.yaw;pitch=DEFAULT_FREE_CAMERA.pitch;panX=0;panY=0}
 }else{
   distance=DEFAULT_FREE_CAMERA.distance;panX=0;panY=0;
 }
 syncCameraControls();updateProjectionUI();
};
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{$("sourceImage").src=b.dataset.tab==="fig1"?"assets/fig1.png":"assets/fig2.png";document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b))});

/* ---------- draw helpers ---------- */
const objects=[];
let currentView=M4.ident();
const depthRange={near:0,far:0};
function obj(meshKey,model,color,part,transparent=false,kind="",unlit=0){objects.push({mesh:mesh[meshKey],model,color,part,transparent,kind,unlit})}
function T(x,y,z){return M4.translate(x,y,z)}
function S(x,y,z){return M4.scale(x,y,z)}
function cylinder(a,b,r,color,part,transparent=false,kind="",unlit=0){
 const d=V3.sub(b,a),len=Math.hypot(...d),mid=[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2],dir=V3.norm(d);
 const up=[0,1,0],axis=V3.cross(up,dir),dot=Math.max(-1,Math.min(1,up[0]*dir[0]+up[1]*dir[1]+up[2]*dir[2])),ang=Math.acos(dot);
 let R=M4.ident();if(Math.hypot(...axis)>.0001){const ax=V3.norm(axis); // Rodrigues matrix
   const c=Math.cos(ang),s=Math.sin(ang),t=1-c,x=ax[0],y=ax[1],z=ax[2];
   R=new Float32Array([t*x*x+c,t*x*y+s*z,t*x*z-s*y,0,t*x*y-s*z,t*y*y+c,t*y*z+s*x,0,t*x*z+s*y,t*y*z-s*x,t*z*z+c,0,0,0,0,1]);
 }
 obj("cyl",M4.mul(T(...mid),M4.mul(R,S(r,len/2,r))),color,part,transparent,kind,unlit)
}
function boxBeam(a,b,halfWidth,halfDepth,color,part,kind=""){
 const d=V3.sub(b,a),len=Math.hypot(...d),mid=[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2],dir=V3.norm(d);
 const up=[0,1,0],axis=V3.cross(up,dir),dot=Math.max(-1,Math.min(1,up[0]*dir[0]+up[1]*dir[1]+up[2]*dir[2])),ang=Math.acos(dot);
 let R=M4.ident();if(Math.hypot(...axis)>.0001){const ax=V3.norm(axis),c=Math.cos(ang),s=Math.sin(ang),t=1-c,x=ax[0],y=ax[1],z=ax[2];
   R=new Float32Array([t*x*x+c,t*x*y+s*z,t*x*z-s*y,0,t*x*y-s*z,t*y*y+c,t*y*z+s*x,0,t*x*z+s*y,t*y*z-s*x,t*z*z+c,0,0,0,0,1]);
 }
 obj("box",M4.mul(T(...mid),M4.mul(R,S(halfWidth,len/2,halfDepth))),color,part,false,kind)
}
function frustum(a,b,rStart,rEnd,color,part,kind,meshKey="beam"){
 const d=V3.sub(b,a),len=Math.hypot(...d),mid=[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2],dir=V3.norm(d);
 const up=[0,1,0],axis=V3.cross(up,dir),dot=Math.max(-1,Math.min(1,up[0]*dir[0]+up[1]*dir[1]+up[2]*dir[2])),ang=Math.acos(dot);
 let R=M4.ident();if(Math.hypot(...axis)>.0001){const ax=V3.norm(axis),c=Math.cos(ang),ss=Math.sin(ang),t=1-c,x=ax[0],y=ax[1],z=ax[2];R=new Float32Array([t*x*x+c,t*x*y+ss*z,t*x*z-ss*y,0,t*x*y-ss*z,t*y*y+c,t*y*z+ss*x,0,t*x*z+ss*y,t*y*z-ss*x,t*z*z+c,0,0,0,0,1])}
 const scale=Math.max(.001,rEnd);
 // Reusable GPU meshes preserve an approximate narrow-to-wide ratio; the end radius and
 // segment length remain exact, while the start radius is a visual guide rather than a measurement.
 obj(meshKey,M4.mul(T(...mid),M4.mul(R,S(scale,len/2,scale))),color,part,true,kind,1)
}

function crossingAtX(a,b,xPlane){
 const dx=b[0]-a[0];if(Math.abs(dx)<1e-6)return null;
 const t=(xPlane-a[0])/dx;if(t<0||t>1)return null;
 return [xPlane,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
}
function pathThroughReadingAperture(a,b,side){
 const q=crossingAtX(a,b,side*GEOM.caseOuterX);
 return !!q&&q[1]>=-32.5&&q[1]<=-16.5&&Math.abs(q[2])<=9;
}
function opticsGeometry(){
 const left={side:-1,source:[-45,-20,-5],lamp:[-47,-20,-6],scope:[-43,GEOM.armY,0],eye:[-49,GEOM.armY,0],target:[-GEOM.readerRadius,GEOM.armY+1,0]};
 const right={side:1,source:[45,-20,5],lamp:[47,-20,6],scope:[43,GEOM.armY,0],eye:[49,GEOM.armY,0],target:[GEOM.readerRadius,GEOM.armY+1,0]};
 for(const g of [left,right]){
   g.lightCross=crossingAtX(g.source,g.target,g.side*GEOM.caseOuterX);
   g.sightCross=crossingAtX(g.eye,g.target,g.side*GEOM.caseOuterX);
   g.lightOk=pathThroughReadingAperture(g.source,g.target,g.side);
   g.sightOk=pathThroughReadingAperture(g.eye,g.target,g.side);
   g.ok=g.lightOk&&g.sightOk;
 }
 return [left,right];
}
function updateOpticsOcclusionStatus(){
 const el=$("opticsOcclusionStatus"),banner=$("occlusionBanner");
 if(!el)return;
 if(!opticsViz.occlusion){
   el.textContent="OFF";el.className="";
   if(banner)banner.hidden=true;
   return;
 }
 const gg=opticsGeometry(),ok=gg.every(g=>g.ok);
 const sideName=g=>g.side<0?"左":"右";
 const details=gg.map(g=>{
   const light=g.lightOk?"照射通過":"照射遮蔽";
   const sight=g.sightOk?"視線通過":"視線遮蔽";
   return sideName(g)+"："+light+"・"+sight;
 }).join("　");
 el.textContent=ok?"左右とも通過":"遮蔽あり";
 el.className=ok?"ok":"fail";
 if(banner){
   banner.hidden=false;
   banner.classList.toggle("pass",ok);
   banner.classList.toggle("fail",!ok);
   $("occlusionBannerTitle").textContent=ok?"遮蔽確認：左右とも通過":"遮蔽確認：遮蔽あり";
   $("occlusionBannerText").textContent=details;
 }
}
function dashedCylinder(a,b,r,color,part,segments=15){
 const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2];
 for(let i=0;i<segments;i+=2){
   const t0=i/segments,t1=Math.min(1,(i+1)/segments);
   cylinder(
     [a[0]+dx*t0,a[1]+dy*t0,a[2]+dz*t0],
     [a[0]+dx*t1,a[1]+dy*t1,a[2]+dz*t1],
     r,color,part,true,"sightAxis",1
   );
 }
}
function addOpticsVisualization(){
 if(mode==="audit"||mode==="drive")return;
 const any=opticsViz.source||opticsViz.path||opticsViz.axis||opticsViz.fov||opticsViz.occlusion;
 if(!any)return;
 for(const g of opticsGeometry()){
   const statusColor=g.ok?[.20,.66,.42,1]:[.82,.20,.18,1];
   if(opticsViz.source){
     obj("sphere",M4.mul(T(...g.source),S(.38,.38,.38)),[1.0,.82,.32,1],"opticsViz",false,"lightSource",1);
     obj("sphere",M4.mul(T(...g.source),S(1.05,1.05,1.05)),[1.0,.70,.18,.18],"opticsViz",true,"lightHalo",1);
   }
   if(opticsViz.path){
     frustum(g.source,g.target,.18,1.25,[1.0,.70,.16,.15],"opticsViz","lightBeam","beam");
     cylinder(g.source,g.target,.085,[1.0,.76,.22,.88],"opticsViz",true,"lightRay",1);
   }
   if(opticsViz.axis){
     dashedCylinder(g.eye,g.target,.075,[.18,.58,.94,.92],"opticsViz");
   }
   if(opticsViz.fov){
     frustum(g.scope,g.target,.38,2.05,[.22,.60,.96,.14],"opticsViz","fieldOfView","fov");
   }
   if(opticsViz.occlusion){
     const lightColor=g.lightOk?[.16,.70,.38,.98]:[.88,.23,.16,.98];
     const sightColor=g.sightOk?[.14,.62,.88,.98]:[.88,.23,.16,.98];
     cylinder(g.source,g.target,.15,lightColor,"opticsViz",true,"occlusionLightPath",1);
     dashedCylinder(g.eye,g.target,.13,sightColor,"opticsViz",13);
     if(g.lightCross){
       obj("sphere",M4.mul(T(...g.lightCross),S(.48,.48,.48)),lightColor,"opticsViz",false,"occlusionLightCross",1);
     }
     if(g.sightCross){
       obj("sphere",M4.mul(T(...g.sightCross),S(.42,.42,.42)),sightColor,"opticsViz",false,"occlusionSightCross",1);
     }
     obj("sphere",M4.mul(T(...g.target),S(.46,.46,.46)),statusColor,"opticsViz",false,"occlusionMarker",1);
   }
 }
}
function addCoordinateAuditScene(){
 if(fixedView==="free"||mode==="audit")return;
 const c=toWorld([0,0,0]),axisLen=18;
 if(showAxes){
  cylinder(c,toWorld([axisLen,0,0]),.13,[.78,.25,.20,1],"coordinateViz",false,"axisX",1);
  cylinder(c,toWorld([0,axisLen,0]),.13,[.20,.58,.31,1],"coordinateViz",false,"axisY",1);
  cylinder(c,toWorld([0,0,axisLen]),.13,[.20,.43,.80,1],"coordinateViz",false,"axisZ",1);
 }
 if(showCoordLabels){
  for(const p of coordinateAuditPoints()){
   const color=p.basisClass==="confirmed"?[.23,.58,.35,1]:p.basisClass==="reconstructed"?[.83,.55,.12,1]:[.25,.48,.72,1];
   obj("sphere",M4.mul(T(...toWorld(p.coord)),S(.42,.42,.42)),color,"coordinateViz",false,"coordPoint",1);
  }
 }
}
function projectToCanvas(vp,world){
 const x=world[0],y=world[1],z=world[2];
 const cx=vp[0]*x+vp[4]*y+vp[8]*z+vp[12];
 const cy=vp[1]*x+vp[5]*y+vp[9]*z+vp[13];
 const cz=vp[2]*x+vp[6]*y+vp[10]*z+vp[14];
 const cw=vp[3]*x+vp[7]*y+vp[11]*z+vp[15];
 if(cw<=0)return null;
 const nx=cx/cw,ny=cy/cw,nz=cz/cw,rect=canvas.getBoundingClientRect();
 return {x:(nx*.5+.5)*rect.width,y:(1-(ny*.5+.5))*rect.height,visible:nx>=-1.05&&nx<=1.05&&ny>=-1.05&&ny<=1.05&&nz>=-1.05&&nz<=1.05};
}
function updateCoordinateOverlay(){
 const overlay=$("coordinateOverlay");
 const active=fixedView!=="free"&&showCoordLabels&&mode!=="audit";
 overlay.hidden=!active;if(!active)return;
 const points=coordinateAuditPoints().filter(p=>p.views.includes(fixedView));
 const existing=new Map([...overlay.children].map(el=>[el.dataset.id,el]));
 for(const p of points){
  let el=existing.get(p.id);
  if(!el){el=document.createElement("span");el.className="coord-tag "+p.basisClass;el.dataset.id=p.id;overlay.appendChild(el)}
  el.textContent=p.id;el.title=p.name+" "+fmtCoord(p.coord)+" in";
  const q=projectToCanvas(currentVP,toWorld(p.coord));
  el.hidden=!q||!q.visible;
  if(q&&q.visible){el.style.left=q.x+"px";el.style.top=q.y+"px"}
  existing.delete(p.id);
 }
 existing.forEach(el=>el.remove());
}
function addScene(){
 objects.length=0;
 const show=p=>mode==="all"||mode==="transparent"||mode==="clearance"||mode==="assembly"||mode==="constraints"||
   (mode==="inside"&&["case","wire","arm","small","reader"].includes(p))||
   (mode==="drive"&&["support","large","pulley","case"].includes(p))||
   (mode==="optics"&&["case","reader","telescope","lamp","arm"].includes(p));
 const hi=p=>selected===p?1.18:1;
 // building frame
 const frame=[0.63,0.69,0.72,0.20];
 obj("box",M4.mul(T(-50,-4,0),S(1,47,18)),frame,"case",true);obj("box",M4.mul(T(50,-4,0),S(1,47,18)),frame,"case",true);obj("box",M4.mul(T(0,43,0),S(50,1,18)),frame,"case",true);
 // case actual translucent prism
 if(show("case")){
   const focus=isMobile&&mode==="optics";
   const a=focus?Math.max(.06,caseOpacity*.24):(mode==="transparent"?Math.max(.05,caseOpacity*.45):Math.max(.10,caseOpacity*.42));
   const caseColor=[0.74,0.66,0.52,a];
   obj("caseShell",M4.ident(),caseColor,"case",true,"caseShell");
   obj("caseEndShellLeft",M4.ident(),caseColor,"case",true,"caseShell");
   obj("caseEndShellRight",M4.ident(),caseColor,"case",true,"caseShell");
 }
 // torsion balance
 if(show("wire"))cylinder([0,GEOM.armY+GEOM.torsionWireLength,0],[0,GEOM.armY,0],0.18,[0.22,0.27,0.29,1],"wire");
 const aa=armValue*.035,ca=Math.cos(aa),sa=Math.sin(aa),armP=x=>[x*ca,GEOM.armY,x*sa];
 if(show("arm")){cylinder(armP(-GEOM.armHalfSpan),armP(GEOM.armHalfSpan),0.38,[0.43,0.31,0.18,1],"arm");cylinder([0,GEOM.armY+2.5,0],armP(-GEOM.armHalfSpan),0.07,[0.58,0.61,0.63,1],"arm");cylinder([0,GEOM.armY+2.5,0],armP(GEOM.armHalfSpan),0.07,[0.58,0.61,0.63,1],"arm")}
 if(show("small"))for(const x of [-GEOM.armHalfSpan,GEOM.armHalfSpan]){const p=armP(x),ballY=GEOM.armY-GEOM.smallBallDrop,wireEnd=[p[0],ballY+GEOM.smallBallDiameter/2,p[2]];cylinder(p,wireEnd,0.10,[0.50,0.54,0.56,1],"small");obj("sphere",M4.mul(T(p[0],ballY,p[2]),S(GEOM.smallBallDiameter/2,GEOM.smallBallDiameter/2,GEOM.smallBallDiameter/2)),[0.28,0.30,0.31,1],"small")}
 // large ball assembly: positive / midway / negative. Midway coordinates and interpolation are explanatory reconstruction.
 const planar=largeBallPlanarCoordinates();
 const leftX=planar.left[0],leftZ=planar.left[1],rightX=planar.right[0],rightZ=planar.right[1];
 const pY=34,rY=pY-GEOM.largeOrbitRadius/Math.sqrt(3),bottomY=rY-GEOM.copperRodTotal,ballY=bottomY+GEOM.copperRodBallSegment/2;
 if(show("support")){
   const pJoint=[0,pY,0],rLeft=[leftX,rY,leftZ],rRight=[rightX,rY,rightZ];
   const supportMetal=[0.43,0.45,0.44,1],jointMetal=[0.48,0.39,0.24,1],copper=[0.50,0.34,0.20,1];

   // Fig.1 RrPrR: the two oblique members branch at P and terminate at r joints.
   cylinder(pJoint,rLeft,0.20,supportMetal,"support",false,"branchPrLeft");objects[objects.length-1].depthSide="left";
   cylinder(pJoint,rRight,0.20,supportMetal,"support",false,"branchPrRight");objects[objects.length-1].depthSide="right";
   for(const [rPoint,side] of [[rLeft,"left"],[rRight,"right"]]){
     obj("disc",M4.mul(T(...rPoint),S(.64,.16,.64)),jointMetal,"support",false,"jointR");objects[objects.length-1].depthSide=side;
     obj("sphere",M4.mul(T(...rPoint),S(.36,.36,.36)),[0.31,0.30,0.27,1],"support",false,"jointPinR");objects[objects.length-1].depthSide=side;
   }

   // rr is a single rigid wooden cross-bar between both r joints, not a round wire.
   boxBeam(rLeft,rRight,.48,.34,[0.47,0.34,0.19,1],"support","woodenBarRr");

   // Rr: paired vertical copper rods descend from the r joints to the large balls.
   cylinder(rLeft,[leftX,bottomY,leftZ],0.23,copper,"support",false,"copperRodRrLeft");objects[objects.length-1].depthSide="left";
   cylinder(rRight,[rightX,bottomY,rightZ],0.23,copper,"support",false,"copperRodRrRight");objects[objects.length-1].depthSide="right";
   obj("disc",M4.mul(T(leftX,bottomY,leftZ),S(.48,.15,.48)),jointMetal,"support",false,"lowerRodCollar");objects[objects.length-1].depthSide="left";
   obj("disc",M4.mul(T(rightX,bottomY,rightZ),S(.48,.15,.48)),jointMetal,"support",false,"lowerRodCollar");objects[objects.length-1].depthSide="right";
 }
 if(show("large")){
   obj("sphere",M4.mul(T(leftX,ballY,leftZ),S(GEOM.largeBallRadius,GEOM.largeBallRadius,GEOM.largeBallRadius)),[0.18,0.20,0.21,1],"large");objects[objects.length-1].depthSide="left";
   obj("sphere",M4.mul(T(rightX,ballY,rightZ),S(GEOM.largeBallRadius,GEOM.largeBallRadius,GEOM.largeBallRadius)),[0.18,0.20,0.21,1],"large");objects[objects.length-1].depthSide="right";
 }
 if(show("pulley")){
   const pinTop=45.0,pinBottom=34.0,pulleyY=40.15,pulleyR=11.75;
   // CV082A02R: keep geometry fixed and separate material values so MM reads as a pulley.
   const pinMetal=[0.36,0.39,0.40,1],rimMetal=[0.64,0.67,0.66,1],grooveMetal=[0.29,0.32,0.33,1];
   const guideMetal=[0.56,0.59,0.58,1],hardwareDark=[0.26,0.28,0.29,1],hubBrass=[0.72,0.56,0.30,1],cordBrown=[0.31,0.20,0.12,1];

   // Pp: one continuous vertical pin through p, the ceiling bearing, MM and the P hub.
   cylinder([0,pinTop,0],[0,pinBottom,0],0.18,pinMetal,"pulley",false,"centralPinPp");
   obj("disc",M4.mul(T(0,42.02,0),S(.72,.14,.72)),hubBrass,"pulley",false,"ceilingBearingPp");
   obj("disc",M4.mul(T(0,39.66,0),S(.74,.14,.74)),hubBrass,"pulley",false,"lowerBearingPp");

   // p: retaining plate and pin head above the top beam.
   obj("box",M4.mul(T(0,44.25,0),S(1.38,.12,.76)),hubBrass,"pulley",false,"retainingPlateP");
   obj("disc",M4.mul(T(0,44.55,0),S(.48,.18,.48)),hardwareDark,"pulley",false,"retainingHeadP");

   // MM: grooved horizontal pulley fixed concentrically to Pp. Two rims expose the Mm groove.
   obj("disc",M4.mul(T(0,pulleyY+.27,0),S(pulleyR,.12,pulleyR)),rimMetal,"pulley",false,"pulleyMMUpperRim");
   obj("disc",M4.mul(T(0,pulleyY-.27,0),S(pulleyR,.12,pulleyR)),rimMetal,"pulley",false,"pulleyMMLowerRim");
   obj("disc",M4.mul(T(0,pulleyY,0),S(pulleyR-.48,.18,pulleyR-.48)),grooveMetal,"pulley",false,"pulleyMMGrooveCore");
   obj("disc",M4.mul(T(0,pulleyY,0),S(1.12,.48,1.12)),hubBrass,"pulley",false,"pulleyMMHub");

   // Mm: operating cord passes through the wall guide, reaches MM tangentially,
   // and wraps in the groove in the same horizontal plane.
   cylinder([-56.2,pulleyY,-pulleyR],[0,pulleyY,-pulleyR],0.085,cordBrown,"pulley",false,"operatingCordMmTangent");
   cylinder([-51.2,pulleyY,-pulleyR],[-48.8,pulleyY,-pulleyR],0.31,hubBrass,"pulley",false,"cordWallGuideMm");
   let cordPrev=[0,pulleyY,-pulleyR];
   for(let j=1;j<=12;j++){
     const a=-Math.PI/2+j*Math.PI/12;
     const cordNext=[pulleyR*Math.cos(a),pulleyY,pulleyR*Math.sin(a)];
     cylinder(cordPrev,cordNext,0.085,cordBrown,"pulley",false,"operatingCordMmWrap");
     cordPrev=cordNext;
   }

   // Fig.1 outside operating end: a small guide wheel turns Mm downward to its hanging grip/weight.
   const guideX=-56.2,guideR=1.45,guideY=pulleyY-guideR,guideZ=-pulleyR;
   obj("disc",M4.mul(T(guideX,guideY,guideZ-.16),M4.mul(M4.rotX(Math.PI/2),S(guideR,.12,guideR))),guideMetal,"pulley",false,"cordGuideWheelMm");
   obj("disc",M4.mul(T(guideX,guideY,guideZ+.16),M4.mul(M4.rotX(Math.PI/2),S(guideR,.12,guideR))),guideMetal,"pulley",false,"cordGuideWheelMm");
   obj("disc",M4.mul(T(guideX,guideY,guideZ),M4.mul(M4.rotX(Math.PI/2),S(.52,.32,.52))),hubBrass,"pulley",false,"cordGuideHubMm");
   cylinder([-51.2,guideY,guideZ],[guideX,guideY,guideZ],.18,hubBrass,"pulley",false,"cordGuideBracketMm");
   let guideCord=[guideX,guideY+guideR,guideZ];
   for(let j=1;j<=6;j++){
     const a=Math.PI/2+j*Math.PI/12;
     const next=[guideX+guideR*Math.cos(a),guideY+guideR*Math.sin(a),guideZ];
     cylinder(guideCord,next,.085,cordBrown,"pulley",false,"operatingCordMmGuideWrap");
     guideCord=next;
   }
   const dropEnd=[guideX-guideR,29.6,guideZ];
   cylinder(guideCord,dropEnd,.085,cordBrown,"pulley",false,"operatingCordMmDrop");
   obj("box",M4.mul(T(dropEnd[0],28.75,dropEnd[2]),S(.52,.82,.52)),hubBrass,"pulley",false,"operatingWeightMm");
   obj("disc",M4.mul(T(dropEnd[0],27.88,dropEnd[2]),S(.62,.10,.62)),hardwareDark,"pulley",false,"operatingWeightFootMm");

   // P: lower hub of the same pin, with a collar that visibly receives both oblique supports.
   obj("disc",M4.mul(T(0,pinBottom+.24,0),S(.82,.24,.82)),hubBrass,"pulley",false,"branchHubPCollar");
   obj("sphere",M4.mul(T(0,pinBottom,0),S(.48,.48,.48)),hardwareDark,"pulley",false,"branchHubP")
 }
 if(show("support")||show("wire")){const fy=GEOM.armY+GEOM.torsionWireLength;cylinder([49,fy,0],[0,fy,0],0.34,[0.47,0.36,0.22,1],"support");obj("sphere",M4.mul(T(0,fy,0),S(.58,.58,.58)),[0.42,0.32,0.20,1],"support");obj("cyl",M4.mul(T(49,fy,0),M4.mul(M4.rotZ(Math.PI/2),S(1.0,.55,1.0))),[0.34,0.27,0.18,1],"support");}
 if(show("reader")){
   const wood=[0.48,0.35,0.20,1], brass=[0.63,0.48,0.22,1], scale=[0.83,0.81,0.70,1];
   for(const side of [-1,1]){
     const x=side*GEOM.readerRadius;
     // Fig.1 A-B-C-D reading case: open-front rectangular frame with stepped inner recess.
     obj("box",M4.mul(T(x,GEOM.armY-1.15,0),S(1.35,.22,1.25)),wood,"reader");
     obj("box",M4.mul(T(x,GEOM.armY+3.10,0),S(1.35,.22,1.25)),wood,"reader");
     obj("box",M4.mul(T(x-side*1.12,GEOM.armY+.98,0),S(.22,2.35,1.25)),wood,"reader");
     obj("box",M4.mul(T(x+side*1.12,GEOM.armY+.98,0),S(.22,2.35,1.25)),wood,"reader");
     obj("box",M4.mul(T(x,GEOM.armY+.95,-1.05),S(.90,1.70,.12)),[0.58,0.47,0.31,1],"reader");
     // Fixed scale h and moving index, with top/bottom supports and S fine screw.
     obj("box",M4.mul(T(x-side*.45,GEOM.armY+1.05,-1.28),S(.18,1.55,.10)),scale,"reader");
     for(let k=-5;k<=5;k++)obj("box",M4.mul(T(x-side*.66,GEOM.armY+1.05+k*.25,-1.40),S(.17,.025,.035)),[0.25,0.27,0.28,1],"reader");
     obj("box",M4.mul(T(x+side*.08,GEOM.armY+1.05,-1.40),S(.04,1.25,.04)),brass,"reader");
     cylinder([x+side*1.45,GEOM.armY+2.65,0],[x+side*1.45,GEOM.armY+4.05,0],.13,brass,"reader");
     obj("disc",M4.mul(T(x+side*1.45,GEOM.armY+4.18,0),S(.42,.12,.42)),brass,"reader");
   }
 }
 if(show("telescope")){
   const metal=[0.27,0.30,0.31,1], brass=[0.58,0.43,0.20,1];
   for(const side of [-1,1]){
     const y=GEOM.armY,z=0;
     // Wall aperture sleeve, long straight tube, objective collar and outer eyepiece.
     cylinder([side*50.8,y,z],[side*47.4,y,z],1.18,[0.44,0.36,0.24,1],"telescope");
     cylinder([side*49.8,y,z],[side*42.2,y,z],.63,metal,"telescope");
     cylinder([side*46.8,y,z],[side*44.8,y,z],.82,brass,"telescope");
     cylinder([side*42.6,y,z],[side*41.5,y,z],.86,brass,"telescope");
     cylinder([side*51.8,y,z],[side*49.7,y,z],.46,metal,"telescope");
     obj("disc",M4.mul(T(side*51.95,y,z),M4.mul(M4.rotZ(Math.PI/2),S(.62,.16,.62))),[0.18,0.20,0.21,1],"telescope");
     // Support board below tube as shown at T.
     obj("box",M4.mul(T(side*46.0,y-1.55,0),S(4.0,.22,1.15)),[0.50,0.42,0.29,1],"telescope");
   }
 }
 if(show("lamp")){
   const lit=lampIsLit(), brass=[0.58,0.42,0.18,1], dark=[0.30,0.25,0.18,1];
   for(const g of opticsGeometry()){
     const side=g.side,x=g.lamp[0],y=g.lamp[1],z=g.lamp[2];
     // Fig.1 lamp L: inclined support, enclosed lantern body, hood and short light tube.
     obj("box",M4.mul(T(x-side*1.0,y-2.25,z),M4.mul(M4.rotZ(side*.18),S(2.75,.24,1.45))),[0.48,0.39,0.26,1],"lamp");
     obj("box",M4.mul(T(x,y,z),S(1.35,2.25,1.35)),[0.62,0.54,0.37,.72],"lamp",true,"lampGlass");
     obj("disc",M4.mul(T(x,y-2.25,z),S(1.55,.18,1.55)),brass,"lamp");
     obj("disc",M4.mul(T(x,y+2.25,z),S(1.65,.20,1.65)),dark,"lamp");
     obj("disc",M4.mul(T(x,y+2.65,z),S(.75,.35,.75)),brass,"lamp");
     cylinder([x-side*.65,y-.45,z],[x-side*3.20,y-.45,z],.62,brass,"lamp");
     obj("sphere",M4.mul(T(...g.source),S(.72,.72,.72)),lit?[1.0,.72,.18,1]:[.68,.58,.39,1],"lamp",false,"lampLens",lit?1:.25);
     if(lit){
       obj("sphere",M4.mul(T(...g.source),S(1.55,1.55,1.55)),[1.0,.73,.20,.22],"opticsViz",true,"lampGlow",1);
       obj("sphere",M4.mul(T(...g.source),S(2.55,2.55,2.55)),[1.0,.76,.25,.08],"opticsViz",true,"lampGlowOuter",1);
     }
   }
 }
 addOpticsVisualization();
}

function runGeometrySelfAudit(){
 const endInnerWidth=(GEOM.caseOuterX-GEOM.caseThickness)-(GEOM.caseEndInnerWallX+GEOM.caseThickness);
 const endInnerHeight=(GEOM.caseFloorY-GEOM.caseThickness)-(GEOM.caseEndBottomY+GEOM.caseThickness);
 const smallBallY=GEOM.armY-GEOM.smallBallDrop;
 const endInnerBottom=GEOM.caseEndBottomY+GEOM.caseThickness;
 const endInnerTop=GEOM.caseFloorY-GEOM.caseThickness;
 const checks=[
  Math.abs(GEOM.armHalfSpan*2-73.3)<1e-9,
  Math.abs(GEOM.torsionWireLength-40)<1e-9,
  Math.abs(GEOM.smallBallDrop-5.5)<1e-9,
  Math.abs(GEOM.readerRadius-38.3)<1e-9,
  Math.abs(GEOM.largeOrbitRadius-36.65)<1e-9,
  Math.abs(GEOM.largeNearOffset-8.85)<1e-9,
  Math.abs(GEOM.copperRodBallSegment+GEOM.copperRodUpper-GEOM.copperRodTotal)<1e-9,
  Math.abs(GEOM.caseInnerX-3.5)<1e-9&&Math.abs(GEOM.caseInnerY-3.6)<1e-9&&Math.abs(GEOM.caseInnerZ-6.75)<1e-9,
  Math.abs(endInnerWidth-GEOM.caseInnerX)<1e-9&&Math.abs(endInnerHeight-GEOM.caseInnerY)<1e-9,
  smallBallY-GEOM.smallBallDiameter/2>endInnerBottom&&smallBallY+GEOM.smallBallDiameter/2<endInnerTop,
  Math.abs(GEOM.caseTowerTopY-(GEOM.armY+GEOM.torsionWireLength))<1e-9,
  GEOM.caseTowerTopHalfWidth<GEOM.caseTowerBaseHalfWidth,
  caseOuterProfile.length===8&&caseInnerProfile.length===8&&caseEndOuterLeft.length===4&&caseEndInnerLeft.length===4
 ];
 const ok=checks.every(Boolean),el=$("constraintStatus");
 if(el)el.textContent=ok?"主要確定値整合":"要再監査";
 return ok;
}

/* ---------- rendering ---------- */
function bindMesh(m){gl.bindBuffer(gl.ARRAY_BUFFER,m.pb);gl.enableVertexAttribArray(loc.pos);gl.vertexAttribPointer(loc.pos,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,m.nb);gl.enableVertexAttribArray(loc.nor);gl.vertexAttribPointer(loc.nor,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.ib)}
function drawObj(o,vp){
 bindMesh(o.mesh);const mvp=M4.mul(vp,o.model);gl.uniformMatrix4fv(loc.mvp,false,mvp);gl.uniformMatrix4fv(loc.model,false,o.model);
 let col=o.color.slice();
 if((o.part==="large"||o.part==="support")&&o.depthSide){
   const vz=M4.mul(currentView,o.model)[14];
   const span=Math.max(.001,depthRange.near-depthRange.far);
   const t=Math.max(0,Math.min(1,(vz-depthRange.far)/span));
   const haze=(1-t)*depthContrast;
   const farColor=[.66,.70,.72];
   col[0]=col[0]*(1-haze)+farColor[0]*haze;
   col[1]=col[1]*(1-haze)+farColor[1]*haze;
   col[2]=col[2]*(1-haze)+farColor[2]*haze;
 }
 if(isMobile&&mode==="optics"&&o.part!=="opticsViz"){
   const fade=o.part==="case"?.60:.78;
   col[0]=col[0]*fade+(1-fade)*.88;
   col[1]=col[1]*fade+(1-fade)*.90;
   col[2]=col[2]*fade+(1-fade)*.91;
   col[3]=Math.min(col[3],o.part==="case"?.24:.72);
 }
 if(o.part===selected){col[0]=Math.min(1,col[0]*1.18);col[1]=Math.min(1,col[1]*1.1)}
 gl.uniform4fv(loc.color,col);gl.uniform1f(loc.unlit,o.unlit|| (o.transparent?0.35:0));gl.drawElements(gl.TRIANGLES,o.mesh.count,gl.UNSIGNED_SHORT,0)
}
function resize(){const d=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect(),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h)}
function updateScaleBar(){
 const bar=$("scaleBar"),line=$("scaleBarLine"),label=$("scaleBarLabel");
 if(!bar||!line||!label)return;
 if(mode==="audit"){bar.hidden=true;return}
 bar.hidden=false;
 const rect=canvas.getBoundingClientRect(),cssH=Math.max(1,rect.height),cssW=Math.max(1,rect.width),aspectCss=cssW/cssH;
 let pixelsPerInch;
 if(ortho){
   const bounds=fixedView==="side"?[22,50]:fixedView==="top"?[54,22]:[54,50];
   const halfW=Math.max(bounds[0],bounds[1]*aspectCss)*(distance/125);
   pixelsPerInch=cssW/(2*halfW);
 }else pixelsPerInch=cssH/(2*distance*Math.tan(22.5*Math.PI/180));
 const candidates=[3,6,12,18,24,36,48,72],desired=96;
 let inches=candidates[0],best=Infinity;
 for(const c of candidates){const err=Math.abs(c*pixelsPerInch-desired);if(err<best){best=err;inches=c}}
 const width=clamp(inches*pixelsPerInch,52,145);
 line.style.width=width.toFixed(1)+"px";label.textContent=inches+" in";
 bar.setAttribute("aria-label","中央面基準の実寸スケール "+inches+"インチ");
}
function render(){
 resize();updateScaleBar();addScene();addCoordinateAuditScene();
 gl.clearColor(.965,.976,.98,1);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);
 const aspect=canvas.width/canvas.height;
 let target,eye,up=[0,1,0];
 if(fixedView==="front"){target=[panX,-2+panY,0];eye=[target[0],target[1],distance]}
 else if(fixedView==="side"){target=[0,-2+panY,panX];eye=[distance,target[1],target[2]]}
 else if(fixedView==="top"){target=[panX,-2,panY];eye=[target[0],distance,target[2]];up=[0,0,1]}
 else{target=[panX,panY,0];eye=[target[0]+distance*Math.sin(yaw)*Math.cos(pitch),target[1]+distance*Math.sin(pitch),target[2]+distance*Math.cos(yaw)*Math.cos(pitch)]}
 const view=M4.lookAt(eye,target,up);
 currentView=view;
 let proj;
 if(ortho){
  const zoom=distance/125,bounds=fixedView==="side"?[22,50]:fixedView==="top"?[54,22]:[54,50];
  const halfW=Math.max(bounds[0],bounds[1]*aspect)*zoom,halfH=halfW/aspect;
  proj=M4.ortho(-halfW,halfW,-halfH,halfH,.1,400);
 }else proj=M4.perspective(45*Math.PI/180,aspect,.1,400);
 const vp=M4.mul(proj,view);currentVP=vp;updateCoordinateOverlay();gl.uniform3fv(loc.light,new Float32Array([60,80,80]));
 const opaque=objects.filter(o=>!o.transparent);
 const transparentShell=objects.filter(o=>o.transparent&&o.kind==="caseShell");
 const transparentOther=objects.filter(o=>o.transparent&&o.kind!=="caseShell");

 const depthObjects=opaque.filter(o=>(o.part==="large"||o.part==="support")&&o.depthSide);
 const depthValues=depthObjects.map(o=>M4.mul(view,o.model)[14]);
 depthRange.near=depthValues.length?Math.max(...depthValues):0;
 depthRange.far=depthValues.length?Math.min(...depthValues):0;

 gl.disable(gl.BLEND);gl.depthMask(true);opaque.forEach(o=>drawObj(o,vp));

 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
 transparentOther.sort((a,b)=>M4.mul(view,a.model)[14]-M4.mul(view,b.model)[14]);
 gl.disable(gl.CULL_FACE);transparentOther.forEach(o=>drawObj(o,vp));

 gl.enable(gl.CULL_FACE);
 gl.cullFace(gl.FRONT);transparentShell.forEach(o=>drawObj(o,vp));
 gl.cullFace(gl.BACK);transparentShell.forEach(o=>drawObj(o,vp));

 gl.depthMask(true);gl.disable(gl.BLEND);
 requestAnimationFrame(render);
}

/* ---------- interaction ---------- */
canvas.addEventListener("pointerdown",e=>{
 canvas.setPointerCapture(e.pointerId);
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,shift:e.shiftKey});
 if(pointers.size===2){
   const ps=[...pointers.values()];
   lastPinch=Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y);
   lastMidpoint={x:(ps[0].x+ps[1].x)/2,y:(ps[0].y+ps[1].y)/2};
 }
});
canvas.addEventListener("pointermove",e=>{
 if(!pointers.has(e.pointerId))return;
 const prev=pointers.get(e.pointerId);
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,shift:e.shiftKey});
 if(pointers.size===1){
   const dx=e.clientX-prev.x,dy=e.clientY-prev.y;
   if(dx||dy)cameraUserAdjusted=true;
   if(fixedView!=="free"||e.shiftKey||prev.shift){
     setPan(panX-dx*distance*.0016,panY+dy*distance*.0016);
   }else{
     yaw+=dx*.008;
     pitch=clamp(pitch+dy*.008,-1.35,1.35);
   }
 }else if(pointers.size===2){
   const ps=[...pointers.values()];
   const d=Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y);
   const mid={x:(ps[0].x+ps[1].x)/2,y:(ps[0].y+ps[1].y)/2};
   if(Math.abs(d-lastPinch)>.01||(lastMidpoint&&(mid.x!==lastMidpoint.x||mid.y!==lastMidpoint.y)))cameraUserAdjusted=true;
   if(lastPinch){
     distance=clamp(distance*lastPinch/d,CAMERA_DISTANCE_MIN,CAMERA_DISTANCE_MAX);
   }
   if(lastMidpoint){
     const dx=mid.x-lastMidpoint.x,dy=mid.y-lastMidpoint.y;
     panX=clamp(panX-dx*distance*.0017,-35,35);
     panY=clamp(panY+dy*distance*.0017,-35,35);
   }
   lastPinch=d;lastMidpoint=mid;syncCameraControls();
 }
});
function releasePointer(e){
 pointers.delete(e.pointerId);
 if(pointers.size<2){lastPinch=0;lastMidpoint=null}
}
canvas.addEventListener("pointerup",releasePointer);
canvas.addEventListener("pointercancel",releasePointer);
canvas.addEventListener("wheel",e=>{
 e.preventDefault();
 cameraUserAdjusted=true;
 distance=clamp(distance*Math.exp(e.deltaY*.001),CAMERA_DISTANCE_MIN,CAMERA_DISTANCE_MAX);
 syncCameraControls();
},{passive:false});

if(mobileFitQuery.matches)applyMobileViewFit("initial");
selectPart("support");setPhase(0);setAudit();applyOpticsModeState();updateOpticsControls();syncCameraControls();populateCoordinateAudit();updateProjectionUI();runGeometrySelfAudit();syncBuildVersion();requestAnimationFrame(render);
})();
