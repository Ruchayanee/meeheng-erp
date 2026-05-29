function createSale(payload) {
  return withDbLock_(function () {
    ensureDatabaseReady_();

    var product = findInventoryItem_(payload.product_id || payload.product_name);
    var qty = requirePositiveNumber_(payload.qty, 'จำนวนขาย');
    var unitPrice = requirePositiveNumber_(payload.unit_price, 'ราคาขายต่อหน่วย');
    var saleId = makeId_('SALE');
    var total = roundQty_(qty * unitPrice);

    if (product.item_type !== 'finished_good') {
      throw new Error('ขายได้เฉพาะสินค้าสำเร็จรูป');
    }

    var movement = createStockMovement_({
      type: 'SALE_OUT',
      item_id: product.item_id,
      qty: -qty,
      ref_type: 'SALE',
      ref_id: saleId,
      note: payload.note || '',
      user: getCurrentUser_()
    });

    var saleLog = {
      sale_id: saleId,
      datetime: new Date(),
      vendor_name: normalizeText_(payload.vendor_name) || 'หน้าร้าน',
      product_id: product.item_id,
      product_name: product.item_name,
      qty: qty,
      unit: product.unit,
      unit_price: unitPrice,
      total: total,
      note: payload.note || '',
      user: getCurrentUser_()
    };

    appendObject_(MEEHENG_SHEETS.SALES_LOGS, saleLog);

    return {
      ok: true,
      sale: formatRowsForClient_([saleLog])[0],
      movement: movement,
      inventory: getInventory()
    };
  });
}

function getRecentSales(limit) {
  ensureDatabaseReady_();

  var rows = readObjects_(MEEHENG_SHEETS.SALES_LOGS);
  var rowLimit = limit || 20;
  return formatRowsForClient_(rows.slice(Math.max(rows.length - rowLimit, 0)).reverse());
}
