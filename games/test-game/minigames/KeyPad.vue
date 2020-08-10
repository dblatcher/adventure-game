<template>

    <div class="overlay">
        <article>
            <button @click="exitButton">exit</button>
            <p>This is a minigame</p>
        </article>
    </div>
</template>

<script>
export default {
    methods: {
        exitButton() {
            this.$emit('cancel')
        }
    },
}
</script>

<style lang="scss" scoped>

    .overlay {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    article {
        background-color: blueviolet;
        border: 5px outset;
        width: 10rem;
        height: 5rem;
    }

</style>