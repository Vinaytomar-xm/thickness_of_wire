// ══════════════ LASERS ══════════════
const LASERS = [
  { id: 0, name: 'He-Ne', lambda_nm: 632.8, color: '#ff3050', beamColor: '#ff2040', label: '632.8 nm' },
  { id: 1, name: 'Green', lambda_nm: 532.0, color: '#00ff66', beamColor: '#00e055', label: '532.0 nm' },
  { id: 2, name: 'Blue', lambda_nm: 473.0, color: '#4488ff', beamColor: '#3366ee', label: '473.0 nm' },
  { id: 3, name: 'Violet', lambda_nm: 405.0, color: '#cc66ff', beamColor: '#aa44ee', label: '405.0 nm' },
];
let activeLaser = 0;
function getLambdaMM() { return LASERS[activeLaser].lambda_nm * 1e-6; }

// ══════════════ WIRES ══════════════
// W0 = thin (overflows at D≥1400), W1–W5 = always valid, W6 = thick (unresolvable at D≤800), W7 = Human Hair
const WIRES = [
  {
    id: 0, label: 'W0', name: 'Wire 0', d: 0.05000, color: '#ff6680', glow: 'rgba(255,102,128,', limit: 'thin',
    limitNote: 'Very thin wire — b overflows screen when D is too large (D ≥ 1400 mm).'
  },
  { id: 1, label: 'W1', name: 'Wire 1', d: 0.10547, color: '#00ffe0', glow: 'rgba(0,255,224,', limit: null, limitNote: '' },
  { id: 2, label: 'W2', name: 'Wire 2', d: 0.18000, color: '#00aaff', glow: 'rgba(0,170,255,', limit: null, limitNote: '' },
  { id: 3, label: 'W3', name: 'Wire 3', d: 0.24543, color: '#ffc400', glow: 'rgba(255,196,0,', limit: null, limitNote: '' },
  { id: 4, label: 'W4', name: 'Wire 4', d: 0.35000, color: '#ff4499', glow: 'rgba(255,68,153,', limit: null, limitNote: '' },
  { id: 5, label: 'W5', name: 'Wire 5', d: 0.48000, color: '#b0ff40', glow: 'rgba(176,255,64,', limit: null, limitNote: '' },
  {
    id: 6, label: 'W6', name: 'Wire 6', d: 1.50000, color: '#ff8833', glow: 'rgba(255,136,51,', limit: 'thick',
    limitNote: 'Thick wire — fringes unresolvable when D is too small (D ≤ 800 mm).'
  },
  { id: 7, label: 'W7', name: 'Human Hair', d: 0.07000, color: '#ffdd99', glow: 'rgba(255,221,153,', limit: null, limitNote: '' },
];
let activeWire = 0;
let D_mm = 1000;
let customWireD = WIRES[0].d;   // live wire diameter, overrides selected wire's d
let laserOn = false;
let animId = null;
let flashAlpha = 0;
const readings = [[], [], [], [], [], [], [], []];

// ══════════════ PHYSICS ══════════════
// Returns the effective d for wire wi — customWireD for active wire, actual d for others
function getEffectiveD(wi) {
  return (wi === activeWire) ? customWireD : WIRES[wi].d;
}

function getBTrue(D, wi) { return (D * getLambdaMM()) / getEffectiveD(wi); }

function seededRand(seed) {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}
function getBMeasured(D, wi) {
  const b_true = getBTrue(D, wi);
  const seed = wi * 1000 + D + activeLaser * 100;
  const r = seededRand(seed);
  return b_true * (1 + (r - 0.5) * 2 * 0.025);
}
function getDcalc(D, b) { return (D * getLambdaMM()) / b; }
function sinc2(x) {
  if (Math.abs(x) < 1e-9) return 1.0;
  return Math.pow(Math.sin(x) / x, 2);
}

// ══════════════ BUILD UI ══════════════
function buildLaserGrid() {
  const grid = document.getElementById('laserGrid');
  grid.innerHTML = '';
  LASERS.forEach((l, i) => {
    const btn = document.createElement('button');
    btn.className = 'lbtn' + (i === 0 ? ' active' : '');
    btn.style.borderColor = i === 0 ? l.color : '';
    btn.style.color = l.color;
    if (i === 0) btn.style.background = `rgba(${hexToRgb(l.color)},0.1)`;
    btn.innerHTML = `<div class="lname">${l.name}</div><div class="lwave" style="color:rgba(${hexToRgb(l.color)},0.6)">${l.label}</div>`;
    btn.onclick = () => selectLaser(i);
    grid.appendChild(btn);
  });
}

function selectLaser(i) {
  activeLaser = i;
  const l = LASERS[i];
  document.querySelectorAll('.lbtn').forEach((b, j) => {
    b.classList.toggle('active', j === i);
    b.style.borderColor = j === i ? LASERS[j].color : '';
    b.style.background = j === i ? `rgba(${hexToRgb(LASERS[j].color)},0.1)` : '';
  });
  document.getElementById('btnLaser').style.color = l.beamColor;
  document.getElementById('btnLaser').style.borderColor = `rgba(${hexToRgb(l.beamColor)},0.4)`;
  document.getElementById('hSub').textContent =
    `${l.name} Laser · λ = ${l.lambda_nm} nm = ${(l.lambda_nm * 10).toFixed(0)} Å · d = Dλ/b`;
  updateReadout();
}

function buildWireGrid() {
  const grid = document.getElementById('wireGrid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  WIRES.forEach((w, i) => {
    const btn = document.createElement('button');
    btn.className = 'wb' + (i === 0 ? ' active' : '');
    btn.innerHTML = `<div class="wname" style="color:${w.color}">${w.label}</div><div class="wval">${w.name}</div>`;
    btn.onclick = () => selectWire(i);
    grid.appendChild(btn);
  });
}
function selectWire(i) {
  activeWire = i;
  customWireD = WIRES[i].d;
  document.querySelectorAll('.wb').forEach((b, j) => b.classList.toggle('active', j === i));
  // Sync the d slider
  const slWd = document.getElementById('slWd');
  if (slWd) {
    slWd.value = customWireD;
    document.getElementById('vWd').textContent = customWireD.toFixed(4) + ' mm';
    document.getElementById('wdCustomTag').style.display = 'none';
  }
  updateReadout();
}

// ══════════════ READOUT ══════════════
function updateReadout() {
  const w = WIRES[activeWire];
  const l = LASERS[activeLaser];
  const b = getBMeasured(D_mm, activeWire);
  document.getElementById('vD').textContent = D_mm + ' mm';
  document.getElementById('ro-laser').textContent = l.name;
  document.getElementById('ro-laser').style.color = l.color;
  document.getElementById('ro-lambda').textContent = `${l.lambda_nm} nm (${(l.lambda_nm * 10).toFixed(0)} Å)`;
  document.getElementById('ro-wire').textContent = w.name;
  document.getElementById('ro-D').textContent = D_mm + ' mm';
  document.getElementById('ro-b').textContent = b.toFixed(4) + ' mm';
  document.getElementById('cHud').innerHTML =
    `λ = ${l.lambda_nm} nm [${l.name}]<br>${w.name}<br>D = ${D_mm} mm<br>b ≈ ${b.toFixed(4)} mm`;
  document.getElementById('bHud').textContent =
    `b ≈ ${b.toFixed(4)} mm  →  d_calc ≈ ${getDcalc(D_mm, b).toFixed(5)} mm`;
}

function onDChange() {
  D_mm = parseInt(document.getElementById('slD').value);
  updateReadout();
  if (laserOn) flashAlpha = 1.0;
}

function onWireDChange() {
  customWireD = parseFloat(document.getElementById('slWd').value);
  document.getElementById('vWd').textContent = customWireD.toFixed(4) + ' mm';
  // Show "CUSTOM" tag if differs from wire's actual d
  const isCustom = Math.abs(customWireD - WIRES[activeWire].d) > 0.0001;
  document.getElementById('wdCustomTag').style.display = isCustom ? 'inline' : 'none';
  updateReadout();
  if (laserOn) flashAlpha = 1.0;
}

// ══════════════ CANVAS ══════════════
const canvas = document.getElementById('vc');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const p = canvas.parentElement;
  if (!p || p.clientWidth === 0 || p.clientHeight === 0) return;
  canvas.width = p.clientWidth; canvas.height = p.clientHeight;
  draw();
}

function draw() {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  drawGrid(W, H);
  if (!laserOn) {
    ctx.fillStyle = 'rgba(62,106,136,.2)';
    ctx.font = '11px Orbitron,monospace'; ctx.textAlign = 'center';
    ctx.fillText('LASER OFF  —  Press LASER button to start', W / 2, H / 2);
    return;
  }
  drawSetup(W, H);
  drawDiffractionScreen(W, H);

  // D-change flash
  if (flashAlpha > 0) {
    const l = LASERS[activeLaser];
    const wireX = W * 0.20, screenX = W * 0.76, midY = H * 0.50;
    const fg = ctx.createLinearGradient(wireX, 0, screenX, 0);
    fg.addColorStop(0, 'rgba(255,255,255,0)');
    fg.addColorStop(0.4, `rgba(${hexToRgb(l.beamColor)},${flashAlpha * 0.5})`);
    fg.addColorStop(0.6, `rgba(255,255,255,${flashAlpha * 0.25})`);
    fg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = fg;
    ctx.fillRect(wireX, midY - 18, screenX - wireX, 36);
    flashAlpha = Math.max(0, flashAlpha - 0.07);
  }
}

function drawGrid(W, H) {
  ctx.strokeStyle = 'rgba(0,70,140,.07)'; ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

function drawSetup(W, H) {
  const wireX = W * 0.20, screenX = W * 0.76, midY = H * 0.50;
  const w = WIRES[activeWire], l = LASERS[activeLaser], bc = l.beamColor;

  // Laser box
  const grad = ctx.createLinearGradient(0, midY - 22, 0, midY + 22);
  grad.addColorStop(0, '#08000a'); grad.addColorStop(0.5, '#180008'); grad.addColorStop(1, '#08000a');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.roundRect(6, midY - 22, 55, 44, 3); ctx.fill();
  ctx.strokeStyle = `rgba(${hexToRgb(bc)},0.5)`; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(6, midY - 22, 55, 44, 3); ctx.stroke();
  ctx.fillStyle = bc; ctx.font = 'bold 7px Orbitron,monospace'; ctx.textAlign = 'center';
  ctx.fillText(l.name, 34, midY - 7);
  ctx.font = '6px Share Tech Mono,monospace'; ctx.fillText(l.label, 34, midY + 3);

  ctx.beginPath(); ctx.arc(61, midY, 5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${hexToRgb(bc)},0.25)`; ctx.fill();
  ctx.strokeStyle = `rgba(${hexToRgb(bc)},0.7)`; ctx.lineWidth = 1; ctx.stroke();

  // Beam
  ctx.shadowColor = bc; ctx.shadowBlur = 16;
  const bg = ctx.createLinearGradient(66, 0, wireX - 4, 0);
  bg.addColorStop(0, `rgba(${hexToRgb(bc)},0.95)`);
  bg.addColorStop(1, `rgba(${hexToRgb(bc)},0.25)`);
  ctx.fillStyle = bg; ctx.fillRect(66, midY - 2, wireX - 70, 4);
  ctx.fillStyle = `rgba(${hexToRgb(bc)},0.08)`; ctx.fillRect(66, midY - 10, wireX - 70, 20);
  ctx.shadowBlur = 0;

  // Wire holder
  ctx.strokeStyle = 'rgba(100,90,60,.4)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(wireX, midY - H * 0.30); ctx.lineTo(wireX, midY - H * 0.11); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(wireX, midY + H * 0.11); ctx.lineTo(wireX, midY + H * 0.30); ctx.stroke();

  // Wire
  const visW = Math.max(2, Math.min(16, w.d * 55));
  ctx.shadowColor = w.color; ctx.shadowBlur = 6;
  ctx.fillStyle = '#b0a055'; ctx.fillRect(wireX - visW / 2, midY - H * 0.11, visW, H * 0.22);
  ctx.shadowBlur = 0;
  ctx.fillStyle = w.color; ctx.font = '8px Share Tech Mono,monospace'; ctx.textAlign = 'center';
  ctx.fillText(w.name, wireX, midY - H * 0.13);
  ctx.fillStyle = 'rgba(255,196,0,.6)';
  ctx.fillText('d=' + w.d.toFixed(4) + 'mm', wireX, midY - H * 0.115);

  // Screen
  ctx.strokeStyle = 'rgba(0,160,255,.35)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(screenX, midY - H * 0.33); ctx.lineTo(screenX, midY + H * 0.33); ctx.stroke();
  ctx.fillStyle = 'rgba(0,170,255,.45)'; ctx.font = '8px Share Tech Mono,monospace'; ctx.textAlign = 'center';
  ctx.fillText('Screen', screenX, midY - H * 0.35);

  // D arrow
  ctx.strokeStyle = 'rgba(0,170,255,.18)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(wireX, midY + H * 0.28); ctx.lineTo(screenX, midY + H * 0.28); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(0,170,255,.4)'; ctx.font = '8px Share Tech Mono,monospace'; ctx.textAlign = 'center';
  ctx.fillText('D = ' + D_mm + ' mm', (wireX + screenX) / 2, midY + H * 0.30 + 8);
}

// ══════════════════════════════════════════════════
// WIRE LIMIT CHECK — returns { ok, type, b_mm, b_px, msg, lines }
// Too thin: b_px overflows screen → can't measure b
// Too thick: b_px < 5px → fringes unresolvable
// ══════════════════════════════════════════════════
function getWireLimit(patH) {
  const w = WIRES[activeWire];
  const safePatH = (patH > 10) ? patH : 400;
  // Anchor scale on W1 (index 1, d=0.10547mm) at D=700
  const D_ref = 700;
  const b_ref = (D_ref * getLambdaMM()) / WIRES[1].d;
  const mmPerPx = (9 * b_ref) / safePatH;
  const b_now = getBTrue(D_mm, activeWire);
  const b_px = b_now / mmPerPx;

  // Too thin — central maxima overflows screen (b_px too large)
  if (b_px >= safePatH * 0.46) {
    const suggestD = Math.max(700, Math.floor(D_mm * 0.6));
    return {
      ok: false, type: 'thin', b_mm: b_now, b_px,
      msg: `⚠  Pattern Overflows Screen — Reduce D`,
      lines: [
        `Wire: ${w.name}  |  d = ${w.d.toFixed(4)} mm`,
        `b = ${b_now.toFixed(2)} mm  →  too large to fit on screen`,
        `Central maxima is wider than the screen area.`,
        `Dark fringes fall outside — b cannot be measured.`,
        ``,
        `✦ Reduce D to ≤ ${suggestD} mm,  or`,
        `✦ Use a thicker wire (W1 / W2 / W3 / W4 / W5 / W6)`
      ]
    };
  }
  // Too thick — fringes too narrow to resolve (b_px too small)
  if (b_px < 5) {
    const suggestD = Math.min(1500, Math.ceil(D_mm * 1.8));
    return {
      ok: false, type: 'thick', b_mm: b_now, b_px,
      msg: `⚠  Fringes Unresolvable — Increase D`,
      lines: [
        `Wire: ${w.name}  |  d = ${w.d.toFixed(4)} mm`,
        `b = ${b_now.toFixed(3)} mm  →  too small to resolve`,
        `Fringes merge into a single bright dot.`,
        `The fringe spacing is below instrument resolution.`,
        ``,
        `✦ Increase D to ≥ ${suggestD} mm,  or`,
        `✦ Use a thinner wire (W0 / W1 / W2 / W3 / W7)`
      ]
    };
  }
  return { ok: true, b_mm: b_now, b_px };
}

// ══════════════════════════════════════════════════
// LIMIT BANNER — HTML overlay below canvas (not on canvas)
// ══════════════════════════════════════════════════
function showLimitBanner(limit) {
  let banner = document.getElementById('limitBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'limitBanner';
    banner.style.cssText = `
      position:absolute; bottom:0; left:0; right:0;
      background:rgba(8,4,2,0.96);
      border-top: 1px solid;
      padding:10px 16px 8px;
      font-family:'Share Tech Mono',monospace;
      font-size:10px; line-height:1.7;
      z-index:10; pointer-events:none;
      transition: opacity 0.3s;
    `;
    canvas.parentElement.appendChild(banner);
  }
  const isThin = limit.type === 'thin';
  const accent = isThin ? '#ffaa28' : '#ff4428';
  const accentD = isThin ? 'rgba(255,170,40,0.15)' : 'rgba(255,68,40,0.12)';
  banner.style.borderColor = accent;
  banner.style.background = `rgba(8,4,2,0.96)`;
  banner.style.opacity = '1';

  banner.innerHTML = `
    <div style="color:${accent};font-weight:700;font-size:11px;letter-spacing:1px;margin-bottom:4px;">
      ${limit.msg}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
      ${limit.lines.map(l => l
    ? `<div style="color:${l.startsWith('✦') ? accent : 'rgba(180,200,220,0.75)'};">${l}</div>`
    : `<div></div>`
  ).join('')}
    </div>`;
}

function hideLimitBanner() {
  const banner = document.getElementById('limitBanner');
  if (banner) banner.style.opacity = '0';
}

// ══════════════════════════════════════════════════
// DIFFRACTION SCREEN
// mmPerPx FIXED at D_ref=700mm → fringes spread as D grows.
// Shows warning overlay when wire is outside measurable range.
// ══════════════════════════════════════════════════
function drawDiffractionScreen(W, H) {
  const screenX = W * 0.76, midY = H * 0.50;
  const w = WIRES[activeWire], l = LASERS[activeLaser];

  const patW = Math.floor(W * 0.15), patH = Math.floor(H * 0.90);
  const patX = screenX + 2, patY = midY - patH / 2;

  if (!patW || !patH || patW < 1 || patH < 1) return;

  // ── Limit check ──
  const limit = getWireLimit(patH);

  if (!limit.ok) {
    // Dark screen with warning drawn on canvas
    ctx.fillStyle = '#000305';
    ctx.fillRect(patX, patY, patW, patH);

    // Red-tinted border
    const bCol = limit.type === 'thin' ? 'rgba(255,170,40,.6)' : 'rgba(255,68,40,.6)';
    ctx.strokeStyle = bCol; ctx.lineWidth = 1.5;
    ctx.strokeRect(patX, patY, patW, patH);

    // Animated pulsing circle at centre
    const cx = patX + patW / 2, cy = midY;
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.004);
    const rCol = limit.type === 'thin' ? `rgba(255,170,40,${0.15 + pulse * 0.15})` : `rgba(255,68,40,${0.15 + pulse * 0.15})`;
    ctx.beginPath(); ctx.arc(cx, cy, 18 + pulse * 4, 0, Math.PI * 2);
    ctx.fillStyle = rCol; ctx.fill();

    // Icon
    ctx.fillStyle = limit.type === 'thin' ? 'rgba(255,180,40,0.95)' : 'rgba(255,90,40,0.95)';
    ctx.font = '18px Share Tech Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText(limit.type === 'thin' ? '↕' : '•', cx, cy + 6);

    // Short label inside screen area
    ctx.fillStyle = 'rgba(200,220,240,0.55)';
    ctx.font = '7px Share Tech Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('PATTERN NOT', cx, cy + 24);
    ctx.fillText('MEASURABLE', cx, cy + 33);

    // Show detailed HTML banner
    showLimitBanner(limit);
    return;
  }

  // Valid range — hide banner
  hideLimitBanner();

  // ── FIXED scale: anchored at D=700mm, Wire 1 (first normal wire, index 1)
  const D_ref = 700;
  const b_ref = (D_ref * getLambdaMM()) / WIRES[1].d;
  const mmPerPx = (9 * b_ref) / patH;
  const b_now = limit.b_mm;
  const b_px = limit.b_px;

  const tmp = document.createElement('canvas');
  tmp.width = patW; tmp.height = patH;
  const tc = tmp.getContext('2d');
  tc.fillStyle = '#000305'; tc.fillRect(0, 0, tmp.width, tmp.height);

  const imgData = tc.createImageData(tmp.width, tmp.height);
  const halfH = tmp.height / 2;
  const lr = hexToRgbArr(l.beamColor);

  for (let py = 0; py < tmp.height; py++) {
    const y_mm = (py - halfH) * mmPerPx;
    const sinTheta = y_mm / D_mm;
    const beta = (Math.PI * w.d * sinTheta) / getLambdaMM();
    const I = sinc2(beta);
    const Ig = Math.pow(I, 0.55);
    const r = Math.min(255, Math.round(lr[0] * Ig * 1.1 + 255 * Ig * 0.55));
    const g2 = Math.min(255, Math.round(lr[1] * Ig * 1.1 + 255 * Ig * 0.50));
    const b2 = Math.min(255, Math.round(lr[2] * Ig * 1.1 + 255 * Ig * 0.40));
    for (let px = 0; px < tmp.width; px++) {
      const idx = (py * tmp.width + px) * 4;
      imgData.data[idx] = r; imgData.data[idx + 1] = g2; imgData.data[idx + 2] = b2; imgData.data[idx + 3] = 255;
    }
  }
  tc.putImageData(imgData, 0, 0);

  tc.fillStyle = 'rgba(0,0,0,.08)';
  for (let y = 0; y < tmp.height; y += 2) tc.fillRect(0, y, tmp.width, 1);
  const fl = tc.createLinearGradient(0, 0, tmp.width * 0.18, 0);
  fl.addColorStop(0, 'rgba(0,0,0,0.55)'); fl.addColorStop(1, 'rgba(0,0,0,0)');
  const fr = tc.createLinearGradient(tmp.width, 0, tmp.width * 0.82, 0);
  fr.addColorStop(0, 'rgba(0,0,0,0.55)'); fr.addColorStop(1, 'rgba(0,0,0,0)');
  tc.fillStyle = fl; tc.fillRect(0, 0, tmp.width, tmp.height);
  tc.fillStyle = fr; tc.fillRect(0, 0, tmp.width, tmp.height);

  ctx.drawImage(tmp, patX, patY);

  ctx.shadowColor = `rgba(${hexToRgb(l.beamColor)},0.3)`; ctx.shadowBlur = 6;
  ctx.strokeStyle = 'rgba(0,160,255,.25)'; ctx.lineWidth = 1;
  ctx.strokeRect(patX, patY, patW, patH);
  ctx.shadowBlur = 0;

  const xR = patX + patW + 4;
  [1, 2, 3].forEach(n => {
    const dp = b_px * n;
    if (dp < patH * 0.5 - 2) {
      ctx.strokeStyle = n === 1 ? 'rgba(0,255,200,.55)' : 'rgba(0,255,200,.20)';
      ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
      [-1, 1].forEach(sign => {
        const yy = midY + sign * dp;
        ctx.beginPath(); ctx.moveTo(screenX, yy); ctx.lineTo(screenX + patW + 2, yy); ctx.stroke();
      });
      ctx.setLineDash([]);
    }
  });

  ctx.strokeStyle = 'rgba(255,255,180,.3)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(screenX, midY); ctx.lineTo(xR + 18, midY); ctx.stroke();
  ctx.setLineDash([]);

  if (b_px > 6 && b_px < patH * 0.48) {
    const y1 = midY - b_px;
    ctx.strokeStyle = 'rgba(0,255,200,.8)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(xR + 12, y1); ctx.lineTo(xR + 12, midY); ctx.stroke();
    ctx.fillStyle = 'rgba(0,255,200,.85)';
    ctx.beginPath(); ctx.moveTo(xR + 12, y1); ctx.lineTo(xR + 7, y1 + 7); ctx.lineTo(xR + 17, y1 + 7); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(xR + 12, midY); ctx.lineTo(xR + 7, midY - 7); ctx.lineTo(xR + 17, midY - 7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(0,255,200,.95)';
    ctx.font = 'bold 10px Share Tech Mono,monospace'; ctx.textAlign = 'left';
    ctx.fillText('b', xR + 20, (y1 + midY) / 2 + 4);
    ctx.font = '9px Share Tech Mono,monospace';
    ctx.fillText(b_now.toFixed(3) + ' mm', xR + 28, (y1 + midY) / 2 + 4);
    ctx.fillStyle = 'rgba(255,255,180,.6)';
    ctx.font = '8px Share Tech Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText('Central max', screenX + patW / 2, midY - b_px * 0.45);
    ctx.fillStyle = 'rgba(0,255,200,.5)';
    ctx.font = '7px Share Tech Mono,monospace';
    ctx.fillText('1st min', screenX + patW / 2, y1 - 3);
    ctx.fillText('1st min', screenX + patW / 2, midY + b_px + 9);
  }
}

function animLoop() { draw(); animId = requestAnimationFrame(animLoop); }

// ══════════════ LASER TOGGLE ══════════════
function toggleLaser() {
  laserOn = !laserOn;
  const btn = document.getElementById('btnLaser');
  const dot = document.getElementById('ldot');
  const st = document.getElementById('lstatus');
  const l = LASERS[activeLaser];
  const bAdd = document.getElementById('btnAdd');
  const bCal = document.getElementById('btnCalc');
  const note = document.getElementById('lockNotice');

  // Add Reading: only enabled when laser is ON
  bAdd.disabled = !laserOn;
  // Calculate: always enabled (can calculate after laser off too)
  bCal.disabled = false;
  note.classList.toggle('show', !laserOn);

  if (laserOn) {
    btn.textContent = '◉  LASER ON'; btn.classList.add('on'); btn.style.color = l.beamColor;
    dot.classList.add('on'); dot.style.background = l.beamColor; dot.style.boxShadow = `0 0 8px ${l.beamColor}`;
    st.textContent = 'LASER ON';
    animId = requestAnimationFrame(animLoop);
  } else {
    btn.textContent = '◉  LASER OFF'; btn.classList.remove('on');
    dot.classList.remove('on'); dot.style.background = ''; dot.style.boxShadow = '';
    st.textContent = 'LASER OFF';
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    hideLimitBanner();
    const t = document.getElementById('limitToast'); if (t) t.style.opacity = '0';
    draw();
  }
}

// ══════════════ TOAST NOTIFICATION ══════════════
function showToast(msg, type = 'warn') {
  let toast = document.getElementById('limitToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'limitToast';
    toast.style.cssText = `
      position:absolute; top:14px; left:50%; transform:translateX(-50%);
      min-width:320px; max-width:80%;
      padding:10px 18px 10px 14px;
      border-radius:4px; border-left:3px solid;
      font-family:'Share Tech Mono',monospace; font-size:11px; line-height:1.6;
      z-index:20; pointer-events:none;
      box-shadow: 0 4px 24px rgba(0,0,0,0.6);
      transition: opacity 0.4s;
    `;
    canvas.parentElement.appendChild(toast);
  }
  const colors = {
    warn: { bg: 'rgba(18,8,2,0.97)', border: '#ffaa28', text: '#ffcc66' },
    error: { bg: 'rgba(14,2,2,0.97)', border: '#ff4428', text: '#ff8866' },
    info: { bg: 'rgba(2,10,18,0.97)', border: '#00aaff', text: '#66ccff' },
  };
  const c = colors[type] || colors.warn;
  toast.style.background = c.bg;
  toast.style.borderColor = c.border;
  toast.style.color = c.text;
  toast.style.opacity = '1';
  toast.innerHTML = msg;

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3200);
}

// ══════════════ ADD READING ══════════════
function addReading() {
  const w = WIRES[activeWire];
  const canH = canvas.height > 0 ? canvas.height : canvas.parentElement.clientHeight || 500;
  const patH = Math.max(100, Math.floor(canH * 0.90));
  const limit = getWireLimit(patH);

  // Block only when pattern is dynamically out of range
  if (!limit.ok) {
    const isThin = limit.type === 'thin';
    const icon = isThin ? '↕' : '●';
    const b_val = limit.b_mm.toFixed(3);
    const fix = isThin
      ? `Reduce D to ≤ ${Math.max(700, Math.floor(D_mm * 0.6))} mm to bring pattern into range`
      : `Increase D to ≥ ${Math.min(1500, Math.ceil(D_mm * 1.8))} mm to resolve fringes`;
    showToast(
      `<b>${icon} Cannot Record — Pattern Not Measurable</b><br>` +
      `${w.name}  (d = ${w.d.toFixed(4)} mm)&nbsp;·&nbsp;b = ${b_val} mm<br>` +
      `${isThin ? 'Central maxima overflows screen at this D — reduce D.' : 'Fringes too narrow to resolve at this D — increase D.'}<br>` +
      `<span style="opacity:0.75;font-size:10px;">✦ ${fix}</span>`,
      isThin ? 'warn' : 'error'
    );
    showLimitBanner(limit);
    return;
  }

  // Valid reading — record
  const wi = activeWire;
  const b_true = getBTrue(D_mm, wi);
  const b_meas = parseFloat(getBMeasured(D_mm, wi).toFixed(4));
  const entry = { D: D_mm, b_true: parseFloat(b_true.toFixed(4)), b_meas, d_calc: null };
  const idx = readings[wi].findIndex(r => r.D === D_mm);
  if (idx >= 0) readings[wi][idx] = entry;
  else { readings[wi].push(entry); readings[wi].sort((a, b) => a.D - b.D); }
  showToast(
    `✓ Reading added — ${w.label} · D = ${D_mm} mm · b = ${b_meas.toFixed(4)} mm`,
    'info'
  );
  renderTables();
}

// ══════════════ CALCULATE ══════════════
function calculateAll() {
  WIRES.forEach((w, wi) => {
    const arr = readings[wi];
    if (!arr.length) return;
    arr.forEach(r => { r.d_calc = parseFloat(getDcalc(r.D, r.b_meas).toFixed(5)); });
    const mean = arr.reduce((s, r) => s + r.d_calc, 0) / arr.length;
    const std = arr.length > 1
      ? Math.sqrt(arr.reduce((s, r) => s + Math.pow(r.d_calc - mean, 2), 0) / (arr.length - 1)) : 0;
    arr.forEach((r, i) => {
      const cell = document.getElementById('dcell-' + wi + '-' + i);
      if (cell) { cell.textContent = r.d_calc.toFixed(5); cell.className = 'tg'; }
    });
    const me = document.getElementById('mean-val-' + wi);
    const er = document.getElementById('mean-err-' + wi);
    if (me) me.textContent = mean.toFixed(5) + ' mm';
    if (er) er.textContent = arr.length > 1 ? 'σ = ±' + std.toFixed(5) + ' mm   (n=' + arr.length + ')' : '(single reading)';
  });
}

// ══════════════ CLEAR ══════════════
function clearAll() { readings.forEach(a => a.length = 0); renderTables(); }

// ══════════════ LOAD DEMO ══════════════
function loadDemo() {
  // Valid D ranges per wire type (based on dynamic limit thresholds)
  // W0 (d=0.05): overflows at D≥1400 → use D=700,900,1100,1300
  // W6 (d=1.5):  unresolvable at D≤800 → use D=900,1100,1300,1500
  // All others + W7: full range D=700,900,1100,1300,1500
  const DvalsDefault = [700, 900, 1100, 1300, 1500];
  const DvalsW0 = [700, 900, 1100, 1300];
  const DvalsW6 = [900, 1100, 1300, 1500];

  readings.forEach((arr, wi) => {
    arr.length = 0;
    const w = WIRES[wi];
    const Dvals = w.limit === 'thin' ? DvalsW0
      : w.limit === 'thick' ? DvalsW6
        : DvalsDefault;
    Dvals.forEach(D => {
      const b_true = getBTrue(D, wi);
      const b_meas = parseFloat(getBMeasured(D, wi).toFixed(4));
      arr.push({ D, b_true: parseFloat(b_true.toFixed(4)), b_meas, d_calc: null });
    });
  });
  renderTables();
}

// ══════════════ RENDER TABLES ══════════════
function renderTables() {
  const container = document.getElementById('tablesContainer');
  container.innerHTML = '';
  const l = LASERS[activeLaser];
  WIRES.forEach((w, wi) => {
    const arr = readings[wi];
    const block = document.createElement('div');
    block.className = 'wire-block';
    block.style.borderColor = `rgba(${hexToRgb(w.color)},0.3)`;

    // Header — same for all wires
    const hdr = document.createElement('div');
    hdr.className = 'wire-block-header';
    hdr.style.background = `linear-gradient(90deg,${w.glow}0.12) 0%,rgba(5,15,28,.9) 100%)`;
    hdr.style.borderBottom = `1px solid ${w.glow}0.25)`;
    hdr.innerHTML = `<span style="color:${w.color};font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:1px;">${w.name} &nbsp;[${l.name}, λ=${l.lambda_nm}nm]</span>`;
    block.appendChild(hdr);

    // Table body
    const tWrap = document.createElement('div');
    let tbody;

    if (arr.length === 0) {
      tbody = `<tr><td colspan="4" style="padding:8px;color:var(--muted);font-family:'Share Tech Mono',monospace;font-size:9px;">No readings. Select wire, set D in valid range, and add.</td></tr>`;
    } else {
      tbody = arr.map((r, i) => `<tr>
          <td>${i + 1}</td>
          <td class="tc">${r.D}</td>
          <td class="ta">${r.b_meas.toFixed(4)}</td>
          <td id="dcell-${wi}-${i}" class="${r.d_calc !== null ? 'tg' : 'tm-dim'}">
            ${r.d_calc !== null ? r.d_calc.toFixed(5) : '—'}
          </td>
        </tr>`).join('');
    }

    tWrap.innerHTML = `<table class="obs"><thead><tr><th>Sr.</th><th>D (mm)</th><th>b (mm)</th><th>d_calc (mm)</th></tr></thead><tbody>${tbody}</tbody></table>`;
    block.appendChild(tWrap);

    // Mean row — all wires
    {
      const allDone = arr.length > 0 && arr.every(r => r.d_calc !== null);
      let meanText = '—', errText = '';
      if (allDone) {
        const mean = arr.reduce((s, r) => s + r.d_calc, 0) / arr.length;
        const std = arr.length > 1 ? Math.sqrt(arr.reduce((s, r) => s + Math.pow(r.d_calc - mean, 2), 0) / (arr.length - 1)) : 0;
        meanText = mean.toFixed(5) + ' mm';
        errText = arr.length > 1 ? 'σ = ±' + std.toFixed(5) + ' mm  (n=' + arr.length + ')' : '(single reading)';
      }
      const meanRow = document.createElement('div');
      meanRow.className = 'mean-row';
      meanRow.style.background = `${w.glow}0.05)`;
      meanRow.innerHTML = `
        <div style="flex:1">
          <div class="mean-label">MEAN THICKNESS d̄</div>
          <div class="mean-err" id="mean-err-${wi}">${errText}</div>
        </div>
        <div style="text-align:right;margin-left:8px;">
          <div class="mean-val" id="mean-val-${wi}" style="color:${w.color};text-shadow:0 0 8px ${w.color};">${meanText}</div>
        </div>`;
      block.appendChild(meanRow);
    }

    container.appendChild(block);
  });
}

// ══════════════ HELPERS ══════════════
function hexToRgb(hex) { return `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`; }
function hexToRgbArr(hex) { return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]; }

// ══════════════ TABS ══════════════
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ntab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  el.classList.add('active');
  if (id === 'sim') setTimeout(resizeCanvas, 50);
  if (id === 'graph') refreshGraph();
}

// ══════════════ GRAPH ══════════════
let gChart = null;
function refreshGraph() {
  const el = document.getElementById('gChart');
  if (!el) return;
  if (gChart) { gChart.destroy(); gChart = null; }
  const datasets = WIRES.map((w, wi) => ({
    label: w.name + ' (d=' + w.d.toFixed(4) + 'mm)',
    data: readings[wi].map(r => ({ x: r.D, y: r.b_meas })),
    borderColor: w.color, backgroundColor: `rgba(${hexToRgb(w.color)},0.7)`,
    pointRadius: 6, showLine: true, tension: .1
  })).filter((_, wi) => readings[wi].length > 0);

  gChart = new Chart(el, {
    type: 'scatter', data: { datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#3e6a88', font: { family: 'Share Tech Mono', size: 10 } } },
        title: { display: true, text: `b (mm) vs D (mm) — slope=λ/d  [λ=${LASERS[activeLaser].lambda_nm}nm]`, color: '#00aaff', font: { family: 'Orbitron', size: 11 } }
      },
      scales: {
        x: { title: { display: true, text: 'D (mm)', color: '#3e6a88', font: { family: 'Share Tech Mono' } }, ticks: { color: '#3e6a88', font: { family: 'Share Tech Mono', size: 9 } }, grid: { color: 'rgba(0,70,140,.12)' } },
        y: { title: { display: true, text: 'b (mm)', color: '#3e6a88', font: { family: 'Share Tech Mono' } }, ticks: { color: '#3e6a88', font: { family: 'Share Tech Mono', size: 9 } }, grid: { color: 'rgba(0,70,140,.12)' } }
      }
    }
  });

  let info = `Laser: ${LASERS[activeLaser].name}  λ=${LASERS[activeLaser].lambda_nm}nm\n\n`;
  WIRES.forEach((w, wi) => {
    const arr = readings[wi]; if (arr.length < 2) return;
    const n = arr.length;
    const sx = arr.reduce((s, r) => s + r.D, 0), sy = arr.reduce((s, r) => s + r.b_meas, 0);
    const sxy = arr.reduce((s, r) => s + r.D * r.b_meas, 0), sx2 = arr.reduce((s, r) => s + r.D * r.D, 0);
    const slope = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
    const d_s = getLambdaMM() / slope;
    const err = Math.abs((d_s - w.d) / w.d * 100);
    info += `${w.name}: slope=${slope.toFixed(6)}  d=${d_s.toFixed(5)}mm  (err=${err.toFixed(2)}%)\n`;
  });
  document.getElementById('slopeBox').textContent = info || 'Add readings then refresh.';
}

// ══════════════ QUIZ ══════════════
const QUIZ = [
  { q: "What does 'b' represent in the observation table?", opts: ["Full width of diffraction pattern", "Half-width of central maxima (centre to 1st dark fringe)", "Fringe separation between 2nd and 3rd dark fringes", "Width of laser beam"], ans: 1, fb: "b = half-width of central maxima — from bright centre to first dark fringe on one side." },
  { q: "When D is increased (same wire), what happens to the diffraction pattern on screen?", opts: ["Pattern shrinks, fringes get closer", "Pattern stays same size", "Pattern expands/spreads wider, fringes move apart", "Central fringe disappears"], ans: 2, fb: "b=Dλ/d ∝ D. As D increases, the entire pattern physically spreads wider — more distance gives diffracted rays more space to separate. You can see this directly in the simulation." },
  { q: "Why does d_calc vary slightly for different D readings of the same wire?", opts: ["Wire thickness changes with D", "Laser wavelength changes", "Small measurement error in b gives slightly different b → different d_calc", "Babinet's principle fails"], ans: 2, fb: "Real b measurements have ±1-3% error. Different readings → slightly different b → slightly different d_calc. Mean of all readings reduces this error." },
  { q: "Among 5 wires (increasing d), which gives the LARGEST b at same D?", opts: ["Thickest wire W5", "Middle wire W3", "Thinnest wire W1", "All same"], ans: 2, fb: "b=Dλ/d. Smallest d → largest b. Wire 1 gives widest central maxima." },
  { q: "If b=6mm, D=1000mm, λ=6.328×10⁻⁴mm, then d=?", opts: ["0.2109 mm", "0.1055 mm", "0.0527 mm", "0.4218 mm"], ans: 1, fb: "d=Dλ/b=1000×6.328×10⁻⁴/6=0.10547mm≈0.1055mm." },
  { q: "If you switch from He-Ne (632.8nm) to Green (532nm) laser, b will:", opts: ["Increase", "Decrease (smaller λ → smaller b)", "Remain same", "Depend on D only"], ans: 1, fb: "b=Dλ/d. Smaller λ → smaller b. Green laser gives narrower fringes than He-Ne for the same wire." },
  { q: "Slope of b vs D graph equals:", opts: ["d×λ", "λ/d", "d/λ", "1/λd"], ans: 1, fb: "b=(λ/d)·D → slope=λ/d → d=λ/slope." },
  { q: "Why take readings at multiple D values?", opts: ["Longer experiment", "Calculate mean d to reduce random error", "D affects wire thickness", "Test different wires"], ans: 1, fb: "Multiple D values give multiple d_calc. Mean reduces random measurement error." }
];
const qSel = {};
function buildQuiz() {
  document.getElementById('qContainer').innerHTML = QUIZ.map((q, i) => `
    <div class="qq"><div class="qt">${i + 1}. ${q.q}</div>
    <div class="qopts">${q.opts.map((o, j) => `<div class="qo" id="qo_${i}_${j}" onclick="selectQ(${i},${j})">${String.fromCharCode(65 + j)}. ${o}</div>`).join('')}</div>
    <div class="qfb" id="qfb_${i}">${q.fb}</div></div>`).join('');
}
function selectQ(i, j) {
  QUIZ[i].opts.forEach((_, k) => { document.getElementById(`qo_${i}_${k}`).style.borderColor = ''; });
  qSel[i] = j;
  document.getElementById(`qo_${i}_${j}`).style.borderColor = 'var(--blue)';
}
function submitQuiz() {
  let score = 0;
  QUIZ.forEach((q, i) => {
    if (qSel[i] === undefined) return;
    QUIZ[i].opts.forEach((_, j) => {
      const el = document.getElementById(`qo_${i}_${j}`);
      el.style.borderColor = '';
      if (j === q.ans) el.classList.add('correct');
      else if (j === qSel[i] && qSel[i] !== q.ans) el.classList.add('wrong');
    });
    if (qSel[i] === q.ans) score++;
    document.getElementById(`qfb_${i}`).style.display = 'block';
  });
  const sc = document.getElementById('qScore');
  sc.style.display = 'block';
  const pct = Math.round(score / QUIZ.length * 100);
  sc.textContent = `Score: ${score}/${QUIZ.length}  (${pct}%)  ${pct >= 70 ? '✓ Excellent!' : 'Keep revising!'}`;
}
function resetQuiz() {
  Object.keys(qSel).forEach(k => delete qSel[k]);
  document.getElementById('qScore').style.display = 'none';
  buildQuiz();
}

// ══════════════ INIT ══════════════
window.addEventListener('resize', resizeCanvas);
buildLaserGrid();
buildWireGrid();
updateReadout();
renderTables();
buildQuiz();
resizeCanvas();