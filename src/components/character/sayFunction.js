export default function (text, options = {} ){
    if (typeof options.time !== 'number') {options.time = 1000}
    if (typeof options.action !== 'string') {options.action = 'talk'}
    var currentOrder = Object.assign({text:text}, options);
    
    if (this.theApp.instantMode) {
        console.log(`skipped - ${this.name}: ${currentOrder.text}`)
        return Promise.resolve({
            finished:true,
            message: this.name+' finished saying \"'+currentOrder.text + '\".'
        })
    }

    var that = this;  
    function executeOrder (order,resolve) {		
        that.saying = order.text;
        if (that.char.destinationQueue.length === 0) { //not moving
            if (that.char.cycles[order.action]) { //and the character model has a cycle matching the action options 
                that.char.behaviour_action = order.action;
                that.char.behaviour_actFrame = 0;
            }
        }
        setTimeout(function(){
            if (typeof order.callback == 'function') {order.callback()}
            
            if (that.char.sayingQueue.length > 0) {
                executeOrder (that.char.sayingQueue.shift(),resolve);
            } else {
                that.saying = '';
                if (that.char.destinationQueue.length === 0) { //not moving
                    that.char.behaviour_action = 'wait';
                    that.char.behaviour_actFrame = 0;
                }
                resolve({
                    finished:true,
                    message: that.name+' finished saying \"'+order.text + '\".'
                });
            }	
        
        },order.time);
        
    }
    
    if (that.isTalking === false) {
        return new Promise ( function (resolve, reject) {
            executeOrder (currentOrder, resolve);
        });
    } else {
        that.char.sayingQueue.push(currentOrder);
    }
    
}