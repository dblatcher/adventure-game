
export default function (rNum,pcX,pcY,data={}) {
    
  let game = this;
  if (typeof rNum === 'string') {
    for (let i = 0; i < game.rooms.length; i++) {
      if (game.rooms[i].id === rNum ) {
        rNum = i;
        break;
      }
    }
  }
    
  return new Promise (function (resolve) {
    //doesn't use getThings in case pc is not in the room we are changing from
    var pc;
    game.allCharacters.forEach ( (charObject) => {
      if (charObject.id === game.pcId) {pc=charObject}  
    } )

    if (pc && !data.pcNotMoving) {
      pc.room = rNum;
      pc.x = pcX;
      pc.y = pcY;
    }

    game.roomNumber = rNum;
    game.thingHoveredOn = null;
    game.resetListeners();

    game.$nextTick( function() {
      game.reportEvent('room change to '+game.rooms[rNum].name);
      game.$refs.room.resize();
      if (typeof data.callback === 'function' ) { data.callback.apply(game,[]); }
      resolve({success:true, newRoom:game.rooms[rNum].id})
    })

  })

}