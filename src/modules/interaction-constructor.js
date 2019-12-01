
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


class StandardOrder {
	constructor (actorIdOrOrderString, actionOrOptions, target, options={}) {
		if (arguments.length < 3 ) {
			Object.assign(this, parseOrderString(actorIdOrOrderString, actionOrOptions))
		} else {
			this.actorId = actorIdOrOrderString;
			this.action  = actionOrOptions;
			this.target  = target;
			this.options = options;
		}

		function parseOrderString(oString, options) {
			function arrayParse (input) {
				let output = input.split(',')
				output = output.map( (item) => {
					return isNaN(item) ? item : Number(item);
				})
				return output;
			}
			
			function emptyObject () {
				return {};
			}

			const actionCodes = {
				CHARACTER: {
					say: 		{code: '::'},
					doAction: 	{code: '##'},
					goTo: 		{code: '>>', targetParser: arrayParse},
					turnTo: 	{code: '^^', targetParser: arrayParse},
					goToRoom: 	{code: '}}', targetParser: arrayParse},
				},
				INVENTORYITEM: {
					add: 		{code: '++'},
					loose:	 	{code: '--'},
				},
				GAME: {
					setGameStatus: 		{code: '[status]'},
					setGameVar: 		{code: '[var]', targetParser: emptyObject},
					changeRoom: 		{code: '[room]', targetParser: arrayParse },
					teleportCharacter: 	{code: '[teleport]', targetParser: arrayParse },
					getInventoryItem: 	{code: '[get]'},
					looseInventoryItem: {code: '[loose]'},
					runSequence:		{code: '[sequence]'},
					wait:				{code: '[wait]'},
				}
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

			if (!actorType) {
				Object.keys(actionCodes.INVENTORYITEM).forEach((key)=>{
					if (action) {return};
					let code = actionCodes.INVENTORYITEM[key].code
					let codePos = oString.indexOf(code) 
					if (codePos !== -1) {
						actorType = 'INVENTORYITEM';
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

	}
	get isStandardOrder() {return true}

	execute(game) {

		const {actorId, action, target,options} = this;

		let actor = game.getComponentOrDataObject(actorId)
		if (!actor) {
			console.warn(`failed order: ${actorId}' not found`)
			return Promise.resolve({result:'failed'})
		}
	
		if (typeof actor[action] !== "function") {
			console.warn(`failed order: ${action}' is not a method of ${actor === game? 'Game' : actorId }`)
			console.log('failed order:',this)
			return Promise.resolve({})
		}
	
		let execution = actor[action](target, options || {}, game)
		if (!execution || !execution.then) { return Promise.resolve({result: execution}) }
		return execution;


	}
}

class StandardCondition {
	constructor (actorId, property, operator, comparitor) {
		this.actorId = actorId;
		this.property = property;
		this.operator = operator;
		this.comparitor = comparitor;
	}

	evaluate (game){
		const {actorId, operator, property, comparitor} = this;
		let actor = game.getComponentOrDataObject(actorId)
		if (!actor) {
			console.warn(`condition invalid: ${actorId}' not found`)
			return true
		}
		
		switch (operator) {
			case "true":
				return !!actor[property]; 
			case "false":
				return !actor[property]; 
			case "eq":
			case "=":
			case "==":
			case "===":
				return actor[property] == comparitor;
			case "ne":
			case "!=":
			case "!==":
			case "<>":
				return actor[property] !== comparitor;
			case "gt":
			case ">":
				return actor[property] > comparitor;
			case "lt":
			case "<":
				return actor[property] < comparitor;
			case "ge":
			case ">=":
				return actor[property] >= comparitor;
			case "le":
			case "<=":
				return actor[property] <= comparitor;
		}

		console.warn ('condition invalid',condition)
		return true
	}

	get isStandardCondition() {return true}
}

class ConditionalOrder {
	constructor (inputObject) {
		const { conditions, orderIfTrue, orderIfFalse} = inputObject;
		this.conditions = conditions.map( condition => {
			return new StandardCondition(...condition)
		})
		this.orderIfTrue = orderIfTrue ? 
		new StandardOrder(...orderIfTrue) : null;
		this.orderIfFalse = orderIfFalse ? 
		new StandardOrder(...orderIfFalse) : null;
	}

	get isConditionalOrder() {return true}

	execute(game) {
		const {conditions, orderIfTrue, orderIfFalse} = this;

		let conditionsPassed = conditions.map( 
            (condition)=>{ return condition.evaluate(game)}
        ).includes(false) === false;

        if (conditionsPassed && orderIfTrue) {return orderIfTrue.execute(game)}
        if (!conditionsPassed && orderIfFalse) {return orderIfFalse.execute(game)}
        return Promise.resolve()
	}
}


function doorFunction (doorId, destination) {	
	return function () {
		this.getThings('pc').goTo(this.getThings(doorId).walkToPoint,{wasManual:true})
		.then( (feedback) => {
			if (feedback.finished) {this.changeRoom(destination,{});}
		} );
	}
}
	
function takeFunction (worldItemId, inventoryItemId, worldItemStays=false) {	
	return function () {
		this.getThings('pc').goTo(this.getThings(worldItemId).walkToPoint,{wasManual:true})
		.then( (feedback) => {
			if (feedback.finished) {
				this.getInventoryItem(inventoryItemId);
				if (!worldItemStays) {this.getThings(worldItemId).item.removed = true}
			}
		} );
	}
}


export { Interaction, StandardOrder, StandardCondition, ConditionalOrder, doorFunction, takeFunction }