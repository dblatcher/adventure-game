import TitleScreen from './Title-Screen'
import EndingScreen from './Ending-Screen'
import KeyPad from './minigames/KeyPad'
import TypeWriterAnimation from './minigames/TypeWriterAnimation'


import interactionMatrix from './game-interactions'
import makeConversations from "./game-conversations";
import * as gameContentsImport from "./game-contents";
// import rawGameContentsData from './rawContents.json'
// import rawVerbList from './rawVerbList.json'
import config from './game-config'
import sequences from "./sequences";

import verbList from '../../src/defaults/defaultScummVerbs'

require('./custom.scss');

const gameData = { 
    ...gameContentsImport, 
    // rawGameContentsData,
    // rawVerbList,
    verbList,
    config,
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