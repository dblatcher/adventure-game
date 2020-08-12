<template>

    <div class="overlay">
        <article class="keypad">
            <button @click="exitButton">exit</button>

            <div v-bind:class="{
                'keypad__light': true,
                'keypad__light--red': answerRight===false,
                'keypad__light--green': answerRight===true,
            }"></div>

            <p class="keypad__display">{{userInput}}</p>

            <div class="keypad__button-holder">
                <div @click="()=>{numberKeyHandle(1)}" class="keypad__button">1</div>
                <div @click="()=>{numberKeyHandle(2)}" class="keypad__button">2</div>
                <div @click="()=>{numberKeyHandle(3)}" class="keypad__button">3</div>
                <div @click="()=>{numberKeyHandle(4)}" class="keypad__button">4</div>
                <div @click="()=>{numberKeyHandle(5)}" class="keypad__button">5</div>
                <div @click="()=>{numberKeyHandle(6)}" class="keypad__button">6</div>
                <div @click="()=>{numberKeyHandle(7)}" class="keypad__button">7</div>
                <div @click="()=>{numberKeyHandle(8)}" class="keypad__button">8</div>
                <div @click="()=>{numberKeyHandle(9)}" class="keypad__button">9</div>
                <div @click="deleteKeyHandle" class="keypad__button">DEL</div>
                <div @click="enterKeyHandle" class="keypad__button keypad__button--enter">ENT</div>
            </div>
        </article>
    </div>
</template>

<script>
export default {

    data() {
        return {
            userInput: "",
            answer: "8811",
            answerRight: undefined,
        }
    },

    methods: {
        exitButton() {
            this.$emit('cancel')
        },
        deleteKeyHandle(){
            if (this.userInput.length === 0) {return}
            this.userInput = this.userInput.slice(0, this.userInput.length - 1)
        },
        enterKeyHandle(){
            if (this.userInput != this.answer) {
                this.answerRight = false
                this.userInput = ""
            } else {
                this.answerRight = true
            }
        },
        numberKeyHandle(number) {
            this.userInput += number.toString()
            this.answerRight = undefined
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

    .keypad {
        background-color: blueviolet;
        border: 5px outset;
        width: 10rem;
        position: relative;

        &__display {
            background-color: black;
            width: 8rem;
            color: yellowgreen;
            min-height: 1rem;
            font-family: monospace;
        }

        &__button-holder {
            display: flex;
            flex-flow: wrap;
            width: 8rem;
            padding: .25rem;
            border: 1px solid gray;
            background-color: lightgray;
            box-sizing: border-box;
            justify-content: space-between;
        }

        &__button {
            border: 2px outset;
            display: inline-block;
            width: 25%;
            height: 2rem;
            display: inline-flex;
            justify-content: center;
            font-family: sans-serif;
            margin-bottom: 10px;

            &--enter {
                width: 60%;
            }
        }

        &__light {
            display: inline-block;
            min-width: 1rem;
            min-height: 1rem;
            border-radius: 50%;
            border: 2px outset;
            background-color: orange;
            margin: .5rem;
            position: absolute;
            right: 0;
            top: 0;

            &--green {
                background-color: green;
            }
            &--red {
                background-color: red;
            }
        }
    }

</style>