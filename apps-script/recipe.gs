var MEEHENG_ITEM_MASTER = [
  { item_id: 'RM-FLOUR', item_name: 'แป้ง', item_type: 'raw_material', category: 'สูตรลูกชิ้น', unit: 'kg', reorder_level: 5 },
  { item_id: 'RM-BAKING-POWDER', item_name: 'ผงฟู', item_type: 'raw_material', category: 'สูตรลูกชิ้น', unit: 'kg', reorder_level: 1 },
  { item_id: 'RM-PRESERVATIVE', item_name: 'กันบูด', item_type: 'raw_material', category: 'สูตรลูกชิ้น/หมูยอ', unit: 'kg', reorder_level: 1 },
  { item_id: 'RM-GLUTEN', item_name: 'กลูเตน', item_type: 'raw_material', category: 'สูตรลูกชิ้น/หมูยอ', unit: 'kg', reorder_level: 2 },
  { item_id: 'RM-PORK-SEASONING', item_name: 'ผงปรุงรสหมู', item_type: 'raw_material', category: 'สูตรลูกชิ้น/หมูยอ', unit: 'kg', reorder_level: 1 },
  { item_id: 'RM-MSG', item_name: 'หัวชูรส', item_type: 'raw_material', category: 'สูตรลูกชิ้น/หมูยอ', unit: 'kg', reorder_level: 1 },
  { item_id: 'RM-WHITE-PEPPER', item_name: 'พริกไทยขาว', item_type: 'raw_material', category: 'สูตรลูกชิ้น/หมูยอ', unit: 'tbsp', reorder_level: 20 },
  { item_id: 'RM-BLACK-PEPPER', item_name: 'พริกไทยดำ', item_type: 'raw_material', category: 'สูตรลูกชิ้น/หมูยอ', unit: 'tbsp', reorder_level: 20 },
  { item_id: 'RM-SALT', item_name: 'เกลือ', item_type: 'raw_material', category: 'สูตรลูกชิ้น', unit: 'kg', reorder_level: 2 },
  { item_id: 'RM-SUGAR-MIX', item_name: 'ผสมดีน้ำตาล', item_type: 'raw_material', category: 'สูตรลูกชิ้น', unit: 'kg', reorder_level: 1 },
  { item_id: 'RM-MODIFIED-STARCH', item_name: 'แป้งโม', item_type: 'raw_material', category: 'สูตรหมูยอ', unit: 'kg', reorder_level: 5 },
  { item_id: 'RM-MIX-POWDER', item_name: 'ผงมิกซ์', item_type: 'raw_material', category: 'สูตรหมูยอ', unit: 'kg', reorder_level: 1 },
  { item_id: 'RM-SUGAR', item_name: 'น้ำตาลทราย', item_type: 'raw_material', category: 'สูตรหมูยอ', unit: 'kg', reorder_level: 2 },
  { item_id: 'RM-GROUND-PORK', item_name: 'หมูบด', item_type: 'raw_material', category: 'วัตถุดิบโปรตีน', unit: 'kg', reorder_level: 10 },
  { item_id: 'RM-PORK-SKIN', item_name: 'หนังหมู', item_type: 'raw_material', category: 'วัตถุดิบโปรตีน', unit: 'kg', reorder_level: 5 },
  { item_id: 'RM-CHICKEN', item_name: 'เนื้อไก่', item_type: 'raw_material', category: 'วัตถุดิบโปรตีน', unit: 'kg', reorder_level: 5 },
  { item_id: 'RM-ICE', item_name: 'น้ำแข็ง', item_type: 'raw_material', category: 'วัตถุดิบโปรตีน', unit: 'kg', reorder_level: 20 },
  { item_id: 'PK-VACUUM-BAG-40', item_name: 'ถุงแพ็คซีน 40', item_type: 'packaging', category: 'บรรจุภัณฑ์', unit: 'pcs', reorder_level: 100 },
  { item_id: 'PK-TIE-BAG-25', item_name: 'ถุงมัด 25', item_type: 'packaging', category: 'บรรจุภัณฑ์', unit: 'pcs', reorder_level: 100 },
  { item_id: 'PK-MOOYOR-CASING', item_name: 'ปลอกหมูยอ', item_type: 'packaging', category: 'บรรจุภัณฑ์', unit: 'pcs', reorder_level: 100 },
  { item_id: 'PK-STRING', item_name: 'เชือก', item_type: 'packaging', category: 'บรรจุภัณฑ์', unit: 'roll', reorder_level: 2 },
  { item_id: 'PK-RUBBER-BAND', item_name: 'ยางรัด', item_type: 'packaging', category: 'บรรจุภัณฑ์', unit: 'pack', reorder_level: 5 },
  { item_id: 'SUP-GAS', item_name: 'แก๊ส', item_type: 'factory_supply', category: 'อุปกรณ์โรงงาน', unit: 'tank', reorder_level: 1 },
  { item_id: 'SUP-OIL', item_name: 'น้ำมัน', item_type: 'factory_supply', category: 'อุปกรณ์โรงงาน', unit: 'liter', reorder_level: 5 },
  { item_id: 'SUP-GLOVES', item_name: 'ถุงมือ', item_type: 'factory_supply', category: 'อุปกรณ์โรงงาน', unit: 'box', reorder_level: 2 },
  { item_id: 'SUP-FOAM-BOX', item_name: 'กล่องโฟม', item_type: 'factory_supply', category: 'อุปกรณ์โรงงาน', unit: 'pcs', reorder_level: 20 },
  { item_id: 'FG-MEATBALL-LARGE', item_name: 'ลูกชิ้นสูตรใหญ่', item_type: 'finished_good', category: 'สินค้าสำเร็จรูป', unit: 'ชุด', reorder_level: 10 },
  { item_id: 'FG-MOOYOR-MAIN', item_name: 'หมูยอสูตรหลัก', item_type: 'finished_good', category: 'สินค้าสำเร็จรูป', unit: 'ชุด', reorder_level: 10 }
];

var MEEHENG_RECIPE_MASTER = [
  { product_id: 'FG-MEATBALL-LARGE', product_name: 'ลูกชิ้นสูตรใหญ่', version: 'V1', ingredient_id: 'RM-FLOUR', ingredient_name: 'แป้ง', qty_per_batch: 3.5, unit: 'kg' },
  { product_id: 'FG-MEATBALL-LARGE', product_name: 'ลูกชิ้นสูตรใหญ่', version: 'V1', ingredient_id: 'RM-BAKING-POWDER', ingredient_name: 'ผงฟู', qty_per_batch: 0.3, unit: 'kg' },
  { product_id: 'FG-MEATBALL-LARGE', product_name: 'ลูกชิ้นสูตรใหญ่', version: 'V1', ingredient_id: 'RM-PRESERVATIVE', ingredient_name: 'กันบูด', qty_per_batch: 0.2, unit: 'kg' },
  { product_id: 'FG-MEATBALL-LARGE', product_name: 'ลูกชิ้นสูตรใหญ่', version: 'V1', ingredient_id: 'RM-GLUTEN', ingredient_name: 'กลูเตน', qty_per_batch: 0.3, unit: 'kg' },
  { product_id: 'FG-MEATBALL-LARGE', product_name: 'ลูกชิ้นสูตรใหญ่', version: 'V1', ingredient_id: 'RM-PORK-SEASONING', ingredient_name: 'ผงปรุงรสหมู', qty_per_batch: 0.25, unit: 'kg' },
  { product_id: 'FG-MEATBALL-LARGE', product_name: 'ลูกชิ้นสูตรใหญ่', version: 'V1', ingredient_id: 'RM-MSG', ingredient_name: 'หัวชูรส', qty_per_batch: 0.15, unit: 'kg' },
  { product_id: 'FG-MEATBALL-LARGE', product_name: 'ลูกชิ้นสูตรใหญ่', version: 'V1', ingredient_id: 'RM-WHITE-PEPPER', ingredient_name: 'พริกไทยขาว', qty_per_batch: 3, unit: 'tbsp' },
  { product_id: 'FG-MEATBALL-LARGE', product_name: 'ลูกชิ้นสูตรใหญ่', version: 'V1', ingredient_id: 'RM-BLACK-PEPPER', ingredient_name: 'พริกไทยดำ', qty_per_batch: 1, unit: 'tbsp' },
  { product_id: 'FG-MEATBALL-LARGE', product_name: 'ลูกชิ้นสูตรใหญ่', version: 'V1', ingredient_id: 'RM-SALT', ingredient_name: 'เกลือ', qty_per_batch: 0.2, unit: 'kg' },
  { product_id: 'FG-MOOYOR-MAIN', product_name: 'หมูยอสูตรหลัก', version: 'V1', ingredient_id: 'RM-MODIFIED-STARCH', ingredient_name: 'แป้งโม', qty_per_batch: 2.5, unit: 'kg' },
  { product_id: 'FG-MOOYOR-MAIN', product_name: 'หมูยอสูตรหลัก', version: 'V1', ingredient_id: 'RM-MIX-POWDER', ingredient_name: 'ผงมิกซ์', qty_per_batch: 0.3, unit: 'kg' },
  { product_id: 'FG-MOOYOR-MAIN', product_name: 'หมูยอสูตรหลัก', version: 'V1', ingredient_id: 'RM-PRESERVATIVE', ingredient_name: 'กันบูด', qty_per_batch: 0.2, unit: 'kg' },
  { product_id: 'FG-MOOYOR-MAIN', product_name: 'หมูยอสูตรหลัก', version: 'V1', ingredient_id: 'RM-SUGAR', ingredient_name: 'น้ำตาลทราย', qty_per_batch: 0.3, unit: 'kg' },
  { product_id: 'FG-MOOYOR-MAIN', product_name: 'หมูยอสูตรหลัก', version: 'V1', ingredient_id: 'RM-GLUTEN', ingredient_name: 'กลูเตน', qty_per_batch: 0.3, unit: 'kg' },
  { product_id: 'FG-MOOYOR-MAIN', product_name: 'หมูยอสูตรหลัก', version: 'V1', ingredient_id: 'RM-PORK-SEASONING', ingredient_name: 'ผงปรุงรสหมู', qty_per_batch: 0.2, unit: 'kg' },
  { product_id: 'FG-MOOYOR-MAIN', product_name: 'หมูยอสูตรหลัก', version: 'V1', ingredient_id: 'RM-MSG', ingredient_name: 'หัวชูรส', qty_per_batch: 0.1, unit: 'kg' },
  { product_id: 'FG-MOOYOR-MAIN', product_name: 'หมูยอสูตรหลัก', version: 'V1', ingredient_id: 'RM-WHITE-PEPPER', ingredient_name: 'พริกไทยขาว', qty_per_batch: 1, unit: 'tbsp' },
  { product_id: 'FG-MOOYOR-MAIN', product_name: 'หมูยอสูตรหลัก', version: 'V1', ingredient_id: 'RM-BLACK-PEPPER', ingredient_name: 'พริกไทยดำ', qty_per_batch: 3, unit: 'tbsp' }
];

var MEEHENG_VENDOR_MASTER = [
  { vendor_id: 'VEN-FRONT', vendor_name: 'หน้าร้าน', phone: '', active: true },
  { vendor_id: 'VEN-MARKET', vendor_name: 'แม่ค้าตลาด', phone: '', active: true },
  { vendor_id: 'VEN-ONLINE', vendor_name: 'ออนไลน์', phone: '', active: true }
];

function seedInventoryMaster_() {
  var existingRows = readObjects_(MEEHENG_SHEETS.INVENTORY);
  var existingById = {};
  var sheet = getSheet_(MEEHENG_SHEETS.INVENTORY);
  var now = new Date();

  existingRows.forEach(function (row) {
    existingById[row.item_id] = row;
  });

  MEEHENG_ITEM_MASTER.forEach(function (item) {
    var existing = existingById[item.item_id];

    if (!existing) {
      appendObject_(MEEHENG_SHEETS.INVENTORY, {
        item_id: item.item_id,
        item_name: item.item_name,
        item_type: item.item_type,
        category: item.category,
        unit: item.unit,
        on_hand: 0,
        reorder_level: item.reorder_level,
        active: true,
        updated_at: now
      });
      return;
    }

    var desired = [
      item.item_id,
      item.item_name,
      item.item_type,
      item.category,
      item.unit,
      existing.on_hand === '' ? 0 : existing.on_hand,
      item.reorder_level,
      existing.active === '' ? true : existing.active,
      existing.updated_at || now
    ];

    var current = [
      existing.item_id,
      existing.item_name,
      existing.item_type,
      existing.category,
      existing.unit,
      existing.on_hand === '' ? 0 : existing.on_hand,
      existing.reorder_level,
      existing.active === '' ? true : existing.active,
      existing.updated_at || now
    ];

    if (JSON.stringify(desired) !== JSON.stringify(current)) {
      sheet.getRange(existing._rowNumber, 1, 1, MEEHENG_HEADERS.Inventory.length).setValues([desired]);
    }
  });
}

function seedRecipeMaster_() {
  var rows = MEEHENG_RECIPE_MASTER.map(function (recipe) {
    return {
      recipe_id: recipe.product_id + '__' + recipe.ingredient_id,
      product_id: recipe.product_id,
      product_name: recipe.product_name,
      version: recipe.version,
      ingredient_id: recipe.ingredient_id,
      ingredient_name: recipe.ingredient_name,
      qty_per_batch: recipe.qty_per_batch,
      unit: recipe.unit
    };
  });

  var existingRows = readObjects_(MEEHENG_SHEETS.RECIPES).map(function (row) {
    return {
      recipe_id: row.recipe_id,
      product_id: row.product_id,
      product_name: row.product_name,
      version: row.version,
      ingredient_id: row.ingredient_id,
      ingredient_name: row.ingredient_name,
      qty_per_batch: toNumber_(row.qty_per_batch),
      unit: row.unit
    };
  });

  if (JSON.stringify(existingRows) === JSON.stringify(rows)) {
    return;
  }

  replaceSheetRows_(MEEHENG_SHEETS.RECIPES, rows);
}

function seedVendorMaster_() {
  var existingRows = readObjects_(MEEHENG_SHEETS.VENDORS);
  var existingById = {};

  existingRows.forEach(function (row) {
    existingById[row.vendor_id] = row;
  });

  MEEHENG_VENDOR_MASTER.forEach(function (vendor) {
    if (!existingById[vendor.vendor_id]) {
      appendObject_(MEEHENG_SHEETS.VENDORS, vendor);
    }
  });
}

function getRecipe(productId) {
  ensureDatabaseReady_();
  return getRecipeRows_(productId);
}

function getRecipeRows_(productId) {
  var rows = readObjects_(MEEHENG_SHEETS.RECIPES);
  return rows.filter(function (row) {
    return row.product_id === productId || row.product_name === productId;
  });
}

function getRecipesForClient_() {
  var recipes = readObjects_(MEEHENG_SHEETS.RECIPES);
  return formatRowsForClient_(recipes);
}

function getProducts_() {
  var items = readObjects_(MEEHENG_SHEETS.INVENTORY);

  return formatRowsForClient_(items.filter(function (item) {
    return item.item_type === 'finished_good' && item.active !== false;
  }));
}

function getStockItems_() {
  var items = readObjects_(MEEHENG_SHEETS.INVENTORY);

  return formatRowsForClient_(items.filter(function (item) {
    return item.item_type !== 'finished_good' && item.active !== false;
  }));
}

function getVendors_() {
  return formatRowsForClient_(readObjects_(MEEHENG_SHEETS.VENDORS).filter(function (vendor) {
    return vendor.active !== false;
  }));
}
