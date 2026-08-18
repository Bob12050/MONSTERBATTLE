// @ts-nocheck
// v19: hierarchical quest hub inspired by classic mobile RPG quest grouping.
function v19Group(){return localStorage.getItem('astraQuestGroup')||''}
function v19Sub(){return localStorage.getItem('astraQuestSub')||''}
function v19Open(group,sub=''){localStorage.setItem('astraQuestGroup',group);if(sub)localStorage.setItem('astraQuestSub',sub);else localStorage.removeItem('astraQuestSub');render()}
function v19Back(){if(v19Sub())localStorage.removeItem('astraQuestSub');else localStorage.removeItem('astraQuestGroup');render()}
function v19ClearQuestNav(){localStorage.removeItem('astraQuestGroup');localStorage.removeItem('astraQuestSub')}
const V19_GO=go;go=function(p){if(p==='quests')v19ClearQuestNav();V19_GO(p)};

function v19ClearCount(ids){return ids.filter(id=>S.cleared.includes(id)||S.adventCleared?.includes(id)).length}
function v19HubRow(icon,title,sub,badge,onclick,element=''){return `<button class="v19-hub-row ${element}" onclick="${onclick}"><span class="v19-hub-icon">${icon}</span><span class="v19-hub-copy"><b>${title}</b><small>${sub}</small></span>${badge?`<span class="v19-hub-badge">${badge}</span>`:''}<span class="v19-chevron">›</span></button>`}
function v19StageRow(q){const lock=S.rank<q.rank,clear=S.cleared.includes(q.id)||S.adventCleared?.includes(q.id);return `<button class="v19-stage ${lock?'locked':''}" ${lock?'disabled':`onclick="startQuest('${q.id}')"`}><span class="v19-stage-icon">${q.icon||'⚔️'}</span><span class="v19-stage-main"><b>${q.name}</b><small>${q.enemy} · ${q.element}/${q.tribe}</small><small>⚡ ${q.cost}　RANK ${q.rank}</small></span>${clear?'<span class="v19-clear">CLEAR!</span>':''}<span class="v19-detail">詳細</span></button>`}
function v19Top(title,eyebrow='QUEST'){return `<div class="v19-title"><button class="v19-back" onclick="v19Back()">←</button><div><div class="tiny muted">${eyebrow}</div><h2>${title}</h2></div></div>`}

const V19_CHAPTERS=[
 {id:'c1',title:'第1章 緑風の平原',icon:'🌿',sub:'はじまりの草原と森の番獣',ids:['n1','n1b','n1c'],element:'wood'},
 {id:'c2',title:'第2章 灼熱山脈',icon:'🔥',sub:'火山道を越え、火口の飛竜へ',ids:['n2','n2b','n2c'],element:'fire'},
 {id:'c3',title:'第3章 轟岩洞窟',icon:'🪨',sub:'鉱脈を守る甲虫と岩王',ids:['n3','n3b','n3c'],element:'earth'}
];
function v19QuestRoot(m){
 const normalIds=QUESTS.filter(q=>!q.advent&&!q.v7daily).map(q=>q.id),daily=QUESTS.filter(q=>q.v7daily),adv=QUESTS.filter(q=>q.advent);
 m.innerHTML=`<div class="section-title"><div><div class="tiny muted">QUEST HUB</div><h2>クエスト</h2></div><span class="tiny muted">カテゴリを選択</span></div><div class="v19-hub-list">${v19HubRow('📖','通常クエスト','章・地域ごとに攻略',`${v19ClearCount(normalIds)}/${normalIds.length}`,"v19Open('normal')")}${v19HubRow('💎','曜日・素材ダンジョン','進化素材を集める',`${daily.length}種`,"v19Open('daily')")}${v19HubRow('⚔️','降臨ダンジョン','ボスを周回してラック99へ',`${Object.keys(V7_ADVENT_BASE).length}体`,"v19Open('advent')")}</div>`;
}
function v19Normal(m){const sub=v19Sub();if(!sub){m.innerHTML=v19Top('通常クエスト','NORMAL QUEST')+`<div class="v19-hub-list">${V19_CHAPTERS.map(c=>v19HubRow(c.icon,c.title,c.sub,`${v19ClearCount(c.ids)}/${c.ids.length}`,`v19Open('normal','${c.id}')`,c.element)).join('')}</div>`;return}const c=V19_CHAPTERS.find(x=>x.id===sub);const qs=(c?.ids||[]).map(id=>QUESTS.find(q=>q.id===id)).filter(Boolean);m.innerHTML=v19Top(c?.title||'通常クエスト','NORMAL QUEST')+`<div class="v19-stage-list">${qs.map(v19StageRow).join('')}</div>`}
function v19Daily(m){const qs=QUESTS.filter(q=>q.v7daily);m.innerHTML=v19Top('曜日・素材ダンジョン','DAILY')+`<div class="v19-stage-list">${qs.map(v19StageRow).join('')}</div>`}
function v19Advent(m){const sub=v19Sub();if(!sub){m.innerHTML=v19Top('降臨ダンジョン','ADVENT')+`<div class="v19-hub-list">${Object.keys(V7_ADVENT_BASE).map(aid=>{const a=V7_ADVENT_BASE[aid],u=MONSTERS[a.drop];const ids=Object.keys(V7_DIFF).map(d=>`${aid}_${d}`);return v19HubRow(a.enemyIcon,a.name,`${u?.name||a.enemy} · ${a.element}/${a.tribe}`,`${v19ClearCount(ids)}/4`,`v19Open('advent','${aid}')`,String(a.element));}).join('')}</div>`;return}const a=V7_ADVENT_BASE[sub];const u=MONSTERS[a?.drop];const qs=Object.keys(V7_DIFF).map(d=>QUESTS.find(q=>q.id===`${sub}_${d}`)).filter(Boolean);m.innerHTML=v19Top(a?.name||'降臨','ADVENT')+`<div class="v19-advent-head"><span class="v19-boss-icon">${a?.enemyIcon||'⚔️'}</span><div><div class="tiny muted">DROP MONSTER</div><b>${u?.name||a?.enemy||''}</b><small>${a?.element||''} / ${a?.tribe||''}</small></div></div>${a?.gimmickText?`<div class="v19-gimmick">⚙ ${a.gimmickText}</div>`:''}<div class="v19-stage-list">${qs.map(v19StageRow).join('')}</div>`}
questView=function(m){const g=v19Group();if(!g)return v19QuestRoot(m);if(g==='normal')return v19Normal(m);if(g==='daily')return v19Daily(m);if(g==='advent')return v19Advent(m);v19ClearQuestNav();v19QuestRoot(m)};
const V19_HEADER=header;header=function(){return V19_HEADER().replace('TYPE SCRIPT v18','TYPE SCRIPT v19').replace('TYPE SCRIPT v17','TYPE SCRIPT v19')};
S.version=19;save();render();
