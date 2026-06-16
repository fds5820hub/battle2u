// ==========================================
// 🛠️ 基礎設定與全新現代兵種圖鑑
// ==========================================
const UNIT_DATA = {
    'LightTank': { name: '輕型裝甲坦克', hp: 100, ap: 50, def: 50, regen: 20, move: 6, climb: 0, river: 0, antiAir: 0, moveThenAttack: 1, attackThenMove: 0, range: 1, heal: 0, color: '#0fb9b1', imgSrc: 'https://cdn-icons-png.flaticon.com/128/3305/3305315.png' },
    'MediumTank': { name: '中型裝甲坦克', hp: 100, ap: 60, def: 60, regen: 15, move: 5, climb: 0, river: 0, antiAir: 0, moveThenAttack: 1, attackThenMove: 0, range: 1, heal: 0, color: '#3867d6', imgSrc: 'https://cdn-icons-png.flaticon.com/128/1984/1984183.png' },
    'HeavyTank': { name: '重型裝甲坦克', hp: 100, ap: 70, def: 70, regen: 10, move: 4, climb: 0, river: 0, antiAir: 0, moveThenAttack: 1, attackThenMove: 0, range: 1, heal: 0, color: '#2bcbba', imgSrc: 'https://cdn-icons-png.flaticon.com/128/2223/2223150.png' },
    'Fortress': { name: '強化裝甲堡壘', hp: 100, ap: 90, def: 90, regen: 5, move: 2, climb: 0, river: 0, antiAir: 40, moveThenAttack: 1, attackThenMove: 0, range: 1, heal: 0, color: '#f7b731', imgSrc: 'https://cdn-icons-png.flaticon.com/128/1048/1048265.png' },
    'Infantry': { name: '步兵', hp: 100, ap: 20, def: 10, regen: 30, move: 3, climb: 1, river: 1, antiAir: 10, moveThenAttack: 1, attackThenMove: 0, range: 1, heal: 0, color: '#20bf6b', imgSrc: 'https://cdn-icons-png.flaticon.com/128/3011/3011281.png' },
    'Bazooka': { name: '火箭筒兵', hp: 100, ap: 60, def: 10, regen: 20, move: 2, climb: 0, river: 0, antiAir: 30, moveThenAttack: 1, attackThenMove: 0, range: 2, heal: 0, color: '#eb3b5a', imgSrc: 'https://cdn-icons-png.flaticon.com/128/2056/2056073.png' },
    'Medic': { name: '維修補給兵', hp: 100, ap: 0, def: 10, regen: 30, move: 4, climb: 0, river: 0, antiAir: 0, moveThenAttack: 1, attackThenMove: 0, range: 2, heal: 40, color: '#a5b1c2', imgSrc: 'https://cdn-icons-png.flaticon.com/128/3063/3063206.png' },
    'DirectArtillery': { name: '直擊快砲連', hp: 100, ap: 80, def: 30, regen: 30, move: 8, climb: 0, river: 0, antiAir: 20, moveThenAttack: 1, attackThenMove: 1, range: 1, heal: 0, color: '#fa8231', imgSrc: 'https://cdn-icons-png.flaticon.com/128/6509/6509988.png' },
    'IndirectArtillery': { name: '隔空快砲連', hp: 100, ap: 50, def: 30, regen: 30, move: 6, climb: 0, river: 0, antiAir: 20, moveThenAttack: 1, attackThenMove: 1, range: 3, heal: 0, canCounter: false, color: '#8854d0', imgSrc: 'https://cdn-icons-png.flaticon.com/128/5021/5021644.png' }
};

const TERRAIN_DATA = {
    'Grass':    { name: '平原', defBonus: 0.0, atkMod: 0.0,   isWalkable: true,  cost: 1, color: '#20bf6b', imgSrc: 'img/grass.jpg' },
    'Forest':   { name: '森林', defBonus: 0.3, atkMod: 0,  isWalkable: true,  cost: 3, color: '#019031', imgSrc: 'img/forest.jpg' },
    'Mountain': { name: '高山', defBonus: 0.4, atkMod: 0.2,   isWalkable: false, cost: 99, color: '#778ca3', imgSrc: 'img/mountain.jpg' },
    'River':    { name: '河流', defBonus: -0.2, atkMod: -0.2, isWalkable: false, cost: 99, color: '#45aaf2', imgSrc: 'img/river.jpg' },
    'Hill':     { name: '山丘', defBonus: 0.2, atkMod: 0.2,   isWalkable: true,  cost: 2, color: '#d1ccc0', imgSrc: 'img/hill.jpg' },
    'Bridge':   { name: '橋樑', defBonus: -0.1, atkMod: 0.0,  isWalkable: true,  cost: 1, color: '#a5b1c2', imgSrc: 'img/bridge.jpg' },
    'Base_r':   { name: '基地紅', defBonus: -0.1, atkMod: 0.0,  isWalkable: true,  cost: 1, color: '#eb3b5a', imgSrc: 'img/base_r.jpg' },
    'Base_b':   { name: '基地藍', defBonus: -0.1, atkMod: 0.0,  isWalkable: true,  cost: 1, color: '#3498db', imgSrc: 'img/base_b.jpg' },
    'Factory_g':{ name: '工廠灰', defBonus: -0.1, atkMod: 0.0,  isWalkable: true,  cost: 1, color: '#7f8fa6', imgSrc: 'img/factory_g.jpg' },
    'Factory_r':{ name: '工廠紅', defBonus: -0.1, atkMod: 0.0,  isWalkable: true,  cost: 1, color: '#fc5c65', imgSrc: 'img/factory_r.jpg' },
    'Factory_b':{ name: '工廠藍', defBonus: -0.1, atkMod: 0.0,  isWalkable: true,  cost: 1, color: '#45aaf2', imgSrc: 'img/factory_b.jpg' },
};

const terrainImages = {};
const unitImages = {};
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const msg = document.getElementById('msg');
const btn = document.getElementById('endTurnBtn');

// ⚔️ 計算公式
function calculateDamage(attacker, defender, attackerTerrainType, defenderTerrainType) {
    let baseAp = UNIT_DATA[attacker.type].ap;
    if (baseAp <= 0) return 0; 
    let maxHp = UNIT_DATA[attacker.type].hp;
    let healthRatio = attacker.hp / maxHp; 
    let actualAp = baseAp * healthRatio; 
    let attackerTerrain = TERRAIN_DATA[attackerTerrainType];
    let defenderTerrain = TERRAIN_DATA[defenderTerrainType];
    let terrainMultiplier = 1.0 - defenderTerrain.defBonus + attackerTerrain.atkMod;
    let armorFactor = 100 / (100 + UNIT_DATA[defender.type].def);
    let baseDamage = actualAp * terrainMultiplier * armorFactor;
    let randomFactor = 0.9 + (Math.random() * 0.2);
    return Math.max(1, Math.round(baseDamage * randomFactor));
}

const delay = ms => new Promise(res => setTimeout(res, ms));

// ==========================================
// 🎥 全域變數與運鏡特效
// ==========================================
const MAP_RADIUS = 8; 
let HEX_SIZE = 25; 
let cameraX = canvas.width / 2;
let cameraY = canvas.height / 2;
let isDragging = false; let hasDragged = false; let dragStartX = 0; let dragStartY = 0; let initialPinchDistance = null; let isAnimating = false; 

let currentTurn = 'player';
let selectedUnit = null;
let hexMap = {}; 
let units = [];

async function panCameraTo(q, r) {
    let wasAnimating = isAnimating; if(!wasAnimating) isAnimating = true; 
    const targetOffsetX = HEX_SIZE * Math.sqrt(3) * (q + r/2); const targetOffsetY = HEX_SIZE * 3/2 * r;
    const targetCameraX = canvas.width / 2 - targetOffsetX; const targetCameraY = canvas.height / 2 - targetOffsetY;
    for (let i = 0; i < 15; i++) {
        cameraX += (targetCameraX - cameraX) * 0.2; cameraY += (targetCameraY - cameraY) * 0.2;
        draw(); await delay(16);
    }
    cameraX = targetCameraX; cameraY = targetCameraY; draw();
    if(!wasAnimating) isAnimating = false; 
}

async function smartPanCamera(q, r) {
    const targetOffsetX = HEX_SIZE * Math.sqrt(3) * (q + r/2); const targetOffsetY = HEX_SIZE * 3/2 * r;
    const screenX = cameraX + targetOffsetX; const screenY = cameraY + targetOffsetY;
    const marginX = canvas.width * 0.25; const marginY = canvas.height * 0.25;
    if (screenX < marginX || screenX > canvas.width - marginX || screenY < marginY || screenY > canvas.height - marginY) {
        await panCameraTo(q, r);
    }
}

async function animateUnitMovement(unit, path) {
    isAnimating = true; 
    for (let i = 1; i < path.length; i++) {
        let startQ = unit.q; let startR = unit.r; let targetQ = path[i].q; let targetR = path[i].r;
        const frames = 8; 
        for (let f = 1; f <= frames; f++) {
            unit.q = startQ + (targetQ - startQ) * (f / frames); unit.r = startR + (targetR - startR) * (f / frames);
            const targetOffsetX = HEX_SIZE * Math.sqrt(3) * (unit.q + unit.r/2); const targetOffsetY = HEX_SIZE * 3/2 * unit.r;
            const screenX = cameraX + targetOffsetX; const screenY = cameraY + targetOffsetY;
            const marginX = canvas.width * 0.25; const marginY = canvas.height * 0.25;

            if (screenX < marginX) cameraX += (marginX - screenX) * 0.3;
            else if (screenX > canvas.width - marginX) cameraX -= (screenX - (canvas.width - marginX)) * 0.3;
            if (screenY < marginY) cameraY += (marginY - screenY) * 0.3;
            else if (screenY > canvas.height - marginY) cameraY -= (screenY - (canvas.height - marginY)) * 0.3;
            draw(); await delay(16); 
        }
        unit.q = targetQ; unit.r = targetR;
    }
    isAnimating = false; 
}

async function animateShake(unit) {
    let wasAnimating = isAnimating;
    if (!wasAnimating) isAnimating = true; 
    for (let i = 0; i < 6; i++) {
        unit.offsetX = (Math.random() - 0.5) * 12; unit.offsetY = (Math.random() - 0.5) * 12; 
        draw(); await delay(30); 
    }
    unit.offsetX = 0; unit.offsetY = 0; draw();
    if (!wasAnimating) isAnimating = false; 
}

// ==========================================
// 💾 存檔與初始化
// ==========================================
function saveGameState() {
    const state = { units: units, currentTurn: currentTurn, lastMessage: msg.innerHTML, selectedUnitId: selectedUnit ? selectedUnit.id : null };
    localStorage.setItem('chessGameState', JSON.stringify(state));
}

function resetGame() {
    if (confirm("確定要重新開始遊戲嗎？目前的進度將會被清除。")) {
        localStorage.removeItem('chessGameState'); window.location.hash = ''; location.reload(); 
    }
}

function startFromIntro(isNewGame) {
    if (isNewGame) localStorage.removeItem('chessGameState'); 
    else if (!localStorage.getItem('chessGameState')) alert("找不到本機存檔，將為您開啟全新遊戲！");
    window.location.hash = 'game'; document.getElementById('intro-screen').style.display = 'none'; isIntroDone = true;
    if (resourcesLoaded && !gameStarted) { gameStarted = true; initGame(); }
}

function initGame() {
    let radius = MAP_RADIUS;
    for (let q = -radius; q <= radius; q++) {
        for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) { hexMap[`${q},${r}`] = 'Grass'; }
    }
    const specials = {
        "0,-4": "River", "0,-3": "River", "0,-2": "River", "0,-1": "River", "-1,0": "River", "1,0": "River", "-1,-1": "River", "-1,-2": "River", "2,0": "River", "-1,1": "River", "-1,3": "River", "-1,4": "River", "1,4": "River",
        "0,4": "Bridge","-1,5": "Bridge", 
        "0,0": "River", "0,1": "River","0,2": "River","0,3": "River","0,5": "River","0,6": "River",
        "2,2": "Hill", "3,1": "Hill", "-2,2": "Hill", 
        "1,1": "Mountain", "-2,-2":"Mountain",
        "-2,0": "Forest", "3,-2": "Forest",
        "-5,0": "Base_b","5,0": "Base_r",
        "5,3": "Factory_g","4,3": "Factory_r","-3,3": "Factory_b",
    };
    for (const [key, val] of Object.entries(specials)) { if(hexMap[key]) hexMap[key] = val; }
    
    const savedState = localStorage.getItem('chessGameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        units = state.units; currentTurn = state.currentTurn;
        selectedUnit = state.selectedUnitId ? (units.find(u => u.id === state.selectedUnitId) || null) : null;
        if (state.lastMessage) msg.innerHTML = state.lastMessage;
        if (currentTurn !== 'player') { btn.disabled = true; btn.style.backgroundColor = '#7f8fa6'; setTimeout(executeEnemyTurn, 800); }
    } else {
        units = [];
        // 🟢 玩家與紅方敵軍配置
        units.push({ id: 1, q: -3, r: 3, team: 'player', type: 'LightTank', hp: UNIT_DATA['LightTank'].hp, currentMove: UNIT_DATA['LightTank'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 2, q: -4, r: 3, team: 'player', type: 'MediumTank', hp: UNIT_DATA['MediumTank'].hp, currentMove: UNIT_DATA['MediumTank'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 3, q: -2, r: 3, team: 'player', type: 'HeavyTank', hp: UNIT_DATA['HeavyTank'].hp, currentMove: UNIT_DATA['HeavyTank'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 4, q: -3, r: 2, team: 'player', type: 'Fortress', hp: UNIT_DATA['Fortress'].hp, currentMove: UNIT_DATA['Fortress'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 5, q: -2, r: 2, team: 'player', type: 'Infantry', hp: UNIT_DATA['Infantry'].hp, currentMove: UNIT_DATA['Infantry'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 6, q: -1, r: 2, team: 'player', type: 'Bazooka', hp: UNIT_DATA['Bazooka'].hp, currentMove: UNIT_DATA['Bazooka'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 7, q: -4, r: 4, team: 'player', type: 'Medic', hp: UNIT_DATA['Medic'].hp, currentMove: UNIT_DATA['Medic'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 8, q: -5, r: 4, team: 'player', type: 'DirectArtillery', hp: UNIT_DATA['DirectArtillery'].hp, currentMove: UNIT_DATA['DirectArtillery'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 9, q: -2, r: 4, team: 'player', type: 'IndirectArtillery', hp: UNIT_DATA['IndirectArtillery'].hp, currentMove: UNIT_DATA['IndirectArtillery'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 10, q: 3, r: -3, team: 'enemy', type: 'LightTank', hp: UNIT_DATA['LightTank'].hp, currentMove: UNIT_DATA['LightTank'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 11, q: 4, r: -3, team: 'enemy', type: 'MediumTank', hp: UNIT_DATA['MediumTank'].hp, currentMove: UNIT_DATA['MediumTank'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 12, q: 2, r: -3, team: 'enemy', type: 'HeavyTank', hp: UNIT_DATA['HeavyTank'].hp, currentMove: UNIT_DATA['HeavyTank'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 13, q: 3, r: -2, team: 'enemy', type: 'Fortress', hp: UNIT_DATA['Fortress'].hp, currentMove: UNIT_DATA['Fortress'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 14, q: 2, r: -2, team: 'enemy', type: 'Infantry', hp: UNIT_DATA['Infantry'].hp, currentMove: UNIT_DATA['Infantry'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 15, q: 1, r: -2, team: 'enemy', type: 'Bazooka', hp: UNIT_DATA['Bazooka'].hp, currentMove: UNIT_DATA['Bazooka'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 16, q: 4, r: -4, team: 'enemy', type: 'Medic', hp: UNIT_DATA['Medic'].hp, currentMove: UNIT_DATA['Medic'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 17, q: 5, r: -4, team: 'enemy', type: 'DirectArtillery', hp: UNIT_DATA['DirectArtillery'].hp, currentMove: UNIT_DATA['DirectArtillery'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        units.push({ id: 18, q: 2, r: -4, team: 'enemy', type: 'IndirectArtillery', hp: UNIT_DATA['IndirectArtillery'].hp, currentMove: UNIT_DATA['IndirectArtillery'].move, hasMoved: false, hasActed: false, hasAttacked: false });
        msg.innerHTML = '🟢 <b>大軍已就緒！</b>點擊藍色單位進行調度與攻擊。'; saveGameState(); 
    }
    draw();
}

// ==========================================
// 🎨 渲染引擎
// ==========================================
function clampCamera() {
    const paddingX = HEX_SIZE * 2; const paddingY = HEX_SIZE * 2.5; 
    const mapHalfWidth = MAP_RADIUS * Math.sqrt(3) * HEX_SIZE + paddingX; const mapHalfHeight = MAP_RADIUS * 1.5 * HEX_SIZE + paddingY;
    if (mapHalfWidth * 2 <= canvas.width) cameraX = canvas.width / 2;
    else { const minX = canvas.width - mapHalfWidth; const maxX = mapHalfWidth; cameraX = Math.max(minX, Math.min(cameraX, maxX)); }
    if (mapHalfHeight * 2 <= canvas.height) cameraY = canvas.height / 2;
    else { const minY = canvas.height - mapHalfHeight; const maxY = mapHalfHeight; cameraY = Math.max(minY, Math.min(cameraY, maxY)); }
}

function draw() {
    clampCamera(); ctx.clearRect(0, 0, canvas.width, canvas.height);
    let reachable = {};
    if (selectedUnit && !isAnimating) {
        let uData = UNIT_DATA[selectedUnit.type];
        if (!selectedUnit.hasMoved || (selectedUnit.hasAttacked && uData.attackThenMove === 1 && selectedUnit.currentMove > 0)) {
            reachable = getReachableArea(selectedUnit);
        }
    }
    
    for (const [key, terrainType] of Object.entries(hexMap)) {
        let [q, r] = key.split(',').map(Number); let img = terrainImages[terrainType]; const pos = hexToPixel(q, r);
        ctx.save(); ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const px = pos.x + HEX_SIZE * Math.cos(Math.PI/180 * (60*i - 30)); const py = pos.y + HEX_SIZE * Math.sin(Math.PI/180 * (60*i - 30));
            if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
        }
        ctx.closePath(); ctx.clip();
        if (img && img.complete && img.naturalWidth > 0) ctx.drawImage(img, pos.x - HEX_SIZE, pos.y - HEX_SIZE, HEX_SIZE * 2, HEX_SIZE * 2);
        else { ctx.fillStyle = TERRAIN_DATA[terrainType].color; ctx.fill(); }
        ctx.restore(); ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const px = pos.x + HEX_SIZE * Math.cos(Math.PI/180 * (60*i - 30)); const py = pos.y + HEX_SIZE * Math.sin(Math.PI/180 * (60*i - 30));
            if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
        }
        ctx.closePath(); ctx.strokeStyle = '#2f3640'; ctx.lineWidth = 0.5; ctx.stroke();
    }

    if (selectedUnit && !isAnimating) {
        for (const [key, terrainType] of Object.entries(hexMap)) {
            let [q, r] = key.split(',').map(Number); let dist = hexDistance({q, r}, selectedUnit);
            let uData = UNIT_DATA[selectedUnit.type];
            let isOccupied = units.find(u => Math.round(u.q) === q && Math.round(u.r) === r); 
            let isEnemy = isOccupied && isOccupied.team !== selectedUnit.team; 
            
            let highlight = null; let borderColor = null; let currentLineWidth = 2.5;
            let canShowMove = !selectedUnit.hasMoved || (selectedUnit.hasAttacked && uData.attackThenMove === 1 && selectedUnit.currentMove > 0);
            let isAlly = isOccupied && isOccupied.team === selectedUnit.team && isOccupied !== selectedUnit; 

            if (canShowMove && typeof reachable[key] !== 'undefined' && dist > 0 && !isOccupied) {
                highlight = selectedUnit.team === 'player' ? 'rgba(23, 76, 255, 0.4)' : 'rgba(231, 76, 60, 0.3)'; 
                borderColor = selectedUnit.team === 'player' ? 'rgba(23, 76, 255, 1)' : 'rgba(231, 76, 60, 1)'; 
            } else if (dist > 0 && dist <= uData.range && isEnemy && !selectedUnit.hasAttacked && uData.ap > 0) {
                highlight = 'rgba(255, 0, 0, 0.5)'; borderColor = 'rgba(255, 0, 0, 1)'; 
            } else if (dist > 0 && dist <= uData.range && isAlly && !selectedUnit.hasAttacked && uData.heal > 0 && isOccupied.hp < UNIT_DATA[isOccupied.type].hp) {
                highlight = 'rgba(241, 196, 15, 0.5)'; borderColor = 'rgba(243, 156, 18, 1)'; 
            } else if ((selectedUnit.hasMoved || selectedUnit.hasAttacked) && !selectedUnit.hasActed && dist === 0) {
                highlight = 'rgba(255, 255, 255, 0.4)'; borderColor = 'rgba(255, 255, 255, 1)'; 
            }

            if (highlight) {
                const pos = hexToPixel(q, r); ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const px = pos.x + HEX_SIZE * Math.cos(Math.PI/180 * (60*i - 30)); const py = pos.y + HEX_SIZE * Math.sin(Math.PI/180 * (60*i - 30));
                    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
                }
                ctx.closePath(); ctx.fillStyle = highlight; ctx.fill(); ctx.strokeStyle = borderColor; ctx.lineWidth = currentLineWidth; ctx.stroke();
            }
        }
    }

    let renderUnits = [...units].sort((a, b) => { if (a === selectedUnit) return 1; if (b === selectedUnit) return -1; return 0; });
    renderUnits.forEach(u => {
        const pos = hexToPixel(u.q, u.r);
        const x = pos.x + (u.offsetX || 0); const y = pos.y + (u.offsetY || 0);
        const uData = UNIT_DATA[u.type]; const uImg = unitImages[u.type]; 
        
        ctx.beginPath(); ctx.arc(x, y, HEX_SIZE * 0.7, 0, Math.PI * 2); 
        if (selectedUnit === u) ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; 
        else ctx.fillStyle = (u.team === 'player' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(231, 76, 60, 0.3)');
        ctx.fill();
        ctx.strokeStyle = (u.team === 'player' ? '#3498db' : '#e74c3c');
        ctx.lineWidth = selectedUnit === u ? 3 : 1; ctx.stroke();

        if (uImg && uImg.complete && uImg.naturalWidth > 0) {
            const imgRadius = HEX_SIZE * 0.8; ctx.drawImage(uImg, x - imgRadius, y - imgRadius, imgRadius * 2, imgRadius * 2);
        } else {
            ctx.beginPath(); ctx.arc(x, y, HEX_SIZE * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = uData.color; ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText(uData.name[0], x, y); 
        }
        if (u.hasActed) { ctx.beginPath(); ctx.arc(x, y, HEX_SIZE * 0.7, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill(); }

        ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center'; ctx.lineWidth = 2; ctx.strokeStyle = '#000';
        const hpText = Math.max(0, Math.round(u.hp)).toString();
        ctx.strokeText(hpText, x, y + HEX_SIZE * 0.8); ctx.fillText(hpText, x, y + HEX_SIZE * 0.8);
    });
}

// ==========================================
// 🖱️ 事件監聽 (縮放與點擊)
// ==========================================
canvas.addEventListener('mousedown', (e) => { if (isAnimating) return; isDragging = true; hasDragged = false; dragStartX = e.clientX; dragStartY = e.clientY; });
canvas.addEventListener('mousemove', (e) => {
    if (isDragging && !isAnimating) {
        if (Math.abs(e.clientX - dragStartX) > 3 || Math.abs(e.clientY - dragStartY) > 3) hasDragged = true;
        const rect = canvas.getBoundingClientRect(); cameraX += (e.clientX - dragStartX) * (canvas.width / rect.width); cameraY += (e.clientY - dragStartY) * (canvas.height / rect.height);
        dragStartX = e.clientX; dragStartY = e.clientY; draw();
    }
});
canvas.addEventListener('mouseup', () => { isDragging = false; }); canvas.addEventListener('mouseleave', () => { isDragging = false; });
canvas.addEventListener('wheel', (e) => {
    if (isAnimating) return; e.preventDefault();
    const rect = canvas.getBoundingClientRect(); const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width); const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9; const newHexSize = HEX_SIZE * zoomFactor;
    if (newHexSize >= 15 && newHexSize <= 80) { cameraX = mouseX - (mouseX - cameraX) * zoomFactor; cameraY = mouseY - (mouseY - cameraY) * zoomFactor; HEX_SIZE = newHexSize; draw(); }
}, { passive: false });

function getPinchDistance(touches) { return Math.sqrt(Math.pow(touches[0].clientX - touches[1].clientX, 2) + Math.pow(touches[0].clientY - touches[1].clientY, 2)); }
canvas.addEventListener('touchstart', (e) => {
    if (isAnimating) return;
    if (e.touches.length === 1) { isDragging = true; hasDragged = false; dragStartX = e.touches[0].clientX; dragStartY = e.touches[0].clientY; } 
    else if (e.touches.length === 2) { isDragging = false; initialPinchDistance = getPinchDistance(e.touches); }
}, { passive: false });
canvas.addEventListener('touchmove', (e) => {
    if (isAnimating) return; e.preventDefault(); 
    const rect = canvas.getBoundingClientRect(); const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
    if (e.touches.length === 1 && isDragging) {
        let touchX = e.touches[0].clientX; let touchY = e.touches[0].clientY;
        if (Math.abs(touchX - dragStartX) > 3 || Math.abs(touchY - dragStartY) > 3) hasDragged = true;
        cameraX += (touchX - dragStartX) * scaleX; cameraY += (touchY - dragStartY) * scaleY; dragStartX = touchX; dragStartY = touchY; draw();
    } else if (e.touches.length === 2 && initialPinchDistance) {
        let currentDist = getPinchDistance(e.touches); let zoomFactor = currentDist / initialPinchDistance; let newHexSize = HEX_SIZE * zoomFactor;
        if (newHexSize >= 15 && newHexSize <= 80) {
            let midX = ((e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left) * scaleX; let midY = ((e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top) * scaleY;
            cameraX = midX - (midX - cameraX) * zoomFactor; cameraY = midY - (midY - cameraY) * zoomFactor; HEX_SIZE = newHexSize; initialPinchDistance = currentDist; draw();
        }
    }
}, { passive: false });
canvas.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) initialPinchDistance = null;
    if (e.touches.length === 1) { dragStartX = e.touches[0].clientX; dragStartY = e.touches[0].clientY; } 
    else if (e.touches.length === 0) { isDragging = false; }
});

// 遊戲操作點擊核心
canvas.addEventListener('click', async (e) => { 
    if (hasDragged || isAnimating || currentTurn !== 'player') return; 
    const rect = canvas.getBoundingClientRect();
    const hex = pixelToHex((e.clientX - rect.left)*(canvas.width / rect.width), (e.clientY - rect.top)*(canvas.height / rect.height));
    let key = `${hex.q},${hex.r}`; if(!hexMap[key]) return;
    let clickedUnit = units.find(u => Math.round(u.q) === hex.q && Math.round(u.r) === hex.r);
    let tData = TERRAIN_DATA[hexMap[key]];
    let defText = tData.defBonus > 0 ? `+${tData.defBonus * 100}%` : `${tData.defBonus * 100}%`;
    let atkText = tData.atkMod > 0 ? `+${tData.atkMod * 100}%` : `${tData.atkMod * 100}%`;
    let moveCostText = tData.isWalkable ? `消耗 ${tData.cost}` : `裝備無法通行`;
    let terrainInfo = `🌍 <b>${tData.name}</b> <span style="font-size:13px; color:#bdc3c7;">(防禦 ${defText}, 攻擊 ${atkText}, ${moveCostText})</span><br>`;

    if (selectedUnit && !selectedUnit.hasActed) {
        let dist = hexDistance(selectedUnit, hex);
        let uData = UNIT_DATA[selectedUnit.type];

        // ⚔️ 攻擊判定
        if (clickedUnit && clickedUnit.team === 'enemy' && dist <= uData.range && !selectedUnit.hasAttacked) {
            if (uData.ap <= 0) { msg.innerHTML = terrainInfo + `⚠️ ${uData.name} 無武裝，無法主動攻擊！`; return; }
            let attackerTerrain = hexMap[`${Math.round(selectedUnit.q)},${Math.round(selectedUnit.r)}`]; let defenderTerrain = hexMap[key];
            let damage = calculateDamage(selectedUnit, clickedUnit, attackerTerrain, defenderTerrain);
            clickedUnit.hp -= damage; selectedUnit.hasAttacked = true; 
            let combatMsg = terrainInfo + `⚔️ ${uData.name} 開火！造成 <b>${damage}</b> 傷害。`;
            msg.innerHTML = combatMsg; await animateShake(clickedUnit); 
            
            if (clickedUnit.hp <= 0) { units = units.filter(u => u !== clickedUnit); combatMsg += ` 💥 擊殺！`; } 
            else {
                let defData = UNIT_DATA[clickedUnit.type];
                if (defData.ap > 0 && defData.canCounter !== false && dist <= defData.range) {
                    let counterDamage = calculateDamage(clickedUnit, selectedUnit, defenderTerrain, attackerTerrain);
                    selectedUnit.hp -= counterDamage; combatMsg += `<br>🛡️ 敵方 ${defData.name} 反擊！造成 <b>${counterDamage}</b> 傷害。`;
                    msg.innerHTML = combatMsg; await animateShake(selectedUnit); 
                    if (selectedUnit.hp <= 0) { units = units.filter(u => u !== selectedUnit); combatMsg += ` 💀 攻擊方陣亡！`; }
                } else if (defData.canCounter === false) { combatMsg += `<br>⚠️ 敵方 ${defData.name} 缺乏自衛能力，無法反擊。`; }
            }
            if (selectedUnit && selectedUnit.hp > 0) {
                if (uData.attackThenMove === 1 && selectedUnit.currentMove > 0) { combatMsg += `<br>🔥 <b>戰術機動！</b> 尚可移動 ${selectedUnit.currentMove} 格。`; } 
                else { selectedUnit.hasActed = true; selectedUnit.hasMoved = true; selectedUnit = null; }
            } else { selectedUnit = null; }
            msg.innerHTML = combatMsg; saveGameState(); 
            if (clickedUnit && clickedUnit.hp <= 0) await smartPanCamera(clickedUnit.q, clickedUnit.r);
        } 
        // 💉 補給維修
        else if (clickedUnit && clickedUnit.team === selectedUnit.team && clickedUnit !== selectedUnit && dist <= uData.range && uData.heal > 0 && !selectedUnit.hasAttacked) {
            let targetMaxHp = UNIT_DATA[clickedUnit.type].hp;
            if (clickedUnit.hp < targetMaxHp) {
                let actualHeal = Math.max(1, Math.round((selectedUnit.hp / 100) * uData.heal));
                clickedUnit.hp = Math.min(targetMaxHp, clickedUnit.hp + actualHeal);
                selectedUnit.hasAttacked = true; 
                let combatMsg = terrainInfo + `💉 ${uData.name} 進行補給！為 ${UNIT_DATA[clickedUnit.type].name} 恢復 <b>${actualHeal}</b> 點生命力。`;
                if (uData.attackThenMove === 1 && selectedUnit.currentMove > 0) { combatMsg += `<br>🔥 <b>戰術機動觸發！</b> 尚可移動 ${selectedUnit.currentMove} 格。`; } 
                else { selectedUnit.hasActed = true; selectedUnit.hasMoved = true; selectedUnit = null; }
                msg.innerHTML = combatMsg; saveGameState(); 
            } else {
                if (!clickedUnit.hasActed) {
                    if (selectedUnit.hasMoved && !selectedUnit.hasAttacked) { selectedUnit.q = selectedUnit.originQ; selectedUnit.r = selectedUnit.originR; selectedUnit.currentMove = selectedUnit.originMove; selectedUnit.hasMoved = false; } 
                    else if (selectedUnit.hasAttacked && uData.attackThenMove === 1 && selectedUnit.currentMove > 0) { selectedUnit.hasActed = true; }
                    selectedUnit = clickedUnit; if (!clickedUnit.hasMoved) { selectedUnit.originQ = clickedUnit.q; selectedUnit.originR = clickedUnit.r; selectedUnit.originMove = clickedUnit.currentMove; }
                    msg.innerHTML = terrainInfo + `🎯 選取 ${UNIT_DATA[clickedUnit.type].name}，(移動力: ${clickedUnit.currentMove})`; saveGameState(); 
                } else { msg.innerHTML = terrainInfo + `⚠️ ${UNIT_DATA[clickedUnit.type].name} 已經滿血，無需維修。`; }
            }
        }
        // 🔄 點選其他友軍
        else if (clickedUnit && clickedUnit.team === 'player' && clickedUnit !== selectedUnit && !clickedUnit.hasActed) {
            if (selectedUnit.hasMoved && !selectedUnit.hasAttacked) { selectedUnit.q = selectedUnit.originQ; selectedUnit.r = selectedUnit.originR; selectedUnit.currentMove = selectedUnit.originMove; selectedUnit.hasMoved = false; } 
            else if (selectedUnit.hasAttacked && uData.attackThenMove === 1 && selectedUnit.currentMove > 0) { selectedUnit.hasActed = true; }
            selectedUnit = clickedUnit; if (!clickedUnit.hasMoved) { selectedUnit.originQ = clickedUnit.q; selectedUnit.originR = clickedUnit.r; selectedUnit.originMove = clickedUnit.currentMove; }
            msg.innerHTML = terrainInfo + `🎯 選取 ${UNIT_DATA[clickedUnit.type].name}，(移動力: ${clickedUnit.currentMove})`; saveGameState(); 
        }
        // 🏃 移動判定
        else if (!clickedUnit && (!selectedUnit.hasMoved || (selectedUnit.hasAttacked && uData.attackThenMove === 1))) {
            let reachable = getReachableArea(selectedUnit);
            if (typeof reachable[key] !== 'undefined') {
                let pathData = reachable[key]; let actualCost = pathData.cost; let fullPath = reconstructPath(reachable, hex);
                await animateUnitMovement(selectedUnit, fullPath);
                selectedUnit.hasMoved = true; selectedUnit.currentMove -= actualCost; 
                let hasEnemyInRange = units.some(u => u.team === 'enemy' && hexDistance(hex, u) <= uData.range);
                let actionPrompt = (hasEnemyInRange && !selectedUnit.hasAttacked && uData.ap > 0) ? "<b>點擊敵軍開火</b>、或" : "請";
                let zocText = pathData.hasZoc ? "<br><b style='color:#f1c40f;'>⚠️ 遭遇敵軍牽制！</b>" : "";
                msg.innerHTML = terrainInfo + `🏃 移動消耗 ${actualCost}。${zocText}<br>${actionPrompt}<b>「點擊自己」待命結束</b>。`;
                if (selectedUnit.currentMove <= 0 && selectedUnit.hasAttacked) { selectedUnit.hasActed = true; selectedUnit = null; }
                saveGameState(); 
            } else {
                if (selectedUnit.hasAttacked) { selectedUnit.hasActed = true; selectedUnit = null; msg.innerHTML = terrainInfo + `🛡️ 單位待命。`; }
                else { selectedUnit = null; msg.innerHTML = terrainInfo + `🔄 取消選取。`; }
                saveGameState(); 
            }
        } 
        // 🛡️ 點選自己待命
        else if (clickedUnit === selectedUnit) { selectedUnit.hasActed = true; selectedUnit = null; msg.innerHTML = terrainInfo + `🛡️ 單位已待命。`; saveGameState(); } 
        // 🔙 取消或撤銷移動
        else {
            if (selectedUnit.hasMoved && !selectedUnit.hasAttacked) {
                selectedUnit.q = selectedUnit.originQ; selectedUnit.r = selectedUnit.originR; selectedUnit.currentMove = selectedUnit.originMove; selectedUnit.hasMoved = false; msg.innerHTML = terrainInfo + `🔙 取消移動。`;
            } else if (selectedUnit.hasAttacked) { selectedUnit.hasActed = true; selectedUnit = null; msg.innerHTML = terrainInfo + `🛡️ 行動結束。`; } 
            else { selectedUnit = null; msg.innerHTML = terrainInfo + `🔄 取消選取。`; }
            saveGameState(); 
        }
    } else { 
        if (clickedUnit && clickedUnit.team === 'player' && !clickedUnit.hasActed) {
            selectedUnit = clickedUnit; if (!clickedUnit.hasMoved) { selectedUnit.originQ = clickedUnit.q; selectedUnit.originR = clickedUnit.r; selectedUnit.originMove = clickedUnit.currentMove; }
            msg.innerHTML = terrainInfo + `🎯 選取 ${UNIT_DATA[clickedUnit.type].name}，(移動力: ${clickedUnit.currentMove})`; saveGameState(); 
        } else {
            if (clickedUnit && clickedUnit.team === 'enemy') msg.innerHTML = terrainInfo + `👀 敵方情報：${UNIT_DATA[clickedUnit.type].name} (HP: ${Math.max(0, Math.round(clickedUnit.hp))})`;
            else if (clickedUnit && clickedUnit.team === 'player' && clickedUnit.hasActed) msg.innerHTML = terrainInfo + `💤 ${UNIT_DATA[clickedUnit.type].name} 本回合已行動完畢。`;
            else msg.innerHTML = terrainInfo + `🔍 觀察地形與戰況中...`;
            saveGameState(); 
        }
    }
    draw();
});

// ==========================================
// 🚀 資源異步載入與啟動監聽
// ==========================================
let totalImagesToLoad = Object.keys(TERRAIN_DATA).length + Object.keys(UNIT_DATA).length;
let gameStarted = false; let isIntroDone = false; let resourcesLoaded = false;
if (window.location.hash === '#game') { document.getElementById('intro-screen').style.display = 'none'; isIntroDone = true; }

function safeStartGame(force = false) { resourcesLoaded = true; if (isIntroDone && !gameStarted) { gameStarted = true; initGame(); } }
setTimeout(() => { if (!resourcesLoaded) { console.warn("⏱️ 超時強制啟動。"); safeStartGame(true); } }, 3000);

for (const [type, data] of Object.entries(TERRAIN_DATA)) {
    const img = new Image(); if (data.imgSrc.startsWith('http')) img.crossOrigin = "Anonymous";
    img.onload = () => { terrainImages[type] = img; totalImagesToLoad--; if (totalImagesToLoad <= 0) safeStartGame(false); };
    img.onerror = () => { totalImagesToLoad--; if (totalImagesToLoad <= 0) safeStartGame(false); };
    img.src = data.imgSrc;
}
for (const [type, data] of Object.entries(UNIT_DATA)) {
    const img = new Image(); if (data.imgSrc.startsWith('http')) img.crossOrigin = "Anonymous";
    img.onload = () => { unitImages[type] = img; totalImagesToLoad--; if (totalImagesToLoad <= 0) safeStartGame(false); };
    img.onerror = () => { totalImagesToLoad--; if (totalImagesToLoad <= 0) safeStartGame(false); };
    img.src = data.imgSrc;
}

document.getElementById('introLoadBtn').addEventListener('click', () => startFromIntro(false));
document.getElementById('introNewBtn').addEventListener('click', () => startFromIntro(true));
document.getElementById('endTurnBtn').addEventListener('click', endTurn);
document.getElementById('resetBtn').addEventListener('click', resetGame);
