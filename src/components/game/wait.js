function wait(target, options={}) {

    const validTimeUnits = ['beat','beats','ms','s']

    let time =  (typeof target === 'number') ? target : 1;
    let unit = validTimeUnits.includes(options.unit) ? options.unit : 's';

    if (this.instantMode) {
        console.log(`skipped - Order to wait for ${time} ${unit}`)
        return Promise.resolve({
            finished:true,
            message: 'wait over'
        })
    }

    if (unit === 's') {unit = 'ms'; time = time * 1000}
    
    return new Promise (resolve => {
        const listenToBeat = (beat) => {
            if (unit === 'beat' || unit === 'beats') {time--}
            if (unit === 'ms') {time -= beat.delay}
            if (time <=0 ) {
                this.$refs.heartBeat.$off('beat', listenToBeat);
                resolve({finished: true})        
            }
        }

        this.$refs.heartBeat.$on('beat', listenToBeat)

    })

}

export {wait}