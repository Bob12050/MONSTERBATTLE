// @ts-nocheck
// v27: first real character-art integration. Art is optional; emoji remains the fallback.
const V27_ART={
 lucifer:'./assets/lucifer/lucifer.webp',
 lucifer_evo:'./assets/lucifer/lucifer_evo.webp',
 lucifer_final:'./assets/lucifer/lucifer_final.webp'
};
for(const id of Object.keys(V27_ART))if(MONSTERS[id]){MONSTERS[id].art=V27_ART[id];MONSTERS[id].iconArt=V27_ART[id]}

function v27Art(id){return V27_ART[id]||M(id)?.art||null}
function v27Icon(id,cls='v27-icon-img'){
 const u=M(id),art=v27Art(id);
 return art?`<img class="${cls}" src="${art}" alt="${u.name}" draggable="false">`:u.icon;
}

// Monster BOX: portrait art when available, emoji for everyone else.
const V27_TILE=v14Tile;
v14Tile=function(id){
 let html=V27_TILE(id),art=v27Art(id);if(!art)return html;
 return html.replace(/<span class="v14-icon">[\s\S]*?<\/span>/,`<span class="v14-icon v27-art-icon">${v27Icon(id)}</span>`);
};

// Sortie preparation: use the same portrait in the four deck slots.
const V27_SLOT=v9Slot;
v9Slot=function(id,i,q){
 let html=V27_SLOT(id,i,q),art=v27Art(id);if(!art)return html;
 return html.replace(/<strong>[\s\S]*?<\/strong>/,`<strong class="v27-sortie-art">${v27Icon(id)}</strong>`);
};

// Party editor is produced by older code, so decorate its four current party slots after render.
function v27PatchEditor(){
 const slots=[...document.querySelectorAll('.v8-edit-slot')];
 slots.forEach((slot,i)=>{
  const id=S.party[i],art=id&&v27Art(id);slot.querySelector('.v27-editor-art')?.remove();
  if(!art)return;
  const img=document.createElement('img');img.className='v27-editor-art';img.src=art;img.alt=M(id).name;img.draggable=false;
  slot.prepend(img);slot.classList.add('v27-has-art');
 });
}
const V27_EDITOR=typeof v8RenderEditor==='function'?v8RenderEditor:null;
if(V27_EDITOR)v8RenderEditor=function(qid){V27_EDITOR(qid);requestAnimationFrame(v27PatchEditor)};

// Full-screen long-press detail: replace the large emoji with the stage-specific artwork.
const V27_DETAIL=v24OpenMonsterDetail;
v24OpenMonsterDetail=function(id){
 V27_DETAIL(id);const art=v27Art(id);if(!art)return;
 const hero=document.querySelector('#v24-monster-detail .v24-hero-icon');
 if(hero){hero.innerHTML=`<img class="v27-detail-art" src="${art}" alt="${M(id).name}" draggable="false">`;hero.classList.add('v27-detail-art-wrap')}
};

// Any recommendation / modal card that still contains the Lucifer emoji can opt in by data-monster-id later.
// Keeping this helper generic makes future illustrated characters a data-only addition.
function v27MonsterVisual(id,mode='icon'){return mode==='art'&&v27Art(id)?`<img class="v27-detail-art" src="${v27Art(id)}" alt="${M(id).name}">`:v27Icon(id)}

const V27_HEADER=header;
header=function(){return V27_HEADER().replace('TYPE SCRIPT v26','TYPE SCRIPT v27').replace('TYPE SCRIPT v25','TYPE SCRIPT v27')};
S.version=27;save();render();
