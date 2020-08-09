function setDefaultCycle (type, cycleName, comp = null) {
    console.log('setDefaultCycle', {type, cycleName, comp})
    let propertyName;
    switch (type) {
        case 'wait': propertyName = 'waitCycle'; break;
        case 'walk': propertyName = 'walkCycle'; break;
        case 'talk': propertyName = 'talkCycle'; break;
        default: return Promise.resolve(false);
    }

    if ( !this.model.cycles[cycleName]) {
        let warningMessage = `set default ${type} failed : ${this.ident || this.id} does not have a cycle called "${cycleName}".`

        if (comp && comp.$store) {
            comp.$store.commit('debugMessage', warningMessage)
        } else { // TODO - solve: called via Character DataClass not Character component and doesn't have access to the store 
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


function setDefaultWait (cycleName,comp) {
    return setDefaultCycle.apply(this, ['wait', cycleName, comp])
}

function setDefaultWalk (cycleName, comp) {
    return setDefaultCycle.apply(this, ['walk', cycleName,comp])
}

function setDefaultTalk (cycleName, comp) {
    return setDefaultCycle.apply(this, ['talk', cycleName,comp])
}



export { setDefaultWait, setDefaultWalk, setDefaultTalk}