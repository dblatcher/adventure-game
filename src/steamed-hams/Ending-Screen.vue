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


@import "../modules/_layout.scss";
@import "../modules/_material.scss";


.ending-page {

    @include fullscreen;

    background-image: linear-gradient(45deg, black, transparent);
    padding: 2rem;
    box-sizing: border-box;

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

</style>
