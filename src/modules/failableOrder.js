import { StandardOrder } from "./StandardOrder"

class failableOrder extends StandardOrder{

    constructor (actorIdOrOrderString, actionOrOptions, target, options={}) {
        if (target) {
            super (actorIdOrOrderString, actionOrOptions, target, options)
        } else {
            super (actorIdOrOrderString, actionOrOptions)
        }
    }

    evaluate(result) {
        return result.finished
    }
}

export {failableOrder}