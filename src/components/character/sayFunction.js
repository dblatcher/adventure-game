import { reactive } from 'vue'
import { makeOrderPromise } from './orderAdmin'

function executeSayOrder(order) {
    this.saying = order.text;
    this.sayingCountDown = order.time * (this.$store.getters.options.textDelay / 100);
    if (this.item.destinationQueue.length === 0) { //not moving
        if (this.item.model.cycles[order.action]) { //and the character model has a cycle matching the action options 
            this.item.behaviour_action = order.action;
            this.item.behaviour_actFrame = 0;
        }
    }
}


function say(text, options = {}) {
    if (typeof options.time !== 'number') { options.time = 3000 }
    if (typeof options.action !== 'string') { options.action = this.item.talkCycle }
    var currentOrder = reactive( Object.assign({ text: text }, options));

    if (this.gameInstance.instantMode) {
        this.$store.commit('debugMessage', `skipped - ${this.name}: ${currentOrder.text}`)
        return Promise.resolve({
            finished: true,
            message: `${this.name} finished saying "${currentOrder.text}".`
        })
    }

    this.item.sayingQueue.push(currentOrder);
    if (this.saying === '') { // to do - stop using this.saying - should be === this.sayingQueue[0].text
        executeSayOrder.apply(this, [currentOrder]);
    }

    return makeOrderPromise(this, currentOrder, 'say')
}

function countDownSpeech(beat) {

    if (this.sayingCountDown || this.saying) { // to do - stop using this.saying - the test should be based on the queue
        this.sayingCountDown = this.sayingCountDown - beat.delay;
        if (this.gameInstance.instantMode) { this.sayingCountDown = 0 }

        if (this.sayingCountDown <= 0) {
            this.sayingCountDown = 0;
            this.saying = '';
            if (this.item.destinationQueue.length === 0) { //ie character is not moving
                this.item.behaviour_action = this.item.waitCycle;
                this.item.behaviour_actFrame = 0;
            }

            this.emitter.emit('sayOrderDone', this.item.sayingQueue[0])
            this.item.sayingQueue.shift() // remove current order from queue

            if (this.item.sayingQueue.length > 0) { //execute queued order with no promise
                executeSayOrder.apply(this, [this.item.sayingQueue[0]]);
            }
        }
    }


}

export { say, countDownSpeech }