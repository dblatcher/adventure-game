function skip() {
     // eslint-disable-next-line
    console.log(`skipped ${this.name} moving`);
    let moveOrder = this.char.destinationQueue[this.char.destinationQueue.length-1];
    this.char.x =  moveOrder.x; 
    this.char.y = moveOrder.y;
    this.$set(this.char, 'destinationQueue', []);
    this.char.behaviour_action = this.char.waitCycle;
    this.char.behaviour_actFrame = 0;
    this.char.behaviour_direction = moveOrder.direction;
    this.$emit('moveOrderDone', moveOrder)
}

export default function () {
    if (this.char.destinationQueue.length === 0) {return false}
    
    if (this.gameInstance.instantMode) {
        skip.apply(this,[])
        return false;
    }

    var moveOrder = this.char.destinationQueue[0];
    
    if (!moveOrder.started) {
        if (moveOrder.action) {
            if (moveOrder.action !== this.currentAction || moveOrder.direction !== this.currentDirection) {
                this.char.behaviour_action = moveOrder.action;
                this.char.behaviour_direction = moveOrder.direction;
                this.char.behaviour_actFrame = 0;
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
             // eslint-disable-next-line
            console.log('hit-obstacle', moveOrder);
            this.char.behaviour_action = this.char.waitCycle;
            this.char.behaviour_direction = moveOrder.direction;
            this.char.behaviour_actFrame = 0;
            this.char.destinationQueue.shift();
        }
    }
    this.char.x += movement.x;
    this.char.y += movement.y;
    
    // test if character got to the moveOrder destination, shift queue, report if finished
    if (this.x ===  moveOrder.x && this.y === moveOrder.y) { 
        
        this.$emit('moveOrderDone', moveOrder)

        this.char.destinationQueue.shift();
        if (this.char.destinationQueue.length === 0) {
            this.char.behaviour_action = this.char.waitCycle;
            this.char.behaviour_actFrame = 0;
            this.char.behaviour_direction = moveOrder.direction;
        }
    }
    
}