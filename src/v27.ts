// @ts-nocheck
// v27: first real character artwork pipeline. Lucifer uses one sprite sheet across BOX, party and detail UI.
const V27_LUCIFER_IDS=['lucifer','lucifer_evo','lucifer_final'];
const V27_ART_BLOB='76aa732839bb280ac42f9526b8e74ef1413b3a67';
let V27_ART_URL='';

function v27LuciferStage(id){return id==='lucifer'?0:id==='lucifer_evo'?1:id==='lucifer_final'?2:-1}
function v27HasArt(id){return v27LuciferStage(id)>=0}
function v27ArtPos(id){const s=v27LuciferStage(id);return s===0?'0% 8%':s===1?'50% 8%':'100% 8%'}
function v27ArtClass(id,extra=''){return v27HasArt(id)?`v27-art v27-stage-${v27LuciferStage(id)} ${extra}`:extra}
function v27ArtStyle(id){return v27HasArt(id)?`background-position:${v27ArtPos(id)}`:''}
function v27ArtMarkup(id,kind='icon'){const u=M(id);return v27HasArt(id)?`<span class="${v27ArtClass(id,`v27-${kind}`)}" style="${v27ArtStyle(id)}" aria-label="${u.name}"></span>`:`<span class="v27-fallback">${u.icon}</span>`}

async function v27LoadArt(){
 try{
  const r=await fetch(`https://api.github.com/repos/Bob12050/MONSTERBATTLE/git/blobs/${V27_ART_BLOB}`,{headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw new Error('art fetch');
  const j=await r.json(),raw=atob((j.content||'').replace(/\s/g,'')),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
  V27_ART_URL=URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));document.documentElement.style.setProperty('--v27-lucifer-art',`url("${V27_ART_URL}")`);document.body.classList.add('v27-art-ready');v27RefreshArt();
 }catch(e){console.warn('Lucifer art fallback active',e)}
}
function v27RefreshArt(){
 document.querySelectorAll('[data-v27-monster]').forEach(el=>{const id=el.getAttribute('data-v27-monster');if(v27HasArt(id)){el.classList.add('v27-art','v27-live');el.style.backgroundPosition=v27ArtPos(id)}});
}

const V27_OLD_SLOT=v9Slot;
v9Slot=function(id,i,q){const html=V27_OLD_SLOT(id,i,q);if(!v27HasArt(id))return html;return html.replace(`<strong>${M(id).icon}</strong>`,`<strong class="v27-slot-art" data-v27-monster="${id}" style="${v27ArtStyle(id)}"></strong>`)};

const V27_OLD_DETAIL=v24OpenMonsterDetail;
v24OpenMonsterDetail=function(id){V27_OLD_DETAIL(id);if(!v27HasArt(id))return;const root=document.getElementById('v24-monster-detail');if(!root)return;const hero=root.querySelector('.v24-hero-icon');if(hero){hero.innerHTML='';hero.classList.add('v27-detail-art');hero.setAttribute('data-v27-monster',id);hero.style.backgroundPosition=v27ArtPos(id)}v27RefreshArt()};

// BOX/editor cards are rendered by several historical versions, so decorate them after every render instead of coupling to one renderer.
function v27DecorateCards(){
 document.querySelectorAll('.v14-unit').forEach(el=>{const s=el.getAttribute('onclick')||'',m=s.match(/v14OpenMonster\('([^']+)'\)/),id=m?.[1];if(!id||!v27HasArt(id)||el.querySelector('.v27-card-art'))return;const art=document.createElement('span');art.className='v27-card-art';art.setAttribute('data-v27-monster',id);art.style.backgroundPosition=v27ArtPos(id);el.prepend(art)});
 document.querySelectorAll('.v8-edit-slot').forEach((el,i)=>{const id=S.party[i];if(!id||!v27HasArt(id)||el.querySelector('.v27-card-art'))return;const art=document.createElement('span');art.className='v27-card-art';art.setAttribute('data-v27-monster',id);art.style.backgroundPosition=v27ArtPos(id);el.prepend(art)});v27RefreshArt();
}
const V27_RENDER=render;render=function(){V27_RENDER();setTimeout(v27DecorateCards,0)};
const V27_OPEN_SORTIE=v9OpenSortie;v9OpenSortie=function(id){V27_OPEN_SORTIE(id);setTimeout(()=>{v27DecorateCards();v27RefreshArt()},0)};

const V27_HEADER=header;header=function(){return V27_HEADER().replace(/TYPE SCRIPT v\d+/,'TYPE SCRIPT v27')};
S.version=27;save();render();v27LoadArt();
