
function Interaction (command,conditions,response) {
	this.command = {
		verb: command[0],
		subject: command[1],
		object: command[2] || false
	}
	this.conditions = conditions;
	this.response = response;
}

Interaction.makeMatrix = function (interactions) {
	var interactionMatrix = {};

	interactions.forEach (interaction => {
		
		if (!interactionMatrix[interaction.command.verb]) {interactionMatrix[interaction.command.verb] = {}}
		
		if (!interactionMatrix[interaction.command.verb][interaction.command.subject]) {
			interactionMatrix[interaction.command.verb][interaction.command.subject] = {}
		}
		var thirdParam = interaction.command.object || 'intransitive'; 

		if (!interactionMatrix[interaction.command.verb][interaction.command.subject][thirdParam]) {
			interactionMatrix[interaction.command.verb][interaction.command.subject][thirdParam] = []
		}

		var rightPlace = interactionMatrix[interaction.command.verb][interaction.command.subject][thirdParam];
		
		rightPlace.push ( {conditions:interaction.conditions, response: interaction.response} )

	});
	return interactionMatrix;
}



function parseOrderString(oString, options) {
	function arrayParse (input) {
		let output = input.split(',')
		output = output.map( (item) => {
			return isNaN(item) ? item : Number(item);
		})
		return output;
	}
	
	function objectParse (input) {
		return input;
	}

	const actionCodes = {
		CHARACTER: {
			say: 		{code: '::'},
			doAction: 	{code: '##'},
			goTo: 		{code: '>>', targetParser: arrayParse},
			goToRoom: 	{code: '}}', targetParser: arrayParse},
		},
		GAME: {
			setGameStatus: 		{code: '[status]'},
			setGameVar: 		{code: '[var]', targetParser: objectParse},
			teleportCharacter: 	{code: '[teleport]', targetParser: arrayParse },
			getInventoryItem: 	{code: '[get]'},
			looseInventoryItem: {code: '[loose]'},
		}
	}

	const suffixes = {
		_C : 'CHARACTER',
		_W : 'WORLDITEM',
		_I : 'INVENTORYITEM',
	}

	let actorType, actorId,action,target;

	Object.keys(actionCodes.GAME).forEach((key)=>{
		if (action) {return};
		let code = actionCodes.GAME[key].code
		if (oString.substring(0,code.length).toLowerCase() === code) {
			actorType = 'GAME';
			actorId = 'GAME';
			action = key;
			target = oString.substring(code.length);
		}
	})
	
	if (!actorType) {

		
		Object.keys(actionCodes.CHARACTER).forEach((key)=>{
			if (action) {return};
			let code = actionCodes.CHARACTER[key].code
			let codePos = oString.indexOf(code) 
			if (codePos !== -1) {
				actorType = 'CHARACTER';
				action = key;
				actorId = oString.substring(0, codePos)
				target = oString.substring(codePos + code.length);
			}
		})


	}

	
	if (target && actionCodes[actorType][action].targetParser) {
		target = actionCodes[actorType][action].targetParser(target)
	}

	return {
		actorId, action, target, options, oString
	} ;
}

function StandardOrder (actorIdOrOrderString, actionOrOptions, target, options={}) {
	if (arguments.length < 3 ) {
		Object.assign(this, parseOrderString(actorIdOrOrderString, actionOrOptions))
		console.log(this) 
	} else {
		this.actorId = actorIdOrOrderString;
		this.action  = actionOrOptions;
		this.target  = target;
		this.options = options;
	}
}

function doorFunction (doorId, destination) {	
	return function () {
		this.getThings('pc').goTo(this.getThings(doorId).walkToPoint)
		.then( (feedback) => {
			if (feedback.finished) {this.changeRoom(destination,{});}
		} );
	}
}
	
function takeFunction (worldItemId, inventoryItemId, worldItemStays=false) {	
	return function () {
		this.getThings('pc').goTo(this.getThings(worldItemId).walkToPoint)
		.then( (feedback) => {
			if (feedback.finished) {
				this.getInventoryItem(inventoryItemId);
				if (!worldItemStays) {this.getThings(worldItemId).item.removed = true}
			}
		} );
	}
}

function pcSays(text,time) {
	return function() { this.getThings('pc').say(text,{time:time});}	
}

export { Interaction, StandardOrder, doorFunction, pcSays, takeFunction }