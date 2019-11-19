<template>
  <div class="sprite">
    <div v-bind:style="styleObject"></div>
  </div>
</template>

<script>
export default {
  name: 'Sprite',
  props: ['width','height','sprite','fx','fy','index','measure'],
  computed :{	
	styleObject: function(){
      
	  var rH = (this.sprite.relativeHeight || 1);
	  var rW = (this.sprite.relativeWidth || 1);
	  var backgroundSizeWidth       = rW * this.sprite.col*this.width* this.measure.scale;
	  var backgroundSizeHeight      = rH * this.sprite.row*this.height* this.measure.scale;
	  var backgroundPositionXOffset = -this.fx*this.width * rW * this.measure.scale;
	  var backgroundPositionYOffset = -this.fy*this.height* rH * this.measure.scale;
	  
	  var xShift = (this.sprite.xOffset) + '%';
	  var yShift = (this.sprite.yOffset) + '%';

	  return {
		display: this.index == this.sprite.id ? 'block' : 'none',
		backgroundImage: `url(${this.sprite.url})`,
        height: ( rH * this.height * this.measure.scale) + this.measure.unit,
        width:  ( rW * this.width  * this.measure.scale) + this.measure.unit,
        backgroundSize: `${backgroundSizeWidth}${this.measure.unit} ${backgroundSizeHeight}${this.measure.unit}`,
        backgroundPosition: `${backgroundPositionXOffset}${this.measure.unit} ${backgroundPositionYOffset}${this.measure.unit}`,
		position: 'absolute',
		margin: '0',
		bottom: yShift,
		left: xShift,
      }
    }
  },
}
</script>





