
function getInventoryItem (id, options={}) {
    let item = this.inventoryItems.filter(function(a){return a.id==id})[0];
    if(!item){
      console.warn(`no inventory item with id ${id}`);
      return false;
    }

    if (!options.quantity) {options.quantity = 1}

    if (item.quantified) {
      if (item.have) {
        item.quantity += options.quantity;
      } else {
        item.quantity = options.quantity;
        item.have = true;
      }
      return item.quantity;
    }

    item.have = true;
    return true;
}

function looseInventoryItem (id, options={}) {
    let item = this.inventoryItems.filter(function(a){return a.id==id})[0];
    if(!item) {
      console.warn(`no inventory item with id ${id}`);
      return false;
    };

    if (!options.quantity) {options.quantity = 1}

    if (item.have === false) {return false};

    if (!item.quantified) {
        item.have = false;
        return true;
    };

    if (options.quantity === 'all') {
        item.quantity = 0;
        item.have = false;
    };

    item.quantity -= options.quantity;
    if (item.quantity <= 0) {item.have = false};
    return item.quantity;
}

export { getInventoryItem, looseInventoryItem }