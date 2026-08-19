// @ts-nocheck
// v26: Lucifer is the first ★5 gacha-limited character with a three-stage growth line.
MONSTERS.lucifer={id:'lucifer',name:'ルシファー',icon:'👱‍♀️',element:'闇',tribe:'堕天',rarity:5,role:'アタッカー',abilities:['barrier_breaker','weak_killer'],hp:152,atk:38,skill:'ルミナス・ノヴァ',skillDesc:'敵に185%ダメージ',ult:'フォールン・レイ',ultDesc:'敵に315%ダメージ',obtain:'星導召喚限定',evolve:'堕天の使徒 ルシファー'};
MONSTERS.lucifer_evo={id:'lucifer_evo',name:'堕天の使徒 ルシファー',icon:'👱‍♀️',element:'闇',tribe:'堕天',rarity:6,role:'アタッカー',abilities:['barrier_breaker','weak_killer','start_ult_self','healthy_boost'],hp:184,atk:45,skill:'ノクターン・オブリビオン',skillDesc:'敵に220%ダメージ＋自身の奥義を加速',ult:'アビス・リベリオン',ultDesc:'敵に385%ダメージ',obtain:'ルシファーから進化',evolve:'堕天の王 ルシファー'};
MONSTERS.lucifer_final={id:'lucifer_final',name:'堕天の王 ルシファー',icon:'👑',element:'闇',tribe:'堕天',rarity:6,role:'アタッカー',abilities:['barrier_breaker','weak_killer','start_ult_self','healthy_boost','party_guard'],hp:218,atk:54,skill:'王威・ルシファーの裁定',skillDesc:'敵に255%ダメージ＋味方への被ダメージを軽減',ult:'セラフィック・ジャッジメント',ultDesc:'敵に455%ダメージ＋弱点時さらに威力上昇',obtain:'堕天の使徒 ルシファーから最終進化'};

const V26_LUCIFER_EVOLUTION={
 lucifer:{to:'lucifer_evo',level:50,gold:30000,materials:{dark:30},label:'進化'},
 lucifer_evo:{to:'lucifer_final',level:70,gold:80000,materials:{dark:70},label:'最終進化'}
};

function v26LuciferEvolution(id){return V26_LUCIFER_EVOLUTION[id]||null}
function v26CanLuciferEvolve(id){const e=v26LuciferEvolution(id),o=S.owned[id];if(!e||!o)return false;const mats=S.materials||{};return (o.level||1)>=e.level&&S.gold>=e.gold&&(mats.dark||0)>=e.materials.dark}
function v26EvolveLucifer(id){const e=v26LuciferEvolution(id),o=S.owned[id];if(!e||!o)return;if(!v26CanLuciferEvolve(id)){toast(`進化条件：Lv${e.level} / 闇素材${e.materials.dark} / ${e.gold.toLocaleString()}G`);return}S.gold-=e.gold;S.materials=S.materials||{};S.materials.dark=(S.materials.dark||0)-e.materials.dark;S.owned[e.to]={level:1,luck:o.luck||1,evolved:true};delete S.owned[id];S.party=S.party.map(x=>x===id?e.to:x);save();toast(`${MONSTERS[e.to].name}へ${e.label}！`);render()}

// Make the base ★5 available from the normal gacha pool. Evolved forms never enter the pool.
if(typeof GACHA_POOL!=='undefined'&&Array.isArray(GACHA_POOL)&&!GACHA_POOL.includes('lucifer'))GACHA_POOL.push('lucifer');

// Developer mode can immediately test the base form while keeping evolution progression intact.
const V26_DEV_UNLOCK=typeof v17DevUnlockAll==='function'?v17DevUnlockAll:null;
if(V26_DEV_UNLOCK)v17DevUnlockAll=function(){V26_DEV_UNLOCK();if(S.owned.lucifer_evo)delete S.owned.lucifer_evo;if(S.owned.lucifer_final)delete S.owned.lucifer_final;if(S.owned.lucifer)S.owned.lucifer.level=Math.max(S.owned.lucifer.level||1,50);save();render()};

S.version=26;save();render();
