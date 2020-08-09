
function getInventoryItem (id, options={}) {
    let item = this.inventoryItems.filter(function(a){return a.id==id})[0];
    if(!item){
      this.$store.commit('debugMessage', `no inventory item with id ${id}`)
      return false;
    }

    return item.add(null, options)
}

function looseInventoryItem (id, options={}) {
    let item = this.inventoryItems.filter(function(a){return a.id==id})[0];
    if(!item) {
      this.$store.commit('debugMessage', `no inventory item with id ${id}`)
      return false;
    }

    return item.loose(null, options)
}

export { getInventoryItem, looseInventoryItem }