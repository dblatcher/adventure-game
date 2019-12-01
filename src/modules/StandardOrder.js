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

export {StandardOrder}