function passiveInfo(id, q) { const u = M(id), f = active(); let mult = 1, label = ''; if (u.passive === 'break' && S.battle.stunned) {
    mult *= 1.4;
    label = u.passiveName;
} if (u.passive === 'beast' && q.tribe === '獣') {
    mult *= 1.35;
    label = u.passiveName;
} if (u.passive === 'dragon' && q.tribe === 'ドラゴン') {
    mult *= 1.35;
    label = u.passiveName;
} if (u.passive === 'weak' && elem(u.element, q.element) > 1) {
    mult *= 1.2;
    label = u.passiveName;
} if (u.passive === 'healthy' && f.hp / f.maxHp >= .8) {
    mult *= 1.25;
    label = u.passiveName;
} if (u.passive === 'lowhp' && f.hp / f.maxHp <= .5) {
    mult *= 1.4;
    label = u.passiveName;
} return { mult, label }; }
function passiveActive(id, q) { const u = M(id), b = S.battle, f = b?.fighters.find(x => x.id === id); if (!f || !b)
    return false; return (u.passive === 'break' && b.stunned) || (u.passive === 'beast' && q.tribe === '獣') || (u.passive === 'dragon' && q.tribe === 'ドラゴン') || (u.passive === 'weak' && elem(u.element, q.element) > 1) || (u.passive === 'healthy' && f.hp / f.maxHp >= .8) || (u.passive === 'lowhp' && f.hp / f.maxHp <= .5) || (u.passive === 'partyguard' && f.hp > 0) || (u.passive === 'barrier' && b.barrier > 0) || (u.passive === 'moon' && b.shield > 0); }
function logPassive(name) { const b = S.battle; const msg = `◆ ${name} 発動！`; if (b.log[b.log.length - 1] !== msg)
    b.log.push(msg); }
function hit(base, label) { const b = S.battle, q = Q(), f = active(), u = M(f.id), p = passiveInfo(f.id, q); if (p.label)
    logPassive(p.label); let dmg = Math.max(1, Math.floor(base * elem(u.element, q.element) * p.mult * (.94 + Math.random() * .12))); if (b.barrier > 0) {
    let barrierMult = u.element === '火' ? 1.35 : 1;
    if (u.passive === 'barrier') {
        barrierMult *= 1.5;
        logPassive(u.passiveName);
    }
    const bd = Math.floor(dmg * barrierMult);
    b.barrier -= bd;
    dmg = Math.floor(dmg * .35);
    b.log.push(`${label}：バリア${bd} / 本体${dmg}`);
    if (b.barrier <= 0) {
        b.stunned = true;
        b.log.push('💥 BARRIER BREAK!');
    }
}
else
    b.log.push(`${label}：${dmg}ダメージ`); b.enemyHp -= dmg; if (q.gimmick === 'heat' && u.element === '水' && b.heat > 0) {
    b.heat--;
    b.log.push('💧 水属性が灼熱コアを冷却：熱量-1');
} if (q.gimmick === 'aura' && u.element === '光' && b.aura > 0) {
    b.aura--;
    b.log.push('✨ 光属性が終焉オーラを1層解除');
} }
function heal(rate, all = true) { const f = active(), u = M(f.id), mul = u.passive === 'heal' ? 1.25 : 1, arr = all ? S.battle.fighters : S.battle.fighters.filter(x => x.hp > 0).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp).slice(0, 1); if (u.passive === 'heal')
    logPassive(u.passiveName); let total = 0; arr.forEach(x => { if (x.hp > 0) {
    const old = x.hp;
    x.hp = Math.min(x.maxHp, x.hp + Math.floor(x.maxHp * rate * mul));
    total += x.hp - old;
} }); S.battle.log.push(`💚 ${u.name}の回復：合計${total}`); }
function battleCommand(cmd) { const b = S.battle, f = active(), u = M(f.id), a = atkVal(f.id); f.guard = false; if (cmd === 'attack') {
    hit(a, `${u.name}の攻撃`);
    f.ult = Math.min(100, f.ult + 18);
} if (cmd === 'guard') {
    f.guard = true;
    f.ult = Math.min(100, f.ult + 8);
    b.log.push(`${u.name}は防御態勢`);
} if (cmd === 'skill') {
    if (u.id === 'livan')
        heal(.18);
    else if (u.id === 'slime' || u.id === 'pix')
        heal(u.id === 'pix' ? .35 : .28, false);
    else if (u.id === 'shell' || u.id === 'luna') {
        b.shield = Math.max(b.shield, u.id === 'shell' ? .35 : .30);
        b.log.push(`🛡 ${u.skill}：味方全体を軽減`);
    }
    else if (u.id === 'sylphin') {
        hit(a * 1.2, u.skill);
        hit(a * 1.2, u.skill);
    }
    else {
        hit(a * (u.id === 'volt' ? 1.85 : u.id === 'fenrir' ? 2.1 : 1.6), u.skill);
        if (u.passive === 'stun' && Math.random() < .35) {
            b.stunned = true;
            logPassive(u.passiveName);
            b.log.push('⚡ STUN!');
        }
    }
    f.ult = Math.min(100, f.ult + 14);
} if (cmd === 'ult' && f.ult >= 100) {
    f.ult = 0;
    const mult = { garum: 2.7, livan: 1.9, sylphin: 2.3, slime: 0, shell: 1.9, griff: 3.3, volc: 3.5, fenrir: 3.65, volt: 3.25, luna: 2.2, pix: 1.2 };
    const x = mult[u.id] ?? 2.5;
    if (x)
        hit(a * x, `🌠 ${u.ult}`);
    if (['livan', 'slime', 'luna', 'pix'].includes(u.id))
        heal({ livan: .25, slime: .2, luna: .3, pix: .25 }[u.id]);
    if (u.id === 'sylphin') {
        b.fighters.forEach(x => x.ult = Math.min(100, x.ult + 15));
        b.log.push('🌪 味方全体の奥義+15');
    }
} if (b.enemyHp <= 0) {
    win();
    return;
} nextTurn(); }
function nextTurn() { const b = S.battle; let i = b.turn + 1; while (i < b.fighters.length && b.fighters[i].hp <= 0)
    i++; if (i >= b.fighters.length)
    enemyTurn();
else {
    b.turn = i;
    render();
} }
function enemyTurn() { const b = S.battle, q = Q(); if (b.stunned) {
    b.log.push(`${q.enemy}は動けない！`);
    b.stunned = false;
}
else {
    let mult = b.round % 4 === 0 ? 1.65 : b.round % 3 === 0 ? 1.28 : 1;
    if (q.gimmick === 'heat' && b.heat >= 3)
        mult = 2.15;
    const guarder = b.fighters.find(x => x.hp > 0 && M(x.id).passive === 'partyguard');
    if (guarder)
        logPassive(M(guarder.id).passiveName);
    for (const f of b.fighters) {
        if (f.hp <= 0)
            continue;
        const red = b.shield + (guarder ? .08 : 0);
        const d = q.atk * mult * (f.guard ? .5 : 1) * (1 - Math.min(.7, red));
        f.hp -= Math.floor(d * (.9 + Math.random() * .2));
        f.ult = Math.min(100, f.ult + 12);
    }
    if (q.gimmick === 'heat')
        b.heat = b.heat >= 3 ? 0 : Math.min(3, b.heat + 1);
    b.log.push(`${q.enemy}の攻撃！`);
} b.shield = 0; b.fighters.forEach(x => x.guard = false); if (b.fighters.every(x => x.hp <= 0)) {
    S.battle = null;
    save();
    render();
    modal('<div class="reveal"><h2>QUEST FAILED</h2><button class="bigbtn" onclick="closeModal()">戻る</button></div>');
    return;
} b.round++; b.turn = 0; while (b.fighters[b.turn]?.hp <= 0)
    b.turn++; render(); }
function battleView(m) { const b = S.battle, q = Q(), f = active(), u = M(f.id), relation = elem(u.element, q.element), pactive = passiveActive(f.id, q); m.innerHTML = `<div class="battle-wrap"><div class="section-title"><div><div class="tiny muted">${q.stage ? `${q.stage} · ` : ''}ROUND ${b.round}</div><h2>${q.enemy}</h2></div><button class="btn bad" onclick="S.battle=null;save();render()">リタイア</button></div><div class="enemy"><div class="intent">⚠ 次の攻撃を予測して行動</div><div class="sprite">${q.enemyIcon}</div><div><b>${Math.max(0, b.enemyHp)} / ${b.enemyMax}</b><div class="hpbar"><i style="width:${Math.max(0, b.enemyHp / b.enemyMax * 100)}%"></i></div>${q.gimmick === 'barrier' ? `<div class="gimmick">🛡 バリア ${Math.max(0, b.barrier)}</div>` : ''}${q.gimmick === 'heat' ? `<div class="gimmick">🔥 熱量 ${b.heat}/3</div>` : ''}${q.gimmick === 'aura' ? `<div class="gimmick">🌑 オーラ ${b.aura}/3</div>` : ''}</div></div><div class="party-battle">${b.fighters.map((x, i) => fighterCard(x, i)).join('')}</div><div class="card" style="margin-top:10px"><div class="unit-row"><div class="avatar">${u.icon}</div><div class="unit-meta"><b>${u.name}</b><div class="tags"><span class="tag role">${u.role}</span><span class="tag ${relation > 1 ? 'element-good' : relation < 1 ? 'element-bad' : ''}">${relation > 1 ? 'WEAK!' : relation < 1 ? 'RESIST' : '等倍'}</span><span class="tag">🌠${f.ult}%</span>${pactive ? '<span class="tag passive-active">◆ ACTIVE</span>' : ''}</div><div class="passive-box tiny ${pactive ? 'active-passive' : ''}">◆ ${u.passiveName} — ${u.passiveDesc}</div></div></div><div class="commands"><button class="btn" onclick="battleCommand('attack')">⚔ 攻撃<small>奥義+18</small></button><button class="btn" onclick="battleCommand('skill')">✨ ${u.skill}<small>${u.skillDesc}</small></button><button class="btn" onclick="battleCommand('guard')">🛡 防御<small>被ダメージ50%軽減</small></button><button class="btn warn" ${f.ult < 100 ? 'disabled' : ''} onclick="battleCommand('ult')">🌠 ${u.ult}<small>${u.ultDesc}</small></button></div></div><div class="section-title compact"><h3>バトルログ</h3><span class="tiny muted">パッシブ発動も表示</span></div><div class="log">${b.log.slice(-14).reverse().map(x => `<div class="${x.startsWith('◆') ? 'passive-log' : ''}">${x}</div>`).join('')}</div></div>`; }
function fighterCard(f, i) { const u = M(f.id), on = passiveActive(f.id, Q()); return `<div class="fighter ${i === S.battle.turn ? 'active' : ''} ${f.hp <= 0 ? 'dead' : ''}"><div class="avatar">${u.icon}</div><div class="tiny">${u.name.split(' ')[1] || u.name}</div>${on ? '<div class="passive-dot">◆</div>' : ''}<div class="hpbar"><i style="width:${Math.max(0, f.hp / f.maxHp * 100)}%"></i></div><div class="tiny muted">${Math.max(0, f.hp)}/${f.maxHp}</div></div>`; }
function gainExp(n) { S.exp += n; while (S.exp >= needExp(S.rank)) {
    S.exp -= needExp(S.rank);
    S.rank++;
    S.maxStamina += 3;
    S.stamina = S.maxStamina;
    S.gems += 20;
    toast(`RANK ${S.rank}！ スタミナ全回復`);
} }
function addMonster(id, luck = 1) { if (S.owned[id])
    S.owned[id].luck = Math.min(99, S.owned[id].luck + luck);
else
    S.owned[id] = { level: 1, luck, evolved: false }; }
function win() { const q = Q(), first = !S.cleared.includes(q.id), drops = []; S.gold += q.gold; S.crystals += q.advent ? 2 : 1; if (first) {
    S.cleared.push(q.id);
    S.gems += 35;
} gainExp(q.xp); const lead = M(S.party[0]), luck = S.owned[S.party[0]].luck, passiveBonus = lead.passive === 'drop8' ? .08 : lead.passive === 'drop5' ? .05 : 0, bonus = Math.min(.36, luck / 99 * .28 + passiveBonus); if (q.advent) {
    const firstAdv = !S.adventCleared.includes(q.id);
    if (firstAdv || Math.random() < (q.dropRate || 0) + bonus) {
        addMonster(q.drop, 5);
        drops.push(q.drop);
    }
    if (firstAdv)
        S.adventCleared.push(q.id);
}
else
    for (const [id, r] of q.drops || [])
        if (Math.random() < Number(r) + bonus) {
            addMonster(id);
            drops.push(id);
        } S.battle = null; save(); render(); modal(`<div class="reveal"><div style="font-size:60px">🏆</div><h2>QUEST CLEAR!</h2><p>RANK EXP +${q.xp} / 🪙 +${q.gold}</p>${passiveBonus ? `<p class="passive-result">◆ ${lead.passiveName} 発動：ドロップ率 +${Math.round(passiveBonus * 100)}%</p>` : ''}${drops.length ? `<p>${drops.map(x => MONSTERS[x].icon + ' ' + MONSTERS[x].name).join('<br>')}</p>` : '<p class="muted">モンスタードロップなし</p>'}<button class="bigbtn" onclick="closeModal()">OK</button></div>`); }
function boxView(m) { const ids = Object.keys(S.owned).sort((a, b) => M(b).rarity - M(a).rarity); m.innerHTML = `<div class="section-title"><h2>モンスターBOX</h2><span class="tiny muted">${ids.length}種</span></div><div class="party-slots">${S.party.map((id, i) => `<div class="slot ${i === 0 ? 'leader' : ''}"><div class="avatar">${M(id).icon}</div><b class="tiny">${M(id).name.split(' ')[1] || M(id).name}</b><div class="tiny">🍀${S.owned[id].luck}</div></div>`).join('')}</div><div class="grid two" style="margin-top:14px">${ids.map(monsterCard).join('')}</div>`; }
function monsterCard(id) { const u = M(id), o = S.owned[id], cost = 90 + o.level * 40, can = !!u.evolve && !o.evolved && o.level >= 5 && S.crystals >= 5 && S.gold >= 800; return `<div class="card monster-card"><div class="unit-row"><div class="avatar">${u.icon}</div><div><span class="rarity">${stars(u.rarity)}</span><b style="display:block">${u.name}</b><div class="tags"><span class="tag">${u.element}</span><span class="tag">${u.tribe}</span><span class="tag role">${u.role}</span><span class="tag">Lv.${o.level}</span><span class="tag">🍀${o.luck}/99</span></div></div></div><div class="passive-box tiny"><b>◆ ${u.passiveName}</b><br>${u.passiveDesc}</div><p class="tiny muted">${u.skill} — ${u.skillDesc}<br>入手：${obtainText(id)}</p><button class="btn" ${S.gold < cost ? 'disabled' : ''} onclick="upgrade('${id}')">LvUP 🪙${cost}</button> <button class="btn" onclick="partyIn('${id}')">編成</button>${u.evolve && !o.evolved ? ` <button class="btn warn" ${can ? '' : 'disabled'} onclick="evolve('${id}')">進化</button>` : ''}</div>`; }
function upgrade(id) { const o = S.owned[id], c = 90 + o.level * 40; if (S.gold < c)
    return; S.gold -= c; o.level++; render(); }
function partyIn(id) { if (S.party.includes(id)) {
    toast('編成済み');
    return;
} const p = Number(prompt('入れ替える枠 1〜4', '1')) - 1; if (p >= 0 && p < 4)
    S.party[p] = id; render(); }
function evolve(id) { const o = S.owned[id], u = MONSTERS[id]; if (!u.evolve || o.level < 5 || S.crystals < 5 || S.gold < 800)
    return; S.crystals -= 5; S.gold -= 800; o.evolved = true; toast(`${u.evolve} に進化！`); render(); }
function obtainText(id) { const u = MONSTERS[id], places = QUESTS.filter(q => (q.drop === id) || (q.drops || []).some(([x]) => x === id)).map(q => `${q.stage ? `${q.stage} ` : ''}${q.name}`); return places.length ? places.join(' / ') : u.obtain; }
function dexView(m) { const ids = Object.keys(MONSTERS), owned = ids.filter(id => S.owned[id]).length; m.innerHTML = `<div class="section-title"><div><div class="tiny muted">MONSTER DEX</div><h2>モンスター図鑑</h2></div><span class="pill">${owned}/${ids.length}</span></div><div class="notice">未入手モンスターは詳細が伏せられます。通常クエスト・降臨・ガチャで図鑑を埋めよう。</div><div class="dex-progress"><div class="progress"><i style="width:${owned / ids.length * 100}%"></i></div><span>${Math.floor(owned / ids.length * 100)}%</span></div><div class="grid two">${ids.map((id, i) => dexCard(id, i + 1)).join('')}</div>`; }
function dexCard(id, no) { const base = MONSTERS[id], owned = !!S.owned[id]; if (!owned)
    return `<div class="card dex-card locked-dex"><div class="unit-row"><div class="avatar silhouette">⬛</div><div><div class="tiny muted">No.${String(no).padStart(3, '0')}</div><b>？？？？？？</b><div class="tags"><span class="tag">未入手</span></div></div></div><p class="tiny muted">入手すると能力・入手場所が解放されます。</p></div>`; const u = M(id), o = S.owned[id]; return `<div class="card dex-card"><div class="unit-row"><div class="avatar">${u.icon}</div><div><div class="tiny muted">No.${String(no).padStart(3, '0')}</div><span class="rarity">${stars(u.rarity)}</span><b style="display:block">${u.name}</b><div class="tags"><span class="tag">${u.element}</span><span class="tag">${u.tribe}</span><span class="tag role">${u.role}</span><span class="tag">🍀${o.luck}/99</span></div></div></div><div class="passive-box tiny"><b>◆ ${u.passiveName}</b><br>${u.passiveDesc}</div><p class="tiny"><b>${u.skill}</b> — ${u.skillDesc}<br><b>${u.ult}</b> — ${u.ultDesc}</p><div class="obtain-box tiny">📍 ${obtainText(id)}</div>${u.evolve ? `<div class="tiny evo-line">進化先：${u.evolve}</div>` : ''}</div>`; }
function gachaView(m) { m.innerHTML = `<div class="section-title"><h2>星導召喚</h2><span class="pill">💎 ${S.gems}</span></div><section class="hero"><h1>モンスター召喚</h1><p>★5 8%。同じモンスターはラックへ。新規入手は図鑑にも登録されます。</p><button class="bigbtn" onclick="pull(1)">1回 💎50</button> <button class="bigbtn" onclick="pull(10)">10連 💎500</button></section>`; }
function pull(n) { const c = n * 50; if (S.gems < c) {
    toast('星晶不足');
    return;
} S.gems -= c; const out = []; for (let i = 0; i < n; i++) {
    const r = Math.random(), pool = r < .08 ? ['volt', 'luna'] : r < .4 ? ['garum', 'livan', 'sylphin'] : ['pix', 'shell', 'salam'];
    const id = pool[Math.floor(Math.random() * pool.length)];
    addMonster(id);
    out.push(id);
} save(); modal(`<div class="reveal"><h2>召喚結果</h2><div class="grid two">${out.map(id => `<div class="card">${M(id).icon} ${M(id).name}<br><span class="rarity">${stars(M(id).rarity)}</span></div>`).join('')}</div><button class="bigbtn" onclick="closeModal()">OK</button></div>`); }
function otherView(m) { m.innerHTML = `<div class="section-title"><h2>v6</h2></div><div class="grid two"><div class="card"><h3>◆ パッシブ表示</h3><p class="tiny muted">発動条件を満たすとACTIVE表示とバトルログで確認できます。</p></div><div class="card"><h3>📖 モンスター図鑑</h3><p class="tiny muted">未入手は？？？表示。入手場所・パッシブ・進化先を確認できます。</p><button class="btn" onclick="go('dex')">図鑑を開く</button></div><div class="card"><h3>🗺 章・ステージ</h3><p class="tiny muted">通常クエストを3章・9ステージに整理しました。</p></div><div class="card"><h3>🔷 進化</h3><p class="tiny muted">Lv.5・進化晶5・800ゴールドで進化。</p></div><div class="card"><h3>💾 セーブ</h3><p class="tiny muted">v5セーブを自動移行し、v6キーへ保存します。</p></div><div class="card"><button class="btn bad" onclick="if(confirm('セーブ削除？')){localStorage.removeItem('monsterBattleV6');localStorage.removeItem('monsterBattleV5');S=fresh();render()}">最初から</button></div></div>`; }
setInterval(() => { if (S.stamina < S.maxStamina && Date.now() - S.staminaAt >= 180000) {
    S.stamina++;
    S.staminaAt = Date.now();
    save();
    render();
} }, 30000);
render();
