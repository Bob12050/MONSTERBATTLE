// @ts-nocheck
// v13 Wave 1 pilot: three farmable advent monsters + one gacha-limited ★5.
Object.assign(ABILITIES,{
  stellar_relay:{id:'stellar_relay',name:'星炎転輪',desc:'奥義使用後、奥義ゲージが最も低い他の味方1体の奥義+10',category:'unique',unique:true}
});

Object.assign(MONSTERS,{
  magnashell:{id:'magnashell',name:'赫殻竜 マグナシェル',icon:'🐲🛡️',element:'火',tribe:'ドラゴン',rarity:5,role:'タンク・ブレイカー',abilities:['barrier_breaker','self_guard','break_charge'],hp:188,atk:31,skill:'灼殻突進',skillDesc:'敵に175%ダメージ',ult:'マグナ・クラッシュ',ultDesc:'敵に310%ダメージ',obtain:'降臨'},
  alcyon:{id:'alcyon',name:'聖翼王 アルシオン',icon:'🦅✨',element:'光',tribe:'幻獣',rarity:5,role:'アタッカー・ブレイカー',abilities:['phantom_killer','aura_breaker','weak_point'],hp:166,atk:38,skill:'聖翼斬',skillDesc:'敵に195%ダメージ',ult:'ルクス・ジャッジメント',ultDesc:'敵に340%ダメージ',obtain:'降臨'},
  balgrave:{id:'balgrave',name:'冥鎧王 バルグレイヴ',icon:'🤖🌑',element:'闇',tribe:'機獣',rarity:5,role:'タンク・アタッカー',abilities:['low_hp_boost','crisis_guard','damage_charge'],hp:186,atk:35,skill:'冥鎧衝',skillDesc:'敵に170%ダメージ',ult:'グレイヴ・エンド',ultDesc:'敵に320%ダメージ',obtain:'高難度降臨'},
  flareseraph:{id:'flareseraph',name:'星炎鳥 フレアセラフ',icon:'🐦‍🔥',element:'火',tribe:'幻獣',rarity:5,role:'アタッカー・サポーター',abilities:['weak_point','opening_charge','ultimate_boost','stellar_relay'],hp:158,atk:38,skill:'星火羽撃',skillDesc:'敵に185%ダメージ',ult:'セラフィック・ノヴァ',ultDesc:'敵に350%ダメージ',obtain:'星導召喚限定'}
});

Object.assign(V7_ADVENT_BASE,{
  a4:{name:'赫殻竜、紅蓮を纏う',icon:'🔥',enemy:'赫殻竜マグナシェル',enemyIcon:'🐲🛡️',element:'火',tribe:'ドラゴン',hp:2780,atk:72,rank:6,drop:'magnashell',gimmick:'barrier',gimmickText:'灼殻バリア：バリアブレイカーとBREAK後の攻めが有効'},
  a5:{name:'聖翼王、冥夜を祓う',icon:'✨',enemy:'聖翼王アルシオン',enemyIcon:'🦅✨',element:'光',tribe:'幻獣',hp:3150,atk:80,rank:8,drop:'alcyon',gimmick:'aura',gimmickText:'聖翼オーラ：オーラブレイカーで層を素早く解除'},
  a6:{name:'冥鎧王、死線に立つ',icon:'🌑',enemy:'冥鎧王バルグレイヴ',enemyIcon:'🤖🌑',element:'闇',tribe:'機獣',hp:3650,atk:94,rank:10,drop:'balgrave',gimmickText:'冥鎧猛攻：高い攻撃を耐え、HP条件アビリティを活かして反撃'}
});

for(const aid of ['a4','a5','a6']){
  for(const diff of Object.keys(V7_DIFF)){
    const id=`${aid}_${diff}`;
    if(!QUESTS.some(q=>q.id===id))QUESTS.push(v7AdventQuest(aid,diff));
  }
}

const V13_BATTLE_COMMAND=battleCommand;
battleCommand=function(cmd){
  const f=active(),id=f.id;
  if(!['magnashell','alcyon','balgrave','flareseraph'].includes(id))return V13_BATTLE_COMMAND(cmd);
  const b=S.battle,u=M(id),a=atkVal(id);f.guard=false;V12_ACTION=cmd;
  if(cmd==='attack'){
    hit(a,`${u.name}の攻撃`);f.ult=Math.min(100,f.ult+18);
  }
  if(cmd==='guard'){
    f.guard=true;f.ult=Math.min(100,f.ult+8);b.log.push(`${u.name}は防御態勢`);
  }
  if(cmd==='skill'){
    const mult={magnashell:1.75,alcyon:1.95,balgrave:1.70,flareseraph:1.85}[id]||1.6;
    hit(a*mult,u.skill);f.ult=Math.min(100,f.ult+14);
    if(v11Has(u,'skill_charge')){f.ult=Math.min(100,f.ult+5);v11LogAbility(v11Def('skill_charge'))}
  }
  if(cmd==='ult'&&f.ult>=100){
    f.ult=0;
    const mult={magnashell:3.10,alcyon:3.40,balgrave:3.20,flareseraph:3.50}[id]||2.5;
    hit(a*mult,`🌠 ${u.ult}`);
    if(id==='flareseraph'&&v11Has(u,'stellar_relay')){
      const allies=b.fighters.filter(x=>x.hp>0&&x!==f).sort((x,y)=>x.ult-y.ult);
      const target=allies[0];
      if(target){target.ult=Math.min(100,target.ult+10);v11LogAbility(v11Def('stellar_relay'));b.log.push(`🌠 ${M(target.id).name}の奥義+10`)}
    }
  }
  V12_ACTION='';
  if(b.enemyHp<=0){win();return}nextTurn();
};

v7RollGacha=function(){
  const r=Math.random(),pool=r<.08?['volt','luna','flareseraph']:['pix'];
  return pool[Math.floor(Math.random()*pool.length)];
};

gachaView=function(m){
  const f=MONSTERS.flareseraph;
  m.innerHTML=`<div class="section-title"><h2>星導召喚</h2><span class="pill">💎 ${S.gems}</span></div>
  <section class="hero v7-gacha"><div class="tiny">STAR SUMMON · LIMITED MONSTERS ONLY</div><h1>召喚限定モンスターと<br>契約を結べ。</h1><p>★5排出率8%。召喚限定のみ排出され、ラック99は前提にしません。</p><div style="margin-top:18px"><button class="bigbtn" onclick="pull(1)">1回 💎50</button> <button class="bigbtn" onclick="pull(10)">10連 💎500</button></div></section>
  <div class="card v13-pickup"><div class="tiny muted">NEW ★5</div><div class="unit-row"><div class="avatar">${f.icon}</div><div><span class="rarity">${stars(f.rarity)}</span><b style="display:block">${f.name}</b><div class="tiny muted">${f.element}・${f.tribe}・${f.role}</div></div></div>${v11AbilityPanel(f)}<p class="tiny muted">✦ 星炎転輪：奥義使用後、奥義ゲージが最も低い他の味方1体へ奥義+10。</p></div>`;
};

const V13_OTHER=otherView;
otherView=function(m){
  V13_OTHER(m);
  m.insertAdjacentHTML('afterbegin',`<div class="card v13-summary"><div class="tiny muted">v13 WAVE 1 PILOT</div><h3>🐾 実戦テスト4体</h3><p class="tiny muted">降臨：マグナシェル / アルシオン / バルグレイヴ　召喚限定：フレアセラフ。既存ギミックだけでアビリティ組み合わせの価値を検証します。</p></div>`);
};

const V13_HEADER=header;
header=function(){return V13_HEADER().replace('TYPE SCRIPT v12','TYPE SCRIPT v13').replace('TYPE SCRIPT v11','TYPE SCRIPT v13')};
S.version=13;save();render();
