import TitleScreen from './Title-Screen'
import EndingScreen from './Ending-Screen'
import * as ScummMatrix from './game-interactions'

import { makeConversations } from "./game-conversations";
import * as gameDataImport from "./game-data";

import * as gameConfigImport from './game-config'

import sequences from "./sequences";



const {interactionMatrix} =  ScummMatrix


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