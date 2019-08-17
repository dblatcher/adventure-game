<template>
    <div class="file-menu" v-if="isOpen">

        <div class="top-row">
            <h2 class='heading'>{{atTitle ? 'Restore saved game' : 'Saved games'}}</h2>

            <div class="btn-solid-black btn-round" 
            @click="clickEmit([null,'close'])">X</div>
        </div>
        
        <div v-for="(savedGame, index) in data" v-bind:key="index"
        class="slot">
            <span class="file-name">{{label[index]}}</span>

            <div class="row">   
                <div class="btn-outline-black btn-inline"
                    v-if="!atTitle" 
                    @click="clickEmit([index,'save'])">save</div>
                <div class="btn-outline-black btn-inline"
                    v-if="!slotIsEmpty[index]" 
                    @click="clickEmit([index,'load'])">load</div>
                <div class="btn-solid-red btn-inline"
                    v-if="!slotIsEmpty[index]"
                    @click="clickEmit([index,'clear'])">clear
                </div>
            </div>
        </div>

        <div class="bottom-row" v-if="!atTitle">
            <div class="btn-solid-black btn-inline"
            @click="clickEmit([null,'quit'])">Quit to Title</div>
            
            <div class="btn-outline-black btn-inline"
            @click="clickEmit([null,'restart'])">restart</div>
        </div>
            
    </div>
</template>

<script>
export default {
    name: "FileMenu",
    props: ["isOpen","data","atTitle"],

    computed : {
        slotIsEmpty : function() {
            let values = [];
            this.data.forEach(savedGame => {
                values.push (!savedGame.gameStatus);
            });

            return values;
        },

        label : function() {
            let labels = [];
            this.data.forEach(savedGame => {
                labels.push( savedGame.gameStatus ? 
                    savedGame.rooms[savedGame.roomNumber].name
                    : '-empty-'
                );
            });

            return labels;
        }
    },

    methods : {
        clickEmit(event) {
            this.$emit('file-menu-click',event);
        }
    },
}
</script>


<style lang="scss" scoped>
@import "../modules/_material.scss";

.file-menu {
    @include font;
    position: fixed;
    left:50%;
    top:50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 30000;
    min-width: 16rem;

    padding: 2rem 1rem 1rem 1rem;
    display: flex;
    flex-flow: column nowrap;
    background-color: white;

    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);

    
}

@mixin row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.row {
    @include row;
    flex-direction: row-reverse;
}

.top-row {
    @include row;
    position: absolute;
    margin: 0;
    padding: 0 .25rem;
    top:0;
    left:0;
    width: 100%;
    box-sizing: border-box;
    height: 2rem;
}

.bottom-row {
    @include row;
    margin: .25rem 0;
    justify-content: space-around;
}

.slot {
    border-bottom: 1px solid black;
    padding: 0 0 .2rem .0;
    
    .file-name {
        margin: 0 auto;
        text-align: center;
        width: 100%;
        display: inline-block;
    }

}


</style>

