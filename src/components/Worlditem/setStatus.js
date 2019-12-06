export default function setStatus (input) {

    if (!Array.isArray(input)) {input = [input]}

    var orders = [], nextOrder;
    for (var i = 0; i < input.length; i++) {
        nextOrder = typeof input[i] === 'string' ? {cycle:input[i]} : input[i];
        if (this.item.cycles[nextOrder.cycle]) { 
            orders.push(nextOrder);
        } else {
            // eslint-disable-next-line
            console.warn ( `${this.ident} does not have a cycle called "${nextOrder.cycle}".` ) 
        }
    }

    if (orders.length === 0 ) { return Promise.resolve({
        finished:false, 
        message:'no valid orders'
    })}

    this.item.queue = orders;
    var lastOrder = this.item.queue[this.item.queue.length-1];
    this.cycleFrame = 0;
    var that = this;

    return new Promise( function(resolve) {

        function handleStatusOrderDone(order) {
            if (order === lastOrder) {
                resolve({
                    finished:true,
                    message: that.ident + ' finished sequence ending in ' + lastOrder.cycle
                });
                that.$off('statusOrderDone', handleStatusOrderDone);
            } else if (that.item.queue.indexOf(lastOrder) === -1) {
                resolve({
                    finished: false,
                    message: that.ident + ' no longer doing sequence ending with ' + lastOrder.cycle
                });
                that.$off('statusOrderDone', handleStatusOrderDone);
            }
        }

        that.$on('statusOrderDone', handleStatusOrderDone);

    });


}