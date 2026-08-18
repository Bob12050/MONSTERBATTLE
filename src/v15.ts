// @ts-nocheck
// v15: two normal drops, two farmable advents, one gacha-limited support ★5.
Object.assign(ABILITIES,{
  heavenly_resonance:{id:'heavenly_resonance',name:'天律共鳴',desc:'スキル使用後、奥義ゲージが最も低い他の味方1体の奥義+5',category:'unique',unique:true}
});

Object.assign(MONSTERS,{
  blazehound:{id:'blazehound',name:'烈爪獣 ブレイズハウンド',icon:'🐕🔥',element:'火',tribe:'獣',rarity:2,role:'アタッカー',abilities:['machine_killer'],hp:94,atk:20,skill:'烈爪',skillDesc:'敵に150%ダメージ',ult:'ブレイズラン',ultDesc:'敵に225%ダメージ',obtain:'通常クエスト'},
  mizune:{id:'mizune',name:'潮祈獣 ミズネ',icon:'🦊💧',element:'水',tribe:'獣',rarity:3,role:'ヒーラー',abilities:['heal_boost','heal_received'],hp:126,atk:19,skill:'潮の祈り',skillDesc:'HP最低の味方を30%回復',ult:'蒼潮祝福',ultDesc:'味方全体を23%回復',obtain:'通常クエスト'},
  crablos:{id:'crablos',name:'深淵甲 クラブロス',icon:'🦀🌊',element:'水',tribe:'甲虫',rarity:5,role:'タンク',abilities:['party_guard','insect_killer','damage_charge'],hp:192,atk:30,skill:'深海甲殻',skillDesc:'味方全体を28%軽減',ult:'アビスプレス',ultDesc:'敵に285%ダメージ',obtain:'降臨'},
  dryad:{id:'dryad',name:'古樹王 ドライアード',icon:'🌳👑',element:'木',tribe:'幻獣',rarity:5,role:'ヒーラー・サポーター',abilities:['heal_boost','party_guard','break_charge'],hp:181,atk:30,skill:'古樹の雫',skillDesc:'味方全体を16%回復',ult:'エルダー・ブルーム',ultDesc:'味方全体を30%回復＋敵に170%ダメージ',obtain:'降臨'},
  ordina:{id:'ordina',name:'天律獣 オルディナ',icon:'🪽🔔',element:'光',tribe:'神獣',rarity:5,role:'サポーター',abilities:['tailwind','party_guard','skill_charge','heavenly_resonance'],hp:169,atk:32,skill:'天律の鐘',skillDesc:'敵に145%ダメージ',ult:'オルディナ・コーラス',ultDesc:'敵に250%ダメージ＋味方全体の奥義+10',obtain:'星導召喚限定'}
});

// Normal drops stay intentionally uncommon: target-farm rather than rapid collection.
const qBlaze=QUESTS.find(q=>q.id==='n3c');
if(qBlaze){qBlaze.drops=qBlaze.drops||[];if(!qBlaze.drops.some(x=>x[0]==='blazehound'))qBlaze.drops.push(['blazehound',.06]);}
const qMizune=QUESTS.find(q=>q.id==='n3b');
if(qMizune){qMizune.drops=qMizune.drops||[];if(!qMizune.drops.some(x=>x[0]==='mizune'))qMizune.drops.push(['mizune',.08]);}

Object.assign(V7_ADVENT_BASE,{
  a7:{name:'深淵甲、潮底に座す',icon:'🌊',enemy:'深淵甲クラブロス',enemyIcon:'🦀🌊',element:'水',tribe:'甲虫',hp:3050,atk:82,rank:7,drop:'crablos',gimmickText:'深海甲殻：高耐久の長期戦。甲虫キラーと奥義回転が有効'},
  a8:{name:'古樹王、森羅を護る',icon:'🌳',enemy:'古樹王ドライアード',enemyIcon:'🌳👑',element:'木',tribe:'幻獣',hp:3380,atk:77,rank:8,drop:'dryad',gimmick:'barrier',gimmickText:'古樹障壁：バリアをBREAKし、回復される前に攻め切れ'}
});
for(const aid of ['a7','a8'])for(const diff of Object.keys(V7_DIFF)){const id=`${aid}_${diff}`;if(!QUESTS.some(q=>q.id===id))QUESTS.push(v7AdventQuest(aid,diff));}

function v15Heal(sourceId,rate,all){
  const b=S.battle,source=M(sourceId),sourceBoost=v11Has(source,'heal_boost')?1.25:1;
  let targets=all?b.fighters.filter(x=>x.hp>0):b.fighters.filter(x=>x.hp>0).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp).slice(0,1);
  if(sourceBoost>1)v11LogAbility(v11Def('heal_boost'));
  for(const t of targets){const received=v11Has(t.id,'heal_received')?1.2:1;const n=Math.floor(t.maxHp*rate*sourceBoost*received);t.hp=Math.min(t.maxHp,t.hp+n);}
}
function v15LowestOther(f){return S.battle.fighters.filter(x=>x.hp>0&&x!==f).sort((a,b)=>a.ult-b.ult)[0];}

const V15_BATTLE_COMMAND=battleCommand;
battleCommand=function(cmd){
  const f=active(),id=f.id;if(!['blazehound','mizune','crablos','dryad','ordina'].includes(id))return V15_BATTLE_COMMAND(cmd);
  const b=S.battle,u=M(id),a=atkVal(id);f.guard=false;V12_ACTION=cmd;
  if(cmd==='attack'){hit(a,`${u.name}の攻撃`);f.ult=Math.min(100,f.ult+18);}
  if(cmd==='guard'){f.guard=true;f.ult=Math.min(100,f.ult+8);b.log.push(`${u.name}は防御態勢`);}
  if(cmd==='skill'){
    if(id==='mizune')v15Heal(id,.30,false);
    else if(id==='crablos'){b.shield=Math.max(b.shield,.28);b.log.push(`🛡 ${u.skill}：味方全体を28%軽減`);}
    else if(id==='dryad')v15Heal(id,.16,true);
    else hit(a*(id==='blazehound'?1.50:1.45),u.skill);
    f.ult=Math.min(100,f.ult+14);
    if(v11Has(u,'skill_charge')){f.ult=Math.min(100,f.ult+5);v11LogAbility(v11Def('skill_charge'));}
    if(id==='ordina'&&v11Has(u,'heavenly_resonance')){const t=v15LowestOther(f);if(t){t.ult=Math.min(100,t.ult+5);v11LogAbility(v11Def('heavenly_resonance'));}}
  }
  if(cmd==='ult'&&f.ult>=100){
    f.ult=0;
    if(id==='mizune')v15Heal(id,.23,true);
    else if(id==='dryad'){hit(a*1.70,`🌠 ${u.ult}`);v15Heal(id,.30,true);}
    else hit(a*({blazehound:2.25,crablos:2.85,ordina:2.50}[id]||2.5),`🌠 ${u.ult}`);
    if(id==='ordina'){b.fighters.filter(x=>x.hp>0).forEach(x=>x.ult=Math.min(100,x.ult+10));b.log.push('🔔 味方全体の奥義+10');}
  }
  V12_ACTION='';if(b.enemyHp<=0){win();return}nextTurn();
};

// Keep summon-exclusive policy. ★5 rate stays 8%; Ordina joins the ★5 pool.
v7RollGacha=function(){const r=Math.random(),pool=r<.08?['volt','luna','flareseraph','ordina']:['pix'];return pool[Math.floor(Math.random()*pool.length)]};

const V15_GACHA_VIEW=gachaView;
gachaView=function(m){V15_GACHA_VIEW(m);const u=MONSTERS.ordina;m.insertAdjacentHTML('beforeend',`<div class="card"><div class="tiny muted">NEW ★5 SUPPORT</div><div class="unit-row"><div class="avatar">${u.icon}</div><div><span class="rarity">${stars(u.rarity)}</span><b style="display:block">${u.name}</b><div class="tiny muted">${u.element}・${u.tribe}・${u.role}</div></div></div>${v11AbilityPanel(u)}<p class="tiny muted">✦ 天律共鳴：スキル使用後、奥義が最も低い他の味方へ奥義+5。</p></div>`);};

const V15_HEADER=header;header=function(){return V15_HEADER().replace('TYPE SCRIPT v14','TYPE SCRIPT v15').replace('TYPE SCRIPT v13','TYPE SCRIPT v15')};
S.version=15;save();render();
