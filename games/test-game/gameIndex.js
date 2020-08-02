import TitleScreen from './Title-Screen'
import EndingScreen from './Ending-Screen'
import { interactionMatrix } from './game-interactions'
import { makeConversations } from "./game-conversations";
import * as gameDataImport from "./game-data";
import * as gameConfigImport from './game-config'
import sequences from "./sequences";


import custom from './custom.scss'

const gameData = { ...gameDataImport, ...gameConfigImport,
    sequences, interactionMatrix, makeConversations,}


export {
    TitleScreen,
    EndingScreen, 
    gameData,
}