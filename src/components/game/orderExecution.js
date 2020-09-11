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


function runSequence(input, options){

    let sequence = typeof input === "string" ?
    this.gameData.sequences[input] : input;

    if (typeof sequence === "function") {
        return sequence.apply(this, [options]);
    }
    
    if (Array.isArray(sequence)) {
        return makeChain(
            sequence,
            function(order){return order.execute(this)}, 
            function(order, result) { 

                if (Array.isArray(order)) { //TO DO move this array logic to chain Promises module
                    let subEvaluations = order.map( (subOrder,index) => {
                        if (!subOrder.evaluate) {return true}
                        return subOrder.evaluate(result[index])
                    } )
                    return !subEvaluations.includes(false)
                }

                if (!order.evaluate) {return true}
                return order.evaluate(result, this)
            },
            this)
    }

    this.$store.commit('debugMessage', `Unrecognised sequence: ${input && input.toString ? input.toString() : input}`)
    return Promise.resolve({finished:false})
}


const evalutateWildCard = (wildCardElements, game)=> {
    let targetObject = game.getComponentOrDataObject(wildCardElements[0])
    if (!targetObject) {
        game.$store.commit('debugMessage', `Invalid wild card target object: "${wildCardElements[0]}".`)
        return '**error**'
    }

    let value = targetObject
    for (let i=1; i<wildCardElements.length; i++) {
        if (typeof value[wildCardElements[i]] === 'undefined' || value[wildCardElements[i]] === null) {
            game.$store.commit('debugMessage', `Invalid wild card expression: "${wildCardElements.toString().replace(/,/g,".")}".`)
            return '**error**'
        }
        value = value[wildCardElements[i]]
    }
    return value.toString()
}

const replaceFirstWildCard = (output, game)=> {
    let openBraceIndex = output.indexOf('{{')
    let closeBraceIndex = output.indexOf('}}')
    let wildCardElements = output.substring(openBraceIndex+2, closeBraceIndex).split('.')
    let replacementString = evalutateWildCard(wildCardElements, game)
    return output.substring(0, openBraceIndex) + replacementString + output.substring(closeBraceIndex + 2)
}

function processWildCards(input) {
    let output = input
    while (output.indexOf('{{') !== -1 && output.indexOf('}}') > output.indexOf('{{')) {
        output = replaceFirstWildCard(output, this)
    }
    return output
}

export { runSequence, resolveDestination, processWildCards}