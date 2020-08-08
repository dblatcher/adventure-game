<template>
  <aside>
      <ul>
          <li v-for="(entry, index) in debugMessages" v-bind:key="index">
              <span>{{entry.time}}: &nbsp;</span>
              <span>{{entry.message}}</span>
          </li>
      </ul>
  </aside>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: mapState(['debugMessages'])
}
</script>

<style scoped>
    aside {
        position: fixed;
        bottom: 0;
        max-width: 50vw;
        background-color: black;
        color: greenyellow;
        opacity: .5;
        pointer-events: none;
    }

</style>