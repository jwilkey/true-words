<template>
  <titlebar title="ACTIVITY"></titlebar>
  <menubar></menubar>

  <selectable-text></selectable-text>

  <div class='col-xs-6 center-block'><button class='btn btn-primary btn-block' @click='setWords'>Set words</button></div>

  <div class="actionbar">
    <button class="btn btn-primary btn-block">NEXT</button>
  </div>
</template>

<script>
import store from '../../vuex/store'
import Titlebar from '../components/Titlebar'
import Menubar from '../components/Menubar'
import SelectableText from '../components/SelectableText'
import { setCurrentWords } from '../../vuex/actions'

export default {
  components: {
    Titlebar, Menubar, SelectableText
  },
  store,
  vuex: {
    actions: {
      setWords: setCurrentWords
    }
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';
body {
  padding-top: 55px;
}
</style>
