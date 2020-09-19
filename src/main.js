import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
var Emitter = require ('tiny-emitter');

const gameIndex = require(`../games/${process.env.VUE_APP_GAME_NAME}/gameIndex`)
gameIndex.gameData.config = gameIndex.gameData.config || {}

const debug = {
  onScreen: process.env.VUE_APP_DEBUG_ONSCREEN === 'on',
  inConsole: process.env.VUE_APP_DEBUG_LOGGING === 'on'
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const masterGainNode = audioContext.createGain()
masterGainNode.gain.value = 0; // initial gain value is 0 because soundEnabled is false 

function DebugMessage(input, messageType) {
  this.messageType = messageType
  this.message = input.toString ? input.toString() : '*error - no toString*'
  this.time = Date.now()
}

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    gameData:gameIndex.gameData,
    audio: {
      audioContext, 
      masterGainNode,
      soundEnabled: false,
      sfxVolume: 1,
      musicVolume: .2,
      emitter: new Emitter(),
    },
    nonAudioOptions: {
      textDelay: 100
    },
    gameEmitter: new Emitter(),
    debugMessages: [],
  },
  getters: {
    options: state => {
      return {
        textDelay: state.nonAudioOptions.textDelay,
        soundEnabled: state.audio.soundEnabled,
        sfxVolume: state.audio.sfxVolume,
        musicVolume: state.audio.musicVolume,
      }
    }
  },
  mutations: {
    setOptions (state, payload) {

      state.audio.soundEnabled = !!payload.soundEnabled
      if (typeof payload.sfxVolume === 'number' ) {
        state.audio.sfxVolume = payload.sfxVolume
      }
      if (typeof payload.musicVolume === 'number' ) {
        state.audio.musicVolume = payload.musicVolume
      }
      state.audio.masterGainNode.gain.value = state.audio.soundEnabled ? state.audio.sfxVolume : 0;

      if (typeof payload.textDelay === 'number' ) {
        state.nonAudioOptions.textDelay = payload.textDelay
      }

    },
    debugMessage(state, message) {
      if (debug.inConsole) {
        // eslint-disable-next-line
        console.warn(message)
      }
      if (debug.onScreen) {
        state.debugMessages.push(new DebugMessage(message))
      }
    }
  }
})



Vue.config.productionTip = false

function launchApp(selector, rootProps) {

  return new Vue({
      el: selector,
      store: store,
      data() {return {rootProps}},
      render(h) { 
          return h(App, {props: {
            showDebugMessages: debug.onScreen,
            CustomTitleScreen: this.rootProps.gameIndex.TitleScreen,
            CustomEndingScreen: this.rootProps.gameIndex.EndingScreen,
            minigames: this.rootProps.gameIndex.minigames || {}
          }})
      },
  });
}

launchApp('#app',{gameIndex})