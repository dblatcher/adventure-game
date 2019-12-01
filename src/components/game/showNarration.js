function showNarration (target, options={}) {

    if (!Array.isArray(target)) {target = [target]}
    this.narration.contents.splice(0,this.narration.contents.length, ...target)


    if (options.time) {
        let time = options.time * 1000;
        let unit = 'ms'
        this.narration.dismissable = false;

        return new Promise (resolve => {
            const clear = () => {
                this.$refs.heartBeat.$off('beat', listenToBeat);
                this.$refs.heartBeat.$off('instant-mode', clear)
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
            this.$refs.heartBeat.$on('beat', listenToBeat)
            this.$refs.heartBeat.$on('instant-mode', clear)
        })
    }

    if (options.waitForDismiss) {
        this.narration.dismissable = true;    
        return new Promise (resolve => {
            const waitForDismiss = () => {
                this.$off('dismissed-message', waitForDismiss)
                resolve({finished:true})
            }
            this.$on('dismissed-message', waitForDismiss)
        })
    }

    return Promise.resolve({finished:true})
}


export {showNarration}