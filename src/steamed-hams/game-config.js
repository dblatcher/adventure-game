import { StandardOrder } from "../modules/StandardOrder";
import { Verb } from "../modules/constructors";



var verbList = [
    new Verb('walk to','WALK',{
        icon: require('../icons/walking.svg'),
    }),
    // new Verb('pick up','TAKE',{
    //     icon: require('../icons/hand-paper.svg')
    // }),
    new Verb('look at','LOOK', {
        icon: require('../icons/eye.svg'),
    }),
    // new Verb('give','GIVE', {
    //     preposition:'to'
    // }),
    new Verb('use','USE', {
        preposition:'with',
        icon: require('../icons/hand-paper.svg'),
    }),
    new Verb('talk to','TALK',{
        icon: require('../icons/comment.svg')
    }),
    // new Verb('open','OPEN'),
    // new Verb('close','SHUT')
]


var defaultResponses = {
    "WALK" : function(command) {
        return [new StandardOrder('pc','goTo',command.subject.id, {wasManual:true})]
    },
    "LOOK" : function(command) {
        if  (command.subject.id.endsWith('W')) {
            return [
                new StandardOrder(`pc^^${command.subject.id}`),
                new StandardOrder('pc','say',`It looks like a normal ${command.subject.name} to me.`)
            ]
        } else if  (command.subject.id.endsWith('C')) {
            return [
                new StandardOrder(`pc^^${command.subject.id}`),
                new StandardOrder('pc','say',`I don't see anything special about ${command.subject.name}.`)
            ]
        } else {
            return[
                new StandardOrder('pc','say',`Good ${command.subject.name}.`)
            ]
        } 
    },
    "OPEN" : function(command) {
        return [new StandardOrder('pc','say',`The ${command.subject.name} doesn't open.`)]    
    },
    "misc" : function(command) {
        if (!command.object) {
            return [new StandardOrder('pc','say',`I can't ${command.verb.description} that.`)  ]  
        }
        return [new StandardOrder('pc','say','I can\'t.')  ]  
    } 
}

const config = {
    title: 'Steamed Hams',
    interface: 'Sierra',
    titleScreen: {
        picture: require('./title-skinner.png'),
        title: 'Skinner and the Superintendent',
        subtitle: 'Steamed hams but its a point and click adventure game.',
        pageStyle: {
            backgroundImage: 'linear-gradient(180deg, gray, transparent)',
            fontSize: '150%',
        }
    },
    endingScreen : {

    },
    defaultVerb: {WorldItem:"LOOK", InventoryItem:"USE", Character:"TALK"},
}

export { defaultResponses, verbList, config }