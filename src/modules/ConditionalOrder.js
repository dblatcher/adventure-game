import { StandardCondition } from "./StandardCondition"
import { StandardOrder } from "./StandardOrder"

class ConditionalOrder {
    constructor (inputObject) {
        const { conditions, orderIfTrue, orderIfFalse} = inputObject;
        this.conditions = conditions.map( condition => {
            return new StandardCondition(...condition)
        })
        this.orderIfTrue = orderIfTrue ? 
        new StandardOrder(...orderIfTrue) : null;
        this.orderIfFalse = orderIfFalse ? 
        new StandardOrder(...orderIfFalse) : null;
    }

    get isConditionalOrder() {return true}

    execute(game) {
        const {conditions, orderIfTrue, orderIfFalse} = this;

        let conditionsPassed = conditions.map( 
            (condition)=>{ return condition.evaluate(game)}
        ).includes(false) === false;

        if (conditionsPassed && orderIfTrue) {return orderIfTrue.execute(game)}
        if (!conditionsPassed && orderIfFalse) {return orderIfFalse.execute(game)}
        return Promise.resolve({
            finished:true,
            message: conditionsPassed ? 'condiitions passed and no order if true' : 'condiitions failed but not order if false' 
        })
    }
}

export { ConditionalOrder }