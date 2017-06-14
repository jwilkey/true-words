<template>
  <div class="container">
    <div>
      <strong>What is <i>happening</i> in this passage?</strong>
    </div>
    <hr />
    <p><strong><span class="step-label">Step 1</span> Select actions</strong></p>
    <hr />
    <div>
      <p>Tap a word to <span class="word-highlight">highlight</span> it.</p>
      <p><strong>Swipe <i class="fa fa-arrow-circle-right"/> right</strong> or <strong><i class="fa fa-arrow-circle-up"/> up</strong> to extend your highlight</p>
      <p><strong>Swipe <i class="fa fa-arrow-circle-left"/> left</strong> or <strong><i class="fa fa-arrow-circle-down"/> down</strong> to lessen your highlight</p>
      <br />
      <p><strong><i class="fa fa-hand-o-down"/> Tap once</strong> to complete your selection.</p>
      <p><strong><i class="fa fa-hand-o-down"/> <i class="fa fa-hand-o-down"/> Tap twice</strong> to delete your selection.</p>
      <br />
      <p>Click <span class="btn callout-light help-action">NEXT</span> to move on to Step 2</p>
    </div>
    <br />
    <hr />
    <p><strong><span class="step-label">Step 2</span> Add detail to actions (optional)</strong></p>
    <hr />
    <div>
       Select details about an action (who or what is doing it, the result or purpose of the action, etc). Use the <span class="btn help-action-tab theme-back">buttons</span> at the bottom of the screen to select these things. Press <span class="btn callout-light help-action">DONE</span> when you are finished selecting targets, or to skip this step.
    </div>
    <br />
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
  color: white;
}
.word-highlight {
  background-color: @color-highlight-blue;
  padding: 3px 5px;
  border-radius: 3px;
}
.help-action {
  padding: 2px 5px;
}
.help-action-tab {
  padding: 1px 5px;
  margin: none;
}
</style>
