// @ts-nocheck
// v12 roster balance: canonical 30 shared abilities + 14-monster assignment rules.
Object.assign(ABILITIES,{
  barrier_breaker:{id:'barrier_breaker',name:'バリアブレイカー',desc:'バリアへのダメージ+50%',category:'gimmick'},
  heat_breaker:{id:'heat_breaker',name:'灼熱ブレイカー',desc:'攻撃時、灼熱コアの熱量を追加で1減少',category:'gimmick'},
  aura_breaker:{id:'aura_breaker',name:'オーラブレイカー',desc:'攻撃時、終焉オーラを追加で1層解除',category:'gimmick'},
  poison_resist:{id:'poison_resist',name:'毒耐性',desc:'毒の付与率・効果を80%軽減',category:'resist'},
  paralyze_resist:{id:'paralyze_resist',name:'麻痺耐性',desc:'麻痺の付与率を80%軽減',category:'resist'},
  seal_resist:{id:'seal_resist',name:'封印耐性',desc:'スキル・奥義封印の付与率を80%軽減',category:'resist'},
  beast_killer:{id:'beast_killer',name:'獣キラー',desc:'獣族への与ダメージ+35%',category:'killer'},
  dragon_killer:{id:'dragon_killer',name:'ドラゴンキラー',desc:'ドラゴン族への与ダメージ+35%',category:'killer'},
  phantom_killer:{id:'phantom_killer',name:'幻獣キラー',desc:'幻獣族への与ダメージ+35%',category:'killer'},
  machine_killer:{id:'machine_killer',name:'機獣キラー',desc:'機獣族への与ダメージ+35%',category:'killer'},
  fairy_killer:{id:'fairy_killer',name:'妖精キラー',desc:'妖精族への与ダメージ+35%',category:'killer'},
  insect_killer:{id:'insect_killer',name:'甲虫キラー',desc:'甲虫族への与ダメージ+35%',category:'killer'},
  break_killer:{id:'break_killer',name:'BREAKキラー',desc:'敵がBREAK中、与ダメージ+40%',category:'killer'},
  weak_point:{id:'weak_point',name:'弱点看破',desc:'属性有利時、さらに与ダメージ+20%',category:'condition'},
  healthy_boost:{id:'healthy_boost',name:'HP80%以上強化',desc:'HP80%以上で与ダメージ+25%',category:'condition'},
  low_hp_boost:{id:'low_hp_boost',name:'HP50%以下強化',desc:'HP50%以下で与ダメージ+40%',category:'condition'},
  skill_boost:{id:'skill_boost',name:'スキル強化',desc:'スキルのダメージ・回復量+20%',category:'action'},
  ultimate_boost:{id:'ultimate_boost',name:'奥義強化',desc:'奥義のダメージ・回復量+20%',category:'action'},
  party_guard:{id:'party_guard',name:'全体軽減',desc:'生存中、味方全体の被ダメージ-8%',category:'support'},
  self_guard:{id:'self_guard',name:'自身軽減',desc:'自身の被ダメージ-15%',category:'support'},
  heal_boost:{id:'heal_boost',name:'回復強化',desc:'自身が行う回復量+25%',category:'support'},
  heal_received:{id:'heal_received',name:'被回復強化',desc:'自身が受ける回復量+20%',category:'support'},
  crisis_guard:{id:'crisis_guard',name:'瀕死時軽減',desc:'HP50%以下で被ダメージ-20%',category:'support'},
  opening_charge:{id:'opening_charge',name:'開幕チャージ',desc:'戦闘開始時、自身の奥義+20',category:'charge'},
  tailwind:{id:'tailwind',name:'追い風',desc:'戦闘開始時、味方全体の奥義+10',category:'charge'},
  damage_charge:{id:'damage_charge',name:'被弾チャージ',desc:'敵の攻撃を受けた時、奥義を追加で+5',category:'charge'},
  skill_charge:{id:'skill_charge',name:'スキルチャージ',desc:'スキル使用時、自身の奥義を追加で+5',category:'charge'},
  break_charge:{id:'break_charge',name:'BREAKチャージ',desc:'敵をBREAKした時、味方全体の奥義+10',category:'charge'},
  drop_boost:{id:'drop_boost',name:'ドロップ強化',desc:'リーダー時、通常ドロップ率+5%',category:'farm'},
  material_boost:{id:'material_boost',name:'素材探知',desc:'リーダー時、進化素材の追加抽選率UP',category:'farm'},
  precision_discharge:{id:'precision_discharge',name:'精密放電',desc:'スキル命中時、35%でスタン',category:'unique',unique:true},
  moon_veil:{id:'moon_veil',name:'月守の結界',desc:'戦闘開始時、最初の敵攻撃を15%軽減',category:'unique',unique:true}
});

const V12_ROSTER={
  garum:['break_killer','beast_killer'],
  livan:['heal_boost','heat_breaker'],
  sylphin:['tailwind','skill_charge'],
  slime:['drop_boost'],
  rabit:['beast_killer'],
  ember:['barrier_breaker'],
  shell:['party_guard','self_guard'],
  salam:['dragon_killer','healthy_boost'],
  griff:['weak_point','barrier_breaker','skill_boost'],
  volc:['healthy_boost','dragon_killer','ultimate_boost'],
  fenrir:['low_hp_boost','weak_point','crisis_guard'],
  volt:['aura_breaker','opening_charge','skill_charge','precision_discharge'],
  luna:['party_guard','heal_boost','self_guard','moon_veil'],
  pix:['drop_boost','heal_boost']
};
for(const [id,abilities] of Object.entries(V12_ROSTER))if(MONSTERS[id])MONSTERS[id].abilities=abilities.slice();

const V12_CATEGORY_LABEL={gimmick:'ギミック対策',resist:'状態異常耐性',killer:'種族・BREAKキラー',condition:'条件火力',action:'スキル・奥義',support:'防御・回復',charge:'奥義サポート',farm:'周回',unique:'固有'};
const V12_COMMON_IDS=['barrier_breaker','heat_breaker','aura_breaker','poison_resist','paralyze_resist','seal_resist','beast_killer','dragon_killer','phantom_killer','machine_killer','fairy_killer','insect_killer','break_killer','weak_point','healthy_boost','low_hp_boost','skill_boost','ultimate_boost','party_guard','self_guard','heal_boost','heal_received','crisis_guard','opening_charge','tailwind','damage_charge','skill_charge','break_charge','drop_boost','material_boost'];
let V12_ACTION='';

v11LogAbility=function(a){if(!a)return;const b=S.battle,mark=a.unique?'✦':'◆',msg=`${mark} ${a.name} 発動！`;if(b&&b.log[b.log.length-1]!==msg)b.log.push(msg)};
v10EventText=function(b){if(V10_QUEST!==b.quest){V10_QUEST=b.quest;V10_LOG_SEEN=b.log.length;return ''}if(b.log.length<=V10_LOG_SEEN)return '';const newer=b.log.slice(V10_LOG_SEEN);V10_LOG_SEEN=b.log.length;const raw=newer[newer.length-1]||'';return raw.replace(/^[◆✦💚🌠💧✨🛡💥⚡]\s*/,'')};

function v12KillerMatch(a,q){
  const map={beast_killer:'獣',dragon_killer:'ドラゴン',phantom_killer:'幻獣',machine_killer:'機獣',fairy_killer:'妖精',insect_killer:'甲虫'};
  return map[a.id]===q.tribe;
}
function v12CombatBoostDefs(id,q){
  const b=S.battle,f=b?.fighters.find(x=>x.id===id);if(!b||!f)return [];
  return v11Defs(id).filter(a=>{
    if(v12KillerMatch(a,q))return true;
    if(a.id==='break_killer')return b.stunned;
    if(a.id==='weak_point')return elem(M(id).element,q.element)>1;
    if(a.id==='healthy_boost')return f.hp/f.maxHp>=.8;
    if(a.id==='low_hp_boost')return f.hp/f.maxHp<=.5;
    if(a.id==='skill_boost')return V12_ACTION==='skill';
    if(a.id==='ultimate_boost')return V12_ACTION==='ult';
    return false;
  });
}
v11ActiveAbilityDefs=function(id,q){
  const b=S.battle,f=b?.fighters.find(x=>x.id===id);if(!b||!f)return [];
  return v11Defs(id).filter(a=>{
    if(v12KillerMatch(a,q))return true;
    switch(a.id){
      case 'break_killer':return b.stunned;
      case 'weak_point':return elem(M(id).element,q.element)>1;
      case 'healthy_boost':return f.hp/f.maxHp>=.8;
      case 'low_hp_boost':return f.hp/f.maxHp<=.5;
      case 'barrier_breaker':return b.barrier>0;
      case 'heat_breaker':return q.gimmick==='heat'&&b.heat>0;
      case 'aura_breaker':return q.gimmick==='aura'&&b.aura>0;
      case 'party_guard':return f.hp>0;
      case 'self_guard':return f.hp>0;
      case 'heal_received':return f.hp>0;
      case 'crisis_guard':return f.hp/f.maxHp<=.5;
      case 'precision_discharge':return f.hp>0;
      case 'moon_veil':return b.shield>0;
      default:return false;
    }
  });
};
passiveInfo=function(id,q){
  const defs=v12CombatBoostDefs(id,q);let mult=1;
  for(const a of defs){
    if(a.id==='break_killer'||a.id==='low_hp_boost')mult*=1.4;
    else if(['beast_killer','dragon_killer','phantom_killer','machine_killer','fairy_killer','insect_killer'].includes(a.id))mult*=1.35;
    else if(a.id==='weak_point'||a.id==='skill_boost'||a.id==='ultimate_boost')mult*=1.2;
    else if(a.id==='healthy_boost')mult*=1.25;
  }
  return{mult,label:defs.map(a=>a.name).join(' + ')};
};
passiveActive=function(id,q){return v11ActiveAbilityDefs(id,q).length>0};
v11DropBonus=function(mon){return v11Has(mon,'drop_boost') ? .05 : 0};

hit=function(base,label){
  const b=S.battle,q=Q(),f=active(),u=M(f.id),defs=v12CombatBoostDefs(f.id,q),p=passiveInfo(f.id,q);
  defs.forEach(v11LogAbility);
  let dmg=Math.max(1,Math.floor(base*elem(u.element,q.element)*p.mult*(.94+Math.random()*.12)));
  if(b.barrier>0){
    let barrierMult=u.element==='火'?1.35:1;
    if(v11Has(u,'barrier_breaker')){barrierMult*=1.5;v11LogAbility(v11Def('barrier_breaker'))}
    const bd=Math.floor(dmg*barrierMult);b.barrier-=bd;dmg=Math.floor(dmg*.35);b.log.push(`${label}：バリア${bd} / 本体${dmg}`);
    if(b.barrier<=0){
      b.stunned=true;b.log.push('💥 BARRIER BREAK!');
      if(v11Has(u,'break_charge')){b.fighters.forEach(x=>x.ult=Math.min(100,x.ult+10));v11LogAbility(v11Def('break_charge'));b.log.push('🌠 味方全体の奥義+10')}
    }
  }else b.log.push(`${label}：${dmg}ダメージ`);
  b.enemyHp-=dmg;
  if(q.gimmick==='heat'&&b.heat>0){
    let cool=u.element==='水'?1:0;if(v11Has(u,'heat_breaker')){cool++;v11LogAbility(v11Def('heat_breaker'))}
    if(cool){const old=b.heat;b.heat=Math.max(0,b.heat-cool);b.log.push(`💧 灼熱コア：熱量-${old-b.heat}`)}
  }
  if(q.gimmick==='aura'&&b.aura>0){
    let peel=u.element==='光'?1:0;if(v11Has(u,'aura_breaker')){peel++;v11LogAbility(v11Def('aura_breaker'))}
    if(peel){const old=b.aura;b.aura=Math.max(0,b.aura-peel);b.log.push(`✨ 終焉オーラ：${old-b.aura}層解除`)}
  }
};

heal=function(rate,all=true){
  const f=active(),u=M(f.id);let mul=v11Has(u,'heal_boost')?1.25:1;
  if(v11Has(u,'heal_boost'))v11LogAbility(v11Def('heal_boost'));
  if(V12_ACTION==='skill'&&v11Has(u,'skill_boost')){mul*=1.2;v11LogAbility(v11Def('skill_boost'))}
  if(V12_ACTION==='ult'&&v11Has(u,'ultimate_boost')){mul*=1.2;v11LogAbility(v11Def('ultimate_boost'))}
  const arr=all?S.battle.fighters:S.battle.fighters.filter(x=>x.hp>0).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp).slice(0,1);
  let total=0;
  arr.forEach(x=>{if(x.hp>0){const received=v11Has(x.id,'heal_received')?1.2:1,old=x.hp;x.hp=Math.min(x.maxHp,x.hp+Math.floor(x.maxHp*rate*mul*received));total+=x.hp-old}});
  S.battle.log.push(`💚 ${u.name}の回復：合計${total}`);
};

startQuest=function(id){
  const q=QUESTS.find(x=>x.id===id);if(!q||S.stamina<q.cost){toast('スタミナが足りません');return}
  S.stamina-=q.cost;
  const fighters=S.party.map(id=>{const u=M(id),o=S.owned[id],max=Math.floor(u.hp*(1+(o.level-1)*.06));return{id,hp:max,maxHp:max,ult:0,guard:false}});
  const log=[`${q.enemy}が現れた！`];
  S.battle={quest:id,enemyHp:q.hp,enemyMax:q.hp,round:1,turn:0,fighters,shield:0,debuff:0,barrier:q.gimmick==='barrier'?500:0,heat:0,aura:q.gimmick==='aura'?3:0,stunned:false,log};
  if(fighters.some(f=>v11Has(f.id,'tailwind'))){fighters.forEach(f=>f.ult=Math.min(100,f.ult+10));log.push('◆ 追い風：味方全体の奥義+10')}
  fighters.forEach(f=>{if(v11Has(f.id,'opening_charge')){f.ult=Math.min(100,f.ult+20);log.push(`◆ ${M(f.id).name}：開幕チャージ+20`)}});
  if(fighters.some(f=>v11Has(f.id,'moon_veil'))){S.battle.shield=.15;log.push('✦ 月守の結界：最初の敵攻撃を15%軽減')}
  if(fighters.some(f=>v11Has(f.id,'party_guard')))log.push('◆ 全体軽減：所持者が生存中、味方全体を軽減');
  if(v11DropBonus(M(S.party[0])))log.push('◆ ドロップ強化：クリア時の通常ドロップ率UP');
  save();render();
};

battleCommand=function(cmd){
  const b=S.battle,f=active(),u=M(f.id),a=atkVal(f.id),e=V7_EVOS?.[f.id],evolved=!!S.owned[f.id]?.evolved;f.guard=false;V12_ACTION=cmd;
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
    if(v11Has(u,'skill_charge')){f.ult=Math.min(100,f.ult+5);v11LogAbility(v11Def('skill_charge'))}
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
  V12_ACTION='';
  if(b.enemyHp<=0){win();return}nextTurn();
};

enemyTurn=function(){
  const b=S.battle,q=Q();
  if(b.stunned){b.log.push(`${q.enemy}は動けない！`);b.stunned=false}
  else{
    let mult=b.round%4===0?1.65:b.round%3===0?1.28:1;if(q.gimmick==='heat'&&b.heat>=3)mult=2.15;
    const guards=b.fighters.filter(x=>x.hp>0&&v11Has(x.id,'party_guard')),partyRed=Math.min(.24,guards.length*.08);guards.forEach(x=>v11LogAbility(v11Def('party_guard')));
    for(const f of b.fighters){
      if(f.hp<=0)continue;
      let red=b.shield+partyRed;
      if(v11Has(f.id,'self_guard')){red+=.15;v11LogAbility(v11Def('self_guard'))}
      if(f.hp/f.maxHp<=.5&&v11Has(f.id,'crisis_guard')){red+=.20;v11LogAbility(v11Def('crisis_guard'))}
      const d=q.atk*mult*(f.guard?.5:1)*(1-Math.min(.7,red));f.hp-=Math.floor(d*(.9+Math.random()*.2));f.ult=Math.min(100,f.ult+12+(v11Has(f.id,'damage_charge')?5:0));
    }
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
  let materialBonus=false;if(v11Has(lead,'material_boost')&&Math.random()<.35){mat++;materialBonus=true}
  if(mat){if(luckMax)mat++;S.materials[q.v7mat||q.element]=(S.materials[q.v7mat||q.element]||0)+mat}
  S.battle=null;save();render();modal(`<div class="reveal"><div style="font-size:60px">🏆</div><h2>QUEST CLEAR!</h2><p>RANK EXP +${q.xp} / 🪙 +${q.gold}</p>${mat?`<p>${V7_EICON[q.v7mat||q.element]} 進化素材 +${mat}</p>`:''}${abilityBonus?`<p class="passive-result">◆ ドロップ強化：ドロップ率 +5%</p>`:''}${materialBonus?'<p class="passive-result">◆ 素材探知：追加素材を発見</p>':''}${luckMax?'<div class="v7-luck">🍀 LUCK MAX BONUS：報酬宝箱 +1</div>':''}${drops.length?`<p>${drops.map(x=>MONSTERS[x].icon+' '+MONSTERS[x].name).join('<br>')}</p>`:'<p class="muted">モンスタードロップなし</p>'}<button class="bigbtn" onclick="closeModal()">OK</button></div>`);
};

v8Suitability=function(id,q){
  const u=M(id);let score=0;const reasons=[];if(q){const r=elem(u.element,q.element);
    if(r>1){score+=3;reasons.push('属性有利')}else if(r<1){score-=2;reasons.push('属性不利')}
    for(const a of v11Defs(u)){
      if(v12KillerMatch(a,q)){score+=4;reasons.push(a.name)}
      if(a.id==='weak_point'&&r>1){score+=2;reasons.push('弱点看破')}
      if(a.id==='barrier_breaker'&&q.gimmick==='barrier'){score+=5;reasons.push('バリアブレイカー')}
      if(a.id==='break_killer'&&q.gimmick==='barrier'){score+=2;reasons.push('BREAKキラー')}
      if(a.id==='heat_breaker'&&q.gimmick==='heat'){score+=5;reasons.push('灼熱ブレイカー')}
      if(a.id==='aura_breaker'&&q.gimmick==='aura'){score+=5;reasons.push('オーラブレイカー')}
      if(a.id==='drop_boost'&&v8IsNormal(q)){score+=2;reasons.push('周回向き')}
      if(a.id==='material_boost'&&q.v7daily){score+=3;reasons.push('素材探知')}
    }
    if(q.gimmick==='barrier'&&u.element==='火'){score+=2;reasons.push('バリア有効属性')}
    if(q.gimmick==='heat'&&u.element==='水'){score+=3;reasons.push('水属性で冷却')}
    if(q.gimmick==='aura'&&u.element==='光'){score+=3;reasons.push('光属性で解除')}
  }
  if(v11Has(u,'party_guard')){score+=1;reasons.push('全体軽減')}
  if(v11Has(u,'heal_boost')){score+=1;reasons.push('回復強化')}
  if(v11Has(u,'opening_charge')||v11Has(u,'tailwind')||v11Has(u,'skill_charge')){score+=1;reasons.push('奥義加速')}
  const grade=score>=7?'S':score>=5?'A':score>=2.5?'B':score>=0?'C':'D';return{score,grade,reasons:[...new Set(reasons)]};
};

v9Coverage=function(q){
  const units=S.party.map(id=>M(id)),items=[],add=(ok,label)=>items.push({ok,label});
  if(q.gimmick==='barrier')add(units.some(u=>v11Has(u,'barrier_breaker')||u.element==='火'),'バリア対策');
  if(q.gimmick==='heat')add(units.some(u=>v11Has(u,'heat_breaker')||u.element==='水'),'熱量対策');
  if(q.gimmick==='aura')add(units.some(u=>v11Has(u,'aura_breaker')||u.element==='光'),'オーラ対策');
  const adv=v8AdvElement(q.element);if(adv)add(units.some(u=>u.element===adv),`${adv}属性`);
  const killerMap={獣:'beast_killer',ドラゴン:'dragon_killer',幻獣:'phantom_killer',機獣:'machine_killer',妖精:'fairy_killer',甲虫:'insect_killer'};
  if(killerMap[q.tribe])add(units.some(u=>v11Has(u,killerMap[q.tribe])),`${q.tribe}キラー`);
  return items.slice(0,4);
};

function v12AbilityCatalog(){
  document.getElementById('modal')?.remove();
  const groups={};for(const id of V12_COMMON_IDS){const a=ABILITIES[id];(groups[a.category]||(groups[a.category]=[])).push(a)}
  modal(`<div class="v12-catalog"><div class="section-title"><div><div class="tiny muted">ABILITY CATALOG v1</div><h2>共通アビリティ 30種</h2></div><button class="btn" onclick="closeModal()">閉じる</button></div><p class="tiny muted">◆は複数モンスターで共有する能力。✦固有アビリティはこの30種とは別枠です。</p>${Object.entries(groups).map(([cat,arr])=>`<section><h3>${V12_CATEGORY_LABEL[cat]||cat}</h3><div class="v12-catalog-grid">${arr.map(a=>`<div class="v12-catalog-item"><b>◆ ${a.name}</b><span>${a.desc}</span></div>`).join('')}</div></section>`).join('')}</div>`);
}
const V12_OTHER=otherView;
otherView=function(m){V12_OTHER(m);m.insertAdjacentHTML('afterbegin',`<div class="card v12-summary"><div class="tiny muted">v12 ROSTER STANDARD</div><h3>30共通アビリティ + 固有枠</h3><p class="tiny muted">既存14体を入手区分とレアリティに合わせて再調整。通常低レアはシンプル、降臨は特化、ガチャ★5は複数共通＋固有で差別化します。</p><button class="btn" onclick="v12AbilityCatalog()">共通アビリティ30種を見る</button></div>`)};

gachaView=function(m){m.innerHTML=`<div class="section-title"><h2>星導召喚</h2><span class="pill">💎 ${S.gems}</span></div><section class="hero v7-gacha"><div class="tiny">STAR SUMMON · LIMITED MONSTERS ONLY</div><h1>召喚限定モンスターと<br>契約を結べ。</h1><p>ガチャ排出は召喚限定のみ。★5排出率8%。最高レアは複数の共通アビリティを組み合わせ、一部は✦固有アビリティも持ちます。</p><div style="margin-top:18px"><button class="bigbtn" onclick="pull(1)">1回 💎50</button> <button class="bigbtn" onclick="pull(10)">10連 💎500</button></div></section>`};

const V12_HEADER=header;
header=function(){return V12_HEADER().replace('TYPE SCRIPT v11','TYPE SCRIPT v12').replace('TYPE SCRIPT v10','TYPE SCRIPT v12')};
S.version=12;save();render();
