import { StandardOrder } from "../modules/StandardOrder";
import { ConditionalOrder } from "../modules/ConditionalOrder";
import { StandardCondition } from "../modules/StandardCondition";


const starting = [
    new StandardOrder ('[status]CUTSCENE'),
    new StandardOrder ('pc::This is the starting sequence'),
    new StandardOrder ('pc##wave'),
    new StandardOrder ('pc::Hello World'),
    new StandardOrder ('[status]LIVE'),
]

export default { starting };