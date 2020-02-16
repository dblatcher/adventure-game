<template>
     <nav class="control-bar">

      <div class="control-button control-button--highlighting"
      @click="$emit('highlight-button', $event)"
      v-bind:class="{'control-button--active': highlightingThings }"
      ><img class="button-icon" src="./_icons/eye.svg"/></div>

      <div class="control-button control-button--pause"
      @click="$emit('pause-button', $event)"
      v-bind:class="{'control-button--active': gameStatus === 'PAUSED'}"
      ><img class="button-icon" src="./_icons/pause.svg"/></div>

      <div class="control-button control-button--options"
      @click="$emit('options-button', $event)"
      v-bind:class="{'control-button--active': optionsMenuIsOpen}"
      ><img class="button-icon" src="./_icons/cogs.svg"/></div>

      <div class="control-button control-button--file"
      @click="$emit('file-button', $event)"
      v-show="gameStatus !== 'CUTSCENE'"
      v-bind:class="{
        'control-button--active': fileMenuIsOpen,
      }"
      ><img class="button-icon" src="./_icons/save.svg"/></div>

      <div class="control-button control-button--skip" 
      @click="$emit('skip-button', $event)"
      v-show="gameStatus === 'CUTSCENE'">
      <img class="button-icon" src="./_icons/forward.svg"/></div>

    </nav>
</template>

<script>
export default {
    props: ['gameStatus', 'highlightingThings', 'fileMenuIsOpen', 'optionsMenuIsOpen']
}
</script>

<style lang="scss" scoped>

@import '../modules/material';
@import '../modules/layout';

.control-bar {
    position: fixed;
    z-index: 1;
    top:0;
    right: 0;
    margin: 0;
    padding-top: .2rem;
    padding-right: .2rem;
    display:flex;
    justify-content: flex-end;
}

.control-button {
    @include btn-toggle ($colour-blue);
    @include navButtonLarge(false);

    margin-left: .2rem;
    z-index: 500;
    
    &--skip, &--highlighting {    
        z-index: 300;
    }

    &--active {
        @include btn-solid ($colour-blue);
        @include navButtonLarge(false);
    }

}


</style>