type ElementType = '火'|'水'|'木'|'光'|'闇';
type AbilityCategory = 'killer'|'gimmick'|'support'|'condition'|'farm'|'unique';
interface AbilityDef { id:string; name:string; desc:string; category:AbilityCategory; unique?:boolean }
interface MonsterDef { id:string; name:string; icon:string; element:ElementType; tribe:string; rarity:number; role:string; abilities:string[]; hp:number; atk:number; skill:string; skillDesc:string; ult:string; ultDesc:string; obtain:string; evolve?:string; /** @deprecated v11 compatibility only */ passive?:string; /** @deprecated v11 compatibility only */ passiveName?:string; /** @deprecated v11 compatibility only */ passiveDesc?:string }
interface QuestDef { id:string; chapter?:string; stage?:string; name:string; icon:string; cost:number; rank:number; enemy:string; enemyIcon:string; element:ElementType; tribe:string; hp:number; atk:number; xp:number; gold:number; drops?:[string,number][]; drop?:string; dropRate?:number; advent?:boolean; gimmick?:'barrier'|'heat'|'aura'; gimmickText?:string }
interface ChapterDef { id:string; title:string; subtitle:string; icon:string; questIds:string[] }
interface OwnedMonster { level:number; luck:number; evolved:boolean }
interface FighterState { id:string; hp:number; maxHp:number; ult:number; guard:boolean }
interface BattleState { quest:string; enemyHp:number; enemyMax:number; round:number; turn:number; fighters:FighterState[]; shield:number; debuff:number; barrier:number; heat:number; aura:number; stunned:boolean; log:string[] }
interface GameState { version:number; starter:string|null; rank:number; exp:number; gems:number; gold:number; crystals:number; stamina:number; maxStamina:number; staminaAt:number; owned:Record<string,OwnedMonster>; party:string[]; page:string; cleared:string[]; adventCleared:string[]; battle:BattleState|null }
