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
    if (!this.char.model.cycles[action]) {
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
    var availableDirections = Object.keys(this.char.model.cycles[action]);
    if (!availableDirections.includes(options.direction)) {
        options.direction = availableDirections[0];
    }

    var currentOrder = Object.assign({ action: action, actFrame: 0 }, options);

    if (this.gameInstance.instantMode) {
        this.$store.commit('debugMessage', `skipped - ${this.name} doing ${currentOrder.action}`);
        return Promise.resolve({
            finished: true,
            message: this.ident + ' finished action:' + currentOrder.action
        });
    }

    var that = this;

    return new Promise(function (resolve) {

        that.char.actionQueue = [currentOrder];

        let handleActionOrderDone = function (doneOrder) {
            if (doneOrder === currentOrder) {
                that.emitter.off('actionOrderDone', handleActionOrderDone)
                that.$off('changing-room', handleRoomChange)
                resolve({
                    finished: true,
                    message: that.ident + ' finished action:' + currentOrder.action
                });
            }
            else if (!that.char.actionQueue.includes(currentOrder)) {
                that.emitter.off('actionOrderDone', handleActionOrderDone)
                resolve({
                    finished: false,
                    message: that.ident + ' did not finish action:' + currentOrder.action
                });
            }
        }

        let handleRoomChange = function () {
            that.emitter.off('actionOrderDone', handleActionOrderDone)
            resolve({
                finished: true,
                reason: 'room change',
                interuptedByChangeOfRoom: true,
                message: `Game moved room before ${that.ident} finished action ${currentOrder.action}`
            })
        }


        that.emitter.on('actionOrderDone', handleActionOrderDone)
        that.gameInstance.$once('changing-room', handleRoomChange)

    });
}