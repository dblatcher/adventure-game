import { StandardOrder } from "../../src/modules/StandardOrder";
import { failableOrder } from "../../src/modules/failableOrder";
import { ConditionalOrder } from "../../src/modules/ConditionalOrder";
import { StandardCondition } from "../../src/modules/StandardCondition";



const starting = [
    new StandardOrder ('[status]CUTSCENE'),
    new StandardOrder ('pc::Hello World, my name is {{pc.name}}.'),
    new StandardOrder ('pc##wave'),
    new StandardOrder ('pc::This is the starting sequence for {{GAME.gameData.config.title}}.'),
    new StandardOrder ('[status]LIVE'),
]

const skinnerWalkAbout = [
    new failableOrder ('SKINNER_C>>TUBE2_W',{tests:[new StandardCondition('LIGHT_SWITCH_W','status','===','on')]}),
    new failableOrder ('SKINNER_C::I am over here.', {action:'yell'}),
    new failableOrder ('SKINNER_C>>TUBE1_W'),
    new failableOrder ('SKINNER_C::Now I am up here.'),
]

export default { starting, skinnerWalkAbout };