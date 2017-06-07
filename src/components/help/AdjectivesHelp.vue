<template>
  <div class="container">
    <div>
      <strong>What is <i>described</i> in this passage?</strong>
      <br />
      Select adjectives or descriptive phrases to better understand the details of the text.
    </div>
    <hr />
    <p><strong><span class="step-label">Step 1</span> Select adjectives</strong></p>
    <hr />
    <div>
      <p>Tap a word to <span class="word-highlight">highlight</span> it.</p>
      <p><strong>Swipe <i class="fa fa-arrow-circle-right"/> right</strong> or <strong><i class="fa fa-arrow-circle-up"/> up</strong> to extend your highlight</p>
      <p><strong>Swipe <i class="fa fa-arrow-circle-left"/> left</strong> or <strong><i class="fa fa-arrow-circle-down"/> down</strong> to lessen your highlight</p>
      <p><strong><i class="fa fa-hand-o-down"/> Tap once</strong> to complete your selection.</p>
      <p><strong><i class="fa fa-hand-o-down"/> <i class="fa fa-hand-o-down"/> Tap twice</strong> to delete your selection.</p>
      <br />
      <p>Click <span class="btn btn-primary help-action">NEXT</span> to move on to Step 2</p>
    </div>
    <hr />
    <p><strong><span class="step-label">Step 2</span> Add detail to adjectives (optional)</strong></p>
    <hr />
    <div>
       In the same way as you selected each adjective, optionally select the target of each adjective (who or what the word is describing). Press <span class="btn btn-primary help-action">DONE</span> when you are finished selecting targets, or to skip this step.
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: { },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
.step-label {
  background-color: @color-help;
  padding: 4px 8px;
  border-radius: 4px;
  color: @color-text;
}
.word-highlight {
  background-color: @color-highlight-blue;
  padding: 3px 5px;
  border-radius: 3px;
}
.help-action {
  padding: 2px 5px;
  color: white;
}
</style>
