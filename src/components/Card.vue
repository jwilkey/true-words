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
  props: ['title', 'subtitle']
}
</script>

<style lang="less">
@import '../../static/less/colors.less';
.card {
  background-color: @color-back-raised;
  box-shadow: @shadow;
  margin-bottom: 20px;
  .card-content {
    padding: 20px;
  }
  @media (max-width: 400px) {
    .card-content {
      padding: 12px;
    }
  }
  &.nopad {
    .card-content {
      padding: 0px;
    }
  }
}
.card-header {
  border-bottom: solid 1px @color-border;
  background-color: @color-callout;
  .card-title {
    color: @color-text;
    border-right: solid 1px @color-border;
    padding: 10px;
    font-size: 18px;
    letter-spacing: 2px;
    margin-right: 15px;
  }
  .card-subtitle {
    color: @color-text;
    font-size: 18px;
    padding: 10px;
  }
}
</style>
