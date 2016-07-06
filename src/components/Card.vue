<template>
  <div class="card">
    <div class="card-header clearfix">
      <div class="card-title pull-left">{{ title }}</div>
      <div class="card-subtitle">{{ subtitle }}</div>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: ['title', 'subtitle'],
  vuex: {
    actions: {
    }
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';
.card {
  background-color: @color-back-raised;
  box-shadow: @shadow;
  margin-bottom: 20px;
}
.card-header {
  background-color: @color-callout;
  font-family: serif;
  border-bottom: solid 1px @color-border;
  .card-title {
    color: #ffeacc;
    border-right: solid 1px @color-border;
    padding: 10px;
    font-family: 'Alegreya', serif;
    font-size: 18px;
    letter-spacing: 2px;
    margin-right: 15px;
  }
  .card-subtitle {
    color: #fff;
    font-family: 'Alegreya', serif;
    font-size: 18px;
    padding: 10px;
  }
}
.card-content {
  padding: 10px;
}
</style>
