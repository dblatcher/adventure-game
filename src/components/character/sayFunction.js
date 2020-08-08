function executeSayOrder (order) {		
    this.saying = order.text;
    this.sayingCountDown = order.time * (this.$store.getters.options.textDelay/100);
    if (this.char.destinationQueue.length === 0) { //not moving
        if (this.char.model.cycles[order.action]) { //and the character model has a cycle matching the action options 
            this.char.behaviour_action = order.action;
            this.char.behaviour_actFrame = 0;
        }
    }
}


function say (text, options = {} ) {
    if (typeof options.time !== 'number') {options.time = 3000}
    if (typeof options.action !== 'string') {options.action = this.char.talkCycle}
    var currentOrder = Object.assign({text:text}, options);
    
    if (this.gameInstance.instantMode) {
        console.log(`skipped - ${this.name}: ${currentOrder.text}`)
        return Promise.resolve({
            finished:true,
            message: this.name+' finished saying \"'+currentOrder.text + '\".'
        })
    }

    this.char.sayingQueue.push(currentOrder);
    if (this.saying === '') { // to do - stop using this.saying - should be === this.sayingQueue[0].text
        executeSayOrder.apply(this,[currentOrder]);
    }
    
    var that = this;
    return new Promise ( function (resolve) {

        function handleSayOrderDone (orderJustDone) {
            if (orderJustDone !== currentOrder) {return false}
            resolve({
                finished:true,
                message: that.name+' finished saying \"'+currentOrder.text + '\".'
            });
            that.$off('sayOrderDone', handleSayOrderDone)
        }

        that.$on('sayOrderDone', handleSayOrderDone)
    });

}

function countDownSpeech (beat) {

    if (this.sayingCountDown || this.saying) { // to do - stop using this.saying - the test should be based on the queue
        this.sayingCountDown = this.sayingCountDown - beat.delay;
        if (this.gameInstance.instantMode) { this.sayingCountDown = 0 }

        if (this.sayingCountDown <= 0) {
            this.sayingCountDown = 0;
            this.saying = '';
            if (this.char.destinationQueue.length === 0) { //ie character is not moving
                this.char.behaviour_action = this.char.waitCycle;
                this.char.behaviour_actFrame = 0;
            }

            this.$emit('sayOrderDone', this.char.sayingQueue[0])
            this.char.sayingQueue.shift() // remove current order from queue

            if (this.char.sayingQueue.length > 0) { //execute queued order with no promise
                executeSayOrder.apply (this,[this.char.sayingQueue[0]]);
            } 
        }
    }


} 

export {say, countDownSpeech}