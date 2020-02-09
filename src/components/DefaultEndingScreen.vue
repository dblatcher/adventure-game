<template>
    <main class="default-end-page" v-bind:style="pageStyle">
        
        <h1 class="default-end-page__title">{{title}}</h1>

        <img v-if="picture" class="default-end-page__image"
        v-bind:src="picture"/>
        <p class="default-end-page__text" v-if="subtitle">{{subtitle}}</p>

        <div class="default-end-page__button-set">
            <slot name="file-buttons"></slot>
        </div>
        
    </main>
</template>

<script>

import { config } from "../gameIndex.js";

export default {
    name: "EndingScreen",

    data() {

        const settings = config.endingScreen || {}

        return {
            title: settings.title ||  "Game Over",
            subtitle:settings.subtitle,
            picture:settings.picture,
            pageStyle: settings.pageStyle || {},
        }
    } 
}
</script>

<style lang="scss" >

@import "../modules/_layout.scss";
@import "../modules/_material.scss";

.default-end-page {

    @include fullscreen;
    @include font;
    padding: 0 2rem;

    display: flex;
    flex-direction: column;
    justify-content: space-around;


    &__title, &__text {
        align-self: center;
        text-align: center;
        margin: 1rem 0 0 0;
    }

    &__image {
        align-self: center;
    }

    &__button-set {
        margin-top: 1rem;
        display: flex;
        justify-content: space-around;

        button {
            flex-basis: 6rem;
        }
    }

}

#toggle-sound {
    align-self: flex-end;
}

#loadingBarSection {
    width: 100%;
}

#loadingBarCaption {
    margin: 0;
}

#loadingBarHolder {
    height: 1rem;
    margin: 5px 0;
    position: relative;
    background-color: gray;
    padding: 2px;
}

#loadingBar {
    background-color: red;
    height: 100%;
    width: 0;
    transition: width, .2s;
}

</style>
