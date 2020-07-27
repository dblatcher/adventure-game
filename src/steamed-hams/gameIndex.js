import TitleScreen from './Title-Screen'
import EndingScreen from './Ending-Screen'
import * as ScummMatrix from './game-interactions'
import * as SierraMatrix from './game-interactions-sierra'

import { makeConversations } from "./game-conversations";
import * as gameDataImport from "./game-data";

import * as gameConfigImportSierra from './game-config-sierra'
import * as gameConfigImportScumm from './game-config'

import sequences from "./sequences";

function readParam (param) {
    let params = window.location.search
    if (params.indexOf(param) === -1) {return undefined}
    let answer =''
    let startIndex =  params.indexOf(param) + 1 + param.length

    function addCharacter(index) {
        let nextChar = params.charAt(index)
        if (['','&','='].includes(nextChar) ) {return}
        answer += nextChar
        addCharacter(index+1)
    }
    addCharacter(startIndex)
    return answer
}

let mode = readParam('mode') || 'sierra'

const gameConfigImport    = mode === 'sierra' ? gameConfigImportSierra : gameConfigImportScumm
const {interactionMatrix} = mode === 'sierra' ? SierraMatrix : ScummMatrix


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