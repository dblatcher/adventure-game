import {Verb} from "../modules/constructors"
import {ConditionalOrder} from "../modules/ConditionalOrder"
import {StandardOrder} from "../modules/StandardOrder"

var verbList = [
    new Verb('WALK',{
        icon: require('../icons/walking.svg'),
        description: 'walk to',
        defaultResponse: [
            new ConditionalOrder({
                conditions:[['WILDCARD','{{game.subject.dataType}}', '!=', 'InventoryItem']],
                orderIfTrue:['pc>>{{game.subject.id}}',{wasManual:true}],
            }),
        ]
    }),
    new Verb('LOOK', {
        icon: require('../icons/eye.svg'),
        showOnInventoryBox: true,
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
    new Verb('ACTIVATE', {
        icon: require('../icons/hand-paper.svg'),
        description: 'activate',
        defaultResponse: [
            new StandardOrder('pc','say',`I don't know what to do with that.`)
        ]
    }),
    new Verb('USE', {
        description: 'use',
        preposition:'with',
        showOnInventoryBox: true,
        usesSelectedItem: true,
        icon: require('../icons/hand-pointer.svg'),
        defaultResponse: [
            new ConditionalOrder({
                conditions:[['WILDCARD','{{game.object}}', 'false']],
                orderIfTrue:['pc:: I can\'t use the {{game.subject.name}}!'],
                orderIfFalse:['pc:: I can\'t use the {{game.subject.name}} with the {{game.object.name}}!'],
            }),
        ],
    }),
]

export default verbList;