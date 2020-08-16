<template>
    <main class="ending-page">
        <div class="ending-page__frame">
            <h1 class="ending-page__title">Test Game COMPLETE</h1>
            <p class="ending-page__text">Game over</p>
            <slot name="file-buttons"></slot>
        </div>
    </main>
</template>

<script>
export default {
    name: "EndingScreen",
}
</script>

<style scoped="true" lang="scss">

@import "../../src/modules/_layout.scss";
@import "../../src/modules/_material.scss";

.ending-page {
    @include fullscreen;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;

    &__frame {
        padding: 1rem;
        background-color: lightgreen;
        border: 5px outset green;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        color:black;
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

</style>
