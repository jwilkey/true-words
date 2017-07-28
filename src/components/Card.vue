<template>
  <div class="card">
    <div class="card-header shadow flex-row">
      <div class="card-title flex-zero callout">{{ title }}</div>
      <div class="card-subtitle flex-one callout">{{ subtitle }}</div>
    </div>
    <div class="card-content shadow theme-mid">
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
@import '../../static/less/colors';
@import '../../static/less/flex';

.card {
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
  margin-bottom: 3px;
  .card-title {
    padding: 10px;
    font-size: 18px;
    letter-spacing: 2px;
    margin-right: 2px;
  }
  .card-subtitle {
    font-size: 18px;
    padding: 10px;
  }
}
</style>
