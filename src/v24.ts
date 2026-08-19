// @ts-nocheck
// v24: long-press a monster in party/sortie/BOX to open a full-screen detail view.
let V24_PRESS_TIMER=null;
let V24_LONG_TRIGGERED=false;
let V24_PRESS_TARGET=null;

function v24MonsterIdFromTarget(el){
 if(!el)return null;
 if(el.classList?.contains('v9-slot')){
  const slots=[...document.querySelectorAll('.v9-slots .v9-slot')];
  const i=slots.indexOf(el);return i>=0?S.party[i]:null;
 }
 if(el.classList?.contains('v8-edit-slot')){
  const slots=[...el.parentElement.querySelectorAll('.v8-edit-slot')];
  const i=slots.indexOf(el);return i>=0?S.party[i]:null;
 }
 if(el.classList?.contains('v14-unit')){
  const s=el.getAttribute('onclick')||'';const m=s.match(/v14OpenMonster\('([^']+)'\)/);return m?.[1]||null;
 }
 return null;
}
function v24LongTarget(node){return node?.closest?.('.v9-slot,.v8-edit-slot,.v14-unit')||null}
function v24CancelPress(){if(V24_PRESS_TIMER){clearTimeout(V24_PRESS_TIMER);V24_PRESS_TIMER=null}V24_PRESS_TARGET=null}
function v24BeginPress(e){
 const target=v24LongTarget(e.target);if(!target)return;
 v24CancelPress();V24_LONG_TRIGGERED=false;V24_PRESS_TARGET=target;
 const id=v24MonsterIdFromTarget(target);if(!id)return;
 V24_PRESS_TIMER=setTimeout(()=>{V24_PRESS_TIMER=null;V24_LONG_TRIGGERED=true;target.classList.add('v24-held');if(navigator.vibrate)navigator.vibrate(25);v24OpenMonsterDetail(id);setTimeout(()=>target.classList.remove('v24-held'),180)},520);
}
function v24EndPress(){v24CancelPress()}
function v24BlockLongClick(e){if(V24_LONG_TRIGGERED&&v24LongTarget(e.target)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();V24_LONG_TRIGGERED=false}}

document.addEventListener('pointerdown',v24BeginPress,true);
document.addEventListener('pointerup',v24EndPress,true);
document.addEventListener('pointercancel',v24EndPress,true);
document.addEventListener('pointermove',e=>{if(V24_PRESS_TARGET&&e.pressure===0)v24CancelPress()},true);
document.addEventListener('click',v24BlockLongClick,true);
document.addEventListener('contextmenu',e=>{if(v24LongTarget(e.target))e.preventDefault()},true);

function v24Stat(id,key){
 const u=M(id),o=S.owned[id]||{level:1};
 if(key==='atk'&&typeof atkVal==='function'){try{return atkVal(id)}catch{}}
 return Math.floor((u[key]||0)*(1+((o.level||1)-1)*.06));
}
function v24AbilityRows(u){
 const defs=typeof v11Defs==='function'?v11Defs(u):[];
 if(!defs.length)return '<div class="v24-none">アビリティなし</div>';
 return defs.map(a=>`<div class="v24-ability"><b>${a.unique?'✦ ':''}${a.name||'アビリティ'}</b><span>${a.desc||a.description||''}</span></div>`).join('');
}
function v24CloseMonsterDetail(){document.getElementById('v24-monster-detail')?.remove();document.body.classList.remove('v24-detail-open')}
function v24OpenMonsterDetail(id){
 const u=M(id),o=S.owned[id];if(!u||!o)return;
 document.getElementById('v24-monster-detail')?.remove();
 const root=document.createElement('div');root.id='v24-monster-detail';
 const hp=v24Stat(id,'hp'),atk=v24Stat(id,'atk');
 root.innerHTML=`<div class="v24-detail-shell">
  <header class="v24-detail-head"><button onclick="v24CloseMonsterDetail()">‹</button><div><small>MONSTER DETAIL</small><h1>${u.name}</h1><div>${stars(u.rarity)}</div></div><span class="v24-lock">${S.party.includes(id)?'編成中':''}</span></header>
  <section class="v24-hero"><div class="v24-aura"></div><div class="v24-hero-icon">${u.icon}</div><div class="v24-hero-tags"><span>${v14ElementMark?.(u.element)||u.element} ${u.element}</span><span>${u.tribe}</span><span>${u.role}</span></div></section>
  <section class="v24-status"><div class="v24-level"><b>LV ${o.level}</b><span>🍀 ${o.luck}/99 ${o.luck>=99?'・極':''}</span></div><div class="v24-bar hp"><label>HP</label><b>${hp.toLocaleString()}</b><i style="width:${Math.min(100,45+o.level*2)}%"></i></div><div class="v24-bar atk"><label>ATK</label><b>${atk.toLocaleString()}</b><i style="width:${Math.min(100,42+o.level*2)}%"></i></div></section>
  <section class="v24-info"><div class="v24-block"><h3>アビリティ</h3>${v24AbilityRows(u)}</div><div class="v24-block skill"><h3>✨ スキル</h3><b>${u.skill||'—'}</b><p>${u.skillDesc||''}</p></div><div class="v24-block ult"><h3>🌠 奥義</h3><b>${u.ult||'—'}</b><p>${u.ultDesc||''}</p></div><div class="v24-obtain">入手：${u.obtain||obtainText(id)}</div></section>
  <footer><button onclick="v24CloseMonsterDetail()">閉じる</button></footer>
 </div>`;
 document.body.appendChild(root);document.body.classList.add('v24-detail-open');
}

const V24_HEADER=header;header=function(){return V24_HEADER().replace('TYPE SCRIPT v23','TYPE SCRIPT v24').replace('TYPE SCRIPT v22','TYPE SCRIPT v24')};
S.version=24;save();render();
