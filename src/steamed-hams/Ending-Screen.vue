<template>
    <main class="ending-page">
        <img class="ending-page__picture" src="./thumbsup.jpg"/>

        <figure class="ending-page__sprite">
            <Sprite 
            v-bind:sprite="this.chalmers"
            v-bind:fx="this.chalmersFx"
            v-bind:fy=1
            v-bind:height=16
            v-bind:width=10
            v-bind:index="this.chalmers.id"
            v-bind:measure = "{scale:1, unit:'em'}"/>
        </figure>

        <h1 class="ending-page__title">Game Over...</h1>

        <div class="ending-page__frame">
            <div class="ending-page__button-set"><slot name="file-buttons"></slot></div>
        </div>

    </main>
</template>

<script>
// ['width','height','sprite','fx','fy','index','measure'],
import Sprite from "../components/Sprite";
import {sprites} from "./game-data";


export default {
    name: "EndingScreen",
    components: {Sprite}, 
    data: function () {
        return {
            chalmers: sprites[14],
            chalmersFx: 3,
        }
    }

}
</script>

<style scoped="true" lang="scss">


@import "../modules/_layout.scss";
@import "../modules/_material.scss";


.ending-page {

    @include fullscreen;

    background-image: linear-gradient(tan, darkgreen);
    padding: 1rem;

    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;


    &__frame {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
    }

    &__title {
       @include centerPoint;
       @include placeAbsolute(50%, 60%, false, false);
       color: purple;
       font-family: cursive;
       text-shadow: 0px 1px black;
       font-size: 2.5rem;
       line-height: 3.25rem;
       text-align: center;
       white-space: nowrap;
    }

    &__button-set {
        display: flex;
        justify-content: space-around;

        button {
            flex-basis: 6rem;
        }
    }

    &__sprite {
        @include placeAbsolute(5%, 1rem, false, true);
    }

    &__picture {
        @include centerPoint;
        @include placeAbsolute(50%, 50%, false, false);
        border-radius: 50%;
        box-shadow: $drop-shadow1;
        z-index: -1;
        filter: sepia(1);

        @media (orientation: portrait) {
            width: 90%;
            max-width: 600px;
            
        }

        @media (orientation: landscape) {
            height: 80%;
            max-height: 450px;
        }
    }
}

</style>
