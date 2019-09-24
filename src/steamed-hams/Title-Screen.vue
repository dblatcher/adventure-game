<template>
    <main class="title-page">

        <div class="title-page__text">
            <h1 class="title-page__title">
                <span class="title-page__l">S</span>teamed 
                <span class="title-page__l">H</span>ams
            </h1>
            <p class="title-page__subtitle">But it's a point and click adventure game</p>
        </div>

        <div class="title-page__button-set">
            <slot name="file-buttons"></slot>
            <button v-on:click="showAboutBlock = true">About</button>
        </div>

        <div class="title-page__loading">
            <slot name="loading-bar"></slot>
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

.title-page {

    @include fullscreen();
    padding: 1rem;

    background-image:
    url(./title-skinner.png),
    url(./title-chalmers.png),
    linear-gradient(-15deg,tan 20%, darkgreen 80%,)
    ;

    background-size: auto 25%, auto 25%, cover;

    @media(orientation: landscape) {
        background-size: 20%, 20%, cover;
    }

    background-repeat: no-repeat, no-repeat, repeat;
    background-position: top left, bottom right, center;
    background-origin: content-box, content-box, padding-box;


    &__text {
        @include placeAbsolute(50%,50%);
        transform: translateX(-50%) translateY(-50%) rotate(-15deg);
    }

    &__title  {
       margin: 0;
       color: purple;
       font-family: cursive;

        @media(min-width: 22rem) {
            white-space: nowrap;
        }

        text-shadow: 0px .2vw black;
        font-size: 6vw;
        line-height: 6.5vw;

        @media (orientation: portrait) {
            text-shadow: 0px 1px black;
            font-size: 2.5rem;
            line-height: 3.25rem;
        }
    }

    &__l {
        font-size: 200%;
        font-family: inherit;
    }

    &__subtitle {
        font-family: monospace;
        margin: 0;
        font-weight: bold;
        white-space: nowrap;
        font-size: 2.5vw;

        @media (orientation: portrait) {
            font-size: 1.1rem;
        }
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
