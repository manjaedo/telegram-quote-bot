const fs = require('fs');
const path = require('path');

const quotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'quotes_1000.json'), 'utf8'));
const codeGsTemplate = fs.readFileSync(path.join(__dirname, 'Code.gs'), 'utf8');

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>📬 1,000 명언 & 사자성어 텔레그램 푸시 봇 (서버리스)</title>
  <style>
    :root {
      --bg: #0f172a;
      --card: #1e293b;
      --card-hover: #26354d;
      --border: #334155;
      --text: #f8fafc;
      --muted: #94a3b8;
      --accent: #38bdf8;
      --accent-dark: #0284c7;
      --green: #22c55e;
      --amber: #f59e0b;
      --purple: #a855f7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Pretendard', 'Malgun Gothic', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 24px 16px 60px;
    }
    .container { max-width: 1040px; margin: 0 auto; }
    header {
      text-align: center;
      margin-bottom: 28px;
      padding: 28px 20px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid var(--border);
      border-radius: 16px;
    }
    header h1 { font-size: 1.75rem; margin-bottom: 8px; }
    header p { color: var(--muted); font-size: 0.95rem; }
    .badges { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 14px; }
    .badge {
      font-size: 0.8rem;
      padding: 4px 12px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.12);
      color: var(--accent);
      border: 1px solid rgba(56, 189, 248, 0.3);
      font-weight: 600;
    }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    @media (max-width: 820px) { .grid { grid-template-columns: 1fr; } }
    .panel {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 22px;
    }
    .panel h2 { font-size: 1.15rem; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 0.85rem; color: var(--muted); margin-bottom: 6px; font-weight: 600; }
    .input-row { display: flex; gap: 8px; }
    input[type="text"], input[type="number"], select {
      width: 100%;
      padding: 10px 12px;
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-size: 0.92rem;
    }
    input:focus, select:focus { outline: none; border-color: var(--accent); }
    button {
      cursor: pointer;
      border: none;
      border-radius: 8px;
      padding: 10px 16px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      white-space: nowrap;
    }
    .btn-primary { background: var(--accent); color: #0f172a; }
    .btn-primary:hover { background: #7dd3fc; }
    .btn-green { background: var(--green); color: #052e16; }
    .btn-green:hover { background: #4ade80; }
    .btn-secondary { background: #334155; color: var(--text); }
    .btn-secondary:hover { background: #475569; }
    .btn-full { width: 100%; margin-top: 6px; padding: 12px; font-size: 0.95rem; }
    .preview-phone {
      background: #0e1621;
      border: 1px solid #2b5278;
      border-radius: 12px;
      padding: 16px;
      margin-top: 12px;
      font-size: 0.93rem;
      white-space: pre-wrap;
      line-height: 1.65;
      color: #e2e8f0;
      position: relative;
    }
    .preview-tag {
      display: inline-block;
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 6px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .tag-en { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
    .tag-hanja { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .status-box {
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 0.86rem;
      display: none;
    }
    .status-ok { display: block; background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.4); color: #86efac; }
    .status-err { display: block; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; }
    .steps { list-style: none; counter-reset: step; }
    .steps li {
      position: relative;
      padding-left: 34px;
      margin-bottom: 12px;
      font-size: 0.9rem;
      color: #cbd5e1;
    }
    .steps li::before {
      counter-increment: step;
      content: counter(step);
      position: absolute;
      left: 0;
      top: 1px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(56, 189, 248, 0.2);
      color: var(--accent);
      font-weight: 700;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .filter-bar { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
    .filter-bar input { flex: 1; min-width: 200px; }
    .filter-bar select { width: 170px; }
    .quote-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-height: 520px; overflow-y: auto; padding-right: 4px; }
    @media (max-width: 760px) { .quote-list { grid-template-columns: 1fr; } }
    .quote-item {
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .quote-item:hover { border-color: var(--accent); }
    .quote-item .q-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.78rem; color: var(--muted); }
    .quote-item .q-orig { font-weight: 700; font-size: 0.96rem; margin-bottom: 6px; color: #f1f5f9; }
    .quote-item .q-ko { font-size: 0.88rem; color: #cbd5e1; margin-bottom: 6px; }
    .quote-item .q-auth { font-size: 0.8rem; color: var(--accent); font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📬 1,000 명언 & 사자성어 텔레그램 푸시 봇</h1>
      <p>서버 없이 Google 스프레드시트 + Apps Script로 매일 아침·저녁 핸드폰 텔레그램에 명언을 쏴주는 컨트롤러</p>
      <div class="badges">
        <span class="badge">총 1,000개 수록</span>
        <span class="badge">🇺🇸🇰🇷 영어+한국어 동시 표기 500개</span>
        <span class="badge">🀄💡 한자 사자성어·고전명언 500개</span>
        <span class="badge">⏰ 매일 아침/저녁 무서버 자동 발송</span>
      </div>
    </header>

    <div class="grid">
      <!-- 왼쪽: 텔레그램 설정 & 즉시 푸시 테스트 -->
      <div class="panel">
        <h2>⚙️ 1. 텔레그램 봇 연결 및 즉시 테스트</h2>
        <div class="field">
          <label>텔레그램 Bot Token (@BotFather에서 발급)</label>
          <input type="text" id="botToken" placeholder="예: 1234567890:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw" />
        </div>
        <div class="field">
          <label>내 텔레그램 Chat ID (모르면 우측 '자동 조회' 클릭)</label>
          <div class="input-row">
            <input type="text" id="chatId" placeholder="예: 987654321" />
            <button class="btn-secondary" onclick="lookupChatId()">🔍 자동 조회</button>
          </div>
        </div>
        <div class="field">
          <label>아침 / 저녁 알림 시간 설정 (0~23시)</label>
          <div class="input-row">
            <input type="number" id="morningHour" value="8" min="0" max="23" title="아침 알림 시간" />
            <input type="number" id="eveningHour" value="21" min="0" max="23" title="저녁 알림 시간" />
          </div>
        </div>
        <button class="btn-green btn-full" onclick="sendTestTelegram()">🚀 지금 선택된 명언을 내 핸드폰 텔레그램으로 쏘기!</button>
        <button class="btn-primary btn-full" onclick="copyConfiguredCodeGs()">📋 내 토큰이 적용된 Google Apps Script(Code.gs) 복사</button>
        <div id="statusBox" class="status-box"></div>

        <h2 style="margin-top: 22px; margin-bottom: 10px;">📖 3분 완성! 구글 시트 서버리스 연동법</h2>
        <ol class="steps">
          <li>구글 스프레드시트 새 문서를 열고 <b>[파일 → 가져오기 → 업로드]</b>에서 폴더 안의 <code>quotes_1000.csv</code> 파일을 업로드합니다.</li>
          <li>상단 메뉴 <b>[확장 프로그램 → Apps Script]</b>를 클릭합니다.</li>
          <li>위 <b>[📋 내 토큰이 적용된 Code.gs 복사]</b> 버튼을 눌러 복사한 코드를 붙여넣고 저장(Ctrl+S)합니다.</li>
          <li>상단 함수 선택창에서 <code>setupMorningEveningTriggers</code>를 선택하고 <b>[실행]</b>을 누르면 매일 아침·저녁 자동 푸시 알림 설정 끝!</li>
        </ol>
      </div>

      <!-- 오른쪽: 랜덤 명언 미리보기 -->
      <div class="panel">
        <h2>📱 2. 핸드폰 텔레그램 푸시 알림 미리보기</h2>
        <div style="display:flex; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
          <button class="btn-primary" onclick="pickRandom('ALL')">🎲 전체 랜덤 뽑기</button>
          <button class="btn-secondary" onclick="pickRandom('영어명언')">🇺🇸 영어+한국어 명언 뽑기</button>
          <button class="btn-secondary" onclick="pickRandom('사자성어')">🀄 사자성어·한자 뽑기</button>
          <button class="btn-secondary" onclick="toggleSlot()" id="slotBtn">🌅 아침 알림 포맷</button>
        </div>
        <div id="telegramPreview" class="preview-phone"></div>
      </div>
    </div>

    <!-- 하단: 1,000개 전체 명언 검색 및 탐색 -->
    <div class="panel">
      <h2>📚 3. 수록된 1,000개 명언 & 사자성어 전체 보기 (클릭하면 미리보기에 적용)</h2>
      <div class="filter-bar">
        <input type="text" id="searchInput" placeholder="명언 내용, 영어, 한자, 사자성어 독음, 인물 이름으로 검색..." oninput="renderList()" />
        <select id="categoryFilter" onchange="renderList()">
          <option value="ALL">전체 구분 (1,000개)</option>
          <option value="영어명언">🇺🇸 영어+한국어 명언 (500개)</option>
          <option value="사자성어">🀄 사자성어 (442개)</option>
          <option value="한자명언">📜 한자 고전명언 (58개)</option>
        </select>
      </div>
      <div id="quoteList" class="quote-list"></div>
    </div>
  </div>

  <script>
    const QUOTES = ${JSON.stringify(quotes)};
    const CODE_GS_TEMPLATE = ${JSON.stringify(codeGsTemplate)};
    let currentQuote = QUOTES[0];
    let currentSlot = 'MORNING';

    // 저장된 로컬 설정 불러오기
    window.addEventListener('DOMContentLoaded', () => {
      const savedToken = localStorage.getItem('tg_bot_token') || '';
      const savedChat = localStorage.getItem('tg_chat_id') || '';
      if (savedToken) document.getElementById('botToken').value = savedToken;
      if (savedChat) document.getElementById('chatId').value = savedChat;
      pickRandom('ALL');
      renderList();
    });

    function showStatus(msg, isError) {
      const box = document.getElementById('statusBox');
      box.className = 'status-box ' + (isError ? 'status-err' : 'status-ok');
      box.innerText = msg;
    }

    function toggleSlot() {
      currentSlot = currentSlot === 'MORNING' ? 'EVENING' : 'MORNING';
      document.getElementById('slotBtn').innerText = currentSlot === 'MORNING' ? '🌅 아침 알림 포맷' : '🌙 저녁 알림 포맷';
      updatePreview();
    }

    function pickRandom(filterCat) {
      const pool = filterCat === 'ALL'
        ? QUOTES
        : QUOTES.filter(q => filterCat === '사자성어' ? (q.category === '사자성어' || q.category === '한자명언') : q.category === filterCat);
      currentQuote = pool[Math.floor(Math.random() * pool.length)];
      updatePreview();
    }

    function selectQuoteById(id) {
      const found = QUOTES.find(q => q.id === id);
      if (found) {
        currentQuote = found;
        updatePreview();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function escapeHtml(str) {
      return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function formatTelegramHtml(q, slot) {
      const isHanja = q.category.includes('사자성어') || q.category.includes('한자');
      const typeLabel = isHanja ? q.category : '오늘의 명언';
      const headerIcon = slot === 'MORNING' ? '🌅' : '🌙';
      const timeLabel = slot === 'MORNING' ? '오늘 아침의' : '오늘 저녁의';

      const lines = [];
      lines.push('<b>' + headerIcon + ' [' + timeLabel + ' ' + escapeHtml(typeLabel) + '] #' + escapeHtml(q.id) + '</b>');
      lines.push('━━━━━━━━━━━━━━━━━━');

      if (isHanja) {
        lines.push('🀄 <b>' + escapeHtml(q.original) + '</b>');
        lines.push('');
        lines.push('💡 <b>한국어 풀이</b>');
        lines.push(escapeHtml(q.korean));
        if (q.note) {
          lines.push('');
          lines.push('📝 <b>한자·상세 해설</b>');
          lines.push('<i>' + escapeHtml(q.note) + '</i>');
        }
        lines.push('');
        lines.push('📚 <b>출전/인물:</b> ' + escapeHtml(q.author));
      } else {
        lines.push('🇺🇸 <b>"' + escapeHtml(q.original) + '"</b>');
        lines.push('');
        lines.push('🇰🇷 "' + escapeHtml(q.korean) + '"');
        lines.push('');
        lines.push('✍️ <b>— ' + escapeHtml(q.author) + '</b>');
        if (q.note && q.note !== '세계 명언') {
          lines.push('📖 <i>' + escapeHtml(q.note) + '</i>');
        }
      }
      return lines.join('\\n');
    }

    function updatePreview() {
      const box = document.getElementById('telegramPreview');
      box.innerHTML = formatTelegramHtml(currentQuote, currentSlot);
    }

    async function lookupChatId() {
      const token = document.getElementById('botToken').value.trim();
      if (!token) {
        showStatus('❌ 먼저 Bot Token을 입력해 주세요!', true);
        return;
      }
      localStorage.setItem('tg_bot_token', token);
      showStatus('🔍 텔레그램 서버에서 Chat ID를 조회 중입니다...', false);
      try {
        const res = await fetch('https://api.telegram.org/bot' + token + '/getUpdates');
        const data = await res.json();
        if (!data.ok) {
          showStatus('❌ 토큰 오류: ' + data.description, true);
          return;
        }
        const results = data.result || [];
        if (results.length === 0) {
          showStatus('⚠️ 아직 봇에게 보낸 메시지가 없습니다. 핸드폰 텔레그램에서 생성한 봇에게 "안녕"이라고 한 번 메시지를 보낸 뒤 다시 눌러주세요!', true);
          return;
        }
        const last = results[results.length - 1];
        const chat = (last.message && last.message.chat) || (last.my_chat_member && last.my_chat_member.chat);
        if (chat && chat.id) {
          document.getElementById('chatId').value = chat.id;
          localStorage.setItem('tg_chat_id', String(chat.id));
          showStatus('✅ Chat ID 자동 조회 성공! (' + chat.id + ' - ' + (chat.first_name || '') + ')', false);
        } else {
          showStatus('⚠️ Chat ID를 찾을 수 없습니다. 봇에게 일반 채팅 메시지를 한 번 보내주세요.', true);
        }
      } catch (e) {
        showStatus('❌ 네트워크 오류: ' + e.message, true);
      }
    }

    async function sendTestTelegram() {
      const token = document.getElementById('botToken').value.trim();
      const chatId = document.getElementById('chatId').value.trim();
      if (!token || !chatId) {
        showStatus('❌ Bot Token과 Chat ID를 모두 입력해 주세요! (Chat ID를 모르시면 [자동 조회] 버튼을 누르세요)', true);
        return;
      }
      localStorage.setItem('tg_bot_token', token);
      localStorage.setItem('tg_chat_id', chatId);

      showStatus('🚀 핸드폰 텔레그램으로 푸시 알림을 발송 중입니다...', false);
      try {
        const res = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: formatTelegramHtml(currentQuote, currentSlot),
            parse_mode: 'HTML',
            disable_web_page_preview: true
          })
        });
        const data = await res.json();
        if (data.ok) {
          showStatus('✅ 핸드폰 텔레그램으로 명언 푸시 발송 성공! (#' + currentQuote.id + ' ' + currentQuote.author + ')', false);
        } else {
          showStatus('❌ 발송 실패: ' + data.description, true);
        }
      } catch (e) {
        showStatus('❌ 네트워크 오류: ' + e.message, true);
      }
    }

    function copyConfiguredCodeGs() {
      const token = document.getElementById('botToken').value.trim() || '여기에_봇_토큰을_입력하세요';
      const chatId = document.getElementById('chatId').value.trim() || '여기에_챗_ID를_입력하세요';
      const mHour = Number(document.getElementById('morningHour').value) || 8;
      const eHour = Number(document.getElementById('eveningHour').value) || 21;

      const customized = CODE_GS_TEMPLATE
        .replace('여기에_봇_토큰을_입력하세요', token)
        .replace('여기에_챗_ID를_입력하세요', chatId)
        .replace('MORNING_HOUR: 8', 'MORNING_HOUR: ' + mHour)
        .replace('EVENING_HOUR: 21', 'EVENING_HOUR: ' + eHour);

      navigator.clipboard.writeText(customized).then(() => {
        showStatus('📋 입력하신 Bot Token, Chat ID, 알림 시간(' + mHour + '시/' + eHour + '시)이 포함된 Code.gs 코드가 클립보드에 복사되었습니다! 구글 시트의 [확장 프로그램 > Apps Script]에 바로 붙여넣으세요.', false);
      });
    }

    function renderList() {
      const q = document.getElementById('searchInput').value.trim().toLowerCase();
      const cat = document.getElementById('categoryFilter').value;
      const container = document.getElementById('quoteList');

      const filtered = QUOTES.filter(item => {
        if (cat !== 'ALL' && item.category !== cat) return false;
        if (!q) return true;
        return item.original.toLowerCase().includes(q)
          || item.korean.toLowerCase().includes(q)
          || item.author.toLowerCase().includes(q)
          || item.note.toLowerCase().includes(q);
      }).slice(0, 120); // 빠른 렌더링을 위해 상위 120개 표시

      container.innerHTML = filtered.map(item => {
        const isHanja = item.category !== '영어명언';
        return '<div class="quote-item" onclick="selectQuoteById(' + item.id + ')">'
          + '<div class="q-head"><span>#' + item.id + '</span><span class="preview-tag ' + (isHanja ? 'tag-hanja' : 'tag-en') + '">' + escapeHtml(item.category) + '</span></div>'
          + '<div class="q-orig">' + escapeHtml(item.original) + '</div>'
          + '<div class="q-ko">' + escapeHtml(item.korean) + '</div>'
          + '<div class="q-auth">— ' + escapeHtml(item.author) + '</div>'
          + '</div>';
      }).join('');
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('Generated index.html successfully!');
