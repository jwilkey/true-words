<template>
  <div class="clearfix theme-mid">
    <div class="text-input-titlebar clearfix">
      <div class="text-input-title muted">
        {{ title }}
      </div>
      <div class="text-input-done">
        <button class="btn callout-light pull-right" @click="donePressed()">DONE</button>
      </div>
    </div>
    <div id="text-input" class="text-input input" contenteditable="true">
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
  padding: 5px 10px;
  display: table;
  .text-input-title {
    display: table-cell;
    width: 100%;
    vertical-align: middle;
    letter-spacing: 2px;
  }
  .text-input-done {
    display: table-cell;
  }
}
.text-input {
  padding: 10px;
  &:focus {
    outline: none;
  }
}
</style>
