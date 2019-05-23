
Vue.component('character-c', {

	props:['char'],
	data: function() {		
		var spriteSet = [];		
		var fullSet = this.$parent.$data.sprites;
		for (var i=0; i< fullSet.length; i++) {		
			if (this.char.spritesUsed.includes(fullSet[i].id)) {
				spriteSet.push ( Object.assign({}, fullSet[i], {p:this} ) )	
			}
		};
		return{
		spriteSet : spriteSet,
		spriteID: spriteSet[0].id,
		saying:'', sayingQueue :[],
		
		action:'walk', actFrame:0,
		
		ident: this.char.id,
		name: this.char.name,
		x: this.char.startX ? Number (this.char.startX) : 0, 
		y: this.char.startY ? Number (this.char.startY) : 0,
		fx: this.char.initialFrame ? Number(this.char.initialFrame.split(',')[0]) : 0,
		fy: this.char.initialFrame ? Number(this.char.initialFrame.split(',')[1]) : 0,
		scale:this.char.initialScale || 1,
		baseHeight: this.char.baseHeight || 100,
		baseWidth: this.char.baseWidth || 100,
		}
	},
	computed :{
		scaledHeight : function() {return this.scale * this.baseHeight;},
		scaledWidth : function() {return this.scale * this.baseWidth;},
		currentSprite : function() {
			for (var i=0; i< this.spriteSet.length; i++) {
				if (this.spriteSet[i].id === this.spriteID) {
					return this.spriteSet[i];
				}
			}
			console.error(`character ${this.name} spriteID (${this.spriteID}) is not the id from its spriteSet`);
			return null;
		},
		isTalking : {
			get: function() {return this.saying !== ''},
			set: function(v) {if (v===false){this.saying=''; this.sayingQueue=[]}}
		}
	},
	methods : {
		setCycleFrame : function (cycle, n=0) {
			if (!this.char.cycles[cycle]) {
				console.error(`character ${this.name} has no cycle called ${cycle}`);
				return false;
			};
			if (this.char.cycles[cycle].length <= n) {
				console.error(`character ${this.name}\'s cycle ${cycle} does not have a frame ${n}`);
				return false;
			};
			
			var v = this.char.cycles[cycle][n];			
			this.spriteID = v[0];
			this.fx=v[1];
			this.fy=v[2];
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
	template: `
	
	<article>
		<div v-bind:style="{
			position: 'absolute',
			height: scaledHeight+'px',
			width: scaledWidth+'px',
			bottom: y+'px',
			left: x+'px'}">
			<sprite-image v-for="sprite in this.spriteSet":key="sprite.id"
				v-bind:sprite="sprite"
				v-bind:fx="sprite.p.fx" 
				v-bind:fy="sprite.p.fy"
				v-bind:height="sprite.p.scaledHeight"
				v-bind:width="sprite.p.scaledWidth"
				v-bind:index="sprite.p.currentSprite.id"
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

