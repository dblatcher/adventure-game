
function changeRoom (rNum,pcX,pcY,data={}) {

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


function characterRoomChange (movingCharacter, rNum,x,y) {
  let game = this;

  if (typeof movingCharacter === 'string') {
    let charId = movingCharacter;
    game.allCharacters.forEach(char => {
      if (char.id === charId) { movingCharacter = char}
    });
  }

  if (typeof movingCharacter === 'string') {
    return Promise.resolve( {success:false, reason:`no character with id ${movingCharacter}`} )
  }

  return new Promise ( function(resolve,reject) {
    movingCharacter.room = rNum;
    movingCharacter.x = x;
    movingCharacter.y = y;
    game.$nextTick( function() {
      resolve({success:true, char:movingCharacter})
    });

  });

}


export {changeRoom, characterRoomChange}