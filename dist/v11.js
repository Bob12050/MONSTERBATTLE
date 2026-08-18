// @ts-nocheck
// v11 ability foundation: multi-ability monsters, shared ability catalog, unique abilities.
const ABILITIES={
  break_killer:{id:'break_killer',name:'BREAKキラー',desc:'敵がBREAK中、与ダメージ+40%',category:'killer'},
  beast_killer:{id:'beast_killer',name:'獣キラー',desc:'獣族への与ダメージ+35%',category:'killer'},
  dragon_killer:{id:'dragon_killer',name:'ドラゴンキラー',desc:'ドラゴン族への与ダメージ+35%',category:'killer'},
  weak_killer:{id:'weak_killer',name:'弱点看破',desc:'属性有利時、さらに与ダメージ+20%',category:'killer'},
  healthy_boost:{id:'healthy_boost',name:'HP80%以上強化',desc:'HP80%以上で与ダメージ+25%',category:'condition'},
  lowhp_boost:{id:'lowhp_boost',name:'背水強化',desc:'HP50%以下で与ダメージ+40%',category:'condition'},
  barrier_breaker:{id:'barrier_breaker',name:'バリアブレイカー',desc:'バリアへのダメージ+50%',category:'gimmick'},
  heal_boost:{id:'heal_boost',name:'回復強化',desc:'自身が行う回復量+25%',category:'support'},
  party_guard:{id:'party_guard',name:'全体軽減',desc:'生存中、味方全体の被ダメージ-8%',category:'support'},
  start_ult_party:{id:'start_ult_party',name:'開幕奥義加速',desc:'戦闘開始時、味方全体の奥義+10',category:'support'},
  start_ult_self:{id:'start_ult_self',name:'自己奥義加速',desc:'戦闘開始時、自身の奥義+20',category:'support'},
  drop_boost_8:{id:'drop_boost_8',name:'幸運・大',desc:'リーダー時、ドロップ率+8%',category:'farm'},
  drop_boost_5:{id:'drop_boost_5',name:'幸運・小',desc:'リーダー時、ドロップ率+5%',category:'farm'},
  precision_discharge:{id:'precision_discharge',name:'精密放電',desc:'スキル命中時、35%でスタン',category:'unique',unique:true},
  moon_veil:{id:'moon_veil',name:'月守の結界',desc:'戦闘開始時、最初の敵攻撃を15%軽減',category:'unique',unique:true}
};

function v11AbilityIds(mon){return Array.isArray(mon?.abilities)?mon.abilities:[]}
function v11Has(monOrId,ability){const u=typeof monOrId==='string'?M(monOrId):monOrId;return v11AbilityIds(u).includes(ability)}
function v11Defs(monOrId){const u=typeof monOrId==='string'?M(monOrId):monOrId;return v11AbilityIds(u).map(id=>ABILITIES[id]).filter(Boolean)}
function v11Def(id){return ABILITIES[id]}
function v11AbilityPanel(mon,compact=false){
  const defs=v11Defs(mon);if(!defs.length)return '<div class="v11-abilities empty">アビリティなし</div>';
  return `<div class="v11-abilities ${compact?'compact':''}">${defs.map(a=>`<span class="v11-ability ${a.unique?'unique':''}" title="${a.desc}">${a.unique?'✦':'◆'} ${a.name}${compact?'':`<small>${a.desc}</small>`}</span>`).join('')}</div>`;
}
function v11ActiveAbilityDefs(id,q){
  const b=S.battle,f=b?.fighters.find(x=>x.id===id);if(!b||!f)return [];
  return v11Defs(id).filter(a=>{
    switch(a.id){
      case 'break_killer':return b.stunned;
      case 'beast_killer':return q.tribe==='獣';
      case 'dragon_killer':return q.tribe==='ドラゴン';
      case 'weak_killer':return elem(M(id).element,q.element)>1;
      case 'healthy_boost':return f.hp/f.maxHp>=.8;
      case 'lowhp_boost':return f.hp/f.maxHp<=.5;
      case 'barrier_breaker':return b.barrier>0;
      case 'party_guard':return f.hp>0;
      case 'moon_veil':return b.shield>0;
      case 'precision_discharge':return f.hp>0;
      default:return false;
    }
  });
}
function v11LogAbility(a){if(!a)return;const b=S.battle,msg=`◆ ${a.name} 発動！`;if(b.log[b.log.length-1]!==msg)b.log.push(msg)}
function v11DropBonus(mon){return v11Has(mon,'drop_boost_8')?.08:v11Has(mon,'drop_boost_5')?.05:0}

passiveInfo=function(id,q){
  const defs=v11ActiveAbilityDefs(id,q);let mult=1;
  for(const a of defs){
    if(a.id==='break_killer')mult*=1.4;
    if(a.id==='beast_killer'||a.id==='dragon_killer')mult*=1.35;
    if(a.id==='weak_killer')mult*=1.2;
    if(a.id==='healthy_boost')mult*=1.25;
    if(a.id==='lowhp_boost')mult*=1.4;
  }
  return{mult,label:defs.filter(a=>['break_killer','beast_killer','dragon_killer','weak_killer','healthy_boost','lowhp_boost'].includes(a.id)).map(a=>a.name).join(' + ')};
};
passiveActive=function(id,q){return v11ActiveAbilityDefs(id,q).length>0};
logPassive=function(name){const a=Object.values(ABILITIES).find(x=>x.name===name);v11LogAbility(a||{name})};

hit=function(base,label){
  const b=S.battle,q=Q(),f=active(),u=M(f.id),defs=v11ActiveAbilityDefs(f.id,q),p=passiveInfo(f.id,q);
  defs.filter(a=>['break_killer','beast_killer','dragon_killer','weak_killer','healthy_boost','lowhp_boost'].includes(a.id)).forEach(v11LogAbility);
  let dmg=Math.max(1,Math.floor(base*elem(u.element,q.element)*p.mult*(.94+Math.random()*.12)));
  if(b.barrier>0){
    let barrierMult=u.element==='火'?1.35:1;
    if(v11Has(u,'barrier_breaker')){barrierMult*=1.5;v11LogAbility(v11Def('barrier_breaker'))}
    const bd=Math.floor(dmg*barrierMult);b.barrier-=bd;dmg=Math.floor(dmg*.35);b.log.push(`${label}：バリア${bd} / 本体${dmg}`);
    if(b.barrier<=0){b.stunned=true;b.log.push('💥 BARRIER BREAK!')}
  }else b.log.push(`${label}：${dmg}ダメージ`);
  b.enemyHp-=dmg;
  if(q.gimmick==='heat'&&u.element==='水'&&b.heat>0){b.heat--;b.log.push('💧 水属性が灼熱コアを冷却：熱量-1')}
  if(q.gimmick==='aura'&&u.element==='光'&&b.aura>0){b.aura--;b.log.push('✨ 光属性が終焉オーラを1層解除')}
};

heal=function(rate,all=true){
  const f=active(),u=M(f.id),boost=v11Has(u,'heal_boost'),mul=boost?1.25:1;
  const arr=all?S.battle.fighters:S.battle.fighters.filter(x=>x.hp>0).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp).slice(0,1);
  if(boost)v11LogAbility(v11Def('heal_boost'));
  let total=0;arr.forEach(x=>{if(x.hp>0){const old=x.hp;x.hp=Math.min(x.maxHp,x.hp+Math.floor(x.maxHp*rate*mul));total+=x.hp-old}});
  S.battle.log.push(`💚 ${u.name}の回復：合計${total}`);
};

startQuest=function(id){
  const q=QUESTS.find(x=>x.id===id);if(!q||S.stamina<q.cost){toast('スタミナが足りません');return}
  S.stamina-=q.cost;
  const fighters=S.party.map(id=>{const u=M(id),o=S.owned[id],max=Math.floor(u.hp*(1+(o.level-1)*.06));return{id,hp:max,maxHp:max,ult:0,guard:false}});
  const log=[`${q.enemy}が現れた！`];
  S.battle={quest:id,enemyHp:q.hp,enemyMax:q.hp,round:1,turn:0,fighters,shield:0,debuff:0,barrier:q.gimmick==='barrier'?500:0,heat:0,aura:q.gimmick==='aura'?3:0,stunned:false,log};
  if(fighters.some(f=>v11Has(f.id,'start_ult_party'))){fighters.forEach(f=>f.ult=Math.min(100,f.ult+10));log.push('◆ 開幕奥義加速：味方全体の奥義+10')}
  fighters.forEach(f=>{if(v11Has(f.id,'start_ult_self')){f.ult=Math.min(100,f.ult+20);log.push(`◆ ${M(f.id).name}：自身の奥義+20`)}});
  if(fighters.some(f=>v11Has(f.id,'moon_veil'))){S.battle.shield=.15;log.push('◆ 月守の結界：最初の敵攻撃を15%軽減')}
  if(fighters.some(f=>v11Has(f.id,'party_guard')))log.push('◆ 全体軽減：所持者が生存中、味方全体を軽減');
  const lead=M(S.party[0]),bonus=v11DropBonus(lead);if(bonus)log.push(`◆ ${bonus>=.08?'幸運・大':'幸運・小'}：クリア時のドロップ率UP`);
  save();render();
};

battleCommand=function(cmd){
  const b=S.battle,f=active(),u=M(f.id),a=atkVal(f.id),e=V7_EVOS?.[f.id],evolved=!!S.owned[f.id]?.evolved;f.guard=false;
  if(cmd==='attack'){hit(a,`${u.name}の攻撃`);f.ult=Math.min(100,f.ult+18)}
  if(cmd==='guard'){f.guard=true;f.ult=Math.min(100,f.ult+8);b.log.push(`${u.name}は防御態勢`)}
  if(cmd==='skill'){
    if(u.id==='livan')heal(.18);
    else if(u.id==='slime'||u.id==='pix')heal(u.id==='pix'?.35:.28,false);
    else if(u.id==='shell'||u.id==='luna'){b.shield=Math.max(b.shield,u.id==='shell'?.35:.30);b.log.push(`🛡 ${u.skill}：味方全体を軽減`)}
    else if(u.id==='sylphin'){hit(a*1.2,u.skill);hit(a*1.2,u.skill)}
    else{
      const evoMult={garum:1.75,salam:2.05,griff:2.3,volc:2.5,fenrir:2.6};
      const mult=evolved&&e&&evoMult[u.id]?evoMult[u.id]:(u.id==='volt'?1.85:u.id==='fenrir'?2.1:1.6);
      hit(a*mult,u.skill);
      if(v11Has(u,'precision_discharge')&&Math.random()<.35){b.stunned=true;v11LogAbility(v11Def('precision_discharge'));b.log.push('⚡ STUN!')}
    }
    f.ult=Math.min(100,f.ult+14);
  }
  if(cmd==='ult'&&f.ult>=100){
    f.ult=0;
    const baseMult={garum:2.7,livan:1.9,sylphin:2.3,slime:0,shell:1.9,griff:3.3,volc:3.5,fenrir:3.65,volt:3.25,luna:2.2,pix:1.2};
    const evoMult={garum:3.3,salam:3.1,griff:4,volc:4.3,fenrir:4.6,livan:2.2,sylphin:2.85};
    const x=evolved&&e&&evoMult[u.id]?evoMult[u.id]:(baseMult[u.id]??2.5);
    if(x)hit(a*x,`🌠 ${u.ult}`);
    if(['livan','slime','luna','pix'].includes(u.id))heal(u.id==='livan'&&evolved?.35:({livan:.25,slime:.2,luna:.3,pix:.25})[u.id]);
    if(u.id==='sylphin'){b.fighters.forEach(x=>x.ult=Math.min(100,x.ult+(evolved?20:15)));b.log.push(`🌪 味方全体の奥義+${evolved?20:15}`)}
  }
  if(b.enemyHp<=0){win();return}nextTurn();
};

enemyTurn=function(){
  const b=S.battle,q=Q();
  if(b.stunned){b.log.push(`${q.enemy}は動けない！`);b.stunned=false}
  else{
    let mult=b.round%4===0?1.65:b.round%3===0?1.28:1;if(q.gimmick==='heat'&&b.heat>=3)mult=2.15;
    const guarder=b.fighters.find(x=>x.hp>0&&v11Has(x.id,'party_guard'));if(guarder)v11LogAbility(v11Def('party_guard'));
    for(const f of b.fighters){if(f.hp<=0)continue;const red=b.shield+(guarder?.08:0);const d=q.atk*mult*(f.guard?.5:1)*(1-Math.min(.7,red));f.hp-=Math.floor(d*(.9+Math.random()*.2));f.ult=Math.min(100,f.ult+12)}
    if(q.gimmick==='heat')b.heat=b.heat>=3?0:Math.min(3,b.heat+1);b.log.push(`${q.enemy}の攻撃！`);
  }
  b.shield=0;b.fighters.forEach(x=>x.guard=false);
  if(b.fighters.every(x=>x.hp<=0)){S.battle=null;save();render();modal('<div class="reveal"><h2>QUEST FAILED</h2><button class="bigbtn" onclick="closeModal()">戻る</button></div>');return}
  b.round++;b.turn=0;while(b.fighters[b.turn]?.hp<=0)b.turn++;render();
};

win=function(){
  const q=Q(),first=!S.cleared.includes(q.id),drops=[];S.gold+=q.gold;if(first){S.cleared.push(q.id);S.gems+=q.advent?20:35}gainExp(q.xp);
  const lead=M(S.party[0]),luck=S.owned[S.party[0]].luck,abilityBonus=v11DropBonus(lead),bonus=Math.min(.36,luck/99*.28+abilityBonus),luckMax=luck>=99;
  v7RollDrops(q,bonus,drops);if(luckMax)v7RollDrops(q,bonus,drops);
  if(q.advent){const key=q.id;if(!S.adventCleared.includes(key)){S.adventCleared.push(key);if(!drops.includes(q.drop)){addMonster(q.drop,5);drops.push(q.drop)}}}
  let mat=0;if(q.v7daily){mat=q.v7matAmount||3}else if(q.advent){mat=q.v7matAmount||1}else if(Math.random()<.45){mat=1}
  if(mat){if(luckMax)mat++;S.materials[q.v7mat||q.element]=(S.materials[q.v7mat||q.element]||0)+mat}
  S.battle=null;save();render();modal(`<div class="reveal"><div style="font-size:60px">🏆</div><h2>QUEST CLEAR!</h2><p>RANK EXP +${q.xp} / 🪙 +${q.gold}</p>${mat?`<p>${V7_EICON[q.v7mat||q.element]} 進化素材 +${mat}</p>`:''}${abilityBonus?`<p class="passive-result">◆ ${abilityBonus>=.08?'幸運・大':'幸運・小'}：ドロップ率 +${Math.round(abilityBonus*100)}%</p>`:''}${luckMax?'<div class="v7-luck">🍀 LUCK MAX BONUS：報酬宝箱 +1</div>':''}${drops.length?`<p>${drops.map(x=>MONSTERS[x].icon+' '+MONSTERS[x].name).join('<br>')}</p>`:'<p class="muted">モンスタードロップなし</p>'}<button class="bigbtn" onclick="closeModal()">OK</button></div>`);
};

v8Suitability=function(id,q){
  const u=M(id);let score=0;const reasons=[];if(q){const r=elem(u.element,q.element);
    if(r>1){score+=3;reasons.push('属性有利')}else if(r<1){score-=2;reasons.push('属性不利')}
    if(v11Has(u,'beast_killer')&&q.tribe==='獣'){score+=4;reasons.push('獣キラー')}
    if(v11Has(u,'dragon_killer')&&q.tribe==='ドラゴン'){score+=4;reasons.push('ドラゴンキラー')}
    if(v11Has(u,'weak_killer')&&r>1){score+=2;reasons.push('弱点看破')}
    if(q.gimmick==='barrier'){
      if(v11Has(u,'barrier_breaker')){score+=5;reasons.push('バリアブレイカー')}
      if(v11Has(u,'break_killer')){score+=2;reasons.push('BREAKキラー')}
      if(u.element==='火'){score+=2;reasons.push('バリア有効属性')}
    }
    if(q.gimmick==='heat'&&u.element==='水'){score+=5;reasons.push('熱量対策')}
    if(q.gimmick==='aura'&&u.element==='光'){score+=5;reasons.push('オーラ対策')}
    if(v8IsNormal(q)&&(v11Has(u,'drop_boost_8')||v11Has(u,'drop_boost_5'))){score+=2;reasons.push('周回向き')}
  }
  if(v11Has(u,'party_guard')){score+=1;reasons.push('全体軽減')}
  if(v11Has(u,'heal_boost')){score+=1;reasons.push('回復強化')}
  if(v11Has(u,'start_ult_party')||v11Has(u,'start_ult_self')){score+=1;reasons.push('奥義加速')}
  const grade=score>=6?'S':score>=4?'A':score>=2?'B':score>=0?'C':'D';return{score,grade,reasons:[...new Set(reasons)]};
};

v9Coverage=function(q){
  const units=S.party.map(id=>M(id)),items=[],add=(ok,label)=>items.push({ok,label});
  if(q.gimmick==='barrier')add(units.some(u=>v11Has(u,'barrier_breaker')||u.element==='火'),'バリア対策');
  if(q.gimmick==='heat')add(units.some(u=>u.element==='水'),'熱量対策');
  if(q.gimmick==='aura')add(units.some(u=>u.element==='光'),'オーラ対策');
  const adv=v8AdvElement(q.element);if(adv)add(units.some(u=>u.element===adv),`${adv}属性`);
  if(q.tribe==='獣')add(units.some(u=>v11Has(u,'beast_killer')),'獣キラー');
  if(q.tribe==='ドラゴン')add(units.some(u=>v11Has(u,'dragon_killer')),'竜キラー');
  return items.slice(0,4);
};

cardStarter=function(id){const u=M(id);return `<div class="starter" onclick="chooseStarter('${id}')"><div class="bigicon">${u.icon}</div><span class="rarity">${stars(u.rarity)}</span><h3>${u.name}</h3><div class="tags"><span class="tag">${u.element}</span><span class="tag">${u.tribe}</span><span class="tag role">${u.role}</span></div>${v11AbilityPanel(u,true)}</div>`};
homeView=function(m){const lead=M(S.party[0]),o=S.owned[S.party[0]],pct=Math.min(100,S.exp/needExp(S.rank)*100),dexCount=Object.keys(S.owned).length;m.innerHTML=`<section class="hero"><div class="tiny muted">MONSTER COLLECTION × COMMAND RPG</div><h1>組み合わせで、<br>適正を見つけろ。</h1><p>属性・種族・複数アビリティを組み合わせ、クエストごとの最適解を探そう。</p><button class="bigbtn" onclick="go('quests')">クエストへ</button> <button class="btn" onclick="go('dex')">📖 図鑑 ${dexCount}/${Object.keys(MONSTERS).length}</button></section><div class="section-title"><h2>プレイヤー</h2><span class="tiny muted">${S.exp}/${needExp(S.rank)} EXP</span></div><div class="card"><b>RANK ${S.rank}</b><div class="progress"><i style="width:${pct}%"></i></div></div><div class="section-title"><h2>リーダー</h2></div><div class="card"><div class="unit-row"><div class="avatar">${lead.icon}</div><div><b>${lead.name}</b><div class="tiny muted">🍀 ${o.luck}/99 · ${lead.role}</div>${v11AbilityPanel(lead,true)}</div></div></div>`};

monsterCard=function(id){
  const u=M(id),o=S.owned[id],cost=90+o.level*40,e=V7_EVOS[id],can=e&&!o.evolved&&o.level>=e.lv&&S.materials[e.mat]>=e.cost&&S.gold>=e.gold;
  return `<div class="card monster-card ${o.evolved?'evo':''}"><div class="unit-row"><div class="avatar">${u.icon}</div><div><span class="rarity">${stars(u.rarity)}</span><b style="display:block">${u.name}</b><div class="tags"><span class="tag">${u.element}</span><span class="tag">${u.tribe}</span><span class="tag role">${u.role}</span><span class="tag">Lv.${o.level}</span><span class="tag ${o.luck>=99?'luckmax':''}">🍀${o.luck}/99</span></div></div></div>${v11AbilityPanel(u)}<p class="tiny muted">${u.skill} — ${u.skillDesc}<br>🌠 ${u.ult} — ${u.ultDesc}<br>入手：${u.obtain}</p>${e&&!o.evolved?`<div class="v7-evo-preview"><b>進化先：${e.icon} ${e.name}</b><div class="tiny">必要 Lv.${e.lv} / ${V7_EICON[e.mat]}${e.cost} / 🪙${e.gold}</div></div>`:''}<button class="btn" ${S.gold<cost?'disabled':''} onclick="upgrade('${id}')">LvUP 🪙${cost}</button> <button class="btn" onclick="partyIn('${id}')">編成</button>${e&&!o.evolved?` <button class="btn warn" ${can?'':'disabled'} onclick="v7Evolve('${id}')">進化</button>`:''}</div>`;
};

dexCard=function(id,no){const owned=!!S.owned[id];if(!owned)return `<div class="card dex-card locked-dex"><div class="unit-row"><div class="avatar silhouette">⬛</div><div><div class="tiny muted">No.${String(no).padStart(3,'0')}</div><b>？？？？？？</b><div class="tags"><span class="tag">未入手</span></div></div></div><p class="tiny muted">入手すると能力・入手場所が解放されます。</p></div>`;const u=M(id),o=S.owned[id];return `<div class="card dex-card"><div class="unit-row"><div class="avatar">${u.icon}</div><div><div class="tiny muted">No.${String(no).padStart(3,'0')}</div><span class="rarity">${stars(u.rarity)}</span><b style="display:block">${u.name}</b><div class="tags"><span class="tag">${u.element}</span><span class="tag">${u.tribe}</span><span class="tag role">${u.role}</span><span class="tag">🍀${o.luck}/99</span></div></div></div>${v11AbilityPanel(u)}<p class="tiny"><b>${u.skill}</b> — ${u.skillDesc}<br><b>${u.ult}</b> — ${u.ultDesc}</p><div class="obtain-box tiny">📍 ${obtainText(id)}</div>${u.evolve?`<div class="tiny evo-line">進化先：${u.evolve}</div>`:''}</div>`};

v7RollGacha=function(){const r=Math.random(),pool=r<.08?['volt','luna']:['pix'];return pool[Math.floor(Math.random()*pool.length)]};
gachaView=function(m){m.innerHTML=`<div class="section-title"><h2>星導召喚</h2><span class="pill">💎 ${S.gems}</span></div><section class="hero v7-gacha"><div class="tiny">STAR SUMMON · LIMITED MONSTERS ONLY</div><h1>召喚限定モンスターと<br>契約を結べ。</h1><p>ガチャ排出モンスターはすべて召喚限定。★5排出率8%。★5は複数アビリティに加え、固有アビリティを持つ個体もいます。</p><div style="margin-top:18px"><button class="bigbtn" onclick="pull(1)">1回 💎50</button> <button class="bigbtn" onclick="pull(10)">10連 💎500</button></div></section>`};

v10FighterStateIcons=function(f){const xs=[];if(f.guard)xs.push(`<span title="防御">🛡</span>`);if(S.battle.shield>0)xs.push(`<span title="軽減">🔷</span>`);if(v11ActiveAbilityDefs(f.id,Q()).length)xs.push(`<span title="アビリティ発動中">◆</span>`);return xs.join('')};
battleView=function(m){
  const b=S.battle,q=Q(),f=active(),u=M(f.id),eventText=v10EventText(b),hp=Math.max(0,b.enemyHp/b.enemyMax*100),activeDefs=v11ActiveAbilityDefs(f.id,q).slice(0,2);
  m.innerHTML=`<section class="v10-battle"><div class="v10-topbar"><div><span>ROUND ${b.round}</span><b>${q.name}</b></div><button onclick="S.battle=null;save();render()">リタイア</button></div><div class="v10-enemy-stage"><div class="v10-enemy-card"><div class="v10-enemy-status">${v10EnemyStateIcons(q,b)}</div><div class="v10-enemy-name"><span>${q.element}・${q.tribe}</span><b>${q.enemy}</b></div><div class="v10-enemy-sprite">${q.enemyIcon}</div><div class="v10-enemy-hp-row"><span>HP</span><div class="v10-enemy-hp"><i style="width:${hp}%"></i></div><b>${Math.max(0,b.enemyHp)}/${b.enemyMax}</b></div>${eventText?`<div class="v10-event-pop">${eventText}</div>`:''}</div></div><div class="v10-party-row">${b.fighters.map((x,i)=>v10Fighter(x,i)).join('')}</div><div class="v10-active-strip"><div class="v10-active-mon"><span>${u.icon}</span><div><small>行動中</small><b>${u.name}</b></div></div><div class="v10-active-tags"><span>${u.element}</span><span>${u.role}</span>${activeDefs.map(a=>`<span class="active ${a.unique?'v11-unique-active':''}">${a.unique?'✦':'◆'} ${a.name}</span>`).join('')}</div></div><div class="v10-commands">${v10CommandButton('attack','⚔','攻撃','通常攻撃')}${v10CommandButton('skill','✨','スキル',u.skill)}${v10CommandButton('guard','🛡','防御','被ダメ軽減')}${v10CommandButton('ult','🌠','奥義',u.ult,f.ult<100,true)}</div></section>`;
  if(eventText)setTimeout(()=>document.querySelector('.v10-event-pop')?.classList.add('hide'),950);
};

const V11_OTHER=otherView;
otherView=function(m){V11_OTHER(m);m.insertAdjacentHTML('afterbegin',`<div class="card v11-summary"><div class="tiny muted">v11 FOUNDATION</div><h3>◆ 複数アビリティ基盤</h3><p class="tiny muted">共通アビリティの組み合わせ＋一部最高レアの固有アビリティで、1000体規模まで差別化できる土台に移行しました。</p><div class="v11-legend"><span>◆ 共通アビリティ</span><span class="unique">✦ 固有アビリティ</span></div></div>`)};

const V11_HEADER=header;
header=function(){return V11_HEADER().replace('TYPE SCRIPT v10','TYPE SCRIPT v11').replace('TYPE SCRIPT v9','TYPE SCRIPT v11')};
S.version=11;save();render();
