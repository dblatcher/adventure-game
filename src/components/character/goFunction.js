function skip (path) {
	let horizontal = path[0].x > this.x ? 'right' : 'left';
	let vertical   = path[0].y > this.y ? 'up' : 'down';	
	let direction = Math.abs(path[0].x - this.x) > Math.abs(path[0].y - this.y) ? 
		horizontal :
		this.char.validDirections.includes(vertical) ? vertical : horizontal;

	return [{
		x: path[path.length-1].x,
		y: path[path.length-1].y,
		direction:direction,
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


export default function (target, options = {}) {

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
		var orders = [], currentPoint, prevPoint, direction, horizontal,vertical; 
		for (var i=0; i<path.length; i++) {
			currentPoint = path[i]
			prevPoint = i > 0 ? path[i-1] : this; 
			horizontal = currentPoint.x > prevPoint.x ? 'right' : 'left';
			vertical   = currentPoint.y > prevPoint.y ? 'up' : 'down';	
			direction = Math.abs(currentPoint.x - prevPoint.x) > Math.abs(currentPoint.y - prevPoint.y) ? 
				horizontal :
				this.char.validDirections.includes(vertical) ? vertical : horizontal;
				
			orders.push({
				x: path[i].x,
				y: path[i].y,
				direction:direction,
				action:options.action
			});
		}
	}

	this.char.destinationQueue = orders;
	var queEnd = orders[orders.length-1];
	var that = this;
	
	return new Promise (function (resolve, reject) {
	
		function takeStepAndCheckIfFinished (resolve ) {					
			if ( that.char.destinationQueue.indexOf(queEnd) == -1  ) {
				//not the same destinationQueue - players has given new order
				clearInterval(timer);
				resolve ( {finished:false, reason:'destination change',  message:`Not going to [${queEnd.x},${queEnd.y}] any more`} )
			}
			
			that.move(); // take step, shift destinationQueue if reached its end point
			
			if (that.char.destinationQueue.length === 0) { //finished orders
				clearInterval(timer);
				if (queEnd.x === that.x && queEnd.y === that.y) {
					resolve({finished:true, message:`Reached [${queEnd.x},${queEnd.y}]`});
				} else {
					resolve({finished:false, message:`Did not reach [${queEnd.x},${queEnd.y}]`});		
				}
			} 	
		}
		
		var timer = setInterval ( function(){takeStepAndCheckIfFinished (resolve) }, 50);
	});
	
}