export default function getComponentOrDataObject (input) {
    if (!input || input.toUpperCase() === 'GAME') {return this}
    input = input.toUpperCase();

    if (input === 'VAR') {return this.gameVars}

    //TO DO - document and/or simplify!
    let idSet = input.split('.');
    let id = idSet.pop();
    if (id === 'PC') {id = this.pcId}
    let roomId = idSet.pop();
    let currentRoomId = this.rooms[this.roomNumber].id;
    if (roomId === 'HERE') {roomId = currentRoomId}

    if (this.getThings(id)) {return this.getThings(id)}

    let suffix = id.substring( id.length-2)
    let data = this.allRoomItemData;

    switch (suffix) {

        case '_W':
            if (roomId) {
                if (data[roomId]) { return data[roomId][id] }
            } else {
                if (data[currentRoomId][id]) { 
                    return this.data[currentRoomId][id]
                }
                let matches = [];
                Object.keys(data).forEach(rId=> {
                    if (data[rId][id]){matches.push(data[rId][id])}
                })
                if (matches.length > 1) {
                    this.$store.commit('debugMessage', `There is more than one WorldItem with id ${id}.`)
                }
                return matches.shift();
            }
            break;
        case '_C':
            return this.allCharactersAsObject[id];
        case '_I':
            return this.allInventoryItemsAsObject[id]

    }

    return false;

}