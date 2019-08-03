<template>
    <div class="file-menu" v-if="isOpen">
        <button @click="clickEmit([null,'close'])">X</button>
        <div class="file-menu__slot">
            <span class="file-menu__file-name">{{label}}</span>
            <button @click="clickEmit([0,'load'])">load</button>
            <button @click="clickEmit([0,'save'])">save</button>
            <button @click="clickEmit([0,'clear'])">clear</button>
        </div>
        <button v-if="!atTitle" @click="clickEmit([null,'restart'])">restart</button>
        <button v-if="!atTitle" @click="clickEmit([null,'quit'])">Quit to Title</button>


    </div>
</template>

<script>
export default {
    name: "FileMenu",
    props: ["isOpen","data","atTitle"],

    computed : {
        label : function() {
            return this.data.gameStatus ? `room ${this.data.roomNumber}` : 'empty';
        }
    },

    methods : {
        clickEmit(event) {
            this.$emit('click:happen',event);
        }
    },
}
</script>

<style lang="scss" scoped>

.file-menu {
    position: fixed;
    left:50%;
    top:50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 30000;
    background-color: bisque;
    padding: 1rem;
    display: flex;
    flex-flow: column nowrap;

    &__slot {
        display: flex;
    }

}

</style>

