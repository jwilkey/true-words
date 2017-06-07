<template>
  <div class="clearfix">
    <div class="text-input-titlebar clearfix">
      <div class="text-input-title">
        {{ title }}
      </div>
      <div class="text-input-done">
        <button class="btn btn-primary pull-right" @click="donePressed()">DONE</button>
      </div>
    </div>
    <div id="text-input" class="text-input" contenteditable="true">
    </div>
  </div>
</template>

<script>
export default {
  components: { },
  props: ['title', 'done'],
  methods: {
    donePressed () {
      this.done(document.getElementById('text-input').textContent)
      document.getElementById('text-input').textContent = ''
    },
    focus (optionalText) {
      document.getElementById('text-input').textContent = optionalText
      document.getElementById('text-input').focus()
    }
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';
.text-input-titlebar {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: solid 1px @color-back-raised;
  display: table;
  .text-input-title {
    display: table-cell;
    width: 100%;
    vertical-align: middle;
    letter-spacing: 2px;
    color: @color-deemphasize;
  }
  .text-input-done {
    display: table-cell;
  }
}
.text-input {
  padding: 10px;
  border-bottom: solid 2px @color-back-raised2;
  &:focus {
    outline: none;
  }
}
</style>
