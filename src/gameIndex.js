import TitleScreen from './test-game/Title-Screen'
import { interactionMatrix } from './test-game/game-interactions'
import { makeConversations } from "./test-game/game-conversations";
import { sprites, makeRooms, verbList, makeInventoryItems, makeCharacters, pcId, setGameVars } from "./test-game/game-data";

const gameData = {sprites, makeRooms, verbList, makeInventoryItems, makeCharacters, pcId, interactionMatrix, makeConversations, setGameVars}

export {
    TitleScreen, 
    gameData
}