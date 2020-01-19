function checkForIdleAnimation () {
    if ( this.isIdle ) {
        this.timeSpentIdle++
        if (this.char.idleAnimations && this.timeSpentIdle >= this.char.idleAnimations.delay) {
            if (Math.random() < this.char.idleAnimations.chance) {
                let randomChoice = Math.ceil( Math.random()*this.char.idleAnimations.cycles.length )-1;
                this.doAction( this.char.idleAnimations.cycles[randomChoice] )
            }
            this.timeSpentIdle = 0;
        }
    } else if (this.timeSpentIdle) {
        this.timeSpentIdle = 0;
    }
}

export { checkForIdleAnimation}