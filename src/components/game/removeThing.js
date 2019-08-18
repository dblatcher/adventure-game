export default function (id, options={} ) {
    if (typeof id === 'object') {id=id.ident}
    var currentList, currentIndex;

    if (id.endsWith('_W')) {
      currentList = this.rooms[this.roomNumber].worldItems;
      for (var i=0; i<currentList.length; i++) {
        if (currentList[i].id === id) {currentIndex = i; break;}
      }
      currentList.splice(currentIndex,1);
    } else {
      for (var i=0; i<this.allCharacters.length; i++) {
        if (this.allCharacters[i].id === id) {currentIndex = i; break;}
      }
      this.allCharacters[currentIndex].room = null;
    }

  }