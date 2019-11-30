<template>
    <article v-show="show"
    @click="$emit('dismiss',$event)"
    >
        <p 
        v-for="line in narration.contents"
        >{{line}}</p>
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
article {
    position: absolute;
    padding: 1rem;
    border: 1px solid red;
    background-color: white;
    z-index: 200;
}
</style>