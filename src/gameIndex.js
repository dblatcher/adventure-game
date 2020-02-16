import TitleScreen from './steamed-hams/Title-Screen'
import EndingScreen from './steamed-hams/Ending-Screen'
import * as ScummMatrix from './steamed-hams/game-interactions'
import * as SierraMatrix from './steamed-hams/game-interactions-sierra'

import { makeConversations } from "./steamed-hams/game-conversations";
import * as gameDataImport from "./steamed-hams/game-data";

import * as gameConfigImportSierra from './steamed-hams/game-config-sierra'
import * as gameConfigImportScumm from './steamed-hams/game-config'

import sequences from "./steamed-hams/sequences";

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