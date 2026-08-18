// @ts-nocheck
// v7 extension: evolution materials, advent difficulties, luck-max rewards, summon animation.
const V7_ELEMENTS=['火','水','木','光','闇'];
const V7_EICON={火:'🔥',水:'💧',木:'🌿',光:'✨',闇:'🌑'};
const V7_EVOS={
 garum:{name:'獄炎牙王 ガルム',icon:'🐺🔥',hp:1.23,atk:1.26,skill:'獄炎牙連撃',skillDesc:'敵に175%ダメージ',ult:'獄炎王ハウリング',ultDesc:'敵に330%ダメージ',mat:'火',cost:5,gold:1200,lv:5},
 livan:{name:'蒼海神獣 リヴァン',icon:'🐋💎',hp:1.28,atk:1.18,skill:'大癒潮',skillDesc:'味方全体を24%回復',ult:'神海アビスウェーブ',ultDesc:'敵に220%＋全体35%回復',mat:'水',cost:5,gold:1200,lv:5},
 sylphin:{name:'翠嵐天獣 シルフィン',icon:'🦅🌪️',hp:1.2,atk:1.24,skill:'天嵐双爪',skillDesc:'敵に145%×2回',ult:'天翔テンペスト',ultDesc:'敵に285%＋味方奥義+20',mat:'木',cost:5,gold:1200,lv:5},
 salam:{name:'爆尾竜 サラマンダ',icon:'🦎🔥',hp:1.2,atk:1.25,skill:'爆炎ブレス',skillDesc:'敵に205%ダメージ',ult:'グランヴォルケイン',ultDesc:'敵に310%ダメージ',mat:'火',cost:4,gold:900,lv:5},
 griff:{name:'翠嵐神王 グリフォン',icon:'🦁🌪️',hp:1.22,atk:1.25,skill:'神王翼裂破',skillDesc:'敵に230%ダメージ',ult:'神嵐エメラルドテンペスト',ultDesc:'敵に400%ダメージ',mat:'木',cost:8,gold:1800,lv:8},
 volc:{name:'煉獄炎龍 ヴォルカノス',icon:'🐉🔥',hp:1.25,atk:1.27,skill:'煉獄ブレス',skillDesc:'敵に250%ダメージ',ult:'インフェルノ・オーバーコア',ultDesc:'敵に430%ダメージ',mat:'火',cost:8,gold:1800,lv:8},
 fenrir:{name:'終焉神狼 フェンリル',icon:'🐺🌑',hp:1.2,atk:1.3,skill:'神終牙',skillDesc:'敵に260%ダメージ',ult:'終焉ラグナロクバイト',ultDesc:'敵に460%ダメージ',mat:'闇',cost:8,gold:2000,lv:8}
};
const V7_ADVENT_BASE={
 a1:{name:'翠嵐王、天を裂く',icon:'🌪️',enemy:'翠嵐王グリフォン',enemyIcon:'🦁',element:'木',tribe:'幻獣',hp:1500,atk:48,rank:2,drop:'griff',gimmick:'barrier',gimmickText:'翠嵐バリア：火属性とブレイカーが有効'},
 a2:{name:'獄炎龍、地を焦がす',icon:'🔥',enemy:'獄炎龍ヴォルカノス',enemyIcon:'🐉',element:'火',tribe:'ドラゴン',hp:1900,atk:57,rank:4,drop:'volc',gimmick:'heat',gimmickText:'灼熱コア：水属性攻撃で熱量を下げる'},
 a3:{name:'終焉を喰らう魔狼',icon:'🌑',enemy:'終牙狼フェンリル',enemyIcon:'🐺',element:'闇',tribe:'幻獣',hp:2450,atk:67,rank:6,drop:'fenrir',gimmick:'aura',gimmickText:'終焉オーラ：光属性攻撃で層を剥がす'}
};
const V7_DIFF={
 '初級':{hm:.72,am:.72,cost:8,rank:0,drop:.25,xp:70,gold:220,mat:1},
 '上級':{hm:1,am:1,cost:12,rank:1,drop:.45,xp:120,gold:420,mat:2},
 '超級':{hm:1.35,am:1.25,cost:16,rank:2,drop:.70,xp:185,gold:650,mat:3},
 '極':{hm:1.75,am:1.48,cost:20,rank:3,drop:1,xp:270,gold:950,mat:4}
};
function v7EnsureState(){
 S.version=7;
 if(!S.materials)S.materials={火:0,水:0,木:0,光:0,闇:0};
 for(const e of V7_ELEMENTS)if(typeof S.materials[e]!=='number')S.materials[e]=0;
 if(!Array.isArray(S.titles)||!S.titles.length)S.titles=['はじまりの契約者'];
 if(!S.selectedTitle)S.selectedTitle=S.titles[0];
}
v7EnsureState();

const V6_M=M;
M=function(id){const b=MONSTERS[id],o=S.owned[id],e=V7_EVOS[id];if(!o?.evolved||!e)return V6_M(id);return{...b,name:e.name,icon:e.icon,rarity:b.rarity+1,hp:Math.floor(b.hp*e.hp),atk:Math.floor(b.atk*e.atk),skill:e.skill,skillDesc:e.skillDesc,ult:e.ult,ultDesc:e.ultDesc}}

function v7NormalQuests(){
 const old=QUESTS.filter(q=>!q.advent);
 const byId=Object.fromEntries(old.map(q=>[q.id,q]));
 return [
  byId.n1||{id:'n1',name:'1-1 はじまりの草原',icon:'🌿',cost:4,rank:1,enemy:'森牙ウルフ',enemyIcon:'🐺',element:'木',tribe:'獣',hp:430,atk:20,xp:24,gold:80,drops:[['slime',.28],['rabit',.22]]},
  {id:'n1b',name:'1-2 角兎の群れ',icon:'🐇',cost:4,rank:1,enemy:'角跳獣リーダー',enemyIcon:'🐇',element:'木',tribe:'獣',hp:520,atk:22,xp:28,gold:95,drops:[['rabit',.30]]},
  {id:'n1c',name:'1-3 森奥の番獣',icon:'🌲',cost:5,rank:1,enemy:'翠森ベア',enemyIcon:'🐻',element:'木',tribe:'獣',hp:650,atk:26,xp:34,gold:110,drops:[['slime',.25],['rabit',.25]]},
  byId.n2||{id:'n2',name:'2-1 灼熱の火山道',icon:'🌋',cost:7,rank:2,enemy:'火鱗ワイバーン',enemyIcon:'🐲',element:'火',tribe:'ドラゴン',hp:780,atk:32,xp:48,gold:160,drops:[['salam',.25],['ember',.22]]},
  {id:'n2b',name:'2-2 噴炎の獣道',icon:'🔥',cost:7,rank:2,enemy:'紅蓮ボア',enemyIcon:'🐗',element:'火',tribe:'獣',hp:900,atk:35,xp:54,gold:180,drops:[['ember',.30]]},
  {id:'n2c',name:'2-3 火口の飛竜',icon:'🐲',cost:8,rank:2,enemy:'火山飛竜',enemyIcon:'🐉',element:'火',tribe:'ドラゴン',hp:1040,atk:38,xp:62,gold:210,drops:[['salam',.32]]},
  byId.n3||{id:'n3',name:'3-1 轟岩洞',icon:'🪨',cost:9,rank:3,enemy:'岩殻虫ロード',enemyIcon:'🪲',element:'木',tribe:'甲虫',hp:1080,atk:40,xp:70,gold:240,drops:[['shell',.30]]},
  {id:'n3b',name:'3-2 鉱脈の守護虫',icon:'⛏️',cost:9,rank:3,enemy:'鉱晶ビートル',enemyIcon:'🪲',element:'木',tribe:'甲虫',hp:1240,atk:43,xp:78,gold:270,drops:[['shell',.34]]},
  {id:'n3c',name:'3-3 岩王の間',icon:'🏔️',cost:10,rank:3,enemy:'岩王ゴーレム',enemyIcon:'🗿',element:'木',tribe:'機獣',hp:1420,atk:47,xp:88,gold:310,drops:[['shell',.38]]}
 ];
}
function v7AdventQuest(aid,diff){const a=V7_ADVENT_BASE[aid],d=V7_DIFF[diff];return{id:`${aid}_${diff}`,name:`${a.name}【${diff}】`,icon:a.icon,cost:d.cost,rank:a.rank+d.rank,enemy:a.enemy,enemyIcon:a.enemyIcon,element:a.element,tribe:a.tribe,hp:Math.floor(a.hp*d.hm),atk:Math.floor(a.atk*d.am),xp:d.xp,gold:d.gold,drop:a.drop,dropRate:d.drop,advent:true,gimmick:a.gimmick,gimmickText:a.gimmickText,v7diff:diff,v7aid:aid,v7mat:a.element,v7matAmount:d.mat};}
function v7TodayElements(){const day=new Date().getDay();return day===2?['火']:day===3?['水']:day===4?['木']:day===5?['光']:day===6?['闇']:V7_ELEMENTS}
function v7DailyQuests(){return v7TodayElements().map((e,i)=>({id:`daily_${e}`,name:`${V7_EICON[e]} ${e}晶の試練`,icon:'💎',cost:8,rank:1,enemy:`${e}晶の守護像`,enemyIcon:'🗿',element:e,tribe:'機獣',hp:720+i*30,atk:30+i*2,xp:45,gold:140,drops:[],v7daily:true,v7mat:e,v7matAmount:3}));}
(function patchQuests(){const normal=v7NormalQuests();const adv=[];for(const aid of Object.keys(V7_ADVENT_BASE))for(const diff of Object.keys(V7_DIFF))adv.push(v7AdventQuest(aid,diff));QUESTS.splice(0,QUESTS.length,...normal,...v7DailyQuests(),...adv)})();

header=function(){const mats=V7_ELEMENTS.map(e=>`<span class="pill v7-mat" title="${e}進化素材">${V7_EICON[e]}${S.materials[e]}</span>`).join('');return `<header><div class="topline"><div class="brand">ASTRA CROWN<small>TYPE SCRIPT v7</small></div><div class="resources"><span class="pill">RANK <b>${S.rank}</b></span><span class="pill">⚡ ${S.stamina}/${S.maxStamina}</span><span class="pill">💎 ${S.gems}</span><span class="pill">🪙 ${S.gold}</span>${mats}</div></div></header>`}

function v7QuestCard(q){const lock=S.rank<q.rank;return `<div class="card quest ${lock?'locked':''}" onclick="${lock?'':`startQuest('${q.id}')`}"><div class="qicon">${q.icon}</div><div class="tiny muted">RANK ${q.rank} · ⚡${q.cost}</div><h3>${q.name}</h3><div class="tiny muted">${q.enemy}</div><div class="tags"><span class="tag">${q.element}</span><span class="tag">${q.tribe}</span>${q.v7mat?`<span class="tag">素材 ${V7_EICON[q.v7mat]}</span>`:''}</div></div>`}
questView=function(m){const normals=QUESTS.filter(q=>!q.advent&&!q.v7daily);let h=`<div class="section-title"><div><div class="tiny muted">QUEST</div><h2>通常クエスト</h2></div></div><div class="notice">通常クエストでも対応属性の進化素材が低確率で落ちます。</div>`;for(let c=1;c<=3;c++){const ids=c===1?['n1','n1b','n1c']:c===2?['n2','n2b','n2c']:['n3','n3b','n3c'];h+=`<div class="v7-chapter"><h3>${['','第1章 緑風の平原','第2章 灼熱山脈','第3章 轟岩洞窟'][c]}</h3><div class="grid three">${ids.map(id=>v7QuestCard(normals.find(q=>q.id===id))).join('')}</div></div>`}h+=`<div class="section-title"><div><div class="tiny muted">DAILY</div><h2>曜日ダンジョン</h2></div><span class="tiny muted">火曜=火 / 水曜=水 / 木曜=木 / 金曜=光 / 土曜=闇</span></div><div class="grid three">${QUESTS.filter(q=>q.v7daily).map(v7QuestCard).join('')}</div><div class="section-title"><div><div class="tiny muted">ADVENT</div><h2>降臨ダンジョン</h2></div><span class="tiny muted">難易度が高いほどドロップ率UP</span></div>`;for(const aid of Object.keys(V7_ADVENT_BASE)){const a=V7_ADVENT_BASE[aid];h+=`<div class="card v7-advent"><div class="unit-row"><div class="avatar">${a.enemyIcon}</div><div><h3>${a.name}</h3><div class="tiny muted">${a.element} / ${a.tribe}</div><div class="gimmick">⚙ ${a.gimmickText}</div></div></div><div class="v7-diffs">${Object.keys(V7_DIFF).map(diff=>{const q=QUESTS.find(x=>x.id===`${aid}_${diff}`),lock=S.rank<q.rank;return `<button ${lock?'disabled':''} class="v7-diff ${diff==='極'?'extreme':''}" onclick="startQuest('${q.id}')"><b>${diff}</b><small>DROP ${Math.round(q.dropRate*100)}%</small><small>⚡${q.cost}${lock?` / RANK ${q.rank}`:''}</small></button>`}).join('')}</div></div>`}m.innerHTML=h}

const V6_ADD=addMonster;
addMonster=function(id,luck=1){V6_ADD(id,luck);if(S.owned[id]?.luck>=99&&!S.titles.includes('極運の導き手')){S.titles.push('極運の導き手');S.selectedTitle='極運の導き手';toast('🏆 称号「極運の導き手」を獲得！')}}
function v7RollDrops(q,bonus,drops){if(q.advent){if(Math.random()<(q.dropRate||0)+bonus){addMonster(q.drop,5);drops.push(q.drop)}}else if(q.drops)for(const [id,r] of q.drops)if(Math.random()<Number(r)+bonus){addMonster(id);drops.push(id)}}
win=function(){const q=Q(),first=!S.cleared.includes(q.id),drops=[];S.gold+=q.gold;if(first){S.cleared.push(q.id);S.gems+=q.advent?20:35}gainExp(q.xp);const lead=M(S.party[0]),luck=S.owned[S.party[0]].luck,passive=lead.passive==='drop8'?.08:lead.passive==='drop5'?.05:0,bonus=Math.min(.36,luck/99*.28+passive),luckMax=luck>=99;v7RollDrops(q,bonus,drops);if(luckMax)v7RollDrops(q,bonus,drops);if(q.advent){const key=q.id;if(!S.adventCleared.includes(key)){S.adventCleared.push(key);if(!drops.includes(q.drop)){addMonster(q.drop,5);drops.push(q.drop)}}}let mat=0;if(q.v7daily){mat=q.v7matAmount||3}else if(q.advent){mat=q.v7matAmount||1}else if(Math.random()<.45){mat=1}if(mat){if(luckMax)mat++;S.materials[q.v7mat||q.element]=(S.materials[q.v7mat||q.element]||0)+mat}S.battle=null;save();render();modal(`<div class="reveal"><div style="font-size:60px">🏆</div><h2>QUEST CLEAR!</h2><p>RANK EXP +${q.xp} / 🪙 +${q.gold}</p>${mat?`<p>${V7_EICON[q.v7mat||q.element]} 進化素材 +${mat}</p>`:''}${luckMax?'<div class="v7-luck">🍀 LUCK MAX BONUS：報酬宝箱 +1</div>':''}${drops.length?`<p>${drops.map(x=>MONSTERS[x].icon+' '+MONSTERS[x].name).join('<br>')}</p>`:'<p class="muted">モンスタードロップなし</p>'}<button class="bigbtn" onclick="closeModal()">OK</button></div>`)}

monsterCard=function(id){const u=M(id),o=S.owned[id],cost=90+o.level*40,e=V7_EVOS[id],can=e&&!o.evolved&&o.level>=e.lv&&S.materials[e.mat]>=e.cost&&S.gold>=e.gold;return `<div class="card monster-card ${o.evolved?'evo':''}"><div class="unit-row"><div class="avatar">${u.icon}</div><div><span class="rarity">${stars(u.rarity)}</span><b style="display:block">${u.name}</b><div class="tags"><span class="tag">${u.element}</span><span class="tag">${u.tribe}</span><span class="tag role">${u.role}</span><span class="tag">Lv.${o.level}</span><span class="tag ${o.luck>=99?'luckmax':''}">🍀${o.luck}/99</span></div></div></div><div class="passive-box tiny"><b>◆ ${u.passiveName}</b><br>${u.passiveDesc}</div><p class="tiny muted">${u.skill} — ${u.skillDesc}<br>🌠 ${u.ult} — ${u.ultDesc}<br>入手：${u.obtain}</p>${e&&!o.evolved?`<div class="v7-evo-preview"><b>進化先：${e.icon} ${e.name}</b><div class="tiny">必要 Lv.${e.lv} / ${V7_EICON[e.mat]}${e.cost} / 🪙${e.gold}</div></div>`:''}<button class="btn" ${S.gold<cost?'disabled':''} onclick="upgrade('${id}')">LvUP 🪙${cost}</button> <button class="btn" onclick="partyIn('${id}')">編成</button>${e&&!o.evolved?` <button class="btn warn" ${can?'':'disabled'} onclick="v7Evolve('${id}')">進化</button>`:''}</div>`}
function v7Evolve(id){const o=S.owned[id],e=V7_EVOS[id];if(!e||o.evolved||o.level<e.lv||S.materials[e.mat]<e.cost||S.gold<e.gold)return;S.materials[e.mat]-=e.cost;S.gold-=e.gold;o.evolved=true;save();modal(`<div class="reveal"><div class="v7-evo-anim"><span>${MONSTERS[id].icon}</span><b>→</b><span>${e.icon}</span></div><h2>${e.name} に進化！</h2><p>${e.skill}<br>${e.ult}</p><button class="bigbtn" onclick="closeModal()">OK</button></div>`)}

const V6_BOX=boxView;
boxView=function(m){V6_BOX(m);const title=m.querySelector('.section-title');if(title)title.insertAdjacentHTML('beforeend','<button class="btn" onclick="go(\'dex\')">📖 図鑑</button>')}

const V6_BATTLE_COMMAND=battleCommand;
battleCommand=function(cmd){const f=active(),e=V7_EVOS[f.id],evolved=!!S.owned[f.id]?.evolved;if(!evolved||!e)return V6_BATTLE_COMMAND(cmd);if(cmd==='skill'&&['garum','salam','griff','volc','fenrir'].includes(f.id)){const b=S.battle,u=M(f.id),a=atkVal(f.id),mult={garum:1.75,salam:2.05,griff:2.3,volc:2.5,fenrir:2.6}[f.id];f.guard=false;hit(a*mult,u.skill);f.ult=Math.min(100,f.ult+14);if(b.enemyHp<=0)return win();return nextTurn()}if(cmd==='ult'&&f.ult>=100){const b=S.battle,u=M(f.id),a=atkVal(f.id),mult={garum:3.3,salam:3.1,griff:4,volc:4.3,fenrir:4.6,livan:2.2,sylphin:2.85}[f.id];if(mult){f.ult=0;hit(a*mult,`🌠 ${u.ult}`);if(f.id==='livan')heal(.35);if(f.id==='sylphin')b.fighters.forEach(x=>x.ult=Math.min(100,x.ult+20));if(b.enemyHp<=0)return win();return nextTurn()}}return V6_BATTLE_COMMAND(cmd)}

gachaView=function(m){m.innerHTML=`<div class="section-title"><h2>星導召喚</h2><span class="pill">💎 ${S.gems}</span></div><section class="hero v7-gacha"><div class="tiny">STAR SUMMON</div><h1>星晶を砕き、<br>契約を結べ。</h1><p>★5排出率8%。虹色の召喚石に変化すれば★5確定。</p><div style="margin-top:18px"><button class="bigbtn" onclick="pull(1)">1回 💎50</button> <button class="bigbtn" onclick="pull(10)">10連 💎500</button></div></section>`}
function v7RollGacha(){const r=Math.random(),pool=r<.08?['volt','luna']:r<.4?['garum','livan','sylphin']:['pix','shell','salam'];return pool[Math.floor(Math.random()*pool.length)]}
pull=function(n){const c=n*50;if(S.gems<c){toast('星晶不足');return}S.gems-=c;const out=[];for(let i=0;i<n;i++)out.push(v7RollGacha());const ssr=out.some(id=>MONSTERS[id].rarity>=5);save();modal(`<div class="v7-summon ${ssr?'ssr':''}"><h2>${ssr?'★5確定！':'星晶召喚'}</h2><div class="v7-orb ${ssr?'rainbow':''}">✦</div><p>召喚石が共鳴している……</p></div>`);setTimeout(()=>v7ShowResults(out),1800)}
function v7ShowResults(out){out.forEach(id=>addMonster(id));save();const sheet=document.querySelector('.modal .sheet');if(!sheet)return;sheet.innerHTML=`<div class="reveal"><h2>召喚結果</h2><div class="grid two">${out.map((id,i)=>{const u=M(id);return `<div class="card v7-result ${u.rarity>=5?'ssr':''}" style="animation-delay:${i*.05}s"><div class="avatar">${u.icon}</div><div><span class="rarity">${stars(u.rarity)}</span><b style="display:block">${u.name}</b><span class="tiny muted">ラック ${S.owned[id].luck}/99</span></div></div>`}).join('')}</div><button class="bigbtn" onclick="closeModal()">OK</button></div>`}

const V6_OTHER=otherView;
otherView=function(m){V6_OTHER(m);m.insertAdjacentHTML('afterbegin',`<div class="card v7-summary"><h3>v7 新要素</h3><p class="tiny muted">進化素材 / 進化後スキル強化 / 降臨4難易度 / ラックMAX宝箱+1 / 称号 / ガチャ確定演出</p><p class="tiny">称号：<b>${S.selectedTitle}</b></p><div>${S.titles.map(t=>`<button class="btn ${S.selectedTitle===t?'good':''}" onclick="v7Title('${t}')">${t}</button>`).join(' ')}</div><p class="tiny">素材：${V7_ELEMENTS.map(e=>`${V7_EICON[e]}${S.materials[e]}`).join(' / ')}</p></div>`)}
function v7Title(t){S.selectedTitle=t;save();render()}

save();render();
