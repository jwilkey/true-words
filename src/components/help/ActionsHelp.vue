<template>
  <div class="container">
    <div>
      <strong>What is <i>happening</i> in this passage?</strong>
      <br />
      Select action words or phrases to gain a better understanding of important activity in the text.
      <hr />
    </div>
    <div class="actions-help-selectable clearfix">
      <span :key="index" v-for="(word, index) in words" class="word" :class="{ selected: isSelected(index), start: isStart(index), end: isEnd(index) }">{{ word }}</span>
    </div>
    <div>
      To move on to the next action, press the 'DONE' button that appears in the bottom bar after adding an action.
    </div>
    <hr />
    <strong>Optional:</strong>
    <div>
      Once you have added a new action you have the option of specifying further details about that action (who or what is doing it, the result or purpose of the action, etc). Use the buttons at the bottom of the screen to select these things.
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: 'Tap a word to Select it. Tap another word to Select a phrase.',
      words: ['Tap', 'a', 'word', 'to', 'Select', 'it.', 'Tap', 'another', 'word', 'to', 'Select', 'a', 'phrase', '.', 'Once', 'you', 'have', 'an', 'action', 'word/phrase', 'selected', 'press', 'the', 'ADD', 'button']
    }
  },
  components: { },
  props: [],
  computed: { },
  methods: {
    isSelected: function (index) {
      return [4, 10, 11, 12].indexOf(index) !== -1
    },
    isStart: function (index) {
      return index === 10
    },
    isEnd: function (index) {
      return index === 12
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
.word {
  float: left;
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 2px;
  padding-left: 1px;
  padding-right: 1px;
  border: solid 1px transparent;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.word.selected {
  background-color: @color-highlight-blue;
  color: @color-back;
  word-wrap: normal;
  padding: 2px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 0px;
  border-right: solid 1px @color-back-raised2;
  border-left: solid 1px @color-back-raised2;
  border-top: solid 1px @color-back-raised2;
  border-bottom: solid 1px @color-back-raised2;
  &.start {
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px;
    border-left: solid 1px @color-back-raised2;
  }
  &.end {
    border-bottom-right-radius: 6px;
    border-top-right-radius: 6px;
    border-right: solid 1px @color-back-raised2;
  }
}
.help-example {
  color: @color-help-secondary;
  font-style: italic;
}
.actions-help-selectable {
  background-color: white;
  padding: 5px;
  border-radius: 4px;
  box-shadow: 1px 1px 1px @color-deemphasize;
  margin-left: -5px;
  margin-right: -5px;
  margin-bottom: 8px;
}
</style>
