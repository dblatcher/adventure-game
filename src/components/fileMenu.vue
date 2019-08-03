<template>
    <div class="file-menu" v-if="isOpen">
        
        <button class="close-button" @click="clickEmit([null,'close'])">X</button>
        
        <div class="row"
         v-for="(savedGame, index) in data" v-bind:key="index" >
            <span class="file-name">{{label[index]}}</span>
            <button @click="clickEmit([index,'load'])">load</button>
            <button @click="clickEmit([index,'save'])">save</button>
            <button @click="clickEmit([index,'clear'])">clear</button>
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
            let labels = [];
            this.data.forEach(savedGame => {
                labels.push( savedGame.gameStatus ? 
                    savedGame.rooms[savedGame.roomNumber].name
                    : 'empty'
                );
            });

            return labels;
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
    padding: 2rem 1rem;
    display: flex;
    flex-flow: column nowrap;
    min-width: 16rem;
    background-color: white;
    border: 5px outset  gray;
    background-image: linear-gradient(0deg, black, transparent);
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.row {
    display: flex;
    margin: .25rem;
    justify-content: space-between;
}

.file-name {
   flex-basis: 10rem;
    background-color: white;
    border: 2px inset;
    margin-right: .5rem;
    padding: 0 .25rem; 
}

.close-button {
    position: absolute;
    top:0;
    right:0;
    margin: .25rem .5rem;
}

</style>

