export default function (rNum,pcX,pcY,data={}) {
      
    if (typeof rNum === 'string') {
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].id === rNum ) {
          rNum = i;
          break;
        }
      }
    }

    this.reportEvent('room change to '+this.rooms[rNum].name);

    var pc;
    this.allCharacters.forEach ( (charObject) => {
      if (charObject.id === this.pcId) {pc=charObject}  
    } )
    
    if (pc && !data.pcNotMoving) {
      pc.room = rNum;
      pc.x = pcX;
      pc.y = pcY;
    }

    this.roomNumber = rNum;
    this.thingHoveredOn = null;
    this.resetListeners();

    this.$nextTick( function() {
      this.$refs.room.resize();
      if (typeof data.callback === 'function' ) { data.callback.apply(this,[]); }
    })

  }