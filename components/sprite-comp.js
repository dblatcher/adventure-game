Vue.component('sprite-image',{

  props: ['width','height','sprite','fx','fy','index','measure'],
  computed :{	
    styleObject: function(){
      return {
		display: this.index == this.sprite.id ? 'block' : 'none',
		backgroundImage: `url(${this.sprite.url})`,
        height: (this.height * this.measure.scale) + this.measure.unit,
        width:  (this.width * this.measure.scale) + this.measure.unit,
        backgroundSize: `${this.sprite.col*this.width* this.measure.scale}${this.measure.unit} ${this.sprite.row*this.height* this.measure.scale}${this.measure.unit}`,
        backgroundPosition: `${-this.fx*this.width* this.measure.scale}${this.measure.unit} ${-this.fy*this.height* this.measure.scale}${this.measure.unit}`,
		position: 'absolute',
		margin: '0',
		bottom:'0',
		left:'0',
      }
    }
  },
  template: `
    <div class="sprite">
      <div v-bind:style="styleObject"></div>
    </div>
  `
});