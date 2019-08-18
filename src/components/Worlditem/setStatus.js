export default function setStatus () {

    var orders = [], nextOrder;
    for (var i = 0; i < arguments.length; i++) {
        nextOrder = typeof arguments[i] === 'string' ? {cycle:arguments[i]} : arguments[i];
        if (this.item.cycles[nextOrder.cycle]) { 
            orders.push(nextOrder);
        } else {
            // eslint-disable-next-line
            console.warn ( `${this.ident} does not cycle ${nextOrder.cycle}.` ) 
        }
    }

    if (orders.length === 0 ) { return Promise.resolve('no valid orders')}

    this.item.queue = orders;
    var lastOrder = this.item.queue[this.item.queue.length-1];
    this.cycleFrame = 0;
    var that = this;

    return new Promise( function(resolve) {
        watchQueue(resolve);
    });

    function watchQueue(resolve) {
        var timer = setInterval (function(){
            if (that.item.queue[0] === lastOrder) {
                clearInterval(timer);
                resolve({
                    finished:true,
                    message: that.ident + ' finished sequence ending in ' + lastOrder.cycle
                });
            }

            if (that.item.queue.indexOf(lastOrder) === -1) {
                clearInterval(timer);
                resolve({
                    finished: false,
                    message: that.ident + ' no longer doing sequence ending with ' + lastOrder.cycle
                });
            }
            
        },100);
    }

}