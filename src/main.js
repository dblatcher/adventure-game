import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
const gameIndex = require(`../games/${process.env.VUE_APP_GAME_NAME}/gameIndex`)

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    gameData:gameIndex.gameData,
  },
  mutations: {
    increment (state) {
      state.count++
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