var MEEHENG_DB_VERSION = '2026-05-29.1';
var MEEHENG_TIME_ZONE = 'Asia/Bangkok';

var MEEHENG_SHEETS = {
  INVENTORY: 'Inventory',
  RECIPES: 'Recipes',
  STOCK_MOVEMENTS: 'StockMovements',
  PRODUCTION_LOGS: 'ProductionLogs',
  SALES_LOGS: 'SalesLogs',
  EXPENSES: 'Expenses',
  VENDORS: 'Vendors'
};

var MEEHENG_HEADERS = {
  Inventory: [
    'item_id',
    'item_name',
    'item_type',
    'category',
    'unit',
    'on_hand',
    'reorder_level',
    'active',
    'updated_at'
  ],
  Recipes: [
    'recipe_id',
    'product_id',
    'product_name',
    'version',
    'ingredient_id',
    'ingredient_name',
    'qty_per_batch',
    'unit'
  ],
  StockMovements: [
    'movement_id',
    'datetime',
    'type',
    'item_id',
    'item_name',
    'qty',
    'unit',
    'balance_after',
    'ref_type',
    'ref_id',
    'note',
    'user'
  ],
  ProductionLogs: [
    'production_id',
    'datetime',
    'product_id',
    'product_name',
    'batches',
    'output_qty',
    'unit',
    'status',
    'note',
    'user'
  ],
  SalesLogs: [
    'sale_id',
    'datetime',
    'vendor_name',
    'product_id',
    'product_name',
    'qty',
    'unit',
    'unit_price',
    'total',
    'note',
    'user'
  ],
  Expenses: [
    'expense_id',
    'datetime',
    'category',
    'description',
    'amount',
    'note',
    'ref_type',
    'ref_id',
    'user'
  ],
  Vendors: [
    'vendor_id',
    'vendor_name',
    'phone',
    'active'
  ]
};

function setupDatabase() {
  return withDbLock_(function () {
    var spreadsheet = getDb_();
    initializeDb_(spreadsheet);

    return {
      ok: true,
      spreadsheetId: spreadsheet.getId(),
      spreadsheetUrl: spreadsheet.getUrl(),
      version: MEEHENG_DB_VERSION,
      message: 'ฐานข้อมูล Meeheng ERP พร้อมใช้งานแล้ว'
    };
  });
}

function ensureDatabaseReady_() {
  var spreadsheet = getDb_();
  initializeDb_(spreadsheet);
  return spreadsheet;
}

function initializeDb_(spreadsheet) {
  Object.keys(MEEHENG_HEADERS).forEach(function (sheetName) {
    ensureSheet_(spreadsheet, sheetName, MEEHENG_HEADERS[sheetName]);
  });

  seedInventoryMaster_();
  seedRecipeMaster_();
  seedVendorMaster_();

  PropertiesService.getScriptProperties().setProperty('MEEHENG_DB_VERSION', MEEHENG_DB_VERSION);
}

function getDb_() {
  var properties = PropertiesService.getScriptProperties();
  var spreadsheetId = properties.getProperty('MEEHENG_SPREADSHEET_ID');

  if (spreadsheetId) {
    try {
      return SpreadsheetApp.openById(spreadsheetId);
    } catch (error) {
      properties.deleteProperty('MEEHENG_SPREADSHEET_ID');
    }
  }

  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (activeSpreadsheet) {
    properties.setProperty('MEEHENG_SPREADSHEET_ID', activeSpreadsheet.getId());
    return activeSpreadsheet;
  }

  var createdSpreadsheet = SpreadsheetApp.create('Meeheng ERP Database');
  properties.setProperty('MEEHENG_SPREADSHEET_ID', createdSpreadsheet.getId());
  return createdSpreadsheet;
}

function ensureSheet_(spreadsheet, sheetName, headers) {
  var sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#111827')
    .setFontColor('#ffffff');

  sheet.autoResizeColumns(1, headers.length);
}

function getSheet_(sheetName) {
  var spreadsheet = getDb_();
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    initializeDb_(spreadsheet);
    sheet = spreadsheet.getSheetByName(sheetName);
  }

  return sheet;
}

function readObjects_(sheetName) {
  var sheet = getSheet_(sheetName);
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();

  if (lastRow < 2 || lastColumn < 1) {
    return [];
  }

  var values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  var headers = values[0];
  var rows = [];

  for (var rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    var rowValues = values[rowIndex];
    var isBlank = rowValues.every(function (value) {
      return value === '' || value === null;
    });

    if (isBlank) {
      continue;
    }

    var row = {};
    headers.forEach(function (header, columnIndex) {
      if (header) {
        row[header] = rowValues[columnIndex];
      }
    });
    row._rowNumber = rowIndex + 1;
    rows.push(row);
  }

  return rows;
}

function appendObject_(sheetName, row) {
  var sheet = getSheet_(sheetName);
  var headers = MEEHENG_HEADERS[sheetName];
  var values = headers.map(function (header) {
    return row[header] === undefined ? '' : row[header];
  });

  sheet.appendRow(values);
  return row;
}

function replaceSheetRows_(sheetName, rows) {
  var sheet = getSheet_(sheetName);
  var headers = MEEHENG_HEADERS[sheetName];
  var lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  }

  if (rows.length > 0) {
    var values = rows.map(function (row) {
      return headers.map(function (header) {
        return row[header] === undefined ? '' : row[header];
      });
    });
    sheet.getRange(2, 1, values.length, headers.length).setValues(values);
  }
}

function withDbLock_(callback) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function makeId_(prefix) {
  return prefix + '-' + Utilities.formatDate(new Date(), getTimeZone_(), 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random() * 10000);
}

function getTimeZone_() {
  try {
    return Session.getScriptTimeZone() || MEEHENG_TIME_ZONE;
  } catch (error) {
    return MEEHENG_TIME_ZONE;
  }
}

function toNumber_(value) {
  var numberValue = Number(value);
  return isNaN(numberValue) ? 0 : numberValue;
}

function roundQty_(value) {
  return Math.round(toNumber_(value) * 1000000) / 1000000;
}

function requirePositiveNumber_(value, label) {
  var numberValue = toNumber_(value);

  if (numberValue <= 0) {
    throw new Error(label + ' ต้องมากกว่า 0');
  }

  return numberValue;
}

function normalizeText_(value) {
  return String(value || '').trim();
}

function getCurrentUser_() {
  try {
    return Session.getActiveUser().getEmail() || '';
  } catch (error) {
    return '';
  }
}

function formatDateTime_(value) {
  if (!value) {
    return '';
  }

  var dateValue = value instanceof Date ? value : new Date(value);

  if (isNaN(dateValue.getTime())) {
    return String(value);
  }

  return Utilities.formatDate(dateValue, getTimeZone_(), 'yyyy-MM-dd HH:mm:ss');
}

function dateKey_(value, pattern) {
  if (!value) {
    return '';
  }

  var dateValue = value instanceof Date ? value : new Date(value);

  if (isNaN(dateValue.getTime())) {
    return '';
  }

  return Utilities.formatDate(dateValue, getTimeZone_(), pattern);
}

function sameDay_(value, date) {
  return dateKey_(value, 'yyyy-MM-dd') === dateKey_(date, 'yyyy-MM-dd');
}

function sameMonth_(value, date) {
  return dateKey_(value, 'yyyy-MM') === dateKey_(date, 'yyyy-MM');
}

function formatRowsForClient_(rows) {
  return rows.map(function (row) {
    var formatted = {};

    Object.keys(row).forEach(function (key) {
      if (key === '_rowNumber') {
        return;
      }

      formatted[key] = row[key] instanceof Date ? formatDateTime_(row[key]) : row[key];
    });

    return formatted;
  });
}
