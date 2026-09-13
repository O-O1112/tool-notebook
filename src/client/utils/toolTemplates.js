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
  }
];

