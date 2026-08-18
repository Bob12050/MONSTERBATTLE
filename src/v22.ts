// @ts-nocheck
// v22: turn "おすすめ確認" into a confirmable recommended-party flow.
function v22RecommendedIds(q){
 return Object.keys(S.owned)
  .sort((a,b)=>v8Suitability(b,q).score-v8Suitability(a,q).score||M(b).rarity-M(a).rarity||atkVal(b)-atkVal(a))
  .slice(0,4);
}
function v22ReasonText(id,q){
 const f=v8Suitability(id,q);
 return f.reasons.length?f.reasons.slice(0,4).join('・'):'汎用性能';
}
function v22RecommendedPartyModal(qid){
 const q=v8Quest(qid);if(!q)return;
 const ids=v22RecommendedIds(q);
 if(ids.length<4){toast('所持モンスターが4体未満です');return}
 document.getElementById('modal')?.remove();
 const now=S.party.slice();
 modal(`<div class="v22-rec-modal">
  <div class="section-title"><div><div class="tiny muted">RECOMMENDED DECK</div><h2>おすすめ編成</h2></div><button class="btn" onclick="closeModal();v9OpenSortie('${qid}')">閉じる</button></div>
  <div class="notice">${q.name}への適正スコアを基準に、所持モンスターから4体を選出しています。確定するまでは現在の編成は変わりません。</div>
  <div class="v22-rec-grid">${ids.map((id,i)=>{const u=M(id),o=S.owned[id],f=v8Suitability(id,q);return `<div class="v22-rec-unit fit-${f.grade}"><span>${i===0?'LEADER':`SLOT ${i+1}`}</span><strong>${u.icon}</strong><b>${u.name}</b><em>適正 ${f.grade}</em><small>Lv.${o?.level||1}　🍀${o?.luck||0}</small><p>${v22ReasonText(id,q)}</p></div>`}).join('')}</div>
  <div class="v22-before"><small>現在の編成</small><div>${now.map(id=>`<span>${M(id).icon} ${M(id).name}</span>`).join('')}</div></div>
  <div class="v22-rec-actions"><button class="btn" onclick="closeModal();v9OpenSortie('${qid}')">そのまま戻る</button><button class="bigbtn" onclick="v22ApplyRecommended('${qid}',${JSON.stringify(ids).replace(/"/g,'&quot;')})">この編成に変更</button></div>
 </div>`);
}
function v22ApplyRecommended(qid,ids){
 if(!Array.isArray(ids)||ids.length!==4)return;
 S.party=ids.slice(0,4);save();document.getElementById('modal')?.remove();toast('おすすめ編成に変更しました');v9OpenSortie(qid);
}
// Replace v9's toast-only recommendation with the full confirmation UI.
v9AutoHint=function(qid){v22RecommendedPartyModal(qid)};
const V22_HEADER=header;header=function(){return V22_HEADER().replace('TYPE SCRIPT v21','TYPE SCRIPT v22').replace('TYPE SCRIPT v20','TYPE SCRIPT v22')};
S.version=22;save();render();
