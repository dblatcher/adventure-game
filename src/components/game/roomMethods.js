
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
      game.$refs.room.resize();
      game.$store.state.gameEmitter.emit('changing-room',game.rooms[rNum])
      resolve({finished:true, newRoom:game.rooms[rNum].id})
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
      return Promise.resolve( {finished:false, reason:`no character with id ${movingCharacter}`} )
    }
    movingCharacter = game.allCharacters[ findIndexById(movingCharacter, game.allCharacters) ]
  }


  return new Promise ( function(resolve) {
    movingCharacter.room = rNum;
    movingCharacter.x = x;
    movingCharacter.y = y;
    game.$nextTick( function() {
      resolve({finished:true, char:movingCharacter})
    });
  });

}

function setRoomFilter (target, options={}) {
  let rNum = target[0], filterProperty = target[1], filterValue = target[2]
  let validOrder = true
  let game = this;

  if ( rNum === "" || rNum === "current") {
    rNum = game.roomNumber
  }
  else if (typeof rNum === 'string') {
    rNum = findIndexById (rNum, game.rooms)
  }
  const targetRoom = game.rooms[rNum]

  if (typeof filterProperty !== 'string' || Object.keys(targetRoom.filter).indexOf(filterProperty) === -1) {
      game.$store.commit('debugMessage', `setRoomFilter: invalid filterProperty "${filterProperty}".`)
      validOrder = false
  }

  if ( isNaN(filterValue)) {
    game.$store.commit('debugMessage', `setRoomFilter: invalid filterValue "${filterValue}".`)
    validOrder = false
  }

  if (!validOrder) {
    return Promise.resolve({finished:true, message:'invalid setRoomFilter'})
  }

  return new Promise(function(resolve) {
    targetRoom.filter[filterProperty] = Number(filterValue)
    game.$nextTick( function() {
      resolve ({finished:true, message:`set ${targetRoom.name} ${filterProperty} to ${filterValue}.`})
    })
  })

}

export {changeRoom, teleportCharacter,setRoomFilter}