function getRecipe(productId) {

  const recipes = {
    'MEATBALL_SMALL': [
      { item_name: 'หมูบด', qty: 0.5, unit: 'kg' },
      { item_name: 'แป้ง', qty: 0.1, unit: 'kg' },
      { item_name: 'ถุง', qty: 1, unit: 'piece' },
      { item_name: 'สติ๊กเกอร์', qty: 1, unit: 'piece' }
    ],

    'MEATBALL_LARGE': [
      { item_name: 'หมูบด', qty: 0.8, unit: 'kg' },
      { item_name: 'แป้ง', qty: 0.2, unit: 'kg' },
      { item_name: 'ถุง', qty: 1, unit: 'piece' },
      { item_name: 'สติ๊กเกอร์', qty: 1, unit: 'piece' }
    ]
  };

  return recipes[productId] || [];
}
