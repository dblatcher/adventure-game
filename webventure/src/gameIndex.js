import TitleScreen from './test-game/Title-Screen'
import { interactionMatrix } from './test-game/game-interactions'
import { makeConversations } from "./test-game/game-conversations";
import { sprites, makeRooms, verbList, makeInventoryItems, makeCharacters } from "./test-game/game-data";

const gameData = {sprites, makeRooms, verbList, makeInventoryItems, makeCharacters, interactionMatrix, makeConversations}

export {
    TitleScreen, 
    gameData
}