
function getInventoryItem (id, quantity=1) {
    let item = this.inventoryItems.filter(function(a){return a.id==id})[0];
    if(!item){
      console.warn(`no inventory item with id ${id}`);
      return false;
    }

    if (item.quantified) {
      if (item.have) {
        item.quantity += quantity;
      } else {
        item.quantity = quantity;
        item.have = true;
      }
      return item.quantity;
    }

    item.have = true;
    return true;
}

function looseInventoryItem (id, quantity = 1) {
    let item = this.inventoryItems.filter(function(a){return a.id==id})[0];
    if(!item) {
      console.warn(`no inventory item with id ${id}`);
      return false;
    };

    if (item.have === false) {return false};

    if (!item.quantified) {
        item.have = false;
        return true;
    };

    if (quantity === 'all') {
        item.quantity = 0;
        item.have = false;
    };

    item.quantity -= quantity;
    if (item.quantity <= 0) {item.have = false};
    return item.quantity;
}

export { getInventoryItem, looseInventoryItem }