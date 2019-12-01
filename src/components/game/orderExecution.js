import makeChain from "../../modules/chainPromises";

function resolveDestination (target) {

    let destinationId, destinationObject;

    if (target.x && target.y) {return target.walkToPoint ? target.walkToPoint : target}

    if (Array.isArray(target) && typeof target[0] === 'number') {
        return {x:target[0], y:target[1]}
    }

    if (typeof target === 'string') {destinationId = target}
    if (Array.isArray(target) && typeof target[0] === 'string') {
        destinationId = target[0];
    }
    
    if (destinationId) {
        destinationObject = this.getComponentOrDataObject(destinationId);
        if (typeof destinationObject !== 'object') {return false} 
        if (destinationObject.walkToPoint) { destinationObject = destinationObject.walkToPoint}
        if (destinationObject.x && destinationObject.y) {return {x: destinationObject.x, y:destinationObject.y}}
    }

    return false;
}

function executeStandardOrder(order) {
    let actor = this.getComponentOrDataObject(order.actorId)
    if (!actor) {
        console.warn(`failed order: ${order.actorId}' not found`)
        return Promise.resolve({result:'failed'})
    }

    if (typeof actor[order.action] !== "function") {
        console.warn(`failed order: ${order.action}' is not a method of ${actor === this? 'Game' : order.actorId }`)
        console.log('failed order:',order)
        return Promise.resolve({})
    }

    let execution = actor[order.action](order.target, order.options || {}, this)
    if (!execution || !execution.then) { return Promise.resolve({result: execution}) }
    return execution;
}

function executeOrder (order) {

    if (order.isStandardOrder) {return executeStandardOrder.apply(this, [order])}

    if (order.isConditionalOrder) {
        let conditionsPassed = order.conditions.map( 
            (condition)=>{ return condition.evaluate(this)}
        ).includes(false) === false;

        if (conditionsPassed && order.orderIfTrue) { return executeStandardOrder.apply (this,[order.orderIfTrue])}
        if (!conditionsPassed && order.orderIfFalse) { return executeStandardOrder.apply (this,[order.orderIfFalse])}
        return Promise.resolve()
    }

}


function runSequence(input, options){

    let sequence = typeof input === "string" ?
    this.sequences[input] : input;

    if (typeof sequence === "function") {
        return sequence.apply(this, [options]);
    }
    
    if (Array.isArray(sequence)) {
        return makeChain(sequence, executeOrder, this)
    }

    console.warn("unrecognised sequence", sequence)
    return Promise.resolve(false)
}


export {executeStandardOrder,executeOrder, runSequence, resolveDestination}