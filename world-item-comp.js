
Vue.component('world-item', {

	props:['item'],
	data: function() {		
		var spriteSet = [];		
		var fullSet = this.$root.$data.sprites;
		for (var i=0; i< fullSet.length; i++) {		
			if (this.item.spritesUsed.includes(fullSet[i].id)) {spriteSet.push ( Object.assign({}, fullSet[i], {p:this} ) )	}
		};
		
		return {
		spriteSet : spriteSet,
		ident: this.item.id,
		name: this.item.name,
		x: this.item.startX ? Number (this.item.startX) : 0, 
		y: this.item.startY ? Number (this.item.startY) : 0,
		scale:this.item.initialScale || 1,
		baseHeight: this.item.baseHeight || 100,
		baseWidth: this.item.baseWidth || 100,
		cycleFrame:0, cycleQueue:[],
		}
	},
	computed :{
		scaledHeight : function() {return this.scale * this.baseHeight;},
		scaledWidth : function() {return this.scale * this.baseWidth;},
		frame : function() {			
			var v= this.item.cycles[this.item.status][this.cycleFrame];
			return {sprite: v[0], fx:v[1], fy:v[2]}
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
		clickHandler : function (event) {
			console.log(this.name,'clicked',event)
			this.$root.$emit('get-report', this, 'clicked');
		},
		hoverHandler : function (event) {
			this.$root.$emit('get-report', this, event.type);
			this.$root.$emit('hover-event', this, event);
		},

		setStatus : function () {
			if (typeof arguments[0]  !== 'string') {return false;}
			if (!this.item.cycles[arguments[0]]) {return false;}
			this.item.status = arguments[0]; this.cycleFrame = 0;

			this.item.queue = [];
			for (var i = 1; i < arguments.length; i++) {
				if (typeof arguments[i]  === 'string' && this.item.cycles[arguments[i]]) {
					this.item.queue.push(arguments[i]);
				}
			};
			return this;
		},
		showNextFrame : function () {
			var cycle = this.item.cycles[this.item.status] ;
			var onLastFrame = !(cycle.length > this.cycleFrame+1);
			this.cycleFrame = onLastFrame ? 0: this.cycleFrame + 1;
			
			if (onLastFrame && this.item.queue.length) {
				this.item.status = this.item.queue.shift();				
			};
		},

	},
	mounted : function() {		
		var that = this;
		if (this.spriteSet.length > 0 ) {
			setInterval (function(){that.showNextFrame()},300);
		}
	},
	template: `
	<article @click.stop="clickHandler(event)" v-on:mouseover="hoverHandler(event)" v-on:mouseout="hoverHandler(event)"
	v-bind:name="name" 
	v-bind:status="item.status">
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
					
	</article>
	`
})

