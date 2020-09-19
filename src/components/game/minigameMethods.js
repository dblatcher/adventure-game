function launchMinigame (action, options = {}) {

    const game = this;

    if ( !game.minigames[action]) {
        game.$store.commit('debugMessage', `launchMinigame fail: no minigame called "${action}"`)
        return game.wait(1).then( ()=>{ return {finished: false} })
    }

    game.currentMinigameName = action
    game.currentMinigameProps = options.props || {}

    return new Promise(resolve => { 

        function handleOutcome(outcome) {
            resolve(outcome)
        }

        game.$store.state.gameEmitter.once('minigame-outcome', handleOutcome)
    })

}

function handleMinigameOutcome (outcome) {
    this.currentMinigameName = false
    this.currentMinigameProps =  {}
    this.$store.state.gameEmitter.emit('minigame-outcome', outcome)
}

export {launchMinigame, handleMinigameOutcome}
