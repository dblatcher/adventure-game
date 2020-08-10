function setDefaultCycle (type, cycleName, component = null) {
    let propertyName;
    switch (type) {
        case 'wait': propertyName = 'waitCycle'; break;
        case 'walk': propertyName = 'walkCycle'; break;
        case 'talk': propertyName = 'talkCycle'; break;
        default: return Promise.resolve(false);
    }

    if ( !this.model.cycles[cycleName]) {
        let warningMessage = `set default ${type} failed : ${this.ident || this.id} does not have a cycle called "${cycleName}".`

        if (component && component.$store) {
            component.$store.commit('debugMessage', warningMessage)
        } else { // TODO - solve: called via Character DataClass not Character component and doesn't have access to the store 
            // eslint-disable-next-line
            console.warn (warningMessage)
        }

        return Promise.resolve({
            finished:true,
            cycle: this[propertyName],
            message: warningMessage
        });
    }

    if (this.behaviour_action === this[propertyName]) { 
        this.behaviour_action = cycleName;
        this.behaviour_actFrame = 0;
    }
    this[propertyName] = cycleName;

    return Promise.resolve({
        finished:true,
        cycle: this[propertyName],
    });
}


function setDefaultWait (cycleName,component) {
    return setDefaultCycle.apply(this, ['wait', cycleName, component])
}

function setDefaultWalk (cycleName, component) {
    return setDefaultCycle.apply(this, ['walk', cycleName,component])
}

function setDefaultTalk (cycleName, component) {
    return setDefaultCycle.apply(this, ['talk', cycleName,component])
}



export { setDefaultWait, setDefaultWalk, setDefaultTalk}