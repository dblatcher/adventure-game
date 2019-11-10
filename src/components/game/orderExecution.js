import makeChain from "../../modules/chainPromises";


function executeStandardOrder(order) {
    let actor = this.getComponentOrDataObject(order.actorId)

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
    let actor = this.getComponentOrDataObject(order.actorId)

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