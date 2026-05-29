/** Meeheng Food ERP */
function doGet(e) {
  if (e && e.parameter && e.parameter.api) {
    return handleApiRequest_(e);
  }

  ensureDatabaseReady_();

  return HtmlService
    .createTemplateFromFile('index')
    .evaluate()
    .setTitle('Meeheng Food ERP')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getAppData() {
  ensureDatabaseReady_();

  return {
    summary: getDashboardSummary(),
    inventory: getInventory(),
    stockItems: getStockItems_(),
    products: getProducts_(),
    recipes: getRecipesForClient_(),
    vendors: getVendors_(),
    recentMovements: getRecentStockMovements(15),
    recentProductions: getRecentProductions(10),
    recentSales: getRecentSales(10),
    recentExpenses: getRecentExpenses(10),
    database: getDatabaseInfo_()
  };
}

function getDashboardSummary() {
  ensureDatabaseReady_();

  var now = new Date();
  var sales = readObjects_(MEEHENG_SHEETS.SALES_LOGS);
  var expenses = readObjects_(MEEHENG_SHEETS.EXPENSES);
  var productions = readObjects_(MEEHENG_SHEETS.PRODUCTION_LOGS);
  var inventory = readObjects_(MEEHENG_SHEETS.INVENTORY);
  var todaySales = 0;
  var monthlySales = 0;
  var monthlyExpenses = 0;
  var productionToday = 0;

  sales.forEach(function (sale) {
    if (sameDay_(sale.datetime, now)) {
      todaySales += toNumber_(sale.total);
    }

    if (sameMonth_(sale.datetime, now)) {
      monthlySales += toNumber_(sale.total);
    }
  });

  expenses.forEach(function (expense) {
    if (sameMonth_(expense.datetime, now)) {
      monthlyExpenses += toNumber_(expense.amount);
    }
  });

  productions.forEach(function (production) {
    if (sameDay_(production.datetime, now)) {
      productionToday += toNumber_(production.output_qty);
    }
  });

  var lowStockItems = inventory.filter(function (item) {
    return item.item_type !== 'finished_good' &&
      toNumber_(item.reorder_level) > 0 &&
      toNumber_(item.on_hand) <= toNumber_(item.reorder_level);
  });

  var finishedGoods = inventory.filter(function (item) {
    return item.item_type === 'finished_good';
  });

  return {
    todaySales: roundQty_(todaySales),
    monthlySales: roundQty_(monthlySales),
    monthlyExpenses: roundQty_(monthlyExpenses),
    monthlyProfit: roundQty_(monthlySales - monthlyExpenses),
    lowStock: lowStockItems.length,
    productionToday: roundQty_(productionToday),
    finishedGoodsQty: roundQty_(finishedGoods.reduce(function (sum, item) {
      return sum + toNumber_(item.on_hand);
    }, 0)),
    message: 'พร้อมใช้งาน'
  };
}

function getDatabaseInfo_() {
  var spreadsheet = getDb_();

  return {
    spreadsheetId: spreadsheet.getId(),
    spreadsheetUrl: spreadsheet.getUrl(),
    version: MEEHENG_DB_VERSION
  };
}

function doPost(e) {
  return handleApiRequest_(e);
}

function handleApiRequest_(e) {
  var params = e && e.parameter ? e.parameter : {};
  var callback = params.jsonp || params.callback || '';

  try {
    var result = runApiAction_(params, e);
    return createApiOutput_(result, callback);
  } catch (error) {
    return createApiOutput_({
      ok: false,
      error: error.message || String(error)
    }, callback);
  }
}

function runApiAction_(params, e) {
  var action = params.action || 'getAppData';
  var payload = parseApiPayload_(params, e);

  if (action === 'getAppData') {
    var data = getAppData();
    data.ok = true;
    return data;
  }

  if (action === 'setupDatabase') {
    return setupDatabase();
  }

  if (action === 'receiveStock') {
    return receiveStock(payload);
  }

  if (action === 'createProduction') {
    return createProduction(payload.product_id, payload.qty, payload.note);
  }

  if (action === 'createSale') {
    return createSale(payload);
  }

  if (action === 'createExpense') {
    return createExpense(payload);
  }

  throw new Error('ไม่รู้จัก action: ' + action);
}

function parseApiPayload_(params, e) {
  if (params.payload) {
    return JSON.parse(params.payload);
  }

  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }

  return {};
}

function createApiOutput_(data, callback) {
  var json = JSON.stringify(data);

  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
