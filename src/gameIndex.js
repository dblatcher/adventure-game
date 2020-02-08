import TitleScreen from './steamed-hams/Title-Screen'
import EndingScreen from './steamed-hams/Ending-Screen'
import { interactionMatrix  } from './steamed-hams/game-interactions'
import { makeConversations } from "./steamed-hams/game-conversations";
import * as gameDataImport from "./steamed-hams/game-data";
import * as gameConfigImport from './steamed-hams/game-config'

import sequences from "./steamed-hams/sequences";


const gameData = { ...gameDataImport, ...gameConfigImport,
    sequences, interactionMatrix, makeConversations,}

const {config} = gameConfigImport
const {sprites} = gameDataImport 

export {
    TitleScreen,
    EndingScreen, 
    gameData,
    config,
    sprites,
}