// @ts-nocheck
// v17: developer mode for fast balance testing without contaminating normal progression.
function v17Dev(){return localStorage.getItem('astraDevMode')==='1'}
function v17SetDev(on){localStorage.setItem('astraDevMode',on?'1':'0');toast(on?'🧪 開発者モード ON':'開発者モード OFF');render()}
function v17DevUnlockAll(){for(const id of Object.keys(MONSTERS)){if(!S.owned[id])S.owned[id]={level:1,luck:1,evolved:false};S.owned[id].level=Math.max(S.owned[id].level||1,20)}save();toast('全モンスターをLv20でテスト解放');render()}
function v17DevResources(){S.rank=Math.max(S.rank,99);S.stamina=S.maxStamina=Math.max(S.maxStamina,999);S.gems=Math.max(S.gems,99999);S.gold=Math.max(S.gold,999999);if(S.materials)for(const e of Object.keys(S.materials))S.materials[e]=999;save();toast('テスト用リソースを補充');render()}
function v17DevLuck99(){for(const id of S.party){if(S.owned[id])S.owned[id].luck=99}save();toast('現在の編成をラック99にしました');render()}
function v17DevResetBattle(){if(S.battle){const q=QUESTS.find(x=>x.id===S.battle.quest);if(q)S.stamina=Math.min(S.maxStamina,S.stamina+q.cost)}S.battle=null;S.page='quests';save();render()}
function v17DevQuest(id){const q=QUESTS.find(x=>x.id===id);if(!q)return;const oldRank=S.rank,oldSta=S.stamina;S.rank=Math.max(S.rank,q.rank);S.stamina=Math.max(S.stamina,q.cost);startQuest(id);S.rank=oldRank;S.stamina=Math.max(S.stamina,oldSta);save()}
function v17DevPanel(){
 const ids=['a1_初級','a1_上級','a1_超級','a1_極'];
 return `<div class="card v17-dev"><div class="section-title"><div><div class="tiny">DEVELOPER MODE</div><h3>🧪 バランステスト</h3></div><button class="btn" onclick="v17SetDev(false)">終了</button></div><p class="tiny muted">通常の進行条件を無視して編成・降臨・ラックをすぐ検証できます。テスト操作は現在のローカルセーブに反映されます。</p><div class="v17-actions"><button class="btn" onclick="v17DevUnlockAll()">全キャラ解放 + Lv20</button><button class="btn" onclick="v17DevResources()">RANK / 素材 / 通貨 MAX</button><button class="btn" onclick="v17DevLuck99()">編成をラック99</button></div><div class="tiny muted v17-label">グリフォン直接出撃</div><div class="v17-diffs">${ids.map(id=>{const q=QUESTS.find(x=>x.id===id);return `<button class="v7-diff" onclick="v17DevQuest('${id}')">${q?.v7diff||id}</button>`}).join('')}</div></div>`
}
const V17_OTHER=otherView;
otherView=function(m){V17_OTHER(m);if(v17Dev())m.insertAdjacentHTML('afterbegin',v17DevPanel());else m.insertAdjacentHTML('beforeend',`<div class="card v17-dev-entry"><div><b>🧪 開発者モード</b><div class="tiny muted">編成・降臨・ラック99を高速テスト</div></div><button class="btn" onclick="v17SetDev(true)">ON</button></div>`)};
const V17_BATTLE=battleView;
battleView=function(m){V17_BATTLE(m);if(v17Dev())m.insertAdjacentHTML('beforeend',`<button class="v17-battle-exit" onclick="v17DevResetBattle()">🧪 戦闘を終了</button>`)};
const V17_HEADER=header;header=function(){let h=V17_HEADER().replace('TYPE SCRIPT v16','TYPE SCRIPT v17');if(v17Dev())h=h.replace('</header>',`<div class="v17-dev-badge">🧪 DEV</div></header>`);return h};
S.version=17;save();render();
