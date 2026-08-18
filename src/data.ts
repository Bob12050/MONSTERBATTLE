/// <reference path="./types.ts" />
const $=(s:string)=>document.querySelector(s) as HTMLElement;
const MONSTERS:Record<string,MonsterDef>={
 garum:{id:'garum',name:'炎牙獣 ガルム',icon:'🐺',element:'火',tribe:'獣',rarity:4,role:'アタッカー',passive:'break',passiveName:'破陣の牙',passiveDesc:'敵がBREAK中、与ダメージ+40%',hp:128,atk:29,skill:'火牙連撃',skillDesc:'敵に145%ダメージ',ult:'紅蓮ハウリング',ultDesc:'敵に270%ダメージ',obtain:'初期契約',evolve:'獄炎牙王 ガルム'},
 livan:{id:'livan',name:'蒼鰭獣 リヴァン',icon:'🐋',element:'水',tribe:'海獣',rarity:4,role:'ヒーラー',passive:'heal',passiveName:'癒潮の加護',passiveDesc:'自身の回復量+25%',hp:146,atk:22,skill:'癒しの潮',skillDesc:'味方全体を18%回復',ult:'アビスウェーブ',ultDesc:'敵に190%＋全体25%回復',obtain:'初期契約',evolve:'蒼海神獣 リヴァン'},
 sylphin:{id:'sylphin',name:'翠翼獣 シルフィン',icon:'🦅',element:'木',tribe:'幻獣',rarity:4,role:'サポーター',passive:'tailwind',passiveName:'追い風',passiveDesc:'戦闘開始時、味方全体の奥義+10',hp:116,atk:26,skill:'旋風爪',skillDesc:'敵に120%×2回',ult:'テンペストフェザー',ultDesc:'敵に230%＋味方奥義加速',obtain:'初期契約',evolve:'翠嵐天獣 シルフィン'},
 slime:{id:'slime',name:'ぷるりんスライム',icon:'🟢',element:'水',tribe:'妖精',rarity:2,role:'周回',passive:'drop8',passiveName:'ぷるりん幸運',passiveDesc:'リーダー時、ドロップ率+8%',hp:96,atk:15,skill:'ぷるぷるヒール',skillDesc:'HP最低の味方を28%回復',ult:'スライムシャワー',ultDesc:'味方全体20%回復',obtain:'通常クエスト'},
 rabit:{id:'rabit',name:'角跳獣 ホーンラビ',icon:'🐇',element:'木',tribe:'獣',rarity:2,role:'キラー',passive:'beast',passiveName:'獣狩りの角',passiveDesc:'獣族への与ダメージ+35%',hp:88,atk:19,skill:'ホーンアタック',skillDesc:'敵に150%ダメージ',ult:'ラビットラッシュ',ultDesc:'敵に220%ダメージ',obtain:'通常クエスト'},
 ember:{id:'ember',name:'火仔獣 コロフレア',icon:'🦊',element:'火',tribe:'獣',rarity:2,role:'ブレイカー',passive:'barrier',passiveName:'火花砕き',passiveDesc:'バリアへのダメージ+50%',hp:93,atk:18,skill:'火の粉',skillDesc:'敵に135%ダメージ',ult:'フレアテイル',ultDesc:'敵に210%ダメージ',obtain:'初期配布'},
 shell:{id:'shell',name:'岩殻虫 ロックシェル',icon:'🪲',element:'木',tribe:'甲虫',rarity:3,role:'タンク',passive:'partyguard',passiveName:'堅牢甲殻',passiveDesc:'生存中、味方全体の被ダメージ-8%',hp:154,atk:17,skill:'硬化甲殻',skillDesc:'味方全体35%軽減',ult:'グランドプレス',ultDesc:'敵に190%ダメージ',obtain:'通常クエスト'},
 salam:{id:'salam',name:'熔尾竜 サラマンダ',icon:'🦎',element:'火',tribe:'ドラゴン',rarity:3,role:'キラー',passive:'dragon',passiveName:'竜喰いの尾',passiveDesc:'ドラゴン族への与ダメージ+35%',hp:122,atk:25,skill:'マグマブレス',skillDesc:'敵に170%ダメージ',ult:'ヴォルケイン',ultDesc:'敵に250%ダメージ',obtain:'通常クエスト',evolve:'爆尾竜 サラマンダ'},
 griff:{id:'griff',name:'翠嵐王 グリフォン',icon:'🦁',element:'木',tribe:'幻獣',rarity:5,role:'アタッカー',passive:'weak',passiveName:'弱点看破',passiveDesc:'弱点攻撃時、さらに与ダメージ+20%',hp:168,atk:35,skill:'王翼裂破',skillDesc:'敵に190%ダメージ',ult:'エメラルドテンペスト',ultDesc:'敵に330%ダメージ',obtain:'降臨',evolve:'翠嵐神王 グリフォン'},
 volc:{id:'volc',name:'獄炎龍 ヴォルカノス',icon:'🐉',element:'火',tribe:'ドラゴン',rarity:5,role:'アタッカー',passive:'healthy',passiveName:'高熱炉心',passiveDesc:'HP80%以上で与ダメージ+25%',hp:178,atk:37,skill:'獄炎ブレス',skillDesc:'敵に205%ダメージ',ult:'インフェルノ・コア',ultDesc:'敵に350%ダメージ',obtain:'降臨',evolve:'煉獄炎龍 ヴォルカノス'},
 fenrir:{id:'fenrir',name:'終牙狼 フェンリル',icon:'🐺',element:'闇',tribe:'幻獣',rarity:5,role:'アタッカー',passive:'lowhp',passiveName:'背水の終牙',passiveDesc:'HP50%以下で与ダメージ+40%',hp:170,atk:39,skill:'終牙',skillDesc:'敵に210%ダメージ',ult:'ラグナロクバイト',ultDesc:'敵に365%ダメージ',obtain:'高難度降臨',evolve:'終焉神狼 フェンリル'},
 volt:{id:'volt',name:'雷機獣 ヴォルトロン',icon:'🤖',element:'光',tribe:'機獣',rarity:5,role:'コントロール',passive:'stun',passiveName:'精密放電',passiveDesc:'スキルのスタン率35%',hp:154,atk:36,skill:'プラズマ砲',skillDesc:'敵に185%＋スタン',ult:'ゼウスドライブ',ultDesc:'敵に325%ダメージ',obtain:'星導召喚'},
 luna:{id:'luna',name:'月幻獣 ルナミア',icon:'🦄',element:'光',tribe:'幻獣',rarity:5,role:'タンク',passive:'moon',passiveName:'月守の結界',passiveDesc:'戦闘開始時、最初の敵攻撃15%軽減',hp:163,atk:30,skill:'月光障壁',skillDesc:'味方全体30%軽減',ult:'ルナエクリプス',ultDesc:'敵に220%＋全体30%回復',obtain:'星導召喚'},
 pix:{id:'pix',name:'星粒妖精 ピクシア',icon:'🧚',element:'光',tribe:'妖精',rarity:3,role:'周回',passive:'drop5',passiveName:'星粒の幸運',passiveDesc:'リーダー時、ドロップ率+5%',hp:104,atk:18,skill:'スターケア',skillDesc:'HP最低の味方を35%回復',ult:'ミルキーウェイ',ultDesc:'全体25%回復＋敵に120%',obtain:'星導召喚'}
};
const QUESTS:QuestDef[]=[
 {id:'n1',chapter:'c1',stage:'1-1',name:'はじまりの草原',icon:'🌿',cost:4,rank:1,enemy:'森牙ウルフ',enemyIcon:'🐺',element:'木',tribe:'獣',hp:430,atk:20,xp:24,gold:80,drops:[['slime',.28],['rabit',.22]]},
 {id:'n1b',chapter:'c1',stage:'1-2',name:'風鳴りの丘',icon:'🍃',cost:5,rank:1,enemy:'疾風ホーンラビ',enemyIcon:'🐇',element:'木',tribe:'獣',hp:560,atk:24,xp:31,gold:105,drops:[['rabit',.30],['slime',.18]]},
 {id:'n1c',chapter:'c1',stage:'1-3',name:'森番の獣道',icon:'🌲',cost:6,rank:2,enemy:'森番アルファウルフ',enemyIcon:'🐺',element:'木',tribe:'獣',hp:720,atk:29,xp:40,gold:135,drops:[['rabit',.32],['shell',.10]]},
 {id:'n2',chapter:'c2',stage:'2-1',name:'灼熱の火山道',icon:'🌋',cost:7,rank:2,enemy:'火鱗ワイバーン',enemyIcon:'🐲',element:'火',tribe:'ドラゴン',hp:780,atk:32,xp:48,gold:160,drops:[['salam',.25],['ember',.22]]},
 {id:'n2b',chapter:'c2',stage:'2-2',name:'熔岩の裂け目',icon:'🔥',cost:8,rank:3,enemy:'紅蓮ドレイク',enemyIcon:'🐉',element:'火',tribe:'ドラゴン',hp:920,atk:36,xp:58,gold:195,drops:[['salam',.30],['ember',.25]]},
 {id:'n2c',chapter:'c2',stage:'2-3',name:'火口の主',icon:'☄️',cost:9,rank:3,enemy:'火山竜ヴァルド',enemyIcon:'🐲',element:'火',tribe:'ドラゴン',hp:1120,atk:42,xp:72,gold:240,drops:[['salam',.34],['pix',.06]]},
 {id:'n3',chapter:'c3',stage:'3-1',name:'轟岩洞',icon:'🪨',cost:9,rank:3,enemy:'岩殻虫ロード',enemyIcon:'🪲',element:'木',tribe:'甲虫',hp:1080,atk:40,xp:70,gold:240,drops:[['shell',.30]]},
 {id:'n3b',chapter:'c3',stage:'3-2',name:'石晶回廊',icon:'💎',cost:10,rank:4,enemy:'晶殻ビートル',enemyIcon:'🪲',element:'木',tribe:'甲虫',hp:1280,atk:45,xp:84,gold:285,drops:[['shell',.34],['slime',.12]]},
 {id:'n3c',chapter:'c3',stage:'3-3',name:'地脈の守護者',icon:'⛰️',cost:11,rank:4,enemy:'岩王ゴライアス',enemyIcon:'🗿',element:'木',tribe:'甲虫',hp:1500,atk:50,xp:100,gold:330,drops:[['shell',.38],['salam',.08]]},
 {id:'a1',name:'翠嵐王、天を裂く',icon:'🌪️',cost:13,rank:3,enemy:'翠嵐王グリフォン',enemyIcon:'🦁',element:'木',tribe:'幻獣',hp:1750,atk:55,xp:125,gold:460,drop:'griff',dropRate:.55,advent:true,gimmick:'barrier',gimmickText:'翠嵐バリア：火属性とブレイカーが有効'},
 {id:'a2',name:'獄炎龍、地を焦がす',icon:'🔥',cost:16,rank:5,enemy:'獄炎龍ヴォルカノス',enemyIcon:'🐉',element:'火',tribe:'ドラゴン',hp:2250,atk:67,xp:175,gold:650,drop:'volc',dropRate:.50,advent:true,gimmick:'heat',gimmickText:'灼熱コア：水属性攻撃で熱量を下げる'},
 {id:'a3',name:'終焉を喰らう魔狼',icon:'🌑',cost:20,rank:7,enemy:'終牙狼フェンリル',enemyIcon:'🐺',element:'闇',tribe:'幻獣',hp:3100,atk:81,xp:245,gold:900,drop:'fenrir',dropRate:.45,advent:true,gimmick:'aura',gimmickText:'終焉オーラ：光属性攻撃で層を剥がす'}
];
const CHAPTERS:ChapterDef[]=[
 {id:'c1',title:'第1章 緑風の平原',subtitle:'獣たちが暮らす冒険の入口',icon:'🌿',questIds:['n1','n1b','n1c']},
 {id:'c2',title:'第2章 灼熱山脈',subtitle:'火竜が支配する赤熱の山道',icon:'🌋',questIds:['n2','n2b','n2c']},
 {id:'c3',title:'第3章 轟岩洞窟',subtitle:'硬い甲殻と鉱晶が眠る地下域',icon:'🪨',questIds:['n3','n3b','n3c']}
];
const needExp=(r:number)=>75+r*45;
const elem=(a:ElementType,d:ElementType)=>((a==='火'&&d==='木')||(a==='木'&&d==='水')||(a==='水'&&d==='火'))?1.5:((a==='木'&&d==='火')||(a==='水'&&d==='木')||(a==='火'&&d==='水'))?.75:((a==='光'&&d==='闇')||(a==='闇'&&d==='光'))?1.4:1;
const fresh=():GameState=>({version:6,starter:null,rank:1,exp:0,gems:620,gold:1600,crystals:2,stamina:30,maxStamina:30,staminaAt:Date.now(),owned:{},party:[],page:'home',cleared:[],adventCleared:[],battle:null});
