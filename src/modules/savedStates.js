

import { gameData } from "../gameIndex";

function getCurrentGameData (gameInstance) {
    let currentState = {
        roomNumber : gameInstance.roomNumber,
        gameStatus : gameInstance.gameStatus,
        conversation: gameInstance.conversation,
        inventoryItems : [],
        allCharacters : [],
        rooms: [],
        conversations: {},
        gameVars: {},
    }

    Object.keys (gameInstance.conversations).forEach ( (label) => {
        currentState.conversations[label] = gameInstance.conversations[label].returnState();
    })

    Object.keys (gameInstance.gameVars).forEach ( (key) => {
        currentState.gameVars[key] = gameInstance.gameVars[key];
    })

    gameInstance.inventoryItems.forEach ( (item) => {
        currentState.inventoryItems.push( item.returnState() );
    })
    gameInstance.allCharacters.forEach ( (item) => {
        currentState.allCharacters.push( item.returnState() );
    })
    gameInstance.rooms.forEach ( (item) => {
        currentState.rooms.push( item.returnState() );
    })
    return currentState;
}

function createGameData(savedGame) {

    let state = {
        gameStatus : 'LIVE',
        roomNumber : null,
        conversation : null,
        rooms : gameData.makeRooms(),
        inventoryItems: gameData.makeInventoryItems(),
        allCharacters : gameData.makeCharacters(),
        conversations : gameData.makeConversations(),
        gameVars : gameData.setGameVars(),
        pcId : gameData.pcId,
    };

    // set starting room to be the room the pc starts in
    state.allCharacters.forEach (char => {
        if (char.id === state.pcId) {state.roomNumber = char.room}
    })

    //check for duplicate worldItem.id
    let wiids = [], duplicateFound=false;;
    state.rooms.forEach (room =>{
        room.worldItems.forEach (item => {
            if ( wiids.includes(item.id) ) {
                console.warn (`duplicate WorldItem.id detected: ${item.id} in ${room.id}`);
                duplicateFound = true;
            }
            wiids.push(item.id);
        })
    })
    if (duplicateFound) {console.warn('WorldItem.ids must be unique or interactions may fail.')}

    if (savedGame && savedGame.gameStatus) {
        modifyGameData(state, savedGame)
    }

    return Object.assign({
        interactionMatrix: gameData.interactionMatrix,
        verbList : gameData.verbList,
        sprites : gameData.sprites, 
        message: 'blank message',
        roomMeasure: {unit:'px',scale:1}, //only supporting px ?
        verb: gameData.verbList[0],
        thingHoveredOn:null, 
        subject: null, needObject:false, object:null,
        highlightingThings : false,
        instantMode: false,
        defaultResponses:gameData.defaultResponses,
        sequences: gameData.sequences,
    }, state);

}

function modifyGameData (state, loadData) {
    if (!loadData) {return state}

    state.gameStatus = loadData.gameStatus;
    state.roomNumber = loadData.roomNumber;
    state.conversation = loadData.conversation;

    // replace each item in the worldItems array of each room in the loadData
    // with the corresponding WorldItem taken from state and modified with that item's properties
    for (let index = 0; index < loadData.rooms.length; index++) {
        const room = loadData.rooms[index];
        for (let index2 = 0; index2 < room.worldItems.length; index2++) {
            const item = room.worldItems[index2];
            room.worldItems.splice (index2, 1, Object.assign(state.rooms[index].worldItems[index2], item) );
        }
    }

    var i
    for (i=0; i<state.rooms.length; i++) {
        state.rooms[i] = Object.assign(state.rooms[i], loadData.rooms[i]);
    }
    for (i=0; i<state.inventoryItems.length; i++) {
        state.inventoryItems[i] = Object.assign(state.inventoryItems[i], loadData.inventoryItems[i]);
    }
    for (i=0; i<state.allCharacters.length; i++) {
        state.allCharacters[i] = Object.assign(state.allCharacters[i], loadData.allCharacters[i]);
    }

    //set each conversations current branch (string)
    //assign the values saved in the data to the corresponding dialog choice
    //currently, only the 'disabled' property is saved in loadData 
    Object.keys (state.conversations).forEach ( (label) => {
        state.conversations[label].currentBranch = loadData.conversations[label].currentBranch;
        Object.keys(state.conversations[label].branches).forEach ( (branchLabel) => {
            let stateChoiceList = state.conversations[label].branches[branchLabel].choices;
            let dataChoiceList = loadData.conversations[label].branches[branchLabel].choices;
            stateChoiceList.forEach ( (choice, index) => {
            choice = Object.assign (choice, dataChoiceList[index])
            });
        })
    })

    Object.keys (loadData.gameVars).forEach ( (key) => {
        state.gameVars[key] = loadData.gameVars[key];
    })

    return state;
}

export default {
    get: getCurrentGameData, 
    modify: modifyGameData, 
    create: createGameData
 }