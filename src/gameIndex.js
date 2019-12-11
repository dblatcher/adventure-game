import TitleScreen from './steamed-hams/Title-Screen'
import EndingScreen from './steamed-hams/Ending-Screen'
import { interactionMatrix  } from './steamed-hams/game-interactions'
import { makeConversations } from "./steamed-hams/game-conversations";
import { sprites, makeRooms, makeInventoryItems, makeCharacters, pcId, setGameVars } from "./steamed-hams/game-data";
import {defaultResponses, verbList, config} from './steamed-hams/game-config'

import sequences from "./steamed-hams/sequences";


const gameData = {
    sprites, makeRooms, verbList, makeInventoryItems, makeCharacters, pcId, 
    interactionMatrix, makeConversations, setGameVars, defaultResponses,
    sequences, config}

export {
    TitleScreen,
    EndingScreen, 
    gameData
}