<template>
    <div class="file-menu" v-if="isOpen">
        
        <button class="close-button" @click="clickEmit([null,'close'])">X</button>
        
        <div class="row">
            <span class="file-name">{{label}}</span>
            <button @click="clickEmit([0,'load'])">load</button>
            <button @click="clickEmit([0,'save'])">save</button>
            <button @click="clickEmit([0,'clear'])">clear</button>
        </div>
        <div class="row">
            <button v-if="!atTitle" @click="clickEmit([null,'restart'])">restart</button>
            <button v-if="!atTitle" @click="clickEmit([null,'quit'])">Quit to Title</button>
        </div>
            

    </div>
</template>

<script>
export default {
    name: "FileMenu",
    props: ["isOpen","data","atTitle"],

    computed : {
        label : function() {
            return this.data.gameStatus ? `${this.data.rooms[this.data.roomNumber].name}` : 'empty';
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
    padding: 2rem 1rem;
    display: flex;
    flex-flow: column nowrap;
    min-width: 15rem;
}

.row {
    display: flex;
    margin: .25rem;
    justify-content: space-between;
}

.file-name {
   flex-basis: 10rem; 
}

.close-button {
    position: absolute;
    top:0;
    right:0;
    margin: .25rem .5rem;
}

</style>

