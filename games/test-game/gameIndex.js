import TitleScreen from './Title-Screen'
import EndingScreen from './Ending-Screen'

import KeyPad from './minigames/KeyPad'
import TypeWriterAnimation from './minigames/TypeWriterAnimation'

import { interactionMatrix } from './game-interactions'
import { makeConversations } from "./game-conversations";
// import * as gameContentsImport from "./game-contents";
import rawGameContentsData from './rawContents.json'
import * as gameConfigImport from './game-config'
import sequences from "./sequences";


require('./custom.scss');

const gameData = { 
    // ...gameContentsImport, 
    rawGameContentsData,
    ...gameConfigImport,
    sequences,
    interactionMatrix,
    makeConversations,
}

const minigames = {KeyPad, TypeWriterAnimation}

export {
    gameData,
    TitleScreen,
    EndingScreen, 
    minigames,
}