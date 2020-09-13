import makeChain from "../../modules/chainPromises";

function resolveDestination(target) {

    let destinationId, destinationObject;

    if (target.x && target.y) { return target.walkToPoint ? target.walkToPoint : target }

    if (Array.isArray(target) && typeof target[0] === 'number') {
        return { x: target[0], y: target[1] }
    }

    if (typeof target === 'string') { destinationId = target }
    if (Array.isArray(target) && typeof target[0] === 'string') {
        destinationId = target[0];
    }

    if (destinationId) {
        destinationObject = this.getComponentOrDataObject(destinationId);
        if (typeof destinationObject !== 'object') { return false }
        if (destinationObject.walkToPoint) { destinationObject = destinationObject.walkToPoint }
        if (destinationObject.x && destinationObject.y) { return { x: destinationObject.x, y: destinationObject.y } }
    }

    return false;
}


function runSequence(input, options) {

    let sequence = typeof input === "string" ?
        this.gameData.sequences[input] : input;

    if (typeof sequence === "function") {
        return sequence.apply(this, [options]);
    }

    if (Array.isArray(sequence)) {
        return makeChain(
            sequence,
            function (order) { return order.execute(this) },
            function (order, result) {

                if (Array.isArray(order)) { //TO DO move this array logic to chain Promises module
                    let subEvaluations = order.map((subOrder, index) => {
                        if (!subOrder.evaluate) { return true }
                        return subOrder.evaluate(result[index])
                    })
                    return !subEvaluations.includes(false)
                }

                if (!order.evaluate) { return true }
                return order.evaluate(result, this)
            },
            this)
    }

    this.$store.commit('debugMessage', `Unrecognised sequence: ${input && input.toString ? input.toString() : input}`)
    return Promise.resolve({ finished: false })
}


function startLoopSequence(sequenceName, options) {
    const game = this;
    const roomWhereItHappened = game.rooms[options.roomNumber || game.roomNumber]

    let sequence = game.gameData.sequences[sequenceName];
    if (!sequence) {
        game.$store.commit('debugMessage', `No defined sequence called: ${sequenceName.toString()}`)
        return Promise.resolve({ finished: false })
    }

    if (roomWhereItHappened.sequenceLoops[sequenceName]) {
        game.$store.commit('debugMessage', `Sequence called: ${sequenceName.toString()} is already running in ${roomWhereItHappened.id}`)
        return Promise.resolve({ finished: false })
    }

    let count = 0;
    let max = typeof options.max === 'number' ? options.max : Infinity
    let halted = false
    let interuptedByChangeOfRoom = false

    function makeLoopPromise(startPending = false) {

        let thePromise = new Promise(resolve => {

            if (startPending) {
                interuptedByChangeOfRoom = true
                return new Promise(()=>{})
            }

            function execute() {
                return game.runSequence(sequence, options).then(result => { return repeatOrExit(result) })
            }
            function repeatOrExit(result) {
                if (result.finished && !halted && count < max) {
                    count++
                    return execute()
                }

                if (result.interuptedByChangeOfRoom || (
                    result.results && result.results.map(item => item.interuptedByChangeOfRoom).indexOf(true) != -1)) {
                    interuptedByChangeOfRoom = true
                    game.$store.commit('debugMessage', `looping sequence ${sequenceName} interupted by change of room from ${roomWhereItHappened.id}`)
                    return resolve(result)
                }

                game.$store.commit('debugMessage', `looping sequence ${sequenceName} finished in ${roomWhereItHappened.id}`)
                game.$delete(roomWhereItHappened.sequenceLoops, sequenceName)
                return resolve(result)

            }

            return execute()
        })

        thePromise.interface = {
            sequenceName,
            haltLoop() {
                halted = true
            },
            getCount() {
                return count
            },
            restart() {

                if (halted === true) {
                    game.$store.commit('debugMessage', `not restarting sequence ${sequenceName} in ${roomWhereItHappened.id} because it was halted`)
                    game.$delete(roomWhereItHappened.sequenceLoops, sequenceName)
                    return
                }

                game.$store.commit('debugMessage', `restarting sequence ${sequenceName} in ${roomWhereItHappened.id}`)
                game.$set(roomWhereItHappened.sequenceLoops, sequenceName, makeLoopPromise(false))
            },
            getInteruptedByChangeOfRoom() {
                return interuptedByChangeOfRoom
            },
            getOriginalArguments() {
                return { sequenceName, options, max }
            }
        }
        return thePromise
    }

    let loopPromise = makeLoopPromise(roomWhereItHappened != game.rooms[game.roomNumber])
    game.$set(roomWhereItHappened.sequenceLoops, sequenceName, loopPromise)
    return loopPromise
}

function haltLoopSequence (sequenceName, options) {
    const game = this;
    const roomWhereItHappened = game.rooms[options.roomNumber || game.roomNumber]

    let sequence = game.gameData.sequences[sequenceName];
    if (!sequence) {
        game.$store.commit('debugMessage', `No defined sequence called: ${sequenceName.toString()}`)
        return Promise.resolve({ finished: false })
    }

    if (!roomWhereItHappened.sequenceLoops[sequenceName] || !roomWhereItHappened.sequenceLoops[sequenceName].interface) {
        game.$store.commit('debugMessage', `Sequence "${sequenceName.toString()}" is not running in ${roomWhereItHappened.name}`)
    }

    roomWhereItHappened.sequenceLoops[sequenceName].interface.haltLoop()

    return Promise.resolve({
        finished: true
    })
}

const evalutateWildCard = (wildCardElements, game) => {
    let targetObject = game.getComponentOrDataObject(wildCardElements[0])
    if (!targetObject) {
        game.$store.commit('debugMessage', `Invalid wild card target object: "${wildCardElements[0]}".`)
        return '**error**'
    }

    let value = targetObject
    for (let i = 1; i < wildCardElements.length; i++) {
        if (typeof value[wildCardElements[i]] === 'undefined' || value[wildCardElements[i]] === null) {
            game.$store.commit('debugMessage', `Invalid wild card expression: "${wildCardElements.toString().replace(/,/g, ".")}".`)
            return '**error**'
        }
        value = value[wildCardElements[i]]
    }
    return value.toString()
}

const replaceFirstWildCard = (output, game) => {
    let openBraceIndex = output.indexOf('{{')
    let closeBraceIndex = output.indexOf('}}')
    let wildCardElements = output.substring(openBraceIndex + 2, closeBraceIndex).split('.')
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

export { runSequence, startLoopSequence, haltLoopSequence, resolveDestination, processWildCards }