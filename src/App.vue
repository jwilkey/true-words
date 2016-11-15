<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  components: {
  },
  methods: {
  }
}
</script>

<style lang="less">
@import '../static/less/app.less';
@import '../static/less/colors.less';
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
</style>
