<template>
  <aside v-bind:style="pageStyle || {}">
      <button @click="finishTyping">exit</button>
      <div>
        <p v-for="(line,index) in linesOnScreen" v-bind:key="index" v-bind:style="inkStyle || {}">
            &nbsp;{{line}}
        </p>
      <SfxPlayer ref='sfx' v-bind="{audioPosition}"/>
      </div>
  </aside>
</template>

<script>
import SfxPlayer from '../../../src/components/SfxPlayer'
export default {
    props: ['textLines', 'pageStyle', 'inkStyle'],
    components: {SfxPlayer},
    data() {
        let linesNotStarted = [...this.textLines]
        return {
            linesOnScreen: [],
            linesNotStarted, 
            lineBeingTyped: "",
            finishedTyping: false,
        }
    },

    methods: {

        addLetter: async function () {
            if (this.finishedTyping) {return false}

            if (this.lineBeingTyped == "" && this.linesNotStarted.length === 0) {
                if (!this.finishedTyping) {
                    return this.finishTyping();
                }
            }

            if (this.lineBeingTyped == "" ) {

                if (this.linesOnScreen.length > 0) {
                    await(this.$refs.sfx.play('typeEnterBell', {waitUntilFinish:true}))
                }

                this.lineBeingTyped = this.linesNotStarted.shift()
                this.linesOnScreen.push("")
                return this.addLetter()
            }

            let editedCurrentLine
            let nextLetter = this.lineBeingTyped.substring(0,1)
            this.lineBeingTyped = this.lineBeingTyped.substring(1);

            if (nextLetter == "\b") {
                await(this.$refs.sfx.play('typeTab', {waitUntilFinish:true}))
                editedCurrentLine = this.linesOnScreen[this.linesOnScreen.length-1].substring(0, this.linesOnScreen[this.linesOnScreen.length-1].length-1)
            } else {

                let effectId;
                if (nextLetter === " ") {
                    effectId = 'typeSpace'
                } else {
                    effectId = Math.random() > .5 ? 'typeKey' : 'typeNum'
                }

                await( this.$refs.sfx.play(effectId, {waitUntilFinish:true}))
                editedCurrentLine = this.linesOnScreen[this.linesOnScreen.length-1] + nextLetter
            }

            this.linesOnScreen.pop()
            this.linesOnScreen.push(editedCurrentLine) 

            return this.addLetter()

        },
        finishTyping() {
            this.finishedTyping = true
            this.$emit('outcome',{finished:true})
        }
    },

    computed: {
        audioPosition() {
            return {
                gain: .25,
                pan: 0,
                loopSound: false
            }
        },
    },

    mounted() {
        this.addLetter()
    },

    beforeDestroy() {
        if (!this.finishedTyping) { this.finishTyping() }
    },
}
</script>

<style lang="scss" scoped>

    aside {
        position: fixed;
        top: 0;
        left: 0;
        margin: 0;
        background-color: rgba($color: white, $alpha: .75);
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 1rem;
        box-sizing: border-box;
    }

    button {
        position: absolute;
        top: 3rem;
        right: 0;
        margin: 1rem;
        font-size: 200%;
    }

    div {
        flex-basis: 100%;
    }

    p {
        color: black;
        font-family: monospace;
        

        font-size: 5vw;
        margin: 0 0 5px 0;
    }
</style>