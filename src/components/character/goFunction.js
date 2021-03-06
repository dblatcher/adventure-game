import { reactive } from 'vue'
import { makeOrderPromise } from './orderAdmin'

function skip(path) {
    return [{
        x: path[path.length - 1].x,
        y: path[path.length - 1].y,
        direction: findDirection(path[0], this, this.item.model.validDirections),
        action: this.item.walkCycle
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

    this.item.behaviour_direction = findDirection(destination, this, this.item.model.validDirections)
    return Promise.resolve({ finished: true })
}

function goTo(target, options = {}) {

    let destination = standardiseDestination(target, this.gameInstance);
    if (destination === false) {
        return Promise.resolve({ finished: false, reason: 'not valid destination' })
    }


    if (typeof options.action === 'undefined' || !this.item.model.cycles[options.action]) { options.action = this.item.walkCycle }

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
                direction: findDirection(path[i], i > 0 ? path[i - 1] : this, this.item.model.validDirections),
                action: options.action,
                wasManual: options.wasManual,
            }));
        }
    }

    this.item.destinationQueue = orders;
    var targetOrder = orders[orders.length - 1];


    return makeOrderPromise(this, targetOrder, 'move')

}

export { goTo, turnTo }