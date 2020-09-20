<template>
  <section class="command-line" v-bind:class="{
         disabled:disabled
    }">
    <p v-show="!lastCommand.inProgress" class="command-line__sentence">
      {{choosenText}}
      <span class="command-line__last-phrase">{{possibleText}}</span>
    </p>
    <p
      v-show="lastCommand.inProgress"
      class="command-line__sentence command-line__sentence--in-progress"
    >{{commandInProgessText}}</p>
  </section>
</template>

<script>
function describe(thing) {
  return thing.quantified && thing.quantity !== 1
    ? thing.quantity + " " + thing.pluralName
    : thing.name;
}

export default {
  name: "CommandLine",

  props: [
    "needObject",
    "disabled",
    "verb",
    "subject",
    "object",
    "thingHoveredOn",
    "lastCommand",
  ],

  computed: {
    choosenText: function () {
      var sentence = this.verb.description + " ";
      if (this.subject) {
        sentence += describe(this.subject) + " ";
        if (this.needObject) {
          sentence += this.verb.preposition + " ";
        }
      }
      if (this.object) {
        sentence += describe(this.object);
      }

      return sentence;
    },
    possibleText: function () {
      return this.thingHoveredOn ? describe(this.thingHoveredOn) : "";
    },
    commandInProgessText: function () {
      const { verb, subject, object, inProgress } = this.lastCommand;
      if (!inProgress) {
        return "";
      }
      let sentence = verb.description + " ";
      if (subject) {
        sentence += describe(subject) + " ";
      }
      if (object) {
        sentence += verb.preposition + " ";
        sentence += describe(object);
      }
      return sentence;
    },
  },
};
</script>

<style lang="scss">
.command-line {
  margin: 0 0.25rem 0.25rem;
  background-color: black;
  display: flex;
  flex-wrap: wrap;
  transition: background-color 0.75s, opacity 0.75s;

  &--complete {
    background-color: yellow;
  }

  &__sentence {
    min-height: 1.2em;
    margin: 0;
    padding: 0.25rem 1rem;
    color: white;

    &--in-progress {
      color: red;
    }
  }

  &__last-phrase {
    color: yellow;
    @media (pointer: coarse) {
      display: none;
    }
    @media (hover: none) {
      display: none;
    }
  }
}
</style>
