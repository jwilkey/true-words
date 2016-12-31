<template>
  <div class="container help-content">
    <div class="clearfix">
      <p><i>Paraphrase a passage by summarizing the text in your own words, capturing the author's main ideas.</i></p>
      <hr />
      <p>• {{ selectWord }} a verse to begin paraphrasing. Paraphrase multiple verses at once by {{ selectWordActive.toLowerCase() }} the last verse in the range you want to paraphrase.</p>
      <p>• This activity requires that you paraphrase the entire passage you are studying.</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
</style>
