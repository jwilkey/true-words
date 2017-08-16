<template>
  <div class="container help-content">
    <div class="clearfix">
      <p><i>It is just you and God. Be specific and be personal.</i></p>
      <hr />
      <p>SPACE is an acronym which stands for:</p>
      <p><strong>S</strong>in to confess</p>
      <p><strong>P</strong>romise to claim</p>
      <p><strong>A</strong>ction to take</p>
      <p><strong>C</strong>ommand to obey</p>
      <p><strong>E</strong>xample to follow</p>
      <p>• Read and examine the text, relying on the Spirit to reveal each of these things to you. As you identify opportunity for application in one of these 5 areas, {{ selectWord.toLowerCase() }} the corresponding letter button in the action bar to record your thoughts.</p>
      <p>• Record as many applications for each area as you are able. {{ selectWord}} 'DONE' when you are finished.</p>
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

.help-content {
  strong {
    background-color: @color-help;
    border-radius: 4px;
    padding: 1px 7px;
    margin-right: 2px;
    color: @color-help-back;
  }
}
</style>
