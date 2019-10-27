
function findIndexById (id, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id ) { return i }
  }
  return false;
}


function changeRoom (target,options={}) {

  let rNum = target[0], pcX=target[1], pcY=target[2];

  let game = this;
  if (typeof rNum === 'string') {
    rNum = findIndexById (rNum, game.rooms)
  }

  //doesn't use getThings in case pc is not in the room we are changing from
  const pc = game.allCharacters[ findIndexById(game.pcId, game.allCharacters) ];

  return new Promise (function (resolve) {

    if (pc && !options.pcNotMoving) {
      pc.room = rNum;
      pc.x = pcX;
      pc.y = pcY;
    }

    game.roomNumber = rNum;
    game.thingHoveredOn = null;

    game.$nextTick( function() {
      game.reportEvent('room change to '+game.rooms[rNum].name);
      game.$refs.room.resize();
      if (typeof options.callback === 'function' ) { options.callback.apply(game,[]); }
      resolve({success:true, newRoom:game.rooms[rNum].id})
    })

  })

}


function teleportCharacter (target, options={}) {
  
  let movingCharacter = target[0], rNum = target[1], x=target[2], y=target[3];
  
  let game = this;
  if (typeof rNum === 'string') {
    rNum = findIndexById (rNum, game.rooms)
  }

  if (typeof movingCharacter === 'string') {
    let charId = findIndexById(movingCharacter, game.allCharacters);
    if (charId === false) {
      return Promise.resolve( {success:false, reason:`no character with id ${movingCharacter}`} )
    }
    movingCharacter = game.allCharacters[ findIndexById(movingCharacter, game.allCharacters) ]
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


export {changeRoom, teleportCharacter}