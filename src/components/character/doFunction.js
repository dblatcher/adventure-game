export default function (action, options = {} ) {
    //validate inputs
    if (typeof action  !== 'string') {
        // eslint-disable-next-line
        this.$store.commit('debugMessage', 'Action order skipped: non-string value for ' + this.name+'.')
        return Promise.resolve({
            finished:true,
            message:'Action order skipped: non-string value for ' + this.name+'.'
        });
    }
    if (!this.char.model.cycles[action]) {
        // eslint-disable-next-line
        this.$store.commit('debugMessage', 'Action order skipped: ' + action +' is not a cycle of' + this.name+'.')
        return Promise.resolve({
            finished:true,
            message: 'Action order skipped: ' + action +' is not a cycle of' + this.name+'.'
        });
    }
    
    // default options.direction to current direction
    if (!options.direction) {options.direction = this.currentDirection}            
    
    //ensure options.direction is a direction supported by the character model's cycle;
    var availableDirections = Object.keys(this.char.model.cycles[action]);
    if (!availableDirections.includes(options.direction)) {
        options.direction = availableDirections[0];
    }
    
    var currentOrder = Object.assign({action:action, actFrame:0},options);
    
    if (this.gameInstance.instantMode) {
         // eslint-disable-next-line
        this.$store.commit('debugMessage', `skipped - ${this.name} doing ${currentOrder.action}`);
        return Promise.resolve({
            finished: true,
            message:this.ident + ' finished action:' + currentOrder.action
        });
    }

    var that = this;

    return new Promise ( function (resolve, reject) {

        that.char.actionQueue = [currentOrder];

        let handleActionOrderDone = function(doneOrder){
            if ( doneOrder===currentOrder) {
                that.$off('actionOrderDone', handleActionOrderDone )
                resolve({
                    finished: true,
                    message:that.ident + ' finished action:' + currentOrder.action
                });
            }
            else if (!that.char.actionQueue.includes(currentOrder) ) {
                that.$off('actionOrderDone', handleActionOrderDone )
                resolve({
                    finished: false,
                    message:that.ident + ' did not finish action:' + currentOrder.action
                });
            }
        }

        that.$on('actionOrderDone', handleActionOrderDone )

    });
}