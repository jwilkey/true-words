<template>
  <div class="container">
    <p class="subtitle">Divide the passage into sections.</p>
    <p>{{ selectWord }} a word to make it the beginning of a new section. Sections reflect the main points in the passage, or represent a change in what the passage is saying.</p>

    <p class="subtitle"><i>Optionally</i> add subpoints beneath each section title.</p>
    <p>Subpoints capture the main details that support your section title.</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      words: ['Tap', 'a', 'word', 'to', 'Select', 'the', 'beginning', 'of', 'a', 'section,', 'tap', 'another', 'word', 'to', 'Select', 'the', 'end', 'of', 'the', 'section.']
    }
  },
  components: { },
  props: [],
  computed: {
    selectWord: function () {
      return (typeof window.orientation !== 'undefined') ? 'Tap' : 'Select'
    },
    selectWordActive: function () {
      return (typeof window.orientation !== 'undefined') ? 'Tapping' : 'Selecting'
    }
  },
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
.subtitle {
  margin-top: 10px;
  font-weight: bold;
  border-bottom: solid 1px @color-help-secondary;
}
.help-example {
  color: @color-help-secondary;
  font-style: italic;
}
</style>
