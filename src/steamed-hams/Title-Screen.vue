<template>
    <main class="title-page">
        <div class="title-page__frame">


            <h1 class="title-page__title">
                <p class="title-page__title-line title-page__title-line--1">
                    <span class="title-page__title-line--large">S</span>kinner
                </p>
                <p class="title-page__title-line title-page__title-line--2">&amp; the</p>
                <p class="title-page__title-line title-page__title-line--3">
                    <span class="title-page__title-line--large">S</span>uperintendent
                </p>
                <p class="title-page__subtitle">Steamed Hams but it's a point and click adventure game</p>
            </h1>
        </div>


        <div class="title-page__loading">
            <slot name="loading-bar"></slot>
        </div>



        <div class="title-page__button-set">
            <slot name="file-buttons"></slot>
            <button v-on:click="showAboutBlock = true">About</button>
        </div>

        <div class="title-page__sound-control">
            <slot name="sound-toggle"></slot>
            <label 
            class="title-page__sound-button-label"
            v-bind:class="{'title-page__sound-button-label--on': soundEnabled}"
            for="toggle-sound"
            >
                <img v-show="soundEnabled" class="title-page__sound-icon" src='../icons/volume-up.svg'/>
                <img v-show="!soundEnabled" class="title-page__sound-icon" src='../icons/volume-mute.svg'/>
            </label>
        </div>

        <section v-show="showAboutBlock" class="about">


            <div class="about__content">
            
                <button class="about__close-button" v-on:click="showAboutBlock = false"><img src="./times-circle.svg"/></button>
                <h2 class="about__heading">About This Game</h2>
                <p class="about__text"><i>Steamed Hams but it's a point and click adventure game</i> is a point and click adventure game based on the Simpsons scene commonly known as 'Steamed Hams'. With me so far?</p>
                <h3 class="about__sub-heading">Acknowledgments</h3>
                <p class="about__text">I used the truely awesome <a href="https://frinkiac.com/">frinkiac.com</a> as a source of images.</p>
                <p class="about__text">Many thanks to the awesome redditers of r/SteamedHams and r/adventuregames for playtesting and feedback.</p>
                <h3 class="about__sub-heading">Amateurish Legalese Section</h3>
                <p class="about__text">Don't rip this game off and try to sell it to someone. It's too short anyway.</p>
                <p class="about__text">The Simpsons is copyrighted material, owned by 20th Century Fox. This game makes non-commercial use of that material. They haven't endorsed or licensed it.  I'd take it down if they asked me to. I think that's reasonable fair use, like a big interactive meme. Everyone loves memes.</p>

                <div class=about__twitter-bar>
                    <img class="about__logo" src='../icons/twitter-square.svg'/>
                    <a href="https://twitter.com/webventurer1" class="about__handle">@webventurer1</a>
                </div>

            </div>    
        </section>

    </main>
</template>

<script>



export default {
    name: "TitleScreen",
    props: ["soundEnabled"],

    data: function() {
        return {
            showAboutBlock: false,
        }
    }
}
</script>

<style lang="scss">


@import "../modules/_layout.scss";
@import "../modules/_material.scss";

@import url('https://fonts.googleapis.com/css?family=Knewave|Schoolbell&display=swap');

.title-page {

    @include fullscreen();
    padding: 3rem 2rem;

    background-image: url(./thatch.png);

    display: flex;
    justify-content: center;
    align-items: center;

    &__frame {
        width: 100%;
        height: 100%;

        max-width: 700px;
        max-height: 500px;

        padding: 1rem;
        box-sizing: border-box;
        border: 15px ridge #bc6421;
        border-style: ridge;
        position: relative;
        box-shadow: $drop-shadow2;

        background-image:
        url(./title-skinner.png),
        url(./title-chalmers.png),
        ;

        background-repeat: no-repeat, no-repeat;
        background-position: top left, bottom right;
        background-origin: content-box, content-box;

        background-color: #b19b83;
        background-size: 25%, 25%;

        @media (orientation: landscape) {
            background-size: auto 45%, auto 45%;
        }

    }

    &__title  {
       margin: 0;
        @include placeAbsolute(50%,50%);
        transform:  translateY(-50%) translateX(-50%) rotate(-15deg);
        display: inline-flex;
        flex-flow: column;
        font-size: 25px;

        @media(min-width: 350) {
            font-size: 30px;
        }

        @media(min-width: 400px) {
        @media(min-height: 375px ) {
            font-size: 35px;
        }
        }

        @media(min-width: 500px) {
        @media(min-height: 400px ) {
            font-size: 40px;
        }
        }

        @media(min-width: 600px ) {
        @media(min-height: 500px ) {
            font-size: 45px;
        }
        }
    }

    &__title-line {
        margin: 0;
        color: #431848;
        font-family: 'Knewave', cursive;
        font-weight: 400;
        font-size: 1em;
        line-height: 1;
        transform-origin: left;
        letter-spacing: 2px;

        &--1 {
            margin-left: 1.5em;
        }

        &--2 {
            margin-left: 4em;
            font-size: .8em;
            vertical-align: super;
        }

        &--3 {
            margin-left: 0;
        }

        &--large {
            font-size: 2.5em;
            line-height: .4;
            vertical-align: text-top;
            font-family: 'Schoolbell', cursive;
            font-weight: 700;
        }
    }

    &__subtitle {
        font-family: monospace;
        margin: .5em  0 0 0;
        font-weight: bold;
        font-size: .5em;
        text-align: justify;
    }

    &__button-set {
        @include placeAbsolute(1rem, .5rem, true);

        display: flex;
        flex-flow: row wrap;
        justify-content: flex-end;

        button {
            cursor: pointer;
            display:block;
            margin: .5rem;
            min-width: 8rem;
            font-family: monospace;
            font-size: 1.2rem;
        }
    }

    &__sound-control {

        @include placeAbsolute(0, 0);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 5rem;
        height: 5rem;

        button {
            display: none;
        }
    }

    &__sound-button-label {
        cursor: pointer;
        display: inline-block;
        box-sizing: border-box;
        height: 2.5rem;
        width: 2.5rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: $drop-shadow2;
        background-color: $colour-red;

        &--on {
            background-color: $colour-green;
        }
    }

    &__sound-icon { 
        height: 1.5rem;
        width: 1.5rem;
        box-sizing: border-box;
    }

    &__loading {

        @include placeAbsolute(1rem, .5rem, false, true);
        width: 50%;
        max-width: 15rem;


        #loadingBarHolder {
            margin: 0;
            height: 1rem;
            padding: .1rem;
            width: 100%;
            background-color: white;
            position: relative;
        }

        #loadingBar {
            background-color: darkgreen;
            height: 100%;
            box-sizing: border-box;
            transition: width .5s;
        }

        #loadingBarCaption {
            color: white;
            margin: 0;
        }
    }


}

.about {

    @include fullscreen();
    background-color: rgba($color: #000000, $alpha: .5);
    box-sizing: border-box;
    padding: 5%;

    &__content {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background-color: antiquewhite;
        padding: .5rem;
        border-radius: .5rem;
        position: relative;
        overflow-y: auto;
    }

    &__close-button {
        float: right;
        background-color: transparent;
        border: none;
        cursor: pointer;

        img {
            width: 1.5rem;
        }
    }

    &__heading {
        margin: 0 0 .5rem 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: purple;
    }

    &__sub-heading {
        margin: .75rem 0 0 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: purple;
    }

    &__text {
        margin: 0 0 .25rem 0;
        line-height: 1.1rem;
    }


    &__twitter-bar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 1rem;
    }

    &__handle {
        margin-left: .5rem;
        text-decoration: none;
        font-weight: 700;
        color: purple;

        &:hover {
            color: darkgreen;
            transition: all .5s;
            transform: skewX(-20deg);
        }
    }

    &__logo {
        height: 2rem;
    }

}

</style>
