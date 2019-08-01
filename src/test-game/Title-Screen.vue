<template>
    <main class="title-page">
        <h1 class="title-page__title">Test Game</h1>
        <div class="title-page__button-set">
            <slot></slot>
        </div>
        <p class="title-page__text">This should have a picture of something</p>
    </main>
</template>

<script>
export default {
    name: "TitleScreen",
}
</script>

<style scoped="true" lang="scss">

.title-page {

    position: absolute;
    padding-top: 2rem;
    box-sizing: border-box;
    top:0;
    left:0;
    z-index: -10;
    width: 100%;
    height: 100%;

    background-color: black;
    border: 5px outset red;

    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;

    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color:red;

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
