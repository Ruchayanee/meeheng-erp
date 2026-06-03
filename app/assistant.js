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
          <button class="quick-command" data-assistant-query="วันนี้ควรทำอะไรก่อน" type="button">งานด่วน</button>
          <button class="quick-command" data-assistant-query="อะไรเร่งด่วนสุด" type="button">ด่วนสุด</button>
          <button class="quick-command" data-assistant-query="ถ้าจะผลิตลูกชิ้น 5 ชุดต้องซื้ออะไร" type="button">แผนผลิต</button>
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

  const product = findProductInQuery(query);
  const inventoryItem = findInventoryItemInQuery(query);
  const requestedBatches = getRequestedBatchCount(query);
  const productPlanIntent = product && includesAny(query, ['ผลิต', 'ทำ', 'พอไหม', 'พอหรือไม่', 'กี่ชุด', 'ขาดอะไร', 'ต้องซื้อ', 'ควรซื้อ', 'ซื้ออะไร', 'เติมอะไร', 'ต้องเติม', 'วางแผน', 'แผนผลิต', 'วัตถุดิบ', 'ถ้า']);

  if (includesAny(query, ['เร่งด่วนสุด', 'ด่วนสุด', 'อะไรด่วน', 'สำคัญสุด', 'จัดลำดับ', 'ลำดับงาน', 'ต้องทำก่อน'])) {
    return { text: getPriorityText() };
  }

  if (includesAny(query, ['ควรทำ', 'ทำอะไรก่อน', 'งานด่วน', 'ต้องทำ', 'แนะนำวันนี้'])) {
    return { text: getDailyPlanText() };
  }

  if (includesAny(query, ['สรุป', 'ภาพรวม', 'ยอดขาย', 'กำไร', 'วันนี้'])) {
    const summary = appState.summary || {};
    return {
      text: `ยอดขายวันนี้ ${money.format(Number(summary.todaySales || 0))} บาท\nยอดขายเดือนนี้ ${money.format(Number(summary.monthlySales || 0))} บาท\nค่าใช้จ่ายเดือนนี้ ${money.format(Number(summary.monthlyExpenses || 0))} บาท\nกำไรเดือนนี้ ${money.format(Number(summary.monthlyProfit || 0))} บาท`
    };
  }

  if (productPlanIntent) {
    if (includesAny(query, ['ต้องซื้อ', 'ควรซื้อ', 'ซื้ออะไร', 'เติมอะไร', 'ต้องเติม', 'วางแผน', 'แผนผลิต', 'ถ้า'])) {
      return { text: getProductShoppingPlanText(product, requestedBatches) };
    }
    return { text: getProductProductionText(product, requestedBatches) };
  }

  if (includesAny(query, ['ควรผลิต', 'ผลิตอะไรก่อน', 'ผลิตตัวไหน', 'สินค้าไหนต้องผลิต'])) {
    return { text: getProductionPriorityText() };
  }

  if (includesAny(query, ['ใกล้หมด', 'ของหมด', 'ต้องซื้อ', 'ควรซื้อ', 'เติมอะไร', 'ต้องเติม', 'สั่งซื้อ', 'ต้องสั่ง', 'ต่ำกว่าเกณฑ์', 'ขาดอะไร'])) {
    if (includesAny(query, ['หมวด', 'แยกหมวด', 'จัดหมวด'])) return { text: getRestockByCategoryText() };
    return { text: getRestockAssistantText() };
  }

  if (query.includes('ผลิต') && includesAny(query, ['กี่ชุด', 'ได้เท่าไร', 'ได้กี่', 'พอไหม', 'พอหรือไม่', 'ขาดอะไร'])) {
    return { text: getProductionCapacityText() };
  }

  if (inventoryItem && includesAny(query, ['เหลือ', 'สต๊อก', 'มีไหม', 'มีเท่าไร', 'คงเหลือ', 'พอไหม', 'ต่ำไหม'])) {
    return { text: getInventoryItemText(inventoryItem) };
  }

  if (query.includes('สูตร')) {
    if (product) return { text: getRecipeText(product) };
    const productNames = [...new Set(appState.recipes.map((recipe) => recipe.product_name))];
    return { text: productNames.length ? `มีสูตรผลิต ${productNames.length} รายการ: ${productNames.join(', ')}` : 'ยังไม่มีสูตรผลิตในระบบ' };
  }

  if (includesAny(query, ['สวัสดี', 'ช่วยอะไร', 'ทำอะไรได้', 'ใช้งานยังไง'])) {
    return { text: 'ถามได้เลย เช่น อะไรเร่งด่วนสุด ถ้าจะผลิตลูกชิ้น 5 ชุดต้องซื้ออะไร ผลิตหมูยอสองชุดพอไหม แป้งเหลือเท่าไร หรือเปิดหน้าสต๊อก' };
  }

  const nearbyItem = findInventoryItemInQuery(query, 0.28);
  if (nearbyItem) return { text: `หมายถึง ${nearbyItem.item_name} ใช่ไหม\n${getInventoryItemText(nearbyItem)}` };

  return { text: 'ยังไม่เข้าใจคำถามนี้ ลองถามว่า อะไรเร่งด่วนสุด ต้องเติมอะไรบ้าง ถ้าจะผลิตลูกชิ้น 5 ชุดต้องซื้ออะไร หรือระบุชื่อวัตถุดิบที่ต้องการเช็ก' };
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
  const lowRows = getRestockRows();
  if (!lowRows.length) return 'ตอนนี้ยังไม่มีรายการต่ำกว่าเกณฑ์';
  const preview = lowRows.slice(0, 8).map((item) => `${item.item_name} ${formatQty(item.on_hand)} ${item.unit}`).join('\n');
  const more = lowRows.length > 8 ? `\nและอีก ${lowRows.length - 8} รายการ` : '';
  return `มี ${lowRows.length} รายการที่ต้องดูแล\n${preview}${more}`;
}

function getRestockAssistantText() {
  const lowRows = getRestockRows();
  if (!lowRows.length) return 'ตอนนี้ยังไม่มีรายการที่ต้องเติม สต๊อกดูเรียบร้อยดี';
  const preview = lowRows.slice(0, 8).map((item) => {
    const missing = Math.max(Number(item.reorder_level || 0) - Number(item.on_hand || 0), 0);
    const suffix = missing > 0 ? ` ควรเติมอย่างน้อย ${formatQty(missing)} ${item.unit}` : '';
    return `${item.item_name}: เหลือ ${formatQty(item.on_hand)} ${item.unit}${suffix}`;
  }).join('\n');
  const more = lowRows.length > 8 ? `\nและอีก ${lowRows.length - 8} รายการ เปิดหน้าสต๊อกเพื่อดูทั้งหมดได้เลย` : '';
  return `ควรดูแล ${lowRows.length} รายการ\nด่วนสุด: ${lowRows.slice(0, 3).map((item) => item.item_name).join(', ')}\n${preview}${more}`;
}

function getRestockByCategoryText() {
  const lowRows = getRestockRows();
  if (!lowRows.length) return 'ตอนนี้ยังไม่มีรายการที่ต้องเติม';
  const groups = lowRows.reduce((result, item) => {
    const category = item.category || 'ไม่ระบุหมวด';
    if (!result[category]) result[category] = [];
    result[category].push(item);
    return result;
  }, {});
  return Object.entries(groups).map(([category, items]) => {
    const names = items.slice(0, 4).map((item) => item.item_name).join(', ');
    const more = items.length > 4 ? ` และอีก ${items.length - 4}` : '';
    return `${category}: ${items.length} รายการ (${names}${more})`;
  }).join('\n');
}

function getPriorityText() {
  const restockRows = getRestockRows();
  const productionRows = getProductionBlockers();
  const lines = ['ลำดับที่ควรดูตอนนี้'];
  if (restockRows.length) {
    lines.push(`1. เติมสต๊อกด่วน ${restockRows.length} รายการ: ${restockRows.slice(0, 5).map((item) => item.item_name).join(', ')}`);
  } else {
    lines.push('1. สต๊อกขั้นต่ำยังไม่เจอรายการที่ต้องเติม');
  }
  if (productionRows.length) {
    const top = productionRows.slice(0, 3).map((row) => `${row.productName}ติดที่${row.itemName}`).join(', ');
    lines.push(`2. ผลิตยังติดวัตถุดิบ: ${top}`);
  } else {
    lines.push('2. วัตถุดิบผลิตดูพร้อมกว่าเดิม ไม่มีตัวติดหลัก');
  }
  lines.push('3. ถ้าจะผลิตตามออเดอร์ ให้ถามแบบ "ผลิตลูกชิ้น 5 ชุดต้องซื้ออะไร"');
  return lines.join('\n');
}

function getDailyPlanText() {
  const summary = appState.summary || {};
  const restockRows = getRestockRows();
  const urgentRows = restockRows.slice(0, 5).map((item) => item.item_name).join(', ');
  const priorityText = getPriorityText();
  return [
    `วันนี้ยอดขาย ${money.format(Number(summary.todaySales || 0))} บาท`,
    restockRows.length ? `อันดับแรกควรเติม/เช็กสต๊อก ${restockRows.length} รายการ: ${urgentRows}` : 'สต๊อกยังไม่มีรายการต่ำกว่าเกณฑ์',
    priorityText
  ].join('\n');
}

function getProductionCapacityText() {
  if (!appState.products.length) return 'ยังไม่มีสินค้าให้คำนวณการผลิต';
  return appState.products.map((product) => {
    const detail = getProductCapacityDetail(product);
    if (!detail.recipes.length) return `${product.item_name}: ยังไม่มีสูตร`;
    const blocker = detail.blockers[0];
    const blockerText = blocker ? ` ติดที่ ${blocker.itemName} ขาด ${formatQty(blocker.missing)} ${blocker.unit}` : '';
    return `${product.item_name}: ผลิตได้ ${qty.format(detail.capacity)} ชุด${blockerText}`;
  }).join('\n');
}

function getProductProductionText(product, requestedBatches) {
  const detail = getProductCapacityDetail(product, requestedBatches || 1);
  if (!detail.recipes.length) return `${product.item_name} ยังไม่มีสูตรในระบบ`;
  if (requestedBatches) {
    const status = detail.canMakeRequested ? 'พอผลิตได้' : 'ยังไม่พอผลิต';
    const lines = detail.ingredients.map((row) => {
      const missingText = row.missing > 0 ? ` ขาด ${formatQty(row.missing)} ${row.unit}` : ' พอ';
      return `${row.name}: ต้องใช้ ${formatQty(row.required)} ${row.unit}, มี ${formatQty(row.onHand)} ${row.unit},${missingText}`;
    });
    return `${product.item_name} ${requestedBatches} ชุด: ${status}\n${lines.join('\n')}`;
  }

  const blocker = detail.blockers[0];
  if (!blocker) return `${product.item_name} ผลิตได้ ${qty.format(detail.capacity)} ชุด วัตถุดิบพอสำหรับอย่างน้อย 1 ชุด`;
  return `${product.item_name} ตอนนี้ผลิตได้ ${qty.format(detail.capacity)} ชุด\nตัวที่ติดที่สุดคือ ${blocker.itemName}: มี ${formatQty(blocker.onHand)} ${blocker.unit}, ต้องใช้ต่อชุด ${formatQty(blocker.perBatch)} ${blocker.unit}`;
}

function getProductShoppingPlanText(product, requestedBatches) {
  const batches = requestedBatches || 1;
  const detail = getProductCapacityDetail(product, batches);
  if (!detail.recipes.length) return `${product.item_name} ยังไม่มีสูตรในระบบ`;
  const missingRows = detail.ingredients.filter((row) => row.missing > 0).sort((a, b) => b.missing - a.missing);
  const prefix = requestedBatches ? `แผนผลิต ${product.item_name} ${batches} ชุด` : `คำนวณ ${product.item_name} ให้ที่ 1 ชุดก่อน`;
  if (!missingRows.length) {
    return `${prefix}\nวัตถุดิบพอ ไม่ต้องซื้อเพิ่ม\nตอนนี้ผลิตได้ประมาณ ${qty.format(detail.capacity)} ชุด`;
  }
  const lines = missingRows.map((row) => `${row.name}: ซื้อเพิ่ม ${formatQty(row.missing)} ${row.unit} (ต้องใช้ ${formatQty(row.required)}, มี ${formatQty(row.onHand)})`);
  const hint = requestedBatches ? '' : '\nถ้าจะผลิตหลายชุด พิมพ์เช่น "ลูกชิ้น 5 ชุดต้องซื้ออะไร"';
  return `${prefix}\nต้องซื้อ/เติมเพิ่ม ${missingRows.length} รายการ\n${lines.join('\n')}${hint}`;
}

function getProductionPriorityText() {
  if (!appState.products.length) return 'ยังไม่มีสินค้าให้คำนวณการผลิต';
  const rows = appState.products.map((product) => {
    const detail = getProductCapacityDetail(product);
    const blocker = detail.blockers[0];
    const inventoryRow = appState.inventory.find((item) => item.item_id === product.item_id) || product;
    return {
      product,
      capacity: detail.capacity,
      blocker,
      status: inventoryRow.status || 'ok',
      onHand: Number(inventoryRow.on_hand || 0),
      unit: inventoryRow.unit || product.unit || 'ชุด'
    };
  }).sort((a, b) => {
    const statusOrder = { out: 0, low: 1, ok: 2 };
    const statusDiff = (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2);
    if (statusDiff) return statusDiff;
    return a.capacity - b.capacity;
  });
  return rows.map((row, index) => {
    const blockerText = row.blocker ? ` ติดที่ ${row.blocker.itemName}` : ' วัตถุดิบพร้อมกว่า';
    return `${index + 1}. ${row.product.item_name}: สินค้าคงเหลือ ${formatQty(row.onHand)} ${row.unit}, ผลิตได้ ${qty.format(row.capacity)} ชุด${blockerText}`;
  }).join('\n');
}

function getProductCapacityDetail(product, requestedBatches = 1) {
  const recipes = appState.recipes.filter((recipe) => recipe.product_id === product.item_id);
  const ingredients = recipes.map((recipe) => {
    const item = appState.inventory.find((inventoryItem) => inventoryItem.item_id === recipe.ingredient_id) || {};
    const perBatch = Number(recipe.qty_per_batch || 0);
    const onHand = Number(item.on_hand || 0);
    const required = perBatch * requestedBatches;
    return {
      itemName: recipe.ingredient_name,
      name: recipe.ingredient_name,
      unit: recipe.unit,
      perBatch,
      onHand,
      required,
      missing: Math.max(required - onHand, 0),
      capacity: perBatch > 0 ? Math.floor(onHand / perBatch) : 0
    };
  });
  const capacity = ingredients.length ? Math.min(...ingredients.map((row) => row.capacity)) : 0;
  return {
    blockers: ingredients.filter((row) => row.missing > 0).sort((a, b) => b.missing - a.missing),
    canMakeRequested: ingredients.every((row) => row.missing <= 0),
    capacity,
    ingredients,
    recipes
  };
}

function getInventoryItemText(item) {
  const onHand = Number(item.on_hand || 0);
  const reorder = Number(item.reorder_level || 0);
  const missing = Math.max(reorder - onHand, 0);
  const status = item.status === 'ok' ? 'อยู่ในระดับปกติ' : item.status === 'low' ? 'ต่ำกว่าเกณฑ์' : 'หมดหรือไม่พอ';
  const refill = missing > 0 ? `\nควรเติมอย่างน้อย ${formatQty(missing)} ${item.unit} เพื่อถึงขั้นต่ำ ${formatQty(reorder)} ${item.unit}` : '';
  return `${item.item_name} คงเหลือ ${formatQty(onHand)} ${item.unit} (${status})${refill}`;
}

function getRecipeText(product) {
  const recipes = appState.recipes.filter((recipe) => recipe.product_id === product.item_id);
  if (!recipes.length) return `${product.item_name} ยังไม่มีสูตรในระบบ`;
  return `${product.item_name} ใช้วัตถุดิบต่อชุด\n${recipes.map((recipe) => `${recipe.ingredient_name} ${formatQty(recipe.qty_per_batch)} ${recipe.unit}`).join('\n')}`;
}

function getRestockRows() {
  return appState.inventory
    .filter((item) => item.item_type !== 'finished_good' && item.status !== 'ok')
    .sort((a, b) => {
      const statusOrder = { out: 0, low: 1, ok: 2 };
      const statusDiff = (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2);
      if (statusDiff) return statusDiff;
      return getMissingQty(b) - getMissingQty(a);
    });
}

function getProductionBlockers() {
  return appState.products.flatMap((product) => {
    const detail = getProductCapacityDetail(product);
    return detail.blockers.slice(0, 1).map((blocker) => ({
      productName: product.item_name,
      itemName: blocker.itemName,
      missing: blocker.missing,
      unit: blocker.unit
    }));
  }).sort((a, b) => b.missing - a.missing);
}

function getMissingQty(item) {
  return Math.max(Number(item.reorder_level || 0) - Number(item.on_hand || 0), 0);
}

function getRequestedBatchCount(query) {
  const normalizedQuery = normalizeThaiDigits(query);
  const match = normalizedQuery.match(/(\d+(?:\.\d+)?)\s*(ชุด|รอบ|batch)?/);
  if (match) return Number(match[1]);
  return getThaiWordBatchCount(query);
}

function findProductInQuery(query) {
  return findNamedRowInQuery(appState.products || [], query, 'item_name', 0.34);
}

function findInventoryItemInQuery(query, threshold = 0.34) {
  return findNamedRowInQuery(appState.inventory || [], query, 'item_name', threshold);
}

function normalizeAssistantText(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizeThaiDigits(value) {
  const digits = { '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4', '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9' };
  return String(value || '').replace(/[๐-๙]/g, (digit) => digits[digit] || digit);
}

function getThaiWordBatchCount(query) {
  const words = [
    ['ยี่สิบ', 20], ['สิบเก้า', 19], ['สิบแปด', 18], ['สิบเจ็ด', 17], ['สิบหก', 16],
    ['สิบห้า', 15], ['สิบสี่', 14], ['สิบสาม', 13], ['สิบสอง', 12], ['สิบเอ็ด', 11],
    ['สิบ', 10], ['เก้า', 9], ['แปด', 8], ['เจ็ด', 7], ['หก', 6], ['ห้า', 5],
    ['สี่', 4], ['สาม', 3], ['สอง', 2], ['หนึ่ง', 1], ['นึง', 1]
  ];
  const text = normalizeAssistantText(query);
  const pattern = new RegExp(`(${words.map(([word]) => word).join('|')})\\s*(ชุด|รอบ|batch)`);
  const match = text.match(pattern);
  if (!match) return 0;
  const found = words.find(([word]) => word === match[1]);
  return found ? found[1] : 0;
}

function assistantSearchKey(value) {
  return normalizeAssistantText(value)
    .replace(/[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/g, '')
    .replace(/[\s()[\]{}.,:;'"!?/\\|_-]/g, '');
}

function findNamedRowInQuery(rows, query, labelKey, threshold) {
  const queryKey = assistantSearchKey(query);
  if (!queryKey) return null;
  const directMatch = rows.find((row) => {
    const labelKeyValue = assistantSearchKey(row[labelKey]);
    if (!labelKeyValue) return false;
    const labelTokens = getAssistantNameTokens(row[labelKey]);
    return queryKey.includes(labelKeyValue) || labelTokens.some((token) => queryKey.includes(token));
  });
  return directMatch || findBestMatch(rows, query, labelKey, threshold);
}

function getAssistantNameTokens(value) {
  const compactName = assistantSearchKey(value);
  const baseName = compactName.replace(/สตร.*$/g, '').replace(/หลก|ใหญ|เลก/g, '');
  const spacedTokens = normalizeAssistantText(value)
    .split(/[\s()[\]{}.,:;'"!?/\\|_-]+/)
    .map((token) => assistantSearchKey(token))
    .filter((token) => token.length >= 3 && !['สตร', 'หลก', 'ใหญ'].includes(token));
  return [...new Set([compactName, baseName, ...spacedTokens].filter((token) => token.length >= 3))];
}

function findBestMatch(rows, query, labelKey, threshold) {
  const queryKey = assistantSearchKey(query);
  if (!queryKey) return null;
  let best = null;
  rows.forEach((row) => {
    const labelKeyValue = assistantSearchKey(row[labelKey]);
    if (!labelKeyValue) return;
    let score = diceSimilarity(queryKey, labelKeyValue);
    if (queryKey.includes(labelKeyValue) || labelKeyValue.includes(queryKey)) score += 0.65;
    if (score > (best && best.score || 0)) best = { row, score };
  });
  return best && best.score >= threshold ? best.row : null;
}

function diceSimilarity(a, b) {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return a.includes(b) || b.includes(a) ? 0.7 : 0;
  const grams = new Map();
  for (let index = 0; index < a.length - 1; index += 1) {
    const gram = a.slice(index, index + 2);
    grams.set(gram, (grams.get(gram) || 0) + 1);
  }
  let matches = 0;
  for (let index = 0; index < b.length - 1; index += 1) {
    const gram = b.slice(index, index + 2);
    const count = grams.get(gram) || 0;
    if (count > 0) {
      grams.set(gram, count - 1);
      matches += 1;
    }
  }
  return (2 * matches) / (a.length + b.length - 2);
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
