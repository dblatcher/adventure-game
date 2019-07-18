<template>
	<article 
	@click.stop="clickHandler($event)" 
	v-on:mouseover="hoverHandler($event)" 
	v-on:mouseout="hoverHandler($event)"
	v-bind:name="name" 
	v-bind:status="status">
		<div v-bind:style="styleObject">
			<Sprite v-for="sprite in this.spriteSet":key="sprite.id"
				v-bind:sprite="sprite"
				v-bind:fx="sprite.p.frame.fx" 
				v-bind:fy="sprite.p.frame.fy"
				v-bind:height="sprite.p.scaledHeight"
				v-bind:width="sprite.p.scaledWidth"
				v-bind:index="sprite.p.frame.sprite"
				v-bind:measure = "sprite.p.measure"
				></Sprite>
		</div>
	</article>
</template>

<script>
import Sprite from "./Sprite";

export default {
	name:'WorldItem',
	components: { Sprite },
	props:['item','measure'],
	data: function() {		
		var spriteSet = [];		
		var fullSet = this.$parent.$parent.$data.sprites;
		for (var i=0; i< fullSet.length; i++) {		
			if (this.item.spritesUsed.includes(fullSet[i].id)) {spriteSet.push ( Object.assign({}, fullSet[i], {p:this} ) )	}
		};
		
		return {
		spriteSet : spriteSet,
		ident: this.item.id,
		x: this.item.startX ? Number (this.item.startX) : 0, 
		y: this.item.startY ? Number (this.item.startY) : 0,
		scale:this.item.initialScale || 1,
		baseHeight: this.item.baseHeight || 100,
		baseWidth: this.item.baseWidth || 100,
		cycleFrame:0
		}
	},
	computed :{
		scaledHeight : function() {return this.scale * this.baseHeight;},
		scaledWidth : function() {return this.scale * this.baseWidth;},
		frame : function() {
			var v= this.item.cycles[this.item.status.cycle][this.cycleFrame];
			return {sprite: v[0], fx:v[1], fy:v[2]}
		},
		status : function() {return this.item.status.cycle},
		name : {
			get: function () {return this.item.name},
			set: function(v) {this.item.name = v}
		},
		walkToPoint: function() {
			return {x:this.x + this.item.walkOffsetX, y:this.y + this.item.walkOffsetY}
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
		clickHandler : function (event) {
			this.$parent.$parent.$emit('clicked-thing', this.item);
		},
		hoverHandler : function (event) {
			this.$parent.$parent.$emit('hover-event', this, event);
		},
		setStatus : function () {
			function procesArgument (a){
				if (typeof a === 'string') {return {cycle:a}}
				return a;
			}
			
			var orders = [], nextOrder;
			for (var i = 0; i < arguments.length; i++) {
				nextOrder = procesArgument (arguments[i]) 
				if (this.item.cycles[nextOrder.cycle]) { 
					orders.push(nextOrder);
				} else {console.warn ( `${this.ident} does not cycle ${nextOrder.cycle}.` ) }
			}
			
			if (orders.length === 0 ) { return Promise.resolve('no valid orders')};
			
			this.item.queue = orders;
			var lastOrder = this.item.queue[this.item.queue.length-1];
			this.cycleFrame = 0;
			var that = this;
			
			function watchQueue(resolve) {
				var timer = setInterval (function(){
					if (that.item.queue[0] === lastOrder) {
						clearInterval(timer);
						resolve({
							finished:true,
							message: that.ident + ' finished sequence ending in ' + lastOrder.cycle
						});
					}
					
					if (that.item.queue.indexOf(lastOrder) === -1) {
						clearInterval(timer);
						resolve({
							finished: false,
							message: that.ident + ' no longer doing sequence ending with ' + lastOrder.cycle
						});
					}
					
				},100);
			};
			
			return new Promise( function(resolve, reject) {
				watchQueue(resolve);
			});
			
			
		},
		showNextFrame : function () {
			var cycle = this.item.cycles[this.item.status.cycle] ;
			var onLastFrame = !(cycle.length > this.cycleFrame+1);
			this.cycleFrame = onLastFrame ? 0: this.cycleFrame + 1;
			
			if (onLastFrame) {				
				if (this.item.queue.length) {
					this.item.status = this.item.queue.shift();
					if (this.item.status.ref) {
						this.$parent.$parent.$emit('mile-stone:'+this.item.status.ref)
					}
					if (this.item.queue.length === 0) {
						this.$parent.$parent.$emit('mile-stone','reached last animation:'+this.item.status.cycle,this);
					}
				};
			}
			
		},

	},
	mounted : function() {		
		var that = this;
		if (this.spriteSet.length > 0 ) {
			setInterval (function(){that.showNextFrame()},250);
		}
	},
}
</script>

