
Vue.component('world-item', {

	props:['item','measure'],
	data: function() {		
		var spriteSet = [];		
		var fullSet = this.$root.$data.sprites;
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
			this.$root.$emit('clicked-thing', this.item);
		},
		hoverHandler : function (event) {
			this.$root.$emit('hover-event', this, event);
		},

		setStatus : function () {
			function procesArgument (a){
				if (typeof a === 'string') {return {cycle:a}}
				return a;
			}
			
			var orders = [];
			for (var i = 0; i < arguments.length; i++) {
				orders.push(
					typeof arguments[i] === 'string' ? {cycle:arguments[i]} : arguments[i]
				);
			}
			
			if ( !this.item.cycles[orders[0].cycle]) {return false};
			this.item.status = orders[0]; this.cycleFrame = 0;

			this.item.queue = [];
			for (var i = 1; i < orders.length; i++) {
				if ( this.item.cycles[orders[i].cycle]) {
					this.item.queue.push(orders[i]);
				}
			};
			return this;
		},
		showNextFrame : function () {
			var cycle = this.item.cycles[this.item.status.cycle] ;
			var onLastFrame = !(cycle.length > this.cycleFrame+1);
			this.cycleFrame = onLastFrame ? 0: this.cycleFrame + 1;
			
			if (onLastFrame) {				
				if (this.item.queue.length) {
					this.item.status = this.item.queue.shift();
					if (this.item.status.ref) {
						this.$root.$emit('mile-stone:'+this.item.status.ref)
					}
					if (this.item.queue.length === 0) {
						this.$root.$emit('mile-stone','reached last animation:'+this.item.status.cycle,this);
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
	template: `
	<article @click.stop="clickHandler(event)" v-on:mouseover="hoverHandler(event)" v-on:mouseout="hoverHandler(event)"
	v-bind:name="name" 
	v-bind:status="status">
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
					
	</article>
	`
})

