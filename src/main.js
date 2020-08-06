import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
const gameIndex = require(`../games/${process.env.VUE_APP_GAME_NAME}/gameIndex`)

Vue.use(Vuex)


const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const masterGainNode = audioContext.createGain()
masterGainNode.gain.value = 0; // initial gain value is 0 because enabled is false 

const store = new Vuex.Store({
  state: {
    gameData:gameIndex.gameData,
    audio: {
      audioContext, 
      masterGainNode,
      enabled: false,
      sfxVolume: 1,
      musicVolume: .2,
    },
  },
  mutations: {
    setAudioOptions (state, payload) {
      console.log('setAudioOptions', payload)

      state.audio.enabled = !!payload.soundEnabled
      if (typeof payload.sfxVolume === 'number' ) {
        state.audio.sfxVolume = payload.sfxVolume
      }
      if (typeof payload.musicVolume === 'number' ) {
        state.audio.musicVolume = payload.musicVolume
      }
      state.audio.masterGainNode.gain.value = state.audio.enabled ? state.audio.sfxVolume : 0;
    },
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
            CustomTitleScreen: this.rootProps.gameIndex.TitleScreen,
            CustomEndingScreen: this.rootProps.gameIndex.EndingScreen,
          }})
      },
  });
}

launchApp('#app',{gameIndex})