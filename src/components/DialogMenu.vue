<template>
  <section class="dialog-menu">
    <p
      @click="clickHandler(choice)"
      class="dialog-menu__choice"
      v-for="(choice, index) in this.choices"
      :key="index"
    >{{choice.optionText}}</p>
  </section>
</template>

<script>
export default {
  name: "DialogMenu",

  props: ["choices"],

  methods: {
    buttonHandler(direction) {
      if (this.disabled) {
        return false;
      }
      if (direction === "back") {
        if (this.offset > 0) {
          this.offset--;
        }
      }
      if (direction === "forward") {
        if (this.offset < this.items.length - this.maxVisible) {
          this.offset++;
        }
      }
    },
    clickHandler(choice) {
      this.$emit("dialog-choice", choice);
    },
  },
};
</script>

<style lang="scss">
.dialog-menu {
  position: fixed;
  bottom: 0;
  height: 8rem;
  width: 100%;
  z-index: 150;

  padding: 0.5rem;
  box-sizing: border-box;

  overflow-y: auto;
  background-color: black;

  &__choice {
    color: white;
    transition: color 0.25s;
    cursor: pointer;
    margin-block-start: 0.25em;
    margin-block-end: 0.25em;

    &:hover {
      color: red;
    }
  }
}
</style>


