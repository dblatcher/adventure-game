class StandardCondition {
    constructor (actorId, property, operator, comparitor) {
        this.actorId = actorId;
        this.property = property;
        this.operator = operator;
        this.comparitor = comparitor;
    }

    evaluate (game){
        const {actorId, operator, property, comparitor} = this;
        let actor = game.getComponentOrDataObject(actorId)
        if (!actor) {
            console.warn(`condition invalid: ${actorId}' not found`)
            return true
        }
        
        switch (operator) {
            case "true":
                return !!actor[property]; 
            case "false":
                return !actor[property]; 
            case "eq":
            case "=":
            case "==":
            case "===":
                return actor[property] == comparitor;
            case "ne":
            case "!=":
            case "!==":
            case "<>":
                return actor[property] !== comparitor;
            case "gt":
            case ">":
                return actor[property] > comparitor;
            case "lt":
            case "<":
                return actor[property] < comparitor;
            case "ge":
            case ">=":
                return actor[property] >= comparitor;
            case "le":
            case "<=":
                return actor[property] <= comparitor;
            case "begins":
            case "left":
            case "starts":
                if (typeof actor[property] !== 'string' || typeof comparitor !== 'string' ) {return false}
                return (actor[property].indexOf(comparitor) === 0)
        }

        console.warn ('condition invalid',this)
        return true
    }

    get isStandardCondition() {return true}
}

export {StandardCondition}