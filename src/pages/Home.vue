<template>
  <titlebar title="TRUE WORDS"></titlebar>
  <div class="container">
    <card title="BEGIN" subtitle="Choose a Bible text to study">
      <div class="row clearfix">
        <a class="col-xs-6 text-center border-right" v-link="'choosepassage?t=ot'">Old Testament</a>
        <a class="col-xs-6 text-center" v-link="'choosepassage?t=nt'">New Testament</a>
      </div>
    </card>

    <card title="CONTINUE" subtitle="Choose a study">
      <p v-for="study in studies">{{ study.passage.description() }}</p>
      Ephesians 1:1-7
    </card>
  </div>
</template>

<script>
import Titlebar from '../components/Titlebar'
import store from '../../vuex/store'
import Card from '../components/Card'
import { getStudies } from '../../vuex/getters'

export default {
  data () {
    return {
      studies: this.getStudies
    }
  },
  components: {
    Card, Titlebar
  },
  store,
  vuex: {
    getters: {
      getStudies
    }
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';
</style>
