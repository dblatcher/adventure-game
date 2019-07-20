<template>
	<article 
	@click="clickHandler($event)" 
	v-on:mouseover="hoverHandler($event)"
	v-on:mouseout="hoverHandler($event)"
	v-bind:name="name" 
	v-bind:action="currentAction">
		<div v-bind:style="styleObject">
			<Sprite v-for="sprite in this.spriteSet":key="sprite.id"
				v-bind:sprite="sprite"
				v-bind:fx="sprite.p.frame.fx" 
				v-bind:fy="sprite.p.frame.fy"
				v-bind:height="sprite.p.scaledHeight"
				v-bind:width="sprite.p.scaledWidth"
				v-bind:index="sprite.p.frame.sprite"
				v-bind:measure="sprite.p.measure"
				></Sprite>
		</div>
		
		<SpeechLine v-bind:style="{
				bottom: ( (y+scaledHeight) * this.measure.scale )+this.measure.unit,
				left: (x * this.measure.scale)+this.measure.unit}"
			v-bind:text="saying"
			v-bind:charCentre="x"
			v-bind:color="char.speechColor"
		></SpeechLine>
		
	</article>
</template>

<script>
import Sprite from "./Sprite";
import SpeechLine from "./SpeechLine";

export default {
	name:'Character',
	components:{Sprite, SpeechLine},

	props:['char','measure'],

	data: function() {		
		var spriteSet = [];		
		var fullSet = this.$parent.$parent.$data.sprites;
		for (var i=0; i< fullSet.length; i++) {		
			if (this.char.spritesUsed.includes(fullSet[i].id)) {spriteSet.push ( Object.assign({}, fullSet[i], {p:this} ) )	}
		};
		
		return {
			spriteSet : spriteSet,
			
			sayingQueue :[],
			actionQueue:[],
			destinationQueue:[],
			saying:'', 
			behaviour: {action:'wait', direction:this.char.validDirections[0], actFrame:0},
		}
	},

	computed :{
		theApp: function() {return this.$parent.$parent},
		
		name: function() {return this.char.name},
		x: function() {return this.char.x},
		y: function() {return this.char.y},
		ident: function() {return this.char.id},
		
		
		scaledHeight : function() {return this.char.scale * this.char.baseHeight * this.zoneEffects.scale();},
		scaledWidth : function() {return this.char.scale * this.char.baseWidth* this.zoneEffects.scale();},
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
		styleObject : function () { return {
			position: 'absolute',
			height: (this.scaledHeight * this.measure.scale) + this.measure.unit,
			width:  (this.scaledWidth  * this.measure.scale) + this.measure.unit,
			bottom: (this.y  * this.measure.scale) + this.measure.unit,
			left:   (this.x  * this.measure.scale) + this.measure.unit,
			zIndex: 1000-this.y,
			transform: 'translateX(-50%)',
			filter: this.zoneEffects.filter,
		}},
		zoneEffects : function() {
			var result= {
				filter:"",
				scale:function(){return 1},
			};
			var effectZones = this.theApp.rooms[this.theApp.roomNumber].effectZones;
			for (var i=0; i<effectZones.length; i++) {
				if (effectZones[i].zone.containsPoint(this)) {
					if (effectZones[i].effect.filter) {
						result.filter += effectZones[i].effect.filter + ' ';
					}
					if (effectZones[i].effect.scale) {
						result.scale = effectZones[i].effect.scale.bind(this);
					}
				}
			}
			return result;
		},
	},
	
	methods : {	
		doAction : function (action, options = {}) {
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
		goTo : function (destination, options = {}) {
			
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
			
			this.destinationQueue = orders;
			var queEnd = orders[orders.length-1];
			var that = this;
			
			return new Promise (function (resolve, reject) {
			
				function takeStepAndCheckIfFinished (resolve ) {					
					if ( that.destinationQueue.indexOf(queEnd) == -1  ) {
						//not the same destinationQueue - players has given new order
						clearInterval(timer);
						resolve ( {finished:false, reason:'destination change',  message:`Not going to [${queEnd.x},${queEnd.y}] any more`} )
					}
					
					that.move(); // take step, shift destinationQueue if reached its end point
					
					if (that.destinationQueue.length === 0) { //finished orders
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
			
		},		
		say : function (text, options = {} ){
			if (typeof options.time !== 'number') {options.time = 1000}
			if (typeof options.action !== 'string') {options.action = 'talk'}
			var currentOrder = Object.assign({text:text}, options);
			
			var that = this;
			
			function executeOrder (order,resolve) {		
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
					
			var obstacles = this.theApp.obstacles;
			for (var i=0; i<obstacles.length; i++) {
				if (obstacles[i].containsPoint( this.x+movement.x, this.y+movement.y) ) {
					movement = {x:0, y:0};
					console.log('hit-obstacle', moveOrder);
					this.theApp.$emit('mile-stone','hit-obstacle',this,moveOrder);
					if(moveOrder.ref) {this.theApp.$emit('mile-stone-fail:'+moveOrder.ref)};
					//this.doAction('wait', {loop:true, direction:moveOrder.direction},true);
					this.behaviour.action = 'wait';
					this.behaviour.direction = moveOrder.direction;
					this.behaviour.actFrame = 0;
					this.destinationQueue.shift();					
				}
			}
			this.char.x += movement.x;
			this.char.y += movement.y;
			
			// test if character got to the moveOrder destination, shift queue, report if finished
			if (this.x ===  moveOrder.x && this.y === moveOrder.y) { 
				
				this.destinationQueue.shift();
				if (this.destinationQueue.length === 0) {
					this.behaviour.action = 'wait';
					this.behaviour.actFrame = 0;
					this.behaviour.direction = moveOrder.direction;
					this.theApp.$emit('mile-stone','reached-destination',this,moveOrder);
					if(moveOrder.ref) {this.theApp.$emit('mile-stone'+':'+moveOrder.ref)};
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
					this.theApp.$emit('mile-stone','actions-finished',this,order);
					if (order.ref) {this.theApp.$emit('mile-stone'+':'+order.ref)};
					
				}
				
			}
		},
		clickHandler : function (event) {
			if (this.ident === 'pc') {return false};
			event.stopPropagation();
			this.theApp.$emit('clicked-thing', this.char);
		},
		hoverHandler : function (event) {
			if (this.ident === 'pc') {return false};
			this.theApp.$emit('hover-event', this, event);
		},		
	},
	
	mounted : function() {		
		var that = this;
		setInterval (function(){that.showNextFrame()},100);
	},

}
</script>



