// @ts-nocheck
// v14 Monster BOX: compact grid, search, sorting, filtering, tap-for-detail.
const V14_BOX={query:'',sort:'rarity',element:'all',rarity:'all',source:'all'};

function v14OwnedIds(){return Object.keys(S.owned)}
function v14Source(u){
 const o=(u.obtain||'');
 if(o.includes('召喚'))return 'gacha';
 if(o.includes('降臨'))return 'advent';
 if(o.includes('配布')||o.includes('初期'))return 'gift';
 return 'normal';
}
function v14FilteredIds(){
 let ids=v14OwnedIds().filter(id=>{
  const u=M(id),q=V14_BOX.query.trim().toLowerCase();
  if(q&&![u.name,u.tribe,u.role,...v11Defs(u).map(a=>a.name)].join(' ').toLowerCase().includes(q))return false;
  if(V14_BOX.element!=='all'&&u.element!==V14_BOX.element)return false;
  if(V14_BOX.rarity!=='all'&&u.rarity!==Number(V14_BOX.rarity))return false;
  if(V14_BOX.source!=='all'&&v14Source(u)!==V14_BOX.source)return false;
  return true;
 });
 const cmp={rarity:(a,b)=>M(b).rarity-M(a).rarity||S.owned[b].level-S.owned[a].level,level:(a,b)=>S.owned[b].level-S.owned[a].level||M(b).rarity-M(a).rarity,luck:(a,b)=>S.owned[b].luck-S.owned[a].luck||M(b).rarity-M(a).rarity,name:(a,b)=>M(a).name.localeCompare(M(b).name,'ja'),obtained:(a,b)=>v14OwnedIds().indexOf(b)-v14OwnedIds().indexOf(a)}[V14_BOX.sort]||(()=>0);
 return ids.sort(cmp);
}
function v14ElementMark(e){return {火:'🔥',水:'💧',木:'🌿',光:'✨',闇:'🌑'}[e]||'◆'}
function v14Tile(id){
 const u=M(id),o=S.owned[id],partyIndex=S.party.indexOf(id),isLeader=partyIndex===0;
 return `<button class="v14-unit" onclick="v14OpenMonster('${id}')"><span class="v14-element">${v14ElementMark(u.element)}</span>${partyIndex>=0?`<span class="v14-party-badge">${isLeader?'LEADER':`編成${partyIndex+1}`}</span>`:''}${o.luck>=99?'<span class="v14-maxluck">極</span>':''}<span class="v14-icon">${u.icon}</span><span class="v14-level">LV${o.level}</span><span class="v14-stars">${stars(u.rarity)}</span><span class="v14-luck">🍀${o.luck}</span></button>`;
}
function v14Set(key,val){V14_BOX[key]=val;boxView($('#main'))}
function v14Search(v){
 V14_BOX.query=v;const ids=v14FilteredIds(),grid=document.querySelector('.v14-grid'),count=document.getElementById('v14-count');
 if(grid)grid.innerHTML=ids.map(v14Tile).join('')||'<div class="v14-empty">条件に一致するモンスターはいません</div>';
 if(count)count.textContent=String(ids.length);
}
function v14Reset(){V14_BOX.query='';V14_BOX.sort='rarity';V14_BOX.element='all';V14_BOX.rarity='all';V14_BOX.source='all';boxView($('#main'))}

boxView=function(m){
 const ids=v14FilteredIds(),total=v14OwnedIds().length;
 m.innerHTML=`<section class="v14-box-screen"><div class="v14-box-title"><div><small>MONSTER STORAGE</small><h2>モンスターBOX</h2></div><b><span id="v14-count">${ids.length}</span><span> / ${total}</span></b></div><div class="v14-box-tools"><input class="v14-search" value="${V14_BOX.query.replace(/"/g,'&quot;')}" oninput="v14Search(this.value)" placeholder="モンスター名・種族・アビリティで検索"><select onchange="v14Set('sort',this.value)"><option value="rarity" ${V14_BOX.sort==='rarity'?'selected':''}>レアリティ順</option><option value="level" ${V14_BOX.sort==='level'?'selected':''}>レベル順</option><option value="luck" ${V14_BOX.sort==='luck'?'selected':''}>ラック順</option><option value="obtained" ${V14_BOX.sort==='obtained'?'selected':''}>入手順</option><option value="name" ${V14_BOX.sort==='name'?'selected':''}>名前順</option></select></div><div class="v14-filters"><select onchange="v14Set('element',this.value)"><option value="all">全属性</option>${['火','水','木','光','闇'].map(e=>`<option ${V14_BOX.element===e?'selected':''}>${e}</option>`).join('')}</select><select onchange="v14Set('rarity',this.value)"><option value="all">全レア</option>${[2,3,4,5,6].map(r=>`<option value="${r}" ${String(V14_BOX.rarity)===String(r)?'selected':''}>★${r}</option>`).join('')}</select><select onchange="v14Set('source',this.value)"><option value="all">全入手先</option><option value="normal" ${V14_BOX.source==='normal'?'selected':''}>通常</option><option value="advent" ${V14_BOX.source==='advent'?'selected':''}>降臨</option><option value="gacha" ${V14_BOX.source==='gacha'?'selected':''}>召喚限定</option><option value="gift" ${V14_BOX.source==='gift'?'selected':''}>配布・初期</option></select><button onclick="v14Reset()">リセット</button></div><div class="v14-grid">${ids.map(v14Tile).join('')||'<div class="v14-empty">条件に一致するモンスターはいません</div>'}</div></section>`;
};

function v14OpenMonster(id){
 const u=M(id),o=S.owned[id],cost=90+o.level*40,e=V7_EVOS?.[id],can=e&&!o.evolved&&o.level>=e.lv&&S.materials[e.mat]>=e.cost&&S.gold>=e.gold;
 modal(`<div class="v14-detail"><div class="v14-detail-hero"><div class="v14-detail-icon">${u.icon}</div><div><span class="rarity">${stars(u.rarity)}</span><h2>${u.name}</h2><div class="tags"><span class="tag">${u.element}</span><span class="tag">${u.tribe}</span><span class="tag role">${u.role}</span><span class="tag">Lv.${o.level}</span><span class="tag ${o.luck>=99?'luckmax':''}">🍀${o.luck}/99</span></div></div></div>${v11AbilityPanel(u)}<div class="v14-detail-stats"><span>HP <b>${u.hp}</b></span><span>ATK <b>${u.atk}</b></span></div><div class="card"><b>✨ ${u.skill}</b><p class="tiny muted">${u.skillDesc}</p><b>🌠 ${u.ult}</b><p class="tiny muted">${u.ultDesc}</p></div><div class="tiny muted">入手：${u.obtain||obtainText(id)}</div><div class="v14-detail-actions"><button class="btn" ${S.gold<cost?'disabled':''} onclick="upgrade('${id}');closeModal()">LvUP 🪙${cost}</button><button class="btn" onclick="closeModal();partyIn('${id}')">編成</button>${e&&!o.evolved?`<button class="btn warn" ${can?'':'disabled'} onclick="v7Evolve('${id}')">進化</button>`:''}<button class="btn" onclick="closeModal()">閉じる</button></div></div>`);
}

const V14_HEADER=header;
header=function(){return V14_HEADER().replace('TYPE SCRIPT v13','TYPE SCRIPT v14')};
S.version=14;save();render();
