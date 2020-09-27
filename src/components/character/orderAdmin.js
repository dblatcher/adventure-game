const orderTypes = {
    action: {
        eventName: 'actionOrderDone',
        queueName: 'actionQueue',
    },
    say: {
        eventName: 'sayOrderDone',
        queueName: 'sayingQueue',
        
    },
    move: {
        eventName: 'moveOrderDone',
        queueName: 'destinationQueue',
    }
}



function makeOrderPromise(that, currentOrder, orderType) {

    function makeResolutionForOrderDone() {
        switch (orderType) {
            case 'action': return {
                finished: true,
                message: `${that.ident} finished ${orderType}Order: ${currentOrder.action}`,
            }
            case 'move': return (currentOrder.x === that.x && currentOrder.y === that.y) ?
                { finished: true, message: `Reached [${currentOrder.x},${currentOrder.y}]` } :
                { finished: false, message: `${that.ident} did not reach [${currentOrder.x},${currentOrder.y}]` };
            case 'say': return {
                finished: true,
                message: `${that.name} finished saying "${currentOrder.text}".`,
            }
        }
    }

    function makeResolutionForOrderNoLongerInQueue() {
        switch (orderType) {
            case 'action': return {
                finished: false,
                message: `${that.ident} did not finish ${orderType}Order: ${currentOrder.action}`,
            }
            case 'move': return { 
                finished: false, message: `${that.ident} did not reach [${currentOrder.x},${currentOrder.y}]` 
            }
            case 'say': return {
                finished: false,
                message: `${that.ident} did not finish ${orderType}Order: "${currentOrder.text}"`,
            }
        }
    }


    return new Promise(function (resolve) {

        const {queueName, eventName} = orderTypes[orderType]

        let handleOrderDone = function (doneOrder) {
            if (doneOrder === currentOrder) {
                that.emitter.off(eventName, handleOrderDone)
                that.$store.state.gameEmitter.off('changing-room', handleRoomChange)
                resolve(makeResolutionForOrderDone());
            }
            else if (!that.item[queueName].includes(currentOrder)) {
                that.emitter.off(eventName, handleOrderDone)
                resolve(makeResolutionForOrderNoLongerInQueue());
            }
        }

        let handleRoomChange = function () {
            that.emitter.off(eventName, handleOrderDone)
            let message = `Game moved room before ${that.ident} finished action  ${orderType}Order`
            resolve({
                finished: true,
                reason: 'room change',
                interuptedByChangeOfRoom: true,
                message,
            })
        }


        that.emitter.on(eventName, handleOrderDone)
        that.$store.state.gameEmitter.once('changing-room', handleRoomChange)

    });

}

export {makeOrderPromise}