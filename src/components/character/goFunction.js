export default function (destination, options = {}) {
	
	if (typeof options.action === 'undefined') {options.action = 'walk'};

	var path = this.theApp.findPath(this,destination); 
	if (path.length === 0 ) {
		return Promise.resolve( {finished: false, reason:'no route',  message:`No route found to [${destination.x},${destination.y}]`})
	};
	
	// create list of orders
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
		};
		
		var timer = setInterval ( function(){takeStepAndCheckIfFinished (resolve) }, 50);
	});
	
}