function checkForIdleAnimation () {

    const {idleAnimations, behaviour_action} = this.char
    const idleConfig = idleAnimations[behaviour_action]

    if ( this.isIdle ) {
        this.timeSpentIdle++
        if (idleConfig && this.timeSpentIdle >= idleConfig.delay) {
            if (Math.random() < idleConfig.chance) {
                let randomChoice = Math.ceil( Math.random()*idleConfig.cycles.length )-1;
                this.doAction( idleConfig.cycles[randomChoice] )
            }
            this.timeSpentIdle = 0;
        }
    } else if (this.timeSpentIdle) {
        this.timeSpentIdle = 0;
    }
}

export { checkForIdleAnimation}