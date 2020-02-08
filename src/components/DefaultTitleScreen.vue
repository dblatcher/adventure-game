<template>
    <main class="title-page">
        
        <h1 class="title-page__title">{{title}}</h1>

        <img v-if="picture" class="title-page__image"
        v-bind:src="picture"/>

        <div class="title-page__button-set">
            <slot name="file-buttons"></slot>
        </div>

        <p class="title-page__text" v-if="subtitle">{{subtitle}}</p>

        <slot name="sound-toggle"></slot>
        
        <slot name="loading-bar" class='foo-bar'></slot>
        
    </main>
</template>

<script>

import { config } from "../gameIndex.js";

export default {
    name: "TitleScreen",

    data() {
        return {
            title:config.title || "untitled game",
            subtitle:config.subtitle,
            picture:config.titlePicture,
        }
    } 
}
</script>

<style lang="scss" >

@import "../modules/_layout.scss";
@import "../modules/_material.scss";

.title-page {

    @include fullscreen;
    @include font;

    background-image: linear-gradient(180deg, gray, transparent);
    padding: 0 2rem;

    display: flex;
    flex-direction: column;
    justify-content: space-between;


    &__title {
        align-self: center;
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
