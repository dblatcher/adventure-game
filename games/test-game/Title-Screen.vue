<template>
    <main class="title-page">
        <div class="title-page__frame">
            <h1 class="title-page__title">Test Game</h1>

            <div class="title-page__button-set">
                <slot name="file-buttons"></slot>
            </div>

            <p class="title-page__text">This should have a picture of something</p>

            <slot name="loading-bar"></slot>
        </div>
    </main>
</template>

<script>
export default {
    name: "TitleScreen",
}
</script>

<style lang="scss">

@import "../../src/modules/_layout.scss";
@import "../../src/modules/_material.scss";

.title-page {

    @include fullscreen;
    @include font;

    background-image: linear-gradient(45deg, black, transparent);
    padding: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    &__frame {
        padding: 1rem;
        background-color: black;
        border: 5px outset red;

        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;

        color:red;

    }

    &__title {
        align-self: center;
    }

    &__button-set {
        display: flex;
        justify-content: space-around;

        button {
            flex-basis: 6rem;
        }
    }

}

#loadingBarCaption {
    margin: 0;
    color: gray;
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
