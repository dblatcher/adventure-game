
Vue.component('character-c', {
	props:['char','measure'],

	data: function() {		
		var spriteSet = [];		
		var fullSet = this.$root.$data.sprites;
		for (var i=0; i< fullSet.length; i++) {		
			if (this.char.spritesUsed.includes(fullSet[i].id)) {spriteSet.push ( Object.assign({}, fullSet[i], {p:this} ) )	}
		};
		
		return {
			spriteSet : spriteSet,
			ident: this.char.id,
			name: this.char.name,
			x: this.char.startX ? Number (this.char.startX) : 0, 
			y: this.char.startY ? Number (this.char.startY) : 0,
			scale:this.char.initialScale || 1,
			baseHeight: this.char.baseHeight || 100,
			baseWidth: this.char.baseWidth || 100,
			saying:'', sayingQueue :[],
			actionQueue:[],
			behaviour: {action:'wait', direction:this.char.validDirections[0], actFrame:0},
			destinationQueue:[]
		}
	},

	computed :{
		scaledHeight : function() {return this.scale * this.baseHeight;},
		scaledWidth : function() {return this.scale * this.baseWidth;},
		isTalking : {
			get: function() {return this.saying !== ''},
			set: function(v) {if (v===false){this.saying=''; this.sayingQueue=[]}}
		},
		currentAction : function () {
			return (this.actionQueue.length) ? 
				this.actionQueue[0].action : this.behaviour.action;
		},
		currentDirection : function () {
			return (this.actionQueue.length) ? 
				this.actionQueue[0].direction : this.behaviour.direction;
		}, 
		frame : function() {
			var currentOrder = this.actionQueue[0] || this.behaviour;
			var directionNeeded = !Array.isArray(this.char.cycles[currentOrder.action]);
			var v = directionNeeded ? 
				this.char.cycles[currentOrder.action][currentOrder.direction][currentOrder.actFrame]:
				this.char.cycles[currentOrder.action][currentOrder.actFrame];			
			return {sprite: v[0], fx:v[1], fy:v[2]}
		},
		walkToPoint: function() {
			return {x:this.x, y:this.y}
		},
		styleObject : function () {return {
			position: 'absolute',
			height: (this.scaledHeight * this.measure.scale) + this.measure.unit,
			width:  (this.scaledWidth  * this.measure.scale) + this.measure.unit,
			bottom: (this.y  * this.measure.scale) + this.measure.unit,
			left:   (this.x  * this.measure.scale) + this.measure.unit,
			zIndex: 1000-this.y,
			transform: 'translateX(-50%)'
		}}
	},
	
	methods : {
		
		promiseDoAction (action, options = {}) {
			//validate inputs
			if (typeof action  !== 'string') {
				console.warn ('Action order skipped: non-string value for ' + this.name+'.')
				return Promise.resolve({
					finished:true,
					message:'Action order skipped: non-string value for ' + this.name+'.'
				});
			}
			if (!this.char.cycles[action]) {
				console.warn ('Action order skipped: ' + action +' is not a cycle of' + this.name+'.')
				return Promise.resolve({
					finished:true,
					message: 'Action order skipped: ' + action +' is not a cycle of' + this.name+'.'
				});
			}
			
			// default options.direction to current direction
			if (!options.direction) {options.direction = this.currentDirection};			
			
			//ensure options.direction is a direction supported by the character model's cycle;
			var availableDirections = Object.keys(this.char.cycles[action]);
			if (!availableDirections.includes(options.direction)) {
				options.direction = availableDirections[0];
			}
			
			var currentOrder = Object.assign({action:action, actFrame:0},options);
			var that = this;

			
			function execute(order, resolve) {
				that.actionQueue = [order];	
				var count = 0;
				var timer = setInterval (function(){
					// order.actFrame is updated by showNextFrame
					count++; 
					if (count > 0 && order.actFrame == 0) {
						clearInterval(timer);
						resolve({
							finished: true,
							message:that.ident + ' finished action:' + order.action
						});
					}
				},100);
			}
			

			return new Promise ( function (resolve, reject) {
				execute (currentOrder, resolve);
			});
			
			
		},
		
		doAction : function (action, options = {}, clearQueue = true) {
			//validate inputs
			if (typeof action  !== 'string') {return false;}
			if (!this.char.cycles[action]) {return false;}
			
			// default options.direction to current direction
			if (!options.direction) {options.direction = this.currentDirection};			
			
			//ensure options.direction is a direction supported by the character model's cycle;
			var availableDirections = Object.keys(this.char.cycles[action]);
			if (!availableDirections.includes(options.direction)) {
				options.direction = availableDirections[0];
			}
			
			var order = Object.assign({action:action, actFrame:0},options);			
			if (clearQueue){
				this.actionQueue.splice(0,this.actionQueue.length,order);
			}	else {
				this.actionQueue.push(order);
			}
		},


		goTo : function (destination, options = {}, clearQueue = true) {
			if (typeof options.action === 'undefined') {options.action = 'walk'};
			
			var orders = [];
			
			var path = this.$root.findPath(this,destination); 
			console.log(path);
			
			if (path.length === 0 ) {console.log(`No route found to [${destination.x},${destination.y}]`)};
			
			if (path.length) {
				var currentPoint, lastPoint, direction, horizontal,vertical; 
				for (var i=0; i<path.length; i++) {
					currentPoint = path[i]
					lastPoint = i > 0 ? path[i-1] : this; 
					horizontal = currentPoint.x > lastPoint.x ? 'right' : 'left';
					vertical   = currentPoint.y > lastPoint.y ? 'up' : 'down';	
					direction = Math.abs(currentPoint.x - lastPoint.x) > Math.abs(currentPoint.y - lastPoint.y) ? 
						horizontal :
						this.char.validDirections.includes(vertical) ? vertical : horizontal;
						
					orders.push({
						x: path[i].x,
						y: path[i].y,
						direction:direction,
						action:options.action
					});
				}
				orders[orders.length-1].ref = options.ref;
			}
			
			this.destinationQueue.push(...orders);
		},

		promiseGoTo : function (destination, options = {}) {
			
			if (typeof options.action === 'undefined') {options.action = 'walk'};
			var path = this.$root.findPath(this,destination); 
			var that = this;
			
			if (path.length === 0 ) {
				return Promise.resolve( {finished: false, reason:'no route',  message:`No route found to [${destination.x},${destination.y}]`})
			};
			
			// findPath may not point to the extact point (adjusts to navigate obstacles).
			// addjust destination so this isn't confused with a destination change triggered by player
			destination.x = path[path.length-1].x;
			destination.y = path[path.length-1].y;
			
			
			
			return new Promise (function (resolve, reject) {
			
				// create list of orders
				var orders = [], currentPoint, lastPoint, direction, horizontal,vertical; 
				for (var i=0; i<path.length; i++) {
					currentPoint = path[i]
					lastPoint = i > 0 ? path[i-1] : that; 
					horizontal = currentPoint.x > lastPoint.x ? 'right' : 'left';
					vertical   = currentPoint.y > lastPoint.y ? 'up' : 'down';	
					direction = Math.abs(currentPoint.x - lastPoint.x) > Math.abs(currentPoint.y - lastPoint.y) ? 
						horizontal :
						that.char.validDirections.includes(vertical) ? vertical : horizontal;
						
					orders.push({
						x: path[i].x,
						y: path[i].y,
						direction:direction,
						action:options.action
					});
				}
				
				that.destinationQueue = orders;
				
				
				function takeStepAndCheckIfFinished (resolve ) {
					
					var queEnd = that.destinationQueue[that.destinationQueue.length-1];
					
					if (queEnd.x !== destination.x || queEnd.y !== destination.y) {
						//queEnd has changed -  no longer going to destination
						clearInterval(timer);
						resolve ( {finished:false, reason:'destination change',  message:`Not going to [${destination.x},${destination.y}] any more`} )
					}
					
					that.move(); // take step, shift destinationQueue if reached its end point
					
					if (that.destinationQueue.length === 0) { //finished orders
						clearInterval(timer);
						if (destination.x === that.x && destination.y === that.y) {
							resolve({finished:true, message:`Reached [${destination.x},${destination.y}]`});
						} else {
							resolve({finished:false, message:`Did not reach [${destination.x},${destination.y}]`});
							
						}
					} 
					
				};
				
				var timer = setInterval ( function(){takeStepAndCheckIfFinished (resolve) }, 50);
			});
			
		},
		
		promiseSay : function (text, options = {} ){
			if (typeof options.time !== 'number') {options.time = 1000}
			if (typeof options.action !== 'string') {options.action = 'talk'}
			var currentOrder = Object.assign({text:text}, options);
			
			var that = this;
			
			executeOrder = function (order,resolve) {		
				that.saying = order.text;
				if (that.destinationQueue.length === 0) { //not moving
					if (that.char.cycles[order.action]) { //and the character model has a cycle matching the action options 
						that.behaviour.action = order.action;
						that.behaviour.actFrame = 0;
					}
				}
				setTimeout(function(){
					if (typeof order.callback == 'function') {order.callback()};
					
					if (that.sayingQueue.length > 0) {
						executeOrder (that.sayingQueue.shift(),resolve);
					} else {
						that.saying = '';
						if (that.destinationQueue.length === 0) { //not moving
							that.behaviour.action = 'wait';
							that.behaviour.actFrame = 0;
						}
						resolve({
							finished:true,
							message: that.name+' finished saying \"'+order.text + '\".'
						});						
					};	
				
				},order.time);
				
			};
			
			if (that.isTalking === false) {
				return new Promise ( function (resolve, reject) {
					executeOrder (currentOrder, resolve);
				});
			} else {
				that.sayingQueue.push(currentOrder);
			};
			
			
		},
		
		say : function (text, options = {}) {
			if (typeof options.time !== 'number') {options.time = 1000}
			if (typeof options.action !== 'string') {options.action = 'talk'}
			var that = this;
			
			var order = Object.assign({text:text}, options);
			
			
			if (that.isTalking === false) {
				that.saying = text;
				setTimeout(function(){endOfLine(order)},order.time);
				if (that.destinationQueue.length === 0) { //not moving
					if (that.char.cycles[order.action]) { //and the character model has a cycle matching the action options 
						that.behaviour.action = order.action;
						that.behaviour.actFrame = 0;
					}
				}
			} else {
				that.sayingQueue.push(order);
			};
			
			function endOfLine (sayOrder) {
				if (that.sayingQueue.length) {
					var nextOrder = that.sayingQueue.shift();
					that.saying = nextOrder.text;
					setTimeout(function(){endOfLine(nextOrder)},nextOrder.time);
				} else {
					that.saying = '';
					that.behaviour.action = 'wait';
					that.behaviour.actFrame = 0;
					that.$root.$emit('mile-stone','speech-end',that,sayOrder);
					if (sayOrder.ref) {that.$root.$emit('mile-stone'+':'+sayOrder.ref)};					
				}	
			};
		},
		move : function () {
			if (this.destinationQueue.length === 0) {return false};
			var moveOrder = this.destinationQueue[0];
			
			if (!moveOrder.started) {
				if (moveOrder.action) {
					if (moveOrder.action !== this.currentAction || moveOrder.direction !== this.currentDirection) {
						this.behaviour.action = moveOrder.action;
						this.behaviour.direction = moveOrder.direction;
						this.behaviour.actFrame = 0;
					}
				};
			};			
			moveOrder.started = true;
			
			// determine movement - the 'step' the character will try to take.
			var d = {x: moveOrder.x - this.x, y:moveOrder.y - this.y};
			var absD = {x: Math.abs(d.x), y: Math.abs(d.y) };
			var speed = 6;
			var movement = {x:0,y:0};
			
			var rX = absD.x ? absD.x / ( absD.x + absD.y) : 0;
			var rY = absD.y ? absD.y / ( absD.x + absD.y) : 0;
							
			movement.x = Math.min ( absD.x, speed*rX );
			movement.y = Math.min ( absD.y, speed*rY );
			if (d.x < 0 ) {movement.x *= -1}
			if (d.y < 0 ) {movement.y *= -1}
					
			var obstacles = this.$root.obstacles;
			for (var i=0; i<obstacles.length; i++) {
				if (obstacles[i].containsPoint( this.x+movement.x, this.y+movement.y) ) {
					movement = {x:0, y:0};
					console.log('hit-obstacle', moveOrder);
					this.$root.$emit('mile-stone','hit-obstacle',this,moveOrder);
					if(moveOrder.ref) {this.$root.$emit('mile-stone-fail:'+moveOrder.ref)};
					//this.doAction('wait', {loop:true, direction:moveOrder.direction},true);
					this.behaviour.action = 'wait';
					this.behaviour.direction = moveOrder.direction;
					this.behaviour.actFrame = 0;
					this.destinationQueue.shift();					
				}
			}
			this.x += movement.x;
			this.y += movement.y;
			
			// test if character got to the moveOrder destination, shift queue, report if finished
			if (this.x ===  moveOrder.x && this.y === moveOrder.y) { 
				
				this.destinationQueue.shift();
				if (this.destinationQueue.length === 0) {
					//this.doAction('wait', {loop:true, direction:moveOrder.direction},true);
					this.behaviour.action = 'wait';
					this.behaviour.actFrame = 0;
					this.behaviour.direction = moveOrder.direction;
					this.$root.$emit('mile-stone','reached-destination',this,moveOrder);
					if(moveOrder.ref) {this.$root.$emit('mile-stone'+':'+moveOrder.ref)};
				};
			}
			
		},				
		showNextFrame : function () {
			
			var order = this.actionQueue[0] || this.behaviour;
			
			var directionNeeded = !Array.isArray(this.char.cycles[order.action]);
			var cycle = directionNeeded ? 
				this.char.cycles[order.action][order.direction] :
				this.char.cycles[order.action] ;

			var onLastFrame = !(cycle.length > order.actFrame+1);
			order.actFrame = onLastFrame ? 0 : order.actFrame + 1;
			
			if (onLastFrame && (!order.loop && order !==  this.behaviour)) {
				this.actionQueue.shift();
					
				if (this.actionQueue.length === 0){
					this.$root.$emit('mile-stone','actions-finished',this,order);
					if (order.ref) {this.$root.$emit('mile-stone'+':'+order.ref)};
					
				}
				
			}
		},
		clickHandler : function (event) {
			if (this.ident === 'pc') {return false};
			event.stopPropagation();
			this.$root.$emit('clicked-thing', this.char);
		},
		hoverHandler : function (event) {
			if (this.ident === 'pc') {return false};
			this.$root.$emit('hover-event', this, event);
		},		
	},
	
	mounted : function() {		
		var that = this;
		setInterval (function(){that.showNextFrame()},100);
//		setInterval (function(){that.move()},50);
	},
	template: `
	<article @click="clickHandler(event)" v-on:mouseover="hoverHandler(event)" v-on:mouseout="hoverHandler(event)"
	v-bind:name="name" 
	v-bind:action="currentAction">
		<div v-bind:style="styleObject">
			<sprite-image v-for="sprite in this.spriteSet":key="sprite.id"
				v-bind:sprite="sprite"
				v-bind:fx="sprite.p.frame.fx" 
				v-bind:fy="sprite.p.frame.fy"
				v-bind:height="sprite.p.scaledHeight"
				v-bind:width="sprite.p.scaledWidth"
				v-bind:index="sprite.p.frame.sprite"
				v-bind:measure = "sprite.p.measure"
				></sprite-image>
		</div>
		
		<speech-line v-bind:style="{
				bottom: ( (y+scaledHeight) * this.measure.scale )+this.measure.unit,
				left: (x * this.measure.scale)+this.measure.unit}"
			v-bind:text="saying"
			v-bind:charCentre="x"
			v-bind:color="char.speechColor"
		></speech-line>				
		
	</article>
	`
})

