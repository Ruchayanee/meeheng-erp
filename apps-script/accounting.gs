function createExpense(payload) {
  return withDbLock_(function () {
    ensureDatabaseReady_();
    return {
      ok: true,
      expense: createExpense_(payload),
      summary: getDashboardSummary()
    };
  });
}

function createExpense_(payload) {
  var amount = requirePositiveNumber_(payload.amount, 'ยอดค่าใช้จ่าย');
  var expense = {
    expense_id: payload.expense_id || makeId_('EXP'),
    datetime: new Date(),
    category: normalizeText_(payload.category) || 'ทั่วไป',
    description: normalizeText_(payload.description) || 'ค่าใช้จ่าย',
    amount: amount,
    note: payload.note || '',
    ref_type: payload.ref_type || '',
    ref_id: payload.ref_id || '',
    user: payload.user || getCurrentUser_()
  };

  appendObject_(MEEHENG_SHEETS.EXPENSES, expense);
  return formatRowsForClient_([expense])[0];
}

function getRecentExpenses(limit) {
  ensureDatabaseReady_();

  var rows = readObjects_(MEEHENG_SHEETS.EXPENSES);
  var rowLimit = limit || 20;
  return formatRowsForClient_(rows.slice(Math.max(rows.length - rowLimit, 0)).reverse());
}
