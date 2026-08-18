// @ts-nocheck
// v20: every normal/daily/advent stage opens the existing v9 sortie preparation screen before battle.
v19StageRow=function(q){
  const lock=S.rank<q.rank,clear=S.cleared.includes(q.id)||S.adventCleared?.includes(q.id);
  return `<button class="v19-stage ${lock?'locked':''}" ${lock?'disabled':`onclick="v9OpenSortie('${q.id}')"`}><span class="v19-stage-icon">${q.icon||'⚔️'}</span><span class="v19-stage-main"><b>${q.name}</b><small>${q.enemy} · ${q.element}/${q.tribe}</small><small>⚡ ${q.cost}　RANK ${q.rank}</small></span>${clear?'<span class="v19-clear">CLEAR!</span>':''}<span class="v19-detail">出撃準備</span></button>`;
};
const V20_HEADER=header;
header=function(){return V20_HEADER().replace('TYPE SCRIPT v19','TYPE SCRIPT v20')};
S.version=20;save();render();
