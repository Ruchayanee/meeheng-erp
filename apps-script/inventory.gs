function receiveStock(payload) {
  return withDbLock_(function () {
    ensureDatabaseReady_();

    var item = findInventoryItem_(payload.item_id || payload.item_name);
    var qty = requirePositiveNumber_(payload.qty, 'จำนวนรับเข้า');
    var unitCost = toNumber_(payload.unit_cost);
    var movement = createStockMovement_({
      type: 'RECEIVE',
      item_id: item.item_id,
      qty: qty,
      ref_type: 'RECEIVE',
      ref_id: payload.ref_id || '',
      note: buildReceiveNote_(payload),
      user: getCurrentUser_()
    });

    var expense = null;
    if (unitCost > 0) {
      expense = createExpense_({
        category: 'ซื้อวัตถุดิบ/สินค้า',
        description: 'รับเข้า ' + item.item_name + ' ' + qty + ' ' + item.unit,
        amount: roundQty_(qty * unitCost),
        note: payload.supplier ? 'ผู้ขาย: ' + payload.supplier : '',
        ref_type: 'STOCK_MOVEMENT',
        ref_id: movement.movement_id
      });
    }

    return {
      ok: true,
      movement: movement,
      expense: expense,
      inventory: getInventory()
    };
  });
}

function createStockMovement(payload) {
  return withDbLock_(function () {
    ensureDatabaseReady_();
    return createStockMovement_(payload);
  });
}

function createStockMovement_(payload) {
  var item = findInventoryItem_(payload.item_id || payload.item_name);
  var qty = roundQty_(toNumber_(payload.qty));

  if (qty === 0) {
    throw new Error('จำนวนเคลื่อนไหวสต๊อกต้องไม่เป็น 0');
  }

  var currentQty = roundQty_(toNumber_(item.on_hand));
  var nextQty = roundQty_(currentQty + qty);

  if (nextQty < 0 && payload.allow_negative !== true) {
    throw new Error('สต๊อกไม่พอ: ' + item.item_name + ' มี ' + currentQty + ' ' + item.unit + ' ต้องใช้ ' + Math.abs(qty) + ' ' + item.unit);
  }

  updateInventoryBalance_(item.item_id, nextQty);

  var movement = {
    movement_id: payload.movement_id || makeId_('MOV'),
    datetime: new Date(),
    type: payload.type || 'ADJUSTMENT',
    item_id: item.item_id,
    item_name: item.item_name,
    qty: qty,
    unit: item.unit,
    balance_after: nextQty,
    ref_type: payload.ref_type || '',
    ref_id: payload.ref_id || '',
    note: payload.note || '',
    user: payload.user || getCurrentUser_()
  };

  appendObject_(MEEHENG_SHEETS.STOCK_MOVEMENTS, movement);
  return formatRowsForClient_([movement])[0];
}

function getInventory() {
  ensureDatabaseReady_();

  return formatRowsForClient_(readObjects_(MEEHENG_SHEETS.INVENTORY).map(function (item) {
    var onHand = roundQty_(item.on_hand);
    var reorderLevel = roundQty_(item.reorder_level);
    var status = 'ok';

    if (onHand <= 0) {
      status = 'out';
    } else if (reorderLevel > 0 && onHand <= reorderLevel) {
      status = 'low';
    }

    return {
      item_id: item.item_id,
      item_name: item.item_name,
      item_type: item.item_type,
      category: item.category,
      unit: item.unit,
      on_hand: onHand,
      reorder_level: reorderLevel,
      active: item.active,
      status: status,
      updated_at: item.updated_at
    };
  }));
}

function getRecentStockMovements(limit) {
  ensureDatabaseReady_();

  var rows = readObjects_(MEEHENG_SHEETS.STOCK_MOVEMENTS);
  var rowLimit = limit || 20;
  return formatRowsForClient_(rows.slice(Math.max(rows.length - rowLimit, 0)).reverse());
}

function updateInventoryItem(payload) {
  return withDbLock_(function () {
    ensureDatabaseReady_();

    var item = findInventoryItem_(payload.item_id);
    var nextOnHand = payload.on_hand === undefined || payload.on_hand === ''
      ? roundQty_(item.on_hand)
      : roundQty_(payload.on_hand);
    var currentOnHand = roundQty_(item.on_hand);
    var difference = roundQty_(nextOnHand - currentOnHand);

    if (difference !== 0) {
      createStockMovement_({
        type: 'ADJUSTMENT',
        item_id: item.item_id,
        qty: difference,
        allow_negative: true,
        ref_type: 'INVENTORY_EDIT',
        ref_id: item.item_id,
        note: 'แก้ไขยอดคงเหลือจากหน้าแอป',
        user: getCurrentUser_()
      });
      item = findInventoryItem_(item.item_id);
    }

    var updated = {
      item_id: item.item_id,
      item_name: normalizeText_(payload.item_name) || item.item_name,
      item_type: normalizeText_(payload.item_type) || item.item_type,
      category: normalizeText_(payload.category) || item.category,
      unit: normalizeText_(payload.unit) || item.unit,
      on_hand: nextOnHand,
      reorder_level: payload.reorder_level === undefined || payload.reorder_level === ''
        ? roundQty_(item.reorder_level)
        : roundQty_(payload.reorder_level),
      active: parseBoolean_(payload.active, item.active !== false),
      updated_at: new Date()
    };

    updateObjectRow_(MEEHENG_SHEETS.INVENTORY, item._rowNumber, updated);

    return {
      ok: true,
      item: formatRowsForClient_([updated])[0],
      inventory: getInventory()
    };
  });
}

function findInventoryItem_(idOrName) {
  var lookup = normalizeText_(idOrName);

  if (!lookup) {
    throw new Error('กรุณาเลือกรายการสต๊อก');
  }

  var rows = readObjects_(MEEHENG_SHEETS.INVENTORY);

  for (var index = 0; index < rows.length; index += 1) {
    if (rows[index].item_id === lookup || rows[index].item_name === lookup) {
      return rows[index];
    }
  }

  throw new Error('ไม่พบรายการสต๊อก: ' + lookup);
}

function updateInventoryBalance_(itemId, nextQty) {
  var sheet = getSheet_(MEEHENG_SHEETS.INVENTORY);
  var rows = readObjects_(MEEHENG_SHEETS.INVENTORY);

  for (var index = 0; index < rows.length; index += 1) {
    if (rows[index].item_id === itemId) {
      sheet.getRange(rows[index]._rowNumber, 6).setValue(nextQty);
      sheet.getRange(rows[index]._rowNumber, 9).setValue(new Date());
      return;
    }
  }

  throw new Error('ไม่พบแถวสต๊อกสำหรับ ' + itemId);
}

function buildReceiveNote_(payload) {
  var parts = [];

  if (payload.supplier) {
    parts.push('ผู้ขาย: ' + payload.supplier);
  }

  if (toNumber_(payload.unit_cost) > 0) {
    parts.push('ต้นทุน/หน่วย: ' + payload.unit_cost);
  }

  if (payload.note) {
    parts.push(payload.note);
  }

  return parts.join(' | ');
}
