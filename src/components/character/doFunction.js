export default function (action, options = {} ) {
    //validate inputs
    if (typeof action  !== 'string') {
        console.warn ('Action order skipped: non-string value for ' + this.name+'.')
        return Promise.resolve({
            finished:true,
            message:'Action order skipped: non-string value for ' + this.name+'.'
        });
    }
    if (!this.char.cycles[action]) {
        console.warn ('Action order skipped: ' + action +' is not a cycle of' + this.name+'.')
        return Promise.resolve({
            finished:true,
            message: 'Action order skipped: ' + action +' is not a cycle of' + this.name+'.'
        });
    }
    
    // default options.direction to current direction
    if (!options.direction) {options.direction = this.currentDirection};			
    
    //ensure options.direction is a direction supported by the character model's cycle;
    var availableDirections = Object.keys(this.char.cycles[action]);
    if (!availableDirections.includes(options.direction)) {
        options.direction = availableDirections[0];
    }
    
    var currentOrder = Object.assign({action:action, actFrame:0},options);
    
    if (this.theApp.instantMode) {
        console.log(`skipped - ${this.name} doing ${currentOrder.action}`);
        return Promise.resolve({
            finished: true,
            message:this.ident + ' finished action:' + currentOrder.action
        });
    }

    var that = this;

    function execute(order, resolve) {
        that.char.actionQueue = [order];	
        var count = 0;
        var timer = setInterval (function(){
            // order.actFrame is updated by showNextFrame
            count++; 
            if (count > 0 && order.actFrame == 0) {
                clearInterval(timer);
                resolve({
                    finished: true,
                    message:that.ident + ' finished action:' + order.action
                });
            }
        },100);
    }
    
    return new Promise ( function (resolve, reject) {
        execute (currentOrder, resolve);
    });
}