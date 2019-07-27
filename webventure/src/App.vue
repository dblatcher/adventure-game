<template>
  <div>

	<h1>status:{{appStatus}}</h1>

  <div id="gameHolder">
  </div>

  <button @click="reloadGame()">restart</button>
  <button @click="reloadGame(loadData)">load</button>

  </div>
</template>

<script>


import Game from "./components/Game";
import Vue from 'vue';

export default {
  name: 'App',
  components :{
    Game
  },


  data () {

    var loadData = {
      roomNumber: 2
    };

    return {
      appStatus: 'GAME RUNNING',
      loadData: loadData,
      gameInstance: null,
    }
  },


  computed : {
	
	},
  
  methods : {

    reloadGame : function (data = null) {

      if (this.gameInstance && this.gameInstance._isVue) {
        console.log('game is running');
        window.oldVm = this.gameInstance;
        this.gameInstance.$destroy();
        this.gameInstance.$el.parentElement.removeChild( this.gameInstance.$el);
        buildGame.apply(this);
      } else {
        buildGame.apply(this);
      }


      function buildGame() {
        var element = document.querySelector('#gameHolder').appendChild(document.createElement('div'))
        var GameConstructor = Vue.extend(Game);
        this.gameInstance = new GameConstructor({
          propsData: {
            loadData: data,
          }
        })
        this.gameInstance.$mount(element);
      }


    }

  },


  mounted: function () {
    console.log('app mounted');
    window.app = this;

    this.reloadGame();



  }

}
</script>



