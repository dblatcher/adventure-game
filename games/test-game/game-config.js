import { StandardOrder } from "../../src/modules/StandardOrder";
import { ConditionalOrder } from "../../src/modules/ConditionalOrder";
import { Verb } from "../../src/modules/constructors";



var verbList = [
    new Verb('WALK',{
        description: 'walk to',
    }),
    new Verb('LOOK', {
        description: 'look at',
        defaultResponse: [
            new ConditionalOrder({
                conditions:[['WILDCARD','{{game.subject.dataType}}', '==', 'InventoryItem']],
                orderIfTrue:['pc:: Good {{game.subject.name}}.'],
            }),
            new ConditionalOrder({
                conditions:[['WILDCARD','{{game.subject.dataType}}', '==', 'Character']],
                orderIfTrue:['pc:: I don\'t see anything special about {{game.subject.name}}'],
            }),
            new ConditionalOrder({
                conditions:[['WILDCARD','{{game.subject.dataType}}', '==', 'WorldItem']],
                orderIfTrue:['pc::It looks like a normal {{game.subject.name}} to me.'],
            }),
        ]
    }),
    new Verb('USE', {
        preposition:'with',
        defaultResponse: [
            new ConditionalOrder({
                conditions:[['WILDCARD','{{game.object}}', 'false']],
                orderIfTrue:['pc:: I can\'t use the {{game.subject.name}}!'],
                orderIfFalse:['pc:: I can\'t use the {{game.subject.name}} with the {{game.object.name}}!'],
            }),
        ],
    }),
    new Verb('TALK',{
        description: 'talk to',
    }),
    new Verb('GIVE', {
        preposition:'to',
    }),
    new Verb('TAKE',{
        description: 'pick up',
    }),
    new Verb('OPEN',{
    }),
    new Verb('SHUT',{
        description: 'close',
    }),
]


var defaultResponses = {
    "WALK" : function(command) {
        return [new StandardOrder('pc','goTo',command.subject.id, {wasManual:true})]
    },
    "ACTIVATE"  : function (command) {
        if  (command.subject.id.endsWith('W')) {
            return [
                new StandardOrder(`pc^^${command.subject.id}`),
                new StandardOrder('pc','say',`I don't know what to do with the ${command.subject.name}.`)
            ]
        } else if  (command.subject.id.endsWith('C')) {
            return [
                new StandardOrder(`pc^^${command.subject.id}`),
                new StandardOrder('pc','say',`I don't know what to do to ${command.subject.name}.`)
            ]
        } else {
            return [
                new StandardOrder('pc','say',`I don't know what to do with the ${command.subject.name}.`)
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
    title: 'Test Game',
    interface: 'Scumm',
    alwaysWalkWhenClickOnRoom: true,
    resetVerbAfterEachCommand: true,
    rightClickForRecommendedVerb:true,
    titleScreen: {
        title: 'The Test Game',
        subtitle: 'A game for testing and examples.',
    },
    endingScreen : {

    },
    defaultVerb: {WorldItem:"LOOK", InventoryItem:"USE", Character:"TALK"},
    pcId: 'JANE_C',
    initialGameVars: {
        wantsHammer: false,
        numberOfSomething: 5,
    }
}


export { defaultResponses, verbList, config }