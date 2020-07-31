import Vue from 'vue'
import App from './App.vue'

const gameIndex = require(`../games/${process.env.VUE_APP_GAME_NAME}/gameIndex`)

Vue.config.productionTip = false

function launchApp(selector, rootProps) {

  return new Vue({
      el: selector,
      data() {
          return {rootProps}
      },
      render(h) { 
          return h(App, {props: {rootProps:this.rootProps}})
      },
  });
}

launchApp('#app',{
  gameName: 'steamed-hams',
  gameIndex,
})