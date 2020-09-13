
import { setDefaultWait, setDefaultWalk, setDefaultTalk } from "./cycleFunctions";
import { CharacterModel } from "./models"
import resetObject from "./resetObject"

export default class Character {

    constructor(id, coords, model, config = {}) {
        this.id = id.toUpperCase().replace(/[^\w]/g, "_") + "_C";
        this.x = coords[0];
        this.y = coords[1];
        this.room = coords[2];
        this.speechColor = config.speechColor || 'white';

        this.name = config.name || id;
        this.baseWidth = config.baseWidth || 20
        this.baseHeight = config.baseHeight || 20

        this.model = model

        this.scale = config.scale || 1;
        this.zAdjust = config.zAdjust || 0;

        this.saying = '';
        this.sayingCountDown = 0;
        this.sayingQueue = [];
        this.actionQueue = [];
        this.destinationQueue = [];

        this.waitCycle = config.waitCycle || 'wait';
        this.talkCycle = config.talkCycle || 'talk';
        this.walkCycle = config.walkCycle || 'walk';

        this.behaviour_action = config.waitCycle || 'wait';
        this.behaviour_actFrame = '0';
        this.behaviour_direction = this.model.validDirections[0];

        this.idleAnimations = config.idleAnimations || {};
        this.recommendedVerb = config.recommendedVerb || null;

        this.initialState = Object.freeze(Object.assign({}, this));
    }

    get isDataObject() { return true }
    get dataType() { return 'Character' }


    goTo(target, options = {}, game) {
        if (typeof this.room !== 'number') {
            game.$store.commit('debugMessage', `goTo call for ${this.name} to failed because ${this.name} is not in a room.`)
            return game.wait(1).then(() => { return { finished: false } })
        }
        let destination = game.resolveDestination(target)
        if (!destination) {
            game.$store.commit('debugMessage', `goTo call for ${this.name} to failed because destination (${target.toString()}) could not be resolved`)
            return game.wait(1).then(() => { return { finished: false } })
        }
        let obstaclesContainDestination = game.rooms[this.room].obstacles.map(obstacle => { return obstacle.containsPoint(destination) })
        if (obstaclesContainDestination.includes(true)) {
            game.$store.commit('debugMessage', `goTo call for ${this.name} to failed because destination (${target.toString()}) is inside an obstacle`)
            return game.wait(1).then(() => { return { finished: false } })
        }
        this.x = destination.x;
        this.y = destination.y;
        game.$store.commit('debugMessage', `offstage movement: ${this.name}`)
        return game.wait(1);
    }

    doAction(target, options = {}, game) {
        game.$store.commit('debugMessage', `offstage action: ${this.name}, ${target}`)
        return game.wait(1)
    }

    say(target, options = {}, game) {
        game.$store.commit('debugMessage', `offstage speech: ${this.name}, ${target}`)
        return game.wait(1)
    }

    // TODO - should this be returning the promise??
    goToRoom(target, options, game) {
        game.teleportCharacter([this].concat(target), options)
    }

    returnState() {
        return {
            name: this.name,
            x: this.x,
            y: this.y,
            room: this.room,
            waitCycle: this.waitCycle,
            walkCycle: this.walkCycle,
            talkCycle: this.talkCycle,
            behaviour_action: this.behaviour_action,
            behaviour_direction: this.behaviour_direction,
            behaviour_actFrame: this.behaviour_actFrame,
            saying: this.saying,
            sayingCountDown: this.sayingCountDown,
        }
    }


}



    Character.prototype.setDefaultTalk = setDefaultTalk;
    Character.prototype.setDefaultWalk = setDefaultWalk;
    Character.prototype.setDefaultWait = setDefaultWait;
    Character.prototype.reset = resetObject;
    Character.Model = CharacterModel
