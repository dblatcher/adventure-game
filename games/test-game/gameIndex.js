import TitleScreen from './Title-Screen'
import EndingScreen from './Ending-Screen'

import KeyPad from './minigames/KeyPad'

import { interactionMatrix } from './game-interactions'
import { makeConversations } from "./game-conversations";
import * as gameDataImport from "./game-data";
import * as gameConfigImport from './game-config'
import sequences from "./sequences";


import custom from './custom.scss'

const gameData = { ...gameDataImport, ...gameConfigImport,
    sequences, interactionMatrix, makeConversations,}

const minigames = {KeyPad}

export {
    TitleScreen,
    EndingScreen, 
    gameData,
    minigames,
}