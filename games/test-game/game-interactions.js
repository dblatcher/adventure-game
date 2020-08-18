import { Interaction } from "../../src/modules/interaction-constructor";
import { StandardOrder } from "../../src/modules/StandardOrder";
import { failableOrder } from "../../src/modules/failableOrder";
import { BranchingOrder } from "../../src/modules/BranchingOrder";
import { StandardCondition } from "../../src/modules/StandardCondition";

function pcSays(text,time) {
	return [new StandardOrder ('pc', 'say',text,{time:time})]
}

function doorFunction(worldItemId, destinationArray) {
	return [
		new failableOrder (`pc>>${worldItemId}`), 
		new StandardOrder('GAME','changeRoom',destinationArray),
	]
}

var interactions = [
	new Interaction(['LOOK','WINDOW_W'],[],[new StandardOrder ('pc::It\'s a nice window')]),
	
	new Interaction (
		['OPEN','DOOR_W'],
		[new StandardCondition('DOOR_W','status','===','closed')],
		[
			new StandardOrder ('pc::Okay!'),
			new failableOrder ('pc>>DOOR_W'),
			new StandardOrder ('DOOR_W','setStatus',['opening','open'])
		]
	),

	new Interaction(['OPEN','DOOR_W'],[],[new StandardOrder ('pc::It\'s not closed!')]),

	new Interaction(['WALK','DOOR_W'],[new StandardCondition('DOOR_W','status','===','open')],
		doorFunction('DOOR_W',['SWAMP_R',675,10])
	),

	new Interaction(
		['SHUT','DOOR_W'],
		[new StandardCondition('DOOR_W','status','===','open')],
		[
			new StandardOrder('pc::ok'),
			new failableOrder('pc>>DOOR_W'),
			new StandardOrder('DOOR_W', 'setStatus', ['closing', 'closed'])
		]
	),
	
	new Interaction(['SHUT','DOOR_W'],[],pcSays('It\'s already closesd.')),
	
	new Interaction(['TAKE','BUCKET_W'],[],
		[
			new StandardOrder ('[status]CUTSCENE'),
			new StandardOrder ('[get]BUCKET_I'),
			new StandardOrder ('BUCKET_W', 'setRemoval', true),
			new StandardOrder ('BILLY_C::Hey, that\'s my bucket!'),
			new StandardOrder ('BILLY_C','goTo',{x:100,y:10}),
			new StandardOrder ('[status]LIVE'),
		]
	),
	
	new Interaction (['WALK','HOUSE_W'],[],
		doorFunction('HOUSE_W',['LIVING_ROOM_R',260,15])
	),
	
	new Interaction(['USE','SHOE_I'],[],pcSays("It doesn't fit me")),
	
	new Interaction(['USE','BUCKET_I','FIRE_W'],
	[new StandardCondition('FIRE_W','status','===','burning')],[
		new StandardOrder ('[status]CUTSCENE'),
		new StandardOrder ('pc::put out fire? Okay!'),
		new StandardOrder ('pc>>FIRE_W'),
		new StandardOrder ('FIRE_W', 'setStatus',['extinguishing','out']),
		new StandardOrder ('BILLY_C::Hey!'),
		new StandardOrder ('BILLY_C::That was my fire'),
		new StandardOrder ('BILLY_C>>HOUSE_W'),
		new StandardOrder ('BILLY_C}}1,20,5'),
		new StandardOrder ('[status]LIVE'),
	]),
	
	new Interaction(['USE','BUCKET_I','FIRE_W'],[],pcSays("It's out already.")),
	
	new Interaction(['TALK','LUIGI_C'],[],
	[new StandardOrder('[status]CONVERSATION', 'withLuigi')]
	),

	new Interaction(['LOOK',"NAIL_I"],[],
	[new StandardOrder('pc::I have {{NAIL_I.quantity}} nails.')]
	),
	
	new Interaction(['USE',"NAIL_I","WINDOW_W"],[],[
		new StandardOrder('[var]',{wantsHammer: true}),
		new StandardOrder('pc::I need a hammer!'),
	]),

	new Interaction(['WALK','GATE_W'],[],
	doorFunction('GATE_W',['SWAMP_R',100,10])
	),

	new Interaction(['WALK','KEYPAD_DOOR_W'],[],
	doorFunction('KEYPAD_DOOR_W',['TEST_ROOM_R',100,10])
	),

	new Interaction(['LOOK','KEYPAD_DOOR_W'],[],[
		new StandardOrder('pc::the number "1234" has been scratched in the frame'),
	]),

	new Interaction(['LOOK','KEYPAD_DOOR_W'],[],[
		new StandardOrder('pc::the number "1234" has been scratched in the frame'),
	]),

	new Interaction(['USE','KEYPAD_W'],[new StandardCondition('KEYPAD_DOOR_W','status','===','closed')],
		[
			new failableOrder('pc>>KEYPAD_W'),
			new StandardOrder('[status]CUTSCENE'),
			new StandardOrder(`pc::let's try this keypad!`),
			new BranchingOrder({initialOrderArguments:['[status]MINIGAME',{componentName:'KeyPad', props:{answer:1234}}],
			finishedOutcome: [
				['KEYPAD_DOOR_W','setStatus',['opening','open']],
				['pc:: I got it right!'],
			], 
			notFinishedOutcome: [
				['pc:: I give up!'],
			]}),
			new StandardOrder(`pc::let's carry on.`),
			new StandardOrder('[status]LIVE'),
		]
	),

	new Interaction(['USE','KEYPAD_W'],[],
		[
			new StandardOrder(`pc::The door is already open.`),
		]
	),
]



var interactionMatrix = Interaction.makeMatrix(interactions);
export { interactionMatrix }