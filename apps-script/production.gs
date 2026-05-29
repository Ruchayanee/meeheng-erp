function createProduction(productId, qty, note) {
  return withDbLock_(function () {
    ensureDatabaseReady_();

    var product = findInventoryItem_(productId);
    var batches = requirePositiveNumber_(qty, 'จำนวนผลิต');
    var recipe = getRecipeRows_(product.item_id);

    if (product.item_type !== 'finished_good') {
      throw new Error('ผลิตได้เฉพาะสินค้าสำเร็จรูป');
    }

    if (recipe.length === 0) {
      throw new Error('ยังไม่มีสูตรสำหรับสินค้า: ' + product.item_name);
    }

    var requirements = buildProductionRequirements_(recipe, batches);
    var shortages = requirements.filter(function (requirement) {
      return requirement.on_hand < requirement.required_qty;
    });

    if (shortages.length > 0) {
      throw new Error('วัตถุดิบไม่พอ: ' + shortages.map(function (item) {
        return item.ingredient_name + ' ขาด ' + roundQty_(item.required_qty - item.on_hand) + ' ' + item.unit;
      }).join(', '));
    }

    var productionId = makeId_('PROD');
    var movements = [];

    requirements.forEach(function (requirement) {
      movements.push(createStockMovement_({
        type: 'PRODUCTION_CONSUME',
        item_id: requirement.ingredient_id,
        qty: -requirement.required_qty,
        ref_type: 'PRODUCTION',
        ref_id: productionId,
        note: 'ผลิต ' + product.item_name + ' ' + batches + ' ' + product.unit,
        user: getCurrentUser_()
      }));
    });

    movements.push(createStockMovement_({
      type: 'PRODUCTION_OUTPUT',
      item_id: product.item_id,
      qty: batches,
      ref_type: 'PRODUCTION',
      ref_id: productionId,
      note: note || '',
      user: getCurrentUser_()
    }));

    var productionLog = {
      production_id: productionId,
      datetime: new Date(),
      product_id: product.item_id,
      product_name: product.item_name,
      batches: batches,
      output_qty: batches,
      unit: product.unit,
      status: 'DONE',
      note: note || '',
      user: getCurrentUser_()
    };

    appendObject_(MEEHENG_SHEETS.PRODUCTION_LOGS, productionLog);

    return {
      ok: true,
      production: formatRowsForClient_([productionLog])[0],
      materials: requirements,
      movements: movements,
      inventory: getInventory()
    };
  });
}

function getProductionPreview(productId, qty) {
  ensureDatabaseReady_();

  var product = findInventoryItem_(productId);
  var batches = requirePositiveNumber_(qty || 1, 'จำนวนผลิต');
  var recipe = getRecipeRows_(product.item_id);

  if (product.item_type !== 'finished_good') {
    throw new Error('ดูสูตรผลิตได้เฉพาะสินค้าสำเร็จรูป');
  }

  return {
    product: {
      item_id: product.item_id,
      item_name: product.item_name,
      unit: product.unit
    },
    batches: batches,
    requirements: buildProductionRequirements_(recipe, batches)
  };
}

function getRecentProductions(limit) {
  ensureDatabaseReady_();

  var rows = readObjects_(MEEHENG_SHEETS.PRODUCTION_LOGS);
  var rowLimit = limit || 20;
  return formatRowsForClient_(rows.slice(Math.max(rows.length - rowLimit, 0)).reverse());
}

function buildProductionRequirements_(recipe, batches) {
  return recipe.map(function (recipeItem) {
    var inventoryItem = findInventoryItem_(recipeItem.ingredient_id);
    var requiredQty = roundQty_(toNumber_(recipeItem.qty_per_batch) * batches);
    var onHand = roundQty_(inventoryItem.on_hand);

    return {
      ingredient_id: recipeItem.ingredient_id,
      ingredient_name: recipeItem.ingredient_name,
      qty_per_batch: roundQty_(recipeItem.qty_per_batch),
      required_qty: requiredQty,
      unit: recipeItem.unit,
      on_hand: onHand,
      after_production: roundQty_(onHand - requiredQty),
      enough: onHand >= requiredQty
    };
  });
}
