<template>
     <nav class="game__settings">
      <div class="control-button control-button--skip" 
      @click="$emit('skip-button', $event)"
      v-bind:class="{'control-button--disabled': gameStatus !== 'CUTSCENE'}">
      <img class="button-icon" src="./_icons/forward.svg"/></div>

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
      v-bind:class="{
        'control-button--active': fileMenuIsOpen,
        'disabled': gameStatus === 'CUTSCENE'
      }"
      ><img class="button-icon" src="./_icons/save.svg"/></div>

    </nav>
</template>

<script>
export default {
    props: ['gameStatus', 'highlightingThings', 'fileMenuIsOpen', 'optionsMenuIsOpen']
}
</script>

<style lang="scss">

@import '../modules/material';
@import '../modules/layout';

.control-button {
    @include btn-toggle ($colour-blue);
    @include navButton(true);

    &--active {
        @include btn-solid ($colour-blue);
        @include navButton(true);
    }

    &--disabled {
        display: none;
    }
    
    z-index: 500;

    &--file {
        right: .2rem;
    }

    &--options {
        right: 3.2rem;
    }

    &--skip {
        left: .2rem;
        z-index: 300;
    }

    &--highlighting {
        right: 6.2rem;
        z-index: 300;
    }

    &--pause {
        right: 9.2rem;
    }
}


</style>