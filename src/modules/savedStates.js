function SerialisedSequenceLoop(sequenceLoopPromise) {
    const originalArguments = sequenceLoopPromise.interface.getOriginalArguments()
    this.sequenceName = originalArguments.sequenceName
    this.options = Object.assign({}, originalArguments.options)
    this.count = sequenceLoopPromise.interface.getCount()
    this.orderIndex = sequenceLoopPromise.interface.getOrderIndex()
}


function getCurrentGameData(gameInstance) {
    let currentState = {
        roomNumber: gameInstance.roomNumber,
        gameStatus: gameInstance.gameStatus,
        gameStatusBeforePaused: gameInstance.gameStatusBeforePaused,
        conversation: gameInstance.conversation,
        inventoryItems: [],
        allCharacters: [],
        rooms: [],
        conversations: {},
        gameVars: {},
        serialisedLoopSequences: [],
    }

    Object.keys(gameInstance.conversations).forEach((label) => {
        currentState.conversations[label] = gameInstance.conversations[label].returnState();
    })

    Object.keys(gameInstance.gameVars).forEach((key) => {
        currentState.gameVars[key] = gameInstance.gameVars[key];
    })

    gameInstance.inventoryItems.forEach((item) => {
        currentState.inventoryItems.push(item.returnState());
    })
    gameInstance.allCharacters.forEach((item) => {
        currentState.allCharacters.push(item.returnState());
    })
    gameInstance.rooms.forEach((item) => {
        currentState.rooms.push(item.returnState());
    })

    for (let key in gameInstance.activeLoopSequences) {
        currentState.serialisedLoopSequences.push  (new SerialisedSequenceLoop(gameInstance.activeLoopSequences[key]))
    }

    return currentState;
}

function createGameData(savedGame, gameInstance) {

    const gameData = gameInstance.$store.state.gameData

    let state = {
        gameStatus: 'LIVE',
        gameStatusBeforePaused: null,
        roomNumber: null,
        conversation: null,
        rooms: gameData.makeRooms(),
        inventoryItems: gameData.makeInventoryItems(),
        allCharacters: gameData.makeCharacters(),
        conversations: gameData.makeConversations(),
        serialisedLoopSequences: [],
        gameVars: gameData.config.initialGameVars ? Object.assign({}, gameData.config.initialGameVars) : {},
        pcId: gameData.config.pcId || gameData.makeCharacters()[0].id,
    };

    // set starting room to be the room the pc starts in
    state.allCharacters.forEach(char => {
        if (char.id === state.pcId) { state.roomNumber = char.room }
    })

    //check for duplicate worldItem.id
    let wiids = [];
    state.rooms.forEach(room => {
        room.worldItems.forEach(item => {
            if (wiids.includes(item.id)) {
                gameInstance.$store.commit('debugMessage', `duplicate WorldItem.id detected: ${item.id} in ${room.id} - interactions may fail.`)
            }
            wiids.push(item.id);
        })
    })

    if (savedGame && savedGame.gameStatus) {
        modifyGameData(state, savedGame, gameInstance)
    }

    return Object.assign({}, state);

}

function modifyGameData(state, loadData, gameInstance) {
    if (!loadData) { return state }

    //update literal properties
    state.gameStatus = loadData.gameStatus;
    state.gameStatusBeforePaused = loadData.gameStatusBeforePaused;
    state.roomNumber = loadData.roomNumber;
    state.conversation = loadData.conversation;

    let newRoomsArray = [];
    loadData.rooms.forEach(roomDatum => {
        newRoomsArray.push({
            name: roomDatum.name,
            filter: roomDatum.filter,
            worldItems: roomDatum.worldItems.map(worldItem => { return worldItem.returnState ? worldItem.returnState() : worldItem })
        })
    })

    state.rooms.forEach((room, index1) => {
        Object.assign(room.filter, newRoomsArray[index1].filter)
        room.worldItems.forEach((worldItem, index2) => {
            Object.assign(worldItem, newRoomsArray[index1].worldItems[index2])
        })
    })


    var i
    for (i = 0; i < state.inventoryItems.length; i++) {
        state.inventoryItems[i] = Object.assign(state.inventoryItems[i], loadData.inventoryItems[i]);
    }
    for (i = 0; i < state.allCharacters.length; i++) {
        state.allCharacters[i] = Object.assign(state.allCharacters[i], loadData.allCharacters[i]);
    }

    //set each conversations current branch (string)
    //assign the values saved in the data to the corresponding dialog choice
    //currently, only the 'disabled' property is saved in loadData 
    Object.keys(state.conversations).forEach((label) => {
        state.conversations[label].currentBranch = loadData.conversations[label].currentBranch;
        Object.keys(state.conversations[label].branches).forEach((branchLabel) => {
            let stateChoiceList = state.conversations[label].branches[branchLabel].choices;
            let dataChoiceList = loadData.conversations[label].branches[branchLabel].choices;
            stateChoiceList.forEach((choice, index) => {
                choice = Object.assign(choice, dataChoiceList[index])
            });
        })
    })

    Object.keys(loadData.gameVars).forEach((key) => {
        state.gameVars[key] = loadData.gameVars[key];
    })

    restartSerialisedLoopSequences (gameInstance, loadData.serialisedLoopSequences)
    return state;
}

function restartSerialisedLoopSequences(gameInstance, serialisedLoopSequences) {

    serialisedLoopSequences.forEach(serialisedLoopSequence => {
        //TO DO - add option to set the count and orderIndex to match serialisedLoopSequence.count and serialisedLoopSequence.orderIndex
        let modifiedOptions = Object.assign({}, serialisedLoopSequence.options)
        modifiedOptions.countToStartWith = serialisedLoopSequence.count
        modifiedOptions.orderIndexToStartWith = serialisedLoopSequence.orderIndex

        gameInstance.startLoopSequence(serialisedLoopSequence.sequenceName, modifiedOptions)
    })
}

export default {
    get: getCurrentGameData,
    modify: modifyGameData,
    create: createGameData
}