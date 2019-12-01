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


function executeOrder (order) {

    if (order.isStandardOrder) { return order.execute(this) }

    if (order.isConditionalOrder) {
        let conditionsPassed = order.conditions.map( 
            (condition)=>{ return condition.evaluate(this)}
        ).includes(false) === false;

        if (conditionsPassed && order.orderIfTrue) {return order.orderIfTrue.execute(this)}
        if (!conditionsPassed && order.orderIfFalse) {return order.orderIfFalse.execute(this)}
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


export {executeOrder, runSequence, resolveDestination}