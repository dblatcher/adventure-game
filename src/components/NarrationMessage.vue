<template>
    <article v-show="show"
    @click="$emit('dismiss',$event)"
    >
        <div class="text-frame">
            <p class="line" v-for="line in narration.contents">{{line}}</p>
        </div>

         <div v-show="narration.dismissable" class="dismiss-button"><img src="../icons/window-close.svg"/></div>
    </article>
</template>

<script>
export default {
    props : ['narration'],
    computed : {
        show() { return( this.narration.contents.length > 0)}
    }
}
</script>

<style lang="scss" scoped>

@import "../modules/_material.scss";
@import "../modules/_layout.scss";

article {
    @include centerPoint();
    @include placeAbsolute(50%,50%);
    padding: .5rem;
    background-color: white;
    z-index: 200;
    border-radius: .5rem
}

.text-frame {
    padding: .5rem;
    border: 2px solid $colour-red;
    border-radius: .25rem;
    min-width: 10rem;
}
    
.line {
    @include font;
    text-align: center;
    margin: 0 0 .5rem 0;
}

.dismiss-button {
    @include btn-solid ($colour-blue);
    @include navButton(false);
    margin: .5rem auto 0 auto;
    display: flex;
}

</style>