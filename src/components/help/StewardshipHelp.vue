<template>
  <div class="container help-content">
    <div class="clearfix">
      <p><i>When applying the Scripture, be specific and be personal.</i></p>
      <hr />
      <p>To complete this activity, answer the questions as they appear. This activity focuses on four main "resources" in our life: <strong>time, money, thoughts, and relationships.</strong></p>
      <br />
      <p>The first set of questions will help you think about your life context right now. These things should be on your mind as you apply the scripture passage to your life.</p>
      <br />
      <p>The second set of questions will help you examine these areas of your life. You must make decisions as to how you prioritize and spend these resources. You will answer how the passage does or does not affect each of these areas of your life.</p>
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
