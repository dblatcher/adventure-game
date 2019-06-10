
Vue.component('character-c', {

	props:['char'],
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
		actionQueue:[{action:'wait',loop:true,direction:this.char.validDirections[0], actFrame:0}],
		storedDirection : this.char.validDirections[0],
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
		frame : function() {
			var currentOrder = this.actionQueue[0] || {standby:true, action:'wait',loop:true,direction:this.storedDirection, actFrame:0}
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
			height: this.scaledHeight+'px',
			width: this.scaledWidth+'px',
			bottom: this.y+'px',
			left: this.x+'px',
			zIndex: 1000-this.y,
			transform: 'translateX(-50%)'
		}}
	},
	methods : {
		doAction : function (action, options = {}, clearQueue = true) {
			//validate inputs
			if (typeof action  !== 'string') {return false;}
			if (!this.char.cycles[action]) {return false;}
			
			// default options.direction to current direction
			var currentDirection = this.actionQueue[0] ? this.actionQueue[0].direction : this.storedDirection;		
			if (!options.direction) {options.direction = currentDirection};			
			
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

		goToViaPath : function (destination, options = {}, clearQueue = true) {
			if (typeof options.action === 'undefined') {options.action = 'walk'};
			
			var orders = [];
			
			var path = this.$root.findPath(this,destination); 
			
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
				console.log(orders);
			}
			
			this.destinationQueue.push(...orders);
		},
		
		goTo: function (destination, options = {}, clearQueue = true) {
			//to do:
			//generate a series of orders as needs to go around obstacles
			//make sure only the final order gets the ref property of the destination argument
			//handle cases of unreachable destinations
			
			if (typeof options.action === 'undefined') {options.action = 'walk'}
			
			var order = Object.assign({x:destination.x, y:destination.y} ,options);
			
			var horizontal = order.x > this.x ? 'right' : 'left';
			var vertical   = order.y > this.y ? 'up' : 'down';	
			order.direction = Math.abs(order.x - this.x) > Math.abs(order.y - this.y) ? 
				horizontal:
				this.char.validDirections.includes(vertical) ?
					vertical : horizontal;
				
			if (clearQueue){
				this.destinationQueue.splice(0,this.destinationQueue.length,order);
			} else {
				this.destinationQueue.push(order);
			}
		},
	
		say : function (text, options = {}) {
			if (typeof options.time !== 'number') {options.time = 1000}
			var that = this;
			
			var order = Object.assign({text:text}, options);
			
			if (that.isTalking === false) {
				that.saying = text;
				setTimeout(function(){endOfLine(order)},order.time);
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
					console.log(moveOrder.action, moveOrder.direction)
					console.log(this.actionQueue[0].action, this.actionQueue[0].direction)
					if (moveOrder.action !== this.actionQueue[0].action || moveOrder.direction !== this.actionQueue[0].direction) {
						console.log('!')
						this.doAction(moveOrder.action, {loop:true, direction: moveOrder.direction||this.direction},true);
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
					this.$root.$emit('mile-stone','hit-obstacle',this,moveOrder);
					if(moveOrder.ref) {this.$root.$emit('mile-stone-fail:'+moveOrder.ref)};
					this.doAction('wait', {loop:true, direction:moveOrder.direction},true);
					this.destinationQueue.shift();					
				}
			}
			
			this.x += movement.x;
			this.y += movement.y;
			
			// test if character got to the moveOrder destination, shift queue, report if finished
			if (this.x ===  moveOrder.x && this.y === moveOrder.y) { 
				
				this.destinationQueue.shift();
				if (this.destinationQueue.length === 0) {
					this.doAction('wait', {loop:true, direction:moveOrder.direction},true);
					this.$root.$emit('mile-stone','reached-destination',this,moveOrder);
					if(moveOrder.ref) {this.$root.$emit('mile-stone'+':'+moveOrder.ref)};
				};
			}
			
		},				
		showNextFrame : function () {
			
			var order = this.actionQueue[0] || {action:'wait',loop:true,direction:this.char.validDirections[0], actFrame:0};
			
			var directionNeeded = !Array.isArray(this.char.cycles[order.action]);
			var cycle = directionNeeded ? 
				this.char.cycles[order.action][order.direction] :
				this.char.cycles[order.action] ;

			var onLastFrame = !(cycle.length > order.actFrame+1);
			order.actFrame = onLastFrame ? 0 : order.actFrame + 1;
			
			if (onLastFrame && !order.loop) {
				this.actionQueue.shift();
					
				if (this.actionQueue.length === 0){
					this.$root.$emit('mile-stone','actions-finished',this,order);
					if (order.ref) {this.$root.$emit('mile-stone'+':'+order.ref)};
					this.storedDirection = order.direction;
					this.doAction('wait',{loop:true, direction:order.direction} );
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
		setInterval (function(){that.move()},50);
	},
	template: `
	<article @click="clickHandler(event)" v-on:mouseover="hoverHandler(event)" v-on:mouseout="hoverHandler(event)"
	v-bind:name="name" 
	v-bind:action="actionQueue[0].action">
		<div v-bind:style="styleObject">
			<sprite-image v-for="sprite in this.spriteSet":key="sprite.id"
				v-bind:sprite="sprite"
				v-bind:fx="sprite.p.frame.fx" 
				v-bind:fy="sprite.p.frame.fy"
				v-bind:height="sprite.p.scaledHeight"
				v-bind:width="sprite.p.scaledWidth"
				v-bind:index="sprite.p.frame.sprite"
				></sprite-image>
		</div>
		
		<speech-line v-bind:style="{
				position: 'absolute',
				bottom: (y+scaledHeight)+'px',
				left: x+'px'}"
			v-bind:text="saying"
			v-bind:charCentre="x"
			v-bind:color="char.speechColor"
		></speech-line>				
		
	</article>
	`
})

