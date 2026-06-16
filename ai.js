// ==========================================

// 🧠 電腦 AI 與回合切換機制

// ==========================================

function endTurn() {

    if(currentTurn === 'player') {

        currentTurn = 'enemy'; selectedUnit = null;

        btn.disabled = true; btn.style.backgroundColor = '#7f8fa6';

        msg.innerText = '🤖 敵軍行動中...';

        

        // 敵軍回合開始時，敵軍回血

        units.filter(u => u.team === 'enemy').forEach(u => {

            u.hp = Math.min(UNIT_DATA[u.type].hp, u.hp + UNIT_DATA[u.type].regen);

        });

        

        draw(); saveGameState(); executeEnemyTurn();

    }

}


async function executeEnemyTurn() {

    let enemies = units.filter(u => u.team === 'enemy');

    for (let e of enemies) {

        if (e.hp <= 0 || e.hasActed) continue; 

        

        await panCameraTo(e.q, e.r); selectedUnit = e;

        msg.innerHTML = `🤖 敵方 ${UNIT_DATA[e.type].name} 正在思考戰術...`; draw(); await delay(400); 

        

        let uData = UNIT_DATA[e.type];

        let reachable = getReachableArea(e);

        let playerUnits = units.filter(u => u.team === 'player');

        if (playerUnits.length === 0) break;

        

        let bestHex = { q: e.q, r: e.r, cost: 0, hasZoc: false };

        let targetToAttack = null;

        

        // 🚑 醫療兵專屬 AI

        if (uData.heal > 0) {

            let injuredAllies = units.filter(u => u.team === 'enemy' && u.hp < UNIT_DATA[u.type].hp && u !== e);

            let highestScore = -Infinity;

            let isFleeing = injuredAllies.length === 0;

            let evaluationTargets = isFleeing ? [e] : injuredAllies; 


            for (const [key, pathData] of Object.entries(reachable)) {

                let [q, r] = key.split(',').map(Number); let cost = pathData.cost; let hasZoc = pathData.hasZoc;

                if (units.find(u => Math.round(u.q) === q && Math.round(u.r) === r && u !== e)) continue;

                

                let dangerPenalty = 0;

                for (let p of playerUnits) {

                    let pData = UNIT_DATA[p.type]; let distToPlayer = hexDistance({q, r}, p); let dangerZone = pData.move + pData.range; 

                    if (distToPlayer <= dangerZone) { dangerPenalty += 200 + (dangerZone - distToPlayer) * 10; }

                }


                for (let target of evaluationTargets) {

                    let score = 0;

                    if (isFleeing) { score = 1000 - dangerPenalty; } 

                    else {

                        let distToTarget = hexDistance({q, r}, target); let tData = UNIT_DATA[target.type];

                        let targetValue = (tData.hp - target.hp) * 2 + tData.ap + tData.def; 

                        

                        if (distToTarget > 0 && distToTarget <= uData.range) { score = 10000 + (targetValue * 20) - (dangerPenalty * 0.1); } 

                        else {

                            let realPathCost = getGlobalPathCost({q, r}, target);

                            if (realPathCost !== Infinity) { score = 5000 + (targetValue * 5) - (realPathCost * 300) - dangerPenalty; }

                        }

                    }

                    if (score > highestScore) {

                        highestScore = score; bestHex = { q, r, cost, hasZoc };

                        if (!isFleeing && hexDistance({q, r}, target) <= uData.range) targetToAttack = target; else targetToAttack = null; 

                    }

                }

            }

        } 

        // ⚔️ 一般戰鬥單位 AI（包含步兵佔領工廠邏輯）

        else {

            let minTargetDist = Infinity; 

            for (const [key, pathData] of Object.entries(reachable)) {

                let [q, r] = key.split(',').map(Number); let cost = pathData.cost; let hasZoc = pathData.hasZoc;

                if (units.find(u => Math.round(u.q) === q && Math.round(u.r) === r && u !== e)) continue;

                

                // 🏭 敵軍步兵優先佔領無主工廠
                if (e.type === 'Infantry') {
                    let baseType = hexMap[key];
                    if (baseType && baseType.startsWith('Factory')) {
                        let owner = factoryOwners[key];
                        // 如果工廠未被敵軍佔領，優先移動到該工廠
                        if (owner !== 'enemy') {
                            bestHex = { q, r, cost, hasZoc };
                            minTargetDist = -1; 
                            break;
                        }
                    }
                }

                for (let p of playerUnits) {

                    let straightDist = hexDistance({q, r}, p); 

                    if (straightDist > 0 && straightDist <= uData.range && uData.ap > 0) { 

                        bestHex = { q, r, cost, hasZoc }; targetToAttack = p; minTargetDist = -1; break; 

                    }

                    if (minTargetDist !== -1) {

                        let realPathCost = getGlobalPathCost({q, r}, p);

                        if (realPathCost < minTargetDist) { minTargetDist = realPathCost; bestHex = { q, r, cost, hasZoc }; }

                    }

                }

                if (minTargetDist === -1) break; 

            }

        }

        

        // --- 執行移動 ---

        if (bestHex.q !== e.q || bestHex.r !== e.r) {

            let zocText = bestHex.hasZoc ? " <span style='color:#f39c12;'>(受牽制)</span>" : "";

            msg.innerHTML = `🤖 敵方 ${UNIT_DATA[e.type].name} 移動了${zocText}。`;

            let fullPath = reconstructPath(reachable, bestHex);

            await animateUnitMovement(e, fullPath);

            e.currentMove -= bestHex.cost; e.hasMoved = true; await delay(300); 

        }

        

        // 🏭 檢查敵軍是否佔領工廠

        if (e.type === 'Infantry') {
            let key = `${Math.round(e.q)},${Math.round(e.r)}`;
            if (canOccupyFactory(e, Math.round(e.q), Math.round(e.r))) {
                if (occupyFactory(Math.round(e.q), Math.round(e.r), 'enemy')) {
                    msg.innerHTML = `🏭 <b style='color:#f39c12;'>敵方步兵已佔領工廠！紅軍現已控制此據點！</b>`;
                    draw(); await delay(600);
                }
            }
        }

        

        // --- 執行攻擊或補給 ---

        if (targetToAttack && !e.hasAttacked) {

            await panCameraTo(targetToAttack.q, targetToAttack.r);

            if (uData.heal > 0) {

                let actualHeal = Math.max(1, Math.round((e.hp / 100) * uData.heal));

                targetToAttack.hp = Math.min(UNIT_DATA[targetToAttack.type].hp, targetToAttack.hp + actualHeal); e.hasAttacked = true;

                msg.innerHTML = `💉 敵軍 ${uData.name} 進行戰場支援！為 ${UNIT_DATA[targetToAttack.type].name} 恢復 <b>${actualHeal}</b> 點生命力。`;

                draw(); await delay(800);

            } else if (uData.ap > 0) {

                let attackerTerrain = getFactoryTerrainType(Math.round(e.q), Math.round(e.r));
                let defenderTerrain = getFactoryTerrainType(Math.round(targetToAttack.q), Math.round(targetToAttack.r));

                let damage = calculateDamage(e, targetToAttack, attackerTerrain, defenderTerrain);

                targetToAttack.hp -= damage; e.hasAttacked = true;

                let combatMsg = `💥 敵軍 ${uData.name} 開火！對 ${UNIT_DATA[targetToAttack.type].name} 造成 <b>${damage}</b> 傷害。`;

                msg.innerHTML = combatMsg; await animateShake(targetToAttack); 

                

                if (targetToAttack.hp <= 0) { units = units.filter(u => u !== targetToAttack); combatMsg += ` 💀 陣亡！`; } 

                else {

                    let pData = UNIT_DATA[targetToAttack.type]; let dist = hexDistance(e, targetToAttack);

                    if (pData.ap > 0 && pData.canCounter !== false && dist <= pData.range) {

                        let counterDamage = calculateDamage(targetToAttack, e, defenderTerrain, attackerTerrain);

                        e.hp -= counterDamage; combatMsg += `<br>🛡️ 友軍反擊！對敵方造成 <b>${counterDamage}</b> 傷害。`;

                        msg.innerHTML = combatMsg; await animateShake(e); 

                        if (e.hp <= 0) { units = units.filter(u => u !== e); combatMsg += ` 💥 敵軍遭反殺！`; }

                    } else if (pData.canCounter === false) { combatMsg += `<br>⚠️ 友軍 ${pData.name} 遭到攻擊，無法進行反擊。`; }

                }

                msg.innerHTML = combatMsg; draw(); await delay(1000); 

            }

        }

        e.hasActed = true; selectedUnit = null; saveGameState(); draw(); await delay(300); 

    }

    

    if (units.filter(u => u.team === 'player').length === 0) { msg.innerText = '💀 基地遭毀滅：你戰敗了...'; localStorage.removeItem('chessGameState'); return; }

    if (units.filter(u => u.team === 'enemy').length === 0) { msg.innerText = '🏆 捷報！敵軍全數殲滅：你獲勝了！'; localStorage.removeItem('chessGameState'); return; }

    

    // 玩家回合開始前重置

    units.forEach(u => { u.hasMoved = false; u.hasActed = false; u.hasAttacked = false; u.currentMove = UNIT_DATA[u.type].move; });

    units.filter(u => u.team === 'player').forEach(u => { u.hp = Math.min(UNIT_DATA[u.type].hp, u.hp + UNIT_DATA[u.type].regen); });

    

    currentTurn = 'player'; btn.disabled = false; btn.style.backgroundColor = '#0fb9b1';

    msg.innerHTML = '🟢 <b>你的回合！</b>部隊已進行自我修復。'; saveGameState(); draw();

}

