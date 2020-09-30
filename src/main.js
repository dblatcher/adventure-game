import {createApp} from 'vue'
import App from './App.vue'
import unpackRawContents from './unpack/unpackRawContents';
import buildStore from './buildStore';
import unpackRawVerbList from './unpack/unpackRawVerbList';


const gameIndex = require(`../games/${process.env.VUE_APP_GAME_NAME}/gameIndex`)
if (gameIndex.gameData.rawGameContentsData) {
  const unpackedContents = unpackRawContents(gameIndex.gameData.rawGameContentsData)
  for (let key in unpackedContents) { 
    gameIndex.gameData[key] = unpackedContents[key]
  }
}
gameIndex.gameData.config = gameIndex.gameData.config || {}


if (gameIndex.gameData.rawVerbList) {
  const unpackedVerbList = unpackRawVerbList(gameIndex.gameData.rawVerbList)
  gameIndex.gameData.verbList = unpackedVerbList
}

const debugSetting = {
  onScreen: process.env.VUE_APP_DEBUG_ONSCREEN === 'on',
  inConsole: process.env.VUE_APP_DEBUG_LOGGING === 'on'
}


const store = buildStore(gameIndex.gameData, debugSetting)



function launchApp(selector, rootProps) {

  const appInstance = createApp(App,
    {
      showDebugMessages: debugSetting.onScreen,
      CustomTitleScreen: rootProps.gameIndex.TitleScreen,
      CustomEndingScreen: rootProps.gameIndex.EndingScreen,
      minigames: rootProps.gameIndex.minigames || {}
    }
  )

  appInstance.use(store)
  appInstance.mount(selector)
  return appInstance
}

launchApp('#app',{gameIndex})