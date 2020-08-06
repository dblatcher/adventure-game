<template>
    <main class="default-title-page" v-bind:style="pageStyle">
        
        <h1 class="default-title-page__title">{{title}}</h1>

        <img v-if="picture" class="default-title-page__image"
        v-bind:src="picture"/>
        <p class="default-title-page__text" v-if="subtitle">{{subtitle}}</p>

        <div class="default-title-page__button-set">
            <slot name="file-buttons"></slot>
        </div>


        <slot name="sound-toggle"></slot>
        
        <slot name="loading-bar" class='foo-bar'></slot>
        
    </main>
</template>

<script>


export default {
    name: "TitleScreen",

    data() {
        const settings = this.$store.state.gameData.config.titleScreen || {}
        const title = this.$store.state.gameData.config.title;

        return {
            title: settings.title || title || "untitled game",
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

.default-title-page {

    @include fullscreen;
    padding: 0 2rem;

    display: flex;
    flex-direction: column;
    justify-content: space-between;


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
