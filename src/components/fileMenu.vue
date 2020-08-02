<template>
    
    <aside class="fullscreen-modal" v-if="isOpen">
    <div class="file-menu">

        <div class="top-row">
            <h2 class='heading'>{{atTitle ? 'Restore saved game' : 'Saved games'}}</h2>

            <div class="close-button" 
            @click="clickEmit([null,'close'])"><img src="../icons/window-close.svg"/></div>
        </div>
        
        <div v-for="(savedGame, index) in savedGamesExcludingZero" v-bind:key="index+1"
        class="slot">
            <span class="file-name">{{label[index+1]}}</span>

            <div class="row">   
                <div class="file-menu__button file-menu__button--outline"
                    v-if="!atTitle" 
                    @click="clickEmit([index+1,'save'])">save</div>
                <div class="file-menu__button file-menu__button--outline"
                    v-if="!slotIsEmpty[index+1]" 
                    @click="clickEmit([index+1,'load'])">load</div>
                <div class="file-menu__button file-menu__button--delete"
                    v-if="!slotIsEmpty[index+1]"
                    @click="clickEmit([index+1,'clear'])">clear
                </div>
            </div>
        </div>

        <div class="bottom-row" v-if="!atTitle">
            <div class="file-menu__button file-menu__button--solid"
            @click="clickEmit([null,'quit'])">Quit to Title</div>
            
            <div class="file-menu__button file-menu__button--outline"
            @click="clickEmit([null,'restart'])">restart</div>
        </div>
            
    </div>
    </aside>

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
        },

        savedGamesExcludingZero: function () {
            return [].concat(this.data).splice(1)
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
@import "../modules/_layout.scss";


.fullscreen-modal {
    position: fixed;
    margin: 0;
    width: 100%;
    height: 100%;
    z-index: 300;
    box-sizing: border-box;
    background-color: rgba(0,0,0,0.5);
}

.file-menu {
    position: fixed;
    left:50%;
    top:50%;
    transform: translateX(-50%) translateY(-50%);
    
    min-width: 16rem;

    padding: .75rem;
    display: flex;
    flex-flow: column nowrap;
    background-color: white;

    box-shadow: $drop-shadow2;

    &__button {
        margin: 0 4px;
        display: inline-block;
        min-width: 64px;

        &--outline {
            @include btn-outline (black);
        }

        &--solid {
            @include btn-solid (black);
        }

        &--delete {
            @include btn-solid ($colour-red);
        }
    }
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

.heading {
    margin:0;
}

.close-button {
    @include btn-solid ($colour-blue);
    @include navButton(false);
    display: inline-flex;
}

</style>

