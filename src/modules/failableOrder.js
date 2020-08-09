import { StandardOrder } from "./StandardOrder"

class failableOrder extends StandardOrder{

    constructor (actorIdOrOrderString, actionOrOptions, target, options={}) {
        if (target) {
            super (actorIdOrOrderString, actionOrOptions, target, options)
        } else {
            super (actorIdOrOrderString, actionOrOptions)
        }
    }

    toString() {
        if (this.actorId === 'GAME') {
            return `FailableOrder{${this.action}: ${this.target}}`
        }
        return `FailableOrder{${this.actorId} ${this.action}: ${this.target}}`
    }

    evaluate(result) {
        return result.finished
    }
}

export {failableOrder}