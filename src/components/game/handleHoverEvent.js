export default function(component,event){
    if (event.type=== 'mouseover') {
      this.thingHoveredOn = component;
    }
    if (event.type=== 'mouseout' && this.thingHoveredOn === component) {
      this.thingHoveredOn = null;
    }
  }