function setDefaultCycle (type, cycleName) {
    
    let propertyName;
    switch (type) {
        case 'wait': propertyName = 'waitCycle'; break;
        case 'walk': propertyName = 'walkCycle'; break;
        case 'talk': propertyName = 'talkCycle'; break;
        default: return Promise.resolve(false);
    }

    if ( !this.char.cycles[cycleName]) {

        console.warn ( `set default ${type} failed : ${this.ident} does not have a cycle called "${cycleName}".` ) 

        return Promise.resolve({
            finished:true,
            cycle: this.char[propertyName],
            message:`set default ${type} : ${this.ident} does not have a cycle called "${cycleName}".`
        });
    }

    if (this.char.behaviour_action === this.char[propertyName]) { 
        this.char.behaviour_action = cycleName;
        this.char.behaviour_actFrame = 0;
    }
    this.char[propertyName] = cycleName;

    return Promise.resolve({
        finished:true,
        cycle: this.char[propertyName],
    });
}


function setDefaultWait (cycleName) {
    return setDefaultCycle.apply(this, ['wait', cycleName])
}

function setDefaultWalk (cycleName) {
    return setDefaultCycle.apply(this, ['walk', cycleName])
}

function setDefaultTalk (cycleName) {
    return setDefaultCycle.apply(this, ['talk', cycleName])
}



export { setDefaultWait, setDefaultWalk, setDefaultTalk}