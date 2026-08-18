// @ts-nocheck
// v8 UX extension: quest detail, suitability hints, and party editing.
let V8_EDIT_SLOT=0;

function v8Quest(id){return QUESTS.find(q=>q.id===id)}
function v8AdvElement(enemy){return enemy==='木'?'火':enemy==='火'?'水':enemy==='水'?'木':enemy==='光'?'闇':enemy==='闇'?'光':null}
function v8IsNormal(q){return !q.advent&&!q.v7daily}
function v8Suitability(id,q){
 const u=M(id);let score=0;const reasons=[];
 if(q){
  const r=elem(u.element,q.element);
  if(r>1){score+=3;reasons.push('属性有利')}
  else if(r<1){score-=2;reasons.push('属性不利')}
  if(u.passive==='beast'&&q.tribe==='獣'){score+=4;reasons.push('獣キラー')}
  if(u.passive==='dragon'&&q.tribe==='ドラゴン'){score+=4;reasons.push('ドラゴンキラー')}
  if(u.passive==='weak'&&r>1){score+=2;reasons.push('弱点看破')}
  if(q.gimmick==='barrier'){
   if(u.passive==='barrier'){score+=5;reasons.push('バリア特攻')}
   if(u.element==='火'){score+=2;reasons.push('バリア有効属性')}
  }
  if(q.gimmick==='heat'&&u.element==='水'){score+=5;reasons.push('熱量対策')}
  if(q.gimmick==='aura'&&u.element==='光'){score+=5;reasons.push('オーラ対策')}
  if(v8IsNormal(q)&&(u.passive==='drop8'||u.passive==='drop5')){score+=2;reasons.push('周回向き')}
 }
 if(u.passive==='partyguard'){score+=1;reasons.push('全体軽減')}
 if(u.role==='ヒーラー'){score+=1;reasons.push('回復')}
 const grade=score>=6?'S':score>=4?'A':score>=2?'B':score>=0?'C':'D';
 return{score,grade,reasons};
}
function v8RecommendText(q){
 const adv=v8AdvElement(q.element),out=[];
 if(adv)out.push(`${adv}属性`);
 if(q.tribe==='獣')out.push('獣キラー');
 if(q.tribe==='ドラゴン')out.push('ドラゴンキラー');
 if(q.gimmick==='barrier')out.push('バリアブレイカー');
 if(q.gimmick==='heat')out.push('水属性で熱量対策');
 if(q.gimmick==='aura')out.push('光属性でオーラ解除');
 if(v8IsNormal(q))out.push('ラック・ドロップ補正');
 return [...new Set(out)];
}
function v8DropText(q){
 if(q.advent&&q.drop)return `${MONSTERS[q.drop]?.icon||'🐾'} ${MONSTERS[q.drop]?.name||q.drop}（${Math.round((q.dropRate||0)*100)}%）`;
 if(q.drops?.length)return q.drops.map(([id,r])=>`${MONSTERS[id]?.icon||'🐾'} ${MONSTERS[id]?.name||id} ${Math.round(Number(r)*100)}%`).join(' / ');
 if(q.v7daily&&q.v7mat)return `${V7_EICON[q.v7mat]||'💎'} ${q.v7mat}進化素材 ×${q.v7matAmount||3}`;
 return 'モンスタードロップなし';
}
function v8PartyMini(id,q,index){
 const u=M(id),o=S.owned[id],fit=v8Suitability(id,q);
 return `<div class="v8-party-mini fit-${fit.grade}"><div class="v8-slot-label">${index===0?'LEADER':`SLOT ${index+1}`}</div><div class="avatar">${u.icon}</div><b>${u.name}</b><div class="v8-grade">適正 ${fit.grade}</div><div class="tiny muted">${u.element}・${u.tribe}・${u.role} / 🍀${o?.luck||0}</div>${fit.reasons.length?`<div class="v8-reasons">${fit.reasons.slice(0,3).map(x=>`<span>${x}</span>`).join('')}</div>`:''}</div>`;
}
function v8TopOwned(q){return Object.keys(S.owned).sort((a,b)=>v8Suitability(b,q).score-v8Suitability(a,q).score||M(b).rarity-M(a).rarity).slice(0,4)}
function v8QuestDetail(id){
 const q=v8Quest(id);if(!q)return;
 const locked=S.rank<q.rank,rec=v8RecommendText(q),tops=v8TopOwned(q);
 document.getElementById('modal')?.remove();
 modal(`<div class="v8-detail"><div class="section-title"><div><div class="tiny muted">QUEST DETAIL</div><h2>${q.name}</h2></div><button class="btn" onclick="closeModal()">閉じる</button></div>
 <div class="v8-enemy"><div class="v8-enemy-icon">${q.enemyIcon}</div><div><b>${q.enemy}</b><div class="tags"><span class="tag">${q.element}</span><span class="tag">${q.tribe}</span><span class="tag">RANK ${q.rank}</span><span class="tag">⚡${q.cost}</span></div>${q.gimmickText?`<div class="gimmick">⚙ ${q.gimmickText}</div>`:''}</div></div>
 <div class="v8-info-grid"><div class="card"><div class="tiny muted">おすすめ対策</div><div class="v8-rec">${rec.map(x=>`<span>${x}</span>`).join('')}</div></div><div class="card"><div class="tiny muted">主な報酬</div><b>${v8DropText(q)}</b><div class="tiny muted">RANK EXP +${q.xp} / 🪙 +${q.gold}</div></div></div>
 <div class="section-title"><h3>現在の編成</h3><button class="btn" onclick="v8OpenPartyEditor('${q.id}')">4体編成を変更</button></div><div class="v8-party-grid">${S.party.map((mid,i)=>v8PartyMini(mid,q,i)).join('')}</div>
 <div class="section-title"><h3>所持モンスターの適正候補</h3></div><div class="v8-candidates">${tops.map(mid=>{const u=M(mid),f=v8Suitability(mid,q);return `<div class="card"><span class="v8-grade inline">${f.grade}</span> ${u.icon} <b>${u.name}</b><div class="tiny muted">${f.reasons.join('・')||'汎用枠'}</div></div>`}).join('')}</div>
 ${locked?`<div class="notice">🔒 RANK ${q.rank} で挑戦可能です。</div>`:''}<div class="v8-actions"><button class="bigbtn" onclick="v8OpenPartyEditor('${q.id}')">編成を見直す</button><button class="bigbtn" ${locked?'disabled':''} onclick="v8StartFromDetail('${q.id}')">この編成で出撃 ⚡${q.cost}</button></div></div>`);
}
function v8StartFromDetail(id){document.getElementById('modal')?.remove();startQuest(id)}
function v8RenderEditor(qid){
 const q=qid?v8Quest(qid):null,ids=Object.keys(S.owned).sort((a,b)=>(q?v8Suitability(b,q).score-v8Suitability(a,q).score:0)||M(b).rarity-M(a).rarity);
 document.getElementById('modal')?.remove();
 modal(`<div class="v8-editor"><div class="section-title"><div><div class="tiny muted">PARTY EDIT</div><h2>4体編成</h2></div><button class="btn" onclick="${qid?`v8QuestDetail('${qid}')`:'closeModal()'}">完了</button></div>${q?`<div class="notice">${q.name}向け。適正が高い順に所持モンスターを並べています。</div>`:'<div class="notice">入れ替えたい枠を選んでから、モンスターを選択してください。</div>'}
 <div class="v8-edit-slots">${S.party.map((id,i)=>{const u=M(id),fit=q?v8Suitability(id,q):null;return `<button class="v8-edit-slot ${V8_EDIT_SLOT===i?'selected':''}" onclick="V8_EDIT_SLOT=${i};v8RenderEditor(${qid?`'${qid}'`:'null'})"><span>${i===0?'LEADER':`SLOT ${i+1}`}</span><strong>${u.icon}</strong><b>${u.name}</b>${fit?`<em>適正 ${fit.grade}</em>`:''}</button>`}).join('')}</div>
 <div class="section-title"><h3>所持モンスター</h3><span class="tiny muted">選択中：${V8_EDIT_SLOT===0?'LEADER':`SLOT ${V8_EDIT_SLOT+1}`}</span></div><div class="v8-owned-grid">${ids.map(id=>{const u=M(id),o=S.owned[id],fit=q?v8Suitability(id,q):null,inParty=S.party.includes(id);return `<button class="v8-owned ${inParty?'in-party':''}" onclick="v8PutMonster('${id}',${qid?`'${qid}'`:'null'})"><div class="avatar">${u.icon}</div><div><b>${u.name}</b><div class="tiny muted">${u.element}・${u.tribe}・${u.role} / Lv.${o.level} 🍀${o.luck}</div>${fit?`<div><span class="v8-grade inline">${fit.grade}</span> <span class="tiny">${fit.reasons.slice(0,3).join('・')||'汎用'}</span></div>`:''}</div></button>`}).join('')}</div></div>`);
}
function v8OpenPartyEditor(qid){V8_EDIT_SLOT=0;v8RenderEditor(qid||null)}
function v8PutMonster(id,qid){
 const other=S.party.indexOf(id),current=S.party[V8_EDIT_SLOT];
 if(other===V8_EDIT_SLOT)return;
 if(other>=0){S.party[V8_EDIT_SLOT]=id;S.party[other]=current}else S.party[V8_EDIT_SLOT]=id;
 save();v8RenderEditor(qid||null);
}
function v8ChooseSlotForMonster(id){
 const u=M(id);document.getElementById('modal')?.remove();
 modal(`<div class="v8-editor"><div class="section-title"><h2>${u.icon} ${u.name} を編成</h2><button class="btn" onclick="closeModal()">閉じる</button></div><div class="notice">入れ替える枠を選択してください。同じモンスターが編成中なら位置を入れ替えます。</div><div class="v8-edit-slots">${S.party.map((mid,i)=>{const m=M(mid);return `<button class="v8-edit-slot" onclick="v8PlaceFromBox('${id}',${i})"><span>${i===0?'LEADER':`SLOT ${i+1}`}</span><strong>${m.icon}</strong><b>${m.name}</b></button>`}).join('')}</div></div>`);
}
function v8PlaceFromBox(id,slot){
 const other=S.party.indexOf(id),current=S.party[slot];
 if(other===slot){closeModal();return}
 if(other>=0){S.party[slot]=id;S.party[other]=current}else S.party[slot]=id;
 save();closeModal();toast(`${M(id).name}を編成しました`);
}
partyIn=function(id){v8ChooseSlotForMonster(id)};

function v8QuestCard(q){
 const lock=S.rank<q.rank,rec=v8RecommendText(q).slice(0,2);
 return `<div class="card quest ${q.advent?'advent':''} ${lock?'locked':''}" onclick="v8QuestDetail('${q.id}')"><div class="qicon">${q.icon}</div><div class="tiny muted">${q.advent?(q.v7diff||'降臨'):(q.v7daily?'DAILY':'NORMAL')} · RANK ${q.rank} · ⚡${q.cost}</div><h3>${q.name}</h3><div class="tiny muted">${q.enemy}</div><div class="tags"><span class="tag">${q.element}</span><span class="tag">${q.tribe}</span>${lock?'<span class="tag">🔒</span>':''}</div><div class="v8-card-rec">${rec.map(x=>`<span>◎ ${x}</span>`).join('')}</div></div>`;
}
questView=function(m){
 const normals=QUESTS.filter(q=>v8IsNormal(q));let h=`<div class="section-title"><div><div class="tiny muted">QUEST</div><h2>クエスト選択</h2></div></div><div class="notice">クエストを選ぶと、敵情報・おすすめ対策・現在の編成適正を確認してから出撃できます。</div>`;
 const chapters=[['第1章 緑風の平原',['n1','n1b','n1c']],['第2章 灼熱山脈',['n2','n2b','n2c']],['第3章 轟岩洞窟',['n3','n3b','n3c']]];
 for(const [title,ids] of chapters)h+=`<div class="v7-chapter"><h3>${title}</h3><div class="grid three">${ids.map(id=>normals.find(q=>q.id===id)).filter(Boolean).map(v8QuestCard).join('')}</div></div>`;
 const daily=QUESTS.filter(q=>q.v7daily);if(daily.length)h+=`<div class="section-title"><div><div class="tiny muted">DAILY</div><h2>曜日ダンジョン</h2></div></div><div class="grid three">${daily.map(v8QuestCard).join('')}</div>`;
 h+=`<div class="section-title"><div><div class="tiny muted">ADVENT</div><h2>降臨ダンジョン</h2></div><span class="tiny muted">難易度を選んで詳細確認</span></div>`;
 for(const aid of Object.keys(V7_ADVENT_BASE)){const qs=QUESTS.filter(q=>q.v7aid===aid);if(!qs.length)continue;const a=V7_ADVENT_BASE[aid];h+=`<div class="card v7-advent"><div class="unit-row"><div class="avatar">${a.enemyIcon}</div><div><h3>${a.name}</h3><div class="tiny muted">${a.element} / ${a.tribe}</div><div class="gimmick">⚙ ${a.gimmickText}</div></div></div><div class="v8-diff-grid">${Object.keys(V7_DIFF).map(diff=>{const q=qs.find(x=>x.v7diff===diff);return q?`<button class="btn ${diff==='極'?'warn':''}" onclick="event.stopPropagation();v8QuestDetail('${q.id}')">${diff}<small>RANK ${q.rank} / ${Math.round(q.dropRate*100)}%</small></button>`:''}).join('')}</div></div>`}
 m.innerHTML=h;
};

const V8_HEADER=header;
header=function(){return V8_HEADER().replace('TYPE SCRIPT v7','TYPE SCRIPT v8')};
