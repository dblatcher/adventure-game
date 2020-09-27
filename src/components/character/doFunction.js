import { reactive } from 'vue'
import { makeOrderPromise } from './orderAdmin'

export default function (action, options = {}) {
    //validate inputs
    if (typeof action !== 'string') {
        let warningMessage = 'Action order skipped: non-string value for ' + this.name + '.'
        this.$store.commit('debugMessage', warningMessage)
        return Promise.resolve({
            finished: true,
            message: warningMessage
        });
    }
    if (!this.item.model.cycles[action]) {
        let warningMessage = 'Action order skipped: ' + action + ' is not a cycle of ' + this.name + '.'
        this.$store.commit('debugMessage', warningMessage)
        return Promise.resolve({
            finished: true,
            message: warningMessage
        });
    }

    // default options.direction to current direction
    if (!options.direction) { options.direction = this.currentDirection }

    //ensure options.direction is a direction supported by the character model's cycle;
    var availableDirections = Object.keys(this.item.model.cycles[action]);
    if (!availableDirections.includes(options.direction)) {
        options.direction = availableDirections[0];
    }

    var currentOrder = reactive (Object.assign({ action: action, actFrame: 0 }, options));

    if (this.gameInstance.instantMode) {
        this.$store.commit('debugMessage', `skipped - ${this.name} doing ${currentOrder.action}`);
        return Promise.resolve({
            finished: true,
            message: this.ident + ' finished action:' + currentOrder.action
        });
    }

    this.item.actionQueue = [currentOrder];


    return makeOrderPromise(this, currentOrder, 'action')


}