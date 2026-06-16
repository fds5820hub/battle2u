// ==========================================
// 📐 基礎六角網格運算
// ==========================================
function hexToPixel(q, r) { return { x: cameraX + HEX_SIZE * Math.sqrt(3) * (q + r/2), y: cameraY + HEX_SIZE * 3/2 * r }; }
function pixelToHex(x, y) {
    const ptX = x - cameraX, ptY = y - cameraY;
    const q = (Math.sqrt(3)/3 * ptX - 1/3 * ptY) / HEX_SIZE; const r = (2/3 * ptY) / HEX_SIZE;
    let rq = Math.round(q), rr = Math.round(r), rs = Math.round(-q-r);
    const qDiff = Math.abs(rq - q), rDiff = Math.abs(rr - r), sDiff = Math.abs(rs - -q-r);
    if (qDiff > rDiff && qDiff > sDiff) rq = -rr - rs; else if (rDiff > sDiff) rr = -rq - rs;
    return { q: rq, r: rr };
}
function hexDistance(h1, h2) { return (Math.abs(h1.q - h2.q) + Math.abs(h1.q + h1.r - h2.q - h2.r) + Math.abs(h1.r - h2.r)) / 2; }
function getHexNeighbors(q, r) { return [{q: q+1, r: r}, {q: q+1, r: r-1}, {q: q, r: r-1}, {q: q-1, r: r}, {q: q-1, r: r+1}, {q: q, r: r+1}]; }

// ==========================================
// 🧠 A* 尋路引擎：加入爬山與渡河判斷
// ==========================================
function getReachableArea(unit) {
    let uData = UNIT_DATA[unit.type]; let maxCost = unit.currentMove;
    let frontier = [{ q: unit.q, r: unit.r, cost: 0, hasZoc: false }];
    let reached = {}; reached[`${unit.q},${unit.r}`] = { cost: 0, hasZoc: false, cameFrom: null }; 

    while (frontier.length > 0) {
        frontier.sort((a, b) => a.cost - b.cost); let current = frontier.shift();
        let neighbors = getHexNeighbors(current.q, current.r);
        for (let n of neighbors) {
            let key = `${n.q},${n.r}`; if (!hexMap[key]) continue;
            let baseTerrainType = hexMap[key]; 
            let actualTerrainType = getFactoryTerrainType(n.q, n.r);
            let terrain = TERRAIN_DATA[actualTerrainType];
            let canWalk = terrain.isWalkable || (baseTerrainType === 'Mountain' && uData.climb > 0) || (baseTerrainType === 'River' && uData.river > 0);
            if (!canWalk) continue;
            
            if (units.find(u => Math.round(u.q) === n.q && Math.round(u.r) === n.r && u.team !== unit.team)) continue;

            let targetNeighbors = getHexNeighbors(n.q, n.r); let adjacentEnemiesCount = 0;
            for (let tn of targetNeighbors) { if (units.find(u => Math.round(u.q) === tn.q && Math.round(u.r) === tn.r && u.team !== unit.team)) adjacentEnemiesCount++; }

            let terrainCost = terrain.cost;
            if (!terrain.isWalkable) {
                // 💡 核心機制：踏入高山或河流等惡劣地形，立刻消耗所有剩餘行動力
                terrainCost = Math.max(1, maxCost - current.cost);
            }
            
            let baseCost = current.cost + terrainCost; let zocCost = adjacentEnemiesCount;         
            let newCost = baseCost + zocCost; let pathHasZoc = current.hasZoc || (zocCost > 0);

            if (baseCost <= maxCost) {
                if (newCost > maxCost) newCost = maxCost;
                if (typeof reached[key] === 'undefined' || newCost < reached[key].cost) {
                    reached[key] = { cost: newCost, hasZoc: pathHasZoc, cameFrom: {q: current.q, r: current.r} };
                    frontier.push({ q: n.q, r: n.r, cost: newCost, hasZoc: pathHasZoc });
                }
            }
        }
    }
    return reached;
}

function reconstructPath(reachable, targetHex) {
    let path = []; let curr = {q: targetHex.q, r: targetHex.r};
    while (curr) { path.unshift(curr); let rData = reachable[`${curr.q},${curr.r}`]; curr = rData ? rData.cameFrom : null; }
    return path;
}

function getGlobalPathCost(start, target) {
    let frontier = [{ q: start.q, r: start.r, cost: 0, priority: 0 }];
    let reached = {}; reached[`${start.q},${start.r}`] = 0;

    while (frontier.length > 0) {
        frontier.sort((a, b) => a.priority - b.priority); let current = frontier.shift();
        if (current.q === target.q && current.r === target.r) return current.cost;
        let neighbors = getHexNeighbors(current.q, current.r);
        for (let n of neighbors) {
            let key = `${n.q},${n.r}`; if (!hexMap[key]) continue;
            let baseTerrainType = hexMap[key];
            let actualTerrainType = getFactoryTerrainType(n.q, n.r);
            let terrain = TERRAIN_DATA[actualTerrainType];
            if (!terrain.isWalkable && !(n.q === target.q && n.r === target.r)) continue;

            let terrainCost = terrain.cost >= 99 ? 6 : terrain.cost; let newCost = current.cost + terrainCost;
            if (typeof reached[key] === 'undefined' || newCost < reached[key]) {
                reached[key] = newCost; frontier.push({ q: n.q, r: n.r, cost: newCost, priority: newCost + hexDistance(n, target) });
            }
        }
    }
    return Infinity; 
}
