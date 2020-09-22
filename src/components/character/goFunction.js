import { reactive } from 'vue'

function skip(path) {
    return [{
        x: path[path.length - 1].x,
        y: path[path.length - 1].y,
        direction: findDirection(path[0], this, this.char.model.validDirections),
        action: this.char.walkCycle
    }];
}


function standardiseDestination(destination, game) {
    function findTargetWalkTo(id) {
        let thing = game.getThings(id)
        return thing ? thing.walkToPoint : false;
    }

    if (typeof destination.x === 'number' && typeof destination.y === 'number') {
        return destination;
    }

    if (typeof destination === 'string') {
        let point = findTargetWalkTo(destination)
        if (point === false) {
            game.$store.commit('debugMessage', `Character.goTo failed: id ${destination} not found`)
            return false;
        }
        return point;
    }

    if (Array.isArray(destination)) {
        if (typeof destination[0] === 'string') {
            let point = findTargetWalkTo(destination[0])
            if (point === false) {
                game.$store.commit('debugMessage', `Character.goTo failed: id ${destination[0]} not found`)
                return false
            }
            return point;
        }

        return { x: destination[0], y: destination[1] }

    }

}


function findDirection(currentPoint, prevPoint, validDirections) {
    let horizontal = currentPoint.x > prevPoint.x ? 'right' : 'left';
    let vertical = currentPoint.y > prevPoint.y ? 'up' : 'down';
    return Math.abs(currentPoint.x - prevPoint.x) > Math.abs(currentPoint.y - prevPoint.y) ?
        horizontal :
        validDirections.includes(vertical) ? vertical : horizontal;
}

// eslint-disable-next-line
function turnTo(target, options = {}) {
    let destination = standardiseDestination(target, this.gameInstance);
    if (destination === false) {
        return Promise.resolve({ finished: false, reason: 'not valid destination' })
    }

    this.char.behaviour_direction = findDirection(destination, this, this.char.model.validDirections)
    return Promise.resolve({ finished: true })
}

function goTo(target, options = {}) {

    let destination = standardiseDestination(target, this.gameInstance);
    if (destination === false) {
        return Promise.resolve({ finished: false, reason: 'not valid destination' })
    }


    if (typeof options.action === 'undefined' || !this.char.model.cycles[options.action]) { options.action = this.char.walkCycle }

    var path = this.gameInstance.findPath(this, destination);
    if (path.length === 0) {
        return Promise.resolve({ finished: false, reason: 'no route', message: `No route found to [${destination.x},${destination.y}]` })
    }


    // create list of orders
    let orders
    if (this.gameInstance.instantMode) {
        orders = skip.apply(this, [path]);
    } else {
        orders = [];
        for (var i = 0; i < path.length; i++) {
            orders.push(reactive({
                x: path[i].x,
                y: path[i].y,
                direction: findDirection(path[i], i > 0 ? path[i - 1] : this, this.char.model.validDirections),
                action: options.action,
                wasManual: options.wasManual,
            }));
        }
    }

    this.char.destinationQueue = orders;
    var targetOrder = orders[orders.length - 1];
    var that = this;


    return new Promise(function (resolve) {

        let handleMoveOrderDone = function (doneOrder) {
            if (doneOrder === targetOrder) {
                that.emitter.off('moveOrderDone', handleMoveOrderDone)
                that.$store.state.gameEmitter.off('changing-room', handleRoomChange)
                if (targetOrder.x === that.x && targetOrder.y === that.y) {
                    resolve({ finished: true, message: `Reached [${targetOrder.x},${targetOrder.y}]` });
                } else {
                    resolve({ finished: false, message: `Did not reach [${targetOrder.x},${targetOrder.y}]` });
                }
                return;
            }
            else if (!that.char.destinationQueue.includes(targetOrder)) {
                that.emitter.off('moveOrderDone', handleMoveOrderDone)
                resolve({ finished: false, reason: 'destination change', message: `Not going to [${targetOrder.x},${targetOrder.y}] any more` })
            }
        }

        let handleRoomChange = function () {
            that.emitter.off('moveOrderDone', handleMoveOrderDone)
            let message = `Game moved room before got to destination [${targetOrder.x},${targetOrder.y}]`
            resolve({
                finished: true,
                reason: 'room change',
                interuptedByChangeOfRoom: true,
                message,
            })
        }

        // subscribe to event fired by this.move (called by onBeat) when a move order is finished
        that.emitter.on('moveOrderDone', handleMoveOrderDone)
        that.$store.state.gameEmitter.once('changing-room', handleRoomChange)

    });

}

export { goTo, turnTo }