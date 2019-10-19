function say (text, options = {} ){
    if (typeof options.time !== 'number') {options.time = 2000}
    if (typeof options.action !== 'string') {options.action = this.char.talkCycle}
    var currentOrder = Object.assign({text:text}, options);
    
    if (this.theApp.instantMode) {
        console.log(`skipped - ${this.name}: ${currentOrder.text}`)
        return Promise.resolve({
            finished:true,
            message: this.name+' finished saying \"'+currentOrder.text + '\".'
        })
    }

    var that = this;  

    function executeOrder (order) {		
        that.saying = order.text;
        that.sayingCountDown = order.time * (that.theApp.options.textDelay/100);
        if (that.char.destinationQueue.length === 0) { //not moving
            if (that.char.cycles[order.action]) { //and the character model has a cycle matching the action options 
                that.char.behaviour_action = order.action;
                that.char.behaviour_actFrame = 0;
            }
        }
    }

    if (this.saying === '') {
        return new Promise ( function (resolve) {

            //unlike actionOrders and goOrders, the current sayOrder isn't held with the
            //character's sayingQueue, so the beat method doesn't have access to it when firing the even
            //it can only emit the saying text (not ideal - should fix)

            function handleSayOrderDone (saying) {
                if (saying !== currentOrder.text) {return false}
                if (that.char.sayingQueue.length > 0) { // not using the queing anymore - each line has its own Promise
                    executeOrder (that.char.sayingQueue.shift());
                } else {
                    resolve({
                        finished:true,
                        message: that.name+' finished saying \"'+currentOrder.text + '\".'
                    });
                    that.$off('sayOrderDone', handleSayOrderDone)
                }
            }
            that.$on('sayOrderDone', handleSayOrderDone)
            executeOrder (currentOrder, resolve);
        });
    } else {  // not using the queing anymore - each line has its own Promise
        that.char.sayingQueue.push(currentOrder);
    }

}

function countDownSpeech (beat) {

    if (this.sayingCountDown) {
        this.sayingCountDown = this.sayingCountDown - beat.delay;

        if (this.theApp.instantMode) {
            this.sayingCountDown = 0;
        }

        if (this.sayingCountDown <= 0) {

            let lineJustSaid = this.saying;

            this.saying = '';
            if (this.char.destinationQueue.length === 0) { //ie character is not moving
                this.char.behaviour_action = this.char.waitCycle;
                this.char.behaviour_actFrame = 0;
            }

            this.$emit('sayOrderDone', lineJustSaid)
            this.sayingCountDown = 0;
        }
    }


} 

export {say, countDownSpeech}