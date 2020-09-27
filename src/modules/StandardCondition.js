class StandardCondition {
    constructor (actorId, property, operator, comparitor) {
        this.actorId = actorId;
        this.property = property;
        this.operator = operator;
        this.comparitor = comparitor;
    }

    toString() {
        if (this.actorId === 'GAME') {
            return `StandardCondition{${this.property} ${this.operator} ${this.comparitor}}`
        }
        return `StandardCondition{${this.actorId}['${this.property}'] ${this.operator} ${this.comparitor ? this.comparitor :''}}`
    }

    evaluate (game){
        const {actorId, property, operator, comparitor} = this;
        let value;

        if (actorId.toUpperCase() === 'WILDCARD') {
            value = game.processWildCards(property)
            if (value === '**error**') {value = false}
        } else {
            let actor = game.getComponentOrDataObject(actorId)
            if (!actor) {
                game.$store.commit('debugMessage', `condition invalid: ${this.toString} (actor '${actorId}' not found).`)
                return true
            }
            value = actor[property];
        }


        switch (operator) {
            case "true":
                return !!value; 
            case "false":
                return !value; 
            case "eq":
            case "=":
            case "==":
            case "===":
                return value == comparitor;
            case "ne":
            case "!=":
            case "!==":
            case "<>":
                return value != comparitor;
            case "gt":
            case ">":
                return value > comparitor;
            case "lt":
            case "<":
                return value < comparitor;
            case "ge":
            case ">=":
                return value >= comparitor;
            case "le":
            case "<=":
                return value <= comparitor;
            case "begins":
            case "left":
            case "starts":
                if (typeof value !== 'string' || typeof comparitor !== 'string' ) {return false}
                return (value.indexOf(comparitor) === 0)
        }

        game.$store.commit('debugMessage', `condition invalid: ${this.toString()} (invalid operator)`)
        return true
    }

    get isStandardCondition() {return true}
}

export {StandardCondition}