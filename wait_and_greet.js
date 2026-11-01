const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const quotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'quotes_1000.json'), 'utf8'));

function escapeHtml(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatQuote(q) {
  const isHanja = q.category.includes('사자성어') || q.category.includes('한자');
  const typeLabel = isHanja ? q.category : '오늘의 명언';
  const lines = [];
  lines.push(`<b>📬 [오늘의 ${escapeHtml(typeLabel)}] #${escapeHtml(q.id)}</b>`);
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

async function sendMsg(chatId, html) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: html,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });
}

async function poll() {
  let offset = 0;
  let configuredSecret = false;
  console.log('대화 대기 중...');
  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?timeout=25&offset=${offset}`);
      const data = await res.json();
      if (data.ok && data.result && data.result.length > 0) {
        for (const upd of data.result) {
          offset = upd.update_id + 1;
          const chat = upd.message?.chat || upd.my_chat_member?.chat;
          if (!chat || !chat.id) continue;
          const chatId = String(chat.id);
          console.log('수신됨! Chat ID:', chatId);

          if (!configuredSecret) {
            configuredSecret = true;
            fs.writeFileSync(path.join(__dirname, 'chat_id.txt'), chatId, 'utf8');
            try {
              execSync(`gh secret set TELEGRAM_CHAT_ID --body "${chatId}"`, { cwd: __dirname });
              console.log('GitHub Secret TELEGRAM_CHAT_ID 등록 완료!');
            } catch (e) {
              console.error('Secret 등록 오류:', e.message);
            }
            await sendMsg(chatId, '🎉 <b>연결이 완료되었습니다!</b>\n이제 매일 <b>아침 8시</b>와 <b>저녁 9시</b>에 1,000개의 명언(영어+한글 번역)과 사자성어(한자+뜻풀이)를 랜덤으로 보내드립니다.\n\n지금 첫 번째 명언과 사자성어를 보내드릴게요! 👇');
            // 영어 명언 1개 + 사자성어 1개 샘플 즉시 발송
            const enPool = quotes.filter(q => q.category === '영어명언');
            const hjPool = quotes.filter(q => q.category === '사자성어');
            await sendMsg(chatId, formatQuote(enPool[Math.floor(Math.random() * enPool.length)]));
            await sendMsg(chatId, formatQuote(hjPool[Math.floor(Math.random() * hjPool.length)]));
          } else {
            // 이후에는 아무 메시지나 보내면 즉시 랜덤 명언 1개 답장!
            const q = quotes[Math.floor(Math.random() * quotes.length)];
            await sendMsg(chatId, formatQuote(q));
          }
        }
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

poll();
