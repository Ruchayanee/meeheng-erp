function createProduction(productId, qty) {

  const recipe = getRecipe(productId);

  const result = [];

  recipe.forEach(item => {

    const totalQty = Number(item.qty) * Number(qty);

    createStockMovement({
      type: 'PRODUCTION_CONSUME',
      item_name: item.item_name,
      qty: -totalQty,
      unit: item.unit
    });

    result.push({
      item: item.item_name,
      consumed: totalQty,
      unit: item.unit
    });
  });

  createStockMovement({
    type: 'PRODUCTION_OUTPUT',
    item_name: productId,
    qty: qty,
    unit: 'bag'
  });

  return {
    ok: true,
    product: productId,
    qty: qty,
    materials: result
  };
}
