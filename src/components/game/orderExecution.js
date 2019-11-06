import makeChain from "../../modules/chainPromises";

function findActor (actorId) {
    let game = this;
    if (!actorId || actorId === 'GAME') { return game}
    if (actorId === 'VAR') {return game.gameVars}
    if ( game.getThings(actorId) ) { return game.getThings(actorId) }



    // if character or roomObject, need to distinguish if in room
    let suffix = actorId.substring( actorId.length-2)
    if (suffix === '_W') {
        let idSet = actorId.split('.');
        if (idSet.length === 2 && game.allRoomItemData[idSet[0]]) {
            return  game.allRoomItemData[idSet[0]][idSet[1]]
        }
    }
    return false;
}


function executeStandardOrder(order) {
    let actor = findActor.apply(this,[order.actorId])

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

function evaluateStandardCondition (condition) {
    let actor = findActor.apply(this,[condition.actorId])

    if (!actor) {
        console.warn(`condition invalid: ${condition.actorId}' not found`)
        return true
    }

    switch (condition.operator) {
        case "true":
            return !!actor[condition.property]; 
        case "false":
            return !actor[condition.property]; 
        case "=":
        case "==":
        case "===":
            return actor[condition.property] == condition.comparitor;
        case "!=":
        case "!==":
        case "<>":
            return actor[condition.property] !== condition.comparitor;
    }

    console.warn ('condition invalid',condition)
    return true
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


export {executeStandardOrder, evaluateStandardCondition, runSequence}