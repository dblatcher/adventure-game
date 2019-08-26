<template>
    <main class="title-page">
        
        <div class=title-page__info>[usual legal disclaimer]</div>
        <div class="title-page__text">
            <h1 class="title-page__title">
                <span class="title-page__l">S</span>teamed 
                <span class="title-page__l">H</span>ams
            </h1>
            <p class="title-page__subtitle">But it's a point and click adventure game</p>
        </div>
      
        <div class="title-page__button-set">
            <slot></slot>
        </div>
    </main>
</template>

<script>



export default {
    name: "TitleScreen",
}
</script>

<style scoped="true" lang="scss">

@mixin placeByCenter($x,$y) {
    position: absolute;
    transform-origin: center;
    transform: translateX(-50%) translateY(-50%);
    left: $x;
    top: $y;
    margin: 0;
}

.title-page {


    background: 
    url(./title-skinner.png) top left no-repeat,
    url(./title-chalmers.png) bottom right no-repeat,
    linear-gradient(-15deg,tan 20%, darkgreen 80%,)
    ;

    box-sizing: border-box;
    top:0;
    left:0;
    
    width: 100%;
    height: 100vh;


    &__text {
        @include placeByCenter(50%,50%);
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
        @include placeByCenter(80%, 10%);

        button {
            display:block;
            margin: .5rem;
            min-width: 8rem;
            font-family: monospace;
            font-size: 1.5rem;
        }
    }

    &__info {
       position: absolute;
       margin: 0;
       left: 5px;
       bottom: 5px;
    }
}

</style>
