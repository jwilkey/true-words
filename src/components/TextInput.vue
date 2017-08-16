<template>
  <div class="clearfix theme-mid">
    <div class="text-input-titlebar flex-row clearfix">
      <div class="flex-one text-input-title muted">{{ title }}</div>
      <button class="btn callout-light pull-right" @click="donePressed()"><i class="fa fa-check"></i></button>
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
  align-items: center;
  button {
    border-radius: 30px;
  }
}
.text-input {
  padding: 10px;
  &:focus {
    outline: none;
  }
}
</style>
