const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('❌ TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatTelegramMessage(q) {
  const isHanja = q.category.includes('사자성어') || q.category.includes('한자');
  const isKorean = q.category.includes('한국');
  const typeLabel = isHanja ? q.category : (isKorean ? '한국의 지혜·명언' : '오늘의 명언');

  // 한국 시간(KST, UTC+9) 기준 아침/저녁 판별
  const kstHour = (new Date().getUTCHours() + 9) % 24;
  const isMorning = kstHour < 14;
  const headerIcon = isMorning ? '🌅' : '🌙';
  const timeLabel = isMorning ? '오늘 아침의' : '오늘 저녁의';

  const lines = [];
  lines.push(`<b>${headerIcon} [${timeLabel} ${escapeHtml(typeLabel)}] #${escapeHtml(q.id)}</b>`);
  lines.push('━━━━━━━━━━━━━━━━━━');

  if (isHanja) {
    lines.push(`🀄 <b>${escapeHtml(q.original)}</b>`);
    lines.push('');
    lines.push('💡 <b>한국어 풀이</b>');
    lines.push(escapeHtml(q.korean));

    if (q.note) {
      lines.push('');
      lines.push('📝 <b>한자·상세 해설</b>');
      lines.push(`<i>${escapeHtml(q.note)}</i>`);
    }

    lines.push('');
    lines.push(`📚 <b>출전/인물:</b> ${escapeHtml(q.author)}`);
  } else if (isKorean) {
    lines.push(`🇰🇷 <b>"${escapeHtml(q.original)}"</b>`);
    lines.push('');
    lines.push('💡 <b>뜻풀이·해설</b>');
    lines.push(escapeHtml(q.korean));

    if (q.note) {
      lines.push('');
      lines.push('📝 <b>유래·배경</b>');
      lines.push(`<i>${escapeHtml(q.note)}</i>`);
    }

    lines.push('');
    lines.push(`📚 <b>인물/출전:</b> ${escapeHtml(q.author)}`);
  } else {
    lines.push(`🇺🇸 <b>"${escapeHtml(q.original)}"</b>`);
    lines.push('');
    lines.push(`🇰🇷 "${escapeHtml(q.korean)}"`);
    lines.push('');
    lines.push(`✍️ <b>— ${escapeHtml(q.author)}</b>`);

    if (q.note && q.note !== '세계 명언') {
      lines.push(`📖 <i>${escapeHtml(q.note)}</i>`);
    }
  }

  return lines.join('\n');
}

async function main() {
  const quotesPath = path.join(__dirname, 'quotes_1000.json');
  const quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf8'));

  // 옵션: 특정 카테고리 테스트가 아니면 전체 1,500개(서양 500 + 동양한자 500 + 한국 500) 중 1개 랜덤 선택
  const filterCat = process.env.FILTER_CATEGORY || '';
  const pool = filterCat ? quotes.filter(q => q.category === filterCat) : quotes;

  const randomIndex = Math.floor(Math.random() * pool.length);
  const chosen = pool[randomIndex];

  const text = formatTelegramMessage(chosen);

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });

  const data = await res.json();
  if (!data.ok) {
    console.error('❌ 텔레그램 발송 실패:', data);
    process.exit(1);
  }

  console.log(`✅ 발송 완료! (#${chosen.id} ${chosen.category} - ${chosen.author})`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
