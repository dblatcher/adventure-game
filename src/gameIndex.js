import TitleScreen from './steamed-hams/Title-Screen'
import { interactionMatrix, defaultResponses } from './steamed-hams/game-interactions'
import { makeConversations } from "./steamed-hams/game-conversations";
import { sprites, makeRooms, verbList, makeInventoryItems, makeCharacters, pcId, setGameVars } from "./steamed-hams/game-data";

const gameData = {sprites, makeRooms, verbList, makeInventoryItems, makeCharacters, pcId, interactionMatrix, makeConversations, setGameVars, defaultResponses}

export {
    TitleScreen, 
    gameData
}