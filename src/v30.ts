// @ts-nocheck
// v30: approved Lucifer evolution artwork. ★5 remains v29; ★6 forms load their own artwork.
const V30_URLS:any={};
const V30_IDS=['lucifer_evo','lucifer_final'];
const V30_FILES:any={lucifer_evo:'lucifer_evo',lucifer_final:'lucifer_final'};
const V30_ART=v28Art;
const V30_IMG=v28Img;

v28Art=function(id){return V30_URLS[id]||V30_ART(id)};
v28Img=function(id,cls='v28-art-img'){
 const src=v28Art(id),u=M(id);
 return src?`<img class="${cls}${V30_IDS.includes(id)?' v30-lucifer-evolution-img':''}" data-v30-monster="${id}" src="${src}" alt="${u.name}" draggable="false">`:u.icon;
};

async function v30LoadOne(id){
 try{
  const base=V30_FILES[id];
  const parts=await Promise.all([0,1,2,3].map(i=>fetch(`./assets/lucifer/hq/${base}_${i}.b64?v=30`).then(r=>{if(!r.ok)throw new Error(`${id} art ${i}`);return r.text()})));
  const raw=atob(parts.join('').replace(/\s/g,'')),bytes=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
  const url=URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
  V30_URLS[id]=url;MONSTERS[id].art=url;MONSTERS[id].portrait=url;
  document.querySelectorAll(`[data-v30-monster="${id}"]`).forEach((el:any)=>el.src=url);
 }catch(e){console.warn(`${id} HQ art fallback active`,e)}
}
async function v30LoadLuciferEvolution(){await Promise.all(V30_IDS.map(v30LoadOne));requestAnimationFrame(()=>v28DecorateVisibleCards())}

const V30_DETAIL=v24OpenMonsterDetail;
v24OpenMonsterDetail=function(id){V30_DETAIL(id);if(!V30_IDS.includes(id))return;const root=document.getElementById('v24-monster-detail');const hero=root?.querySelector('.v24-hero-icon');if(hero)hero.classList.add('v30-lucifer-evolution-hero')};
const V30_HEADER=header;header=function(){return V30_HEADER().replace(/TYPE SCRIPT v\d+/,'TYPE SCRIPT v30')};
S.version=30;save();render();v30LoadLuciferEvolution();
