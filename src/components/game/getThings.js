export default function (ident) {		
    if (ident == 'pc') {ident = this.pcId;}

    var list = [].concat(this.$refs.things); // array of components in room
    var list = this.$refs.things.map(function (item) {return item.$children[0]} );

    var result = {};
    for (var i = 0; i<list.length; i++) {
      if (list[i].ident === ident ){ return list[i]}
      result[list[i].ident] = list[i];
    }
    if (ident) {return false}
    if (this.pcId) {
      result['pc'] = result[this.pcId];
    }
    return result;
}