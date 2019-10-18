function skip (path) {
	return [{
		x: path[path.length-1].x,
		y: path[path.length-1].y,
		direction: findDirection(path[0], this, this.char.validDirections),
		action:'walk'
	}];
}


function standardiseDestination (destination, game) {
	function findTargetWalkTo(id) {
		let thing = game.getThings(id)
		return thing ? thing.walkToPoint : false;
	}

	if (typeof destination.x === 'number' && typeof destination.y === 'number') {
		return destination;
	}

	if (typeof destination === 'string') {
		let point = findTargetWalkTo(destination)
		if (point === false) {
			console.warn('Character.goTo failed: id ' + destination +  ' not found')
			return false;
		}
		return point;
	}
	
	if (Array.isArray(destination)) {
		if (typeof destination[0] === 'string') {
			let point = findTargetWalkTo(destination[0])
			if (point === false) {
				console.warn('Character.goTo failed: id ' + destination[0] +  ' not found')
				return false
			}
			return point;
		} 
		
		return {x: destination[0], y: destination[1]}
		
	}

}


function findDirection (currentPoint, prevPoint, validDirections) {
	let horizontal = currentPoint.x > prevPoint.x ? 'right' : 'left';
	let vertical   = currentPoint.y > prevPoint.y ? 'up' : 'down';	
	return  Math.abs(currentPoint.x - prevPoint.x) > Math.abs(currentPoint.y - prevPoint.y) ? 
		horizontal :
		validDirections.includes(vertical) ? vertical : horizontal;
}


function turnTo (target, options = {}) {
	let destination = standardiseDestination(target, this.theApp);
	if (destination === false ) {
		return Promise.resolve( {finished: false, reason:'not valid destination'})
	}
	
	this.char.behaviour_direction = findDirection (destination,this,this.char.validDirections)
	return Promise.resolve( {finished: true})
}

function goTo (target, options = {}) {

	let destination = standardiseDestination(target, this.theApp);
	if (destination === false ) {
		return Promise.resolve( {finished: false, reason:'not valid destination'})
	}


	if (typeof options.action === 'undefined' || !this.char.cycles[options.action]) {options.action = 'walk'}

	var path = this.theApp.findPath(this,destination); 
	if (path.length === 0 ) {
		return Promise.resolve( {finished: false, reason:'no route',  message:`No route found to [${destination.x},${destination.y}]`})
	}
	

	// create list of orders
	
	if (this.theApp.instantMode) {
		var orders = skip.apply(this,[path]);
	} else {
		var orders = []; 
		for (var i=0; i<path.length; i++) {
			orders.push({
				x: path[i].x,
				y: path[i].y,
				direction: findDirection (path[i],  i > 0 ? path[i-1] : this, this.char.validDirections),
				action:options.action
			});
		}
	}

	this.char.destinationQueue = orders;
	var targetOrder = orders[orders.length-1];
	var that = this;


	return new Promise (function (resolve, reject) {
	
		let handleMoveOrderDone = function(doneOrder){
			if ( doneOrder===targetOrder) {
				that.$off('moveOrderDone', handleMoveOrderDone )
				if (targetOrder.x === that.x && targetOrder.y === that.y) {
					resolve({finished:true, message:`Reached [${targetOrder.x},${targetOrder.y}]`});
				} else {
					resolve({finished:false, message:`Did not reach [${targetOrder.x},${targetOrder.y}]`});		
				}
				return;
			}
			else if (!that.char.destinationQueue.includes(targetOrder) ) {
				that.$off('moveOrderDone', handleMoveOrderDone )
				resolve ( {finished:false, reason:'destination change',  message:`Not going to [${targetOrder.x},${targetOrder.y}] any more`} )
			}
		}

		// subscribe to event fired by this.move (called by onBeat) when a move order is finished
		that.$on('moveOrderDone', handleMoveOrderDone )

	});
	
}

export { goTo, turnTo }