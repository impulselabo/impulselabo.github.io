(() => {
"use strict";
const APP_VERSION = "IL278-3D-A01";
const $ = id => document.getElementById(id);

const canvas = $("viewer");
const gl = canvas.getContext("webgl", {alpha:false, antialias:true, depth:true, premultipliedAlpha:false});
if(!gl){
  canvas.outerHTML = '<div style="padding:30px">この端末ではWebGLを初期化できません。</div>';
  return;
}

/* ---------- math (Cavendish 3Dエンジンの汎用部分を踏襲) ---------- */
const M4 = {
  ident(){ return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); },
  mul(a,b){ const o=new Float32Array(16); for(let c=0;c<4;c++) for(let r=0;r<4;r++) o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3]; return o; },
  perspective(fovy,aspect,n,f){ const t=1/Math.tan(fovy/2),o=new Float32Array(16); o[0]=t/aspect;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f); return o; },
  translate(x,y,z){ const o=M4.ident(); o[12]=x;o[13]=y;o[14]=z; return o; },
  scale(x,y,z){ const o=M4.ident(); o[0]=x;o[5]=y;o[10]=z; return o; },
  rotX(a){ const c=Math.cos(a),s=Math.sin(a),o=M4.ident(); o[5]=c;o[6]=s;o[9]=-s;o[10]=c; return o; },
  rotY(a){ const c=Math.cos(a),s=Math.sin(a),o=M4.ident(); o[0]=c;o[2]=-s;o[8]=s;o[10]=c; return o; },
  rotZ(a){ const c=Math.cos(a),s=Math.sin(a),o=M4.ident(); o[0]=c;o[1]=s;o[4]=-s;o[5]=c; return o; },
  lookAt(e,c,u){
    let zx=e[0]-c[0],zy=e[1]-c[1],zz=e[2]-c[2];let zl=Math.hypot(zx,zy,zz);zx/=zl;zy/=zl;zz/=zl;
    let xx=u[1]*zz-u[2]*zy,xy=u[2]*zx-u[0]*zz,xz=u[0]*zy-u[1]*zx;let xl=Math.hypot(xx,xy,xz);xx/=xl;xy/=xl;xz/=xl;
    const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
    const o=M4.ident();o[0]=xx;o[1]=yx;o[2]=zx;o[4]=xy;o[5]=yy;o[6]=zy;o[8]=xz;o[9]=yz;o[10]=zz;
    o[12]=-(xx*e[0]+xy*e[1]+xz*e[2]);o[13]=-(yx*e[0]+yy*e[1]+yz*e[2]);o[14]=-(zx*e[0]+zy*e[1]+zz*e[2]);
    return o;
  }
};

/* ---------- shaders ---------- */
function shader(type,src){ const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
const prog = gl.createProgram();
gl.attachShader(prog, shader(gl.VERTEX_SHADER, `
attribute vec3 aPos;attribute vec3 aNor;
uniform mat4 uMVP;uniform mat4 uModel;
varying vec3 vNor;varying vec3 vPos;
void main(){vec4 wp=uModel*vec4(aPos,1.0);vPos=wp.xyz;vNor=mat3(uModel)*aNor;gl_Position=uMVP*vec4(aPos,1.0);}
`));
gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, `
precision mediump float;
uniform vec4 uColor;uniform vec3 uLight;uniform float uUnlit;uniform vec3 uEye;uniform float uShininess;
varying vec3 vNor;varying vec3 vPos;
void main(){
  vec3 n=normalize(vNor);
  vec3 l=normalize(uLight-vPos);
  vec3 v=normalize(uEye-vPos);
  vec3 h=normalize(l+v);
  float d=max(dot(n,l),0.0);
  float spec=uShininess>0.0 ? pow(max(dot(n,h),0.0), uShininess) * 0.55 : 0.0;
  float lit=mix(0.72+0.28*d, 1.0, uUnlit);
  vec3 col=uColor.rgb*lit + vec3(spec)*(1.0-uUnlit);
  gl_FragColor=vec4(col,uColor.a);
}
`));
gl.linkProgram(prog);
if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
gl.useProgram(prog);
const loc = {
  pos:gl.getAttribLocation(prog,"aPos"), nor:gl.getAttribLocation(prog,"aNor"),
  mvp:gl.getUniformLocation(prog,"uMVP"), model:gl.getUniformLocation(prog,"uModel"),
  color:gl.getUniformLocation(prog,"uColor"), light:gl.getUniformLocation(prog,"uLight"), unlit:gl.getUniformLocation(prog,"uUnlit"),
  eye:gl.getUniformLocation(prog,"uEye"), shininess:gl.getUniformLocation(prog,"uShininess")
};

/* ---------- mesh generators ---------- */
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
  ];faces.forEach(f=>{const b=p.length/3;for(let k=0;k<4;k++){p.push(...f[k]);n.push(...f[4])}i.push(b,b+1,b+2,b,b+2,b+3)});return makeMesh(p,n,i);
}
function sphereMesh(seg=24,rings=16){
  const p=[],n=[],i=[];for(let y=0;y<=rings;y++){const v=y/rings,ph=v*Math.PI;for(let x=0;x<=seg;x++){const u=x/seg,th=u*Math.PI*2;const nx=Math.sin(ph)*Math.cos(th),ny=Math.cos(ph),nz=Math.sin(ph)*Math.sin(th);p.push(nx,ny,nz);n.push(nx,ny,nz)}}
  for(let y=0;y<rings;y++)for(let x=0;x<seg;x++){const a=y*(seg+1)+x,b=a+seg+1;i.push(a,b,a+1,b,b+1,a+1)}return makeMesh(p,n,i);
}
function cappedCylinderMesh(seg=28){
  const p=[],n=[],i=[];
  for(let y=0;y<=1;y++)for(let s=0;s<=seg;s++){const a=s/seg*Math.PI*2,x=Math.cos(a),z=Math.sin(a);p.push(x,y*2-1,z);n.push(x,0,z);}
  for(let s=0;s<seg;s++){const a=s,b=a+seg+1;i.push(a,b,a+1,b,b+1,a+1);}
  let base=p.length/3;p.push(0,-1,0);n.push(0,-1,0);
  for(let s=0;s<=seg;s++){const a=s/seg*Math.PI*2;p.push(Math.cos(a),-1,Math.sin(a));n.push(0,-1,0);}
  for(let s=0;s<seg;s++)i.push(base,base+s+2,base+s+1);
  base=p.length/3;p.push(0,1,0);n.push(0,1,0);
  for(let s=0;s<=seg;s++){const a=s/seg*Math.PI*2;p.push(Math.cos(a),1,Math.sin(a));n.push(0,1,0);}
  for(let s=0;s<seg;s++)i.push(base,base+s+1,base+s+2);
  return makeMesh(p,n,i);
}
const MESH = { box:boxMesh(), sphere:sphereMesh(), cyl:cappedCylinderMesh() };

/* ---------- 素材ごとの色定義(凡例と対応) ---------- */
const MAT = {
  tungsten:  [0.33,0.34,0.37,1],
  aluminum:  [0.80,0.82,0.84,1],
  glass:     [0.85,0.92,0.97,1],
  instrument:[0.24,0.27,0.34,1],
  magnet:    [0.75,0.25,0.25,1],
  lightBeam: [0.95,0.85,0.25,0.55],
  thrustSource:[0.95,0.55,0.12,1]
};

/* ---------- geometry: シミュレータ現在値からの動的逆算(IL278 3D-C1) ---------- */
// 同一オリジンのlocalStorageを介して、微小推力測定シミュレータ本体が保存した
// 現在のk・c・I・L・材質・ワイヤー径を「読み込む」ボタンで取得できる。
// ただし既定の主導権はこのページ自身の入力欄にあり、ページを開いた時点では
// 常に標準基準値(k=2e-6, c=1e-5, L=1.0, I=1e-6, タングステン0.1mm)を表示する。
// これにより、シミュレータを触ったことがあるかどうかで最初に見える結果が
// 変わってしまう(同じURLなのに人によって違う数字が出る)ことを避ける。
const SHARED_DEVICE_PARAMS_KEY = "IL278_shared_device_params_v1";
const SHEAR_MODULUS_PA = { tungsten: 160e9, quartz: 30e9, nylon: 1.1e9 }; // IL278 標準仕様-D共通テーブルと同一値。全材質、実際にkの逆算に使われる。
function materialLabel(material){
  return {tungsten:"タングステン", quartz:"石英", nylon:"ナイロン"}[material] || material;
}
const RHO_ALUMINUM = 2.65e-8; // Ω·m(ダンパーパドル素材)
const DENSITY_ALUMINUM = 2700; // kg/m3(端部錘の球換算に使用)
const B0_REFERENCE_T = 0.15; // 遮蔽仕様 assumed_typical、ギャップ8mm基準
const DEFAULT_PARAMS = { stiffnessNmPerRad:2e-6, dampingNmsPerRad:1e-5, inertiaKgM2:1e-6, opticalDistanceM:1.0, material:"tungsten", wireDiameterMm:0.1 };

function loadSharedDeviceParams(){
  try{
    if(typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(SHARED_DEVICE_PARAMS_KEY);
    if(!raw) return null;
    const parsed = JSON.parse(raw);
    if(!Number.isFinite(parsed.stiffnessNmPerRad) || parsed.stiffnessNmPerRad<=0) return null;
    // このページは仮想トーションバランス(virtual-optical)専用。シミュレータが
    // キャベンディッシュモデルに切り替わっている場合は読み込み対象外とする。
    if(parsed.deviceModel && parsed.deviceModel!=="virtual-optical") return null;
    return parsed;
  }catch(_err){ return null; }
}

function deriveGeometry(params){
  const k = params.stiffnessNmPerRad;
  const c = params.dampingNmsPerRad;
  const I = params.inertiaKgM2;
  const L = params.opticalDistanceM;
  const material = params.material;
  const wireDiameterMm = params.wireDiameterMm;
  const d = wireDiameterMm/1000;

  const materialSupported = material in SHEAR_MODULUS_PA;
  const Gmod = SHEAR_MODULUS_PA[material] || SHEAR_MODULUS_PA.tungsten;
  // L_fiber = π G d^4 / (32 k)  (標準仕様 torsion_fiber.length_m の式)
  const fiberLength = Math.max(0.05, Math.min(5, Math.PI * Gmod * Math.pow(d,4) / (32*k)));

  const armHalfLength = 0.05; // 構造上の固定値(標準仕様)。I変化は端部錘の質量側に反映。
  const endMassKg = I / (2*armHalfLength*armHalfLength);
  const endMassRadius = Math.cbrt(3*Math.max(endMassKg,1e-9)/(4*Math.PI*DENSITY_ALUMINUM));

  // s^3 = 2(c/I)ρ/B0^2  (遮蔽仕様 damping.formula の逆算)
  const lambda = c/I;
  const paddleSide = Math.max(0.005, Math.min(0.2, Math.cbrt(2*lambda*RHO_ALUMINUM/(B0_REFERENCE_T*B0_REFERENCE_T))));

  const caseInnerY = fiberLength*0.605 + 0.05;
  const caseCenterY = fiberLength*0.407;

  return {
    fiberLength, fiberRadius:d/2, fiberVisualRadius:0.003,
    armHalfLength, armRadius:0.003, armVisualRadius:0.004,
    endMassRadius,
    mirrorSize:0.012,
    opticalDistance:L,
    paddleSide, paddleThickness:0.0015,
    paddleCenter:[armHalfLength,-0.02,0],
    gapRef:0.008, B0:B0_REFERENCE_T,
    caseInner:{x:0.15,y:caseInnerY,z:0.15},
    caseCenter:[0,caseCenterY,0],
    shieldThickness:{vibration:0.012, insulated:0.04, strongAdd:0.03, dark:0.003},
    _source:{material, materialSupported, k, c, I, L, wireDiameterMm}
  };
}

let G = deriveGeometry(DEFAULT_PARAMS);

/* ---------- damping paddle geometry constants (for c calculation) ---------- */
let PADDLE_AREA = G.paddleSide*G.paddleSide;
let PADDLE_PERIMETER = 4*G.paddleSide;
let INERTIA_KGM2 = G._source.I;

function computeDamping(gapMm){
  const gap = gapMm/1000;
  const B = G.B0 * Math.pow(G.gapRef/gap, 2);
  const lambda = 2*(PADDLE_AREA*PADDLE_AREA/PADDLE_PERIMETER)*(B*B/RHO_ALUMINUM);
  const c = INERTIA_KGM2 * lambda;
  return {B, c};
}
let REFERENCE_C = computeDamping(8).c; // 現在のcとの一致確認用(基準ギャップ8mmで一致するよう校正)

/* ---------- scene objects ---------- */
const objects = [];
function addObj(mesh, model, color, opts={}){
  objects.push(Object.assign({mesh, model, color, transparent:false, unlit:0, modes:["all"], part:"", shieldLevel:null}, opts));
}

// 6面パネル+4隅の稜線で「壁のある箱」を組み立てる共通ヘルパー。
// case_housing_baseと遮蔽層(standard/strong)の両方で使う。
function addPanelShell(cx,cy,cz, ex,ey,ez, wall, panelColor, frontColor, edgeColor, modes, part, shieldLevel){
  const opts = {modes, part, shieldLevel: shieldLevel||null};
  addObj(MESH.box, M4.mul(M4.translate(cx,cy+ey-wall/2,cz), M4.scale(ex,wall/2,ez)), panelColor, {...opts, transparent:true, unlit:0.9});
  addObj(MESH.box, M4.mul(M4.translate(cx,cy-ey+wall/2,cz), M4.scale(ex,wall/2,ez)), panelColor, {...opts, transparent:true, unlit:0.9});
  addObj(MESH.box, M4.mul(M4.translate(cx+ex-wall/2,cy,cz), M4.scale(wall/2,ey,ez)), panelColor, {...opts, transparent:true, unlit:0.9});
  addObj(MESH.box, M4.mul(M4.translate(cx-ex+wall/2,cy,cz), M4.scale(wall/2,ey,ez)), panelColor, {...opts, transparent:true, unlit:0.9});
  addObj(MESH.box, M4.mul(M4.translate(cx,cy,cz+ez-wall/2), M4.scale(ex,ey,wall/2)), panelColor, {...opts, transparent:true, unlit:0.9});
  addObj(MESH.box, M4.mul(M4.translate(cx,cy,cz-ez+wall/2), M4.scale(ex,ey,wall/2)), frontColor, {...opts, transparent:true, unlit:0.9});
  [[ex,ez],[ex,-ez],[-ex,ez],[-ex,-ez]].forEach(([px,pz])=>{
    const m = M4.mul(M4.translate(cx+px,cy,cz+pz), M4.scale(wall*0.45,ey,wall*0.45));
    addObj(MESH.cyl, m, edgeColor, {...opts, unlit:0.5});
  });
}

function buildStaticScene(){
  objects.length = 0;

  // トーションファイバー(タングステン、細い円柱)
  {
    const model = M4.mul(M4.translate(0, G.fiberLength/2, 0), M4.scale(G.fiberVisualRadius, G.fiberLength/2, G.fiberVisualRadius));
    addObj(MESH.cyl, model, MAT.tungsten, {modes:["all","transparent","inside","optics","audit"], part:"torsion_fiber", shininess:24});
  }
  // アーム(横棒)
  {
    const model = M4.mul(M4.rotZ(Math.PI/2), M4.scale(G.armVisualRadius, G.armHalfLength, G.armVisualRadius));
    addObj(MESH.cyl, model, MAT.aluminum, {modes:["all","transparent","inside","optics","audit"], part:"arm", shininess:32});
  }
  // アーム両端の錘(球)
  for(const side of [-1,1]){
    const model = M4.mul(M4.translate(side*G.armHalfLength, 0, 0), M4.scale(G.endMassRadius*10, G.endMassRadius*10, G.endMassRadius*10));
    addObj(MESH.sphere, model, MAT.aluminum, {modes:["all","transparent","inside","optics","audit"], part:"arm_end_mass", shininess:40});
  }
  // ミラー(アーム中心、光学読取面)
  {
    const model = M4.mul(M4.translate(0,0,0), M4.scale(G.mirrorSize, G.mirrorSize, 0.001));
    addObj(MESH.box, model, MAT.glass, {modes:["all","inside","optics","audit"], part:"mirror", unlit:0.2, shininess:80});
  }
  // 読取光学系: PSDリーダーヘッド(Z=-1.0m)。本体+レンズ筒(ミラー側へ突き出す)+
  // 支持脚(床面相当のY位置まで伸ばす)で、単なる浮いた箱ではなく「据え付けられた
  // 測定器」であることが分かるようにする。
  {
    const headZ = -G.opticalDistance;
    const bodyHalf = 0.022;
    const bodyModel = M4.mul(M4.translate(0,0,headZ), M4.scale(bodyHalf,bodyHalf,bodyHalf*1.3));
    addObj(MESH.box, bodyModel, MAT.instrument, {modes:["all","optics","audit"], part:"reader_head_psd", unlit:0.55, shininess:10});
    // レンズ筒(ミラー方向=+Zへ突き出す小円柱)
    const lensLen = 0.014;
    const lensModel = M4.mul(M4.translate(0,0,headZ+bodyHalf*1.3+lensLen/2), M4.mul(M4.rotX(Math.PI/2), M4.scale(0.008,lensLen/2,0.008)));
    addObj(MESH.cyl, lensModel, MAT.glass, {modes:["all","optics","audit"], part:"reader_head_psd", unlit:0.2, shininess:60});
    // 支持脚(本体下端から、装置の土台面相当のYまで)
    const legBottomY = -0.06;
    const legTopY = -bodyHalf;
    const legModel = M4.mul(M4.translate(0,(legTopY+legBottomY)/2,headZ), M4.scale(0.004,(legTopY-legBottomY)/2,0.004));
    addObj(MESH.cyl, legModel, MAT.instrument, {modes:["all","optics","audit"], part:"reader_head_psd", unlit:0.4});
    const baseModel = M4.mul(M4.translate(0,legBottomY,headZ), M4.scale(0.02,0.003,0.02));
    addObj(MESH.cyl, baseModel, MAT.instrument, {modes:["all","optics","audit"], part:"reader_head_psd", unlit:0.4});
  }
  {
    const model = M4.mul(M4.translate(0,0,-G.opticalDistance/2), M4.scale(0.002, 0.002, G.opticalDistance/2));
    addObj(MESH.box, model, MAT.lightBeam, {modes:["all","optics"], part:"optical_path", transparent:true, unlit:0.9});
  }
  // 渦電流ダンパー: パドル
  {
    const model = M4.mul(M4.translate(...G.paddleCenter), M4.scale(G.paddleSide/2, G.paddleSide/2, G.paddleThickness/2));
    addObj(MESH.box, model, MAT.aluminum, {modes:["all","transparent","inside"], part:"damping_paddle", shininess:28});
  }
  // 渦電流ダンパー: 磁石(左右)、ギャップに応じてZ位置を後で更新
  buildMagnets(8);

  // 被検証推力源マウント(アーム左端の錘の真上、ダンパーと反対側)。
  // このシミュレータは特定の推進方式を前提とせず、「未確認の推力主張を
  // 客観的に測定する」というTajmar SpaceDrive Projectと同じ目的の装置(標準仕様
  // known_precedents参照)。入力トルクτはここに搭載される候補推力源が
  // アームに及ぼす力として扱う。錘の真上に垂直なポストで持ち上げて配置することで、
  // 錘やアームと重ならず、はっきり分離して見えるようにしている。
  {
    const mountX = -G.armHalfLength;
    const sphereTop = G.endMassRadius*10; // 錘の球体表示半径(上端)
    const postBottom = sphereTop + 0.001;
    const postTop = 0.050;
    const postModel = M4.mul(M4.translate(mountX, (postBottom+postTop)/2, 0), M4.scale(0.0015, (postTop-postBottom)/2, 0.0015));
    addObj(MESH.cyl, postModel, MAT.instrument, {modes:["all","transparent","inside"], part:"thrust_source_mount", unlit:0.4});
    const boxHalf = 0.010;
    const boxCenterY = postTop + boxHalf;
    const model = M4.mul(M4.translate(mountX, boxCenterY, 0), M4.scale(boxHalf,boxHalf,boxHalf));
    addObj(MESH.box, model, MAT.thrustSource, {modes:["all","transparent","inside"], part:"thrust_source_mount", unlit:0.3});
  }

  // ケース外装(基本ハウジング、機構を収める最小限のケース)。「全体」表示でのみ、
  // 6面のパネル(実際の壁厚み10mm)を個別に配置し、単なる透明な直方体ではなく
  // 「壁で囲まれた箱」であることが分かるようにする。前面パネルは中がうっすら
  // 見えるよう透過度を高め、他の面は少し不透明にして立体感を出す。遮蔽レベルの
  // 3層構造は「ケース透明」モード(buildShieldLayers)で別途、より詳細に表示する。
  {
    const cx=G.caseCenter[0], cy=G.caseCenter[1], cz=G.caseCenter[2];
    addPanelShell(cx,cy,cz, G.caseInner.x,G.caseInner.y,G.caseInner.z, 0.010,
      [0.80,0.84,0.87,0.16], [0.80,0.84,0.87,0.07], [0.55,0.60,0.64,0.9],
      ["all"], "case_housing_base", null);
  }

  // 遮蔽層(3層、ケース透明モードのみ)
  buildShieldLayers();
}

let magnetObjs = [];
function buildMagnets(gapMm){
  if(magnetObjs.length){
    const remaining = objects.filter(o=>!magnetObjs.includes(o));
    objects.length = 0;
    objects.push(...remaining);
  }
  magnetObjs = [];
  const gap = gapMm/1000;
  for(const side of [-1,1]){
    const z = side*(G.paddleThickness/2 + gap/2 + 0.004);
    const model = M4.mul(M4.translate(G.paddleCenter[0], G.paddleCenter[1], z), M4.scale(0.01,0.01,0.004));
    const obj = {mesh:MESH.box, model, color:MAT.magnet, transparent:false, unlit:0.3, shininess:18, modes:["all","transparent","inside"], part:"damping_magnet", shieldLevel:null};
    objects.push(obj);
    magnetObjs.push(obj);
  }
}

let shieldObjs = [];
function buildShieldLayers(){
  if(shieldObjs.length){
    const remaining = objects.filter(o=>!shieldObjs.includes(o));
    objects.length = 0;
    objects.push(...remaining);
  }
  shieldObjs = [];
  const before = objects.length;
  const cx=G.caseCenter[0], cy=G.caseCenter[1], cz=G.caseCenter[2];
  // weak: 制振マウント(ケース底面の足回りのみ、箱ではないので従来通り単純な板)
  {
    const ex=G.caseInner.x+G.shieldThickness.vibration, ez=G.caseInner.z+G.shieldThickness.vibration;
    const model = M4.mul(M4.translate(cx,-0.006,cz), M4.scale(ex,0.006,ez));
    const obj = {mesh:MESH.box, model, color:[0.35,0.55,0.35,0.35], transparent:true, unlit:0.4, modes:["transparent"], part:"shield_vibration_mount", shieldLevel:"weak"};
    objects.push(obj);
  }
  // standard: 断熱箱(6面パネル)
  {
    const ex=G.caseInner.x+G.shieldThickness.insulated, ey=G.caseInner.y+G.shieldThickness.insulated, ez=G.caseInner.z+G.shieldThickness.insulated;
    addPanelShell(cx,cy,cz, ex,ey,ez, G.shieldThickness.insulated,
      [0.60,0.47,0.27,0.30], [0.60,0.47,0.27,0.14], [0.42,0.32,0.16,0.85],
      ["transparent"], "shield_insulated_box", "standard");
  }
  // strong: 二重壁+暗箱(standardのさらに外側、6面パネル)
  {
    const ex=G.caseInner.x+G.shieldThickness.insulated+G.shieldThickness.strongAdd;
    const ey=G.caseInner.y+G.shieldThickness.insulated+G.shieldThickness.strongAdd;
    const ez=G.caseInner.z+G.shieldThickness.insulated+G.shieldThickness.strongAdd;
    addPanelShell(cx,cy,cz, ex,ey,ez, G.shieldThickness.strongAdd,
      [0.15,0.15,0.18,0.28], [0.15,0.15,0.18,0.12], [0.08,0.08,0.10,0.9],
      ["transparent"], "shield_double_wall_dark_enclosure", "strong");
  }
  shieldObjs = objects.slice(before);
}

buildStaticScene();

/* ---------- state ---------- */
let mode = "all";
let shieldLevel = "none";
let gapMm = 8;
let selected = null;
let yaw=0.5, pitch=0.28, distance=1.35, panX=0, panY=0.35, panZ=0;
let dragging=false, lastX=0, lastY=0, pinchDist=0;

const shieldOrder = ["none","weak","standard","strong"];
function shieldLevelIndex(level){ return shieldOrder.indexOf(level); }

function visible(o){
  if(!o.modes.includes(mode)) return false;
  if(o.shieldLevel){
    if(mode!=="transparent") return false;
    const need = shieldLevelIndex(o.shieldLevel);
    const cur = shieldLevelIndex(shieldLevel);
    return cur>=need && need>0;
  }
  return true;
}

/* ---------- render ---------- */
function drawObj(o, vp){
  gl.bindBuffer(gl.ARRAY_BUFFER,o.mesh.pb);gl.vertexAttribPointer(loc.pos,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(loc.pos);
  gl.bindBuffer(gl.ARRAY_BUFFER,o.mesh.nb);gl.vertexAttribPointer(loc.nor,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(loc.nor);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.mesh.ib);
  const mvp = M4.mul(vp,o.model);
  gl.uniformMatrix4fv(loc.mvp,false,mvp);gl.uniformMatrix4fv(loc.model,false,o.model);
  const col = o.color.slice();
  if(o.part===selected){ col[0]=Math.min(1,col[0]*1.25+0.08); col[1]=Math.min(1,col[1]*1.1); }
  gl.uniform4fv(loc.color,new Float32Array(col));gl.uniform1f(loc.unlit,o.unlit||0);
  gl.uniform1f(loc.shininess,o.shininess||0);
  gl.drawElements(gl.TRIANGLES,o.mesh.count,gl.UNSIGNED_SHORT,0);
}
function resize(){
  const d=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect();
  const w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  gl.viewport(0,0,w,h);
}
function render(){
  resize();
  gl.clearColor(.965,.976,.98,1);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);
  const aspect = canvas.width/canvas.height;
  const target=[panX,panY,panZ];
  const eye=[target[0]+distance*Math.sin(yaw)*Math.cos(pitch), target[1]+distance*Math.sin(pitch), target[2]+distance*Math.cos(yaw)*Math.cos(pitch)];
  const view = M4.lookAt(eye,target,[0,1,0]);
  const proj = M4.perspective(45*Math.PI/180, aspect, .01, 20);
  const vp = M4.mul(proj,view);
  gl.uniform3fv(loc.light,new Float32Array([0.6,0.9,0.6]));
  gl.uniform3fv(loc.eye,new Float32Array(eye));

  const visList = objects.filter(visible);
  const opaque = visList.filter(o=>!o.transparent);
  const transparent = visList.filter(o=>o.transparent);

  gl.disable(gl.BLEND);gl.depthMask(true);
  opaque.forEach(o=>drawObj(o,vp));

  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
  gl.disable(gl.CULL_FACE);
  transparent.sort((a,b)=>M4.mul(view,a.model)[14]-M4.mul(view,b.model)[14]);
  transparent.forEach(o=>drawObj(o,vp));
  gl.enable(gl.CULL_FACE);gl.depthMask(true);gl.disable(gl.BLEND);

  updateCoordinateOverlay();
  requestAnimationFrame(render);
}

/* ---------- coordinate / label overlay ---------- */
function project(p, vp){
  const x=p[0]*vp[0]+p[1]*vp[4]+p[2]*vp[8]+vp[12];
  const y=p[0]*vp[1]+p[1]*vp[5]+p[2]*vp[9]+vp[13];
  const w=p[0]*vp[3]+p[1]*vp[7]+p[2]*vp[11]+vp[15];
  return [x/w, y/w];
}
const auditPoints = [
  {label:"C(原点)", pos:[0,0,0]},
  {label:"ファイバー上端", pos:[0,0.785,0]},
  {label:"アーム左端", pos:[-0.05,0,0]},
  {label:"アーム右端", pos:[0.05,0,0]},
  {label:"PSDリーダー", pos:[0,0,-1.0]}
];
const thrustSourcePoint = {label:"τ 被検証推力源", pos:[-0.05, 0.076, 0], cls:"thrust-tag"};
const thetaPoint = {label:"θ 捩れ角(光学検出)", pos:[0, 0.006, 0], cls:"theta-tag"};
function updateCoordinateOverlay(){
  const overlay = $("coordinateOverlay");
  if(!overlay) return;
  const showAudit = mode==="audit";
  const showPrincipleLabels = mode==="all" || mode==="inside" || mode==="transparent" || mode==="optics";
  overlay.hidden = !(showAudit || showPrincipleLabels);
  if(overlay.hidden) return;
  let points;
  if(showAudit) points = auditPoints;
  else if(mode==="optics") points = [thetaPoint];
  else points = [thrustSourcePoint, thetaPoint];
  const aspect = canvas.width/canvas.height;
  const target=[panX,panY,panZ];
  const eye=[target[0]+distance*Math.sin(yaw)*Math.cos(pitch), target[1]+distance*Math.sin(pitch), target[2]+distance*Math.cos(yaw)*Math.cos(pitch)];
  const view = M4.lookAt(eye,target,[0,1,0]);
  const proj = M4.perspective(45*Math.PI/180, aspect, .01, 20);
  const vp = M4.mul(proj,view);
  const rect = canvas.getBoundingClientRect();
  overlay.innerHTML = "";
  points.forEach(pt=>{
    const [nx,ny] = project(pt.pos, vp);
    if(Math.abs(nx)>1.3||Math.abs(ny)>1.3) return;
    const el = document.createElement("div");
    el.className = "coord-tag "+(showAudit ? "confirmed" : (pt.cls||"thrust-tag"));
    el.style.position="absolute";
    el.style.left = ((nx*0.5+0.5)*rect.width)+"px";
    el.style.top = ((1-(ny*0.5+0.5))*rect.height)+"px";
    el.textContent = pt.label;
    overlay.appendChild(el);
  });
}

/* ---------- 部品リスト(クリックで詳細・ハイライト) ---------- */
const parts = {
  torsion_fiber:{name:"トーションファイバー", symbol:"gl", value:"0.785 m・タングステン・径0.1mm", basis:"標準仕様逆算(k=2e-6 N·m/rad)", coord:"C→[0,0.785,0]", mode:"inside"},
  arm:{name:"水平アーム", symbol:"—", value:"全長0.100 m", basis:"標準仕様(I=2mr²)", coord:"[-0.05,0,0]〜[0.05,0,0]", mode:"inside"},
  arm_end_mass:{name:"アーム端の錘", symbol:"×2", value:"0.2 g・アルミ球換算径5.2mm", basis:"標準基準値からの逆算", coord:"[±0.05,0,0]", mode:"inside"},
  mirror:{name:"読取ミラー", symbol:"θ", value:"12mm角(説明用)、捩れ角θをここで光学検出", basis:"寸法は説明用配置", coord:"C=[0,0,0]", mode:"optics"},
  reader_head_psd:{name:"PSDリーダーヘッド", symbol:"—", value:"光学距離1.0mの位置に設置", basis:"UI確定値(光学距離L)", coord:"[0,0,-1.0]", mode:"optics"},
  optical_path:{name:"光路(ミラー⇄リーダー)", symbol:"—", value:"往復光路、L=1.0m", basis:"UI確定値", coord:"Z軸上", mode:"optics"},
  damping_paddle:{name:"渦電流ダンパー・パドル", symbol:"—", value:"29mm角・アルミ・厚1.5mm", basis:"標準仕様逆算(c=1.00e-5 N·m·s/rad)", coord:"[0.05,-0.02,0]", mode:"inside"},
  damping_magnet:{name:"ダンパー用磁石", symbol:"×2", value:"ギャップ可変(4〜40mm)", basis:"B(gap)=B0×(gap_ref/gap)²", coord:"パドル両側", mode:"inside"},
  thrust_source_mount:{name:"被検証推力源マウント", symbol:"τ", value:"入力トルクτの発生源(方式未特定)", basis:"Tajmar SpaceDrive Projectと同一目的(known_precedents)", coord:"[-0.05,0.060,0](錘の真上)", mode:"inside"},
  case_housing_base:{name:"ケース外装(基本)", symbol:"—", value:"内寸0.3×0.95×0.3 m", basis:"説明用レイアウト(実測根拠なし)", coord:"中心[0,0.32,0]", mode:"all"},
  shield_vibration_mount:{name:"遮蔽層1: 制振マウント", symbol:"weak〜", value:"Sorbothane 12mm", basis:"実例(Rev.Sci.Instrum. 93,074502)", coord:"ケース最外底面", mode:"transparent"},
  shield_insulated_box:{name:"遮蔽層2: 断熱箱", symbol:"standard〜", value:"40mmサンドイッチ", basis:"実例(arXiv:0805.1183)", coord:"ケース壁全面", mode:"transparent"},
  shield_double_wall_dark_enclosure:{name:"遮蔽層3: 二重壁+暗箱", symbol:"strongのみ", value:"+30mm、内壁遮光3mm", basis:"実例(arXiv:2405.10982)", coord:"標準層のさらに外側", mode:"transparent"}
};
const partOrder = ["torsion_fiber","arm","arm_end_mass","damping_paddle","damping_magnet","thrust_source_mount","mirror","reader_head_psd","optical_path","case_housing_base","shield_vibration_mount","shield_insulated_box","shield_double_wall_dark_enclosure"];
function selectPart(key){
  selected = key;
  if(parts[key].mode==="transparent" && shieldLevel==="none"){ shieldLevel="weak"; const btn=document.querySelector('[data-shield="weak"]'); if(btn){document.querySelectorAll("[data-shield]").forEach(x=>x.classList.toggle("active",x===btn));$("shieldStatus").textContent=btn.textContent;$("shieldLevelNote").textContent=shieldNotes.weak;} }
  applyMode(parts[key].mode);
  document.querySelectorAll(".part").forEach(b=>b.classList.toggle("active", b.dataset.part===key));
  const p = parts[key];
  $("partTitle").textContent = p.name;
  $("partRole").textContent = p.name+"の詳細です。3D表示では該当パーツを明るくハイライトしています。";
  $("partId").textContent = p.name+(p.symbol!=="—"?"("+p.symbol+")":"");
  $("partValue").textContent = p.value;
  $("partBasis").textContent = p.basis;
  $("partCoord").textContent = p.coord;
}

/* ---------- applyMode ---------- */
const modeTitles = {
  all:"全体表示", transparent:"ケース透明(遮蔽構造)", inside:"ねじり天秤",
  optics:"読取光学系", audit:"XYZ座標監査"
};
const modeFacts = {
  all:{id:"装置全体", value:"ファイバー0.785m／アーム0.1m／L=1.0m", basis:"標準装置仕様と遮蔽仕様の統合", coord:"C=[0,0,0]原点"},
  transparent:{id:"遮蔽構造(3層)", value:"制振12mm／断熱40mm／強化+30mm+暗箱3mm", basis:"実例文献のorder-of-magnitude採用", coord:"ケース中心を原点近傍に配置(説明用)"},
  inside:{id:"ねじり天秤", value:"タングステン線0.785m・アーム両端0.2g", basis:"標準装置仕様からの逆算", coord:"アーム端=[±0.05,0,0]"},
  optics:{id:"読取光学系", value:"ミラー(アーム中心)→PSD、距離1.0m", basis:"UI確定値(光学距離L)", coord:"PSD=[0,0,-1.0]"},
  audit:{id:"座標監査", value:"主要5点のワールド座標をラベル表示", basis:"IL-VIRTUAL-TORSION-GEOMETRY.json", coord:"C原点基準"}
};
const cameraPresets = {
  all:        {panX:0, panY:0.35, panZ:0,    distance:1.35, pitch:0.28, yaw:0.5},
  transparent:{panX:0, panY:0.35, panZ:0,    distance:1.55, pitch:0.24, yaw:0.5},
  inside:     {panX:0, panY:0.02, panZ:0,    distance:0.34, pitch:0.20, yaw:0.55},
  optics:     {panX:0, panY:0.0,  panZ:-0.5, distance:0.85, pitch:0.10, yaw:0.05},
  audit:      {panX:0, panY:0.35, panZ:0,    distance:1.3,  pitch:0.26, yaw:0.45}
};
function applyMode(next){
  mode = next;
  document.querySelectorAll(".mode").forEach(b=>{
    const active = b.dataset.mode===mode;
    b.classList.toggle("active",active);
    b.setAttribute("aria-pressed",String(active));
  });
  $("viewTitle").textContent = modeTitles[mode]||mode;
  const f = modeFacts[mode];
  if(f){ $("partId").textContent=f.id; $("partValue").textContent=f.value; $("partBasis").textContent=f.basis; $("partCoord").textContent=f.coord; }
  const isAudit = mode==="audit";
  $("axisLegend").hidden = !isAudit;
  $("projectionStatus").hidden = !isAudit;
  document.querySelector(".shielding-controls").style.display = mode==="transparent" ? "" : "none";
  const cam = cameraPresets[mode];
  if(cam){ panX=cam.panX; panY=cam.panY; panZ=cam.panZ; distance=cam.distance; pitch=cam.pitch; yaw=cam.yaw; }
}
document.querySelectorAll(".mode").forEach(b=>b.addEventListener("click",()=>{ selected=null; document.querySelectorAll(".part").forEach(p=>p.classList.remove("active")); applyMode(b.dataset.mode); }));

const shieldNotes = {
  none:"なし：ケース内の機構がそのまま見えます。",
  weak:"弱：制振マウント(Sorbothane)のみ表示。現行6ノイズ成分への低減効果はありません。",
  standard:"標準：制振マウント+断熱箱を表示。drift成分を約1/10に低減します。",
  strong:"強：制振マウント+断熱箱+二重壁・暗箱を表示。driftを約1/33、opticalを半分に低減します。"
};
document.querySelectorAll("[data-shield]").forEach(b=>b.addEventListener("click",()=>{
  shieldLevel = b.dataset.shield;
  document.querySelectorAll("[data-shield]").forEach(x=>x.classList.toggle("active",x===b));
  $("shieldStatus").textContent = b.textContent;
  $("shieldLevelNote").textContent = shieldNotes[shieldLevel]||"";
}));

function updateDampingDisplay(){
  const {B,c} = computeDamping(gapMm);
  $("gapValue").textContent = gapMm.toFixed(1)+" mm";
  $("gapStatus").textContent = gapMm.toFixed(1)+" mm";
  $("dampingBValue").textContent = B.toFixed(3)+" T";
  $("dampingCValue").textContent = c.toExponential(2)+" N·m·s/rad";
  $("dampingRatioValue").textContent = "×"+(c/REFERENCE_C).toFixed(2);
  buildMagnets(gapMm);
}

function updateSyncStatus(){
  const el = $("syncStatus");
  const src = G._source;
  $("statusFiberLength").textContent = G.fiberLength.toFixed(3)+" m";
  $("statusArmLength").textContent = (G.armHalfLength*2).toFixed(3)+" m";
  $("statusOpticalDistance").textContent = G.opticalDistance.toFixed(3)+" m";
  $("tblFiberLength").textContent = G.fiberLength.toFixed(3)+" m";
  $("tblFiberLengthBasis").textContent = `左の装置パラメータ(k=${src.k.toExponential(2)} N·m/rad)からの逆算`;
  $("tblWireDiameter").textContent = src.wireDiameterMm.toFixed(3)+" mm";
  $("tblMaterial").textContent = src.materialSupported ? materialLabel(src.material) : `${src.material}(物性未実装、タングステン近似)`;
  $("tblOpticalDistance").textContent = G.opticalDistance.toFixed(3)+" m";
  const endMassG = (4/3*Math.PI*Math.pow(G.endMassRadius,3)*DENSITY_ALUMINUM*1000);
  $("tblEndMass").textContent = endMassG.toFixed(2)+" g×2";
  $("tblPaddleSide").textContent = (G.paddleSide*1000).toFixed(1)+" mm角・アルミ";
  if(!el) return;
  const matNote = src.materialSupported
    ? ""
    : `　※材質「${src.material}」の物性は未実装のためタングステン値で近似表示しています`;
  el.textContent = `現在の装置パラメータ：k=${src.k.toExponential(2)} N·m/rad, c=${src.c.toExponential(2)} N·m·s/rad, I=${src.I.toExponential(2)} kg·m², L=${src.L} m${matNote}`;
  el.className = "audit-help sync-status " + (src.materialSupported ? "sync-live" : "sync-warning");
}

/* ---------- 装置パラメータ入力欄(このページ単体で結果が完結する主導線) ---------- */
function readParamInputs(){
  const num = (id, fallback)=>{
    const v = parseFloat($(id).value);
    return Number.isFinite(v) && v>0 ? v : fallback;
  };
  return {
    stiffnessNmPerRad: num("paramK", DEFAULT_PARAMS.stiffnessNmPerRad),
    dampingNmsPerRad: num("paramC", DEFAULT_PARAMS.dampingNmsPerRad),
    inertiaKgM2: num("paramI", DEFAULT_PARAMS.inertiaKgM2),
    opticalDistanceM: num("paramL", DEFAULT_PARAMS.opticalDistanceM),
    material: $("paramMaterial").value || "tungsten",
    wireDiameterMm: num("paramWire", DEFAULT_PARAMS.wireDiameterMm)
  };
}
function writeParamInputs(p){
  $("paramK").value = p.stiffnessNmPerRad;
  $("paramC").value = p.dampingNmsPerRad;
  $("paramI").value = p.inertiaKgM2;
  $("paramL").value = p.opticalDistanceM;
  $("paramWire").value = p.wireDiameterMm;
  $("paramMaterial").value = p.material;
}
function rebuildFromParams(){
  G = deriveGeometry(readParamInputs());
  PADDLE_AREA = G.paddleSide*G.paddleSide;
  PADDLE_PERIMETER = 4*G.paddleSide;
  INERTIA_KGM2 = G._source.I;
  REFERENCE_C = computeDamping(8).c;
  buildStaticScene();
  updateDampingDisplay();
  updateSyncStatus();
  applyMode(mode); // 寸法が変わるためカメラも現在モードのプリセットへ再フレーミング
}
document.querySelectorAll("#paramK,#paramC,#paramI,#paramL,#paramWire").forEach(el=>{
  el.addEventListener("change", rebuildFromParams);
});
$("paramMaterial").addEventListener("change", rebuildFromParams);
$("paramReset").addEventListener("click", ()=>{
  writeParamInputs(DEFAULT_PARAMS);
  rebuildFromParams();
  $("paramPullStatus").textContent = "";
});
$("paramPull").addEventListener("click", ()=>{
  const shared = loadSharedDeviceParams();
  if(!shared){
    $("paramPullStatus").textContent = "見つかりませんでした(このブラウザでシミュレータをまだ開いていないか、シミュレータがキャベンディッシュモデルになっている可能性があります)。";
    $("paramPullStatus").className = "audit-help sync-warning";
    return;
  }
  writeParamInputs({
    stiffnessNmPerRad: shared.stiffnessNmPerRad,
    dampingNmsPerRad: shared.dampingNmsPerRad,
    inertiaKgM2: shared.inertiaKgM2,
    opticalDistanceM: shared.opticalDistanceM,
    material: shared.material,
    wireDiameterMm: shared.wireDiameterMm
  });
  rebuildFromParams();
  if(shared.shieldingMaster==="on" && shieldOrder.includes(shared.shieldingPreset) && shared.shieldingPreset!=="none"){
    const btn = document.querySelector(`[data-shield="${shared.shieldingPreset}"]`);
    if(btn) btn.click();
  }
  $("paramPullStatus").textContent = `読み込みました(保存日時: ${new Date(shared.savedAt).toLocaleString("ja-JP")})`;
  $("paramPullStatus").className = "audit-help sync-live";
});
$("gapSlider").addEventListener("input", e=>{
  gapMm = Number(e.target.value);
  updateDampingDisplay();
});

$("resetView").addEventListener("click", ()=>{ const cam=cameraPresets[mode]; if(cam){ panX=cam.panX;panY=cam.panY;panZ=cam.panZ;distance=cam.distance;pitch=cam.pitch;yaw=cam.yaw; } });

/* ---------- pointer camera controls ---------- */
canvas.addEventListener("pointerdown", e=>{
  canvas.setPointerCapture(e.pointerId);
  dragging=true; lastX=e.clientX; lastY=e.clientY;
});
canvas.addEventListener("pointermove", e=>{
  if(!dragging) return;
  const dx=e.clientX-lastX, dy=e.clientY-lastY; lastX=e.clientX; lastY=e.clientY;
  yaw -= dx*0.006; pitch = Math.max(-1.4,Math.min(1.4,pitch - dy*0.006));
});
canvas.addEventListener("pointerup", e=>{ dragging=false; try{canvas.releasePointerCapture(e.pointerId);}catch(_){} });
canvas.addEventListener("pointercancel", ()=>{ dragging=false; });
canvas.addEventListener("wheel", e=>{
  e.preventDefault();
  distance = Math.max(0.15, Math.min(3, distance * (1 + e.deltaY*0.001)));
}, {passive:false});

/* pinch-zoom (2本指) */
let pinchStartDist=0, pinchStartDistance=0;
canvas.addEventListener("touchstart", e=>{
  if(e.touches.length===2){
    const [a,b]=e.touches;
    pinchStartDist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
    pinchStartDistance = distance;
  }
}, {passive:true});
canvas.addEventListener("touchmove", e=>{
  if(e.touches.length===2 && pinchStartDist>0){
    const [a,b]=e.touches;
    const d = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
    distance = Math.max(0.15, Math.min(3, pinchStartDistance * (pinchStartDist/Math.max(1,d))));
  }
}, {passive:true});

applyMode("all");
// 初期表示は常に標準基準値(装置パラメータ欄のデフォルト)。シミュレータの
// 現在値を使いたい場合は「シミュレータの現在値を読み込む」ボタンで明示的に行う。
updateDampingDisplay();
updateSyncStatus();
const partList = $("parts");
partOrder.forEach(k=>{
  const b = document.createElement("button");
  b.className = "part";
  b.dataset.part = k;
  b.innerHTML = `<span>${parts[k].name}</span><small>${parts[k].symbol}</small>`;
  b.onclick = ()=>selectPart(k);
  partList.appendChild(b);
});
requestAnimationFrame(render);
})();
