export default function getComponentOrDataObject (input) {
    if (!input || input.toUpperCase() === 'GAME') {return this}
    input = input.toUpperCase();

    if (input === 'VAR') {return this.gameVars}

    let idSet = input.split('.');
    let id = idSet.pop();
    if (id === 'PC') {id = this.pcId}
    let roomId = idSet.pop();
    let currentRoomId = this.rooms[this.roomNumber].id;

    if (this.getThings(id)) {return this.getThings(id)}

    let suffix = id.substring( id.length-2)

    switch (suffix) {

        case '_W':
            let data = this.allRoomItemData;
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
                if (matches.length > 1) {console.warn(`More than one ${id} found.`)}
                return matches.shift();
            }
            break;
        case '_C':
            return this.allCharactersAsObject[id];
            break;
        case '_I':
            return this.allInventoryItemsAsObject[id]
            break;

    };

    return false;

}