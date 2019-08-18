<template>
    <canvas id="canvas"
		v-bind:height="room.height" 
		v-bind:width="room.width" 
    > </canvas>
</template>

<script>
import {RectZone} from '../modules/zone'
export default {
    name: 'CanvasOverLay',
    props: ['room'],
    methods : {

	plotZone : function (zone, stroke="white",fill="rgba(250,0,250,1)") {
        let ctx = this.$el.getContext('2d');
        let h = this.room.height;
		ctx.beginPath();
	
		if (zone.type === 'PolyZone') {
			ctx.moveTo(zone.corners[0].x, h - zone.corners[0].y);
			for (var i=1; i<zone.corners.length; i++) {
				ctx.lineTo(zone.corners[i].x, h- zone.corners[i].y);
			}
			ctx.closePath();			
		}
	
		if (zone.type === 'RectZone') {
			ctx.moveTo(zone.left,h-zone.top);
			ctx.lineTo(zone.right,h-zone.top);
			ctx.lineTo(zone.right,h-zone.bottom);
			ctx.lineTo(zone.left,h-zone.bottom);
		}

		ctx.strokeStyle = stroke;
		ctx.stroke();
		
		ctx.fillStyle = fill;
		ctx.fill();
	},
	
    showObstacles: function () {
        this.room.obstacles.forEach(zone => {
            this.plotZone(zone)
        });

    },

    plotBlocked (oIndex) {
        this.testGrid(3, this.room.obstacles[oIndex]);
    },

    testGrid: function(size, zone) {
		var rows = Math.ceil(this.room.height/size);
		var cols = Math.ceil(this.room.width/size);
		var cell;
	
		for (var i=0; i<cols; i++) {
			for (var j=0; j<rows; j++) {
			
				cell = new RectZone(i*size, j*size,size,size);
                if (zone.overlapsRectangle(cell)) {
                    this.plotZone(cell, 'white','red')
                }

            
			}
		}
	
	}

    },
    mounted: function() {
        window.overlay = this;
        window.ctx = this.$el.getContext('2d');
        //this.showObstacles();
        //this.room.obstacles.forEach(zone => {this.testGrid(3,zone)})
    },
}
</script>

<style scoped>
    canvas {
        height:100%;
        width: 100%;
    }
</style>

