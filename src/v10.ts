// @ts-nocheck
// v10 battle UX: one-screen battle, no intent preview, no persistent battle log.
let V10_QUEST='';
let V10_LOG_SEEN=0;

function v10EnemyStateIcons(q,b){
  const xs=[];
  if(b.stunned)xs.push(`<span title="スタン">⚡</span>`);
  if(q.gimmick==='barrier'&&b.barrier>0)xs.push(`<span title="バリア">🛡<b>${Math.max(0,b.barrier)}</b></span>`);
  if(q.gimmick==='heat'&&b.heat>0)xs.push(`<span title="熱量">🔥<b>${b.heat}</b></span>`);
  if(q.gimmick==='aura'&&b.aura>0)xs.push(`<span title="オーラ">🌑<b>${b.aura}</b></span>`);
  return xs.join('');
}
function v10FighterStateIcons(f){
  const xs=[];
  if(f.guard)xs.push(`<span title="防御">🛡</span>`);
  if(S.battle.shield>0)xs.push(`<span title="軽減">🔷</span>`);
  if(passiveActive(f.id,Q()))xs.push(`<span title="パッシブ発動中">◆</span>`);
  return xs.join('');
}
function v10EventText(b){
  if(V10_QUEST!==b.quest){
    V10_QUEST=b.quest;V10_LOG_SEEN=b.log.length;return '';
  }
  if(b.log.length<=V10_LOG_SEEN)return '';
  const newer=b.log.slice(V10_LOG_SEEN);
  V10_LOG_SEEN=b.log.length;
  const raw=newer[newer.length-1]||'';
  return raw.replace(/^[◆💚🌠💧✨🛡💥⚡]\s*/,'');
}
function v10Fighter(f,i){
  const u=M(f.id),current=i===S.battle.turn,on=passiveActive(f.id,Q());
  const hp=Math.max(0,f.hp/f.maxHp*100),ult=Math.max(0,Math.min(100,f.ult));
  return `<div class="v10-fighter ${current?'current':''} ${f.hp<=0?'dead':''}">
    ${current?'<div class="v10-turn">TURN</div>':''}
    <div class="v10-fighter-icon-wrap">
      <div class="v10-status-icons">${v10FighterStateIcons(f)}</div>
      <div class="v10-fighter-icon">${u.icon}</div>
    </div>
    <div class="v10-fighter-name">${u.name.split(' ')[1]||u.name}</div>
    <div class="v10-mini-bars">
      <div class="v10-hp"><i style="width:${hp}%"></i></div>
      <div class="v10-ult"><i style="width:${ult}%"></i></div>
    </div>
    <div class="v10-fighter-meta"><span>${Math.max(0,f.hp)}/${f.maxHp}</span><span>🌠${f.ult}%</span>${on?'<b>◆</b>':''}</div>
  </div>`;
}
function v10CommandButton(cmd,icon,label,sub,disabled=false,warn=false){
  return `<button class="v10-command ${warn?'ult':''}" ${disabled?'disabled':''} onclick="battleCommand('${cmd}')">
    <strong>${icon}</strong><b>${label}</b><small>${sub}</small>
  </button>`;
}

const V10_RENDER=render;
render=function(){
  document.body.classList.toggle('v10-battle-mode',!!S.battle);
  V10_RENDER();
};

battleView=function(m){
  const b=S.battle,q=Q(),f=active(),u=M(f.id),eventText=v10EventText(b);
  const hp=Math.max(0,b.enemyHp/b.enemyMax*100);
  m.innerHTML=`<section class="v10-battle">
    <div class="v10-topbar">
      <div><span>ROUND ${b.round}</span><b>${q.name}</b></div>
      <button onclick="S.battle=null;save();render()">リタイア</button>
    </div>

    <div class="v10-enemy-stage">
      <div class="v10-enemy-card">
        <div class="v10-enemy-status">${v10EnemyStateIcons(q,b)}</div>
        <div class="v10-enemy-name"><span>${q.element}・${q.tribe}</span><b>${q.enemy}</b></div>
        <div class="v10-enemy-sprite">${q.enemyIcon}</div>
        <div class="v10-enemy-hp-row"><span>HP</span><div class="v10-enemy-hp"><i style="width:${hp}%"></i></div><b>${Math.max(0,b.enemyHp)}/${b.enemyMax}</b></div>
        ${eventText?`<div class="v10-event-pop">${eventText}</div>`:''}
      </div>
    </div>

    <div class="v10-party-row">
      ${b.fighters.map((x,i)=>v10Fighter(x,i)).join('')}
    </div>

    <div class="v10-active-strip">
      <div class="v10-active-mon"><span>${u.icon}</span><div><small>行動中</small><b>${u.name}</b></div></div>
      <div class="v10-active-tags"><span>${u.element}</span><span>${u.role}</span>${passiveActive(f.id,q)?`<span class="active">◆ ${u.passiveName}</span>`:''}</div>
    </div>

    <div class="v10-commands">
      ${v10CommandButton('attack','⚔','攻撃','通常攻撃')}
      ${v10CommandButton('skill','✨','スキル',u.skill)}
      ${v10CommandButton('guard','🛡','防御','被ダメ軽減')}
      ${v10CommandButton('ult','🌠','奥義',u.ult,f.ult<100,true)}
    </div>
  </section>`;
  if(eventText)setTimeout(()=>document.querySelector('.v10-event-pop')?.classList.add('hide'),950);
};

const V10_HEADER=header;
header=function(){return V10_HEADER().replace('TYPE SCRIPT v9','TYPE SCRIPT v10').replace('TYPE SCRIPT v8','TYPE SCRIPT v10')};
