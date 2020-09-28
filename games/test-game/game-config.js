import { StandardOrder } from "../../src/modules/StandardOrder";
import { ConditionalOrder } from "../../src/modules/ConditionalOrder";
import { Verb } from "../../src/modules/constructors";



var verbList = [
    new Verb('WALK',{
        description: 'walk to',
        defaultResponse: [
            new ConditionalOrder({
                conditions:[['WILDCARD','{{game.subject.dataType}}', '!=', 'InventoryItem']],
                orderIfTrue:['pc>>{{game.subject.id}}',{wasManual:true}],
            }),
        ]
    }),
    new Verb('LOOK', {
        description: 'look at',
        defaultResponse: [
            new ConditionalOrder({
                conditions:[['WILDCARD','{{game.subject.dataType}}', '!=', 'InventoryItem']],
                orderIfTrue:['pc^^{{game.subject.id}}'],
            }),
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
        defaultResponse: [
            new ConditionalOrder({
                conditions:[['WILDCARD','{{game.subject.dataType}}', '!=', 'InventoryItem']],
                orderIfTrue:['pc^^{{game.subject.id}}'],
            }),
            new ConditionalOrder({
                conditions:[['WILDCARD','{{game.subject.dataType}}', '==', 'Character']],
                orderIfTrue:['pc:: I have nothing to say to {{game.subject.name}} right now.'],
            }),
            new ConditionalOrder({
                conditions:[['WILDCARD','{{game.subject.dataType}}', '!=', 'Character']],
                orderIfTrue:['pc:: I can\'t talk to a  {{game.subject.name}}.'],
            }),
        ]
    }),
    new Verb('GIVE', {
        preposition:'to',
    }),
    new Verb('TAKE',{
        description: 'pick up',
        defaultResponse: [
            new StandardOrder('pc','say',`I can't pick that up.`)  
        ],
    }),
    new Verb('OPEN',{
        defaultResponse: [
            new StandardOrder('pc','say',`I can't {{game.verb.description}} that.`)  
        ],
    }),
    new Verb('SHUT',{
        description: 'close',
        defaultResponse: [
            new StandardOrder('pc','say',`I can't {{game.verb.description}} that.`)  
        ],
    }),
]


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
    fallbackDefaultResponse: [
        new ConditionalOrder({
            conditions:[['WILDCARD','{{game.subject.dataType}}', '!=', 'InventoryItem']],
            orderIfTrue:['pc^^{{game.subject.id}}'],
        }),
        new ConditionalOrder({
            conditions:[['WILDCARD','{{game.object.id}}', 'false']],
            orderIfTrue:['pc:: I can\'t {{game.verb.description}} the {{game.subject.name}}!'],
            orderIfFalse:['pc:: I can\'t {{game.verb.description}} the {{game.subject.name}} {{game.verb.preposition}} the {{game.object.name}}!'],
        }),
    ],
    pcId: 'JANE_C',
    initialGameVars: {
        wantsHammer: false,
        numberOfSomething: 5,
    }
}


export { verbList, config }