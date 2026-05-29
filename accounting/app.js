const expenseKey = 'meeheng_expenses';
const expenseForm = document.getElementById('expenseForm');
const expenseRows = document.getElementById('rows');

function readExpenses() {
  return JSON.parse(localStorage.getItem(expenseKey) || '[]');
}

function writeExpenses(rows) {
  localStorage.setItem(expenseKey, JSON.stringify(rows));
}

function renderExpenses() {
  const rows = readExpenses();
  expenseRows.innerHTML = rows.length ? rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.datetime)}</td>
      <td>${escapeHtml(row.category)}</td>
      <td>${escapeHtml(row.description)}</td>
      <td class="number">${Number(row.amount).toFixed(2)}</td>
    </tr>
  `).join('') : '<tr><td colspan="4">ยังไม่มีรายการ</td></tr>';
}

expenseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(expenseForm);
  const rows = readExpenses();
  rows.push({
    datetime: new Date().toLocaleString('th-TH'),
    category: data.get('category'),
    description: data.get('description'),
    amount: Number(data.get('amount'))
  });
  writeExpenses(rows);
  expenseForm.reset();
  renderExpenses();
});

renderExpenses();

function escapeHtml(value) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
