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

function updateExpense(payload) {
  return withDbLock_(function () {
    ensureDatabaseReady_();

    var expenseId = normalizeText_(payload.expense_id);
    var rows = readObjects_(MEEHENG_SHEETS.EXPENSES);
    var expense = null;

    rows.forEach(function (row) {
      if (row.expense_id === expenseId) {
        expense = row;
      }
    });

    if (!expense) {
      throw new Error('ไม่พบค่าใช้จ่ายที่ต้องการแก้ไข');
    }

    var updated = {
      expense_id: expense.expense_id,
      datetime: expense.datetime,
      category: normalizeText_(payload.category) || expense.category,
      description: normalizeText_(payload.description) || expense.description,
      amount: payload.amount === undefined || payload.amount === ''
        ? requirePositiveNumber_(expense.amount, 'ยอดค่าใช้จ่าย')
        : requirePositiveNumber_(payload.amount, 'ยอดค่าใช้จ่าย'),
      note: payload.note === undefined ? expense.note : payload.note,
      ref_type: expense.ref_type,
      ref_id: expense.ref_id,
      user: expense.user
    };

    updateObjectRow_(MEEHENG_SHEETS.EXPENSES, expense._rowNumber, updated);

    return {
      ok: true,
      expense: formatRowsForClient_([updated])[0],
      summary: getDashboardSummary()
    };
  });
}
