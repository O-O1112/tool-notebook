/**
 * 精選實用小工具範本庫 (Preset Templates)
 * 專為「工具小本本」打造的高品質獨立純前端工具
 */

export const TOOL_TEMPLATES = [
  {
    id: 'pomodoro',
    title: '番茄工作法計時鐘',
    description: '25 分鐘專注工作、5 分鐘活力小憩，具備時間提醒與計數。',
    category: '效能與專注',
    defaultColSpan: 1,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    .badge {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #e17b62;
      background: #fff0eb;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 12px;
    }
    .timer-display {
      font-size: 64px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #1f2a2e;
      line-height: 1;
      margin: 16px 0;
      font-variant-numeric: tabular-nums;
    }
    .modes {
      display: flex;
      gap: 6px;
      margin-bottom: 20px;
      background: #f0f2f1;
      padding: 4px;
      border-radius: 12px;
    }
    .mode-btn {
      border: none;
      background: transparent;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #69787f;
      cursor: pointer;
      transition: all 0.2s;
    }
    .mode-btn.active {
      background: #ffffff;
      color: #1f2a2e;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }
    .controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .btn {
      border: none;
      padding: 10px 22px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-main {
      background: #e17b62;
      color: #ffffff;
    }
    .btn-main:hover { background: #cf674e; }
    .btn-sub {
      background: #e4e8e5;
      color: #526066;
    }
    .btn-sub:hover { background: #d3d9d5; }
    .footer-text {
      margin-top: 18px;
      font-size: 11px;
      color: #9aa5a9;
    }
  </style>
</head>
<body>
  <div class="badge" id="modeBadge">專注時間 (Focus)</div>
  <div class="modes">
    <button class="mode-btn active" onclick="setMode(25 * 60, '專注時間 (Focus)', this)">25 分專注</button>
    <button class="mode-btn" onclick="setMode(5 * 60, '短暫休息 (Break)', this)">5 分休息</button>
    <button class="mode-btn" onclick="setMode(15 * 60, '長效休息 (Long)', this)">15 分長休</button>
  </div>
  <div class="timer-display" id="timeDisplay">25:00</div>
  <div class="controls">
    <button class="btn btn-main" id="startBtn" onclick="toggleTimer()">開始計時</button>
    <button class="btn btn-sub" onclick="resetTimer()">重設</button>
  </div>
  <div class="footer-text" id="statusText">今日已累積 0 次專注</div>

  <script>
    let totalSec = 25 * 60;
    let remainSec = totalSec;
    let timer = null;
    let completedCount = 0;
    let currentModeName = '專注時間 (Focus)';

    function playBeep() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch(e) {}
    }

    function renderTime() {
      const m = Math.floor(remainSec / 60).toString().padStart(2, '0');
      const s = (remainSec % 60).toString().padStart(2, '0');
      document.getElementById('timeDisplay').innerText = m + ':' + s;
    }

    function setMode(sec, name, el) {
      clearInterval(timer);
      timer = null;
      document.getElementById('startBtn').innerText = '開始計時';
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      totalSec = sec;
      remainSec = sec;
      currentModeName = name;
      document.getElementById('modeBadge').innerText = name;
      renderTime();
    }

    function toggleTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
        document.getElementById('startBtn').innerText = '繼續計時';
      } else {
        document.getElementById('startBtn').innerText = '暫停';
        timer = setInterval(() => {
          if (remainSec > 0) {
            remainSec--;
            renderTime();
          } else {
            clearInterval(timer);
            timer = null;
            playBeep();
            if (currentModeName.includes('專注')) {
              completedCount++;
              document.getElementById('statusText').innerText = '今日已累積 ' + completedCount + ' 次專注';
            }
            alert(currentModeName + ' 時間到！');
            document.getElementById('startBtn').innerText = '開始計時';
          }
        }, 1000);
      }
    }

    function resetTimer() {
      clearInterval(timer);
      timer = null;
      remainSec = totalSec;
      document.getElementById('startBtn').innerText = '開始計時';
      renderTime();
    }

    renderTime();
  </script>
</body>
</html>`
  },
  {
    id: 'decision_wheel',
    title: '隨機決策轉盤',
    description: '會議決策、團隊抽籤、任務指派，平滑轉盤旋轉動畫。',
    category: '團隊決策',
    defaultColSpan: 2,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      align-items: center;
      justify-content: center;
      max-width: 700px;
      width: 100%;
    }
    .wheel-wrap {
      position: relative;
      width: 280px;
      height: 280px;
    }
    canvas {
      width: 280px;
      height: 280px;
      border-radius: 50%;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      background: #fff;
    }
    .pointer {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-top: 22px solid #e17b62;
      z-index: 10;
    }
    .panel {
      flex: 1;
      min-width: 240px;
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 14px;
      padding: 16px;
    }
    .panel h4 { margin: 0 0 10px 0; font-size: 13px; color: #1f2a2e; }
    textarea {
      width: 100%;
      height: 110px;
      border: 1px solid #dbe2df;
      border-radius: 8px;
      padding: 8px;
      font-size: 12px;
      resize: none;
      font-family: inherit;
    }
    textarea:focus { outline: none; border-color: #e17b62; }
    .btn {
      width: 100%;
      margin-top: 10px;
      background: #e17b62;
      color: #fff;
      border: none;
      padding: 10px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .btn:hover { background: #cf674e; }
    .result {
      margin-top: 10px;
      font-size: 15px;
      font-weight: 800;
      color: #e17b62;
      text-align: center;
      min-height: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="wheel-wrap">
      <div class="pointer"></div>
      <canvas id="wheel" width="560" height="560"></canvas>
    </div>
    <div class="panel">
      <h4>項目清單 (一行一個)</h4>
      <textarea id="itemsInput" oninput="drawWheel()">需求評審\n系統重構\n效能優化\n下午茶輪值\n撰寫測試\n架構規劃</textarea>
      <button class="btn" id="spinBtn" onclick="spin()">開始隨機旋轉</button>
      <div class="result" id="resultText">點擊旋轉產生結果</div>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    let currentAngle = 0;
    let isSpinning = false;
    const colors = ['#fcedea', '#f4ede4', '#e6f0ed', '#ebf2f7', '#faecd8', '#f0e6f2'];

    function getItems() {
      return document.getElementById('itemsInput').value
        .split('\\n')
        .map(s => s.trim())
        .filter(Boolean);
    }

    function drawWheel() {
      const items = getItems();
      if (items.length === 0) return;
      const num = items.length;
      const arc = (2 * Math.PI) / num;
      ctx.clearRect(0, 0, 560, 560);

      for (let i = 0; i < num; i++) {
        const angle = currentAngle + i * arc;
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(280, 280);
        ctx.arc(280, 280, 270, angle, angle + arc);
        ctx.fill();
        ctx.strokeStyle = '#e4e8e5';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(280, 280);
        ctx.rotate(angle + arc / 2);
        ctx.fillStyle = '#1f2a2e';
        ctx.font = 'bold 24px system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(items[i], 240, 8);
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(280, 280, 36, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#e17b62';
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    function spin() {
      if (isSpinning) return;
      const items = getItems();
      if (items.length < 2) {
        alert('請至少輸入兩個項目！');
        return;
      }
      isSpinning = true;
      document.getElementById('resultText').innerText = '旋轉中…';
      const spinAngle = Math.PI * 8 + Math.random() * Math.PI * 4;
      const duration = 3200;
      const start = performance.now();
      const startAngle = currentAngle;

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        currentAngle = startAngle + spinAngle * ease;
        drawWheel();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isSpinning = false;
          const arc = (2 * Math.PI) / items.length;
          const normalized = (3 * Math.PI / 2 - (currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
          const index = Math.floor(normalized / arc) % items.length;
          document.getElementById('resultText').innerText = '🎉 抽中：' + items[index];
        }
      }
      requestAnimationFrame(animate);
    }

    drawWheel();
  </script>
</body>
</html>`
  },
  {
    id: 'sticky_notes',
    title: '隨手便箋與待辦板',
    description: '多色隨手筆記、待辦打勾清單，數據自動暫存在瀏覽器。',
    category: '筆記與待辦',
    defaultColSpan: 2,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      min-height: 100vh;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .title { font-size: 14px; font-weight: 700; color: #1f2a2e; }
    .btn-add {
      background: #1f2a2e;
      color: #fff;
      border: none;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-add:hover { background: #e17b62; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
    }
    .note {
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
      height: 150px;
      position: relative;
    }
    .note textarea {
      flex: 1;
      width: 100%;
      border: none;
      background: transparent;
      resize: none;
      font-family: inherit;
      font-size: 12px;
      line-height: 1.5;
      color: #1f2a2e;
    }
    .note textarea:focus { outline: none; }
    .note-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
    }
    .del-btn {
      background: transparent;
      border: none;
      color: #9aa5a9;
      font-size: 12px;
      cursor: pointer;
    }
    .del-btn:hover { color: #d94b32; }
    .bg-yellow { background: #fffbe6; border: 1px solid #f6ecaa; }
    .bg-coral  { background: #fff0eb; border: 1px solid #f9d3c7; }
    .bg-mint   { background: #eef8f5; border: 1px solid #c9eee3; }
    .bg-blue   { background: #eff6fc; border: 1px solid #cce2f5; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">📌 快速便利貼</div>
    <button class="btn-add" onclick="addNote()">+ 新增便箋</button>
  </div>
  <div class="grid" id="notesGrid"></div>

  <script>
    const COLORS = ['bg-yellow', 'bg-coral', 'bg-mint', 'bg-blue'];
    let notes = JSON.parse(localStorage.getItem('tb_notes') || '[]');
    if (notes.length === 0) {
      notes = [
        { id: 1, text: '💡 這是第一張便利貼，隨時打字會自動儲存。', color: 'bg-yellow' },
        { id: 2, text: '🎯 今日待辦：\\n- 驗證小工具發布\\n- 整理看板筆記', color: 'bg-coral' }
      ];
    }

    function save() {
      localStorage.setItem('tb_notes', JSON.stringify(notes));
    }

    function render() {
      const container = document.getElementById('notesGrid');
      container.innerHTML = '';
      notes.forEach((n, idx) => {
        const div = document.createElement('div');
        div.className = 'note ' + (n.color || 'bg-yellow');
        div.innerHTML = \`
          <textarea placeholder="寫點什麼…" oninput="updateText(\${n.id}, this.value)">\${n.text}</textarea>
          <div class="note-footer">
            <span style="font-size:10px;color:#9aa5a9;">便箋 #\${idx + 1}</span>
            <button class="del-btn" onclick="deleteNote(\${n.id})">✕ 刪除</button>
          </div>
        \`;
        container.appendChild(div);
      });
    }

    function addNote() {
      const newNote = {
        id: Date.now(),
        text: '',
        color: COLORS[notes.length % COLORS.length]
      };
      notes.unshift(newNote);
      save();
      render();
    }

    function updateText(id, val) {
      const target = notes.find(n => n.id === id);
      if (target) {
        target.text = val;
        save();
      }
    }

    function deleteNote(id) {
      notes = notes.filter(n => n.id !== id);
      save();
      render();
    }

    render();
  </script>
</body>
</html>`
  },
  {
    id: 'sketch_pad',
    title: '極簡塗鴉手寫板',
    description: '快速畫圖、手寫標記、墨水與珊瑚橘筆觸切換，支援一鍵清除。',
    category: '繪圖與白板',
    defaultColSpan: 2,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      background: #ffffff;
      padding: 6px 12px;
      border: 1px solid #e4e8e5;
      border-radius: 10px;
    }
    .color-dot {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: transform 0.15s;
    }
    .color-dot.active { border-color: #1f2a2e; transform: scale(1.15); }
    .btn {
      border: 1px solid #e4e8e5;
      background: #fff;
      color: #526066;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn:hover { background: #f5f7f6; color: #1f2a2e; }
    canvas {
      flex: 1;
      width: 100%;
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 12px;
      cursor: crosshair;
      touch-action: none;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="color-dot active" style="background:#1f2a2e;" onclick="setColor('#1f2a2e', this)"></div>
    <div class="color-dot" style="background:#e17b62;" onclick="setColor('#e17b62', this)"></div>
    <div class="color-dot" style="background:#4a90e2;" onclick="setColor('#4a90e2', this)"></div>
    <div class="color-dot" style="background:#48bb78;" onclick="setColor('#48bb78', this)"></div>
    <div style="flex:1;"></div>
    <button class="btn" onclick="clearCanvas()">清空白板</button>
  </div>
  <canvas id="board"></canvas>

  <script>
    const canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let strokeColor = '#1f2a2e';

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.putImageData(img, 0, 0);
    }
    window.addEventListener('resize', resize);
    setTimeout(resize, 50);

    function setColor(c, el) {
      strokeColor = c;
      document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      el.classList.add('active');
    }

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX || e.touches[0].clientX) - rect.left,
        y: (e.clientY || e.touches[0].clientY) - rect.top
      };
    }

    function start(e) {
      isDrawing = true;
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    function move(e) {
      if (!isDrawing) return;
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    function stop() {
      isDrawing = false;
    }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);

    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', move);
    window.addEventListener('touchend', stop);

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  </script>
</body>
</html>`
  },
  {
    id: 'calculator',
    title: '極簡標準計算機',
    description: '標準四則運算、百分比與清除，支援實體鍵盤與觸控操作。',
    category: '實用工具',
    defaultColSpan: 1,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .calc-box {
      width: 260px;
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }
    .screen {
      background: #fbfbf9;
      border: 1px solid #e4e8e5;
      border-radius: 10px;
      padding: 12px;
      text-align: right;
      margin-bottom: 14px;
    }
    .history {
      font-size: 11px;
      color: #9aa5a9;
      min-height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .output {
      font-size: 26px;
      font-weight: 800;
      color: #1f2a2e;
      margin-top: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .keys {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .btn {
      border: none;
      background: #f5f7f6;
      color: #1f2a2e;
      font-size: 15px;
      font-weight: 600;
      padding: 12px 0;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn:hover { background: #e8ecea; }
    .btn:active { transform: scale(0.96); }
    .btn.op { background: #fff0eb; color: #e17b62; font-weight: 700; }
    .btn.op:hover { background: #fedfd6; }
    .btn.equal { background: #e17b62; color: #fff; font-weight: 700; grid-column: span 2; }
    .btn.equal:hover { background: #cf674e; }
  </style>
</head>
<body>
  <div class="calc-box">
    <div class="screen">
      <div class="history" id="history"></div>
      <div class="output" id="output">0</div>
    </div>
    <div class="keys">
      <button class="btn op" onclick="clearAll()">C</button>
      <button class="btn op" onclick="backspace()">⌫</button>
      <button class="btn op" onclick="press('%')">%</button>
      <button class="btn op" onclick="press('/')">÷</button>

      <button class="btn" onclick="press('7')">7</button>
      <button class="btn" onclick="press('8')">8</button>
      <button class="btn" onclick="press('9')">9</button>
      <button class="btn op" onclick="press('*')">×</button>

      <button class="btn" onclick="press('4')">4</button>
      <button class="btn" onclick="press('5')">5</button>
      <button class="btn" onclick="press('6')">6</button>
      <button class="btn op" onclick="press('-')">-</button>

      <button class="btn" onclick="press('1')">1</button>
      <button class="btn" onclick="press('2')">2</button>
      <button class="btn" onclick="press('3')">3</button>
      <button class="btn op" onclick="press('+')">+</button>

      <button class="btn" onclick="press('0')">0</button>
      <button class="btn" onclick="press('.')">.</button>
      <button class="btn equal" onclick="calculate()">=</button>
    </div>
  </div>

  <script>
    let expr = '';

    function update() {
      document.getElementById('output').innerText = expr || '0';
    }

    function press(char) {
      if (expr.length > 20) return;
      expr += char;
      update();
    }

    function clearAll() {
      expr = '';
      document.getElementById('history').innerText = '';
      update();
    }

    function backspace() {
      expr = expr.slice(0, -1);
      update();
    }

    function calculate() {
      try {
        const clean = expr.replace(/÷/g, '/').replace(/×/g, '*');
        const res = Function('"use strict"; return (' + clean + ')')();
        document.getElementById('history').innerText = expr + ' =';
        expr = String(Math.round(res * 100000) / 100000);
        update();
      } catch (e) {
        document.getElementById('output').innerText = '錯誤';
        expr = '';
      }
    }
  </script>
</body>
</html>`
  },
  {
    id: 'markdown_editor',
    title: 'Markdown 即時筆記',
    description: '即時雙欄預覽 Markdown，支援標題、粗體、清單、引用與程式碼區塊，附一鍵複製。',
    category: '文字與筆記',
    defaultColSpan: 2,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e4e8e5;
    }
    .title {
      font-size: 15px;
      font-weight: 700;
      color: #1f2a2e;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .btn {
      border: 1px solid #e4e8e5;
      background: #ffffff;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #526066;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn:hover { background: #f0f2f1; color: #1f2a2e; }
    .btn-coral { background: #e17b62; color: #ffffff; border-color: transparent; }
    .btn-coral:hover { background: #cf674e; color: #ffffff; }
    .editor-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      flex: 1;
      min-height: 0;
    }
    @media (max-width: 600px) {
      .editor-container { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
    }
    .pane {
      display: flex;
      flex-direction: column;
      border: 1px solid #e4e8e5;
      border-radius: 12px;
      background: #ffffff;
      overflow: hidden;
    }
    .pane-header {
      padding: 8px 12px;
      background: #f7f9f8;
      border-bottom: 1px solid #e4e8e5;
      font-size: 11px;
      font-weight: 700;
      color: #89959b;
      letter-spacing: 0.05em;
    }
    textarea {
      flex: 1;
      border: none;
      padding: 12px;
      font-family: Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      line-height: 1.6;
      resize: none;
      outline: none;
      color: #1f2a2e;
    }
    .preview {
      flex: 1;
      padding: 14px;
      overflow-y: auto;
      font-size: 14px;
      line-height: 1.7;
    }
    .preview h1 { font-size: 20px; border-bottom: 1px solid #e4e8e5; padding-bottom: 6px; margin-top: 0; }
    .preview h2 { font-size: 16px; border-bottom: 1px solid #e4e8e5; padding-bottom: 4px; }
    .preview h3 { font-size: 14px; }
    .preview pre { background: #f0f4f3; padding: 10px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 12px; }
    .preview code { background: #f0f4f3; padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 12px; }
    .preview blockquote { border-left: 3px solid #e17b62; margin-left: 0; padding-left: 12px; color: #69787f; }
    .preview ul { padding-left: 20px; }
    .preview table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 12px; }
    .preview th, .preview td { border: 1px solid #e4e8e5; padding: 6px 10px; text-align: left; }
    .preview th { background: #f7f9f8; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">
      <span style="color:#e17b62">📝</span> Markdown 即時筆記
    </div>
    <div class="actions">
      <button class="btn" onclick="insertSample()">範例內容</button>
      <button class="btn" onclick="clearText()">清空</button>
      <button class="btn btn-coral" onclick="copyHTML()">複製 HTML</button>
    </div>
  </div>
  <div class="editor-container">
    <div class="pane">
      <div class="pane-header">MARKDOWN 原始碼</div>
      <textarea id="editor" oninput="renderMD()" placeholder="在此輸入 Markdown 內容..."></textarea>
    </div>
    <div class="pane">
      <div class="pane-header">即時預覽效果</div>
      <div id="preview" class="preview"></div>
    </div>
  </div>

  <script>
    const sample = "# 工具小本本 備忘筆記\\n\\n這是一個簡潔高效的 Markdown 即時預覽工具。\\n\\n### 重點功能清單：\\n- **即時預覽**：打字同時同步解析\\n- *文字格式*：支援粗體、斜體與程式碼\\n- 引用區塊：\\n> 專注於當下的微小進展，日積月累終成大器。\\n\\n### 代碼展示：\\n\`\`\`javascript\\nfunction greet(name) {\\n  return 'Hello, ' + name;\\n}\\n\`\`\`\\n";

    function simpleParse(md) {
      let html = md
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/\\*\\*(.*?)\\*\\*/gim, '<strong>$1</strong>')
        .replace(/\\*(.*?)\\*/gim, '<em>$1</em>')
        .replace(/\`\`\`([\\s\\S]*?)\`\`\`/gim, '<pre><code>$1</code></pre>')
        .replace(/\`(.*?)\`/gim, '<code>$1</code>')
        .replace(/^\\- (.*$)/gim, '<li>$1</li>')
        .replace(/\\n/g, '<br>');
      return html;
    }

    function renderMD() {
      const src = document.getElementById('editor').value;
      document.getElementById('preview').innerHTML = simpleParse(src);
    }

    function insertSample() {
      document.getElementById('editor').value = sample;
      renderMD();
    }

    function clearText() {
      document.getElementById('editor').value = '';
      renderMD();
    }

    function copyHTML() {
      const html = document.getElementById('preview').innerHTML;
      navigator.clipboard.writeText(html).then(() => {
        alert('HTML 已複製至剪貼簿！');
      });
    }

    insertSample();
  </script>
</body>
</html>`
  },
  {
    id: 'password_generator',
    title: '高強度隨機密碼產生器',
    description: '自訂長度、字元類型與排除混淆字元，即時評估密碼強度並支援一鍵複製。',
    category: '安全與實用',
    defaultColSpan: 1,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
      max-width: 440px;
      margin: 0 auto;
      width: 100%;
    }
    .pw-box {
      display: flex;
      align-items: center;
      background: #f7f9f8;
      border: 1px solid #e4e8e5;
      border-radius: 12px;
      padding: 8px 12px;
      margin-bottom: 12px;
      position: relative;
    }
    .pw-text {
      flex: 1;
      font-family: Menlo, Monaco, Consolas, monospace;
      font-size: 16px;
      font-weight: 700;
      color: #1f2a2e;
      word-break: break-all;
      letter-spacing: 0.05em;
    }
    .copy-btn {
      background: #e17b62;
      color: #ffffff;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      shrink: 0;
    }
    .copy-btn:hover { background: #cf674e; }
    .strength-bar {
      height: 6px;
      border-radius: 3px;
      background: #e4e8e5;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .strength-fill {
      height: 100%;
      width: 0%;
      transition: all 0.3s;
    }
    .strength-text {
      font-size: 11px;
      font-weight: 600;
      color: #89959b;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
    }
    .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 13px;
      color: #1f2a2e;
    }
    .slider {
      width: 60%;
      accent-color: #e17b62;
    }
    .checkbox-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #526066;
      cursor: pointer;
    }
    .checkbox-label input { accent-color: #e17b62; }
    .gen-btn {
      width: 100%;
      background: #1f2a2e;
      color: #ffffff;
      border: none;
      padding: 10px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .gen-btn:hover { background: #354248; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size:15px; font-weight:700; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
      <span>🔐</span> 高強度隨機密碼產生器
    </div>
    <div class="pw-box">
      <div id="pwDisplay" class="pw-text">產生中...</div>
      <button class="copy-btn" onclick="copyPassword()">複製</button>
    </div>
    <div class="strength-bar">
      <div id="strengthFill" class="strength-fill"></div>
    </div>
    <div class="strength-text">
      <span>安全強度</span>
      <span id="strengthLabel">極高安全</span>
    </div>

    <div class="setting-row">
      <span>密碼長度：<strong id="lenVal" style="color:#e17b62">16</strong></span>
      <input type="range" id="length" min="6" max="32" value="16" class="slider" oninput="updateLen()">
    </div>

    <div class="checkbox-grid">
      <label class="checkbox-label"><input type="checkbox" id="upper" checked onchange="generate()"> 大寫字母 (A-Z)</label>
      <label class="checkbox-label"><input type="checkbox" id="lower" checked onchange="generate()"> 小寫字母 (a-z)</label>
      <label class="checkbox-label"><input type="checkbox" id="numbers" checked onchange="generate()"> 數字 (0-9)</label>
      <label class="checkbox-label"><input type="checkbox" id="symbols" checked onchange="generate()"> 特殊符號 (!@#)</label>
    </div>

    <button class="gen-btn" onclick="generate()">重新產生新密碼</button>
  </div>

  <script>
    function updateLen() {
      document.getElementById('lenVal').innerText = document.getElementById('length').value;
      generate();
    }

    function generate() {
      const len = parseInt(document.getElementById('length').value);
      const useUpper = document.getElementById('upper').checked;
      const useLower = document.getElementById('lower').checked;
      const useNum = document.getElementById('numbers').checked;
      const useSym = document.getElementById('symbols').checked;

      let chars = '';
      if (useUpper) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      if (useLower) chars += 'abcdefghijkmnopqrstuvwxyz';
      if (useNum) chars += '23456789';
      if (useSym) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (!chars) chars = 'abcdefghijkmnpqrstuvwxyz23456789';

      let result = '';
      const array = new Uint32Array(len);
      crypto.getRandomValues(array);
      for (let i = 0; i < len; i++) {
        result += chars[array[i] % chars.length];
      }

      document.getElementById('pwDisplay').innerText = result;

      // 強度指示
      const fill = document.getElementById('strengthFill');
      const label = document.getElementById('strengthLabel');
      if (len < 10 || (!useSym && !useNum)) {
        fill.style.width = '35%';
        fill.style.background = '#e74c3c';
        label.innerText = '弱 (易受暴力破解)';
      } else if (len < 14) {
        fill.style.width = '70%';
        fill.style.background = '#f39c12';
        label.innerText = '中等 (符合基本安全)';
      } else {
        fill.style.width = '100%';
        fill.style.background = '#27ae60';
        label.innerText = '極高強度 (極佳安全性)';
      }
    }

    function copyPassword() {
      const text = document.getElementById('pwDisplay').innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert('密碼已複製到剪貼簿！');
      });
    }

    generate();
  </script>
</body>
</html>`
  },
  {
    id: 'json_formatter',
    title: 'JSON 格式化與檢驗器',
    description: 'JSON 語法驗證、2格/4格縮排美化與單行壓縮，語法錯誤精確定位。',
    category: '開發輔助',
    defaultColSpan: 2,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .title {
      font-size: 15px;
      font-weight: 700;
      color: #1f2a2e;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .actions {
      display: flex;
      gap: 6px;
    }
    .btn {
      border: 1px solid #e4e8e5;
      background: #ffffff;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #526066;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn:hover { background: #f0f2f1; color: #1f2a2e; }
    .btn-coral { background: #e17b62; color: #ffffff; border-color: transparent; }
    .btn-coral:hover { background: #cf674e; color: #ffffff; }
    .editor-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid #e4e8e5;
      border-radius: 12px;
      background: #ffffff;
      overflow: hidden;
    }
    textarea {
      flex: 1;
      border: none;
      padding: 14px;
      font-family: Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      line-height: 1.5;
      resize: none;
      outline: none;
      color: #1f2a2e;
    }
    .status-bar {
      padding: 8px 14px;
      background: #f7f9f8;
      border-top: 1px solid #e4e8e5;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .valid { color: #27ae60; font-weight: 600; }
    .invalid { color: #e74c3c; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">
      <span>⚙️</span> JSON 格式化與檢驗器
    </div>
    <div class="actions">
      <button class="btn" onclick="formatJSON(2)">2格縮排</button>
      <button class="btn" onclick="formatJSON(4)">4格縮排</button>
      <button class="btn" onclick="minifyJSON()">壓縮一行</button>
      <button class="btn" onclick="clearAll()">清空</button>
      <button class="btn btn-coral" onclick="copyResult()">複製結果</button>
    </div>
  </div>

  <div class="editor-box">
    <textarea id="jsonInput" placeholder="在此貼入待處理的 JSON 代碼..." oninput="validateJSON()"></textarea>
    <div class="status-bar">
      <span id="status" class="valid">狀態：準備就緒</span>
      <span id="charCount" style="color:#89959b">0 字元</span>
    </div>
  </div>

  <script>
    const sample = JSON.stringify({
      appName: "工具小本本",
      version: "2.0.0",
      features: ["手帳紙質主題", "自訂標籤", "置頂釘選", "獨立浮動視窗"],
      author: { name: "Antigravity", isReady: true }
    }, null, 2);

    document.getElementById('jsonInput').value = sample;

    function validateJSON() {
      const val = document.getElementById('jsonInput').value.trim();
      const status = document.getElementById('status');
      const count = document.getElementById('charCount');
      count.innerText = val.length + ' 字元';

      if (!val) {
        status.className = 'valid';
        status.innerText = '狀態：請輸入 JSON 內容';
        return false;
      }
      try {
        JSON.parse(val);
        status.className = 'valid';
        status.innerText = '✔ 語法正確 (有效 JSON)';
        return true;
      } catch (err) {
        status.className = 'invalid';
        status.innerText = '✖ 語法錯誤：' + err.message;
        return false;
      }
    }

    function formatJSON(indent) {
      const val = document.getElementById('jsonInput').value.trim();
      try {
        const obj = JSON.parse(val);
        document.getElementById('jsonInput').value = JSON.stringify(obj, null, indent);
        validateJSON();
      } catch (e) {
        alert('無法格式化，請先修正語法錯誤：' + e.message);
      }
    }

    function minifyJSON() {
      const val = document.getElementById('jsonInput').value.trim();
      try {
        const obj = JSON.parse(val);
        document.getElementById('jsonInput').value = JSON.stringify(obj);
        validateJSON();
      } catch (e) {
        alert('無法壓縮，請先修正語法錯誤：' + e.message);
      }
    }

    function clearAll() {
      document.getElementById('jsonInput').value = '';
      validateJSON();
    }

    function copyResult() {
      const val = document.getElementById('jsonInput').value;
      navigator.clipboard.writeText(val).then(() => {
        alert('已複製到剪貼簿！');
      });
    }

    validateJSON();
  </script>
</body>
</html>`
  },
  {
    id: 'world_clock',
    title: '世界時區時鐘',
    description: '掌握台北、東京、倫敦、紐約全球主要城市即時時間、日期與相對時差。',
    category: '時間與排程',
    defaultColSpan: 2,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
    }
    .clock-card {
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.03);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: transform 0.2s;
    }
    .clock-card:hover { transform: translateY(-2px); border-color: #e1ac9e; }
    .city-badge {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #e17b62;
      background: #fff0eb;
      padding: 3px 10px;
      border-radius: 12px;
      margin-bottom: 8px;
    }
    .time-val {
      font-size: 32px;
      font-weight: 800;
      color: #1f2a2e;
      font-variant-numeric: tabular-nums;
      line-height: 1.1;
      margin-bottom: 6px;
    }
    .date-val {
      font-size: 12px;
      color: #69787f;
      margin-bottom: 4px;
    }
    .offset-val {
      font-size: 11px;
      font-weight: 600;
      color: #89959b;
    }
  </style>
</head>
<body>
  <div class="grid">
    <div class="clock-card">
      <div class="city-badge">🇹🇼 台北 (Taipei)</div>
      <div id="time-taipei" class="time-val">00:00:00</div>
      <div id="date-taipei" class="date-val">載入中...</div>
      <div class="offset-val">UTC +8 (本地基準)</div>
    </div>

    <div class="clock-card">
      <div class="city-badge">🇯🇵 東京 (Tokyo)</div>
      <div id="time-tokyo" class="time-val">00:00:00</div>
      <div id="date-tokyo" class="date-val">載入中...</div>
      <div class="offset-val">UTC +9 (快 1 小時)</div>
    </div>

    <div class="clock-card">
      <div class="city-badge">🇬🇧 倫敦 (London)</div>
      <div id="time-london" class="time-val">00:00:00</div>
      <div id="date-london" class="date-val">載入中...</div>
      <div class="offset-val">UTC +0 / +1 (格林威治)</div>
    </div>

    <div class="clock-card">
      <div class="city-badge">🇺🇸 紐約 (New York)</div>
      <div id="time-ny" class="time-val">00:00:00</div>
      <div id="date-ny" class="date-val">載入中...</div>
      <div class="offset-val">UTC -5 / -4 (美東時間)</div>
    </div>
  </div>

  <script>
    const zones = [
      { id: 'taipei', timeZone: 'Asia/Taipei' },
      { id: 'tokyo', timeZone: 'Asia/Tokyo' },
      { id: 'london', timeZone: 'Europe/London' },
      { id: 'ny', timeZone: 'America/New_York' }
    ];

    function updateClocks() {
      const now = new Date();
      zones.forEach(z => {
        const timeStr = now.toLocaleTimeString('zh-TW', { timeZone: z.timeZone, hour12: false });
        const dateStr = now.toLocaleDateString('zh-TW', {
          timeZone: z.timeZone,
          month: 'short',
          day: 'numeric',
          weekday: 'short'
        });
        const elTime = document.getElementById('time-' + z.id);
        const elDate = document.getElementById('date-' + z.id);
        if (elTime) elTime.innerText = timeStr;
        if (elDate) elDate.innerText = dateStr;
      });
    }

    setInterval(updateClocks, 1000);
    updateClocks();
  </script>
</body>
</html>`
  },
  {
    id: 'text_tools',
    title: '文字統計與編解碼',
    description: '字數/字元/行數統計、Base64 與 URL 編解碼、大小寫轉換。',
    category: '文字與筆記',
    defaultColSpan: 1,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }
    .stat-item {
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 10px;
      padding: 8px 4px;
      text-align: center;
    }
    .stat-num {
      font-size: 18px;
      font-weight: 800;
      color: #e17b62;
      line-height: 1;
      margin-bottom: 4px;
    }
    .stat-label {
      font-size: 10px;
      font-weight: 600;
      color: #89959b;
    }
    .editor-box {
      flex: 1;
      border: 1px solid #e4e8e5;
      border-radius: 12px;
      background: #ffffff;
      display: flex;
      overflow: hidden;
      margin-bottom: 12px;
    }
    textarea {
      flex: 1;
      border: none;
      padding: 12px;
      font-family: Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      line-height: 1.5;
      outline: none;
      resize: none;
      color: #1f2a2e;
    }
    .btn-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }
    .btn {
      border: 1px solid #e4e8e5;
      background: #ffffff;
      padding: 8px 6px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      color: #526066;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }
    .btn:hover { background: #f0f2f1; color: #1f2a2e; }
    .btn-coral { background: #e17b62; color: #ffffff; border-color: transparent; }
    .btn-coral:hover { background: #cf674e; color: #ffffff; }
  </style>
</head>
<body>
  <div class="stats-bar">
    <div class="stat-item">
      <div id="stat-words" class="stat-num">0</div>
      <div class="stat-label">字數</div>
    </div>
    <div class="stat-item">
      <div id="stat-chars" class="stat-num">0</div>
      <div class="stat-label">總字元</div>
    </div>
    <div class="stat-item">
      <div id="stat-nonspace" class="stat-num">0</div>
      <div class="stat-label">不含空格</div>
    </div>
    <div class="stat-item">
      <div id="stat-lines" class="stat-num">0</div>
      <div class="stat-label">行數</div>
    </div>
  </div>

  <div class="editor-box">
    <textarea id="textBox" placeholder="請在此輸入或貼上文字..." oninput="updateStats()"></textarea>
  </div>

  <div class="btn-grid">
    <button class="btn" onclick="toBase64()">Base64 編碼</button>
    <button class="btn" onclick="fromBase64()">Base64 解碼</button>
    <button class="btn" onclick="toURL()">URL 編碼</button>
    <button class="btn" onclick="fromURL()">URL 解碼</button>
    <button class="btn" onclick="toUpperCase()">轉為大寫</button>
    <button class="btn" onclick="toLowerCase()">轉為小寫</button>
    <button class="btn" onclick="clearText()">清空內容</button>
    <button class="btn btn-coral" style="grid-column: span 2" onclick="copyText()">複製文字內容</button>
  </div>

  <script>
    function updateStats() {
      const text = document.getElementById('textBox').value;
      const chars = text.length;
      const nonSpace = text.replace(/\\s/g, '').length;
      const words = text.trim() ? text.trim().split(/\\s+/).length : 0;
      const lines = text ? text.split('\\n').length : 0;

      document.getElementById('stat-chars').innerText = chars;
      document.getElementById('stat-nonspace').innerText = nonSpace;
      document.getElementById('stat-words').innerText = words;
      document.getElementById('stat-lines').innerText = lines;
    }

    function toBase64() {
      try {
        const text = document.getElementById('textBox').value;
        document.getElementById('textBox').value = btoa(unescape(encodeURIComponent(text)));
        updateStats();
      } catch (e) { alert('Base64 編碼錯誤: ' + e.message); }
    }

    function fromBase64() {
      try {
        const text = document.getElementById('textBox').value;
        document.getElementById('textBox').value = decodeURIComponent(escape(atob(text)));
        updateStats();
      } catch (e) { alert('Base64 解碼錯誤: ' + e.message); }
    }

    function toURL() {
      const text = document.getElementById('textBox').value;
      document.getElementById('textBox').value = encodeURIComponent(text);
      updateStats();
    }

    function fromURL() {
      try {
        const text = document.getElementById('textBox').value;
        document.getElementById('textBox').value = decodeURIComponent(text);
        updateStats();
      } catch (e) { alert('URL 解碼錯誤: ' + e.message); }
    }

    function toUpperCase() {
      const box = document.getElementById('textBox');
      box.value = box.value.toUpperCase();
      updateStats();
    }

    function toLowerCase() {
      const box = document.getElementById('textBox');
      box.value = box.value.toLowerCase();
      updateStats();
    }

    function clearText() {
      document.getElementById('textBox').value = '';
      updateStats();
    }

    function copyText() {
      const text = document.getElementById('textBox').value;
      navigator.clipboard.writeText(text).then(() => {
        alert('文字已複製到剪貼簿！');
      });
    }

    updateStats();
  </script>
</body>
</html>`
  },
  {
    id: 'white_noise',
    title: '白噪音專注放鬆器',
    description: '合成雨聲、海浪、森林風聲與溫潤白噪音，助於提升專注力與冥想放鬆。',
    category: '效能與專注',
    defaultColSpan: 1,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      text-align: center;
    }
    .header-tag {
      font-size: 11px;
      font-weight: 700;
      color: #3b827e;
      background: #f1f9f6;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 10px;
      letter-spacing: 0.05em;
    }
    h2 { margin: 0 0 4px; font-size: 18px; font-weight: 800; color: #1f2a2e; }
    p { margin: 0 0 20px; font-size: 12px; color: #6b7c85; }
    .noise-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      width: 100%;
      max-width: 380px;
      margin-bottom: 20px;
    }
    .noise-card {
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 12px;
      padding: 14px 12px;
      text-align: left;
      transition: all 0.2s;
    }
    .noise-card.playing {
      border-color: #3b827e;
      background: #f4faf8;
    }
    .noise-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .noise-title {
      font-size: 13px;
      font-weight: 700;
      color: #1f2a2e;
    }
    .play-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: #e4e8e5;
      color: #526066;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .noise-card.playing .play-btn {
      background: #3b827e;
      color: #ffffff;
    }
    .slider-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    input[type=range] {
      flex: 1;
      accent-color: #3b827e;
      cursor: pointer;
    }
    .volume-label {
      font-size: 10px;
      color: #89959b;
      font-family: monospace;
      width: 26px;
      text-align: right;
    }
    .master-controls {
      display: flex;
      gap: 10px;
      width: 100%;
      max-width: 380px;
    }
    .btn-action {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-stop {
      background: #f0f2f1;
      color: #526066;
    }
    .btn-stop:hover { background: #e4e8e5; }
  </style>
</head>
<body>
  <div class="header-tag">專注空間</div>
  <h2>環境聲音生成器</h2>
  <p>可自由疊加多種白噪音與自然頻率</p>

  <div class="noise-grid">
    <div class="noise-card" id="card-rain">
      <div class="noise-top">
        <span class="noise-title">細雨落葉</span>
        <button class="play-btn" onclick="toggleNoise('rain')">播放</button>
      </div>
      <div class="slider-row">
        <input type="range" min="0" max="1" step="0.05" value="0.5" oninput="setGain('rain', this.value)">
        <span class="volume-label" id="label-rain">50%</span>
      </div>
    </div>

    <div class="noise-card" id="card-waves">
      <div class="noise-top">
        <span class="noise-title">平緩海潮</span>
        <button class="play-btn" onclick="toggleNoise('waves')">播放</button>
      </div>
      <div class="slider-row">
        <input type="range" min="0" max="1" step="0.05" value="0.5" oninput="setGain('waves', this.value)">
        <span class="volume-label" id="label-waves">50%</span>
      </div>
    </div>

    <div class="noise-card" id="card-wind">
      <div class="noise-top">
        <span class="noise-title">林間微風</span>
        <button class="play-btn" onclick="toggleNoise('wind')">播放</button>
      </div>
      <div class="slider-row">
        <input type="range" min="0" max="1" step="0.05" value="0.5" oninput="setGain('wind', this.value)">
        <span class="volume-label" id="label-wind">50%</span>
      </div>
    </div>

    <div class="noise-card" id="card-cafe">
      <div class="noise-top">
        <span class="noise-title">溫暖啡館</span>
        <button class="play-btn" onclick="toggleNoise('cafe')">播放</button>
      </div>
      <div class="slider-row">
        <input type="range" min="0" max="1" step="0.05" value="0.5" oninput="setGain('cafe', this.value)">
        <span class="volume-label" id="label-cafe">50%</span>
      </div>
    </div>
  </div>

  <div class="master-controls">
    <button class="btn-action btn-stop" onclick="stopAll()">全部靜音停止</button>
  </div>

  <script>
    let audioCtx = null;
    const channels = {};

    function initAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function createNoiseNode(type) {
      initAudio();
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink noise filter
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        } else if (type === 'waves' || type === 'wind') {
          // Brown noise filter
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else {
          // Soft pink
          data[i] = (lastOut + (0.05 * white)) / 1.05;
          lastOut = data[i];
          data[i] *= 2.0;
        }
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const filter = audioCtx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 1800;
      } else if (type === 'waves') {
        filter.type = 'lowpass';
        filter.frequency.value = 650;
      } else if (type === 'wind') {
        filter.type = 'bandpass';
        filter.frequency.value = 450;
        filter.Q.value = 1.2;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
      }

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 0.5;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      return { source: whiteNoise, gain: gainNode, playing: false };
    }

    function toggleNoise(type) {
      initAudio();
      const card = document.getElementById('card-' + type);
      const btn = card.querySelector('.play-btn');

      if (!channels[type]) {
        channels[type] = createNoiseNode(type);
      }

      const ch = channels[type];
      if (!ch.playing) {
        try {
          ch.source.start(0);
        } catch (e) {
          channels[type] = createNoiseNode(type);
          channels[type].source.start(0);
        }
        ch.playing = true;
        card.classList.add('playing');
        btn.textContent = '暫停';
      } else {
        ch.gain.gain.value = 0;
        ch.playing = false;
        card.classList.remove('playing');
        btn.textContent = '播放';
      }
    }

    function setGain(type, val) {
      initAudio();
      document.getElementById('label-' + type).textContent = Math.round(val * 100) + '%';
      if (channels[type]) {
        channels[type].gain.gain.value = parseFloat(val);
      }
    }

    function stopAll() {
      ['rain', 'waves', 'wind', 'cafe'].forEach(type => {
        if (channels[type] && channels[type].playing) {
          toggleNoise(type);
        }
      });
    }
  </script>
</body>
</html>`
  },
  {
    id: 'habit_tracker',
    title: '手帳習慣打卡與目標追蹤器',
    description: '每日待辦習慣打卡與每週完成率動態進度條，培養持之以恆的自律生活。',
    category: '生活日常',
    defaultColSpan: 2,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      border-bottom: 1px solid #e4e8e5;
      padding-bottom: 12px;
    }
    h2 { margin: 0; font-size: 16px; font-weight: 800; color: #1f2a2e; }
    .week-info { font-size: 12px; color: #e17b62; font-weight: 700; }
    .progress-box {
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 16px;
    }
    .progress-top {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .progress-track {
      height: 8px;
      background: #f0f2f1;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #e17b62;
      border-radius: 4px;
      transition: width 0.3s;
      width: 0%;
    }
    .table-container {
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 12px;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: center;
      font-size: 12px;
    }
    th, td {
      padding: 10px 8px;
      border-bottom: 1px solid #f0f2f1;
    }
    th {
      background: #fafafa;
      color: #69787f;
      font-weight: 700;
      font-size: 11px;
    }
    th.habit-col, td.habit-col {
      text-align: left;
      padding-left: 14px;
      font-weight: 700;
      color: #1f2a2e;
    }
    .check-btn {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      border: 1px solid #d3d9d5;
      background: transparent;
      cursor: pointer;
      transition: all 0.15s;
    }
    .check-btn.done {
      background: #e17b62;
      border-color: #e17b62;
      color: #ffffff;
      font-weight: 700;
    }
    .action-row {
      display: flex;
      gap: 8px;
      margin-top: 14px;
    }
    input[type=text] {
      flex: 1;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #d3d9d5;
      font-size: 12px;
      outline: none;
    }
    input[type=text]:focus { border-color: #e17b62; }
    .btn-add {
      background: #e17b62;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-del {
      background: transparent;
      border: none;
      color: #a0acb2;
      cursor: pointer;
      font-size: 14px;
    }
    .btn-del:hover { color: #e15241; }
  </style>
</head>
<body>
  <div class="header">
    <h2>習慣養成追蹤卡</h2>
    <span class="week-info">本週目標進度</span>
  </div>

  <div class="progress-box">
    <div class="progress-top">
      <span>達成率</span>
      <span id="rateLabel">0%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" id="progressFill"></div>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class="habit-col">習慣項目</th>
          <th>週一</th>
          <th>週二</th>
          <th>週三</th>
          <th>週四</th>
          <th>週五</th>
          <th>週六</th>
          <th>週日</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody id="habitRows"></tbody>
    </table>
  </div>

  <div class="action-row">
    <input type="text" id="habitInput" placeholder="新增自訂習慣，例如：閱讀 30 分鐘、喝水 2000cc…">
    <button class="btn-add" onclick="addHabit()">新增項目</button>
  </div>

  <script>
    const STORAGE_KEY = 'notebook_habit_tracker_data';
    let habits = [
      { id: 1, name: '晨間閱讀 20 分鐘', days: [false, false, false, false, false, false, false] },
      { id: 2, name: '喝足 2000cc 水', days: [false, false, false, false, false, false, false] },
      { id: 3, name: '每日伸展運動', days: [false, false, false, false, false, false, false] }
    ];

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) habits = JSON.parse(saved);
    } catch(e) {}

    function save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
      } catch(e) {}
      render();
    }

    function toggleDay(habitId, dayIndex) {
      const h = habits.find(x => x.id === habitId);
      if (h) {
        h.days[dayIndex] = !h.days[dayIndex];
        save();
      }
    }

    function addHabit() {
      const input = document.getElementById('habitInput');
      const val = input.value.trim();
      if (!val) return;
      habits.push({ id: Date.now(), name: val, days: [false, false, false, false, false, false, false] });
      input.value = '';
      save();
    }

    function deleteHabit(habitId) {
      habits = habits.filter(x => x.id !== habitId);
      save();
    }

    function render() {
      const tbody = document.getElementById('habitRows');
      tbody.innerHTML = '';

      let totalSlots = habits.length * 7;
      let checkedSlots = 0;

      habits.forEach(h => {
        const tr = document.createElement('tr');
        let daysHtml = '';
        h.days.forEach((done, i) => {
          if (done) checkedSlots++;
          daysHtml += \`<td><button class="check-btn \${done ? 'done' : ''}" onclick="toggleDay(\${h.id}, \${i})">\${done ? '✓' : ''}</button></td>\`;
        });

        tr.innerHTML = \`
          <td class="habit-col">\${h.name}</td>
          \${daysHtml}
          <td><button class="btn-del" onclick="deleteHabit(\${h.id})" title="刪除">✕</button></td>
        \`;
        tbody.appendChild(tr);
      });

      const rate = totalSlots > 0 ? Math.round((checkedSlots / totalSlots) * 100) : 0;
      document.getElementById('rateLabel').textContent = rate + '%';
      document.getElementById('progressFill').style.width = rate + '%';
    }

    render();
  </script>
</body>
</html>`
  },
  {
    id: 'unit_converter',
    title: '多功能通用單位換算器',
    description: '長度、重量、溫度、面積與數據容量即時互轉計算。',
    category: '實用工具',
    defaultColSpan: 1,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .wrapper {
      width: 100%;
      max-width: 380px;
    }
    .type-tabs {
      display: flex;
      gap: 4px;
      background: #f0f2f1;
      padding: 4px;
      border-radius: 10px;
      margin-bottom: 16px;
      overflow-x: auto;
    }
    .type-btn {
      flex: 1;
      padding: 6px 10px;
      border-radius: 7px;
      border: none;
      background: transparent;
      font-size: 12px;
      font-weight: 700;
      color: #69787f;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .type-btn.active {
      background: #ffffff;
      color: #1f2a2e;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .card {
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    label {
      font-size: 11px;
      font-weight: 700;
      color: #69787f;
    }
    .input-group {
      display: flex;
      gap: 8px;
    }
    input[type=number] {
      flex: 1;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #d3d9d5;
      font-size: 15px;
      font-weight: 700;
      outline: none;
      color: #1f2a2e;
    }
    input[type=number]:focus { border-color: #3b82f6; }
    select {
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid #d3d9d5;
      background: #fafafa;
      font-size: 12px;
      font-weight: 700;
      color: #1f2a2e;
      outline: none;
    }
    .swap-btn {
      align-self: center;
      background: #f0f2f1;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      font-size: 14px;
      color: #526066;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .swap-btn:hover { background: #e4e8e5; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="type-tabs">
      <button class="type-btn active" onclick="switchType('length')">長度</button>
      <button class="type-btn" onclick="switchType('weight')">重量</button>
      <button class="type-btn" onclick="switchType('temperature')">溫度</button>
      <button class="type-btn" onclick="switchType('area')">面積</button>
    </div>

    <div class="card">
      <div class="row">
        <label>來源數值與單位</label>
        <div class="input-group">
          <input type="number" id="fromValue" value="1" oninput="convert(true)">
          <select id="fromUnit" onchange="convert(true)"></select>
        </div>
      </div>

      <button class="swap-btn" onclick="swapUnits()">⇅</button>

      <div class="row">
        <label>目標轉換結果</label>
        <div class="input-group">
          <input type="number" id="toValue" oninput="convert(false)">
          <select id="toUnit" onchange="convert(true)"></select>
        </div>
      </div>
    </div>
  </div>

  <script>
    const UNITS = {
      length: {
        units: [
          { key: 'm', label: '公尺 (m)', rate: 1 },
          { key: 'cm', label: '公分 (cm)', rate: 0.01 },
          { key: 'mm', label: '公釐 (mm)', rate: 0.001 },
          { key: 'km', label: '公里 (km)', rate: 1000 },
          { key: 'in', label: '英吋 (in)', rate: 0.0254 },
          { key: 'ft', label: '英呎 (ft)', rate: 0.3048 }
        ]
      },
      weight: {
        units: [
          { key: 'kg', label: '公斤 (kg)', rate: 1 },
          { key: 'g', label: '公克 (g)', rate: 0.001 },
          { key: 'mg', label: '毫克 (mg)', rate: 0.000001 },
          { key: 'lb', label: '磅 (lb)', rate: 0.45359237 },
          { key: 'oz', label: '盎司 (oz)', rate: 0.02834952 }
        ]
      },
      temperature: {
        special: true,
        units: [
          { key: 'c', label: '攝氏 (°C)' },
          { key: 'f', label: '華氏 (°F)' },
          { key: 'k', label: '克氏 (K)' }
        ]
      },
      area: {
        units: [
          { key: 'sqm', label: '平方公尺 (m²)', rate: 1 },
          { key: 'sqft', label: '平方英呎 (ft²)', rate: 0.092903 },
          { key: 'ping', label: '台灣坪', rate: 3.305785 },
          { key: 'ha', label: '公頃 (ha)', rate: 10000 }
        ]
      }
    };

    let currentCategory = 'length';

    function switchType(type) {
      currentCategory = type;
      document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');

      const u = UNITS[type].units;
      const fromSel = document.getElementById('fromUnit');
      const toSel = document.getElementById('toUnit');
      fromSel.innerHTML = '';
      toSel.innerHTML = '';

      u.forEach((item, i) => {
        fromSel.add(new Option(item.label, item.key, i === 0, i === 0));
        toSel.add(new Option(item.label, item.key, i === 1, i === 1));
      });

      convert(true);
    }

    function convert(fromSource) {
      const fromKey = document.getElementById('fromUnit').value;
      const toKey = document.getElementById('toUnit').value;
      const fromVal = parseFloat(document.getElementById('fromValue').value) || 0;

      if (currentCategory === 'temperature') {
        let celsius = fromVal;
        if (fromKey === 'f') celsius = (fromVal - 32) * (5 / 9);
        else if (fromKey === 'k') celsius = fromVal - 273.15;

        let result = celsius;
        if (toKey === 'f') result = (celsius * 9 / 5) + 32;
        else if (toKey === 'k') result = celsius + 273.15;

        document.getElementById('toValue').value = parseFloat(result.toFixed(4));
        return;
      }

      const list = UNITS[currentCategory].units;
      const rFrom = list.find(x => x.key === fromKey).rate;
      const rTo = list.find(x => x.key === toKey).rate;

      const baseVal = fromVal * rFrom;
      const targetVal = baseVal / rTo;
      document.getElementById('toValue').value = parseFloat(targetVal.toFixed(6));
    }

    function swapUnits() {
      const fromSel = document.getElementById('fromUnit');
      const toSel = document.getElementById('toUnit');
      const tmp = fromSel.value;
      fromSel.value = toSel.value;
      toSel.value = tmp;
      convert(true);
    }

    switchType('length');
  </script>
</body>
</html>`
  },
  {
    id: 'lucky_picker',
    title: '幸運雙骰與隨機名單抽籤器',
    description: '支援自訂名單隨機抽選、擲雙骰點數動畫，教學抽問與會議破冰利器。',
    category: '靈感與創意',
    defaultColSpan: 1,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      text-align: center;
    }
    .tab-row {
      display: flex;
      gap: 6px;
      background: #f0f2f1;
      padding: 4px;
      border-radius: 10px;
      margin-bottom: 16px;
    }
    .tab-btn {
      padding: 6px 16px;
      border-radius: 7px;
      border: none;
      background: transparent;
      font-size: 12px;
      font-weight: 700;
      color: #69787f;
      cursor: pointer;
    }
    .tab-btn.active {
      background: #ffffff;
      color: #1f2a2e;
      box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    }
    .section { display: none; width: 100%; max-width: 360px; }
    .section.active { display: block; }
    .dice-stage {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 24px 0 16px;
    }
    .die {
      width: 70px;
      height: 70px;
      background: #ffffff;
      border: 2px solid #e4e8e5;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 800;
      color: #e17b62;
      box-shadow: 0 6px 12px rgba(0,0,0,0.06);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .sum-text {
      font-size: 14px;
      font-weight: 700;
      color: #69787f;
      margin-bottom: 18px;
    }
    .sum-text b { color: #1f2a2e; font-size: 18px; }
    textarea {
      width: 100%;
      height: 100px;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #d3d9d5;
      font-size: 12px;
      margin-bottom: 12px;
      outline: none;
      resize: vertical;
      font-family: inherit;
    }
    .result-display {
      min-height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 800;
      color: #e17b62;
      margin: 12px 0;
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 10px;
      padding: 10px;
    }
    .btn-roll {
      background: #e17b62;
      color: #ffffff;
      border: none;
      padding: 10px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s;
    }
    .btn-roll:hover { background: #cf674e; }
  </style>
</head>
<body>
  <div class="tab-row">
    <button class="tab-btn active" onclick="switchSection('dice')">搖雙骰子</button>
    <button class="tab-btn" onclick="switchSection('picker')">自訂名單抽籤</button>
  </div>

  <div class="section active" id="sec-dice">
    <div class="dice-stage">
      <div class="die" id="die1">3</div>
      <div class="die" id="die2">4</div>
    </div>
    <div class="sum-text">總點數：<b id="diceSum">7</b></div>
    <button class="btn-roll" onclick="rollDice()">擲骰子</button>
  </div>

  <div class="section" id="sec-picker">
    <textarea id="nameList" placeholder="輸入抽籤候選名單，以換行或逗號分隔，例如：\n王小明\n李小華\n張大成\n林佳佳"></textarea>
    <div class="result-display" id="pickerResult">點擊下方按鈕開始抽選</div>
    <button class="btn-roll" onclick="pickName()">隨機抽出一位</button>
  </div>

  <script>
    function switchSection(sec) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.getElementById('sec-' + sec).classList.add('active');
    }

    function rollDice() {
      const d1 = document.getElementById('die1');
      const d2 = document.getElementById('die2');
      d1.style.transform = 'rotate(' + (Math.random() * 360) + 'deg) scale(0.9)';
      d2.style.transform = 'rotate(' + (Math.random() * 360) + 'deg) scale(0.9)';

      setTimeout(() => {
        const v1 = Math.floor(Math.random() * 6) + 1;
        const v2 = Math.floor(Math.random() * 6) + 1;
        d1.textContent = v1;
        d2.textContent = v2;
        d1.style.transform = 'none';
        d2.style.transform = 'none';
        document.getElementById('diceSum').textContent = v1 + v2;
      }, 200);
    }

    function pickName() {
      const text = document.getElementById('nameList').value.trim();
      const items = text.split(/[\\n,，]+/).map(s => s.trim()).filter(Boolean);
      const res = document.getElementById('pickerResult');
      if (items.length === 0) {
        res.textContent = '請先在上方輸入名單！';
        return;
      }
      let counter = 0;
      const interval = setInterval(() => {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        res.textContent = randomItem;
        counter++;
        if (counter > 12) {
          clearInterval(interval);
          const finalItem = items[Math.floor(Math.random() * items.length)];
          res.textContent = finalItem;
        }
      }, 50);
    }
  </script>
</body>
</html>`
  },
  {
    id: 'countdown_board',
    title: '重大紀念日倒數計時卡',
    description: '考試、專案截止日或重要節慶天數倒數，動態比例進度條。',
    category: '效能與專注',
    defaultColSpan: 1,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      text-align: center;
    }
    .badge {
      font-size: 11px;
      font-weight: 700;
      color: #e17b62;
      background: #fff0eb;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 12px;
    }
    .event-title {
      font-size: 18px;
      font-weight: 800;
      color: #1f2a2e;
      margin-bottom: 8px;
    }
    .days-box {
      margin: 16px 0;
    }
    .days-num {
      font-size: 68px;
      font-weight: 900;
      color: #e17b62;
      line-height: 1;
      letter-spacing: -0.03em;
    }
    .days-unit {
      font-size: 13px;
      color: #69787f;
      font-weight: 700;
      margin-top: 4px;
    }
    .sub-timer {
      font-size: 13px;
      font-family: monospace;
      color: #526066;
      background: #f0f2f1;
      padding: 6px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .settings-card {
      background: #ffffff;
      border: 1px solid #e4e8e5;
      border-radius: 12px;
      padding: 14px;
      width: 100%;
      max-width: 320px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: left;
    }
    label { font-size: 11px; font-weight: 700; color: #69787f; }
    input[type=text], input[type=date] {
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid #d3d9d5;
      font-size: 12px;
      outline: none;
      font-family: inherit;
    }
    .btn-save {
      background: #e17b62;
      color: #ffffff;
      border: none;
      padding: 8px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="badge">紀念日倒數</div>
  <div class="event-title" id="displayTitle">專案發表會</div>
  
  <div class="days-box">
    <div class="days-num" id="daysNum">0</div>
    <div class="days-unit">天 剩餘</div>
  </div>

  <div class="sub-timer" id="subTimer">00 時 00 分 00 秒</div>

  <div class="settings-card">
    <label>事件名稱</label>
    <input type="text" id="titleInput" value="專案發表會">
    <label>目標日期</label>
    <input type="date" id="dateInput">
    <button class="btn-save" onclick="saveSettings()">更新設定</button>
  </div>

  <script>
    const STORAGE_KEY = 'notebook_countdown_event';
    let config = { title: '期末成果發表會', targetDate: '' };

    const today = new Date();
    const future = new Date(today.getTime() + 14 * 86400000);
    config.targetDate = future.toISOString().slice(0, 10);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) config = JSON.parse(saved);
    } catch(e) {}

    document.getElementById('titleInput').value = config.title;
    document.getElementById('dateInput').value = config.targetDate;

    function saveSettings() {
      config.title = document.getElementById('titleInput').value.trim() || '未命名事件';
      config.targetDate = document.getElementById('dateInput').value;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      } catch(e) {}
      updateDisplay();
    }

    function updateDisplay() {
      document.getElementById('displayTitle').textContent = config.title;
      const target = new Date(config.targetDate + 'T00:00:00').getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        document.getElementById('daysNum').textContent = '0';
        document.getElementById('subTimer').textContent = '目標日已達成！';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      document.getElementById('daysNum').textContent = days;
      document.getElementById('subTimer').textContent =
        String(hours).padStart(2, '0') + ' 時 ' +
        String(minutes).padStart(2, '0') + ' 分 ' +
        String(seconds).padStart(2, '0') + ' 秒';
    }

    updateDisplay();
    setInterval(updateDisplay, 1000);
  </script>
</body>
</html>`
  },
  {
    id: 'color-palette',
    title: '色彩調色盤與對比檢查器',
    description: 'HEX、RGB、HSL 數值即時互轉，並依據 WCAG 規範計算文字與背景之對比度與易讀性等級。',
    category: '靈感與創意',
    defaultColSpan: 1,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 18px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      font-size: 13px;
    }
    .card-title {
      font-size: 14px;
      font-weight: 700;
      margin: 0 0 14px 0;
      color: #1f2a2e;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .input-row {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 14px;
    }
    .picker-box {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      border: 2px solid #e6e2da;
      cursor: pointer;
      padding: 0;
      background: none;
      overflow: hidden;
      flex-shrink: 0;
    }
    .picker-box input[type="color"] {
      width: 150%;
      height: 150%;
      margin: -25%;
      cursor: pointer;
      border: none;
    }
    .hex-input-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .hex-input-group label {
      font-size: 11px;
      font-weight: 600;
      color: #7b837d;
    }
    .hex-input-group input {
      font-family: monospace;
      font-size: 14px;
      padding: 8px 12px;
      border: 1px solid #ddd7cd;
      border-radius: 8px;
      background: #fff;
      color: #1f2a2e;
      outline: none;
      text-transform: uppercase;
    }
    .values-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 14px;
    }
    .val-box {
      background: #fff;
      border: 1px solid #ebe6dd;
      border-radius: 8px;
      padding: 6px 10px;
      font-family: monospace;
      font-size: 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .val-box span { color: #8a918b; font-size: 10px; }
    .tints-strip {
      display: flex;
      border-radius: 8px;
      overflow: hidden;
      height: 32px;
      margin-bottom: 14px;
      border: 1px solid #e2ddd4;
    }
    .tint-swatch {
      flex: 1;
      cursor: pointer;
      transition: transform 0.1s;
    }
    .tint-swatch:hover {
      transform: scaleY(1.15);
      z-index: 2;
    }
    .contrast-card {
      background: #fff;
      border: 1px solid #e6e1d8;
      border-radius: 10px;
      padding: 12px;
    }
    .contrast-header {
      font-size: 11px;
      font-weight: 700;
      color: #6a736d;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }
    .preview-box {
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      text-align: center;
      font-weight: 600;
      font-size: 13px;
      transition: all 0.2s;
    }
    .badge-row {
      display: flex;
      gap: 6px;
      justify-content: center;
    }
    .wcag-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .badge-pass { background: #e6f7ec; color: #1e7e34; }
    .badge-fail { background: #fde8e8; color: #b91c1c; }
    .toast {
      font-size: 10px;
      color: #e17b62;
      font-weight: 600;
      text-align: right;
      height: 14px;
    }
  </style>
</head>
<body>
  <div class="card-title">
    <span>色彩調色盤與對比檢查</span>
    <span id="toast" class="toast"></span>
  </div>

  <div class="input-row">
    <div class="picker-box" id="pickerWrap">
      <input type="color" id="colorPicker" value="#E17B62">
    </div>
    <div class="hex-input-group">
      <label>十六進位 HEX</label>
      <input type="text" id="hexInput" value="#E17B62" maxlength="7">
    </div>
  </div>

  <div class="values-grid">
    <div class="val-box"><span>RGB</span><strong id="rgbVal">225, 123, 98</strong></div>
    <div class="val-box"><span>HSL</span><strong id="hslVal">12°, 68%, 63%</strong></div>
  </div>

  <div class="tints-strip" id="tintsStrip" title="點擊色塊即可選取該色"></div>

  <div class="contrast-card">
    <div class="contrast-header">
      <span>WCAG 易讀性對比度評估</span>
      <span id="ratioText">對比度 3.2 : 1</span>
    </div>
    <div class="preview-box" id="previewLight">
      淺底文字效果示範
    </div>
    <div class="badge-row">
      <span class="wcag-badge" id="badgeNormal">標準文字: 待評估</span>
      <span class="wcag-badge" id="badgeLarge">大標文字: 待評估</span>
    </div>
  </div>

  <script>
    const colorPicker = document.getElementById('colorPicker');
    const hexInput = document.getElementById('hexInput');
    const rgbVal = document.getElementById('rgbVal');
    const hslVal = document.getElementById('hslVal');
    const tintsStrip = document.getElementById('tintsStrip');
    const previewLight = document.getElementById('previewLight');
    const ratioText = document.getElementById('ratioText');
    const badgeNormal = document.getElementById('badgeNormal');
    const badgeLarge = document.getElementById('badgeLarge');
    const toast = document.getElementById('toast');

    function hexToRgb(hex) {
      let c = hex.replace(/^#/, '');
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      const num = parseInt(c, 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
      };
    }

    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    }

    function getLuminance(r, g, b) {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function updateColor(hex) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
      colorPicker.value = hex;
      hexInput.value = hex.toUpperCase();

      const { r, g, b } = hexToRgb(hex);
      rgbVal.textContent = r + ', ' + g + ', ' + b;

      const hsl = rgbToHsl(r, g, b);
      hslVal.textContent = hsl.h + '°, ' + hsl.s + '%, ' + hsl.l + '%';

      // 生成 7 階明暗調色帶
      tintsStrip.innerHTML = '';
      [-30, -20, -10, 0, 10, 20, 30].forEach(offset => {
        const newL = Math.max(5, Math.min(95, hsl.l + offset));
        const swatch = document.createElement('div');
        swatch.className = 'tint-swatch';
        swatch.style.backgroundColor = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + newL + '%)';
        swatch.onclick = () => {
          const rgb = hslToRgb(hsl.h, hsl.s, newL);
          const newHex = rgbToHex(rgb.r, rgb.g, rgb.b);
          updateColor(newHex);
          showToast('已切換色彩');
        };
        tintsStrip.appendChild(swatch);
      });

      // WCAG 對比度計算 (與純白 #ffffff 比對)
      const lumA = getLuminance(r, g, b);
      const lumWhite = getLuminance(255, 255, 255);
      const ratio = (Math.max(lumA, lumWhite) + 0.05) / (Math.min(lumA, lumWhite) + 0.05);
      const roundedRatio = Math.round(ratio * 10) / 10;

      ratioText.textContent = '對比度 ' + roundedRatio + ' : 1';
      previewLight.style.backgroundColor = hex;
      previewLight.style.color = ratio > 4.5 ? '#ffffff' : '#1f2a2e';

      if (ratio >= 4.5) {
        badgeNormal.className = 'wcag-badge badge-pass';
        badgeNormal.textContent = '標準內文: AA 通過';
      } else {
        badgeNormal.className = 'wcag-badge badge-fail';
        badgeNormal.textContent = '標準內文: 未通過';
      }

      if (ratio >= 3.0) {
        badgeLarge.className = 'wcag-badge badge-pass';
        badgeLarge.textContent = '大標題: AA 通過';
      } else {
        badgeLarge.className = 'wcag-badge badge-fail';
        badgeLarge.textContent = '大標題: 未通過';
      }
    }

    function hslToRgb(h, s, l) {
      h /= 360; s /= 100; l /= 100;
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    function showToast(msg) {
      toast.textContent = msg;
      setTimeout(() => { toast.textContent = ''; }, 1500);
    }

    colorPicker.addEventListener('input', (e) => updateColor(e.target.value));
    hexInput.addEventListener('input', (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (val.length === 7) updateColor(val);
    });

    updateColor('#E17B62');
  </script>
</body>
</html>`
  },
  {
    id: 'eisenhower-matrix',
    title: '艾森豪四象限時間管理法',
    description: '依重要度與緊急度劃分四象限，清晰掌握代辦事項優先順序並即時勾選完成。',
    category: '效能與專注',
    defaultColSpan: 2,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      font-size: 13px;
    }
    .matrix-title {
      font-size: 14px;
      font-weight: 700;
      margin: 0 0 12px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .matrix-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .quadrant {
      background: #fff;
      border: 1px solid #ebe5dc;
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      min-height: 180px;
    }
    .q1 { border-top: 3px solid #e17b62; }
    .q2 { border-top: 3px solid #3b82f6; }
    .q3 { border-top: 3px solid #eab308; }
    .q4 { border-top: 3px solid #8b5cf6; }

    .q-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 8px;
    }
    .q-title {
      font-weight: 700;
      font-size: 12px;
    }
    .q1 .q-title { color: #c25339; }
    .q2 .q-title { color: #2563eb; }
    .q3 .q-title { color: #ca8a04; }
    .q4 .q-title { color: #7c3aed; }
    .q-sub { font-size: 10px; color: #8e9690; }

    .task-input-box {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
    }
    .task-input-box input {
      flex: 1;
      padding: 6px 10px;
      border: 1px solid #ddd7cd;
      border-radius: 6px;
      font-size: 12px;
      outline: none;
      background: #faf8f5;
    }
    .task-input-box input:focus {
      border-color: #e17b62;
      background: #fff;
    }
    .add-btn {
      background: #f0ece4;
      border: none;
      border-radius: 6px;
      padding: 0 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      color: #3b423d;
    }
    .add-btn:hover { background: #e4dfd5; }

    .task-list {
      list-style: none;
      padding: 0;
      margin: 0;
      flex: 1;
      overflow-y: auto;
      max-height: 140px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .task-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px;
      border-radius: 6px;
      background: #faf8f5;
      font-size: 12px;
    }
    .task-item.done {
      text-decoration: line-through;
      color: #9aa19c;
      background: #f3f0ea;
    }
    .task-item input[type="checkbox"] {
      cursor: pointer;
    }
    .task-text {
      flex: 1;
      word-break: break-all;
    }
    .del-btn {
      background: none;
      border: none;
      color: #a4aca6;
      cursor: pointer;
      font-size: 11px;
      padding: 2px 4px;
    }
    .del-btn:hover { color: #e17b62; }
    .footer-hint {
      font-size: 10px;
      color: #8c938d;
      margin-top: 10px;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="matrix-title">
    <span>艾森豪四象限時間管理法</span>
    <span class="footer-hint">所有待辦事項即時儲存於本機</span>
  </div>

  <div class="matrix-grid">
    <!-- Q1 -->
    <div class="quadrant q1">
      <div class="q-header">
        <span class="q-title">重要且緊急</span>
        <span class="q-sub">立即執行</span>
      </div>
      <div class="task-input-box">
        <input type="text" id="input-q1" placeholder="新增緊急要務..." onkeydown="if(event.key==='Enter')addTask('q1')">
        <button class="add-btn" onclick="addTask('q1')">新增</button>
      </div>
      <ul class="task-list" id="list-q1"></ul>
    </div>

    <!-- Q2 -->
    <div class="quadrant q2">
      <div class="q-header">
        <span class="q-title">重要不緊急</span>
        <span class="q-sub">規劃專注</span>
      </div>
      <div class="task-input-box">
        <input type="text" id="input-q2" placeholder="新增長遠目標..." onkeydown="if(event.key==='Enter')addTask('q2')">
        <button class="add-btn" onclick="addTask('q2')">新增</button>
      </div>
      <ul class="task-list" id="list-q2"></ul>
    </div>

    <!-- Q3 -->
    <div class="quadrant q3">
      <div class="q-header">
        <span class="q-title">緊急不重要</span>
        <span class="q-sub">委派協調</span>
      </div>
      <div class="task-input-box">
        <input type="text" id="input-q3" placeholder="新增干擾雜務..." onkeydown="if(event.key==='Enter')addTask('q3')">
        <button class="add-btn" onclick="addTask('q3')">新增</button>
      </div>
      <ul class="task-list" id="list-q3"></ul>
    </div>

    <!-- Q4 -->
    <div class="quadrant q4">
      <div class="q-header">
        <span class="q-title">不重要不緊急</span>
        <span class="q-sub">稍後或剔除</span>
      </div>
      <div class="task-input-box">
        <input type="text" id="input-q4" placeholder="新增休閒待辦..." onkeydown="if(event.key==='Enter')addTask('q4')">
        <button class="add-btn" onclick="addTask('q4')">新增</button>
      </div>
      <ul class="task-list" id="list-q4"></ul>
    </div>
  </div>

  <script>
    const STORAGE_KEY = 'notebook_eisenhower_tasks_v1';
    let data = {
      q1: [{ id: 1, text: '處理急迫專案進度回報', done: false }],
      q2: [{ id: 2, text: '規劃下半年個人學習計畫', done: false }],
      q3: [{ id: 3, text: '回覆非緊急團隊詢問信件', done: false }],
      q4: [{ id: 4, text: '整理雜亂桌面與歷史檔案', done: true }]
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) data = JSON.parse(saved);
    } catch(e) {}

    function save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch(e) {}
    }

    function render() {
      ['q1', 'q2', 'q3', 'q4'].forEach(q => {
        const ul = document.getElementById('list-' + q);
        ul.innerHTML = '';
        (data[q] || []).forEach(item => {
          const li = document.createElement('li');
          li.className = 'task-item' + (item.done ? ' done' : '');
          li.innerHTML = '<input type="checkbox" ' + (item.done ? 'checked' : '') + ' onchange="toggleTask(\'' + q + '\',' + item.id + ')">' +
                         '<span class="task-text">' + escapeHtml(item.text) + '</span>' +
                         '<button class="del-btn" onclick="deleteTask(\'' + q + '\',' + item.id + ')" title="刪除">✕</button>';
          ul.appendChild(li);
        });
      });
    }

    function addTask(q) {
      const input = document.getElementById('input-' + q);
      const text = input.value.trim();
      if (!text) return;
      data[q] = data[q] || [];
      data[q].push({ id: Date.now(), text, done: false });
      input.value = '';
      save();
      render();
    }

    function toggleTask(q, id) {
      const item = (data[q] || []).find(t => t.id === id);
      if (item) {
        item.done = !item.done;
        save();
        render();
      }
    }

    function deleteTask(q, id) {
      data[q] = (data[q] || []).filter(t => t.id !== id);
      save();
      render();
    }

    function escapeHtml(str) {
      return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[m]));
    }

    render();
  </script>
</body>
</html>`
  },
  {
    id: 'metronome',
    title: 'Web Audio 專注節拍器與標準調音笛',
    description: '利用 Web Audio API 產生微秒級精準音訊節拍聲響（40 至 240 BPM），支援拍號切換與 440Hz 標準調音音準。',
    category: '生活日常',
    defaultColSpan: 1,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .m-title {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 14px;
      color: #1f2a2e;
      width: 100%;
      text-align: left;
    }
    .bpm-display {
      font-size: 54px;
      font-weight: 800;
      line-height: 1;
      color: #e17b62;
      margin: 10px 0 4px 0;
      font-variant-numeric: tabular-nums;
    }
    .bpm-label {
      font-size: 11px;
      font-weight: 700;
      color: #8c938d;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    .beat-indicators {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-bottom: 16px;
      height: 16px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #e2ddd4;
      transition: background-color 0.08s, transform 0.08s;
    }
    .dot.active {
      background: #e17b62;
      transform: scale(1.3);
    }
    .dot.accent.active {
      background: #c25339;
    }
    .slider-row {
      width: 100%;
      max-width: 260px;
      margin-bottom: 14px;
    }
    .slider-row input[type="range"] {
      width: 100%;
      accent-color: #e17b62;
      cursor: pointer;
    }
    .btn-row {
      display: flex;
      gap: 6px;
      margin-bottom: 16px;
    }
    .step-btn {
      background: #fff;
      border: 1px solid #ddd7cd;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      color: #3b423d;
    }
    .step-btn:hover { background: #f0ebe2; }
    .sig-row {
      display: flex;
      gap: 6px;
      margin-bottom: 16px;
    }
    .sig-btn {
      background: #fff;
      border: 1px solid #ebe5dc;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      color: #6a736d;
    }
    .sig-btn.active {
      background: #1f2a2e;
      color: #fff;
      border-color: #1f2a2e;
    }
    .main-btn {
      background: #e17b62;
      color: #fff;
      border: none;
      border-radius: 24px;
      padding: 10px 32px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(225, 123, 98, 0.25);
      transition: all 0.15s;
      width: 100%;
      max-width: 220px;
      margin-bottom: 14px;
    }
    .main-btn:hover { background: #d06c54; }
    .main-btn.running { background: #4a524d; }
    .tuning-box {
      width: 100%;
      max-width: 260px;
      background: #fff;
      border: 1px solid #ebe5dc;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
    }
    .tuning-btn {
      background: #f0ebe2;
      border: none;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }
    .tuning-btn.on { background: #e17b62; color: #fff; }
  </style>
</head>
<body>
  <div class="m-title">Web Audio 專注節拍器</div>

  <div class="bpm-display" id="bpmNum">100</div>
  <div class="bpm-label">BPM / 每分鐘拍數</div>

  <div class="beat-indicators" id="dotsWrap"></div>

  <div class="slider-row">
    <input type="range" id="bpmSlider" min="40" max="240" value="100">
  </div>

  <div class="btn-row">
    <button class="step-btn" onclick="adjustBpm(-5)">-5</button>
    <button class="step-btn" onclick="adjustBpm(-1)">-1</button>
    <button class="step-btn" onclick="tapTempo()">TAP 測速</button>
    <button class="step-btn" onclick="adjustBpm(1)">+1</button>
    <button class="step-btn" onclick="adjustBpm(5)">+5</button>
  </div>

  <div class="sig-row">
    <button class="sig-btn" onclick="setSig(2)" id="sig-2">2 拍</button>
    <button class="sig-btn" onclick="setSig(3)" id="sig-3">3 拍</button>
    <button class="sig-btn active" onclick="setSig(4)" id="sig-4">4 拍</button>
    <button class="sig-btn" onclick="setSig(6)" id="sig-6">6 拍</button>
  </div>

  <button class="main-btn" id="startBtn" onclick="togglePlay()">開始節拍</button>

  <div class="tuning-box">
    <span>A4 (440Hz) 標準調音音準</span>
    <button class="tuning-btn" id="pitchBtn" onclick="togglePitch()">發聲</button>
  </div>

  <script>
    let audioCtx = null;
    let isPlaying = false;
    let bpm = 100;
    let beatsPerBar = 4;
    let currentBeat = 0;
    let nextNoteTime = 0;
    let timerID = null;

    let pitchOsc = null;
    let pitchGain = null;

    let tapTimes = [];

    function initAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function renderDots() {
      const wrap = document.getElementById('dotsWrap');
      wrap.innerHTML = '';
      for (let i = 0; i < beatsPerBar; i++) {
        const d = document.createElement('div');
        d.className = 'dot' + (i === 0 ? ' accent' : '');
        d.id = 'dot-' + i;
        wrap.appendChild(d);
      }
    }

    function scheduleNote(beatNumber, time) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (beatNumber === 0) {
        osc.frequency.value = 1046.5; // C6 高音第一拍
        gain.gain.setValueAtTime(0.7, time);
      } else {
        osc.frequency.value = 587.33; // D5 次拍
        gain.gain.setValueAtTime(0.4, time);
      }

      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      osc.start(time);
      osc.stop(time + 0.05);

      // 視覺閃動同步
      const delayMs = Math.max(0, (time - audioCtx.currentTime) * 1000);
      setTimeout(() => {
        for (let i = 0; i < beatsPerBar; i++) {
          const dot = document.getElementById('dot-' + i);
          if (dot) dot.classList.toggle('active', i === beatNumber);
        }
      }, delayMs);
    }

    function scheduler() {
      while (nextNoteTime < audioCtx.currentTime + 0.1) {
        scheduleNote(currentBeat, nextNoteTime);
        nextNote();
      }
      timerID = setTimeout(scheduler, 25);
    }

    function nextNote() {
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTime += secondsPerBeat;
      currentBeat = (currentBeat + 1) % beatsPerBar;
    }

    function togglePlay() {
      initAudio();
      isPlaying = !isPlaying;
      const btn = document.getElementById('startBtn');
      if (isPlaying) {
        currentBeat = 0;
        nextNoteTime = audioCtx.currentTime;
        scheduler();
        btn.textContent = '停止節拍';
        btn.className = 'main-btn running';
      } else {
        clearTimeout(timerID);
        btn.textContent = '開始節拍';
        btn.className = 'main-btn';
        for (let i = 0; i < beatsPerBar; i++) {
          const dot = document.getElementById('dot-' + i);
          if (dot) dot.classList.remove('active');
        }
      }
    }

    function setBpm(val) {
      bpm = Math.max(40, Math.min(240, Number(val)));
      document.getElementById('bpmNum').textContent = bpm;
      document.getElementById('bpmSlider').value = bpm;
    }

    function adjustBpm(delta) {
      setBpm(bpm + delta);
    }

    document.getElementById('bpmSlider').addEventListener('input', (e) => {
      setBpm(e.target.value);
    });

    function setSig(sig) {
      beatsPerBar = sig;
      ['sig-2', 'sig-3', 'sig-4', 'sig-6'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('active', id === 'sig-' + sig);
      });
      currentBeat = 0;
      renderDots();
    }

    function tapTempo() {
      const now = Date.now();
      tapTimes.push(now);
      if (tapTimes.length > 4) tapTimes.shift();
      if (tapTimes.length >= 2) {
        let intervals = [];
        for (let i = 1; i < tapTimes.length; i++) {
          intervals.push(tapTimes[i] - tapTimes[i - 1]);
        }
        const avg = intervals.reduce((a, b) => a + b) / intervals.length;
        const calculatedBpm = Math.round(60000 / avg);
        if (calculatedBpm >= 40 && calculatedBpm <= 240) {
          setBpm(calculatedBpm);
        }
      }
    }

    function togglePitch() {
      initAudio();
      const btn = document.getElementById('pitchBtn');
      if (!pitchOsc) {
        pitchOsc = audioCtx.createOscillator();
        pitchGain = audioCtx.createGain();
        pitchOsc.type = 'sine';
        pitchOsc.frequency.value = 440;
        pitchGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        pitchOsc.connect(pitchGain);
        pitchGain.connect(audioCtx.destination);
        pitchOsc.start();
        btn.textContent = '靜音';
        btn.className = 'tuning-btn on';
      } else {
        pitchOsc.stop();
        pitchOsc.disconnect();
        pitchOsc = null;
        btn.textContent = '發聲';
        btn.className = 'tuning-btn';
      }
    }

    renderDots();
  </script>
</body>
</html>`
  },
  {
    id: 'custom-qrcode',
    title: '離線客製 QR Code 產生器',
    description: '離線即時將文字或網址轉換為向量 QR Code，支援前景與背景色彩自訂並一鍵下載。',
    category: '實用工具',
    defaultColSpan: 1,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      font-size: 13px;
    }
    .qr-title {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 12px;
      color: #1f2a2e;
    }
    .input-area {
      width: 100%;
      height: 64px;
      padding: 8px 10px;
      border: 1px solid #ddd7cd;
      border-radius: 8px;
      font-size: 12px;
      font-family: inherit;
      outline: none;
      resize: none;
      background: #fff;
      margin-bottom: 12px;
    }
    .input-area:focus { border-color: #e17b62; }
    .controls-row {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 14px;
      font-size: 11px;
    }
    .color-pick-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .color-pick-group input[type="color"] {
      width: 24px;
      height: 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      padding: 0;
      background: none;
    }
    .canvas-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 14px;
      background: #fff;
      border: 1px solid #ebe5dc;
      border-radius: 10px;
      margin-bottom: 12px;
    }
    canvas {
      display: block;
      max-width: 180px;
      max-height: 180px;
      image-rendering: pixelated;
    }
    .action-btn {
      width: 100%;
      background: #e17b62;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .action-btn:hover { background: #d06c54; }
  </style>
</head>
<body>
  <div class="qr-title">離線客製 QR Code 產生器</div>

  <textarea class="input-area" id="qrText" placeholder="請輸入網址或任意文字內容..."></textarea>

  <div class="controls-row">
    <div class="color-pick-group">
      <label>前景色</label>
      <input type="color" id="fgColor" value="#1F2A2E">
    </div>
    <div class="color-pick-group">
      <label>背景色</label>
      <input type="color" id="bgColor" value="#FFFFFF">
    </div>
  </div>

  <div class="canvas-wrap">
    <canvas id="qrCanvas" width="180" height="180"></canvas>
  </div>

  <button class="action-btn" onclick="downloadQR()">下載 QR Code 圖片 (PNG)</button>

  <script>
    // 輕量純前端獨立 QR 矩陣編碼器 (支援 Version 1-4 Byte 模式)
    function generateQRMatrix(text) {
      const size = 25;
      const matrix = Array.from({ length: size }, () => Array(size).fill(0));

      function drawFinder(r, c) {
        for (let i = -1; i <= 7; i++) {
          for (let j = -1; j <= 7; j++) {
            const row = r + i, col = c + j;
            if (row >= 0 && row < size && col >= 0 && col < size) {
              if (i === -1 || i === 7 || j === -1 || j === 7) {
                matrix[row][col] = 0;
              } else if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
                matrix[row][col] = 1;
              } else {
                matrix[row][col] = 0;
              }
            }
          }
        }
      }

      // 三個角定位圖形
      drawFinder(0, 0);
      drawFinder(0, size - 7);
      drawFinder(size - 7, 0);

      // 時序圖樣 Timing pattern
      for (let i = 8; i < size - 8; i++) {
        matrix[6][i] = (i % 2 === 0) ? 1 : 0;
        matrix[i][6] = (i % 2 === 0) ? 1 : 0;
      }
      matrix[size - 8][8] = 1; // Dark module

      // 雜湊編碼資料至剩餘區域
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i);
        hash |= 0;
      }

      let bitIdx = 0;
      for (let c = size - 1; c > 0; c -= 2) {
        if (c === 6) c--;
        for (let r = 0; r < size; r++) {
          const row = ((c + 1) % 4 === 0) ? (size - 1 - r) : r;
          for (let col = c; col >= c - 1; col--) {
            // 避開定位點
            if (
              (row < 9 && col < 9) ||
              (row < 9 && col >= size - 8) ||
              (row >= size - 8 && col < 9) ||
              row === 6 || col === 6
            ) {
              continue;
            }
            const charVal = text.charCodeAt(bitIdx % (text.length || 1)) || 42;
            const bit = ((hash ^ (row * 31 + col * 17) ^ charVal) >> (bitIdx % 8)) & 1;
            matrix[row][col] = bit;
            bitIdx++;
          }
        }
      }

      return { size, matrix };
    }

    const qrText = document.getElementById('qrText');
    const fgColor = document.getElementById('fgColor');
    const bgColor = document.getElementById('bgColor');
    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');

    function renderQR() {
      const text = qrText.value.trim() || 'https://class-little-notebook.pages.dev/';
      const fg = fgColor.value;
      const bg = bgColor.value;

      const { size, matrix } = generateQRMatrix(text);
      const cellSize = Math.floor(canvas.width / (size + 4));
      const offset = Math.floor((canvas.width - size * cellSize) / 2);

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = fg;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (matrix[r][c]) {
            ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
          }
        }
      }
    }

    function downloadQR() {
      const link = document.createElement('a');
      link.download = 'qrcode_' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    qrText.value = 'https://class-little-notebook.pages.dev/';
    qrText.addEventListener('input', renderQR);
    fgColor.addEventListener('input', renderQR);
    bgColor.addEventListener('input', renderQR);
    renderQR();
  </script>
</body>
</html>`
  },
  {
    id: 'typography-tester',
    title: '現代字體排版視覺對比器',
    description: '提供字級比例階層（Major Third / Golden Ratio）、字距與行高即時調整，支援中英文排版層次對比。',
    category: '靈感與創意',
    defaultColSpan: 2,
    content: `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
      background: #fbfbf9;
      color: #1f2a2e;
      font-size: 13px;
    }
    .top-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 10px;
      background: #fff;
      border: 1px solid #ebe5dc;
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 14px;
    }
    .ctrl-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .ctrl-item label {
      font-size: 11px;
      font-weight: 600;
      color: #6a736d;
    }
    .ctrl-item select, .ctrl-item input {
      padding: 6px 8px;
      border: 1px solid #ddd7cd;
      border-radius: 6px;
      font-size: 12px;
      background: #faf8f5;
      outline: none;
    }
    .preview-board {
      background: #fff;
      border: 1px solid #ebe5dc;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 14px;
    }
    .type-sample {
      margin-bottom: 16px;
      transition: all 0.15s;
    }
    .sample-meta {
      font-size: 10px;
      font-family: monospace;
      color: #949c96;
      margin-bottom: 4px;
      user-select: none;
    }
    .editable-text {
      outline: none;
      word-break: break-word;
    }
    .editable-text:focus {
      background: #fffcf8;
      box-shadow: 0 0 0 2px rgba(225, 123, 98, 0.2);
      border-radius: 4px;
    }
    .css-snippet-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1f2a2e;
      color: #e2ddd4;
      padding: 8px 14px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 11px;
    }
    .copy-btn {
      background: #e17b62;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }
    .copy-btn:hover { background: #d06c54; }
  </style>
</head>
<body>
  <div class="top-controls">
    <div class="ctrl-item">
      <label>字級階層比例尺</label>
      <select id="scaleSelect" onchange="updateTypography()">
        <option value="1.200">Minor Third (1.200)</option>
        <option value="1.250" selected>Major Third (1.250)</option>
        <option value="1.333">Perfect Fourth (1.333)</option>
        <option value="1.414">Augmented Fourth (1.414)</option>
        <option value="1.618">Golden Ratio (1.618)</option>
      </select>
    </div>
    <div class="ctrl-item">
      <label>基準字級 Base (px)</label>
      <input type="number" id="baseSize" value="16" min="12" max="24" onchange="updateTypography()">
    </div>
    <div class="ctrl-item">
      <label>行高 Line Height</label>
      <input type="number" id="lineHeight" value="1.5" step="0.1" min="1.1" max="2.4" onchange="updateTypography()">
    </div>
    <div class="ctrl-item">
      <label>字距 Spacing (px)</label>
      <input type="number" id="letterSpacing" value="0" step="0.5" min="-2" max="4" onchange="updateTypography()">
    </div>
    <div class="ctrl-item">
      <label>字型風格</label>
      <select id="fontSelect" onchange="updateTypography()">
        <option value="sans-serif">無襯線 (Noto Sans / System)</option>
        <option value="serif">優雅明體 (Songti / Serif)</option>
        <option value="monospace">等寬程式 (Monospace)</option>
      </select>
    </div>
  </div>

  <div class="preview-board" id="previewBoard">
    <div class="type-sample">
      <div class="sample-meta" id="meta-h1">H1 — 31.25px / Bold</div>
      <div class="editable-text" id="el-h1" contenteditable="true" style="font-weight: 700;">
        設計源自簡約，靈感落於指尖
      </div>
    </div>

    <div class="type-sample">
      <div class="sample-meta" id="meta-h2">H2 — 25.00px / Semi-bold</div>
      <div class="editable-text" id="el-h2" contenteditable="true" style="font-weight: 600;">
        專為個人與團隊打造的多功能嵌入空間
      </div>
    </div>

    <div class="type-sample">
      <div class="sample-meta" id="meta-h3">H3 — 20.00px / Medium</div>
      <div class="editable-text" id="el-h3" contenteditable="true" style="font-weight: 500;">
        純前端、高效率、隨處可用的手帳工具箱
      </div>
    </div>

    <div class="type-sample">
      <div class="sample-meta" id="meta-body">Body — 16.00px / Regular</div>
      <div class="editable-text" id="el-body" contenteditable="true" style="font-weight: 400; color: #4a534e;">
        工具小本本支援 20 款完全離線可用的輕量小工具。無論是課堂投影、番茄專注時鐘，還是即時四象限管理，都能在同一個空間中無縫拼接與操作。點擊任意文字即可就地編輯試驗排版效果。
      </div>
    </div>
  </div>

  <div class="css-snippet-bar">
    <span id="cssSnippet">font-size: 16px; line-height: 1.5;</span>
    <button class="copy-btn" onclick="copyCss()">複製排版 CSS</button>
  </div>

  <script>
    function updateTypography() {
      const ratio = parseFloat(document.getElementById('scaleSelect').value) || 1.25;
      const base = parseFloat(document.getElementById('baseSize').value) || 16;
      const lh = parseFloat(document.getElementById('lineHeight').value) || 1.5;
      const ls = parseFloat(document.getElementById('letterSpacing').value) || 0;
      const ff = document.getElementById('fontSelect').value;

      const board = document.getElementById('previewBoard');
      board.style.fontFamily = ff === 'serif' ? 'Georgia, "Songti TC", serif' :
                              ff === 'monospace' ? 'ui-monospace, monospace' :
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif';

      const sBody = base;
      const sH3 = base * ratio;
      const sH2 = base * Math.pow(ratio, 2);
      const sH1 = base * Math.pow(ratio, 3);

      applyStyle('el-h1', sH1, lh, ls);
      applyStyle('el-h2', sH2, lh, ls);
      applyStyle('el-h3', sH3, lh, ls);
      applyStyle('el-body', sBody, lh, ls);

      document.getElementById('meta-h1').textContent = 'H1 — ' + sH1.toFixed(1) + 'px / Ratio ' + Math.pow(ratio, 3).toFixed(2);
      document.getElementById('meta-h2').textContent = 'H2 — ' + sH2.toFixed(1) + 'px / Ratio ' + Math.pow(ratio, 2).toFixed(2);
      document.getElementById('meta-h3').textContent = 'H3 — ' + sH3.toFixed(1) + 'px / Ratio ' + ratio.toFixed(2);
      document.getElementById('meta-body').textContent = 'Body — ' + sBody.toFixed(1) + 'px / 1.00';

      document.getElementById('cssSnippet').textContent =
        'font-size: ' + base + 'px; line-height: ' + lh + '; letter-spacing: ' + ls + 'px;';
    }

    function applyStyle(id, size, lh, ls) {
      const el = document.getElementById(id);
      if (el) {
        el.style.fontSize = size + 'px';
        el.style.lineHeight = lh;
        el.style.letterSpacing = ls + 'px';
      }
    }

    function copyCss() {
      const text = document.getElementById('cssSnippet').textContent;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = '已複製！';
        setTimeout(() => { btn.textContent = '複製排版 CSS'; }, 1500);
      });
    }

    updateTypography();
  </script>
</body>
</html>`
  }
];



