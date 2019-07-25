<template>
  <div>

	<h1>status:{{appStatus}}</h1>
	<Game 

	></Game>

  </div>
</template>

<script>


import Game from "./components/Game";


export default {
  name: 'App',
  components :{
    Game
  },


  data () {
    return {
		appStatus: 'play',

    }
  },


  computed : {
	
	},
  
  methods : {

  },


  beforeMount: function () {

  }

}
</script>



