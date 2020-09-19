import { StandardOrder } from "../../src/modules/StandardOrder";
import { failableOrder } from "../../src/modules/failableOrder";
import { ConditionalOrder } from "../../src/modules/ConditionalOrder";
import { StandardCondition } from "../../src/modules/StandardCondition";



const starting = [
    new StandardOrder ('[status]CUTSCENE'),
    // new StandardOrder ('pc::Hello World, my name is {{pc.name}}.'),
    new StandardOrder ('pc##wave'),
    // new StandardOrder ('pc::This is the starting sequence for {{GAME.gameData.config.title}}.'),
    
    new StandardOrder('GAME','launchMinigame','TypeWriterAnimation',{ props:{
        textLines: [
            'Hey there.',
            'This is text\b\b\b\bwords...',
            'in a custom anina\b\bmation.',
        ],
        pageStyle: {
        },
        inkStyle : {
        }
    }}),
    new StandardOrder ('[status]LIVE'),
    
]

const skinnerWalkAbout = [
    new failableOrder ('SKINNER_C>>TUBE2_W',{tests:[new StandardCondition('LIGHT_SWITCH_W','status','===','on')]}),
    new failableOrder ('SKINNER_C::I am over here.', {action:'yell', tests:[new StandardCondition('LIGHT_SWITCH_W','status','===','on')]}),
    new failableOrder ('SKINNER_C>>TUBE1_W',{tests:[new StandardCondition('LIGHT_SWITCH_W','status','===','on')]}),
    new failableOrder ('SKINNER_C::Now I am up here.',{tests:[new StandardCondition('LIGHT_SWITCH_W','status','===','on')]}),
]

const skinnerWalkBetweenRooms = [
    // new ConditionalOrder({
    //     conditions:[ ['SKINNER_C','room','==',3]],
    //     orderIfTrue:['SKINNER_C::I am in the overlook'],
    //     orderIfFalse:['SKINNER_C::I am not in the overlook']
    // }),
    new ConditionalOrder({
        conditions:[ ['GAME','roomNumber','==',3]],
        orderIfTrue:['SKINNER_C::You can see the overlook'],
        orderIfFalse:['SkINNER_C::You do not see the overlook']
    }),
    new ConditionalOrder({
        conditions:[ ['GAME','roomNumber','==',3]],
        orderIfTrue:['SKINNER_C>>GATE_W'],
    }),
    new ConditionalOrder({
        conditions:[ ['SKINNER_C','room','==',3]],
        orderIfTrue:['SKINNER_C}}0,20,20'],
        orderIfFalse:['SKINNER_C::cannot'],
    }),
    new StandardOrder('SKINNER_C::I have moved?'),
    new ConditionalOrder({
        conditions:[ ['SKINNER_C','room','==',0]],
        orderIfTrue:['SKINNER_C::Now I am in the swamp'],
        orderIfFalse:['SKINNER_C::Now I am not in the swamp']
    }),
    new StandardOrder('SKINNER_C::wait...'),
    new ConditionalOrder({
        conditions:[ ['SKINNER_C','room','==',0]],
        orderIfTrue:['SKINNER_C}}3,300,150'],
    }),
]

const skinnerCounting = [
    new StandardOrder ('SKINNER_C::1'),
    new StandardOrder ('SKINNER_C::2'),
    new StandardOrder ('SKINNER_C::3'),
    new StandardOrder ('SKINNER_C::4'),
    new StandardOrder ('SKINNER_C::5'),
    new StandardOrder ('SKINNER_C::6'),
    new StandardOrder ('SKINNER_C::7'),
    new StandardOrder ('SKINNER_C::8'),
    new StandardOrder ('SKINNER_C::9'),
    new StandardOrder ('SKINNER_C::10'),
]

export default { starting, skinnerWalkAbout,skinnerWalkBetweenRooms, skinnerCounting };