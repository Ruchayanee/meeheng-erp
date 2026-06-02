let assistantRecognition = null;
let assistantSoundEnabled = true;

installAssistantUi();
document.addEventListener('DOMContentLoaded', bindAssistant);

function installAssistantUi() {
  if (document.getElementById('assistant')) return;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = './assistant.css';
  document.head.appendChild(stylesheet);

  const assistantTab = document.createElement('button');
  assistantTab.className = 'tab';
  assistantTab.dataset.tab = 'assistant';
  assistantTab.type = 'button';
  assistantTab.innerHTML = '<strong>🎙️ ผู้ช่วย</strong><small>ถามข้อมูลร้านและสั่งเปิดหน้า</small>';
  document.querySelector('.tabs').appendChild(assistantTab);

  const assistantPanel = document.createElement('section');
  assistantPanel.className = 'panel';
  assistantPanel.id = 'assistant';
  assistantPanel.innerHTML = `
    <div class="assistant-shell">
      <div class="card">
        <div class="assistant-head">
          <div>
            <h2>ผู้ช่วย Mee Heng</h2>
            <p id="assistantVoiceStatus">พร้อมช่วยดูข้อมูลร้าน</p>
          </div>
          <button class="btn-light icon-button" id="assistantSoundBtn" type="button" aria-label="เปิดหรือปิดเสียงตอบกลับ" aria-pressed="true" title="เปิดหรือปิดเสียงตอบกลับ">🔊</button>
        </div>
        <div class="assistant-chat" id="assistantChat" aria-live="polite">
          <div class="assistant-message assistant">สวัสดี พร้อมช่วยดูข้อมูลร้านแล้ว</div>
        </div>
        <div class="quick-commands">
          <button class="quick-command" data-assistant-query="สรุปวันนี้" type="button">สรุปวันนี้</button>
          <button class="quick-command" data-assistant-query="ของใกล้หมดมีอะไรบ้าง" type="button">ของใกล้หมด</button>
          <button class="quick-command" data-assistant-query="ผลิตได้กี่ชุด" type="button">ผลิตได้กี่ชุด</button>
          <button class="quick-command" data-assistant-query="เปิดหน้าสต๊อก" type="button">เปิดสต๊อก</button>
        </div>
        <form class="assistant-input-row" id="assistantForm">
          <button class="btn-green icon-button" id="assistantMicBtn" type="button" aria-label="พูดกับผู้ช่วย" title="พูดกับผู้ช่วย">🎤</button>
          <input id="assistantInput" name="query" autocomplete="off" placeholder="ถามผู้ช่วย Mee Heng" required>
          <button class="btn-primary" type="submit">ส่ง</button>
        </form>
      </div>
    </div>`;
  document.querySelector('main').appendChild(assistantPanel);
}

function bindAssistant() {
  document.getElementById('assistantForm').addEventListener('submit', (event) => {
    event.preventDefault();
    handleAssistantQuery(document.getElementById('assistantInput').value);
    event.target.reset();
  });
  document.querySelectorAll('[data-assistant-query]').forEach((button) => {
    button.addEventListener('click', () => handleAssistantQuery(button.dataset.assistantQuery));
  });
  document.getElementById('assistantSoundBtn').addEventListener('click', toggleAssistantSound);
  setupAssistantRecognition();
}

function setupAssistantRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micButton = document.getElementById('assistantMicBtn');
  if (!SpeechRecognition) {
    micButton.disabled = true;
    micButton.dataset.permanentDisabled = 'true';
    micButton.title = 'เบราว์เซอร์นี้ยังไม่รองรับการพูด กรุณาพิมพ์แทน';
    return;
  }

  assistantRecognition = new SpeechRecognition();
  assistantRecognition.lang = 'th-TH';
  assistantRecognition.continuous = false;
  assistantRecognition.interimResults = false;
  assistantRecognition.onstart = () => setText('assistantVoiceStatus', 'กำลังฟัง...');
  assistantRecognition.onend = () => setText('assistantVoiceStatus', 'พร้อมช่วยดูข้อมูลร้าน');
  assistantRecognition.onerror = () => setText('assistantVoiceStatus', 'ฟังเสียงไม่สำเร็จ ลองพิมพ์แทนได้');
  assistantRecognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;
    document.getElementById('assistantInput').value = spokenText;
    handleAssistantQuery(spokenText);
    document.getElementById('assistantInput').value = '';
  };
  micButton.addEventListener('click', () => {
    try {
      assistantRecognition.start();
    } catch (error) {
      setText('assistantVoiceStatus', 'กำลังฟังอยู่');
    }
  });
}

function toggleAssistantSound() {
  assistantSoundEnabled = !assistantSoundEnabled;
  const soundButton = document.getElementById('assistantSoundBtn');
  soundButton.textContent = assistantSoundEnabled ? '🔊' : '🔇';
  soundButton.setAttribute('aria-pressed', String(assistantSoundEnabled));
  if (!assistantSoundEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
}

function handleAssistantQuery(rawQuery) {
  const queryText = String(rawQuery || '').trim();
  if (!queryText) return;
  appendAssistantMessage('user', queryText);
  const response = getAssistantResponse(queryText);
  appendAssistantMessage('assistant', response.text);
  speakAssistant(response.text);
  if (response.tab) activateTab(response.tab);
}

function getAssistantResponse(rawQuery) {
  const query = normalizeAssistantText(rawQuery);
  const requestedTab = findRequestedTab(query);
  if (requestedTab) return { text: `เรียบร้อย เปิดหน้า${requestedTab.label}ให้แล้ว`, tab: requestedTab.id };

  if (includesAny(query, ['สรุป', 'ภาพรวม', 'ยอดขาย', 'กำไร', 'วันนี้'])) {
    const summary = appState.summary || {};
    return {
      text: `ยอดขายวันนี้ ${money.format(Number(summary.todaySales || 0))} บาท\nยอดขายเดือนนี้ ${money.format(Number(summary.monthlySales || 0))} บาท\nค่าใช้จ่ายเดือนนี้ ${money.format(Number(summary.monthlyExpenses || 0))} บาท\nกำไรเดือนนี้ ${money.format(Number(summary.monthlyProfit || 0))} บาท`
    };
  }

  if (includesAny(query, ['ใกล้หมด', 'ของหมด', 'ต้องซื้อ', 'ต่ำกว่าเกณฑ์', 'ขาดอะไร'])) {
    return { text: getLowStockAssistantText() };
  }

  if (query.includes('ผลิต') && includesAny(query, ['กี่ชุด', 'ได้เท่าไร', 'ได้กี่', 'พอไหม', 'พอหรือไม่'])) {
    return { text: getProductionCapacityText() };
  }

  const inventoryItem = findInventoryItemInQuery(query);
  if (inventoryItem && includesAny(query, ['เหลือ', 'สต๊อก', 'มีไหม', 'มีเท่าไร', 'คงเหลือ'])) {
    return { text: `${inventoryItem.item_name} คงเหลือ ${formatQty(inventoryItem.on_hand)} ${inventoryItem.unit}` };
  }

  if (query.includes('สูตร')) {
    const productNames = [...new Set(appState.recipes.map((recipe) => recipe.product_name))];
    return { text: productNames.length ? `มีสูตรผลิต ${productNames.length} รายการ: ${productNames.join(', ')}` : 'ยังไม่มีสูตรผลิตในระบบ' };
  }

  if (includesAny(query, ['สวัสดี', 'ช่วยอะไร', 'ทำอะไรได้', 'ใช้งานยังไง'])) {
    return { text: 'ถามได้เลย เช่น สรุปวันนี้ ของใกล้หมดมีอะไรบ้าง ผลิตได้กี่ชุด แป้งเหลือเท่าไร หรือเปิดหน้าสต๊อก' };
  }

  return { text: 'ยังไม่เข้าใจคำถามนี้ ลองถามว่า สรุปวันนี้ ของใกล้หมดมีอะไรบ้าง ผลิตได้กี่ชุด หรือระบุชื่อวัตถุดิบที่ต้องการเช็ก' };
}

function findRequestedTab(query) {
  if (!includesAny(query, ['เปิด', 'ไปหน้า', 'ดูหน้า'])) return null;
  const tabs = [
    { id: 'dashboard', label: 'ภาพรวม', keywords: ['แดชบอร์ด', 'dashboard', 'ภาพรวม', 'หน้าหลัก'] },
    { id: 'receive', label: 'รับเข้า', keywords: ['รับเข้า', 'ของเข้า'] },
    { id: 'production', label: 'ผลิต', keywords: ['ผลิต'] },
    { id: 'sales', label: 'ขาย', keywords: ['ขาย', 'ยอดขาย'] },
    { id: 'accounting', label: 'บัญชี', keywords: ['บัญชี', 'ค่าใช้จ่าย', 'กำไร'] },
    { id: 'inventory', label: 'สต๊อก', keywords: ['สต๊อก', 'stock', 'คงเหลือ'] },
    { id: 'recipes', label: 'สูตร', keywords: ['สูตร'] }
  ];
  return tabs.find((tab) => tab.keywords.some((keyword) => query.includes(keyword))) || null;
}

function getLowStockAssistantText() {
  const lowRows = appState.inventory.filter((item) => item.item_type !== 'finished_good' && item.status !== 'ok');
  if (!lowRows.length) return 'ตอนนี้ยังไม่มีรายการต่ำกว่าเกณฑ์';
  const preview = lowRows.slice(0, 8).map((item) => `${item.item_name} ${formatQty(item.on_hand)} ${item.unit}`).join('\n');
  const more = lowRows.length > 8 ? `\nและอีก ${lowRows.length - 8} รายการ` : '';
  return `มี ${lowRows.length} รายการที่ต้องดูแล\n${preview}${more}`;
}

function getProductionCapacityText() {
  if (!appState.products.length) return 'ยังไม่มีสินค้าให้คำนวณการผลิต';
  return appState.products.map((product) => {
    const productRecipes = appState.recipes.filter((recipe) => recipe.product_id === product.item_id);
    if (!productRecipes.length) return `${product.item_name}: ยังไม่มีสูตร`;
    const capacity = Math.min(...productRecipes.map((recipe) => {
      const ingredient = appState.inventory.find((item) => item.item_id === recipe.ingredient_id);
      return Math.floor(Number((ingredient && ingredient.on_hand) || 0) / Number(recipe.qty_per_batch || 1));
    }));
    return `${product.item_name}: ผลิตได้ ${qty.format(capacity)} ชุด`;
  }).join('\n');
}

function findInventoryItemInQuery(query) {
  return [...appState.inventory]
    .sort((a, b) => String(b.item_name).length - String(a.item_name).length)
    .find((item) => query.includes(normalizeAssistantText(item.item_name)));
}

function normalizeAssistantText(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function appendAssistantMessage(role, text) {
  const message = document.createElement('div');
  message.className = `assistant-message ${role}`;
  message.textContent = text;
  const chat = document.getElementById('assistantChat');
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function speakAssistant(text) {
  if (!assistantSoundEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'th-TH';
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}
