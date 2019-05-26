
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
		action:'wait', actFrame:0, actionOnLoop:true,
		direction:this.char.validDirections[0],
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
			var directionNeeded = !Array.isArray(this.char.cycles[this.action]);
			var v = directionNeeded ? 
				this.char.cycles[this.action][this.direction][this.actFrame]:
				this.char.cycles[this.action][this.actFrame];
			
			return {sprite: v[0], fx:v[1], fy:v[2]}
		}
	},
	methods : {
		clickHandler : function (event) {
			console.log(this.name,'clicked',event)
			this.$root.$emit('get-report', this, 'clicked');
		},
		move : function () {
			if (this.destinationQueue.length === 0) {return false};
			var order = this.destinationQueue[0];
			
			if (!order.started) {
				if (order.action) {
					this.act(order.action, {loop:true, direction: order.direction||this.direction})
				};
			};			
			order.started = true;
			
			var d = {x: order.x - this.x, y:order.y - this.y};
			var absD = {x: Math.abs(d.x), y: Math.abs(d.y) };
			var speed = 12;
			var movement = {x:0,y:0};
			
			var rX = absD.x ? absD.x / ( absD.x + absD.y) : 0;
			var rY = absD.y ? absD.y / ( absD.x + absD.y) : 0;
							
			movement.x = Math.min ( absD.x, speed*rX );
			movement.y = Math.min ( absD.y, speed*rY );
			if (d.x < 0 ) {movement.x *= -1}
			if (d.y < 0 ) {movement.y *= -1}
			 
			this.x += movement.x;
			this.y += movement.y;
			
			if (this.x ===  order.x && this.y === order.y) {
				if (order.action) {this.act('wait');}
				this.destinationQueue.shift();
				if (this.destinationQueue.length === 0) {
					//this.$root.$emit('get-report',this,'reached destination');
					this.$emit('reached-destination');
				};
			}
			
		},
		act : function (action, options = {}, callBack) {
			if (typeof action  !== 'string') {return false;}
			if (!this.char.cycles[action]) {return false;}
			
			if (options.direction) {
				if (this.char.validDirections.includes(options.direction)) {
					this.direction = options.direction;
				}
			};
			
			var directionNeeded = !Array.isArray(this.char.cycles[action]);		
			if (directionNeeded) {
				var availableDirections = Object.keys(this.char.cycles[action]);				
				this.direction = availableDirections.includes(this.direction) ? this.direction : availableDirections[0];
			}
			
			this.actionOnLoop = options.loop || false;
			this.action = action; this.actFrame = 0;
		},
		showNextFrame : function () {
			var directionNeeded = !Array.isArray(this.char.cycles[this.action]);
			var cycle = directionNeeded ? 
				this.char.cycles[this.action][this.direction] :
				this.char.cycles[this.action] ;

			var onLastFrame = !(cycle.length > this.actFrame+1);
			this.actFrame = onLastFrame ? 0: this.actFrame + 1;
			
			if (onLastFrame && !this.actionOnLoop) {
				//this.$root.$emit('get-report',this,'last frame');
				this.$emit('last-frame');
				this.action = 'wait';
				this.actionOnLoop = true;
			}
		},
		say : function (text, time) {
			if (typeof time !== 'number') {time = 1000}
			var that = this;
			
			if (that.isTalking === false) {
				that.saying = text;
				setTimeout(endOfLine,time);
			} else {
				that.sayingQueue.push({text:text, time:time});
			};
			
			function endOfLine () {
				if (that.sayingQueue.length) {
					var newLine = that.sayingQueue.shift();
					that.saying = newLine.text;
					setTimeout(endOfLine,newLine.time);
				} else {
					that.saying = '';
				}	
			};
		}
	},
	mounted : function() {		
		var that = this;
		setInterval (function(){
			that.showNextFrame();
			that.move();
		},250);
	},
	template: `
	<article @click.stop="clickHandler(event)"
	v-bind:name="name" 
	v-bind:action="action">
		<div v-bind:style="{
			position: 'absolute',
			height: scaledHeight+'px',
			width: scaledWidth+'px',
			bottom: y+'px',
			left: x+'px'}">
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
			v-bind:color="char.speechColor"
		></speech-line>				
		
	</article>
	`
})

