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
            <button v-on:click="showAboutBlock = true">about</button>
        </div>

        <div class="title-page__loading">
            <slot name="loading-bar"></slot>
        </div>

        <section v-show="showAboutBlock" class="about">


            <div class="about__content">
            
                <button class="about__close-button" v-on:click="showAboutBlock = false"><img src="./times-circle.svg"/></button>
                <h2 class="about__heading">About this game</h2>
                <p class="about__text"><i>Steamed Hams but it's a point and click adventure game</i> is a point and click adventure game based on the Simpsons scene commonly known as 'Steamed Hams'. </p>
                <h3 class="about__sub-heading">Acknowledgments</h3>
                <p class="about__text">I used the truely awesome <a href="https://frinkiac.com/">frinkiac.com</a> as a source of images.</p>
                <h3 class="about__sub-heading">Amateurish Legalese Section</h3>
                <p class="about__text">Don't rip this game off and try to sell it to someone. It's too short anyway.</p>
                <p class="about__text">The Simpsons is copyrighted material, owned by 20th Century Fox. This game makes non-commercial use of that material. They haven't endorsed or licensed that useage. </p>
                <p class="about__text">Given non-commercial use of this material is common and does no harm to the copyright owners, I consider it reasonable fair use. Try to think of this as a big interactive meme. Nobody gets upset about memes right? I'd take it down if they asked me.</p>

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


@mixin centerPoint () {
    position: absolute;
    transform-origin: center;
    transform: translateX(-50%) translateY(-50%);
}

@mixin placeAbsolute($x, $y, $fromRight:false, $fromBottom:false) {
    position: absolute;
    left: $x;
    top: $y;

    @if ($fromBottom) {
        top: unset;
        bottom: $y;
    }

    @if ($fromRight) {
        right: $x;
        left: unset;
    }

    margin: 0;
}

.title-page {

    background-image:
    url(./title-skinner.png),
    url(./title-chalmers.png),
    linear-gradient(-15deg,tan 20%, darkgreen 80%,)
    ;

    background-repeat: 
    no-repeat, 
    no-repeat, 
    repeat
    ;

    background-size: 
    25%, 
    25%, 
    cover;

    background-position: 
    top left, 
    bottom right, 
    center;

    background-origin: content-box, content-box, padding-box;

    box-sizing: border-box;
    top:0;
    left:0;
    
    width: 100%;
    height: 100vh;

    padding: 1rem;


    &__text {
        @include placeAbsolute(50%,50%);
        transform: translateX(-50%) translateY(-50%) rotate(-15deg);
        width:80%;
    }

    &__title  {
       margin: 0;
       color: purple;
       font-family: cursive;
       text-shadow: 0px 1px black;
       font-size: 2.5rem;
       line-height: 3.25rem;
    }

    &__l  {
        font-size: 200%;
        font-family: inherit;
    }

    &__subtitle {
        font-size: 1.75rem;
        font-family: monospace;
        margin: 0;
        font-weight: bold;
    }

    &__button-set {
        @include placeAbsolute(1rem, .5rem, true);

        button {
            display:block;
            margin: .5rem;
            min-width: 8rem;
            font-family: monospace;
            font-size: 1.5rem;
        }
    }

    &__loading {

        @include placeAbsolute(1rem, .5rem, false, true);
        width: 50%;


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
            box-sizing: border-box
        }

        #loadingBarCaption {
            color: white;
            margin: 0;
        }
    }


}

.about {
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: rgba($color: #000000, $alpha: .5);
    box-sizing: border-box;
    padding: 5%;
    left: 0;
    top: 0;
    margin: 0;

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
    }

    &__sub-heading {
        margin: .75rem 0 0 0;
        font-size: 1.1rem;
        font-weight: 700;
    }

    &__text {
        margin: 0 0 .25rem 0;
        line-height: 1.1rem;

    }

}

</style>
