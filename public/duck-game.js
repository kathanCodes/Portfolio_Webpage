(function () {
  'use strict';

  const CANVAS_ID      = 'duck-game-canvas';
  const POLL_INTERVAL  = 50;
  const MAX_POLL_MS    = 5000;
  const SHOOT_DELAY    = 380;
  const DUCK_W         = 48;
  const DUCK_H         = 40;
  const BUG_COLS       = 8;
  const BUG_ROWS       = 3;
  const BUG_W          = 44;
  const BUG_H          = 32;
  const BUG_GAP_X      = 16;
  const BUG_GAP_Y      = 14;
  const BUG_SHOOT_BASE = 1800;
  const PX             = 4;

  const DUCK_SPRITE = [
    [0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,0,0,0,0,0],
    [0,0,1,1,1,2,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,0,0,0],
    [1,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,1,3,1,1,3,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0,0,0],
  ];

  const BUG_SPRITES = [
    [
      [0,0,1,0,0,0,1,0,0],
      [0,0,0,1,0,1,0,0,0],
      [0,1,1,1,1,1,1,1,0],
      [1,1,0,1,1,1,0,1,1],
      [1,1,1,1,1,1,1,1,1],
      [0,1,1,1,1,1,1,1,0],
      [0,1,0,0,0,0,0,1,0],
      [0,0,1,0,0,0,1,0,0],
    ],
    [
      [0,1,0,0,0,0,0,1,0],
      [0,0,1,0,0,0,1,0,0],
      [0,1,1,1,1,1,1,1,0],
      [1,0,1,1,1,1,1,0,1],
      [1,1,1,1,1,1,1,1,1],
      [0,1,0,1,1,1,0,1,0],
      [0,0,1,1,1,1,1,0,0],
      [0,1,0,0,0,0,0,1,0],
    ],
    [
      [0,0,1,0,0,0,1,0,0],
      [1,0,0,1,0,1,0,0,1],
      [1,1,1,1,1,1,1,1,1],
      [1,0,1,0,1,0,1,0,1],
      [1,1,1,1,1,1,1,1,1],
      [0,1,1,0,0,0,1,1,0],
      [0,0,1,1,0,1,1,0,0],
      [1,0,0,0,0,0,0,0,1],
    ],
  ];

  const ROW_LABELS = ['NaN', '404', 'NULL'];
  const PROJECTILES = ['log()', ';', 'brk', '//!', 'fix'];

  const DARK_THEME = {
    bg:        '#0a0a0f',
    scanline:  'rgba(255,255,255,0.012)',
    accent:    '#00ff88',
    accentAlt: '#00d4ff',
    orange:    '#ff6b35',
    textPri:   '#f0f0f0',
    textSec:   '#8888aa',
    textMute:  '#444466',
    bugRows:   ['#ff3c6e','#ff9f1c','#a259ff'],
    bugDark:   ['#8b0028','#b85c00','#5a1fa8'],
    bugLight:  ['#ff8fab','#ffc977','#c99dff'],
  };

  const LIGHT_THEME = {
    bg:        '#fff9e0',
    scanline:  'rgba(0,0,0,0.016)',
    accent:    '#e6a000',
    accentAlt: '#cc8800',
    orange:    '#e05a00',
    textPri:   '#1a1400',
    textSec:   '#4a3f10',
    textMute:  '#9a8040',
    bugRows:   ['#cc2244','#bb6600','#6633cc'],
    bugDark:   ['#660011','#774400','#331166'],
    bugLight:  ['#ffaacc','#ffcc88','#bb99ff'],
  };

  let T = DARK_THEME;

  function resolveTheme() {
    const el = document.querySelector('[data-theme]') || document.documentElement;
    T = el.getAttribute('data-theme') === 'light' ? LIGHT_THEME : DARK_THEME;
  }

  function attachThemeObserver() {
    const targets = [
      document.querySelector('[data-theme]'),
      document.documentElement,
    ].filter(Boolean);
    targets.forEach(el => {
      new MutationObserver(resolveTheme).observe(el, {
        attributes: true, attributeFilter: ['data-theme'],
      });
    });
  }

  function drawSprite(sprite, x, y, px, colorMap) {
    sprite.forEach((row, ry) => {
      row.forEach((cell, cx) => {
        if (!cell) return;
        ctx.fillStyle = colorMap[cell] || colorMap[1];
        ctx.fillRect(
          Math.round(x + cx * px),
          Math.round(y + ry * px),
          px, px,
        );
      });
    });
  }

  let ctx;

  function init(canvas) {
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const keys = {};
    let state         = 'idle';
    let score         = 0;
    let lives         = 3;
    let level         = 1;
    let highScore     = parseInt(localStorage.getItem('duckGameHS') || '0', 10);
    let animId        = null;
    let lastTime      = 0;
    let shootCooldown = 0;
    let bugs          = [];
    let bugDir        = 1;
    let bugSpeedX     = 0;
    let bugShootTimer = 0;
    let bullets       = [];
    let bugBullets    = [];
    let particles     = [];
    let frameCount    = 0;

    let targetTilt    = 0;
    let currentTilt   = 0;

    const duck = { x: 0, y: 0 };

    function handleOrientation(e) {
      if (e.gamma !== null) {
        targetTilt = e.gamma;
      }
    }

    function resize() {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : canvas.width;
      const h = Math.min(520, Math.floor(window.innerHeight * 0.62));
      canvas.width  = w;
      canvas.height = h;
      duck.x = Math.round(w / 2 - DUCK_W / 2);
      duck.y = h - DUCK_H - 16;
    }

    function initBugs() {
      bugs          = [];
      bugDir        = 1;
      bugSpeedX     = 40 + (level - 1) * 9;
      bugShootTimer = BUG_SHOOT_BASE;
      const cols    = Math.min(BUG_COLS, Math.floor((canvas.width - 40) / (BUG_W + BUG_GAP_X)));
      const startX  = Math.round((canvas.width - cols * (BUG_W + BUG_GAP_X) + BUG_GAP_X) / 2);
      for (let r = 0; r < BUG_ROWS; r++) {
        for (let c = 0; c < cols; c++) {
          bugs.push({
            x:         startX + c * (BUG_W + BUG_GAP_X),
            y:         72 + r * (BUG_H + BUG_GAP_Y),
            w:         BUG_W,
            h:         BUG_H,
            row:       r,
            spriteIdx: (r + c) % BUG_SPRITES.length,
            alive:     true,
            wobble:    (r * cols + c) * 0.4,
          });
        }
      }
    }

    function spawnParticles(x, y, color, n) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 1.5 + Math.random() * 3.5;
        particles.push({
          x, y,
          vx: Math.cos(a) * s, vy: Math.sin(a) * s,
          life: 1, decay: 0.028 + Math.random() * 0.04,
          size: PX * (0.5 + Math.random() * 1.5),
          color,
        });
      }
    }

    function saveHS() {
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('duckGameHS', highScore);
      }
    }

    function shoot() {
      if (shootCooldown > 0) return;
      bullets.push({
        x:     Math.round(duck.x + DUCK_W / 2),
        y:     duck.y,
        vy:    -520,
        label: PROJECTILES[Math.floor(Math.random() * PROJECTILES.length)],
      });
      shootCooldown = SHOOT_DELAY;
    }

    function bugShoot() {
      const alive = bugs.filter(b => b.alive);
      if (!alive.length) return;
      const src = alive[Math.floor(Math.random() * alive.length)];
      bugBullets.push({ x: Math.round(src.x + src.w / 2), y: src.y + src.h, vy: 200 + level * 35 });
    }

    function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
      return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    function update(dt) {
      const W = canvas.width;
      const H = canvas.height;
      frameCount++;
      shootCooldown = Math.max(0, shootCooldown - dt * 1000);

      let move = 0;
      if (keys['ArrowLeft']  || keys['a'] || keys['A']) move = -1;
      if (keys['ArrowRight'] || keys['d'] || keys['D']) move = 1;

      if (isMobile) {
        currentTilt += (targetTilt - currentTilt) * 15 * dt;
        if (move === 0 && Math.abs(currentTilt) > 2) {
          move = Math.max(-1, Math.min(1, currentTilt / 25));
        }
      }

      duck.x = Math.round(Math.max(0, Math.min(W - DUCK_W, duck.x + move * 5 * dt * 60)));

      if (keys[' '] || keys['ArrowUp']) shoot();

      bullets    = bullets.filter(b => { b.y += b.vy * dt; return b.y > -40; });
      bugBullets = bugBullets.filter(b => { b.y += b.vy * dt; return b.y < H + 20; });

      const alive = bugs.filter(b => b.alive);
      if (!alive.length) { saveHS(); state = 'win'; return; }

      alive.forEach(b => { b.x += bugDir * bugSpeedX * dt; b.wobble += 2.5 * dt; });

      const maxX = Math.max(...alive.map(b => b.x)) + BUG_W;
      const minX = Math.min(...alive.map(b => b.x));
      if (maxX >= W - 4 || minX <= 4) {
        bugDir *= -1;
        alive.forEach(b => { b.y += 16; });
      }

      bugShootTimer -= dt * 1000;
      if (bugShootTimer <= 0) {
        bugShoot();
        bugShootTimer = Math.max(500, BUG_SHOOT_BASE - level * 120);
      }

      bullets.forEach(bullet => {
        alive.forEach(bug => {
          if (!bug.alive) return;
          if (rectsOverlap(bullet.x - 3, bullet.y - 20, 6, 22, bug.x, bug.y, bug.w, bug.h)) {
            bug.alive  = false;
            bullet.y   = -9999;
            score     += 10 * level;
            saveHS();
            spawnParticles(bug.x + bug.w / 2, bug.y + bug.h / 2, T.bugRows[bug.row % 3], 16);
            const rem = bugs.filter(b => b.alive).length;
            bugSpeedX = (40 + (level - 1) * 9) + (BUG_COLS * BUG_ROWS - rem) * 2.2;
          }
        });
      });

      bugBullets.forEach(b => {
        if (rectsOverlap(b.x - 3, b.y, 6, 14, duck.x + 6, duck.y + 4, DUCK_W - 12, DUCK_H - 8)) {
          b.y = 9999; lives--;
          spawnParticles(duck.x + DUCK_W / 2, duck.y + DUCK_H / 2, T.orange, 20);
          if (lives <= 0) { saveHS(); state = 'gameover'; }
        }
      });

      alive.forEach(b => { if (b.y + b.h >= duck.y - 4) { saveHS(); state = 'gameover'; } });

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= p.decay;
      });
      particles = particles.filter(p => p.life > 0);
    }

    function drawBg() {
      ctx.fillStyle = T.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillStyle = T.scanline;
        ctx.fillRect(0, y, canvas.width, 2);
      }
      ctx.strokeStyle = T.accent;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth   = 1;
      ctx.setLineDash([PX * 2, PX * 2]);
      ctx.beginPath();
      ctx.moveTo(0,             duck.y + DUCK_H + 6);
      ctx.lineTo(canvas.width,  duck.y + DUCK_H + 6);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    function drawHUD() {
      ctx.font      = 'bold 11px "Space Mono",monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = T.accent;
      ctx.fillText(`BUGS: ${score}`, 10, 20);
      ctx.fillStyle = T.textMute;
      ctx.fillText(`BEST: ${highScore}`, 10, 34);
      ctx.fillStyle = T.accentAlt;
      ctx.textAlign = 'center';
      ctx.fillText(`LVL ${level}`, canvas.width / 2, 20);
      ctx.fillStyle = '#ff3c6e';
      ctx.textAlign = 'right';
      for (let i = 0; i < lives; i++) {
        const hx = canvas.width - 10 - i * 16;
        [[0,1,0,1,0],[1,1,1,1,1],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0]].forEach((row, ry) => {
          row.forEach((cell, cx) => {
            if (cell) ctx.fillRect(hx + cx * 2, 10 + ry * 2, 2, 2);
          });
        });
      }
    }

    function drawDuck(x, y) {
      const spritePx = Math.round(DUCK_W / DUCK_SPRITE[0].length);
      const colorMap = {
        1: '#FFD600',
        2: '#111111',
        3: '#FF8C00',
      };
      drawSprite(DUCK_SPRITE, x, y, spritePx, colorMap);
    }

    function drawBug(bug) {
      if (!bug.alive) return;
      const rowColor = T.bugRows[bug.row % 3];
      const darkColor = T.bugDark[bug.row % 3];
      const lightColor = T.bugLight[bug.row % 3];
      const frame = BUG_SPRITES[Math.floor(frameCount / 18) % 2 === 0 ? bug.spriteIdx : (bug.spriteIdx + 1) % BUG_SPRITES.length];
      const spriteCols = frame[0].length;
      const spriteRows = frame.length;
      const spritePx   = Math.min(
        Math.floor(bug.w / spriteCols),
        Math.floor(bug.h / spriteRows),
      );
      const offX = Math.round((bug.w - spriteCols * spritePx) / 2);
      const offY = Math.round((bug.h - spriteRows * spritePx) / 2);
      const colorMap = { 1: rowColor, 2: lightColor, 3: darkColor };
      
      drawSprite(frame, bug.x + offX, bug.y + offY, spritePx, colorMap);

      const label = ROW_LABELS[bug.row % ROW_LABELS.length];
      ctx.font      = `bold ${Math.max(6, spritePx * 2)}px "Space Mono",monospace`;
      ctx.fillStyle = rowColor;
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.85;
      ctx.fillText(label, bug.x + bug.w / 2, bug.y + bug.h - 2);
      ctx.globalAlpha = 1;
    }

    function drawBullet(b) {
      ctx.fillStyle = T.accent;
      for (let i = 0; i < 5; i++) {
        const alpha = 1 - i * 0.18;
        ctx.globalAlpha = alpha;
        ctx.fillRect(b.x - 2, b.y - i * PX, PX, PX);
      }
      ctx.globalAlpha = 1;
      if (b.label) {
        ctx.font      = `bold 7px "Space Mono",monospace`;
        ctx.fillStyle = T.accent;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 0.7;
        ctx.fillText(b.label, b.x, b.y - 22);
        ctx.globalAlpha = 1;
      }
    }

    function drawBugBullet(b) {
      for (let i = 0; i < 4; i++) {
        ctx.globalAlpha = 1 - i * 0.22;
        ctx.fillStyle   = T.orange;
        ctx.fillRect(b.x - 2, b.y + i * PX, PX, PX);
      }
      ctx.globalAlpha = 1;
    }

    function drawParticles() {
      particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle   = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.ceil(p.size * p.life), Math.ceil(p.size * p.life));
      });
      ctx.globalAlpha = 1;
    }

    function pulseFactor() { return 0.65 + 0.35 * Math.sin(Date.now() / 380); }

    function drawOverlayLines(lines) {
      const cx  = canvas.width / 2;
      let   y   = canvas.height / 2 - (lines.length * 28) / 2;
      lines.forEach(({ text, color, font, alpha }) => {
        ctx.font         = font || 'bold 14px "Space Mono",monospace';
        ctx.fillStyle    = color || T.textPri;
        ctx.textAlign    = 'center';
        ctx.globalAlpha  = alpha !== undefined ? alpha : 1;
        ctx.fillText(text, cx, y);
        ctx.globalAlpha  = 1;
        y += 28;
      });
    }

    function drawBobDuck(cy) {
      const bob = Math.sin(Date.now() / 480) * 6;
      drawDuck(Math.round(canvas.width / 2 - DUCK_W / 2), Math.round(cy + bob));
    }

    function drawIdle() {
      drawBg();
      drawBobDuck(canvas.height / 2 - 130); 
      const cy = canvas.height / 2 - 20;
      
      drawOverlayLines([
        { text: 'RUBBER DUCK DEBUGGER',  color: T.accent,   font: 'bold 22px "Space Mono",monospace' },
        { text: 'SAVE PROD. SHOOT BUGS.',color: T.textSec,  font: '12px "Space Mono",monospace' },
        { text: `HI: ${highScore}`,       color: T.textMute, font: '10px "Space Mono",monospace' },
      ]);

      ctx.textAlign = 'center';
      ctx.font      = 'bold 11px "Space Mono",monospace';
      ctx.fillStyle = T.textSec;
      ctx.fillText('--- CONTROLS ---', canvas.width / 2, cy + 60);
      
      ctx.font      = '10px "Space Mono",monospace';
      ctx.fillStyle = T.textMute;
      if (isMobile) {
        ctx.fillText('TILT DEVICE TO MOVE', canvas.width / 2, cy + 78);
        ctx.fillText('TAP SCREEN TO SHOOT', canvas.width / 2, cy + 94);
      } else {
        ctx.fillText('← / → ARROWS or A / D = MOVE', canvas.width / 2, cy + 78);
        ctx.fillText('SPACEBAR = SHOOT', canvas.width / 2, cy + 94);
      }

      ctx.font      = 'bold 12px "Space Mono",monospace';
      ctx.fillStyle = T.accent;
      ctx.globalAlpha = pulseFactor();
      ctx.fillText('[ SPACE / CLICK TO START ]', canvas.width / 2, cy + 130);
      ctx.globalAlpha = 1;
    }

    function drawGameOver() {
      drawBg();
      const cx  = canvas.width / 2;
      const cy  = canvas.height / 2;
      drawOverlayLines([
        { text: '>> PRODUCTION CRASHED <<', color: T.orange, font: 'bold 20px "Space Mono",monospace' },
        { text: 'YOU\'VE BEEN FIRED.',       color: T.textSec, font: '12px "Space Mono",monospace' },
        { text: `BUGS RESOLVED: ${score}`,   color: T.accent,  font: 'bold 14px "Space Mono",monospace' },
        {
          text:  score > 0 && score === highScore ? '* NEW HIGH SCORE *' : `HI: ${highScore}`,
          color: T.accentAlt,
          font:  '10px "Space Mono",monospace',
        },
      ]);
      ctx.font      = 'bold 12px "Space Mono",monospace';
      ctx.fillStyle = T.accent;
      ctx.textAlign = 'center';
      ctx.globalAlpha = pulseFactor();
      ctx.fillText('[ SPACE / CLICK TO RETRY ]', cx, cy + 80);
      ctx.globalAlpha = 1;
    }

    function drawWin() {
      drawBg();
      drawBobDuck(canvas.height / 2 - 110);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 10;
      drawOverlayLines([
        { text: '** BUGS SQUASHED **',         color: T.accent,   font: 'bold 20px "Space Mono",monospace' },
        { text: 'SHIP IT. NO ROLLBACKS.',       color: T.textSec,  font: '10px "Space Mono",monospace' },
        { text: `SCORE: ${score}`,              color: T.accent,   font: 'bold 14px "Space Mono",monospace' },
      ]);
      ctx.font      = 'bold 12px "Space Mono",monospace';
      ctx.fillStyle = T.accentAlt;
      ctx.textAlign = 'center';
      ctx.globalAlpha = pulseFactor();
      ctx.fillText(`[ SPACE / CLICK — LEVEL ${level + 1} ]`, cx, cy + 80);
      ctx.globalAlpha = 1;
    }

    function drawPlaying() {
      drawBg();
      drawHUD();
      bugs.forEach(drawBug);
      bullets.forEach(drawBullet);
      bugBullets.forEach(drawBugBullet);
      drawParticles();
      drawDuck(duck.x, duck.y);
      if (shootCooldown > 0) {
        const blocks = Math.round((shootCooldown / SHOOT_DELAY) * (DUCK_W / PX));
        ctx.fillStyle = T.textMute;
        for (let i = 0; i < blocks; i++) {
          ctx.fillRect(duck.x + i * PX, duck.y + DUCK_H + 2, PX - 1, PX - 1);
        }
      }
    }

    function loop(ts) {
      const dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;
      if (state === 'playing') update(dt);
      if      (state === 'idle')     drawIdle();
      else if (state === 'playing')  drawPlaying();
      else if (state === 'gameover') drawGameOver();
      else if (state === 'win')      drawWin();
      animId = requestAnimationFrame(loop);
    }

    function startGame(lvl) {
      level         = lvl;
      score         = lvl === 1 ? 0 : score;
      lives         = 3;
      bullets       = [];
      bugBullets    = [];
      particles     = [];
      shootCooldown = 0;
      frameCount    = 0;
      duck.x        = Math.round(canvas.width / 2 - DUCK_W / 2);
      if (isMobile) {
        window.addEventListener('deviceorientation', handleOrientation);
      }
      initBugs();
      state = 'playing';
    }

    async function handleAction() {
      if (state === 'idle' || state === 'gameover' || state === 'win') {
        if (isMobile && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          } catch (e) {
            console.warn('Device orientation permission denied:', e);
          }
        }
        if (state === 'idle') startGame(1);
        else if (state === 'gameover') startGame(1);
        else if (state === 'win') startGame(level + 1);
      } else if (state === 'playing') {
        shoot();
      }
    }

    const onKey = e => {
      keys[e.key] = e.type === 'keydown';
      if (e.type === 'keydown') {
        if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); handleAction(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup',   onKey);
    canvas.addEventListener('click',   handleAction);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); handleAction(); }, { passive: false });

    const mobileCtrl = document.getElementById('duckGameControls');
    if (mobileCtrl) {
      const hold = (key, el) => {
        const on  = e => { e.preventDefault(); keys[key] = true;  el.classList.add('active'); };
        const off = ()  => { keys[key] = false; el.classList.remove('active'); };
        el.addEventListener('touchstart', on,  { passive: false });
        el.addEventListener('touchend',   off);
        el.addEventListener('mousedown',  on);
        el.addEventListener('mouseup',    off);
        el.addEventListener('mouseleave', off);
      };
      const btnL = mobileCtrl.querySelector('.dgc-left');
      const btnR = mobileCtrl.querySelector('.dgc-right');
      const btnS = mobileCtrl.querySelector('.dgc-shoot');
      if (btnL) hold('ArrowLeft',  btnL);
      if (btnR) hold('ArrowRight', btnR);
      if (btnS) {
        btnS.addEventListener('touchstart', e => { e.preventDefault(); handleAction(); }, { passive: false });
        btnS.addEventListener('click', handleAction);
      }
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (state === 'playing') initBugs();
    });
    ro.observe(canvas.parentElement || canvas);

    resize();
    animId = requestAnimationFrame(ts => { lastTime = ts; loop(ts); });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup',   onKey);
      if (isMobile) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      ro.disconnect();
    };
  }

  function boot() {
    resolveTheme();
    attachThemeObserver();
    const canvas = document.getElementById(CANVAS_ID);
    if (canvas) { init(canvas); return; }
    let elapsed = 0;
    const poll = setInterval(() => {
      elapsed += POLL_INTERVAL;
      const el = document.getElementById(CANVAS_ID);
      if (el) { clearInterval(poll); init(el); return; }
      if (elapsed >= MAX_POLL_MS) clearInterval(poll);
    }, POLL_INTERVAL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
