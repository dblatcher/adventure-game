<template>
    <main class="title-page">
        <div class="title-page__frame">
            <h1 class="title-page__title">Test Game COMPLETE</h1>
            <div class="title-page__button-set">
                <slot></slot>
            </div>
            <p class="title-page__text">Game over</p>
        </div>
    </main>
</template>

<script>
export default {
    name: "EndingScreen",
}
</script>

<style scoped="true" lang="scss">

.title-page {

    background-image: linear-gradient(45deg, black, transparent);
    padding: 2rem;
    box-sizing: border-box;
    top:0;
    left:0;
    
    width: 100%;
    height: 100vh;
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;

    display: flex;
    justify-content: center;
    align-items: center;

    &__frame {
        padding: 1rem;
        background-color: black;
        border: 5px outset green;

        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;

        color:green;

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
