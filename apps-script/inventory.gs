function createStockMovement(payload) {

  const movement = {
    movement_id: 'MOV-' + new Date().getTime(),
    datetime: new Date(),
    type: payload.type,
    item_id: payload.item_id,
    item_name: payload.item_name,
    qty: Number(payload.qty),
    unit: payload.unit
  };

  Logger.log(movement);

  return movement;
}
