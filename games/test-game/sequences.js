import { StandardOrder } from "../../src/modules/StandardOrder";
import { ConditionalOrder } from "../../src/modules/ConditionalOrder";
import { StandardCondition } from "../../src/modules/StandardCondition";


const starting = [
    new StandardOrder ('[status]CUTSCENE'),
    new StandardOrder ('pc::Hello World, my name is {{pc.name}}.'),
    new StandardOrder ('pc##wave'),
    new StandardOrder ('pc::This is the starting sequence for {{GAME.gameData.config.title}}.'),
    new StandardOrder ('[status]LIVE'),
]

export default { starting };