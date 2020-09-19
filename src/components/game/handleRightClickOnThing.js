function interactWithRecommendedVerb(thing) {
  this.subject = thing
  this.object = null
  const verbBeforeClick = this.verb;
  this.verb = this.recommendedVerb
  if (this.haveCompleteCommand) {this.handleCommand()}

  if (!this.verb) { // if recommendedVerb fails, need to reset the command 
    this.$store.commit('debugMessage', `failed to get recommended verb for for ${thing.id || thing.ident} or default verb for ${thing.dataType}. If these are set, check they are valid verb ids`)
    this.subject = null
    this.verb = verbBeforeClick;
  }

}


export default function(thing) {
  if (this.gameStatus !== 'LIVE') {return false}
  const {config} = this.$store.state.gameData

  if (config.rightClickForRecommendedVerb) {
    interactWithRecommendedVerb.apply(this,[thing])
    return
  }
  this.$store.state.gameEmitter.emit('unhandled-right-click-on-thing')
}