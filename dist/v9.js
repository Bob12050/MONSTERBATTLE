// @ts-nocheck
// v9 UX extension: no-scroll sortie preparation screen.
const V9_OLD_DETAIL=v8QuestDetail;

function v9TotalHp(){
 return S.party.reduce((sum,id)=>{const u=M(id),o=S.owned[id];return sum+Math.floor(u.hp*(1+((o?.level||1)-1)*.06))},0);
}
function v9PartyFit(q){
 const fits=S.party.map(id=>v8Suitability(id,q));
 const avg=fits.reduce((s,f)=>s+f.score,0)/Math.max(1,fits.length);
 const grade=avg>=5?'S':avg>=3.25?'A':avg>=1.75?'B':avg>=.25?'C':'D';
 return{fits,avg,grade};
}
function v9Coverage(q){
 const units=S.party.map(id=>M(id)),items=[];
 const add=(ok,label)=>items.push({ok,label});
 if(q.gimmick==='barrier')add(units.some(u=>u.passive==='barrier'||u.element==='火'),'バリア対策');
 if(q.gimmick==='heat')add(units.some(u=>u.element==='水'),'熱量対策');
 if(q.gimmick==='aura')add(units.some(u=>u.element==='光'),'オーラ対策');
 const adv=v8AdvElement(q.element);if(adv)add(units.some(u=>u.element===adv),`${adv}属性`);
 if(q.tribe==='獣')add(units.some(u=>u.passive==='beast'),'獣キラー');
 if(q.tribe==='ドラゴン')add(units.some(u=>u.passive==='dragon'),'竜キラー');
 return items.slice(0,4);
}
function v9Slot(id,i,q){
 const u=M(id),o=S.owned[id],fit=v8Suitability(id,q);
 return `<button class="v9-slot fit-${fit.grade}" onclick="v9EditParty('${q.id}',${i})"><span class="v9-slot-head">${i===0?'LEADER':`SLOT ${i+1}`}</span><strong>${u.icon}</strong><b>${u.name.split(' ').pop()}</b><em>適正 ${fit.grade}</em><small>Lv.${o?.level||1}　🍀${o?.luck||0}</small></button>`;
}
function v9QuestType(q){return q.advent?(q.v7diff||'降臨'):q.v7daily?'曜日':'通常'}
function v9OpenSortie(id){
 const q=v8Quest(id);if(!q)return;
 document.getElementById('modal')?.remove();document.getElementById('v9-sortie')?.remove();
 const fit=v9PartyFit(q),coverage=v9Coverage(q),locked=S.rank<q.rank,noStam=S.stamina<q.cost;
 const leader=S.owned[S.party[0]],luckMax=(leader?.luck||0)>=99;
 const warn=coverage.filter(x=>!x.ok);
 const root=document.createElement('div');root.id='v9-sortie';root.innerHTML=`
  <div class="v9-shell">
   <div class="v9-topbar">
    <button class="v9-back" onclick="v9CloseSortie()">‹</button>
    <div class="v9-title"><span>${v9QuestType(q)} QUEST</span><b>${q.name}</b></div>
    <div class="v9-cost">⚡ ${q.cost}<small>${S.stamina}/${S.maxStamina}</small></div>
   </div>
   <div class="v9-mission">
    <div class="v9-boss">${q.enemyIcon}</div>
    <div class="v9-mission-main"><div class="v9-kicker">${q.advent?'BOSS STAGE':'STAGE INFO'}</div><h2>${q.enemy}</h2><div class="v9-tags"><span>${q.element}</span><span>${q.tribe}</span><span>RANK ${q.rank}</span>${q.v7diff?`<span>${q.v7diff}</span>`:''}</div></div>
    <button class="v9-detail" onclick="v9ShowDetail('${q.id}')">詳細</button>
   </div>
   <div class="v9-gimmick"><span>⚙</span><div><small>攻略ポイント</small><b>${q.gimmickText||v8RecommendText(q).slice(0,2).join('・')||'基本編成で攻略可能'}</b></div></div>
   <div class="v9-deck">
    <div class="v9-deck-head"><div><span>DECK 1</span><b>出撃デッキ</b></div><div class="v9-total"><small>合計HP</small><b>${v9TotalHp().toLocaleString()}</b></div><div class="v9-rank"><small>総合適正</small><b>${fit.grade}</b></div></div>
    <div class="v9-slots">${S.party.map((mid,i)=>v9Slot(mid,i,q)).join('')}</div>
    <div class="v9-status-row">${coverage.map(x=>`<span class="${x.ok?'ok':'ng'}">${x.ok?'✓':'!'} ${x.label}</span>`).join('')}${luckMax?'<span class="bonus">🍀 LUCK MAX：宝箱+1</span>':''}</div>
    ${warn.length?`<div class="v9-warning">⚠ ${warn.map(x=>x.label).join('・')} が不足しています</div>`:'<div class="v9-ready">✓ 主要な攻略条件を満たしています</div>'}
    <div class="v9-deck-actions"><button onclick="v9EditParty('${q.id}',0)">編成変更</button><button onclick="v9AutoHint('${q.id}')">おすすめ確認</button></div>
   </div>
   <div class="v9-footer">
    <div class="v9-reward"><small>主な報酬</small><b>${v8DropText(q)}</b></div>
    <button class="v9-sortie-btn" ${(locked||noStam)?'disabled':''} onclick="v9Start('${q.id}')">出撃<span>${locked?`RANK ${q.rank} 必要`:noStam?'スタミナ不足':`消費 ⚡${q.cost}`}</span></button>
   </div>
  </div>`;
 document.body.appendChild(root);document.body.classList.add('v9-sortie-open');
}
function v9CloseSortie(){document.getElementById('v9-sortie')?.remove();document.body.classList.remove('v9-sortie-open')}
function v9Start(id){v9CloseSortie();startQuest(id)}
function v9ShowDetail(id){v9CloseSortie();V9_OLD_DETAIL(id)}
function v9EditParty(qid,slot){v9CloseSortie();V8_EDIT_SLOT=slot;v8RenderEditor(qid)}
function v9AutoHint(qid){
 const q=v8Quest(qid),tops=Object.keys(S.owned).sort((a,b)=>v8Suitability(b,q).score-v8Suitability(a,q).score||M(b).rarity-M(a).rarity).slice(0,4);
 const names=tops.map(id=>`${M(id).icon}${M(id).name}`).join(' / ');toast(`適正候補：${names}`);
}

v8QuestDetail=function(id){v9OpenSortie(id)};
const V9_HEADER=header;
header=function(){return V9_HEADER().replace('TYPE SCRIPT v8','TYPE SCRIPT v9')};
