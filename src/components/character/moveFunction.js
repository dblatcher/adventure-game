function skip() {
    this.$store.commit('debugMessage',`skipped ${this.name} moving`)
    let moveOrder = this.item.destinationQueue[this.item.destinationQueue.length-1];
    this.item.x =  moveOrder.x; 
    this.item.y = moveOrder.y;
    this.item.destinationQueue.splice (0, this.item.destinationQueue.length)

    this.item.behaviour_action = this.item.waitCycle;
    this.item.behaviour_actFrame = 0;
    this.item.behaviour_direction = moveOrder.direction;
    this.emitter.emit('moveOrderDone', moveOrder)
}

export default function () {
    if (this.item.destinationQueue.length === 0) {return false}
    
    if (this.gameInstance.instantMode) {
        skip.apply(this,[])
        return false;
    }

    var moveOrder = this.item.destinationQueue[0];
    if (!moveOrder.started) {
        if (moveOrder.action) {
            if (moveOrder.action !== this.currentAction || moveOrder.direction !== this.currentDirection) {
                this.item.behaviour_action = moveOrder.action;
                this.item.behaviour_direction = moveOrder.direction;
                this.item.behaviour_actFrame = 0;
            }
        }
    }
    moveOrder.started = true;

    // determine movement - the 'step' the character will try to take.
    var d = {x: moveOrder.x - this.x, y:moveOrder.y - this.y};
    var absD = {x: Math.abs(d.x), y: Math.abs(d.y) };
    var speed = 6 * this.zoneEffects.scale();
    
    if (moveOrder.isRun) {speed = speed * 3}

    var movement = {x:0,y:0};

    var rX = absD.x ? absD.x / ( absD.x + absD.y) : 0;
    var rY = absD.y ? absD.y / ( absD.x + absD.y) : 0;

    movement.x = Math.min ( absD.x, speed*rX );
    movement.y = Math.min ( absD.y, speed*rY );
    if (d.x < 0 ) {movement.x *= -1}
    if (d.y < 0 ) {movement.y *= -1}
            
    var obstacles = this.gameInstance.obstacles;
    for (var i=0; i<obstacles.length; i++) {
        if (obstacles[i].containsPoint( this.x+movement.x, this.y+movement.y) ) {
            movement = {x:0, y:0};
            this.item.behaviour_action = this.item.waitCycle;
            this.item.behaviour_direction = moveOrder.direction;
            this.item.behaviour_actFrame = 0;
            this.item.destinationQueue.shift();
            this.$store.commit('debugMessage', `${this.item.name} hit obstable during move to [${moveOrder.x}, ${moveOrder.y}]`)
        }
    }
    this.item.x += movement.x;
    this.item.y += movement.y;
    this.$emit('character-moved', this.item.id)

    // test if character got to the moveOrder destination, shift queue, report if finished
    if (this.x ===  moveOrder.x && this.y === moveOrder.y) { 
        this.emitter.emit('moveOrderDone', moveOrder)
        this.item.destinationQueue.shift();
        if (this.item.destinationQueue.length === 0) {
            this.item.behaviour_action = this.item.waitCycle;
            this.item.behaviour_actFrame = 0;
            this.item.behaviour_direction = moveOrder.direction;
        }
    }
    
}