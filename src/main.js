import Vue from 'vue'
import App from './App.vue'

const gameIndex = require(`../games/${process.env.VUE_APP_GAME_NAME}/gameIndex`)

Vue.config.productionTip = false

function launchApp(selector, rootProps) {

  return new Vue({
      el: selector,
      data() {return {rootProps}},
      render(h) { 
          return h(App, {props: {
            gameData: this.rootProps.gameIndex.gameData,
            CustomTitleScreen: this.rootProps.gameIndex.TitleScreen,
            CustomEndingScreen: this.rootProps.gameIndex.EndingScreen,
          }})
      },
  });
}

launchApp('#app',{gameIndex})