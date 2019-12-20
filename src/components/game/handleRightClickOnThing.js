export default function(thing) {
    console.log('right click')
  
    if (this.gameStatus !== 'LIVE') {return false}

    this.subject = thing
    this.verb = this.verbList.filter( (verb)=>{return verb.id === 'LOOK'} )[0]
    this.object = null
    if (this.haveCompleteCommand) {this.handleCommand();}

	
  }