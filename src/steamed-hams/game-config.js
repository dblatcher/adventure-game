import { StandardOrder } from "../modules/StandardOrder";
import { Verb } from "../modules/constructors";

const config = {

}

var verbList = [
    new Verb('walk to','WALK'),
    new Verb('pick up','TAKE'),
    new Verb('look at','LOOK'),
    new Verb('give','GIVE', 'to'),
    new Verb('use','USE', 'with'),
    new Verb('talk to','TALK'),
    new Verb('open','OPEN'),
    new Verb('close','SHUT')
]


var defaultResponses = {
    "WALK" : function(command) {
        return [new StandardOrder('pc','goTo',command.subject.id, {wasManual:true})]
    },
    "LOOK" : function(command) {
        if (command.subject.id.endsWith('W')) {
            return [new StandardOrder('pc','say',`It looks like a normal ${command.subject.name} to me.`)]
        } else {
            return [new StandardOrder('pc','say',`I don't see anything special about ${command.subject.name}.`) ]
        }
    },
    "OPEN" : function(command) {
        return [new StandardOrder('pc','say',`The ${command.subject.name} doesn't open.`)]    
    },
    "misc" : function(command) {
        return [new StandardOrder('pc','say',`I can't do that.`)  ]  
    } 
}

export { defaultResponses, verbList, config }