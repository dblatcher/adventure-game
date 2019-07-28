
import {recreateWorldItemFromState} from "./constructors";

function getCurrentStateData (gameInstance) {
    let currentState = {
        roomNumber : gameInstance.roomNumber,
        gameStatus : gameInstance.gameStatus,
        conversation: gameInstance.conversation,
        inventoryItems : [],
        allCharacters : [],
        rooms: [],
        conversations: {},
    }

    Object.keys (gameInstance.conversations).forEach ( (label) => {
        currentState.conversations[label] = gameInstance.conversations[label].returnState();
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


function modifyStartingStateWithLoadedGame (state, loadData) {
    state.gameStatus = loadData.gameStatus;
    state.roomNumber = loadData.roomNumber;
    state.conversation = loadData.conversation;

    var i,j, listForRoom;
    // replace plain objects in each loadData room with array of WorldItems
    for (i=0; i<state.rooms.length; i++) {
        listForRoom = loadData.rooms[i].worldItems;
        for (j=0; j<listForRoom.length; j++) {
            listForRoom.splice  (j,1, recreateWorldItemFromState(listForRoom[j]) );
        }
    }

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
    return state;
}

export {getCurrentStateData, modifyStartingStateWithLoadedGame }