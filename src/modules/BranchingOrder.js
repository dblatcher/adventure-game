import { StandardOrder } from "./StandardOrder"


class BranchingOrder {
    constructor (inputObject) {
        const { initialOrderArguments, outcomeMap, finishedOutcome, notFinishedOutcome} = inputObject;

        this.initialOrder = new StandardOrder (...initialOrderArguments)

        
        if (outcomeMap) {
            this.outcomes = {}
            for (let outcomeName in outcomeMap) {
                this.outcomes[outcomeName] = outcomeMap[outcomeName].map(entry => new StandardOrder(...entry))
            }
        }

        if (finishedOutcome) {
            this.finishedOutcome = finishedOutcome.map(entry => new StandardOrder(...entry))
        }

        if (notFinishedOutcome) {
            this.notFinishedOutcome = notFinishedOutcome.map(entry => new StandardOrder(...entry))
        }

    }

    get isConditionalOrder() {return true}

    toString() {

        let outcomeMapString = this.outcomes ? 
        `[${Object.keys(this.outcomes).toString()}]` 
        : ''; 

        let fallbackString = this.finishedOutcome || this.notFinishedOutcome ?
        `[${this.finishedOutcome ? 'finish,' : '' }${this.notFinishedOutcome ? 'not finish,' : '' }]`
        :'';

        return `BranchingOrder{${this.initialOrder.toString()} => ${outcomeMapString} ${fallbackString}}`
    }

    execute(game) {
        const {initialOrder, outcomes, finishedOutcome, notFinishedOutcome} = this;

        return initialOrder.execute(game)
        .then( result => {
            if (result.outcome && outcomes) {
                if (outcomes[result.outcome]) {
                    return game.runSequence(outcomes[result.outcome])
                }
                game.$store.commit('debugMessage', `${this.toString()} had no outcome matching the result's outcome of '${result.outcome}'.`)
            }

            if (result.finished && finishedOutcome) { return game.runSequence(finishedOutcome)}
            if (!result.finished && notFinishedOutcome) { return game.runSequence(notFinishedOutcome)}

            game.$store.commit('debugMessage', `${this.toString()} had no outcome for the result.`)
            return Promise.resolve({finished:false})
        })
    }
}

export { BranchingOrder }