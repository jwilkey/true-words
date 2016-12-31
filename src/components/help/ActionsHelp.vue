<template>
  <div class="container help-content">
    <div class="clearfix">
      <span :key="index" v-for="(word, index) in words" class="word" :class="{ selected: isSelected(index), start: isStart(index), end: isEnd(index) }">{{ word }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: 'Tap a word to Select it. Tap another word to Select a phrase. Follow the steps in the action bar at the bottom of the screen, selecting a word/phrase for each step.',
      words: ['Tap', 'a', 'word', 'to', 'Select', 'it.', 'Tap', 'another', 'word', 'to', 'Select', 'a', 'phrase.', 'Follow', 'the', 'steps', 'in', 'the', 'action', 'bar', 'at', 'the', 'bottom', 'of', 'the', 'screen,', 'selecting', 'a', 'word/phrase', 'for', 'each', 'step.']
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
  background-color: @color-selection1;
  color: @color-back;
  word-wrap: normal;
  padding: 2px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 0px;
  border-right: solid 1px #ff8;
  border-left: solid 1px transparent;
  border-top: solid 1px #ff8;
  border-bottom: solid 1px #ff8;
  &.start {
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px;
    border-left: solid 1px #ff8;
  }
  &.end {
    border-bottom-right-radius: 6px;
    border-top-right-radius: 6px;
    border-right: solid 1px #ff8;
  }
}
.help-example {
  color: @color-help-secondary;
  font-style: italic;
}
</style>
