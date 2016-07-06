<template>
  <router-view transition="fade" transition-mode="out-in"></router-view>
</template>

<script>
import store from '../vuex/store'

export default {
  components: {
  },
  methods: {
  },
  store,
  vuex: {
    actions: {
    }
  }
}
</script>

<style lang="less">
@import '../static/less/app.less';
@import '../static/less/colors.less';
.fade-transition {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave {
  opacity: 0;
}
</style>
