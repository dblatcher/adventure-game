function showNarration (target, options={}) {

    if (!Array.isArray(target)) {target = [target]}
    this.narration.contents.splice(0,this.narration.contents.length, ...target)


    if (options.time) {
        let time = options.time * 1000;
        let unit = 'ms'
        this.narration.dismissable = false;

        return new Promise (resolve => {
            const clear = () => {
                this.$store.state.gameEmitter.off('beat', listenToBeat);
                this.$store.state.gameEmitter.off('instant-mode', clear)
                this.dismissMessage(true)
                resolve({finished: true})
            } 
            const listenToBeat = (beat) => {
                if (unit === 'beat' || unit === 'beats') {time--}
                if (unit === 'ms') {time -= beat.delay}
                if (time <=0 ) {
                    clear()
                }
            }
            this.$store.state.gameEmitter.on('beat', listenToBeat)
            this.$store.state.gameEmitter.on('instant-mode', clear)
        })
    }

    if (options.waitForDismiss) {
        this.narration.dismissable = true;
        return new Promise (resolve => {
            const waitForDismiss = () => {
                this.$store.state.gameEmitter.off('dismissed-message', waitForDismiss)
                resolve({finished:true})
            }
            this.$store.state.gameEmitter.on('dismissed-message', waitForDismiss)
        })
    }

    return Promise.resolve({finished:true})
}


export {showNarration}