<template>
     <nav class="game__settings">
      <div class="skip-button" 
      v-bind:class="{'skip-button--disabled': gameStatus !== 'CUTSCENE'}"
      @click="$emit('skip-button', $event)">
      <img class="button-icon" src="./_icons/forward.svg"/></div>

      <div class="highlight-button"
      @click="$emit('highlight-button', $event)"
      v-bind:class="{'highlight-button--active': highlightingThings }"
      ><img class="button-icon" src="./_icons/eye.svg"/></div>

      <div class="pause-button"
      @click="$emit('pause-button', $event)"
      v-bind:class="{'pause-button--active': gameStatus === 'PAUSED'}"
      ><img class="button-icon" src="./_icons/pause.svg"/></div>

      <div class="options-button"
      @click="$emit('options-button', $event)"
      v-bind:class="{'options-button--active': optionsMenuIsOpen}"
      ><img class="button-icon" src="./_icons/cogs.svg"/></div>

      <div class="file-button"
      @click="$emit('file-button', $event)"
      v-bind:class="{
        'file-button--active': fileMenuIsOpen,
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


.file-button {
    @include btn-toggle ($colour-blue);
    @include navButton(true);

    &--active {
        @include btn-solid ($colour-blue);
        @include navButton(true);
    }

    right: .2rem;
    z-index: 500;
}

.options-button {
    @include btn-toggle ($colour-blue);
    @include navButton(true);

    &--active {
        @include btn-solid ($colour-blue);
        @include navButton(true);
    }


    right: 3.2rem;
    z-index: 500;
}


.skip-button {
    @include btn-solid ($colour-blue);
    @include navButton(true);

    &--disabled {
        display: none;
    }


    left: .2rem;
    z-index: 300;
}


.highlight-button {
    @include btn-toggle ($colour-blue);
    @include navButton(true);

    &--active {
        @include btn-solid ($colour-blue);
        @include navButton(true);
    }

    right: 6.2rem;
    z-index: 300;
}

.pause-button {
    @include btn-toggle ($colour-blue);
    @include navButton(true);

    &--active {
        @include btn-solid ($colour-blue);
        @include navButton(true);
    }


    right: 9.2rem;
    z-index: 500;
}


</style>