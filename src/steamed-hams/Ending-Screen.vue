<template>
    <main class="ending-page">

        <div class="ending-page__picture-frame">
            <figure class="ending-page__picture"></figure>
            <h1 class="ending-page__title">Game Over...</h1>
        </div>

        <figure class="ending-page__sprite">
            <Sprite 
            v-bind:sprite="this.chalmers"
            v-bind:fx="this.chalmersFx"
            v-bind:fy=1
            v-bind:height=20
            v-bind:width=10
            v-bind:index="this.chalmers.id"
            v-bind:measure = "{scale:1, unit:'em'}"/>
        </figure>



        <div class="ending-page__frame">
            <div class="ending-page__button-set">
                <slot name="file-buttons"/>
            </div>
        </div>

    </main>
</template>

<script>
// ['width','height','sprite','fx','fy','index','measure'],
import Sprite from "../components/Sprite";
import {sprites} from "./game-data";

const chalmersSprite = sprites.filter(sprite => sprite.id === 'ch-r')[0]

export default {
    name: "EndingScreen",
    components: {Sprite}, 
    data: function () {
        return {
            chalmers: chalmersSprite,
            chalmersFx: 3,
        }
    }

}
</script>

<style scoped="true" lang="scss">


@import "../modules/_layout.scss";
@import "../modules/_material.scss";
@import url('https://fonts.googleapis.com/css?family=Knewave|Schoolbell&display=swap');

.ending-page {

    @include fullscreen;

    background-image: url(./thatch.png);
    padding: 1rem;

    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;


    &__frame {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
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

    &__picture-frame {
        @include centerPoint;
        @include placeAbsolute(50%, 50%, false, false);

        border-radius: 50%;
        box-sizing: border-box;
        border: 15px ridge #bc6421;
        border-style: ridge;
        box-shadow: $drop-shadow2;
        padding:0;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        @media (orientation: portrait) {
            width: 84vw;
            height: 72vw;
        }

        @media (orientation: landscape) {
            width: 49vw;
            height: 42vw;
        }
    }


    &__title {
       @include centerPoint;
       color: #431848;
       text-shadow: -3px 2px black;
       font-family: 'Schoolbell', cursive;

        text-align: center;
        white-space: nowrap;

        @media (orientation: portrait) {
           @include placeAbsolute(50%, 70%, false, false);
           font-size: 14vw;
        }

        @media (orientation: landscape) {
           @include placeAbsolute(50%, 70%, false, false);
           font-size: 7vw;
        }
    }


    &__picture {
        background-image:url(./thumbsup.jpg);
        background-position: center;
        background-size: cover;
        width: 100%;
        height:100%;      
        z-index: -1;
        filter: sepia(1);
        margin: 0;
        padding: 0;
    }
}

</style>
