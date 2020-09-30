import { StandardOrder } from "../modules/StandardOrder";
import { ConditionalOrder } from "../modules/ConditionalOrder";


export default function unpackOrder(input) {

    if (input[0] == 'ConditionalOrder') {
        return new ConditionalOrder(input[1])
    }

    if (input[0] == 'StandardOrder') {
        return new StandardOrder(...input[1])
    }

    return new StandardOrder('pc::dummy order')
}