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
                <p class="about__text">The Simpsons is copyrighted material, owned by 20th Century Fox. This game makes non-commercial use of that material. They haven't endorsed or licensed it.  I'd take it down if they asked me to. I thik that's reasonable fair use, like a big interactive meme. Everyone loves memes.</p>

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

@import url('https://fonts.googleapis.com/css?family=Fredoka+One&display=swap');

.title-page {

    @include fullscreen();
    padding: 5%;

    background-image: url(./thatch.png);

    &__frame {
        width: 100%;
        height: 100%;

        max-width: 37.5rem;
        max-height: 30rem;
        margin: auto;

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
            background-size: auto 50%, auto 50%;

        }

    }

    &__title  {
       margin: 0;
        font-size: 30px;
        @include placeAbsolute(50%,50%);
        transform:  translateY(-50%) translateX(-50%) rotate(-15deg);
        display: inline-flex;
        flex-flow: column;
    }

    &__title-line {
        margin: 0;
        color: #431848;
        font-family: 'Fredoka One', cursive;

        font-size: 100%;
        line-height: 1;
        transform-origin: left;


        &--1 {
            margin-left: 1.5em;
        }

        &--2 {
            margin-left: 4em;
            font-size: 80%;
            vertical-align: super;
        }

        &--3 {
            margin-left: 0;
            
        }

        &--large {
            font-size: 250%;
            line-height: .4;
            vertical-align: text-top;
        }
    }

    &__subtitle {
        font-family: monospace;
        margin: .5rem  0 0 0;
        font-weight: bold;
        font-size: .9rem;
        text-align: justify;
    }

    &__button-set {
        @include placeAbsolute(1rem, .5rem, true);

        @media(orientation: landscape) {
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-end;
        }

        button {
            display:block;
            margin: .5rem;
            min-width: 8rem;
            font-family: monospace;
            font-size: 1.2rem;
        }
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
