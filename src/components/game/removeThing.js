// eslint-disable-next-line
export default function (id, options={} ) {
    if (typeof id === 'object') {id=id.id}

    if (id.endsWith('_W')) {
      this.rooms[this.roomNumber].worldItems.forEach(thing => {
        if (thing.id === id ) { thing.removed = true}
      });
    }

    if (id.endsWith('_C')) {

      this.allCharacters.forEach(thing => {
        if (thing.id === id) {thing.room = null}
      })

    }

  }