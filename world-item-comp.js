
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
		cycle: this.item.startCycle || 'neutral',
		cycleFrame:0, cycleQueue:[],
		}
	},
	computed :{
		scaledHeight : function() {return this.scale * this.baseHeight;},
		scaledWidth : function() {return this.scale * this.baseWidth;},
		frame : function() {			
			var v= this.item.cycles[this.cycle][this.cycleFrame];
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

		setCycle : function (animation, options = {}, callBack) {
			if (typeof animation  !== 'string') {return false;}
			if (!this.item.cycles[animation]) {return false;}	
			//this.actionOnLoop = options.loop || false;
			this.cycle = animation; this.cycleFrame = 0;
			//TO DO - MAKE COMPONENT SYNC WITH VM ROOM DATA - NOT PERSISTENT CHANGES IF PLAYER LEAVES ROOM
		},
		showNextFrame : function () {
			var cycle = this.item.cycles[this.cycle] ;
			var onLastFrame = !(cycle.length > this.cycleFrame+1);
			this.cycleFrame = onLastFrame ? 0: this.cycleFrame + 1;
			
/* 			if (onLastFrame && !this.actionOnLoop) {
				//this.$root.$emit('get-report',this,'last frame');
				this.$emit('last-frame');
				this.action = 'neutral';
				this.actionOnLoop = true;
			} */
		},

	},
	mounted : function() {		
		var that = this;
		setInterval (function(){that.showNextFrame()},100);
	},
	template: `
	<article @click.stop="clickHandler(event)"
	v-bind:name="name" 
	v-bind:action="cycle">
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

