<template>
  <div class="container help-content">
    <div class="clearfix">
      <p><i>When applying the Scripture, be specific and be personal.</i></p>
      <hr />
      <p>SPACE is an acronym which stands for:</p>
      <p><strong>S</strong> - Sin to confess</p>
      <p><strong>P</strong> - Promise to claim</p>
      <p><strong>A</strong> - Action to take</p>
      <p><strong>C</strong> - Command to obey</p>
      <p><strong>E</strong> - Example to follow</p>
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
</style>
