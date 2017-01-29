<template>
  <div>
    <router-view id="application"></router-view>
    <alert></alert>
  </div>
</template>

<script>
import Alert from './components/Alert'
export default {
  data () {
    return {
      alertCallback: undefined
    }
  },
  components: {
    Alert
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

#application {
  &.obscure {
    filter: blur(3px);
  }
}
</style>
