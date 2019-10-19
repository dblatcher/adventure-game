import makeChain from "../../modules/chainPromises";

function executeStandardOrder(order) {
    let game = this;
    let actor;

    if (!order.actorId || order.actorId === 'GAME') {actor = game}
    else if ( game.getThings(order.actorId) ) {
        actor = game.getThings(order.actorId);
    }
    else {
        //find actor
        // if character or roomObject, need to distinguish if in room
        let suffix = order.actorId.substring( order.actorId.length-2)
        if (suffix === '_W') {
            let idSet = order.actorId.split('.');
            if (idSet.length === 2 && game.allRoomItemData[idSet[0]]) {
                actor = game.allRoomItemData[idSet[0]][idSet[1]]
            }
        }
    }

    if (!actor) {
        console.warn(`failed order: ${order.actorId}' not found`)
        return Promise.resolve({})
    }

    if (typeof actor[order.action] !== "function") {
        console.warn(`failed order: ${order.action}' is not a method of ${actor === game? 'Game' : subject.id }`)
        console.log(order.actorId);
        console.log(order);
        return Promise.resolve({})
    }

    let execution = actor[order.action](order.target, order.options || {})
    if (!execution || !execution.then) { return Promise.resolve({result: execution}) }
    return execution;
}

function runSequence(input, options){

    let sequence = typeof input === "string" ?
    this.sequences[input] : input;

    if (typeof sequence === "function") {
        return sequence.apply(this, [options]);
    }
    
    if (Array.isArray(sequence)) {
        return makeChain(sequence, executeStandardOrder, this)
    }

    console.warn("unrecognised sequence", sequence)
    return Promise.resolve(false)
}


export {executeStandardOrder, runSequence}