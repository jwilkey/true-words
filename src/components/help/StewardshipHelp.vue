<template>
  <div class="container help-content">
    <div class="clearfix">
      <p><i>When applying the Scripture, be specific and be personal.</i></p>
      <hr />
      <p>To complete this activity, answer the questions at the bottom of the screen.</p>
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
