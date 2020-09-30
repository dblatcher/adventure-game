import {Verb} from "../modules/constructors"
import {ConditionalOrder} from "../modules/ConditionalOrder"
import {StandardOrder} from "../modules/StandardOrder"

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

export default verbList