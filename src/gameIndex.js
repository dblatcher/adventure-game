import TitleScreen from './steamed-hams/Title-Screen'
import EndingScreen from './steamed-hams/Ending-Screen'
import * as ScummMatrix from './steamed-hams/game-interactions'
import * as SierraMatrix from './steamed-hams/game-interactions-sierra'

import { makeConversations } from "./steamed-hams/game-conversations";
import * as gameDataImport from "./steamed-hams/game-data";
import * as gameConfigImport from './steamed-hams/game-config'

import sequences from "./steamed-hams/sequences";

//console.log(window.location)

const {interactionMatrix} = true ? SierraMatrix : ScummMatrix

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