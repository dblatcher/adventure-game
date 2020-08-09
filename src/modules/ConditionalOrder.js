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

    toString() {
        let conditionString = this.conditions.length === 0 ?
        'TRUE' : this.conditions.length === 1 ?
        this.conditions[0].toString() :
        `${this.conditions.length} conditions pass`;

        let passOrderString = this.orderIfTrue ?
        this.orderIfTrue.toString() : 'NOTHING';

        if (!this.orderIfFalse) {
            return `ConditionalOrder{IF (${conditionString}) THEN ${passOrderString}}`
        }

        return `ConditionalOrder{IF (${conditionString}) THEN ${passOrderString} ELSE ${this.orderIfFalse.toString()}}`
    }

    execute(game) {
        const {conditions, orderIfTrue, orderIfFalse} = this;

        let conditionsPassed = conditions.map( 
            (condition)=>{ return condition.evaluate(game)}
        ).includes(false) === false;

        if (conditionsPassed && orderIfTrue) {return orderIfTrue.execute(game)}
        if (!conditionsPassed && orderIfFalse) {return orderIfFalse.execute(game)}
        return Promise.resolve({
            finished:true,
            message: conditionsPassed ? 'conditions passed and no order if true' : 'conditions failed but no order if false' 
        })
    }
}

export { ConditionalOrder }