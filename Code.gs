/**
 * ============================================================================
 * 📬 서버리스 텔레그램 1,000 명언 & 사자성어 푸시 알림 봇 (Google Apps Script)
 * ============================================================================
 *
 * [필수 설정] 아래 두 가지 값만 본인의 텔레그램 봇 정보로 변경하세요!
 * (Chat ID를 모르신다면 BOT_TOKEN만 먼저 입력 후, `findMyChatId` 함수를 실행하면 알려줍니다)
 */
const CONFIG = {
  TELEGRAM_BOT_TOKEN: '여기에_봇_토큰을_입력하세요', // 예: '1234567890:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw'
  TELEGRAM_CHAT_ID: '여기에_챗_ID를_입력하세요',     // 예: '987654321' (숫자로 된 본인 ID)
  MORNING_HOUR: 8,   // 아침 알림 시간 (0~23시 기준, 기본값: 오전 8시)
  EVENING_HOUR: 21,  // 저녁 알림 시간 (0~23시 기준, 기본값: 오후 9시)
  SHEET_NAME: '명언1000' // 데이터를 읽어올 시트 탭 이름 (없으면 현재 활성 시트 사용)
};

/**
 * 구글 스프레드시트를 열 때 상단 메뉴바에 [📬 텔레그램 명언 봇] 메뉴를 자동으로 추가합니다.
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('📬 텔레그램 명언 봇')
      .addItem('🚀 1. 지금 즉시 테스트 발송하기', 'sendRandomQuoteNow')
      .addSeparator()
      .addItem('⏰ 2. 아침(8시)·저녁(21시) 자동 알림 켜기', 'setupMorningEveningTriggers')
      .addItem('🛑 3. 자동 알림 모두 끄기', 'removeAllTriggers')
      .addSeparator()
      .addItem('🔍 4. 내 텔레그램 Chat ID 자동 조회', 'findMyChatId')
      .addItem('📥 5. 시트에 1,000개 명언 자동 채우기 (QuotesData.gs 필요)', 'populateSheetWith1000Quotes')
      .addItem('🔄 6. 발송 횟수 전체 초기화', 'resetSentCounts')
      .addToUi();
  } catch (e) {
    Logger.log('메뉴 생성 생략 (독립 실행 모드): ' + e.message);
  }
}

/**
 * [수동/즉시 테스트용] 지금 바로 랜덤 명언 1개를 뽑아 텔레그램으로 발송합니다.
 */
function sendRandomQuoteNow() {
  sendQuoteByTimeSlot_('TEST');
}

/**
 * [아침 스케줄러용] 매일 아침 트리거가 자동 실행하는 함수입니다.
 */
function sendMorningQuote() {
  sendQuoteByTimeSlot_('MORNING');
}

/**
 * [저녁 스케줄러용] 매일 저녁 트리거가 자동 실행하는 함수입니다.
 */
function sendEveningQuote() {
  sendQuoteByTimeSlot_('EVENING');
}

/**
 * 매일 아침(오전 8시)과 저녁(오후 9시) 두 번 실행되는 자동 타이머 트리거를 등록합니다.
 * 한 번만 실행해 두면 구글 서버가 매일 자동으로 명언을 발송합니다.
 */
function setupMorningEveningTriggers() {
  // 기존에 등록된 중복 트리거가 있다면 먼저 정리
  removeAllTriggers(true);

  // 1. 아침 알림 트리거 등록
  ScriptApp.newTrigger('sendMorningQuote')
    .timeBased()
    .everyDays(1)
    .atHour(CONFIG.MORNING_HOUR)
    .create();

  // 2. 저녁 알림 트리거 등록
  ScriptApp.newTrigger('sendEveningQuote')
    .timeBased()
    .everyDays(1)
    .atHour(CONFIG.EVENING_HOUR)
    .create();

  const msg = '✅ 아침(' + CONFIG.MORNING_HOUR + '시) 및 저녁(' + CONFIG.EVENING_HOUR + '시) 자동 푸시 알림 스케줄러 등록이 완료되었습니다!';
  Logger.log(msg);
  notifyUser_(msg);
}

/**
 * 등록된 모든 자동 발송 트리거를 해제합니다.
 */
function removeAllTriggers(silent) {
  const triggers = ScriptApp.getProjectTriggers();
  let removed = 0;
  for (let i = 0; i < triggers.length; i++) {
    const fn = triggers[i].getHandlerFunction();
    if (fn === 'sendMorningQuote' || fn === 'sendEveningQuote' || fn === 'sendRandomQuoteNow') {
      ScriptApp.deleteTrigger(triggers[i]);
      removed++;
    }
  }
  if (!silent) {
    const msg = '🛑 자동 알림 트리거 ' + removed + '개를 모두 해제했습니다.';
    Logger.log(msg);
    notifyUser_(msg);
  }
}

/**
 * 봇에게 아무 메시지나 보낸 뒤 이 함수를 실행하면, 본인의 TELEGRAM_CHAT_ID를 찾아서 알려줍니다.
 */
function findMyChatId() {
  const token = getBotToken_();
  if (!token || token.indexOf('여기에_') !== -1) {
    notifyUser_('❌ 먼저 코드 상단의 CONFIG.TELEGRAM_BOT_TOKEN에 봇 토큰을 입력해 주세요.');
    return;
  }

  const url = 'https://api.telegram.org/bot' + token + '/getUpdates';
  const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const json = JSON.parse(res.getContentText());

  if (!json.ok) {
    notifyUser_('❌ 토큰 오류: ' + json.description);
    return;
  }

  const results = json.result || [];
  if (results.length === 0) {
    notifyUser_('⚠️ 아직 봇에게 도착한 메시지가 없습니다.\n먼저 텔레그램 앱에서 본인이 만든 봇에게 "안녕"이라고 메시지를 한 번 보낸 뒤 다시 실행해 주세요!');
    return;
  }

  const lastMsg = results[results.length - 1];
  const chat = (lastMsg.message && lastMsg.message.chat) || (lastMsg.my_chat_member && lastMsg.my_chat_member.chat);
  if (!chat) {
    notifyUser_('⚠️ Chat ID를 찾을 수 없습니다. 봇에게 일반 텍스트 메시지를 한 번 보내주세요.');
    return;
  }

  // 스크립트 속성에도 자동 저장하여 바로 쓸 수 있게 지원
  PropertiesService.getScriptProperties().setProperty('AUTO_CHAT_ID', String(chat.id));

  const info = '✅ 회원님의 텔레그램 Chat ID를 찾았습니다!\n\n'
    + '👉 Chat ID: ' + chat.id + '\n'
    + '👉 이름: ' + (chat.first_name || '') + ' ' + (chat.last_name || '') + '\n\n'
    + '코드 상단의 TELEGRAM_CHAT_ID에 "' + chat.id + '"를 입력해 두거나 그대로 사용하시면 됩니다.';
  Logger.log(info);
  notifyUser_(info);
}

/**
 * QuotesData.gs 파일이 함께 추가되어 있는 경우, 시트에 1,000개의 명언을 한 번에 채워 넣습니다.
 */
function populateSheetWith1000Quotes() {
  if (typeof getInitialQuotesData_ !== 'function') {
    notifyUser_('ℹ️ QuotesData.gs 파일이 없거나 CSV 업로드 방식을 사용 중입니다.\nCSV 파일을 [파일 > 가져오기 > 업로드]로 불러오셨다면 이 함수를 실행할 필요가 없습니다.');
    return;
  }

  const sheet = getTargetSheet_();
  const rows = getInitialQuotesData_();
  const headers = [['번호', '구분', '원문_또는_한자', '한국어_번역_뜻풀이', '인물_출전', '상세풀이_비고', '발송횟수', '최근발송일시']];

  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers[0].length).setValues(headers).setFontWeight('bold').setBackground('#f3f4f6');
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  sheet.setFrozenRows(1);

  const msg = '✅ 총 ' + rows.length + '개의 명언·사자성어 데이터를 시트에 성공적으로 채웠습니다!';
  Logger.log(msg);
  notifyUser_(msg);
}

/**
 * 시트의 발송횟수(G열)와 최근발송일시(H열)를 모두 0으로 초기화합니다.
 */
function resetSentCounts() {
  const sheet = getTargetSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    notifyUser_('⚠️ 시트에 명언 데이터가 없습니다.');
    return;
  }
  const numRows = lastRow - 1;
  const zeros = [];
  for (let i = 0; i < numRows; i++) {
    zeros.push([0, '']);
  }
  sheet.getRange(2, 7, numRows, 2).setValues(zeros);
  const msg = '🔄 전체 ' + numRows + '개 명언의 발송 횟수를 0으로 초기화했습니다.';
  Logger.log(msg);
  notifyUser_(msg);
}

/**
 * ============================================================================
 * 내부 핵심 로직 (랜덤 추첨, 포맷팅, 텔레그램 API 호출)
 * ============================================================================
 */
function sendQuoteByTimeSlot_(slot) {
  const sheet = getTargetSheet_();
  let lastRow = sheet.getLastRow();

  // 시트가 비어있는데 QuotesData.gs가 있다면 자동으로 1,000개 세팅
  if (lastRow < 2 && typeof getInitialQuotesData_ === 'function') {
    populateSheetWith1000Quotes();
    lastRow = sheet.getLastRow();
  }

  if (lastRow < 2) {
    throw new Error('시트에 명언 데이터가 없습니다. quotes_1000.csv 파일을 시트에 가져오거나 populateSheetWith1000Quotes()를 먼저 실행해 주세요.');
  }

  // 전체 데이터 읽기 (2행 ~ 마지막 행, A열~H열 총 8개 컬럼)
  const numRows = lastRow - 1;
  const dataRange = sheet.getRange(2, 1, numRows, 8);
  const values = dataRange.getValues();

  // 가장 적게 발송된 횟수(minSentCount)를 찾아서, 아직 안 보낸 명언들 중에서 우선 랜덤 추첨 (중복 방지)
  let minSent = Infinity;
  const validIndices = [];

  for (let i = 0; i < values.length; i++) {
    const original = String(values[i][2] || '').trim();
    const korean = String(values[i][3] || '').trim();
    if (!original && !korean) continue;

    const sentCount = Number(values[i][6]) || 0;
    if (sentCount < minSent) {
      minSent = sentCount;
    }
    validIndices.push(i);
  }

  if (validIndices.length === 0) {
    throw new Error('유효한 명언 행을 찾을 수 없습니다.');
  }

  const candidates = validIndices.filter(function(idx) {
    return (Number(values[idx][6]) || 0) === minSent;
  });

  // 후보군 중 1개 랜덤 선택
  const chosenIdx = candidates[Math.floor(Math.random() * candidates.length)];
  const rowData = values[chosenIdx];
  const sheetRowNumber = chosenIdx + 2; // 1행은 헤더이므로 +2

  const quoteObj = {
    id: rowData[0] || (chosenIdx + 1),
    category: String(rowData[1] || '영어명언').trim(),
    original: String(rowData[2] || '').trim(),
    korean: String(rowData[3] || '').trim(),
    author: String(rowData[4] || '미상').trim(),
    note: String(rowData[5] || '').trim(),
    sentCount: (Number(rowData[6]) || 0) + 1
  };

  // 텔레그램 메시지 포맷 생성
  const messageHtml = formatTelegramMessage_(quoteObj, slot);

  // 텔레그램 푸시 발송
  sendTelegramMessage_(messageHtml);

  // 발송 횟수(G열) 및 최근 발송 일시(H열) 업데이트
  const nowStr = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
  sheet.getRange(sheetRowNumber, 7, 1, 2).setValues([[quoteObj.sentCount, nowStr]]);

  Logger.log('✅ 발송 완료 (#' + quoteObj.id + ' ' + quoteObj.category + '): ' + quoteObj.original);
}

/**
 * 명언 유형(영어명언 vs 사자성어/한자명언)에 맞춰 가독성 높은 텔레그램 알림 메시지를 구성합니다.
 */
function formatTelegramMessage_(q, slot) {
  const isHanja = (q.category.indexOf('사자성어') !== -1 || q.category.indexOf('한자') !== -1);
  const typeLabel = isHanja ? q.category : '오늘의 명언';

  let headerIcon = '📬';
  let timeLabel = '오늘의';
  if (slot === 'MORNING') {
    headerIcon = '🌅';
    timeLabel = '오늘 아침의';
  } else if (slot === 'EVENING') {
    headerIcon = '🌙';
    timeLabel = '오늘 저녁의';
  } else {
    const hour = Number(Utilities.formatDate(new Date(), 'Asia/Seoul', 'H'));
    if (hour < 14) {
      headerIcon = '🌅';
      timeLabel = '오늘 아침의';
    } else {
      headerIcon = '🌙';
      timeLabel = '오늘 저녁의';
    }
  }

  const lines = [];
  lines.push('<b>' + headerIcon + ' [' + timeLabel + ' ' + escapeHtml_(typeLabel) + '] #' + escapeHtml_(q.id) + '</b>');
  lines.push('━━━━━━━━━━━━━━━━━━');

  if (isHanja) {
    // 한자 사자성어 / 한자 명언 표기 포맷
    lines.push('🀄 <b>' + escapeHtml_(q.original) + '</b>');
    lines.push('');
    lines.push('💡 <b>한국어 풀이</b>');
    lines.push(escapeHtml_(q.korean));

    if (q.note) {
      lines.push('');
      lines.push('📝 <b>한자·상세 해설</b>');
      lines.push('<i>' + escapeHtml_(q.note) + '</i>');
    }

    lines.push('');
    lines.push('📚 <b>출전/인물:</b> ' + escapeHtml_(q.author));
  } else {
    // 영어 명언 (영문 + 한국어 동시 표기 + 말한 사람 표기)
    lines.push('🇺🇸 <b>"' + escapeHtml_(q.original) + '"</b>');
    lines.push('');
    lines.push('🇰🇷 "' + escapeHtml_(q.korean) + '"');
    lines.push('');
    lines.push('✍️ <b>— ' + escapeHtml_(q.author) + '</b>');

    if (q.note && q.note !== '세계 명언') {
      lines.push('📖 <i>' + escapeHtml_(q.note) + '</i>');
    }
  }

  return lines.join('\n');
}

/**
 * Telegram Bot API (sendMessage) 호출
 */
function sendTelegramMessage_(htmlText) {
  const token = getBotToken_();
  const chatId = getChatId_();

  if (!token || token.indexOf('여기에_') !== -1) {
    throw new Error('CONFIG.TELEGRAM_BOT_TOKEN에 텔레그램 봇 토큰을 설정해 주세요.');
  }
  if (!chatId || chatId.indexOf('여기에_') !== -1) {
    throw new Error('CONFIG.TELEGRAM_CHAT_ID에 텔레그램 Chat ID를 설정해 주세요. (모르시면 findMyChatId 함수를 먼저 실행하세요)');
  }

  const url = 'https://api.telegram.org/bot' + token + '/sendMessage';
  const payload = {
    chat_id: String(chatId).trim(),
    text: htmlText,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const resCode = response.getResponseCode();
  const resBody = response.getContentText();

  if (resCode !== 200) {
    throw new Error('텔레그램 발송 실패 (HTTP ' + resCode + '): ' + resBody);
  }
}

function getTargetSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('이 스크립트는 구글 스프레드시트의 [확장 프로그램 > Apps Script]에서 실행해야 합니다.');
  }
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.getActiveSheet();
  }
  return sheet;
}

function getBotToken_() {
  return String(CONFIG.TELEGRAM_BOT_TOKEN || PropertiesService.getScriptProperties().getProperty('TELEGRAM_BOT_TOKEN') || '').trim();
}

function getChatId_() {
  if (CONFIG.TELEGRAM_CHAT_ID && CONFIG.TELEGRAM_CHAT_ID.indexOf('여기에_') === -1) {
    return String(CONFIG.TELEGRAM_CHAT_ID).trim();
  }
  return String(PropertiesService.getScriptProperties().getProperty('AUTO_CHAT_ID') || '').trim();
}

function escapeHtml_(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function notifyUser_(msg) {
  try {
    SpreadsheetApp.getUi().alert(msg);
  } catch (e) {
    // Apps Script 에디터에서 직접 실행한 경우 UI alert 대신 로그 출력
  }
}
